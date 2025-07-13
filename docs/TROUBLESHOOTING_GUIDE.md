# トラブルシューティングガイド

ワールドスタンプ広島ECサイトでよく発生する問題と解決方法をまとめたガイドです。

## 🔧 一般的な問題

### 1. サイトが表示されない

#### 症状
- ブラウザで白い画面が表示される
- "接続できません"エラーが表示される
- 無限ローディングが続く

#### 原因と解決方法

**原因1: Firebase設定エラー**
```javascript
// firebase-config.js の設定確認
const firebaseConfig = {
    apiKey: "正しいAPIキー",
    authDomain: "project-id.firebaseapp.com",
    databaseURL: "https://project-id-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "project-id",
    storageBucket: "project-id.appspot.com",
    // 必要な設定がすべて含まれているか確認
};
```

**確認手順:**
1. Firebase Console > プロジェクトの設定 > アプリ
2. 設定値をコピーして `firebase-config.js` と比較
3. 間違いがあれば修正

**原因2: JavaScript エラー**
```bash
# 開発者ツールでエラー確認
F12 → Console タブ → エラーメッセージ確認
```

**確認手順:**
1. ブラウザで F12 キー押下
2. Console タブでエラーメッセージ確認
3. Network タブでファイル読み込みエラー確認

**原因3: ネットワーク問題**
```bash
# 接続テスト
ping firebase.google.com
curl -I https://your-project-id.web.app
```

### 2. 商品が表示されない

#### 症状
- 商品一覧が空白
- "商品が見つかりません" が表示される
- 一部の商品のみ表示される

#### 原因と解決方法

**原因1: Firebaseデータベース接続問題**

```javascript
// データベース接続確認
import { ref, get } from "firebase/database";

async function checkDatabaseConnection() {
    try {
        const snapshot = await get(ref(database, 'products'));
        if (snapshot.exists()) {
            console.log("データベース接続OK:", snapshot.val());
        } else {
            console.log("商品データが存在しません");
        }
    } catch (error) {
        console.error("データベース接続エラー:", error);
    }
}
```

**確認手順:**
1. Firebase Console > Realtime Database でデータ確認
2. セキュリティルールの読み取り権限確認
3. ネットワークタブでAPI呼び出し確認

**原因2: セキュリティルール問題**

```json
// database.rules.json - 読み取り権限確認
{
  "rules": {
    "products": {
      ".read": true,  // ← これがfalseになっていないか確認
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    }
  }
}
```

**原因3: データ形式エラー**

```javascript
// 正しいデータ形式例
{
  "products": {
    "product_001": {
      "title": "記念切手",
      "price": 1000,
      "category": "commemorative",
      "imageUrl": "https://...",
      "description": "説明文"
    }
  }
}
```

## 🔐 認証・管理画面の問題

### 1. 管理画面にログインできない

#### 症状
- ログインボタンを押しても反応しない
- "認証に失敗しました"エラー
- ログイン後にリダイレクトされない

#### 原因と解決方法

**原因1: Firebase Authentication設定**

```bash
# Firebase Console 確認手順
1. Authentication > Settings
2. Sign-in method > Email/Password が有効か確認
3. Users でユーザーが作成されているか確認
```

**原因2: 管理者権限がない**

```javascript
// 管理者権限確認
// Firebase Console > Realtime Database
{
  "admins": {
    "ユーザーのUID": true  // ← これが設定されているか確認
  }
}
```

**確認手順:**
1. Firebase Console > Authentication > Users でUIDコピー
2. Realtime Database > `admins/[UID]` に `true` を設定

**原因3: ブラウザのセキュリティ設定**

```javascript
// LocalStorage 確認
localStorage.clear(); // キャッシュクリア
sessionStorage.clear(); // セッションクリア

// Cookieの確認
document.cookie = ""; // Cookie クリア
```

### 2. 商品の登録・編集ができない

#### 症状
- 登録ボタンを押してもエラー
- 画像がアップロードできない
- データが保存されない

#### 原因と解決方法

**原因1: セキュリティルール（書き込み権限）**

```json
// database.rules.json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    }
  }
}
```

**原因2: 認証状態の確認**

```javascript
// 認証状態確認
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("ログイン中:", user.uid);
        // 管理者権限確認
        checkAdminStatus(user.uid);
    } else {
        console.log("未ログイン");
    }
});

async function checkAdminStatus(uid) {
    const adminRef = ref(database, `admins/${uid}`);
    const snapshot = await get(adminRef);
    console.log("管理者権限:", snapshot.val());
}
```

**原因3: 必須フィールドの検証**

```javascript
// 商品データ検証
function validateProduct(product) {
    const required = ['title', 'price', 'category'];
    for (const field of required) {
        if (!product[field]) {
            throw new Error(`${field} は必須項目です`);
        }
    }
}
```

## 📁 画像アップロードの問題

### 1. 画像がアップロードできない

#### 症状
- ドラッグ&ドロップが反応しない
- アップロード中にエラー
- 画像が表示されない

#### 原因と解決方法

**原因1: Firebase Storage設定**

```javascript
// storage.rules - 書き込み権限確認
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;  // ← 認証必須
    }
  }
}
```

**原因2: ファイルサイズ制限**

```javascript
// ファイルサイズチェック
function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        throw new Error('ファイルサイズは10MB以下にしてください');
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('対応していないファイル形式です');
    }
}
```

**原因3: CORS設定**

```bash
# Storage CORS設定確認
gsutil cors get gs://your-project.appspot.com

# 設定が不正な場合
gsutil cors set cors.json gs://your-project.appspot.com
```

```json
// cors.json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

### 2. アップロード後に画像が表示されない

#### 症状
- アップロード成功したが画像が見えない
- 壊れた画像アイコンが表示される
- 一部のブラウザでのみ表示されない

#### 原因と解決方法

**原因1: URL生成エラー**

```javascript
// 正しいダウンロードURL取得
import { getDownloadURL } from "firebase/storage";

async function getImageUrl(imagePath) {
    try {
        const url = await getDownloadURL(ref(storage, imagePath));
        console.log("画像URL:", url);
        return url;
    } catch (error) {
        console.error("URL取得エラー:", error);
        return '/images/placeholder.jpg'; // フォールバック
    }
}
```

**原因2: キャッシュ問題**

```javascript
// 画像キャッシュ回避
function addCacheBuster(url) {
    return `${url}?t=${Date.now()}`;
}

// ブラウザキャッシュクリア
if ('caches' in window) {
    caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
    });
}
```

## 🌐 デプロイメントの問題

### 1. Firebase デプロイエラー

#### 症状
- `firebase deploy` が失敗する
- 権限エラーが発生
- タイムアウトエラー

#### 原因と解決方法

**原因1: Firebase CLI設定**

```bash
# Firebase CLI確認・修正
firebase --version  # バージョン確認
npm update -g firebase-tools  # 最新版に更新

# 再認証
firebase logout
firebase login

# プロジェクト設定確認
firebase projects:list
firebase use project-id
```

**原因2: 権限問題**

```bash
# サービスアカウント確認
firebase projects:addfirebase project-id

# 権限確認
firebase auth:list
```

**原因3: ファイルサイズ問題**

```bash
# 大きなファイルを除外
# firebase.json の ignore セクション確認
{
  "hosting": {
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "backup/**",
      "docs/**",
      "*.log"
    ]
  }
}
```

### 2. デプロイ後にサイトが表示されない

#### 症状
- デプロイ成功したが404エラー
- 古いバージョンが表示される
- 一部のページが見つからない

#### 原因と解決方法

**原因1: キャッシュ問題**

```bash
# Firebase Hosting キャッシュクリア
firebase hosting:disable
sleep 5
firebase hosting:enable

# ブラウザキャッシュクリア方法
# Chrome: Ctrl+Shift+R
# Firefox: Ctrl+Shift+R  
# Safari: Cmd+Shift+R
```

**原因2: ファイルパス問題**

```bash
# ファイル構成確認
ls -la public/  # または デプロイディレクトリ

# 必要ファイルが含まれているか確認
firebase hosting:log  # デプロイログ確認
```

## 🎨 CSS・デザインの問題

### 1. スタイルが適用されない

#### 症状
- Tailwind CSSが効かない
- カスタムCSSが反映されない
- モバイル表示が崩れる

#### 原因と解決方法

**原因1: CSS Build問題**

```bash
# Tailwind CSS再ビルド
npm run build:css

# 本番用CSS生成
npm run build:css:prod

# CSSファイル存在確認
ls -la css/tailwind-compiled.css
```

**原因2: CSSファイルパス**

```html
<!-- 正しいCSS読み込み -->
<link rel="stylesheet" href="css/tailwind-compiled.css?v=20250713-1">
<link rel="stylesheet" href="css/common.css">

<!-- キャッシュバスターを追加 -->
<link rel="stylesheet" href="css/common.css?v={timestamp}">
```

**原因3: CSS優先度問題**

```css
/* CSS優先度の調整 */
.specific-class {
    property: value !important; /* 最後の手段 */
}

/* より良い方法：詳細度を上げる */
.container .specific-class {
    property: value;
}
```

### 2. モバイル表示の問題

#### 症状
- モバイルでレイアウトが崩れる
- ボタンが小さすぎる
- 文字が読めない

#### 原因と解決方法

**原因1: Viewportの設定**

```html
<!-- 正しいViewport設定 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**原因2: レスポンシブブレイクポイント**

```css
/* Tailwind CSS ブレイクポイント確認 */
.class {
    @apply block;           /* デフォルト（モバイル） */
    @apply md:hidden;       /* 768px以上で非表示 */
    @apply lg:flex;         /* 1024px以上でflex */
}
```

**原因3: タッチターゲットサイズ**

```css
/* 最小タッチサイズ 48px */
.btn {
    min-height: 48px;
    min-width: 48px;
    padding: 12px 24px;
}
```

## 🔧 パフォーマンスの問題

### 1. サイトの読み込みが遅い

#### 症状
- 初回アクセスが遅い
- 画像の読み込みが遅い
- スクロールがもたつく

#### 原因と解決方法

**原因1: 画像サイズ**

```javascript
// 画像最適化
function optimizeImage(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}
```

**原因2: 不要なJavaScript**

```javascript
// 遅延読み込み
function loadModule(moduleName) {
    return import(`./modules/${moduleName}.js`)
        .then(module => module.default)
        .catch(error => console.error(`Failed to load ${moduleName}:`, error));
}

// 条件付き読み込み
if (window.innerWidth < 768) {
    loadModule('mobile-specific');
}
```

**原因3: データベースクエリ**

```javascript
// 効率的なデータ取得
import { query, orderByChild, limitToFirst } from "firebase/database";

// ページング実装
async function loadProducts(pageSize = 10, startAt = null) {
    let q = query(
        ref(database, 'products'),
        orderByChild('createdAt'),
        limitToFirst(pageSize)
    );
    
    if (startAt) {
        q = query(q, startAfter(startAt));
    }
    
    const snapshot = await get(q);
    return snapshot.val();
}
```

## 🐛 デバッグツールと確認方法

### 1. 開発者ツールの活用

```javascript
// Console でのデバッグ
console.group("Firebase 接続テスト");
console.log("Database:", database);
console.log("Storage:", storage);
console.log("Auth:", auth);
console.groupEnd();

// ネットワーク監視
window.addEventListener('online', () => console.log('オンライン'));
window.addEventListener('offline', () => console.log('オフライン'));
```

### 2. Firebase エミュレーター

```bash
# 全サービスエミュレーター起動
firebase emulators:start

# 特定サービスのみ
firebase emulators:start --only auth,database

# ポート指定
firebase emulators:start --port 8080
```

### 3. ログ収集

```javascript
// エラーログ収集
window.addEventListener('error', (event) => {
    const errorInfo = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // Firebase に送信またはローカルストレージに保存
    console.error('Global Error:', errorInfo);
});
```

## 📞 サポートとヘルプ

### 1. 問題報告時の情報

問題を報告する際は以下の情報を含めてください：

- **エラーメッセージ**: 正確なエラー文
- **再現手順**: 問題が発生する具体的な操作
- **環境情報**: ブラウザ、OS、デバイス
- **スクリーンショット**: 可能であれば画面キャプチャ
- **開発者ツールのログ**: Console、Network タブの内容

### 2. 緊急時の対応

**サイト全体がダウンした場合:**
1. Firebase Console でサービス状況確認
2. ドメイン設定確認
3. 最新のバックアップから復旧

**データが消失した場合:**
1. Firebase Console でデータ確認
2. バックアップファイルから復元
3. セキュリティルール確認

### 3. 予防策

**定期メンテナンス:**
- 毎週：エラーログ確認
- 毎月：パフォーマンス確認
- 四半期：セキュリティ監査

**監視項目:**
- サイトアクセシビリティ
- APIレスポンス時間
- エラー発生率
- セキュリティログ

---

**最終更新**: 2025年7月13日