import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://propertyflow-ai.vercel.app"),

  title: {
    default: "PropertyFlow AI",
    template: "%s | PropertyFlow AI",
  },

  description:
    "AI-powered real estate platform for premium GCC property discovery, market insights, verified agents, and intelligent property recommendations.",

  keywords: [
    "PropertyFlow AI",
    "Real Estate",
    "Dubai Properties",
    "GCC Real Estate",
    "Property Management",
    "AI Real Estate",
  ],

  openGraph: {
    title: "PropertyFlow AI",
    description:
      "Discover properties, market insights, and AI-powered real estate intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, jakarta.variable, "scroll-smooth antialiased")}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
