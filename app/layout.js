import { Inter } from "next/font/google";
import { Toaster } from "sonner"; // ✅ Import Sonner
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "QA XPath",
  description: "Generated bulk XPath with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Toaster position="top-right" richColors closeButton />{" "}
        {/* ✅ Sonner popup */}
        <main>{children}</main>
      </body>
    </html>
  );
}
