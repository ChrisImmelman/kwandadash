"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, DollarSign, Bot, Menu, X, Settings } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/finances", label: "Finances", icon: DollarSign },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-moss px-4 py-3 flex items-center justify-between">
        <Image
          src="/kwanda-brand/kwanda logo full light.png"
          alt="Kwanda"
          width={120}
          height={32}
          className="h-7 w-auto"
        />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-cream p-1"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-moss/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-moss z-50 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6 pb-4">
          <Image
            src="/kwanda-brand/kwanda logo full light.png"
            alt="Kwanda"
            width={140}
            height={36}
            className="h-8 w-auto"
          />
          <p className="font-mono-brand text-[10px] uppercase tracking-widest text-cream/40 font-semibold mt-2">
            Internal Dashboard
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-subheading text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-cream/10 text-cream"
                    : "text-cream/50 hover:text-cream hover:bg-cream/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-clay" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cream/10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_#22c55e] animate-pulse" />
            <span className="font-mono-brand text-[10px] text-cream/40 uppercase tracking-widest font-semibold">
              System Online
            </span>
          </div>
        </div>
      </aside>

      {/* Spacer for mobile top bar */}
      <div className="md:hidden h-14" />
    </>
  );
}
