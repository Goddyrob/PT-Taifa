import { motion } from "framer-motion";
import {
  Palette,
  Layers,
  Megaphone,
  Video,
  Laptop,
  FileBadge,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Graphics Design",
    desc: "Logos, flyers, posters, business cards, social posts, packaging & full brand identity.",
    items: ["Logos", "Flyers", "Posters", "Packaging"],
  },
  {
    icon: Layers,
    title: "Branding",
    desc: "Company branding, personal branding kits and complete visual identity systems.",
    items: ["Visual Identity", "Brand Kits", "Style Guides"],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Social media management, email marketing, digital ads, infographics & blog graphics.",
    items: ["Social Media", "Ads", "Email", "Infographics"],
  },
  {
    icon: Video,
    title: "Video & Media",
    desc: "Video editing, motion graphics, promo videos and professional livestreaming.",
    items: ["Editing", "Motion Graphics", "Livestream"],
  },
  {
    icon: Laptop,
    title: "IT & Online",
    desc: "PDF editing, data entry, CV design, typing services and dedicated online support.",
    items: ["CV Design", "PDF Edit", "Data Entry"],
  },
  {
    icon: FileBadge,
    title: "Government Services",
    desc: "KRA, HELB, KUCCPS applications and official document processing made simple.",
    items: ["KRA", "HELB", "KUCCPS"],
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-4">
            What we do
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl">
            Premium services for{" "}
            <span className="text-gradient">modern brands</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Six service pillars covering everything from logo design to full
            digital transformation.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative glass rounded-2xl sm:rounded-3xl p-4 sm:p-7 hover:bg-white/[0.06] transition-all neon-border"
            >
              <div className="absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-20 blur-xl transition pointer-events-none" />

              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-primary grid place-items-center mb-3 sm:mb-5 group-hover:scale-110 transition">
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-base sm:text-xl mb-1.5 sm:mb-2 flex items-center justify-between gap-2">
                  <span className="leading-tight">{s.title}</span>
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-muted-foreground group-hover:text-foreground group-hover:rotate-12 transition" />
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
                <div className="mt-3 sm:mt-5 hidden sm:flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <span
                      key={it}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
