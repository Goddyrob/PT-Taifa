import { motion } from "framer-motion";
import { Star } from "lucide-react";

const items = [
  {
    name: "Wanjiku M.",
    role: "Founder, Bloom Cafe",
    text: "Taifa rebranded my entire cafe — new logo, packaging, social grid. Sales doubled in two months.",
  },
  {
    name: "David K.",
    role: "Pastor, Grace Church",
    text: "From flyers to livestreams, they handle everything. Always on time, always premium quality.",
  },
  {
    name: "Achieng' O.",
    role: "Creative Director",
    text: "The most professional team I've worked with in Nairobi. Their motion work is world-class.",
  },
  {
    name: "Brian N.",
    role: "Real Estate Agent",
    text: "My CV and personal brand kit landed me three deals in a single quarter. Worth every shilling.",
  },
];

export function Testimonials() {
  const loop = [...items, ...items];

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="font-display font-bold text-3xl sm:text-5xl">
            Loved by <span className="text-gradient">creators</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            What clients say about working with Taifa Digital Hub.
          </p>
        </motion.div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star
                  key={k}
                  className="w-4 h-4 fill-[var(--neon-purple)] text-[var(--neon-purple)]"
                />
              ))}
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed line-clamp-5">
              "{t.text}"
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary grid place-items-center font-display font-bold text-white shrink-0">
                {t.name[0]}
              </div>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
