# キャッシュクリア手順と画像アップロード修正

## 1. ブラウザのキャッシュクリア

### Chrome の場合：
1. **Ctrl + Shift + Del** を押す
2. 「閲覧履歴データの削除」画面で：
   - 期間：「全期間」を選択
   - ✅ 閲覧履歴
   - ✅ Cookie とその他のサイトデータ
   - ✅ キャッシュされた画像とファイル
3. 「データを削除」をクリック

### または開発者ツールから：
1. **F12** で開発者ツールを開く
2. **Application** タブを選択
3. 左側の **Storage** セクションで：
   - **Local Storage** → **stamp-e20f2.web.app** → 右クリック → Clear
   - **Session Storage** → **stamp-e20f2.web.app** → 右クリック → Clear
   - **IndexedDB** → **firebase:authUser** → 削除

## 2. Firebase認証のリセット

ブラウザのコンソールで実行：
```javascript
// ログアウト
firebase.auth().signOut();

// ローカルストレージもクリア
localStorage.clear();
sessionStorage.clear();
```

## 3. 新しいログイン

1. admin-login.html にアクセス
2. 手動でログイン：
   - メール: admin@test.com
   - パスワード: admin123

## 4. アップロード問題の対処

もしまだアップロードできない場合、一時的にStorage Rulesを緩くします：

Firebase Console > Storage > ルール：
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```