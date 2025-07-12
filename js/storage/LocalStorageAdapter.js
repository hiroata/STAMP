// LocalStorageアダプター実装
// Single Responsibility Principle: LocalStorageへのアクセスのみを担当

import { StorageAdapter } from './StorageAdapter.js';
import { StorageReadError, StorageWriteError, ValidationError } from '../errors/CustomErrors.js';

export class LocalStorageAdapter extends StorageAdapter {
    constructor() {
        super();
        this.prefix = 'stamp_';
    }

    async getAll(collection) {
        try {
            const key = this.prefix + collection;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            throw new StorageReadError(`LocalStorage読み込みエラー: ${error.message}`, collection);
        }
    }

    async get(collection, id) {
        const items = await this.getAll(collection);
        return items.find(item => item.id === id) || null;
    }

    async add(collection, item) {
        const items = await this.getAll(collection);
        const newItem = {
            ...item,
            id: item.id || Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        await this.saveAll(collection, items);
        return newItem;
    }

    async update(collection, id, updates) {
        const items = await this.getAll(collection);
        const index = items.findIndex(item => item.id === id);

        if (index === -1) {
            throw new ValidationError(`アイテムが見つかりません: ${id}`, 'id');
        }

        items[index] = {
            ...items[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        await this.saveAll(collection, items);
        return items[index];
    }

    async delete(collection, id) {
        const items = await this.getAll(collection);
        const filteredItems = items.filter(item => item.id !== id);

        if (items.length === filteredItems.length) {
            throw new ValidationError(`削除対象が見つかりません: ${id}`, 'id');
        }

        await this.saveAll(collection, filteredItems);
        return true;
    }

    async saveAll(collection, items) {
        try {
            const key = this.prefix + collection;
            localStorage.setItem(key, JSON.stringify(items));
        } catch (error) {
            throw new StorageWriteError(`LocalStorage書き込みエラー: ${error.message}`, collection);
        }
    }
}