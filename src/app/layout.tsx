import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          flex flex-1 justify-center items-center
          min-w-screen min-h-screen
          bg-[linear-gradient(135deg,#320E3B_40%,#FF0035_100%)]
          backdrop-blur-3xl
          text-[#320E3B]
          `}
      >
        {children}
      </body>
    </html>
  );
}
