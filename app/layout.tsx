import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
// import PwaInstallPrompt from "./components/PwaInstallPrompt";

const AuthContextProvider = dynamic(() => import("./context/AuthContext"), {
  ssr: true,
});

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
        <AuthContextProvider>
          {children}

          {/* Toast */}
          <ToastContainer
            className="center-toast-container"
            toastClassName="center-toast"
          />

          {/* Add the install prompt component */}
          {/* <PwaInstallPrompt /> */}
        </AuthContextProvider>
      </body>
    </html>
  );
}
