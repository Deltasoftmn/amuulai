import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSettingData, getStrapiMedia } from "@/lib/api";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getSettingData();
  const faviconUrl = setting?.favicon?.url ? getStrapiMedia(setting.favicon.url) : '/favicon.ico';
  
  return {
    title: setting?.siteName || "Амуулай Групп ХХК",
    description: setting?.seoDescription || '"Амуулай Групп" ХХК нь 2007 онд Монголын FMCG зах зээлд тэргүүлэгчдийн эгнээнд байж, Монголынхоо хэрэглэгчдэд дэлхийн гэр ахуй, өргөн хэрэглээний шилдэг бүтээгдэхүүнүүдийг хүргэж байна.',
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setting = await getSettingData();
  const faviconUrl = setting?.favicon?.url ? getStrapiMedia(setting.favicon.url) : '/favicon.ico';

  return (
    <html lang="mn" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
