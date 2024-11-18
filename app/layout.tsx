import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const APP_NAME = "Rospot";
const APP_DEFAULT_TITLE = "Rospot";
const APP_DESCRIPTION =
  "Collecter des données terrain, analyser les données puis bénéficier de prévisions de risques sur la rouille de la rose de mai";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_DEFAULT_TITLE,
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: "/favicon.ico",
    apple: [{ url: "/ios/180.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f6fa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <div className="mx-5 my-2">{children}</div>
      </body>
    </html>
  );
}
