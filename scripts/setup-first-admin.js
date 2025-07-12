/**
 * 初回管理者設定スクリプト
 *
 * 使用方法:
 * 1. Node.jsをインストール
 * 2. npm install firebase-admin
 * 3. Firebase Consoleからサービスアカウントキーをダウンロード
 * 4. node setup-first-admin.js を実行
 */

// 環境変数から設定を読み込む場合
require('dotenv').config();

const admin = require('firebase-admin');

// サービスアカウントキーのパス
const serviceAccount = require('./serviceAccountKey.json');

// Firebase Admin SDKの初期化
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
        process.env.FIREBASE_DATABASE_URL ||
        'https://stamp-e20f2-default-rtdb.asia-southeast1.firebasedatabase.app'
});

// 初回管理者を作成
async function createFirstAdmin(email, password) {
    try {
        console.log('管理者アカウントを作成中...');

        // ユーザーを作成
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            emailVerified: true
        });

        console.log('ユーザーを作成しました:', userRecord.uid);

        // 管理者権限を付与
        await admin.database().ref(`admins/${userRecord.uid}`).set(true);

        console.log('管理者権限を付与しました');

        // カスタムクレームの設定（オプション）
        await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

        console.log('\n✅ 管理者アカウントの作成が完了しました！');
        console.log('メールアドレス:', email);
        console.log('UID:', userRecord.uid);
        console.log('\nこの情報でログインできます。');
    } catch (error) {
        console.error('エラーが発生しました:', error);

        if (error.code === 'auth/email-already-exists') {
            console.log('\n既存のユーザーに管理者権限を付与しますか？');
            // 既存のユーザーに管理者権限を付与
            const user = await admin.auth().getUserByEmail(email);
            await admin.database().ref(`admins/${user.uid}`).set(true);
            await admin.auth().setCustomUserClaims(user.uid, { admin: true });
            console.log('✅ 既存のユーザーに管理者権限を付与しました');
        }
    }
}

// コマンドライン引数から取得
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('使用方法: node setup-first-admin.js <email> <password>');
    console.log('例: node setup-first-admin.js admin@example.com SecurePassword123!');
    process.exit(1);
}

const [email, password] = args;

// 管理者を作成
createFirstAdmin(email, password)
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error('予期しないエラー:', error);
        process.exit(1);
    });
