# Firebase Storage 有効化手順

## エラー内容
Firebase Storage がプロジェクトで有効になっていません。

## 解決手順

### ステップ1: Firebase Console でStorage を有効化
1. ブラウザで以下のURLを開く：
   https://console.firebase.google.com/project/stamp-e20f2/storage

2. 「Get Started」または「始める」ボタンをクリック

3. セキュリティルールのダイアログが表示されたら：
   - 「テストモードで開始」を選択
   - 「次へ」をクリック

4. ロケーションを選択：
   - 推奨: `asia-northeast1` (東京)
   - または `asia-southeast1` (シンガポール)

5. 「完了」をクリック

### ステップ2: デプロイを再実行
Storage が有効になったら、以下のコマンドを再実行：

```bash
firebase deploy
```

### ステップ3: 動作確認
1. **test-storage.html** をブラウザで開いて画像アップロードをテスト
2. **admin.html** で商品登録時の画像アップロードをテスト

## 注意事項
- Storage の無料枠: 5GB ストレージ、1GB/日 のダウンロード
- 画像は自動的に800x800px以下にリサイズされます
- 対応形式: JPEG、PNG、WebP

## トラブルシューティング
もしStorage有効化後もエラーが出る場合：

```bash
# Storage のみデプロイ
firebase deploy --only storage

# 全体のデプロイ
firebase deploy
```