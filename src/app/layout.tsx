import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { LanguageProvider } from "@/lib/language";
import { RoleProvider } from "@/lib/role";
import { LanguageToggle } from "@/components/LanguageToggle";
import { RoleSelector } from "@/components/RoleSelector";
import { NavLinks } from "@/components/NavLinks";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "MLU Halle | Gastekartenportal",
  description: "University Guest Card Registration System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "#FFFFFF", fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <LanguageProvider>
          <RoleProvider>
            <header style={{ backgroundColor: "#FFFFFF", borderBottom: "2px solid #9FBF47" }}>
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
                <Link href="/" className="flex items-center gap-3 no-underline">
                  <Image
                    src="/uni_halle_logo.jpg"
                    alt="MLU Logo"
                    width={55}
                    height={55}
                    className="h-11 w-auto"
                    priority
                    unoptimized
                  />
                  <Image
                    src="/site-assets/mlu-logo-name.jpg"
                    alt="Martin-Luther-Universitat Halle-Wittenberg"
                    width={160}
                    height={55}
                    className="h-11 w-auto"
                    priority
                  />
                </Link>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="overflow-x-auto scrollbar-none">
                    <NavLinks />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <RoleSelector />
                    <LanguageToggle />
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <Footer />
          </RoleProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
