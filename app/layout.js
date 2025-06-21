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

const SIDEBAR_WIDTH = 240; // in pixels

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>
          {/* Layout wrapper */}
          <div className="min-h-screen w-full bg-white dark:bg-black">
            {/* Fixed Sidebar */}
            <div
              className="fixed top-0 left-0 h-full bg-gray-100 dark:bg-gray-900 shadow-md"
              style={{ width: SIDEBAR_WIDTH }}
            >
              <AppSidebar />
            </div>

            {/* Main content with left margin equal to sidebar width */}
            <div className="ml-[240px] px-6 pt-4 pb-10 min-h-screen flex flex-col">
              <main className="flex-grow w-full">{children}</main>
              <footer className="mt-8">
                <Footer />
              </footer>
            </div>
          </div>

          {/* Toast notifications */}
          <Toaster position="top-right" richColors closeButton />
        </SidebarProvider>
      </body>
    </html>
  );
}
