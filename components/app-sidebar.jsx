"use client";

import { useState, useEffect } from "react";
import {
  Home,
  CodeXml,
  FileCode,
  Database,
  Settings,
  Menu,
  ChevronLeft,
  Monitor,
  MessageCircle,
  GitCompare,
  List,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Locators", url: "/locators", icon: CodeXml },
  { title: "XPath Methods", url: "/xpath", icon: FileCode },
  { title: "Test Cases", url: "/test-case", icon: Monitor },
  { title: "Get Data", url: "/get-data", icon: Database },
  { title: "Azure Comments", url: "/azure-comments", icon: MessageCircle },
  {
    title: "Test Upload",
    url: "/test-generator-upload-file",
    icon: MessageCircle,
  },
  {
    title: "To DO List",
    url: "/simple-to-do-list",
    icon: List,
  },
  { title: "Test Generator", url: "/test-generator", icon: CodeXml },
  {
    title: "Test Case Report",
    url: "/test-case-report-generator",
    icon: FileCode,
  },
  { title: "String Compare", url: "/string-match", icon: GitCompare },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
  }, [isMobile]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="relative flex h-screen">
      {/* Sidebar */}
      <Sidebar
        className={`relative z-30 h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 shadow-2xl ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel
              className={`text-xl font-bold px-4 py-6 transition-all duration-300 flex items-center gap-2 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <Link href="/" className="flex gap-2 items-center">
                <Image src="/logo.svg" width={32} height={32} alt="Logo" />
                {!isCollapsed && <span>QA XPath</span>}
              </Link>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(({ title, url, icon: Icon }) => {
                  const isActive = pathname === url;
                  return (
                    <SidebarMenuItem key={title} className="p-1">
                      <SidebarMenuButton asChild>
                        <Link
                          href={url}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-500
                            ${
                              isActive
                                ? "bg-blue-600 text-white shadow  "
                                : "text-gray-700  "
                            }
                            ${isCollapsed ? "justify-center px-2" : ""}
                          `}
                        >
                          <Icon size={24} strokeWidth={2.2} />
                          {!isCollapsed && (
                            <span className="text-base font-medium whitespace-nowrap">
                              {title}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-0 p-2 bg-gray-800 text-white rounded-full transform translate-x-1/2 hover:bg-blue-600 transition z-40"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <Menu size={22} /> : <ChevronLeft size={22} />}
        </button>
      </Sidebar>

      {/* Overlay for mobile */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
