// Firebase Storage画像アップロード管理クラス
class ImageUploader {
    constructor() {
        this.storage = window.firebaseStorage || firebase.storage();
        this.storageRef = this.storage.ref();
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    }

    // ファイルの検証
    validateFile(file) {
        if (!file) {
            throw new Error('ファイルが選択されていません');
        }

        if (!this.allowedTypes.includes(file.type)) {
            throw new Error('対応していないファイル形式です。JPEG、PNG、WebPのみ対応しています。');
        }

        if (file.size > this.maxFileSize) {
            throw new Error('ファイルサイズが大きすぎます。5MB以下にしてください。');
        }

        return true;
    }

    // 画像をアップロード
    async uploadImage(file, productId = null) {
        try {
            // ファイル検証
            this.validateFile(file);

            // ファイル名の生成（タイムスタンプ + ランダム文字列）
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8);
            const extension = file.name.split('.').pop();
            const fileName = productId
                ? `products/${productId}_${timestamp}.${extension}`
                : `products/temp_${timestamp}_${randomStr}.${extension}`;

            // Firebase Storageにアップロード
            const imageRef = this.storageRef.child(fileName);
            const uploadTask = imageRef.put(file, {
                contentType: file.type,
                cacheControl: 'public,max-age=3600'
            });

            // アップロード進捗を返すPromise
            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    // 進捗ハンドラ
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        if (window.onUploadProgress) {
                            window.onUploadProgress(progress);
                        }
                    },
                    // エラーハンドラ
                    (error) => {
                        console.error('Upload error:', error);
                        reject(this.getErrorMessage(error));
                    },
                    // 完了ハンドラ
                    async () => {
                        try {
                            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                            resolve({
                                success: true,
                                url: downloadURL,
                                fileName: fileName,
                                size: file.size,
                                type: file.type
                            });
                        } catch (error) {
                            reject('画像URLの取得に失敗しました');
                        }
                    }
                );
            });
        } catch (error) {
            throw new Error(error.message || '画像のアップロードに失敗しました');
        }
    }

    // 画像を削除
    async deleteImage(imageUrl) {
        try {
            if (!imageUrl || !imageUrl.includes('firebasestorage.googleapis.com')) {
                return { success: true, message: 'Firebase Storage以外の画像です' };
            }

            // URLからファイルパスを抽出
            const decodedUrl = decodeURIComponent(imageUrl);
            const match = decodedUrl.match(/\/o\/(.*?)\?/);
            if (!match || !match[1]) {
                throw new Error('画像パスの解析に失敗しました');
            }

            const filePath = match[1];
            const imageRef = this.storageRef.child(filePath);

            await imageRef.delete();
            return { success: true };
        } catch (error) {
            console.error('Delete error:', error);
            // 画像が見つからない場合は成功として扱う
            if (error.code === 'storage/object-not-found') {
                return { success: true, message: '画像は既に削除されています' };
            }
            throw new Error('画像の削除に失敗しました');
        }
    }

    // 画像をリサイズ（ブラウザ側）
    async resizeImage(file, maxWidth = 800, maxHeight = 800) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // アスペクト比を保持してリサイズ
                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round(height * (maxWidth / width));
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round(width * (maxHeight / height));
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                // 元のファイル名を保持
                                blob.name = file.name;
                                resolve(blob);
                            } else {
                                reject(new Error('画像の変換に失敗しました'));
                            }
                        },
                        file.type,
                        0.85
                    ); // 品質85%
                };
                img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
            reader.readAsDataURL(file);
        });
    }

    // エラーメッセージの日本語化
    getErrorMessage(error) {
        switch (error.code) {
        case 'storage/unauthorized':
            return '画像のアップロード権限がありません';
        case 'storage/canceled':
            return 'アップロードがキャンセルされました';
        case 'storage/unknown':
            return 'エラーが発生しました。もう一度お試しください';
        case 'storage/retry-limit-exceeded':
            return 'アップロードに失敗しました。時間をおいてお試しください';
        default:
            return error.message || '画像のアップロードに失敗しました';
        }
    }
}

// グローバルに公開
window.ImageUploader = ImageUploader;
