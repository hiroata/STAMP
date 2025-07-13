# Firebase デプロイガイド

## 前提条件

- Node.js (v14以上) がインストールされていること
- Firebase CLIがインストールされていること

## Firebase CLIのインストール

```bash
npm install -g firebase-tools
```

## デプロイ手順

### 1. Firebaseにログイン

```bash
firebase login
```

### 2. プロジェクトの確認

```bash
firebase projects:list
```

現在のプロジェクト: `stamp-e20f2`

### 3. ローカルでテスト（オプション）

```bash
firebase serve
```

ブラウザで http://localhost:5000 にアクセスして動作確認

### 4. デプロイ実行

```bash
firebase deploy
```

または、ホスティングのみデプロイする場合：

```bash
firebase deploy --only hosting
```

### 5. デプロイ完了後

デプロイが成功すると、以下のURLでアクセスできます：

- https://stamp-e20f2.web.app
- https://stamp-e20f2.firebaseapp.com

## セキュリティ設定（本番環境向け）

### 1. Firebase Consoleでデータベースルールを更新

本番環境では、以下のようなルールに変更することを推奨：

```json
{
    "rules": {
        "products": {
            ".read": true,
            ".write": "auth != null && auth.uid == 'YOUR_ADMIN_UID'"
        }
    }
}
```

### 2. 環境変数の設定

本番環境では、Firebase設定を環境変数から読み込むようにすることを推奨

## トラブルシューティング

### デプロイエラーが発生した場合

1. Firebase CLIを最新版に更新

    ```bash
    npm update -g firebase-tools
    ```

2. キャッシュをクリア

    ```bash
    firebase hosting:disable
    firebase hosting:enable
    ```

3. 再度デプロイを実行

### アクセスできない場合

1. Firebase Consoleでホスティングが有効になっているか確認
2. デプロイが正常に完了しているか確認
3. ブラウザのキャッシュをクリア

## 継続的なデプロイ

### GitHub Actionsを使用する場合

`.github/workflows/firebase-hosting.yml` ファイルを作成して自動デプロイを設定できます。

詳細は[Firebase公式ドキュメント](https://firebase.google.com/docs/hosting/github-integration)を参照してください。
