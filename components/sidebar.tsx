"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Pill,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCookies } from "@/hooks/use-cookies"; // Você precisará criar este hook

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const cookies = useCookies(); // Hook para manipular cookies

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = async () => {
    try {
      // Remove o token do cookie
      cookies.remove("token");

      // Opcional: Chamar API de logout se necessário
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      router.push("/"); // Mudei para "/login" em vez de "/" para ser mais explícito

      // Força um refresh completo
      window.location.href = "/";
    } catch (error) {
      console.error("Erro durante logout:", error);
      window.location.href = "/";
    }
  };
  const routes = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
    },
    {
      href: "/dashboard/medicamentos",
      icon: Pill,
      title: "Medicamentos",
    },
    {
      href: "/dashboard/doencas",
      icon: Stethoscope,
      title: "Doenças",
    },
    {
      href: "/dashboard/estoque",
      icon: Package,
      title: "Estoque",
    },
    {
      href: "/dashboard/clientes",
      icon: Users,
      title: "Clientes",
    },
  ];

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white shadow-lg transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-teal-600" />
            <span className="text-lg font-bold text-teal-700">
              Extratus- TO
            </span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === route.href
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.title}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </>
  );
}
