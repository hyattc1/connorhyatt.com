"use client";

import Link from "next/link";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";
import { useRouter } from "next/navigation";

const navLinks = [
  {
    name: "home",
    href: "/",
  },
  {
    name: "projects",
    href: "/projects",
  },
  {
    name: "blog",
    href: "/blog",
  },
  {
    name: "contact",
    href: "/contact",
  },
];

export default function Header() {
  const router = useRouter();

  const handleMobileClick = (href: string, name: string) => {
    console.log('Mobile navigation clicked:', name);
    // Force immediate navigation for mobile
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/75 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-8 py-6">
        <nav className="flex items-center justify-between">
          <ul className="flex gap-4 sm:gap-8">
            {navLinks.map((nav, id) => (
              <li key={id}>
                <button
                  onClick={() => handleMobileClick(nav.href, nav.name)}
                  className="link"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {nav.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 sm:gap-4">
            <ChatToggle />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
