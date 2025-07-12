// Jest セットアップファイル
// テスト環境のグローバル設定

// Firebase モックの設定
global.firebase = {
    initializeApp: jest.fn(),
    database: jest.fn(() => ({
        ref: jest.fn(() => ({
            on: jest.fn(),
            once: jest.fn(),
            push: jest.fn(),
            set: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            child: jest.fn()
        }))
    })),
    auth: jest.fn(() => ({
        onAuthStateChanged: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
        currentUser: null
    })),
    storage: jest.fn(() => ({
        ref: jest.fn(() => ({
            child: jest.fn(() => ({
                put: jest.fn(),
                delete: jest.fn(),
                getDownloadURL: jest.fn()
            }))
        }))
    }))
};

// localStorage モック
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// sessionStorage モック
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.sessionStorage = sessionStorageMock;

// console エラーを抑制（テスト中の不要な出力を防ぐ）
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn()
};
