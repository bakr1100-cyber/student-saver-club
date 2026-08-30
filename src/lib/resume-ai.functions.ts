import { createServerFn } from "@tanstack/react-start";
import {
  CoverLetterInput,
  OptimizeInput,
  ParseResumeInput,
  TranscribeInput,
  TranslateInput,
} from "./resume-ai.schemas";


export const optimizeText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => OptimizeInput.parse(input))
  .handler(async ({ data }) => {
    const { runOptimize } = await import("./resume-ai.server");
    return runOptimize(data);
  });

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data }) => {
    const { runTranslate } = await import("./resume-ai.server");
    return runTranslate(data);
  });

export const generateCoverLetter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CoverLetterInput.parse(input))
  .handler(async ({ data }) => {
    const { runCoverLetter } = await import("./resume-ai.server");
    return runCoverLetter(data);
  });

export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranscribeInput.parse(input))
  .handler(async ({ data }) => {
    const { runTranscribe } = await import("./resume-ai.server");
    return runTranscribe(data);
  });

export const parseResumeText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ParseResumeInput.parse(input))
  .handler(async ({ data }) => {
    const { runParseResume } = await import("./resume-ai.server");
    return runParseResume(data);
  });
