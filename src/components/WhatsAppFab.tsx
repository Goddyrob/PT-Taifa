import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/254719790799?text=Hi%20Taifa%20Digital%20Hub%2C%20I%27d%20like%20to%20start%20a%20project."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <span className="absolute inset-0 rounded-full bg-green-500/40 blur-xl animate-[glow_3s_ease-in-out_infinite]" />
      <span className="relative flex items-center justify-center gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-3.5 rounded-full bg-green-500 text-white font-semibold shadow-[0_10px_30px_-5px_rgba(34,197,94,0.6)] hover:scale-105 transition">
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-sm">Chat with us</span>
      </span>
    </a>
  );
}
