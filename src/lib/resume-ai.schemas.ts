import { z } from "zod";

export const OptimizeInput = z.object({
  text: z.string().min(1),
  language: z.enum(["de", "en"]),
  context: z.string().optional(),
});

export const TranslateInput = z.object({
  text: z.string().min(1),
  targetLanguage: z.enum(["de", "en"]),
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
      language: z.enum(["de", "en"]),
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

export type CoverLetterPayload = z.infer<typeof CoverLetterInput>;
