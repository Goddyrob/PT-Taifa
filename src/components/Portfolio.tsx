import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, MessageCircle, Eye, X, Tag, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OrderModal } from "./OrderModal";

type Work = {
  id: string;
  img: string;
  title?: string;
  cat: string;
  price: number | null;
  description?: string | null;
  tags?: string[];
  gallery?: string[];
};

function fmt(p: number | null) {
  if (!p) return "On request";
  return `KSh ${Number(p).toLocaleString()}`;
}

export function Portfolio() {
  const [active, setActive] = useState("All");
  const [works, setWorks] = useState<Work[]>([]);
  const [open, setOpen] = useState<Work | null>(null);
  const [orderFor, setOrderFor] = useState<Work | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("portfolio_projects")
          .select("id, title, category, price, featured_image, description, tags, gallery")
          .eq("published", true)
          .not("featured_image", "is", null)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading projects:", error);
          return;
        }

        if (data && data.length > 0) {
          setWorks(
            data.map((p: any) => ({
              id: p.id,
              img: p.featured_image,
              title: p.title,
              cat: p.category,
              price: p.price,
              description: p.description,
              tags: p.tags ?? [],
              gallery: p.gallery ?? [],
            })),
          );
        }
      } catch (err) {
        console.error("Failed to load portfolio projects:", err);
      }
    };

    loadProjects();
  }, []);

  const cats = useMemo(() => ["All", ...Array.from(new Set(works.map((w) => w.cat)))], [works]);
  const filtered = active === "All" ? works : works.filter((w) => w.cat === active);

  return (
    <section id="portfolio" className="relative w-full max-w-full overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[24rem] sm:w-[60rem] h-[22rem] sm:h-[30rem] rounded-full bg-[var(--neon-purple)]/10 blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-4">
            Portfolio showcase
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl">
            Showcase your work and <span className="text-gradient">offer custom designs</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Share your portfolio, display starting costs, and let clients order a custom design or the same style.
          </p>
        </motion.div>

        <div className="-mx-4 sm:mx-0 mb-10 overflow-x-auto">
          <div className="flex sm:flex-wrap sm:justify-center gap-2 px-4 sm:px-0 min-w-max sm:min-w-0">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm transition-all ${
                  active === c
                    ? "bg-gradient-primary text-white glow-purple"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filtered.map((w, i) => (
            <motion.article
              key={w.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative flex flex-col rounded-3xl overflow-hidden glass-strong border border-white/10 hover:border-[var(--neon-purple)]/50 transition-all hover:-translate-y-1"
            >
              <div
                onClick={() => setOpen(w)}
                className="relative cursor-pointer overflow-hidden bg-black/30 flex items-center justify-center p-3 min-h-[20rem] sm:min-h-[24rem]"
              >
                <img
                  src={w.img}
                  alt={w.title ?? w.cat}
                  loading="lazy"
                  className="w-full h-auto max-h-[34rem] object-contain group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider font-semibold text-[var(--neon-purple)]">
                  {w.cat}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setOpen(w); }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur grid place-items-center hover:bg-gradient-primary hover:text-white transition"
                  aria-label="Quick view"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col flex-1 p-3 sm:p-5">
                <h3 className="font-display font-bold text-sm sm:text-lg leading-tight line-clamp-1">
                  {w.title || w.cat}
                </h3>
                {w.description && (
                  <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2 hidden sm:block">
                    {w.description}
                  </p>
                )}

                {w.tags && w.tags.length > 0 && (
                  <div className="mt-2 sm:mt-3 hidden sm:flex flex-wrap gap-1.5">
                    {w.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] glass text-muted-foreground"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2 sm:mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">
                      Starting at
                    </div>
                    <div className="font-display font-bold text-base sm:text-xl text-gradient">
                      {fmt(w.price)}
                    </div>
                  </div>
                  <div className="hidden sm:inline-flex items-center gap-1 text-[10px] text-green-400">
                    <Check className="w-3 h-3" /> Custom work
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setOpen(w)}
                    className="inline-flex items-center justify-center gap-1 px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-xl glass text-[11px] sm:text-xs font-semibold hover:bg-white/10 transition"
                  >
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Details
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrderFor(w);
                    }}
                    className="inline-flex items-center justify-center gap-1 px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-primary text-white text-[11px] sm:text-xs font-semibold glow-purple hover:scale-[1.02] transition"
                  >
                    <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Order
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md grid place-items-center p-4"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl glass-strong rounded-3xl border border-white/10 max-h-[90svh] overflow-y-auto"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur grid place-items-center hover:bg-gradient-primary hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="bg-black/40 rounded-t-3xl overflow-hidden flex items-center justify-center p-2">
                <img src={open.img} alt={open.title} className="w-full max-h-[60svh] object-contain" />
              </div>

              <div className="p-6 sm:p-8">
                <div className="text-xs uppercase tracking-wider text-[var(--neon-purple)]">
                  {open.cat}
                </div>
                <h3 className="mt-1 font-display font-bold text-2xl sm:text-3xl">{open.title}</h3>
                {open.description && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {open.description}
                  </p>
                )}

                {open.tags && open.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {open.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-[11px] glass">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {open.gallery && open.gallery.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {open.gallery.map((g, i) => (
                      <img
                        key={i}
                        src={g}
                        alt={`${open.title || open.cat} ${i + 1}`}
                        className="w-full h-40 object-contain rounded-xl bg-black/10"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-white/10">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Starting at
                    </div>
                    <div className="font-display font-bold text-3xl text-gradient">
                      {fmt(open.price)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { const o = open; setOpen(null); setOrderFor(o); }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-green-500 text-white font-semibold shadow-[0_10px_30px_-5px_rgba(34,197,94,0.6)] hover:scale-[1.02] transition"
                  >
                    <MessageCircle className="w-4 h-4" /> Order on WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <OrderModal project={orderFor} onClose={() => setOrderFor(null)} />
    </section>
  );
}
