# 修正完了 - 今すぐデプロイできます

## 修正内容

### 1. firebase.json に storage 設定を追加
```json
{
  "storage": {
    "rules": "storage.rules"
  }
}
```

### 2. database.rules.json の構文エラーを修正
- line 9 の `$uid` 変数参照エラーを修正
- orders ノードの読み取り権限を管理者のみに変更

## デプロイコマンド

以下のコマンドをターミナルで実行してください：

```bash
# 全体デプロイ
firebase deploy

# または個別にデプロイ
firebase deploy --only storage
firebase deploy --only database
firebase deploy --only hosting
```

## 確認事項

デプロイ後、以下を確認してください：

1. **Firebase Console > Storage**
   - Storage が有効になっている
   - Rules がデプロイされている

2. **Firebase Console > Realtime Database**
   - Rules がデプロイされている
   - データが正常に読み書きできる

3. **動作テスト**
   - test-storage.html で画像アップロードテスト
   - admin.html で商品登録テスト
   - index.html で新着商品表示確認

## エラーが発生した場合

### Storage エラーの場合
```bash
firebase deploy --only storage --debug
```

### Database エラーの場合
```bash
firebase deploy --only database --debug
```

これで画像アップロード機能とデータベース統合が完全に動作するはずです。