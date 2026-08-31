import { SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import { z } from "zod";

export const OptimizeInput = z.object({
  text: z.string().min(1),
  language: z.enum(SUPPORTED_LOCALES),
  context: z.string().optional(),
});

export const TranslateInput = z.object({
  text: z.string().min(1),
  targetLanguage: z.enum(SUPPORTED_LOCALES),
});

export const CoverLetterInput = z.object({
  resume: z.object({
    personalDetails: z.object({
      fullName: z.string(),
      email: z.string(),
      phone: z.string(),
      location: z.string(),
    }),
    settings: z.object({
      language: z.enum(SUPPORTED_LOCALES),
      targetPosition: z.string().optional(),
    }),
    workExperience: z.array(
      z.object({
        position: z.string(),
        company: z.string(),
        description: z.string(),
      })
    ),
    education: z.array(
      z.object({
        degree: z.string(),
        institution: z.string(),
      })
    ),
  }),
  company: z.string().min(1),
  jobDescription: z.string().optional(),
});

export const TranscribeInput = z.object({
  audioBase64: z.string().min(1),
  mimeType: z.string().default("audio/webm"),
});

export const ParseResumeInput = z.object({
  text: z.string().min(20),
  language: z.enum(SUPPORTED_LOCALES),
});

export const ExperienceSuggestionsInput = z.object({
  position: z.string().min(2),
  company: z.string().optional(),
  language: z.enum(SUPPORTED_LOCALES),
});

export type CoverLetterPayload = z.infer<typeof CoverLetterInput>;

