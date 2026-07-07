import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Амуулай Групп ХХК",
  description:
    '"Амуулай Групп" ХХК нь 2007 онд Монголын FMCG зах зээлд тэргүүлэгчдийн эгнээнд байж, Монголынхоо хэрэглэгчдэд дэлхийн гэр ахуй, өргөн хэрэглээний шилдэг бүтээгдэхүүнүүдийг хүргэж байна.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={`${inter.variable} antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
