import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Home, Briefcase, Image as ImageIcon, Star, Phone, Shield, Rocket } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { href: "#services", label: "Services", icon: Briefcase },
  { href: "#portfolio", label: "Portfolio", icon: ImageIcon },
  { href: "#why", label: "Why Us", icon: Star },
  { href: "#contact", label: "Contact", icon: Phone },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all ${
            scrolled ? "glass-strong" : ""
          }`}
        >
          <Link
            to="/"
            aria-label="PT Taifa Digital Hub — Home"
            className="flex items-center gap-2 group min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-purple)] focus-visible:ring-offset-2 focus-visible:ring-offset-background transition"
          >
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="h-10 sm:h-12 w-auto shrink-0 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-transform"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/admin"
              className="hidden sm:inline-flex text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
            <a
              href="#contact"
              className="hidden xs:inline-flex sm:inline-flex items-center px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm rounded-xl bg-gradient-primary font-semibold text-white glow-purple hover:scale-105 transition-transform whitespace-nowrap"
            >
              Start Project
            </a>
            <button
              className="md:hidden text-foreground p-2 rounded-lg glass"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile slide-in sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <aside
          className={`absolute top-0 right-0 h-full w-[82%] max-w-sm glass-strong border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              aria-label="PT Taifa Digital Hub — Home"
              className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-purple)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <img src={logo} alt="" aria-hidden="true" className="h-10 w-auto object-contain" />
            </Link>
            <button
              className="p-2 rounded-lg glass"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col p-4 gap-1">
            <a
              href="#top"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-sm"
            >
              <Home className="w-4 h-4 text-primary" />
              Home
            </a>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-sm"
              >
                <l.icon className="w-4 h-4 text-primary" />
                {l.label}
              </a>
            ))}

            <div className="my-3 h-px bg-white/10" />

            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-sm text-muted-foreground"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>

            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary font-semibold text-white glow-purple"
            >
              <Rocket className="w-4 h-4" />
              Start Project
            </a>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/10 text-center text-[11px] text-muted-foreground">
            © PT Taifa Digital Hub
          </div>
        </aside>
      </div>
    </header>
  );
}
