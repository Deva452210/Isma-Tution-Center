import { Roboto } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReduxProvider from '../redux/ReduxProvider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Isma Tution Center',
  description: 'A dedicated Maths tuition center for 10th, 11th, and 12th students focused on concept clarity and top board exam scores.',
  icons: {
    icon: '/Favicon-Isma.png',
  },
  openGraph: {
    title: "Isma Tuition Center",
    description: "A dedicated Maths tuition center for 10th, 11th, and 12th students focused on concept clarity and top board exam scores.",
    url: "https://isma-tution-center.vercel.app",
    siteName: "Isma Tuition Center",
    images: [
      {
        url: "/isma-preview.png",
        width: 1200,
        height: 630,
        alt: "Isma Tuition Center",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={roboto.className}>
        <ReduxProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          {/* <Footer /> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
