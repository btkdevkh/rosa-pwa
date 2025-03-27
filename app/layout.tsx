import "react-toastify/dist/ReactToastify.css";
import "@/app/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { ToastContainer } from "react-toastify";
import AuthContextProvider from "./context/AuthContext";
import ServiceWorkerInit from "./components/serviceWorker/ServiceWorkerInit";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  preload: true,
});

const APP_NAME = "Rosa";
const APP_DEFAULT_TITLE = "Rosa";
const APP_DESCRIPTION = "Collecter des données terrain, analyser les données";

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
          {/* Service Worker */}
          <ServiceWorkerInit />

          {children}

          {/* Toast */}
          <ToastContainer
            className="center-toast-container"
            toastClassName="center-toast"
          />
        </AuthContextProvider>
      </body>
    </html>
  );
}
