import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QA XPath",
  description: "Generated bulk XPath with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>
          {/* Sidebar (Fixed Width) */}
          <AppSidebar />

          <main className="container mx-auto pl-8 max-w-7xl">{children}</main>

          {/* Sonner Notifications */}
          <Toaster position="top-right" richColors closeButton />
        </SidebarProvider>

        <footer className="w-full bg-[#F3F4F6] dark:bg-[#1F2227] p-1 pt-8">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
