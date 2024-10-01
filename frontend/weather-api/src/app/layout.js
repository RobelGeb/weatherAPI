import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ subsets: ['latin'], weight:'300' })

export const metadata = {
  title: "Weather",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="flex h-full w-full">
      <body
        className={`${roboto.className} antialiased flex h-full w-full bg-gradient-to-r from-slate-800 via-blue-950 to-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
