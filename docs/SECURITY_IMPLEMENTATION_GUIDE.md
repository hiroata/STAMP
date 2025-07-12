# セキュリティ実装ガイド

## 概要

このドキュメントは、ワールドスタンプ広島の管理システムのセキュリティ実装に関するガイドラインです。

## 現在の実装（デモ用）

### ログイン情報

- **ユーザー名**: admin
- **パスワード**: Admin@2024

**重要**: これはデモ用の実装です。本番環境では以下のセキュリティ対策を必ず実装してください。

## 本番環境での必須実装事項

### 1. サーバーサイド認証

```javascript
// Node.js/Express の例
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// パスワードハッシュ化
async function hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

// ログインエンドポイント
app.post('/api/auth/login', async (req, res) => {
    const { username, password, csrfToken } = req.body;

    // CSRF検証
    if (!validateCSRFToken(csrfToken)) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    // レート制限チェック
    if (isRateLimited(req.ip)) {
        return res.status(429).json({ error: 'Too many attempts' });
    }

    // ユーザー認証
    const user = await db.findUser(username);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        recordFailedAttempt(req.ip);
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // JWTトークン生成
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '30m'
    });

    res.json({ success: true, token });
});
```

### 2. データベース設計

```sql
-- ユーザーテーブル
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    failed_attempts INT DEFAULT 0,
    locked_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- セッションテーブル
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 監査ログテーブル
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. セキュリティ対策

#### 3.1 パスワードポリシー

- 最小12文字
- 大文字・小文字・数字・特殊文字を含む
- 過去のパスワードの再利用禁止
- 定期的な変更要求（90日ごと）

#### 3.2 多要素認証（MFA）

```javascript
// TOTP実装例
const speakeasy = require('speakeasy');

// シークレット生成
const secret = speakeasy.generateSecret({
    name: 'ワールドスタンプ広島',
    length: 32
});

// QRコード生成
const qrCode = await QRCode.toDataURL(secret.otpauth_url);

// トークン検証
const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token: userToken,
    window: 2
});
```

#### 3.3 セッション管理

- セキュアなセッションID生成
- HTTPOnlyクッキー使用
- Secure フラグ設定（HTTPS環境）
- SameSite属性設定
- セッションタイムアウト（30分）
- 同時セッション数制限

#### 3.4 HTTPS必須

```nginx
# Nginx設定例
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

#### 3.5 セキュリティヘッダー

```javascript
// Express用セキュリティミドルウェア
const helmet = require('helmet');

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:']
            }
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }
    })
);
```

### 4. 監視とログ

#### 4.1 ログ収集

- すべての認証試行
- 管理操作
- エラーと例外
- 不審なアクティビティ

#### 4.2 アラート設定

- 連続したログイン失敗
- 異常なアクセスパターン
- 権限昇格の試み
- 大量データのエクスポート

### 5. 定期的なセキュリティ対策

1. **脆弱性スキャン**（週次）
2. **依存関係の更新**（月次）
3. **セキュリティ監査**（四半期）
4. **ペネトレーションテスト**（年次）
5. **バックアップテスト**（月次）

### 6. インシデント対応計画

1. **検知**: 異常の早期発見
2. **封じ込め**: 被害の拡大防止
3. **根絶**: 脅威の完全除去
4. **復旧**: システムの正常化
5. **事後分析**: 再発防止策の実施

## 実装チェックリスト

- [ ] サーバーサイド認証の実装
- [ ] データベースの適切な設計
- [ ] パスワードの安全な保存（bcrypt/scrypt）
- [ ] HTTPS の強制
- [ ] セキュリティヘッダーの設定
- [ ] CSRF対策の実装
- [ ] XSS対策の実装
- [ ] SQLインジェクション対策
- [ ] レート制限の実装
- [ ] 監査ログの実装
- [ ] 定期的なセキュリティ更新
- [ ] インシデント対応計画の策定

## 連絡先

セキュリティに関する質問や懸念事項がある場合は、システム管理者に連絡してください。

---

**最終更新日**: 2024年1月
