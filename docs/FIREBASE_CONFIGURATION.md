# Firebase設定完全ガイド

ワールドスタンプ広島ECサイトのFirebase設定に関する包括的なガイドです。

## 📋 概要

このガイドでは以下のFirebaseサービスの設定を説明します：

- Authentication（認証）
- Realtime Database（リアルタイムデータベース）
- Storage（ストレージ）
- Hosting（ホスティング）
- GitHub Actions連携

## 🚀 Firebase プロジェクト初期設定

### 1. プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名：`stamp-hiroshima`（例）
4. Google Analytics：有効（推奨）
5. アカウント選択：デフォルトアカウント

### 2. 料金プランの設定

- **開発/テスト**: Sparkプラン（無料）で十分
- **本番運用**: Blazeプラン（従量課金）を推奨

### 3. プロジェクト設定の確認

Firebase Console > プロジェクトの設定で以下を確認：

```
プロジェクトID: stamp-hiroshima-xxxx
ウェブAPIキー: AIzaSyxxxxxxxxxxxxxxxxxxxxxx
デフォルトGCPリソースロケーション: asia-northeast1
```

## 🔐 Authentication設定

### 1. 認証の有効化

1. Firebase Console > Authentication
2. 「始める」をクリック
3. Sign-in method タブを選択

### 2. 認証プロバイダーの設定

#### メール/パスワード認証

1. 「メール/パスワード」を選択
2. 「有効にする」をオンに変更
3. 「保存」をクリック

### 3. 管理者ユーザーの作成

#### コンソールでの作成

1. Authentication > Users タブ
2. 「ユーザーを追加」をクリック
3. 管理者のメールアドレスとパスワードを入力
4. 作成されたユーザーのUIDをコピー

#### プログラムでの作成

```javascript
// admin-user-creation.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

async function createAdminUser(email, password) {
    try {
        // ユーザー作成
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        // 管理者権限付与
        await set(ref(database, `admins/${uid}`), true);
        
        console.log(`Admin user created: ${uid}`);
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
}
```

### 4. セキュリティ設定

#### パスワードポリシー

Firebase Console > Authentication > Settings：

- **パスワードの強度**: デフォルト（6文字以上）
- **アカウント復旧**: メールアドレス
- **不正使用防止**: reCAPTCHA有効

#### セッション管理

```javascript
// auth-config.js
import { connectAuthEmulator } from "firebase/auth";

// セッションタイムアウト（30分）
const sessionTimeout = 30 * 60 * 1000;

// ローカル開発時のエミュレーター
if (location.hostname === 'localhost') {
    connectAuthEmulator(auth, "http://localhost:9099");
}
```

## 🗄️ Realtime Database設定

### 1. データベース作成

1. Firebase Console > Realtime Database
2. 「データベースを作成」をクリック
3. ロケーション：`asia-southeast1`（シンガポール）
4. セキュリティルール：「テストモードで開始」

### 2. データ構造設計

```json
{
  "products": {
    "product_id_1": {
      "title": "商品名",
      "price": 1000,
      "category": "記念切手",
      "description": "商品説明",
      "imageUrl": "https://firebasestorage.googleapis.com/...",
      "sku": "STAMP001",
      "stock": 5,
      "isNew": true,
      "negotiable": false,
      "soldOut": false,
      "createdAt": "2025-07-13T10:00:00.000Z",
      "updatedAt": "2025-07-13T10:00:00.000Z"
    }
  },
  "admins": {
    "admin_uid_1": true,
    "admin_uid_2": true
  },
  "categories": {
    "commemorative": "記念切手",
    "ordinary": "普通切手",
    "special": "特殊切手"
  },
  "settings": {
    "siteTitle": "ワールドスタンプ広島",
    "maintenance": false
  }
}
```

### 3. セキュリティルール

#### 開発環境用ルール

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

#### 本番環境用ルール

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true",
      "$productId": {
        ".validate": "newData.hasChildren(['title', 'price', 'category'])"
      }
    },
    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      ".write": false
    },
    "categories": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    },
    "settings": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    },
    "backup": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    }
  }
}
```

### 4. インデックス設定

Firebase Console > Realtime Database > ルール タブで以下を追加：

```json
{
  "rules": {
    "products": {
      ".indexOn": ["category", "createdAt", "isNew", "soldOut"]
    }
  }
}
```

## 📁 Storage設定

### 1. Storage有効化

1. Firebase Console > Storage
2. 「始める」をクリック
3. セキュリティルール：「テストモードで開始」
4. ロケーション：`asia-southeast1`

### 2. フォルダ構造

```
gs://your-project.appspot.com/
├── products/
│   ├── stamps/
│   │   ├── product_1_main.jpg
│   │   ├── product_1_thumb.jpg
│   │   └── product_2_main.jpg
│   └── categories/
│       ├── commemorative.jpg
│       └── ordinary.jpg
├── backup/
│   ├── products_backup_2025-07-13.json
│   └── images_backup_2025-07-13.zip
└── temp/
    └── upload_temp_files/
```

### 3. セキュリティルール

#### 開発環境用ルール

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

#### 本番環境用ルール

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 商品画像
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // バックアップファイル
    match /backup/{allPaths=**} {
      allow read, write: if request.auth != null && 
                           exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // 一時ファイル
    match /temp/{allPaths=**} {
      allow read, write: if request.auth != null && 
                           request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

### 4. CORS設定

Storage へのブラウザからのアクセスを許可：

```bash
# cors.json を作成
echo '[
  {
    "origin": ["https://your-domain.com", "http://localhost:5000"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600
  }
]' > cors.json

# CORS設定を適用
gsutil cors set cors.json gs://your-project.appspot.com
```

## 🌐 Hosting設定

### 1. Hosting有効化

1. Firebase Console > Hosting
2. 「始める」をクリック
3. Firebase CLIの指示に従ってセットアップ

### 2. firebase.json設定

```json
{
  "hosting": {
    "public": "./",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "docs/**",
      "tests/**",
      "tools/**",
      "backup/**",
      "*.md"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=86400"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ],
    "redirects": [
      {
        "source": "/old-path/**",
        "destination": "/new-path/**",
        "type": 301
      }
    ]
  },
  "database": {
    "rules": "database.rules.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### 3. カスタムドメイン設定

1. Firebase Console > Hosting > ドメインを追加
2. カスタムドメイン入力：`www.worldstamp-hiroshima.com`
3. DNS設定：
   ```
   A レコード: @ → 151.101.1.195, 151.101.65.195
   CNAME レコード: www → your-project-id.web.app
   ```

## 🤖 GitHub Actions連携

### 1. GitHub プロジェクト設定

```bash
# Firebase プロジェクトとGitHubを連携
firebase init hosting:github
```

### 2. サービスアカウント作成

1. Google Cloud Console > IAM と管理 > サービスアカウント
2. 「サービスアカウントを作成」
3. 役割：Firebase Admin SDK 管理者サービスエージェント
4. キーを作成してJSONファイルをダウンロード

### 3. GitHub Secrets設定

```bash
# GitHub Repository Settings > Secrets and variables > Actions
FIREBASE_SERVICE_ACCOUNT: <service-account-json-content>
FIREBASE_PROJECT_ID: your-project-id
```

### 4. ワークフロー設定

`.github/workflows/firebase-hosting-merge.yml`:

```yaml
name: Deploy to Firebase Hosting on merge
on:
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:css:prod
      - run: npm test
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID }}'
```

## 🔍 動作確認とテスト

### 1. Firebase エミュレーター

```bash
# エミュレーター設定
firebase init emulators

# エミュレーター起動
firebase emulators:start

# 特定のサービスのみ
firebase emulators:start --only auth,database,storage
```

### 2. 接続テスト

```javascript
// firebase-test.js
import { connectDatabaseEmulator } from "firebase/database";
import { connectAuthEmulator } from "firebase/auth";
import { connectStorageEmulator } from "firebase/storage";

// ローカル環境での接続テスト
if (location.hostname === 'localhost') {
    connectDatabaseEmulator(database, 'localhost', 9000);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectStorageEmulator(storage, 'localhost', 9199);
}
```

### 3. 自動テスト

```bash
# Firebase テスト用設定
npm install --save-dev @firebase/rules-unit-testing

# テスト実行
npm run test:firebase
```

## ⚠️ トラブルシューティング

### よくある問題と解決方法

#### 1. 認証エラー

```bash
# Firebase CLI再認証
firebase logout
firebase login

# プロジェクト再設定
firebase use --add
```

#### 2. Database接続エラー

- ネットワーク設定確認
- セキュリティルール確認
- Firebase SDKバージョン確認

#### 3. Storage アップロードエラー

- CORS設定確認
- ファイルサイズ制限確認（10MB以下）
- 認証状態確認

#### 4. デプロイエラー

```bash
# キャッシュクリア
firebase deploy --force

# 段階的デプロイ
firebase deploy --only hosting
firebase deploy --only database
firebase deploy --only storage
```

### ログ確認方法

```bash
# Firebase プロジェクトログ
firebase projects:list
firebase use [project-id]

# リアルタイムログ
firebase database:profile
firebase functions:log --limit 50
```

## 📊 監視とメンテナンス

### 1. 使用量監視

Firebase Console > 使用量とお支払い：

- Realtime Database読み取り/書き込み回数
- Storage使用量
- Hosting帯域幅使用量
- Authentication アクティブユーザー数

### 2. パフォーマンス監視

```javascript
// performance.js
import { getPerformance, trace } from "firebase/performance";

const perf = getPerformance(app);
const productLoadTrace = trace(perf, 'product_load');

// 商品読み込み開始
productLoadTrace.start();

// 商品データ取得
await loadProducts();

// 商品読み込み完了
productLoadTrace.stop();
```

### 3. 定期メンテナンス

#### 週次
- セキュリティルール確認
- エラーログ確認
- 使用量確認

#### 月次
- バックアップの実行
- 不要ファイルの削除
- パフォーマンス分析

## 📞 サポート情報

### Firebase サポートリソース

- [Firebase ドキュメント](https://firebase.google.com/docs)
- [Firebase コミュニティ](https://firebase.google.com/support/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

### 緊急時連絡先

問題の種類に応じて適切なチャンネルに連絡：

- **認証問題**: Firebase Authentication サポート
- **データベース問題**: Firebase Realtime Database サポート
- **ストレージ問題**: Firebase Storage サポート
- **請求問題**: Google Cloud Billing サポート

---

**最終更新**: 2025年7月13日