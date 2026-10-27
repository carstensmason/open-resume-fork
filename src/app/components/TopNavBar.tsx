"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";

import { TextStylingInfoButton } from "components/TextStylingInfoButton";

export const TopNavBar = () => {
  const pathName = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Builder",
      isActive: pathName === "/" || pathName === "/resume-builder",
    },
    {
      href: "/resume-import",
      label: "Import",
      isActive: pathName === "/resume-import",
    },
    {
      href: "/resume-parser",
      label: "Parser",
      isActive: pathName === "/resume-parser",
    },
  ];

  return (
    <header
      aria-label="Site Header"
      className="flex h-[var(--top-nav-bar-height)] items-center border-b-2 border-gray-100 px-3 lg:px-12"
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/">
          <span className="sr-only">OpenResume</span>
          <Image
            src={logoSrc}
            alt="OpenResume Logo"
            className="h-8 w-full"
            priority
          />
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-2 text-sm font-medium"
        >
          {navItems.map(({ href, label, isActive }) => (
            <div key={label} className="flex items-center gap-0.5">
              {label === "Builder" && <TextStylingInfoButton />}
              <Link
                className={cx(
                  "rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4",
                  isActive && "font-semibold text-gray-800"
                )}
                href={href}
              >
                {label}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

