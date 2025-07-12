/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./category.html", 
    "./products.html",
    "./admin.html",
    "./admin-enhanced.html",
    "./admin-categories.html",
    "./admin-login.html",
    "./admin-mobile.html",
    "./pages/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#C41E3A',
        'brand-red-dark': '#A01729',
      },
      fontFamily: {
        sans: [
          'Hiragino Kaku Gothic ProN',
          'ヒラギノ角ゴ ProN', 
          'メイリオ',
          'Meiryo',
          'MS Pゴシック',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}