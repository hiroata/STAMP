// ハンバーガーメニューの開閉
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

function openMobileMenu() {
    mobileMenu?.classList.add('show');
    mobileMenuBtn?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu?.classList.remove('show');
    mobileMenuBtn?.classList.remove('open');
    document.body.style.overflow = '';
}

mobileMenuBtn?.addEventListener('click', openMobileMenu);
mobileMenuClose?.addEventListener('click', closeMobileMenu);

// メニュー外をクリックしたら閉じる
mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMobileMenu();
    }
});

// メニューリンクをクリックしたら閉じる
document.querySelectorAll('#mobile-menu a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
});
