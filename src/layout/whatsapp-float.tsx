import { siteConfig } from "@/config/site";

export function WhatsAppFloat() {
  // Placeholder — replace with the configured number in Sprint 02.
  const href = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 left-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-elite-lg transition-transform hover:scale-105 hover:opacity-95"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M.057 24l1.687-6.163A11.867 11.867 0 010 11.892C0 5.335 5.335 0 11.893 0c3.18 0 6.167 1.24 8.413 3.488a11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.683-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885a9.86 9.86 0 001.512 5.26L3.36 19.06l3.295-.867zm5.443-6.084" />
      </svg>
    </a>
  );
}
