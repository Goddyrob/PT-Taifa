import { motion } from "framer-motion";
import { ArrowRight, Play, MessageCircle, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  return (
    <section className="relative w-full max-w-full min-h-[100svh] pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      {/* Simple ambient glow */}
      <div className="absolute top-12 left-8 w-48 h-48 rounded-full bg-[var(--neon-blue)]/15 blur-2xl -z-10" />
      <div className="absolute bottom-16 right-10 w-56 h-56 rounded-full bg-[var(--neon-purple)]/15 blur-2xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs sm:text-sm mb-8">
            <Sparkles className="w-4 h-4 text-[var(--neon-purple)]" />
            <span className="text-muted-foreground">Premium Creative Agency · Made in Kenya</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-7xl leading-[1.1] tracking-tight">
            Transforming Ideas Into{" "}
            <span className="text-gradient">Powerful Digital Brands</span>
          </h1>

          <p className="mt-5 sm:mt-6 text-sm sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium graphics design, branding, digital marketing and creative
            solutions for businesses, creators and professionals.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <a
              href="#portfolio"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold glow-purple hover:scale-[1.03] transition-transform"
            >
              View Portfolio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl glass-strong text-white font-semibold hover:bg-white/10 transition"
            >
              <Play className="w-4 h-4" />
              Start Project
            </a>
            <a
              href="https://wa.me/254719790799"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-[var(--neon-purple)]/40 text-white font-semibold hover:bg-[var(--neon-purple)]/10 transition"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          {/* Floating stat chips */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              ["5000+", "Projects"],
              ["98%", "Satisfaction"],
              ["24/7", "Support"],
              ["10+", "Services"],
            ].map(([n, l], i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="glass rounded-2xl p-3 sm:p-4 hover:scale-105 transition-transform"
              >
                <div className="text-lg sm:text-2xl font-display font-bold text-gradient">
                  {n}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground mt-1">{l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
