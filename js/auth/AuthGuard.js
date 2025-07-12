// 認証ガード
// Single Responsibility Principle: 認証チェックのみを担当

import { createLogger } from '../logger.js';
import { onAuthStateChanged } from 'firebase/auth';
import { UnauthorizedError, ForbiddenError } from '../errors/CustomErrors.js';

const logger = createLogger('AuthGuard');

export class AuthGuard {
    constructor(auth, database) {
        this.auth = auth;
        this.database = database;
        this.currentUser = null;
        this.isAdmin = false;

        // 認証状態の監視
        this.setupAuthListener();
    }

    // 認証状態リスナーのセットアップ
    setupAuthListener() {
        onAuthStateChanged(this.auth, async (user) => {
            this.currentUser = user;
            if (user) {
                logger.info('ユーザーログイン:', user.uid);
                await this.checkAdminStatus(user.uid);
            } else {
                logger.info('ユーザーログアウト');
                this.isAdmin = false;
            }
        });
    }

    // 管理者権限チェック
    async checkAdminStatus(uid) {
        try {
            const { ref, get } = await import('firebase/database');
            const snapshot = await get(ref(this.database, `admins/${uid}`));
            this.isAdmin = snapshot.exists() && snapshot.val() === true;
            logger.info('管理者権限:', this.isAdmin);
        } catch (error) {
            logger.error('管理者権限チェックエラー:', error);
            this.isAdmin = false;
        }
    }

    // 認証必須チェック
    requireAuth() {
        if (!this.currentUser) {
            throw new UnauthorizedError();
        }
        return this.currentUser;
    }

    // 管理者権限必須チェック
    requireAdmin() {
        this.requireAuth();
        if (!this.isAdmin) {
            throw new ForbiddenError('管理者権限が必要です');
        }
        return this.currentUser;
    }

    // 現在のユーザー取得
    getCurrentUser() {
        return this.currentUser;
    }

    // 管理者かどうか
    isUserAdmin() {
        return this.isAdmin;
    }

    // 特定の操作の権限チェック
    canPerformAction(action, _resource) {
        // 読み取りは全員可能
        if (action === 'read') {
            return true;
        }

        // 書き込み系操作は管理者のみ
        if (['create', 'update', 'delete'].includes(action)) {
            return this.isAdmin;
        }

        return false;
    }
}