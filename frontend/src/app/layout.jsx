import { Roboto } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReduxProvider from '../redux/ReduxProvider';
import { GoogleAnalytics } from '@next/third-parties/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Isma Tution Center',
  description: 'A dedicated tuition center for students from 1st to 12th grade (CBSE & State Board), focused on strong fundamentals, concept clarity, and top academic results.',
  icons: {
    icon: '/Favicon-Isma.png',
  },
  openGraph: {
    title: "Isma Tuition Center",
    description: "A dedicated tuition center for students from 1st to 12th grade (CBSE & State Board), focused on strong fundamentals, concept clarity, and top academic results.",
    url: "https://isma-tution-center.vercel.app",
    siteName: "Isma Tuition Center",
    images: [
      {
        url: "https://isma-tution-center.vercel.app/isma-preview.png",
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
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    </html>
  );
}
