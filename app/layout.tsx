import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { getSettingData, getFaviconUrl, getStrapiMedia } from "@/lib/api";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-roboto",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [setting, faviconUrl] = await Promise.all([
    getSettingData(),
    getFaviconUrl(),
  ]);
  
  const isPng = faviconUrl.toLowerCase().includes('.png');
  const isSvg = faviconUrl.toLowerCase().includes('.svg');
  const mimeType = isPng ? 'image/png' : isSvg ? 'image/svg+xml' : 'image/x-icon';

  return {
    title: setting?.siteName || "Амуулай Групп ХХК",
    description: setting?.seoDescription || '"Амуулай Групп" ХХК нь 2007 онд Монголын FMCG зах зээлд тэргүүлэгчдийн эгнээнд байж, Монголынхоо хэрэглэгчдэд дэлхийн гэр ахуй, өргөн хэрэглээний шилдэг бүтээгдэхүүнүүдийг хүргэж байна.',
    icons: {
      icon: [
        { url: faviconUrl, type: mimeType },
      ],
      shortcut: [{ url: faviconUrl, type: mimeType }],
      apple: [{ url: faviconUrl, type: mimeType }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const faviconUrl = await getFaviconUrl();
  const isPng = faviconUrl.toLowerCase().includes('.png');
  const isSvg = faviconUrl.toLowerCase().includes('.svg');
  const mimeType = isPng ? 'image/png' : isSvg ? 'image/svg+xml' : 'image/x-icon';

  return (
    <html lang="mn" className={`${roboto.variable} ${roboto.className} antialiased`}>
      <head>
        <link rel="icon" type={mimeType} href={faviconUrl} key="icon" />
        <link rel="shortcut icon" href={faviconUrl} key="shortcut-icon" />
        <link rel="apple-touch-icon" href={faviconUrl} key="apple-icon" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
