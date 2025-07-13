# セキュリティガイド

## 🔐 重要なセキュリティ設定

### 1. 環境変数の管理

#### 必須設定
- `.env`ファイルは**絶対にGitにコミットしない**
- `.gitignore`に`.env`が含まれていることを確認
- 本番環境では環境変数を適切に設定

#### Firebase設定
```bash
# .envファイルの作成
cp .env.example .env

# 実際の値を設定
FIREBASE_API_KEY=実際のAPIキー
FIREBASE_AUTH_DOMAIN=実際の認証ドメイン
# ... その他の設定
```

### 2. 認証設定

#### 管理者権限
1. Firebase Authenticationでユーザーを作成
2. Realtime Databaseで管理者権限を付与：
```json
{
  "admins": {
    "ユーザーUID": true
  }
}
```

#### デモモードの無効化
**本番環境では必ず以下を実施：**
- 環境変数`DEMO_MODE=false`を設定
- デモ用の認証情報を削除
- `auth-manager.js`のデモモード関連コードを削除

### 3. データベースルール

#### 本番環境用ルール
`database.rules.json`を使用：
```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    }
  }
}
```

#### 開発環境用ルール
`database.rules.dev.json`は開発環境のみで使用

### 4. CORS設定

#### Firebase Storage
```json
[
  {
    "origin": ["https://yourdomain.com"],
    "method": ["GET", "POST"],
    "maxAgeSeconds": 3600
  }
]
```

### 5. セキュリティヘッダー

`firebase.json`で設定：
```json
{
  "headers": [
    {
      "source": "**/*",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 🚨 セキュリティチェックリスト

### デプロイ前
- [ ] `.env`ファイルがGitに含まれていない
- [ ] デモ認証情報が削除されている
- [ ] 本番用データベースルールが設定されている
- [ ] CORS設定が適切
- [ ] セキュリティヘッダーが設定されている

### 定期チェック
- [ ] Firebase認証ユーザーの監査
- [ ] アクセスログの確認
- [ ] 異常なデータアクセスパターンの確認
- [ ] 依存関係の脆弱性スキャン（`npm audit`）

## 📞 セキュリティインシデント対応

問題が発生した場合：
1. 影響範囲の特定
2. アクセスの一時停止
3. ログの保全
4. 原因調査と対策
5. 再発防止策の実施

---

最終更新: 2025年1月13日