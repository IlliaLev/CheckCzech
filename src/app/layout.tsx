import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          flex justify-center items-center
          w-screen h-screen
          bg-[linear-gradient(135deg,#320E3B_40%,#FF0035_100%)]
          `}
      >
        {children}
      </body>
    </html>
  );
}
