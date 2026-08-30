import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const OptimizeInput = z.object({
  text: z.string().min(1),
  language: z.enum(["de", "en"]),
  context: z.string().optional(),
});

export const optimizeText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => OptimizeInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("LOVABLE_API_KEY fehlt");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3.7-flash"),
      system:
        "Du bist ein erfahrener Karriereberater. Du formulierst Lebenslauf-Einträge professionell, prägnant und auf Deutsch oder Englisch je nach Anfrage. " +
        "Verwende starke Aktivverben, quantifiziere Ergebnisse wo möglich und bleibe bei 2-4 Aufzählungspunkten.",
      prompt: `Kontext: ${data.context || "Berufserfahrung"}\n\nText:\n${data.text}\n\nSprache: ${data.language === "en" ? "Englisch" : "Deutsch"}\n\nFormuliere den Text professionell um.`,
    });

    return { text };
  });

const TranslateInput = z.object({
  text: z.string().min(1),
  targetLanguage: z.enum(["de", "en"]),
});

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("LOVABLE_API_KEY fehlt");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3.7-flash"),
      system:
        "Du übersetztst Lebenslauf-Inhalte professionell. " +
        "Behalte Formatierung und Aufzählungspunkte bei. Übersetze nicht nur wörtlich, sondern passe Fachbegriffe und Formulierungen an die Zielsprache an.",
      prompt: `Übersetze folgenden Text ins ${data.targetLanguage === "en" ? "Englische" : "Deutsche"}:\n\n${data.text}`,
    });

    return { text };
  });

const CoverLetterInput = z.object({
  resume: z.object({
    personalDetails: z.object({
      fullName: z.string(),
      email: z.string(),
      phone: z.string(),
      location: z.string(),
    }),
    settings: z.object({
      language: z.enum(["de", "en"]),
      targetPosition: z.string().optional(),
    }),
    workExperience: z.array(z.object({
      position: z.string(),
      company: z.string(),
      description: z.string(),
    })),
    education: z.array(z.object({
      degree: z.string(),
      institution: z.string(),
    })),
  }),
  company: z.string().min(1),
  jobDescription: z.string().optional(),
});

export const generateCoverLetter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CoverLetterInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("LOVABLE_API_KEY fehlt");

    const t = data.resume.settings.language === "en";
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = t
      ? `Write a professional cover letter in English for the position "${data.resume.settings.targetPosition || "the advertised position"}" at ${data.company}.\n\nCandidate: ${data.resume.personalDetails.fullName}\nEmail: ${data.resume.personalDetails.email}\nPhone: ${data.resume.personalDetails.phone}\nLocation: ${data.resume.personalDetails.location}\n\nExperience:\n${data.resume.workExperience.map((w) => `- ${w.position} at ${w.company}: ${w.description}`).join("\n")}\n\nEducation:\n${data.resume.education.map((e) => `- ${e.degree} at ${e.institution}`).join("\n")}${data.jobDescription ? `\n\nJob description:\n${data.jobDescription}` : ""}\n\nUse a modern, confident tone. Keep it to one page.`
      : `Schreibe ein professionelles Anschreiben auf Deutsch für die Position "${data.resume.settings.targetPosition || "die ausgeschriebene Stelle"}" bei ${data.company}.\n\nBewerber: ${data.resume.personalDetails.fullName}\nE-Mail: ${data.resume.personalDetails.email}\nTelefon: ${data.resume.personalDetails.phone}\nOrt: ${data.resume.personalDetails.location}\n\nErfahrung:\n${data.resume.workExperience.map((w) => `- ${w.position} bei ${w.company}: ${w.description}`).join("\n")}\n\nAusbildung:\n${data.resume.education.map((e) => `- ${e.degree} an ${e.institution}`).join("\n")}${data.jobDescription ? `\n\nStellenbeschreibung:\n${data.jobDescription}` : ""}\n\nNutze einen modernen, selbstbewussten Ton. Halte es auf eine Seite.`;

    const { text } = await generateText({
      model: gateway("google/gemini-3.7-flash"),
      system:
        "Du bist ein erfahrener Bewerbungscoach. Du verfasst Anschreiben, die personalisiert, überzeugend und auf den Arbeitgeber zugeschnitten sind. Vermeide Floskeln und betone relevante Erfahrungen.",
      prompt,
    });

    return { text };
  });

const TranscribeInput = z.object({
  audioBase64: z.string().min(1),
});

export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranscribeInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("LOVABLE_API_KEY fehlt");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3.7-flash"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Transkribiere die folgende Audioaufnahme ins Deutsche, Französische, Arabische (Darija) oder Englische, je nach Sprache der Aufnahme. Gib nur den transkribierten Text zurück." },
            { type: "audio", data: data.audioBase64, mimeType: "audio/webm" },
          ],
        },
      ],
    });

    return { text };
  });
