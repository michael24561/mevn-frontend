import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '../../public/assets/css/bootstrap.min.css';
import '../../public/assets/css/templatemo.css';
import '../../public/assets/css/custom.css';
import '../../public/assets/css/fontawesome.css';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Licores Deluxe",
  description: "Tienda especializada en licores premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthPage = typeof window !== 'undefined' 
    ? ['/auth/login', '/auth/register'].includes(window.location.pathname)
    : false;

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <main className={isAuthPage ? 'bg-gray-50' : ''}>
            {children}
          </main>
          {/* Configuración de ToastContainer */}
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastStyle={{
              borderRadius: '8px',
              fontSize: '14px',
              padding: '12px 16px',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}