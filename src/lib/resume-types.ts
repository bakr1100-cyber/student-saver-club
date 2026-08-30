export interface PersonalDetails {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  photo?: string;
  summary?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface WorkExperience {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface ResumeSettings {
  language: "de" | "en";
  template: "minimalist" | "modern" | "european";
  targetPosition?: string;
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  languages: Language[];
  settings: ResumeSettings;
  coverLetter?: string;
}

export const defaultResumeData: ResumeData = {
  personalDetails: {
    fullName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  education: [],
  workExperience: [],
  skills: [],
  languages: [],
  settings: {
    language: "de",
    template: "modern",
  },
};

export const languageLabels: Record<string, { de: string; en: string }> = {
  de: { de: "Deutsch", en: "German" },
  en: { de: "Englisch", en: "English" },
};

export const templateLabels: Record<string, { de: string; en: string }> = {
  minimalist: { de: "Minimalist", en: "Minimalist" },
  modern: { de: "Modern", en: "Modern" },
  european: { de: "Europäisch", en: "European" },
};

export const languageLevelLabels: Record<string, { de: string; en: string }> = {
  native: { de: "Muttersprache", en: "Native" },
  fluent: { de: "Fließend", en: "Fluent" },
  advanced: { de: "Fortgeschritten", en: "Advanced" },
  intermediate: { de: "Mittelstufe", en: "Intermediate" },
  beginner: { de: "Grundkenntnisse", en: "Beginner" },
};
