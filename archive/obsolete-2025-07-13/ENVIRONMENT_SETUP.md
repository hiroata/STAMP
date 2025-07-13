# 環境変数設定ガイド

## 開発環境の設定

1. `.env.example`ファイルをコピーして`.env`ファイルを作成:

```bash
cp .env.example .env
```

2. `.env`ファイルを編集して、実際のFirebase設定値を入力:

```
FIREBASE_API_KEY=あなたのAPIキー
FIREBASE_AUTH_DOMAIN=あなたのプロジェクト.firebaseapp.com
# ... 他の設定値
```

## 本番環境への適用方法

ブラウザのJavaScriptは直接環境変数を読み込めないため、以下のいずれかの方法を使用してください：

### 方法1: Webpack等のビルドツールを使用

1. Webpackとdotenv-webpackをインストール:

```bash
npm install --save-dev webpack webpack-cli dotenv-webpack
```

2. webpack.config.jsを作成:

```javascript
const Dotenv = require('dotenv-webpack');

module.exports = {
    plugins: [new Dotenv()]
};
```

### 方法2: Firebase Hostingの環境変数

Firebase Functionsを使用してサーバーサイドで設定を注入:

```bash
firebase functions:config:set firebase.api_key="YOUR_API_KEY"
```

### 方法3: ビルド時にスクリプトで置換

package.jsonにビルドスクリプトを追加:

```json
{
    "scripts": {
        "build": "node scripts/build-config.js"
    }
}
```

## セキュリティの注意事項

- `.env`ファイルは絶対にGitにコミットしないでください
- 本番環境では、Firebase Console のセキュリティルールを適切に設定してください
- APIキーが公開されても、Firebaseのセキュリティルールで保護されていれば安全です
