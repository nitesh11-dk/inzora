import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Script from "next/script"; // ✅ import Script

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Inzora By Brezora — Instagram Growth Services",
  description:
    "Brezora helps creators and brands grow their Instagram presence organically. Join thousands of successful accounts today!",
  keywords:
    "Instagram growth, social media marketing, Brezora, organic followers, influencer marketing",
  authors: [{ name: "Brezora Studio" }],
  openGraph: {
    title: "Brezora — Instagram Growth Services",
    description:
      "Ready to grow your Instagram? Brezora offers real, organic growth for creators and brands.",
    url: "https://inzora-client.vercel.app/inzora",
    siteName: "Brezora",
    images: [
      {
        url: "/logo.jpg",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brezora — Instagram Growth Services",
    description:
      "Grow your Instagram followers and engagement organically with Brezora.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        {/* ✅ Add Google AdSense meta tag */}
        <meta
          name="google-adsense-account"
          content="ca-pub-7981557748614052"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="h-screen">{children}</div>
        <ToastContainer />

        {/* Razorpay */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7981557748614052"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
