import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Sparkles, Shield, Globe, Download } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OnlineLebenslauf — ATS-geprüfte Lebensläufe mit KI" },
      { name: "description", content: "Erstelle in Minuten einen professionellen, ATS-freundlichen Lebenslauf und Anschreiben. Einmalzahlung, kein Abo." },
      { property: "og:title", content: "OnlineLebenslauf — ATS-geprüfte Lebensläufe mit KI" },
      { property: "og:description", content: "Erstelle in Minuten einen professionellen, ATS-freundlichen Lebenslauf und Anschreiben. Einmalzahlung, kein Abo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const stats = [
  { value: "5,6 Mio", label: "erfolgreich unterstützte Bewerber" },
  { value: "97%", label: "Übereinstimmung mit Recruiter-Kriterien" },
  { value: "2,4x", label: "mehr Profilaufrufe" },
];

const features = [
  {
    icon: FileText,
    title: "ATS-freundliche Vorlagen",
    description: "Jede Vorlage ist auf Bewerbermanagementsysteme optimiert, damit deine Daten fehlerfrei ausgelesen werden.",
  },
  {
    icon: Sparkles,
    title: "KI-Optimierung",
    description: "Gib deine Erfahrung in deiner Sprache ein — unsere KI formuliert sie in professionelles Business-Deutsch oder Englisch.",
  },
  {
    icon: Globe,
    title: "Mehrsprachig",
    description: "Arabisch, Darija, Französisch oder Deutsch — der Editor unterstützt RTL-Eingaben und spricht deine Sprache.",
  },
  {
    icon: Download,
    title: "PDF-Export",
    description: "Lade deinen Lebenslauf und dein Anschreiben als hochwertige PDF herunter — optimiert für Mobile und Desktop.",
  },
  {
    icon: Shield,
    title: "Kein Abo",
    description: "Einmalzahlung ab €9,99. Keine versteckten Kosten, keine automatische Verlängerung.",
  },
  {
    icon: CheckCircle,
    title: "Voice Input",
    description: "Spreche deine Erfahrungen einfach ein — Whisper transkribiert deine Sprachnotizen in Text.",
  },
];

const testimonials = [
  {
    name: "Anja Fischer",
    role: "Dipl. Pflegefachfrau HF, Berlin",
    text: "Der ATS-Score hat mir genau gezeigt, was gefehlt hat. 3 Rückmeldungen in meiner ersten Woche.",
  },
  {
    name: "Maximilian Weber",
    role: "Logistikmitarbeiter, Hamburg",
    text: "Ich hatte vorher null Antworten und dann 4 Vorstellungsgespräche in 10 Tagen. Gleiche Qualifikation — jetzt im richtigen Format.",
  },
  {
    name: "Jan Klasen",
    role: "PTA bei Boots Apotheke, Köln",
    text: "Die Textvorschläge für meine Rolle waren absolut treffsicher. Am Montag beworben, zwei Wochen später hatte ich den Job.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <FileText className="h-6 w-6 text-primary" />
            OnlineLebenslauf
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#funktionen" className="text-muted-foreground hover:text-foreground">Funktionen</a>
            <a href="#preise" className="text-muted-foreground hover:text-foreground">Preise</a>
            <a href="#bewertungen" className="text-muted-foreground hover:text-foreground">Bewertungen</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/editor">Anmelden</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/editor">Lebenslauf erstellen</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            #1 für ATS-geprüfte Lebensläufe · 2026
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Dein perfekter Lebenslauf — <span className="text-primary">schnell und professionell</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Erstelle in wenigen Minuten einen überzeugenden Lebenslauf und ein passendes Anschreiben. 
            Optimiert für deine Zielsprache — Deutsch oder Englisch.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/editor">Jetzt Lebenslauf erstellen</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/editor">Vorlagen ansehen</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Kein Abo</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Einmalzahlung</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> 100% sicher</span>
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Alles, was du für deine Bewerbung brauchst</h2>
            <p className="mt-4 text-muted-foreground">Von der Eingabe bis zum PDF-Download — in drei einfachen Schritten.</p>
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
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">So funktioniert es</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Daten eingeben", desc: "Fülle deine persönlichen Daten, Ausbildung und Berufserfahrung aus — per Text oder Sprache." },
              { step: "2", title: "KI optimiert", desc: "Die KI formuliert deine Erfahrungen in professionelles Business-Deutsch oder Englisch um." },
              { step: "3", title: "PDF herunterladen", desc: "Wähle eine Vorlage, passe das Anschreiben an und lade beide Dokumente herunter." },
            ].map((s) => (
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Transparente Preise</h2>
            <p className="mt-4 text-muted-foreground">Einmal zahlen, für immer nutzen. Kein Abo, keine versteckten Kosten.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Standard", price: "€9,99", desc: "Lebenslauf mit KI-Optimierung und PDF-Download.", features: ["Multi-Step Editor", "KI-Übersetzung", "1 Lebenslauf-Vorlage", "PDF-Download"] },
              { name: "Premium", price: "€15,00", desc: "Lebenslauf + individuelles Anschreiben.", features: ["Alles aus Standard", "KI-Anschreiben", "Alle Vorlagen", "Beide PDFs"], popular: true },
              { name: "Premium Plus", price: "€60,00", desc: "Persönliche 45-Minuten-Session zur Optimierung.", features: ["Alles aus Premium", "45-Minuten Zoom-Call", "Persönliches Feedback", "Job-Matching-Tipps"] },
            ].map((tier) => (
              <Card key={tier.name} className={`relative flex flex-col ${tier.popular ? "border-primary shadow-md" : "border-border/60"}`}>
                {tier.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Bestseller</Badge>}
                <CardContent className="flex flex-1 flex-col pt-6">
                  <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                  <div className="mt-2 text-3xl font-bold text-foreground">{tier.price}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{tier.desc}</p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full" variant={tier.popular ? "default" : "outline"} asChild>
                    <Link to="/editor">{tier.name} wählen</Link>
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
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Echte Menschen. Echte Erfolge.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/60">
                <CardContent className="pt-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-primary text-primary" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-foreground">"{t.text}"</p>
                  <div className="mt-4 text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight">Dein nächster Job ist nur einen Lebenslauf entfernt.</h2>
          <p className="mt-4 text-primary-foreground/80">Schließe dich Millionen erfolgreicher Bewerber an.</p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link to="/editor">Jetzt kostenlos starten</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-lg font-bold text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              OnlineLebenslauf
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">AGB</a>
              <a href="#" className="hover:text-foreground">Datenschutz</a>
              <a href="#" className="hover:text-foreground">Impressum</a>
              <a href="#" className="hover:text-foreground">Nutzungsbedingungen</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground">
            © Copyright 2026 Lead Career SL. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}
