# STAMP - 切手販売ECサイト

ワールドスタンプ広島の公式ECサイトプロジェクトです。

## 🚀 クイックスタート

### 必要な環境
- Node.js v20以上
- npm v8以上
- Firebaseアカウント

### セットアップ手順

1. **依存関係のインストール**
```bash
npm install
```

2. **環境変数の設定**
`.env.example`をコピーして`.env`を作成：
```bash
cp .env.example .env
```

3. **Firebase設定**
Firebase Consoleでプロジェクトを作成し、設定情報を`firebase-config.js`に追加

4. **ローカル起動**
```bash
npm run dev
```

## 📁 プロジェクト構成

```
STAMP/
├── css/              # スタイルシート
├── js/               # JavaScriptファイル
├── pages/            # 各種ページ
├── public/           # 静的ファイル
├── scripts/          # ユーティリティスクリプト
├── docs/             # ドキュメント
└── firebase.json     # Firebase設定
```

## 🔧 主要機能

### フロントエンド
- **商品一覧・詳細表示**: 切手の閲覧と検索
- **カテゴリー分類**: 記念切手、普通切手、特殊切手等
- **レスポンシブデザイン**: モバイル完全対応

### 管理機能
- **商品管理**: 追加・編集・削除
- **画像アップロード**: Firebase Storage連携
- **バックアップ**: 自動・手動バックアップ

## 🔐 セキュリティ

### 認証
- Firebase Authentication使用
- 管理者権限の階層化
- セッション管理（30分タイムアウト）

### データ保護
- Firebase Realtime Database Rules
- 環境変数による機密情報管理
- XSS・CSRF対策実装

## 🚀 デプロイメント

### GitHub Actions（自動デプロイ）
masterブランチへのプッシュで自動的にFirebase Hostingへデプロイ

### 手動デプロイ
```bash
firebase deploy
```

## 📝 開発ガイドライン

### コーディング規約
- ES6+の使用
- Prettier/ESLintの設定に従う
- コメントは日本語で記載

### Git運用
- コミットメッセージは日本語可
- 機能開発はfeatureブランチで
- PR作成時はレビュー必須

## 🛠️ トラブルシューティング

### よくある問題

1. **管理画面にログインできない**
   - Firebaseコンソールで管理者権限を確認
   - `admins/{uid}`に`true`を設定

2. **画像がアップロードできない**
   - Firebase Storageの権限設定を確認
   - CORS設定を確認

3. **商品が表示されない**
   - Firebase Realtime Databaseの接続を確認
   - データベースルールを確認

## 📞 サポート

問題が発生した場合は、GitHubのIssuesまたは以下にお問い合わせください：
- メール: support@worldstamp-hiroshima.com
- 電話: 082-XXX-XXXX

## 📄 ライセンス

Copyright © 2024 ワールドスタンプ広島 All Rights Reserved.

---

最終更新: 2025年1月13日