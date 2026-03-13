import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import MainProviders from "@/Providers/MainProviders";
import Provider from "@/Providers/Provider";
import { Toaster } from "sonner";
import RouteAccessToast from "@/components/RouteAccessToast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Design amazing digital experiences that create more happy in the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <MainProviders>
          <Provider>{children}</Provider>
        </MainProviders>
        <Suspense fallback={null}>
          <RouteAccessToast />
        </Suspense>
        <Toaster position="top-right" closeButton />
      </body>
    </html>
  );
}
