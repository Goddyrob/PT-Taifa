import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PT Taifa Digital Hub — Premium Creative Agency in Kenya" },
      {
        name: "description",
        content:
          "Premium graphics design, branding, digital marketing and creative solutions for businesses, creators and professionals across Kenya.",
      },
      { property: "og:title", content: "PT Taifa Digital Hub — Premium Creative Agency" },
      {
        property: "og:description",
        content:
          "Transforming ideas into powerful digital brands. Logos, branding, marketing, video and more.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <WhyUs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
