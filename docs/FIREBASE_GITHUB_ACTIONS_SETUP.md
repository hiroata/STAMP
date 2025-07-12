# Firebase Hosting 自動デプロイ設定ガイド

GitHubにプッシュすると自動的にFirebase Hostingにデプロイする設定手順です。

## セットアップ手順

### 1. Firebaseサービスアカウントの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクト「STAMP」を選択
3. 左メニューから「プロジェクトの設定」（歯車アイコン）をクリック
4. 「サービスアカウント」タブを選択
5. 「新しい秘密鍵の生成」をクリック
6. JSONファイルがダウンロードされます（重要：このファイルは安全に保管してください）

### 2. GitHub Secretsの設定

1. GitHubリポジトリ（https://github.com/hiroata/STAMP）にアクセス
2. 「Settings」タブをクリック
3. 左メニューから「Secrets and variables」→「Actions」を選択
4. 「New repository secret」をクリック
5. 以下の設定を行います：
   - Name: `FIREBASE_SERVICE_ACCOUNT_STAMP_E20F2`
   - Value: ダウンロードしたJSONファイルの内容を全てコピー＆ペースト
6. 「Add secret」をクリック

### 3. Firebase CLIトークンの生成（オプション）

より高度な設定が必要な場合：

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# ログイン
firebase login:ci
```

生成されたトークンをGitHub Secretsに追加：
- Name: `FIREBASE_TOKEN`
- Value: 生成されたトークン

### 4. 自動デプロイの動作確認

1. ローカルで変更をコミット
2. GitHubにプッシュ
   ```bash
   git add .
   git commit -m "feat: 自動デプロイ設定を追加"
   git push origin master
   ```
3. GitHubリポジトリの「Actions」タブで実行状況を確認
4. デプロイが成功すると、Firebase Hostingに自動的に反映されます

## 設定ファイルの説明

### `.github/workflows/firebase-hosting-deploy.yml`

- **trigger**: master/mainブランチへのプッシュ時に実行
- **jobs**: 
  - `build-and-deploy`: 本番環境へのデプロイ
  - `preview-deploy`: プルリクエスト時のプレビューデプロイ

### 必要なファイル

- `firebase.json`: Firebase設定ファイル
- `package.json`: プロジェクトの依存関係

## トラブルシューティング

### エラー: "Error: Failed to get Firebase project stamp-e20f2"
- Firebaseプロジェクトが正しく設定されているか確認
- サービスアカウントの権限を確認

### エラー: "npm ci can only install packages with an existing package-lock.json"
- `npm install`を実行して`package-lock.json`を生成
- 生成されたファイルをコミット

### デプロイされない
- GitHub ActionsのログをA確認
- Firebase Hostingの設定を確認
- ブランチ名が正しいか確認（master/main）

## セキュリティに関する注意事項

- サービスアカウントのJSONファイルは絶対にリポジトリにコミットしない
- GitHub Secretsは暗号化されて保存されます
- 必要最小限の権限のみを付与する

## 参考リンク

- [Firebase Hosting GitHub Action](https://github.com/FirebaseExtended/action-hosting-deploy)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)