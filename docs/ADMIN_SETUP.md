# 本番環境での管理者アカウント設定方法

## 概要
本番環境では、セキュリティを確保するため、Firebase Console から直接管理者を設定します。

## 設定手順

### 1. Firebase Authentication でユーザーを作成

1. [Firebase Console](https://console.firebase.google.com) にログイン
2. プロジェクト「stamp-e20f2」を選択
3. 左メニューから「Authentication」をクリック
4. 「Users」タブを選択
5. 「ユーザーを追加」ボタンをクリック
6. 以下の情報を入力：
   - メールアドレス: 実際の管理者のメールアドレス（例: `admin@worldstamp-hiroshima.com`）
   - パスワード: 強力なパスワード（最低8文字、大小英数字記号を含む）
7. 「ユーザーを追加」をクリック
8. 作成されたユーザーの UID をコピー（次のステップで使用）

### 2. Realtime Database で管理者権限を付与

1. Firebase Console の左メニューから「Realtime Database」をクリック
2. 「データ」タブを選択
3. ルートノードで右クリック → 「子を追加」
4. 以下の構造でデータを追加：
   ```
   キー: admins
   値: （オブジェクトとして追加）
   ```
5. `admins` ノードで右クリック → 「子を追加」
6. 以下を入力：
   ```
   キー: [コピーしたUID]
   値: true
   ```

### 3. セキュリティルールの確認

「ルール」タブで以下のルールが設定されていることを確認：

```json
{
  "rules": {
    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      ".write": false
    }
  }
}
```

## 重要なセキュリティ対策

1. **強力なパスワード**: 最低12文字以上、複雑な組み合わせを推奨
2. **2要素認証**: Firebase Console で管理者の Google アカウントに2要素認証を設定
3. **定期的な確認**: Firebase Console で不正なログイン試行を監視
4. **権限の最小化**: 必要最小限の管理者のみに権限を付与

## 管理者の追加・削除

### 追加
上記の手順を繰り返す

### 削除
1. Firebase Console → Realtime Database
2. `admins/[UID]` を削除
3. Authentication → Users から該当ユーザーを削除（任意）

## トラブルシューティング

### ログインできない場合
1. メールアドレスとパスワードが正しいか確認
2. Firebase Console でユーザーが存在するか確認
3. Realtime Database の `admins` に UID が登録されているか確認
4. ブラウザのキャッシュをクリアして再試行

### 権限エラーが出る場合
1. セキュリティルールが正しく設定されているか確認
2. Firebase Console でプロジェクトの状態を確認
3. ネットワーク接続を確認

## 本番環境でのベストプラクティス

1. **setup-admin.html は削除**: 本番環境にデプロイする前に必ず削除
2. **環境変数の使用**: Firebase設定は環境変数で管理
3. **アクセスログの監視**: Firebase Console で定期的に確認
4. **バックアップ**: 定期的なデータベースのバックアップ