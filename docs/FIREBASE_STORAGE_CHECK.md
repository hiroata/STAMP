# Firebase Storage 設定確認手順

## 1. Storage Rules の確認

1. Firebase Console の Storage ページで上部の「**ルール**」タブをクリック
2. 以下のルールが表示されているか確認：

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 商品画像のルール
    match /products/{imageId} {
      allow read: if true;
      allow write, delete: if request.auth != null;
    }
    
    match /temp/{imageId} {
      allow create: if request.auth != null;
      allow read: if true;
      allow delete: if request.auth != null;
    }
    
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## 2. Storage Bucket の確認（ブラウザコンソール）

1. admin.html を開く
2. ブラウザの開発者ツールを開く（F12キー）
3. コンソールタブで以下を確認：

```
Firebase initialized: true
Firebase Storage: true
Firebase Database: true
Storage bucket: stamp-e20f2.firebasestorage.app
```

## 3. テスト方法

### 方法1: test-storage.html でテスト
1. test-storage.html を開く
2. 画像ファイルを選択してアップロード
3. エラーが出ないか確認

### 方法2: コンソールで直接テスト
ブラウザのコンソールで以下を実行：

```javascript
// 認証状態の確認
firebase.auth().currentUser

// Storage の動作確認
const testRef = firebase.storage().ref('test/test.txt');
testRef.putString('Hello World').then(() => {
    console.log('アップロード成功');
}).catch((error) => {
    console.error('エラー:', error);
});
```

## 4. よくあるエラーと対処法

### エラー: Permission denied
- 原因：Storage Rules が正しくデプロイされていない
- 対処：`firebase deploy --only storage` を実行

### エラー: No bucket configured
- 原因：Storage が有効化されていない
- 対処：Firebase Console で Storage を有効化

### エラー: User is not authenticated
- 原因：ログインしていない
- 対処：admin-login.html でログインしてから admin.html にアクセス

## 5. Storage Rules を手動で更新する場合

1. Firebase Console > Storage > ルール タブ
2. ルールを編集
3. 「公開」ボタンをクリック

開発中の簡易ルール（すべて許可）：
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

**注意**: 本番環境では必ず適切なセキュリティルールを設定してください。