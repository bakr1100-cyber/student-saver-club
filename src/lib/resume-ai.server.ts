import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import type { CoverLetterPayload } from "./resume-ai.schemas";
import { localeLanguageNames, type Locale } from "./i18n/locales";

const MODEL = "google/gemini-3.7-flash";

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("LOVABLE_API_KEY fehlt");
  return createLovableAiGatewayProvider(key);
}

function languageName(locale: Locale) {
  return localeLanguageNames[locale] ?? "German";
}

export async function runOptimize(data: { text: string; language: Locale; context?: string | undefined }) {
  const target = languageName(data.language);
  const result = await generateText({
    model: gateway()(MODEL),
    system:
      "You are an experienced career coach who rewrites CV entries so they are professional, concise and ATS-friendly. " +
      "Use strong action verbs, quantify results where possible, keep it to 2-4 bullet points. Return only the rewritten text.",
    prompt: `Context: ${data.context || "Work experience"}\n\nText:\n${data.text}\n\nWrite the result in ${target}.\n\nRewrite the text professionally.`,
  });
  return { text: result.text };
}

export async function runTranslate(data: { text: string; targetLanguage: Locale }) {
  const target = languageName(data.targetLanguage);
  const result = await generateText({
    model: gateway()(MODEL),
    system:
      "You translate CV and cover-letter content professionally. Keep formatting and bullet points, adapt professional terminology to the target language. Return only the translation.",
    prompt: `Translate the following text into ${target}:\n\n${data.text}`,
  });
  return { text: result.text };
}

export async function runCoverLetter(data: CoverLetterPayload) {
  const target = languageName(data.resume.settings.language as Locale);
  const experience = data.resume.workExperience
    .map((w) => `- ${w.position} at ${w.company}: ${w.description}`)
    .join("\n");
  const education = data.resume.education.map((e) => `- ${e.degree} at ${e.institution}`).join("\n");

  const prompt = `Write a professional cover letter entirely in ${target} for the position "${
    data.resume.settings.targetPosition || "the advertised position"
  }" at ${data.company}.\n\nCandidate: ${data.resume.personalDetails.fullName}\nEmail: ${
    data.resume.personalDetails.email
  }\nPhone: ${data.resume.personalDetails.phone}\nLocation: ${
    data.resume.personalDetails.location
  }\n\nExperience:\n${experience}\n\nEducation:\n${education}${
    data.jobDescription ? `\n\nJob description:\n${data.jobDescription}` : ""
  }\n\nUse a modern, confident tone, follow the conventions of business letters in ${target}, and keep it to one page. Return only the letter text.`;

  const result = await generateText({
    model: gateway()(MODEL),
    system:
      "You are an experienced application coach. You write cover letters that are personalised, persuasive and tailored to the employer. Avoid clichés and highlight relevant experience.",
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
              "Transcribe the following audio recording verbatim. The language may be German, French, English, Spanish, Italian, Dutch or Moroccan Arabic (Darija). Return only the transcribed text.",
          },
          { type: "file", data: data.audioBase64, mediaType: data.mimeType },
        ],
      },
    ],
  });
  return { text: result.text };
}

export async function runParseResume(data: { text: string; language: Locale }) {
  const target = languageName(data.language);
  const result = await generateText({
    model: gateway()(MODEL),
    system:
      "You extract structured CV data from raw text. Answer with valid JSON only, no markdown fences, no commentary.",
    prompt: `Extract the CV below into this exact JSON shape:
{"personalDetails":{"fullName":"","dateOfBirth":"","email":"","phone":"","location":"","linkedin":"","website":"","summary":""},
"workExperience":[{"position":"","company":"","location":"","startDate":"YYYY-MM","endDate":"YYYY-MM or empty when current","description":""}],
"education":[{"degree":"","institution":"","location":"","startDate":"YYYY-MM","endDate":"","description":""}],
"skills":[{"name":"","level":""}],
"languages":[{"name":"","level":"native|fluent|advanced|intermediate|beginner"}]}

Keep the wording in ${target}. Use empty strings for unknown values. Never invent facts.

CV text:
${data.text}`,
  });

  const raw = result.text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return { data: JSON.parse(raw) as Record<string, unknown> };
  } catch {
    throw new Error("Resume parsing failed");
  }
}

