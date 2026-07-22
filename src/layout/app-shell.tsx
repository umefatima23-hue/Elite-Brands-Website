import type { ReactNode } from "react";
import { AnnouncementBar } from "./announcement-bar";
import { BackToTop } from "./back-to-top";
import { CookieBanner } from "./cookie-banner";
import { Footer } from "./footer";
import { Header } from "./header";
import { WhatsAppFloat } from "./whatsapp-float";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppFloat />
      <CookieBanner />
    </div>
  );
}
