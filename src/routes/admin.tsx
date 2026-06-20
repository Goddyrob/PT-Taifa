import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Trash2, Upload, Plus, X, LogOut, Package, ShoppingBag, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — PT Taifa Digital Hub" }] }),
  component: AdminPage,
});

type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  price: number | null;
  tags: string[];
  featured_image: string | null;
  gallery: string[];
  published: boolean;
  created_at: string;
};

const CATEGORIES = ["Logos", "Posters", "Branding", "Social Media", "Packaging", "Motion", "Web Design", "Marketing"];

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function uploadToBucket(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("portfolio").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
  return data.publicUrl;
}

function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading) return <div className="min-h-screen grid place-items-center">Loading…</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <header className="border-b border-border/50 backdrop-blur sticky top-0 z-40 bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-gradient">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/"><Button variant="outline" size="sm">View site</Button></Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs />
      </main>
    </div>
  );
}

function Tabs() {
  const [tab, setTab] = useState<"projects" | "orders" | "messages">("projects");
  return (
    <>
      <div className="flex gap-2 mb-6 border-b border-border/40 overflow-x-auto">
        <TabBtn active={tab === "projects"} onClick={() => setTab("projects")}>
          <Package className="w-4 h-4 mr-2" /> Projects
        </TabBtn>
        <TabBtn active={tab === "orders"} onClick={() => setTab("orders")}>
          <ShoppingBag className="w-4 h-4 mr-2" /> Orders
        </TabBtn>
        <TabBtn active={tab === "messages"} onClick={() => setTab("messages")}>
          <MessageSquare className="w-4 h-4 mr-2" /> Messages
        </TabBtn>
      </div>
      {tab === "projects" ? <ProjectsPanel /> : tab === "orders" ? <OrdersPanel /> : <MessagesPanel />}
    </>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
        active ? "border-[var(--neon-purple)] text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ProjectsPanel() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchProjects = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setProjects((data as Project[]) ?? []);
    setLoadingList(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    fetchProjects();
  };

  if (!user) return null;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl">Portfolio Projects</h2>
          <p className="text-sm text-muted-foreground">{projects.length} project(s)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-primary">
          {showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> New Project</>}
        </Button>
      </div>

      {showForm && (
        <ProjectForm
          userId={user.id}
          onSaved={() => { setShowForm(false); fetchProjects(); }}
        />
      )}

      {loadingList ? (
        <div className="text-center py-12 text-muted-foreground">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 glass rounded-3xl">
          <p className="text-muted-foreground">No projects yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div key={p.id} className="glass-strong rounded-2xl overflow-hidden border border-border/40">
              {p.featured_image && (
                <img src={p.featured_image} alt={p.title} className="w-full aspect-video object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-[var(--neon-purple)] uppercase">{p.category}</div>
                    <div className="font-display font-bold">{p.title || p.category}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${p.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {p.published ? "Live" : "Draft"}
                  </span>
                </div>
                {p.price != null && (
                  <div className="text-sm mt-2">From <span className="font-bold">KSh {Number(p.price).toLocaleString()}</span></div>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tags.slice(0, 4).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

type Order = {
  id: string;
  buyer_name: string;
  buyer_phone: string | null;
  buyer_email: string | null;
  notes: string | null;
  status: "pending" | "contacted" | "paid" | "completed" | "cancelled";
  source: "whatsapp" | "manual" | "paid";
  total_amount: number | null;
  created_at: string;
  order_items?: { id: string; title: string; price: number | null; quantity: number }[];
};

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  contacted: "bg-blue-500/20 text-blue-400",
  paid: "bg-green-500/20 text-green-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-red-500/20 text-red-400",
};

function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(id, title, price, quantity)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setOrders((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: Order["status"]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    fetchOrders();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    fetchOrders();
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid" || o.status === "completed").length,
    revenue: orders
      .filter((o) => o.status === "paid" || o.status === "completed")
      .reduce((s, o) => s + Number(o.total_amount ?? 0), 0),
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Total orders" value={String(stats.total)} />
        <Stat label="Pending" value={String(stats.pending)} />
        <Stat label="Paid" value={String(stats.paid)} />
        <Stat label="Revenue" value={`KSh ${stats.revenue.toLocaleString()}`} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "pending", "contacted", "paid", "completed", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs capitalize transition ${
              filter === s ? "bg-gradient-primary text-white" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading orders…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 glass rounded-3xl">
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="glass-strong rounded-2xl p-5 border border-border/40">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${STATUS_COLORS[o.status]}`}>
                      {o.status}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary uppercase">
                      {o.source}
                    </span>
                  </div>
                  <div className="font-display font-bold text-lg mt-1">{o.buyer_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.buyer_phone}{o.buyer_email ? ` · ${o.buyer_email}` : ""}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {new Date(o.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-muted-foreground">Total</div>
                  <div className="font-display font-bold text-xl text-gradient">
                    KSh {Number(o.total_amount ?? 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {o.order_items && o.order_items.length > 0 && (
                <div className="mt-3 pl-3 border-l-2 border-[var(--neon-purple)]/40 space-y-1">
                  {o.order_items.map((it) => (
                    <div key={it.id} className="text-sm flex justify-between">
                      <span>{it.title} <span className="text-muted-foreground">× {it.quantity}</span></span>
                      <span className="text-muted-foreground">KSh {Number(it.price ?? 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {o.notes && (
                <p className="mt-3 text-sm text-muted-foreground italic">"{o.notes}"</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {o.buyer_phone && (
                  <a
                    href={`https://wa.me/${o.buyer_phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs font-semibold"
                  >
                    WhatsApp
                  </a>
                )}
                {(["pending", "contacted", "paid", "completed", "cancelled"] as const)
                  .filter((s) => s !== o.status)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(o.id, s)}
                      className="px-3 py-1.5 rounded-lg glass text-xs capitalize hover:bg-white/10"
                    >
                      Mark {s}
                    </button>
                  ))}
                <button
                  onClick={() => remove(o.id)}
                  className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-strong rounded-2xl p-4 border border-border/40">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display font-bold text-xl mt-1 text-gradient">{value}</div>
    </div>
  );
}

function ProjectForm({ userId, onSaved }: { userId: string; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [featuredFiles, setFeaturedFiles] = useState<File[]>([]);
  const [gallery, setGallery] = useState<File[]>([]);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const featuredUrls: string[] = [];
      for (const file of featuredFiles) {
        featuredUrls.push(await uploadToBucket(file, userId));
      }

      const galleryUrls: string[] = [];
      for (const f of gallery) galleryUrls.push(await uploadToBucket(f, userId));

      const slugBase = title.trim() || category;
      const slug = `${slugify(slugBase)}-${Math.random().toString(36).slice(2, 6)}`;
      const tagArr = tags.split(",").map((t) => t.trim()).filter(Boolean);

      const storedTitle = title.trim() || category;
      const { error } = await supabase.from("portfolio_projects").insert({
        title: storedTitle,
        slug,
        category,
        description: description || null,
        price: price ? Number(price) : null,
        tags: tagArr,
        featured_image: featuredUrls[0] ?? null,
        gallery: [...featuredUrls.slice(1), ...galleryUrls],
        published,
        created_by: userId,
      });
      if (error) throw error;
      toast.success("Project created!");
      onSaved();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-6 mb-8 space-y-4 border border-border/40">
      <h3 className="font-display font-bold text-lg">New Project</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional title" />
          <p className="text-xs text-muted-foreground mt-1">Leave blank if category already describes the project.</p>
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="desc">Description</Label>
        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (KSh)</Label>
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4500" />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="logo, modern, minimal" />
        </div>
      </div>

      <div>
        <Label htmlFor="featured">Project images *</Label>
        <Input
          id="featured"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFeaturedFiles(Array.from(e.target.files ?? []))}
          required
        />
        {featuredFiles.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{featuredFiles.length} image(s) selected. The first image becomes the card image.</p>
        )}
      </div>

      <div>
        <Label htmlFor="gallery">Extra gallery images</Label>
        <Input
          id="gallery"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setGallery(Array.from(e.target.files ?? []))}
        />
        {gallery.length > 0 && <p className="text-xs text-muted-foreground mt-1">{gallery.length} extra image(s) selected</p>}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Publish immediately
      </label>

      <Button type="submit" disabled={saving} className="bg-gradient-primary w-full">
        <Upload className="w-4 h-4 mr-2" />
        {saving ? "Uploading…" : "Create Project"}
      </Button>
    </form>
  );
}

type ContactMessage = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  message: string;
  status: string;
  created_at: string;
};

function MessagesPanel() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data as ContactMessage[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const markRead = async (id: string) => {
    const { error } = await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
    if (error) return toast.error(error.message);
    fetchItems();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    fetchItems();
  };

  const newCount = items.filter((m) => m.status === "new").length;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl">Contact Messages</h2>
          <p className="text-sm text-muted-foreground">
            {items.length} total · {newCount} new
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading messages…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 glass rounded-3xl">
          <p className="text-muted-foreground">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="glass-strong rounded-2xl p-5 border border-border/40">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${
                      m.status === "new"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {m.status}
                    </span>
                    {m.service && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary uppercase">
                        {m.service}
                      </span>
                    )}
                  </div>
                  <div className="font-display font-bold text-lg mt-1">{m.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.phone}{m.email ? `${m.phone ? " · " : ""}${m.email}` : ""}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm whitespace-pre-wrap">{m.message}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {m.phone && (
                  <a
                    href={`https://wa.me/${m.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs font-semibold"
                  >
                    WhatsApp
                  </a>
                )}
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs font-semibold"
                  >
                    Email
                  </a>
                )}
                {m.status === "new" && (
                  <button
                    onClick={() => markRead(m.id)}
                    className="px-3 py-1.5 rounded-lg glass text-xs hover:bg-white/10"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => remove(m.id)}
                  className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
