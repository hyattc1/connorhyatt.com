"use client";

import Link from "next/link";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";

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
  return (
    <header className="sticky top-0 z-50 bg-background/75 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-8 py-6">
        <nav className="flex items-center justify-between">
          <ul className="flex gap-4 sm:gap-8">
            {navLinks.map((nav, id) => (
              <li key={id}>
                <Link 
                  href={nav.href} 
                  className="link"
                  onClick={(e) => {
                    console.log('Navigation clicked:', nav.name, 'href:', nav.href);
                    // Prevent any potential issues
                    e.preventDefault();
                    // Force navigation
                    window.location.href = nav.href;
                  }}
                >
                  {nav.name}
                </Link>
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
