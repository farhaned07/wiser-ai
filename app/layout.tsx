import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Hind_Siliguri } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/app/(auth)/auth';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const hindSiliguri = Hind_Siliguri({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
  variable: '--font-hind-siliguri'
});

export const metadata = {
  title: 'উইজার এআই চ্যাটবট',
  description: 'বাংলা-ইংরেজি সমর্থন এবং বিকাশ পেমেন্ট ইন্টিগ্রেশন সহ এআই চ্যাটবট',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${inter.variable} ${hindSiliguri.variable} font-sans`}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex flex-col min-h-[calc(100vh-4rem)]">
              {children}
            </main>
            <Toaster position="top-center" />
            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
