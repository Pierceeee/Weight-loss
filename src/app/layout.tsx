import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Perfect Body - Personalized Weight Loss & Fitness Plans",
  description:
    "Real results, real food, real simple. Get a personalized diet and fitness plan designed for your body. Lose weight, build muscle, and achieve your health goals.",
  keywords: [
    "weight loss",
    "fitness",
    "diet plan",
    "personalized nutrition",
    "meal plan",
    "PCOS",
  ],
  openGraph: {
    title: "Perfect Body - Personalized Weight Loss & Fitness Plans",
    description:
      "Real results, real food, real simple. Get your personalized plan today.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
