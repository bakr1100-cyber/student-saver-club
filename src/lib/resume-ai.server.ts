import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import type { CoverLetterPayload } from "./resume-ai.schemas";

const MODEL = "google/gemini-3.7-flash";

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("LOVABLE_API_KEY fehlt");
  return createLovableAiGatewayProvider(key);
}

export async function runOptimize(data: { text: string; language: "de" | "en"; context?: string | undefined }) {
  const result = await generateText({
    model: gateway()(MODEL),
    system:
      "Du bist ein erfahrener Karriereberater. Du formulierst Lebenslauf-Einträge professionell und prägnant. " +
      "Verwende starke Aktivverben, quantifiziere Ergebnisse wo möglich und bleibe bei 2-4 Aufzählungspunkten. Gib nur den überarbeiteten Text zurück.",
    prompt: `Kontext: ${data.context || "Berufserfahrung"}\n\nText:\n${data.text}\n\nSprache: ${
      data.language === "en" ? "Englisch" : "Deutsch"
    }\n\nFormuliere den Text professionell um.`,
  });
  return { text: result.text };
}

export async function runTranslate(data: { text: string; targetLanguage: "de" | "en" }) {
  const result = await generateText({
    model: gateway()(MODEL),
    system:
      "Du übersetzt Lebenslauf-Inhalte professionell. Behalte Formatierung und Aufzählungspunkte bei und passe Fachbegriffe an die Zielsprache an. Gib nur die Übersetzung zurück.",
    prompt: `Übersetze folgenden Text ins ${data.targetLanguage === "en" ? "Englische" : "Deutsche"}:\n\n${data.text}`,
  });
  return { text: result.text };
}

export async function runCoverLetter(data: CoverLetterPayload) {
  const en = data.resume.settings.language === "en";
  const experience = data.resume.workExperience
    .map((w) => `- ${w.position} ${en ? "at" : "bei"} ${w.company}: ${w.description}`)
    .join("\n");
  const education = data.resume.education
    .map((e) => `- ${e.degree} ${en ? "at" : "an"} ${e.institution}`)
    .join("\n");

  const prompt = en
    ? `Write a professional cover letter in English for the position "${
        data.resume.settings.targetPosition || "the advertised position"
      }" at ${data.company}.\n\nCandidate: ${data.resume.personalDetails.fullName}\nEmail: ${
        data.resume.personalDetails.email
      }\nPhone: ${data.resume.personalDetails.phone}\nLocation: ${
        data.resume.personalDetails.location
      }\n\nExperience:\n${experience}\n\nEducation:\n${education}${
        data.jobDescription ? `\n\nJob description:\n${data.jobDescription}` : ""
      }\n\nUse a modern, confident tone. Keep it to one page.`
    : `Schreibe ein professionelles Anschreiben auf Deutsch für die Position "${
        data.resume.settings.targetPosition || "die ausgeschriebene Stelle"
      }" bei ${data.company}.\n\nBewerber: ${data.resume.personalDetails.fullName}\nE-Mail: ${
        data.resume.personalDetails.email
      }\nTelefon: ${data.resume.personalDetails.phone}\nOrt: ${
        data.resume.personalDetails.location
      }\n\nErfahrung:\n${experience}\n\nAusbildung:\n${education}${
        data.jobDescription ? `\n\nStellenbeschreibung:\n${data.jobDescription}` : ""
      }\n\nNutze einen modernen, selbstbewussten Ton. Halte es auf eine Seite.`;

  const result = await generateText({
    model: gateway()(MODEL),
    system:
      "Du bist ein erfahrener Bewerbungscoach. Du verfasst Anschreiben, die personalisiert, überzeugend und auf den Arbeitgeber zugeschnitten sind. Vermeide Floskeln und betone relevante Erfahrungen.",
    prompt,
  });
  return { text: result.text };
}

export async function runTranscribe(data: { audioBase64: string; mimeType: string }) {
  const result = await generateText({
    model: gateway()(MODEL),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "Transkribiere die folgende Audioaufnahme wortgetreu. Die Sprache kann Deutsch, Französisch, Englisch oder marokkanisches Arabisch (Darija) sein. Gib ausschließlich den transkribierten Text zurück.",
          },
          { type: "file", data: data.audioBase64, mediaType: data.mimeType },
        ],
      },
    ],
  });
  return { text: result.text };
}
