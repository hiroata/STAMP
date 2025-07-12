// ストレージアダプターのインターフェース（抽象基底クラス）
// Single Responsibility Principle: ストレージ操作の抽象化のみを担当

export class StorageAdapter {
    async getAll(_collection) {
        throw new Error('Not implemented');
    }

    async get(_collection, _id) {
        throw new Error('Not implemented');
    }

    async add(_collection, _item) {
        throw new Error('Not implemented');
    }

    async update(_collection, _id, _updates) {
        throw new Error('Not implemented');
    }

    async delete(_collection, _id) {
        throw new Error('Not implemented');
    }
}