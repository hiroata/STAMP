import '/public/css/common.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
    title: 'ワールドスタンプ広島',
    description: '広島で切手の買取・販売を手がける専門店'
};

export default function RootLayout({ children }) {
    return (
        <html lang="ja">
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
