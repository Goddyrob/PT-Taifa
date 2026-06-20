import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WHATSAPP = "254719790799";

export type OrderProject = {
  id: string;
  title: string;
  cat: string;
  price: number | null;
};

function fmt(p: number | null) {
  return p ? `KSh ${Number(p).toLocaleString()}` : "On request";
}

export function OrderModal({
  project,
  onClose,
}: {
  project: OrderProject | null;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [project]);

  if (!project) return null;
  if (typeof document === "undefined") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    setSubmitting(true);
    // Open a blank tab synchronously so popup blockers treat it as a user gesture.
    const popup = window.open("about:blank", "_blank");
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          buyer_name: name.trim(),
          buyer_phone: phone.trim(),
          buyer_email: email.trim() || null,
          notes: notes.trim() || null,
          source: "whatsapp",
          status: "pending",
          total_amount: project.price ?? 0,
        })
        .select("id")
        .single();
      if (error) throw error;

      const { error: itemErr } = await supabase.from("order_items").insert({
        order_id: order.id,
        project_id: project.id.startsWith("f") ? null : project.id,
        title: project.title,
        price: project.price ?? 0,
        quantity: 1,
      });
      if (itemErr) throw itemErr;

      const lines = [
        `Hello PT Taifa Digital Hub 👋`,
        ``,
        `New order request:`,
        `• Project: ${project.title}`,
        `• Category: ${project.cat}`,
        `• Price: ${fmt(project.price)}`,
        ``,
        `My details:`,
        `• Name: ${name}`,
        `• Phone: ${phone}`,
        email ? `• Email: ${email}` : null,
        notes ? `• Notes: ${notes}` : null,
        ``,
        `Order ref: ${order.id.slice(0, 8).toUpperCase()}`,
      ]
        .filter(Boolean)
        .join("\n");

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`;
      if (popup && !popup.closed) {
        popup.location.href = url;
      } else {
        // Popup blocked — navigate current tab as a guaranteed fallback.
        window.location.href = url;
      }
      toast.success("Order placed! Continue on WhatsApp.");
      onClose();
    } catch (err: any) {
      if (popup && !popup.closed) popup.close();
      toast.error(err.message ?? "Could not submit order");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[110] w-full max-w-full min-h-svh bg-background/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden"
      >
        <motion.form
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
          className="relative w-full max-w-md sm:max-w-lg my-auto max-h-[90svh] overflow-y-auto glass-strong rounded-3xl p-6 sm:p-8 border border-white/10"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/80 grid place-items-center hover:bg-gradient-primary hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-xs uppercase tracking-wider text-[var(--neon-purple)]">
            Place order
          </div>
          <h3 className="font-display font-bold text-2xl mt-1 pr-10">{project.title}</h3>
          <div className="text-sm text-muted-foreground mt-1">
            {project.cat} · <span className="text-gradient font-bold">{fmt(project.price)}</span>
          </div>

          <div className="mt-6 space-y-3">
            <Field label="Your name *" value={name} onChange={setName} placeholder="Jane Doe" />
            <Field label="Phone *" value={phone} onChange={setPhone} placeholder="+254 ..." />
            <Field label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Project notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Anything we should know?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[var(--neon-purple)] transition resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-green-500 text-white font-semibold shadow-[0_10px_30px_-5px_rgba(34,197,94,0.6)] hover:scale-[1.02] transition disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Placing order…</>
            ) : (
              <><MessageCircle className="w-4 h-4" /> Confirm & open WhatsApp</>
            )}
          </button>
          <p className="text-[10px] text-muted-foreground text-center mt-3">
            Your order is saved instantly. We'll reply on WhatsApp within minutes.
          </p>
        </motion.form>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

function Field({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-purple)] transition"
      />
    </div>
  );
}
