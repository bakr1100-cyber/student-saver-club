import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Sparkles, Shield, Globe, Download } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

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
    { icon: Download, title: t("features.pdf.title"), description: t("features.pdf.desc") },
    { icon: Shield, title: t("features.noSub.title"), description: t("features.noSub.desc") },
    { icon: CheckCircle, title: t("features.voice.title"), description: t("features.voice.desc") },
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
    { name: "Anja Fischer", role: t("testimonials.1.role"), text: t("testimonials.1.text") },
    { name: "Maximilian Weber", role: t("testimonials.2.role"), text: t("testimonials.2.text") },
    { name: "Jan Klasen", role: t("testimonials.3.role"), text: t("testimonials.3.text") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <FileText className="h-6 w-6 text-primary" />
            {t("brand.name")}
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#funktionen" className="text-muted-foreground hover:text-foreground">{t("nav.features")}</a>
            <a href="#preise" className="text-muted-foreground hover:text-foreground">{t("nav.pricing")}</a>
            <a href="#bewertungen" className="text-muted-foreground hover:text-foreground">{t("nav.reviews")}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button size="sm" asChild>
              <Link to="/editor">{t("nav.createResume")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            {t("hero.badge")}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t("hero.title")} <span className="text-primary">{t("hero.titleAccent")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{t("hero.subtitle")}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/editor">{t("hero.ctaPrimary")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/editor">{t("hero.ctaSecondary")}</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> {t("hero.trust1")}</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> {t("hero.trust2")}</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> {t("hero.trust3")}</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30 px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="funktionen" className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("features.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("features.subtitle")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/60">
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">{t("how.title")}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="relative rounded-2xl bg-background p-6 shadow-sm">
                <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.step}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preise" className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("pricing.title")}</h2>
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
                  <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                  <div className="mt-2 text-3xl font-bold text-foreground">{tier.price}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{tier.desc}</p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
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
      <section id="bewertungen" className="bg-muted/30 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">{t("testimonials.title")}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="border-border/60">
                <CardContent className="pt-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-primary text-primary" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-foreground">&laquo;{item.text}&raquo;</p>
                  <div className="mt-4 text-sm font-medium text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight">{t("cta.title")}</h2>
          <p className="mt-4 text-primary-foreground/80">{t("cta.subtitle")}</p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link to="/editor">{t("cta.button")}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-lg font-bold text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              {t("brand.name")}
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">{t("footer.terms")}</a>
              <a href="#" className="hover:text-foreground">{t("footer.privacy")}</a>
              <a href="#" className="hover:text-foreground">{t("footer.imprint")}</a>
              <a href="#" className="hover:text-foreground">{t("footer.usage")}</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground">{t("footer.copyright")}</div>
        </div>
      </footer>
    </div>
  );
}
