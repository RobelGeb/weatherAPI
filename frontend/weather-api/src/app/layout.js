import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Weather API App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="flex h-full w-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-full w-full`}
      >
        {children}
      </body>
    </html>
  );
}
