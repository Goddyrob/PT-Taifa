import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent" />
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12">
          <div className="md:col-span-2">
            <Link
              to="/"
              aria-label="PT Taifa Digital Hub — Home"
              className="inline-block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-purple)] focus-visible:ring-offset-2 focus-visible:ring-offset-background transition"
            >
              <img
                src={logo}
                alt=""
                aria-hidden="true"
                className="h-14 w-auto object-contain hover:opacity-90 transition"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              Premium graphics, branding, marketing and creative services from
              Nairobi to the world.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex flex-col sm:flex-row gap-2 max-w-sm"
            >
              <input
                placeholder="your@email.com"
                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--neon-purple)]"
              />
              <button className="px-4 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Services</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Graphics Design</li>
              <li>Branding</li>
              <li>Digital Marketing</li>
              <li>Video & Media</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-3">Company</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#portfolio" className="hover:text-foreground">Portfolio</a></li>
              <li><a href="#why" className="hover:text-foreground">Why us</a></li>
              <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
              <li><a href="https://wa.me/254719790799" className="hover:text-foreground">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} PT Taifa Digital Hub. All rights reserved.</div>
          <div>Crafted in Nairobi 🇰🇪</div>
        </div>
      </div>
    </footer>
  );
}
