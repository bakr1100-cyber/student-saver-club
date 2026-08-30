import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  FileText,
  Sparkles,
  Shield,
  Globe,
  Download,
  Mic,
  TrendingUp,
  Linkedin,
  MessageSquare,
  Upload,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { motion } from "motion/react";
import { Reveal, Stagger, StaggerItem, HoverLift, AnimatedCounter } from "@/components/motion/Reveal";
import heroImage from "@/assets/hero-professional.png";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OnlineLebenslauf — ATS-geprüfte Lebensläufe mit KI" },
      {
        name: "description",
        content:
          "Erstelle in Minuten einen professionellen, ATS-freundlichen Lebenslauf und Anschreiben in 7 Sprachen. Einmalzahlung, kein Abo.",
      },
      { property: "og:title", content: "OnlineLebenslauf — ATS-geprüfte Lebensläufe mit KI" },
      {
        property: "og:description",
        content:
          "Erstelle in Minuten einen professionellen, ATS-freundlichen Lebenslauf und Anschreiben in 7 Sprachen. Einmalzahlung, kein Abo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

type TemplateCategory = "Minimalist" | "Modern" | "Creative";

const templateCards: Array<{
  id: string;
  category: TemplateCategory;
  badge?: "recommended" | "new" | "european";
  accent: string;
  sidebar?: boolean;
}> = [
  { id: "t1", category: "Minimalist", badge: "recommended", accent: "bg-navy" },
  { id: "t2", category: "Modern", accent: "bg-brand", sidebar: true },
  { id: "t3", category: "Modern", badge: "new", accent: "bg-brand-dark", sidebar: true },
  { id: "t4", category: "Creative", badge: "new", accent: "bg-trust", sidebar: true },
  { id: "t5", category: "Minimalist", badge: "european", accent: "bg-sand" },
  { id: "t6", category: "Modern", accent: "bg-navy", sidebar: true },
  { id: "t7", category: "Creative", accent: "bg-brand", sidebar: true },
  { id: "t8", category: "Minimalist", accent: "bg-brand-dark" },
];

function TemplateThumb({ accent, sidebar }: { accent: string; sidebar?: boolean | undefined }) {
  return (
    <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <div className="flex h-full">
        {sidebar && <div className={`h-full w-1/3 ${accent}`} />}
        <div className="flex-1 space-y-2 p-3">
          {!sidebar && <div className={`h-2 w-2/3 rounded ${accent}`} />}
          <div className="h-1.5 w-1/2 rounded bg-muted-foreground/30" />
          <div className="mt-3 space-y-1">
            <div className="h-1 w-full rounded bg-muted-foreground/20" />
            <div className="h-1 w-11/12 rounded bg-muted-foreground/20" />
            <div className="h-1 w-4/5 rounded bg-muted-foreground/20" />
          </div>
          <div className={`mt-3 h-1.5 w-1/3 rounded ${accent} opacity-70`} />
          <div className="space-y-1">
            <div className="h-1 w-full rounded bg-muted-foreground/20" />
            <div className="h-1 w-10/12 rounded bg-muted-foreground/20" />
            <div className="h-1 w-9/12 rounded bg-muted-foreground/20" />
          </div>
          <div className={`mt-3 h-1.5 w-2/5 rounded ${accent} opacity-70`} />
          <div className="space-y-1">
            <div className="h-1 w-11/12 rounded bg-muted-foreground/20" />
            <div className="h-1 w-8/12 rounded bg-muted-foreground/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const { t } = useI18n();

  const stats = [
    { value: t("stats.1.value"), label: t("stats.1.label") },
    { value: t("stats.2.value"), label: t("stats.2.label") },
    { value: t("stats.3.value"), label: t("stats.3.label") },
  ];

  const features = [
    { icon: FileText, title: t("features.ats.title"), description: t("features.ats.desc") },
    { icon: Sparkles, title: t("features.ai.title"), description: t("features.ai.desc") },
    { icon: Globe, title: t("features.multilingual.title"), description: t("features.multilingual.desc") },
    { icon: TrendingUp, title: t("score.title"), description: t("score.desc") },
    { icon: Download, title: t("features.pdf.title"), description: t("features.pdf.desc") },
    { icon: Shield, title: t("features.noSub.title"), description: t("features.noSub.desc") },
    { icon: Mic, title: t("features.voice.title"), description: t("features.voice.desc") },
    { icon: Upload, title: t("import.title"), description: t("import.desc") },
  ];

  const steps = [
    { step: "1", title: t("how.1.title"), desc: t("how.1.desc") },
    { step: "2", title: t("how.2.title"), desc: t("how.2.desc") },
    { step: "3", title: t("how.3.title"), desc: t("how.3.desc") },
  ];

  const tiers = [
    {
      name: t("pricing.standard.name"),
      price: "9,99 €",
      desc: t("pricing.standard.desc"),
      features: [t("pricing.standard.f1"), t("pricing.standard.f2"), t("pricing.standard.f3"), t("pricing.standard.f4")],
    },
    {
      name: t("pricing.premium.name"),
      price: "15,00 €",
      desc: t("pricing.premium.desc"),
      features: [t("pricing.premium.f1"), t("pricing.premium.f2"), t("pricing.premium.f3"), t("pricing.premium.f4")],
      popular: true,
    },
    {
      name: t("pricing.plus.name"),
      price: "60,00 €",
      desc: t("pricing.plus.desc"),
      features: [t("pricing.plus.f1"), t("pricing.plus.f2"), t("pricing.plus.f3"), t("pricing.plus.f4")],
    },
  ];

  const testimonials = [
    { name: "Anja Fischer", role: t("testimonials.1.role"), city: "Berlin", text: t("testimonials.1.text") },
    { name: "Maximilian Weber", role: t("testimonials.2.role"), city: "Hamburg", text: t("testimonials.2.text") },
    { name: "Jan Klasen", role: t("testimonials.3.role"), city: "Köln", text: t("testimonials.3.text") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-navy">
            <FileText className="h-6 w-6 text-primary" />
            {t("brand.name")}
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#vorlagen" className="text-muted-foreground hover:text-foreground">{t("templates.eyebrow")}</a>
            <a href="#funktionen" className="text-muted-foreground hover:text-foreground">{t("nav.features")}</a>
            <a href="#preise" className="text-muted-foreground hover:text-foreground">{t("nav.pricing")}</a>
            <a href="#bewertungen" className="text-muted-foreground hover:text-foreground">{t("nav.reviews")}</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#kontakt" className="hidden text-sm text-muted-foreground hover:text-foreground lg:inline">
              {t("nav.contact")}
            </a>
            <LanguageSwitcher />
            <Button size="sm" className="uppercase tracking-wide" asChild>
              <Link to="/editor">{t("nav.createResume")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary/50 px-4 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-dark">{t("hero.badge")}</p>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl md:text-6xl">
            {t("hero.title")} <span className="text-primary">{t("hero.titleAccent")}</span>
          </h1>
          <ul className="mx-auto mt-7 max-w-xl space-y-2.5 text-left text-sm text-foreground sm:text-base">
            {[t("hero.bullet1"), t("hero.bullet2"), t("hero.bullet3")].map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="w-full uppercase tracking-wide sm:w-auto" asChild>
              <Link to="/editor">{t("hero.ctaPrimary")}</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full uppercase tracking-wide sm:w-auto" asChild>
              <Link to="/editor">{t("hero.ctaOptimize")}</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-trust" /> {t("hero.trust1")}</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-trust" /> {t("hero.trust2")}</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-trust" /> {t("hero.trust3")}</span>
          </div>
        </div>
      </section>

      {/* Counter + stats */}
      <section className="border-y border-border bg-navy px-4 py-10 text-primary-foreground">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div className="font-mono text-3xl font-bold tracking-widest md:text-4xl">81.838.990</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-primary-foreground/70">
              {t("hero.counterLabel")}
            </div>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-brand">{stat.value}</div>
                <div className="mt-1 text-sm text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="vorlagen" className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-dark">{t("templates.eyebrow")}</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-navy">{t("templates.title")}</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{t("templates.subtitle")}</p>
          <p className="mt-3 text-sm font-semibold text-primary">32 {t("templates.count")}</p>

          <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {templateCards.map((tpl) => (
              <div key={tpl.id} className="group w-44 shrink-0 snap-start sm:w-52">
                <div className="relative">
                  <TemplateThumb accent={tpl.accent} sidebar={tpl.sidebar} />
                  {tpl.badge && (
                    <Badge
                      className="absolute top-2 left-2 text-[10px] uppercase"
                      variant={tpl.badge === "recommended" ? "default" : "secondary"}
                    >
                      {tpl.badge === "recommended"
                        ? t("templates.recommended")
                        : tpl.badge === "new"
                          ? t("templates.new")
                          : t("templates.european")}
                    </Badge>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy">{tpl.category}</span>
                  <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">ATS</span>
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                  <Link to="/editor">{t("templates.use")}</Link>
                </Button>
              </div>
            ))}
          </div>

          <Button variant="ghost" className="mt-2 text-primary" asChild>
            <Link to="/editor">
              {t("templates.viewAll")} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/50 px-4 py-20 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-brand-dark">{t("how.title")}</p>
          <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-navy">
            {t("how.title")} — {t("features.ai.title")}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="relative rounded-2xl bg-background p-6 shadow-sm">
                <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.step}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="uppercase tracking-wide" asChild>
              <Link to="/editor">{t("start.new")}</Link>
            </Button>
            <Button size="lg" variant="outline" className="uppercase tracking-wide" asChild>
              <Link to="/editor">
                <Upload className="mr-1.5 h-4 w-4" />
                {t("start.upload")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Toolkit */}
      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-dark">{t("toolkit.eyebrow")}</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-navy">{t("toolkit.title")}</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{t("toolkit.subtitle")}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: MessageSquare,
                title: t("toolkit.interview.title"),
                desc: t("toolkit.interview.desc"),
                cta: t("toolkit.interview.cta"),
              },
              {
                icon: Linkedin,
                title: t("toolkit.linkedin.title"),
                desc: t("toolkit.linkedin.desc"),
                cta: t("toolkit.linkedin.cta"),
              },
            ].map((item) => (
              <Card key={item.title} className="border-border/60 bg-accent/40">
                <CardContent className="pt-6">
                  <Badge className="bg-trust text-primary-foreground">{t("toolkit.new")}</Badge>
                  <item.icon className="mt-4 h-8 w-8 text-brand-dark" />
                  <h3 className="mt-4 text-lg font-semibold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <Button variant="secondary" size="sm" disabled>
                      {item.cta}
                    </Button>
                    <span className="text-xs text-muted-foreground">{t("toolkit.soon")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funktionen" className="bg-secondary/50 px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy">{t("features.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("features.subtitle")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/60 bg-background">
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 text-base font-semibold text-navy">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preise" className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy">{t("pricing.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("pricing.subtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col ${tier.popular ? "border-primary shadow-md" : "border-border/60"}`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t("pricing.bestseller")}</Badge>
                )}
                <CardContent className="flex flex-1 flex-col pt-6">
                  <h3 className="text-lg font-semibold text-navy">{tier.name}</h3>
                  <div className="mt-2 text-3xl font-bold text-navy">{tier.price}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{tier.desc}</p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-trust" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full" variant={tier.popular ? "default" : "outline"} asChild>
                    <Link to="/editor">{`${tier.name} ${t("pricing.choose")}`}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="bewertungen" className="bg-secondary/50 px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-navy">{t("testimonials.title")}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="border-border/60 bg-background">
                <CardContent className="pt-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-trust text-trust" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-foreground">&laquo;{item.text}&raquo;</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-navy">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.role} · {item.city}
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-trust">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {t("hero.trust3")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-navy px-6 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight">{t("cta.title")}</h2>
          <p className="mt-4 text-primary-foreground/80">{t("cta.subtitle")}</p>
          <Button size="lg" className="mt-8 uppercase tracking-wide" asChild>
            <Link to="/editor">{t("cta.button")}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontakt" className="border-t border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-lg font-bold text-navy">
              <FileText className="h-5 w-5 text-primary" />
              {t("brand.name")}
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">{t("footer.terms")}</a>
              <a href="#" className="hover:text-foreground">{t("footer.privacy")}</a>
              <a href="#" className="hover:text-foreground">{t("footer.imprint")}</a>
              <a href="#" className="hover:text-foreground">{t("footer.usage")}</a>
              <a href="#" className="hover:text-foreground">{t("nav.contact")}</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground">{t("footer.copyright")}</div>
        </div>
      </footer>
    </div>
  );
}
