// Firebaseアダプター実装
// Single Responsibility Principle: Firebase Realtime Databaseへのアクセスのみを担当

import { StorageAdapter } from './StorageAdapter.js';
import { ref, get, set, push, update, remove } from 'firebase/database';
import { StorageReadError, StorageWriteError } from '../errors/CustomErrors.js';

export class FirebaseAdapter extends StorageAdapter {
    constructor(database) {
        super();
        this.database = database;
    }

    async getAll(collection) {
        try {
            const snapshot = await get(ref(this.database, collection));
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Firebaseオブジェクトを配列に変換
                return Object.entries(data).map(([id, item]) => ({
                    ...item,
                    id
                }));
            }
            return [];
        } catch (error) {
            throw new StorageReadError(`Firebase読み込みエラー: ${error.message}`, collection);
        }
    }

    async get(collection, id) {
        try {
            const snapshot = await get(ref(this.database, `${collection}/${id}`));
            if (snapshot.exists()) {
                return {
                    ...snapshot.val(),
                    id
                };
            }
            return null;
        } catch (error) {
            throw new StorageReadError(`Firebase読み込みエラー: ${error.message}`, collection);
        }
    }

    async add(collection, item) {
        try {
            const newItem = {
                ...item,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            if (item.id) {
                // 既存のIDがある場合はそれを使用
                await set(ref(this.database, `${collection}/${item.id}`), newItem);
                return { ...newItem, id: item.id };
            } else {
                // 新規IDを生成
                const newRef = push(ref(this.database, collection));
                await set(newRef, newItem);
                return { ...newItem, id: newRef.key };
            }
        } catch (error) {
            throw new StorageWriteError(`Firebase書き込みエラー: ${error.message}`, collection);
        }
    }

    async update(collection, id, updates) {
        try {
            const updateData = {
                ...updates,
                updatedAt: new Date().toISOString()
            };

            await update(ref(this.database, `${collection}/${id}`), updateData);
            return await this.get(collection, id);
        } catch (error) {
            throw new StorageWriteError(`Firebase更新エラー: ${error.message}`, collection);
        }
    }

    async delete(collection, id) {
        try {
            await remove(ref(this.database, `${collection}/${id}`));
            return true;
        } catch (error) {
            throw new StorageWriteError(`Firebase削除エラー: ${error.message}`, collection);
        }
    }
}