import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  service: z.string().max(80),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export function Contact() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      service: String(fd.get("service") ?? ""),
      message: String(fd.get("message") ?? ""),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        service: parsed.data.service || null,
        message: parsed.data.message,
      });
      setSending(false);
      if (error) {
        toast.error("Could not send. Please try again.");
        return;
      }
      setSent(true);
      form.reset();
      toast.success("Message sent! We'll be in touch shortly.");
      setTimeout(() => setSent(false), 4000);
    } catch (err: any) {
      setSending(false);
      toast.error(
        err?.message?.includes("Supabase")
          ? "Messages are currently unavailable. Contact support directly."
          : "Feature unavailable. Contact support directly.",
      );
    }
  };

  return (
    <section id="contact" className="relative py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-4">
              Let's talk
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl leading-tight">
              Start your <span className="text-gradient">next project</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tell us what you need. We reply within 30 minutes during working
              hours.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: Phone, label: "+254 719 790 799", href: "tel:+254719790799" },
                { icon: Mail, label: "hello@taifahub.co.ke", href: "mailto:hello@taifahub.co.ke" },
                { icon: MapPin, label: "Nairobi, Kenya", href: "#" },
              ].map((i) => (
                <a
                  key={i.label}
                  href={i.href}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl glass grid place-items-center group-hover:bg-gradient-primary transition">
                    <i.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{i.label}</span>
                </a>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              {[Instagram, Facebook, Twitter].map((I, k) => (
                <a
                  key={k}
                  href="#"
                  aria-label="Social link"
                  className="w-11 h-11 rounded-xl glass grid place-items-center hover:bg-gradient-primary transition"
                >
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="glass-strong rounded-3xl p-6 sm:p-8 neon-border space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" name="name" placeholder="Your full name" required />
              <Field label="Phone" name="phone" placeholder="+254..." />
            </div>
            <Field label="Email" name="email" type="email" placeholder="you@email.com" />
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Service</label>
              <select
                name="service"
                defaultValue="Graphics Design"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-purple)] transition"
              >
                <option className="bg-background">Graphics Design</option>
                <option className="bg-background">Branding</option>
                <option className="bg-background">Digital Marketing</option>
                <option className="bg-background">Video & Media</option>
                <option className="bg-background">IT & Online Services</option>
                <option className="bg-background">Government Services</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Project details</label>
              <textarea
                name="message"
                required
                rows={4}
                maxLength={2000}
                placeholder="Tell us about your project..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-purple)] transition resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-primary text-white font-semibold glow-purple hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {sending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : sent ? (
                "Message sent ✨"
              ) : (
                <>Send message <Send className="w-4 h-4" /></>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={type === "email" ? 255 : 100}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-purple)] transition"
      />
    </div>
  );
}
