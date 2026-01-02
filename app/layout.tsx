import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZEON・SHINDAN｜魂の属性診断",
  description: "名と今の気分を入力せよ。結果はすでに内にある。",
  applicationName: "ZEON SHINDAN",
  manifest: "/manifest.webmanifest",
  themeColor: "#6b6cff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ZEON SHINDAN",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* iOS “ホーム画面に追加” 最適化 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZEON SHINDAN" />

        {/* こっちはAndroid/Chrome向け */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* アドレスバー色（ブラウザによる） */}
        <meta name="theme-color" content="#6b6cff" />

        {/* iOSアイコン */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* manifest（metadata.manifestでも入るけど念のため） */}
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  );
}
