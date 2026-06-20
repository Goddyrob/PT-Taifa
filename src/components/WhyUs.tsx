import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Zap, Shield, Clock, Award } from "lucide-react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString() + suffix);

  useEffect(() => {
    if (inView) {
      const c = animate(mv, to, { duration: 2, ease: "easeOut" });
      return c.stop;
    }
  }, [inView, mv, to]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const items = [
  { icon: Award, n: 5000, suf: "+", label: "Projects Delivered" },
  { icon: Clock, n: 24, suf: "/7", label: "Customer Support" },
  { icon: Zap, n: 98, suf: "%", label: "On-Time Delivery" },
  { icon: Shield, n: 100, suf: "%", label: "Trusted in Kenya" },
];

export function WhyUs() {
  return (
    <section id="why" className="relative py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-4">
              Why choose us
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl leading-tight">
              Built to make your{" "}
              <span className="text-gradient">brand unforgettable</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              We blend strategy, design and technology to ship work that
              actually moves the needle. From startup logos to nationwide
              campaigns — Taifa is the team behind Kenya's most ambitious
              creators.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="px-6 py-3 rounded-2xl bg-gradient-primary text-white font-semibold glow-purple hover:scale-105 transition"
              >
                Start a project
              </a>
              <a
                href="#portfolio"
                className="px-6 py-3 rounded-2xl glass text-white font-semibold hover:bg-white/10 transition"
              >
                See our work
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {items.map((it, i) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl p-4 sm:p-6 neon-border hover:bg-white/[0.06] transition"
              >
                <it.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--neon-purple)] mb-3 sm:mb-4" />
                <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient break-words">
                  <Counter to={it.n} suffix={it.suf} />
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{it.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
