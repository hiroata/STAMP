# 🏪 STAMP - 切手販売サイト プロジェクトガイド

## プロジェクト概要
- **プロジェクト名**: STAMP
- **プロジェクトID**: stamp-e20f2
- **目的**: 高齢者向けの使いやすい切手販売ECサイト
- **技術スタック**: Astro, Tailwind CSS, Firebase

## 🚀 クイックスタート

### 1. 開発環境セットアップ
```bash
# 依存関係のインストール
cd stamp-store
npm install

# 開発サーバー起動
npm run dev
# → http://localhost:4321 で確認

# ビルド
npm run build
```

### 2. Firebaseデプロイ
```bash
# Firebaseにログイン
firebase login

# デプロイ実行
firebase deploy --only hosting --project stamp-e20f2

# デプロイURL
# https://stamp-e20f2.web.app
```

## 📁 プロジェクト構造
```
STAMP/
├── src/
│   ├── components/      # Astroコンポーネント
│   ├── pages/          # ページファイル
│   ├── data/           # 商品・カテゴリーデータ
│   └── styles/         # グローバルスタイル
├── public/             # 静的ファイル
├── firebase.json       # Firebase設定
└── stamp-store/        # Astroプロジェクト本体
```

## 🎯 主要機能

### 実装済み機能
- ✅ レスポンシブデザイン
- ✅ アクセシビリティツールバー（文字サイズ変更等）
- ✅ 階層的カテゴリー構造
- ✅ 商品検索・フィルター機能
- ✅ ショッピングカート（LocalStorage）
- ✅ 高齢者向けUI（大きなボタン、見やすい文字）

### 今後の改善案
1. **パフォーマンス最適化**
   - 画像の遅延読み込み
   - Service Worker導入
   - Critical CSSの分離

2. **Firebase機能の活用**
   - Authentication（会員機能）
   - Firestore（商品データ管理）
   - Cloud Functions（画像最適化）

3. **SEO対策**
   - 構造化データ追加
   - サイトマップ生成
   - メタタグ最適化

## 🛠️ 開発ガイドライン

### コンポーネント開発
```astro
---
// TypeScriptインターフェース定義
export interface Props {
  title: string;
  category?: string;
}

const { title, category } = Astro.props;
---

<div class="component">
  <h2>{title}</h2>
  {category && <span>{category}</span>}
</div>
```

### スタイルガイド
- Tailwind CSSクラスを優先使用
- カスタムCSSは最小限に
- BEMやコンポーネントスコープのスタイルを使用

### アクセシビリティ
- 全ての画像にalt属性
- フォーカス管理の徹底
- キーボードナビゲーション対応
- ARIA属性の適切な使用

## 📊 パフォーマンス目標
- Lighthouse スコア: 95以上
- ページ読み込み時間: 2秒以内
- First Contentful Paint: 1.5秒以内

## 🚨 トラブルシューティング

### ビルドエラー
```bash
# キャッシュクリア
rm -rf node_modules dist
npm install
npm run build
```

### Firebase認証エラー
```bash
# 再認証
firebase logout
firebase login
```

### 404エラー
`firebase.json`のrewrites設定を確認

## 📞 サポート
技術的な質問は、プロジェクトのIssueトラッカーまたは開発チームまでお問い合わせください。