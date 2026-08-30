import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Upload, Loader2, Sparkles } from "lucide-react";
import type { ResumeData, Education, WorkExperience, Skill, Language } from "@/lib/resume-types";
import { useI18n } from "@/lib/i18n";
import { SUPPORTED_LOCALES, localeFlags, localeNames, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { AIAssistButton } from "./AIAssistButton";
import { VoiceInputButton } from "./VoiceInputButton";
import { PremiumUpsellDialog } from "./PremiumUpsellDialog";
import { useEntitlements } from "@/lib/entitlements";


import { useServerFn } from "@tanstack/react-start";
import { generateCoverLetter } from "@/lib/resume-ai.functions";
import { toast } from "sonner";

interface ResumeFormProps {
  data: ResumeData;
  onChange: (updater: (prev: ResumeData) => ResumeData) => void;
  /** When provided, the form is driven by an external wizard and hides its own tab bar. */
  step?: string;
}

export const resumeStepIds = ["personal", "experience", "education", "skills", "cover-letter", "settings"] as const;
export type ResumeStepId = (typeof resumeStepIds)[number];

const stepIds = resumeStepIds;


const stepLabelKeys = {
  personal: "tab.personal",
  experience: "tab.experience",
  education: "tab.education",
  skills: "tab.skills",
  "cover-letter": "tab.coverLetter",
  settings: "tab.settings",
} as const;

const levelKeys = ["native", "fluent", "advanced", "intermediate", "beginner"] as const;

function isRTL(text: string) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

export function ResumeForm({ data, onChange, step: controlledStep }: ResumeFormProps) {
  const [internalStep, setInternalStep] = useState<string>("personal");
  const activeStep = controlledStep ?? internalStep;

  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const createCoverLetter = useServerFn(generateCoverLetter);
  const { premium } = useEntitlements();
  const [showUpsell, setShowUpsell] = useState(false);

  const handleGenerateCoverLetter = async () => {
    if (!premium) {
      setShowUpsell(true);
      return;
    }
    if (!company.trim()) {
      toast.error(t("cover.needCompany"));
      return;
    }
    setIsGenerating(true);

    try {
      const result = await createCoverLetter({
        data: {
          resume: {
            personalDetails: {
              fullName: data.personalDetails.fullName || "",
              email: data.personalDetails.email || "",
              phone: data.personalDetails.phone || "",
              location: data.personalDetails.location || "",
            },
            settings: {
              language: data.settings.language,
              targetPosition: data.settings.targetPosition || "",
            },
            workExperience: data.workExperience.map((w) => ({
              position: w.position,
              company: w.company,
              description: w.description,
            })),
            education: data.education.map((e) => ({
              degree: e.degree,
              institution: e.institution,
            })),
          },
          company: company.trim(),
          jobDescription: jobDescription.trim() || undefined,
        },
      });
      onChange((prev) => ({ ...prev, coverLetter: result.text }));
      toast.success(t("cover.created"));
    } catch {
      toast.error(t("cover.failed"));
    } finally {
      setIsGenerating(false);
    }
  };


  const updatePersonal = (field: keyof ResumeData["personalDetails"], value: string) => {
    onChange((prev) => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [field]: value },
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updatePersonal("photo", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addWorkExperience = () => {
    const item: WorkExperience = {
      id: crypto.randomUUID(),
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onChange((prev) => ({ ...prev, workExperience: [...prev.workExperience, item] }));
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: string) => {
    onChange((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeWorkExperience = (id: string) => {
    onChange((prev) => ({ ...prev, workExperience: prev.workExperience.filter((item) => item.id !== id) }));
  };

  const addEducation = () => {
    const item: Education = {
      id: crypto.randomUUID(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onChange((prev) => ({ ...prev, education: [...prev.education, item] }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeEducation = (id: string) => {
    onChange((prev) => ({ ...prev, education: prev.education.filter((item) => item.id !== id) }));
  };

  const addSkill = () => {
    const item: Skill = { id: crypto.randomUUID(), name: "", level: "intermediate" };
    onChange((prev) => ({ ...prev, skills: [...prev.skills, item] }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    onChange((prev) => ({
      ...prev,
      skills: prev.skills.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeSkill = (id: string) => {
    onChange((prev) => ({ ...prev, skills: prev.skills.filter((item) => item.id !== id) }));
  };

  const addLanguage = () => {
    const item: Language = { id: crypto.randomUUID(), name: "", level: "fluent" };
    onChange((prev) => ({ ...prev, languages: [...prev.languages, item] }));
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    onChange((prev) => ({
      ...prev,
      languages: prev.languages.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeLanguage = (id: string) => {
    onChange((prev) => ({ ...prev, languages: prev.languages.filter((item) => item.id !== id) }));
  };

  return (
    <div className="h-full overflow-y-auto">
      <Tabs value={activeStep} onValueChange={setInternalStep} className="w-full">
        {!controlledStep && (
          <div className="sticky top-[57px] z-40 border-b border-border bg-background/95 px-4 py-2 backdrop-blur-md">
            <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-transparent p-0 sm:grid-cols-6">
              {stepIds.map((step) => (
                <TabsTrigger
                  key={step}
                  value={step}
                  className="truncate rounded-md px-1 py-1.5 text-[10px] font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:text-xs"
                >
                  {t(stepLabelKeys[step])}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        )}

        <div className="p-4 pb-8 lg:p-6">
          <TabsContent value="personal" className="mt-0 space-y-6">
            <Card>

              <CardHeader>
                <CardTitle>{t("form.personalTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {data.personalDetails.photo ? (
                      <img src={data.personalDetails.photo} alt="Profil" className="h-full w-full object-cover" />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="photo-upload">{t("form.photoLabel")}</Label>
                    <Input
                      id="photo-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="fullName">{t("form.fullName")}</Label>
                    <Input
                      id="fullName"
                      value={data.personalDetails.fullName}
                      onChange={(e) => updatePersonal("fullName", e.target.value)}
                      placeholder="Max Mustermann"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">{t("form.dateOfBirth")}</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={data.personalDetails.dateOfBirth}
                      onChange={(e) => updatePersonal("dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">{t("form.location")}</Label>
                    <Input
                      id="location"
                      value={data.personalDetails.location}
                      onChange={(e) => updatePersonal("location", e.target.value)}
                      placeholder="Berlin, Deutschland"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("form.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.personalDetails.email}
                      onChange={(e) => updatePersonal("email", e.target.value)}
                      placeholder="max@beispiel.de"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("form.phone")}</Label>
                    <Input
                      id="phone"
                      value={data.personalDetails.phone}
                      onChange={(e) => updatePersonal("phone", e.target.value)}
                      placeholder="+49 170 1234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={data.personalDetails.linkedin}
                      onChange={(e) => updatePersonal("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/maxmustermann"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={data.personalDetails.website}
                      onChange={(e) => updatePersonal("website", e.target.value)}
                      placeholder="maxmustermann.de"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">{t("form.summary")}</Label>
                  <div className="relative">
                    <Textarea
                      id="summary"
                      value={data.personalDetails.summary}
                      onChange={(e) => updatePersonal("summary", e.target.value)}
                      placeholder={t("form.summaryPlaceholder")}
                      rows={4}
                      className={cn("pb-10", isRTL(data.personalDetails.summary || "") && "text-right")}
                      dir={isRTL(data.personalDetails.summary || "") ? "rtl" : "ltr"}
                    />
                    <VoiceInputButton
                      className="absolute right-10 bottom-2"
                      onTranscript={(text) =>
                        updatePersonal(
                          "summary",
                          data.personalDetails.summary ? `${data.personalDetails.summary} ${text}` : text
                        )
                      }
                    />
                    <AIAssistButton
                      text={data.personalDetails.summary || ""}
                      language={data.settings.language}
                      context={t("form.summaryContext")}
                      onResult={(text) => updatePersonal("summary", text)}
                    />
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("tab.experience")}</h3>
              <Button size="sm" onClick={addWorkExperience}>
                <Plus className="mr-1.5 h-4 w-4" /> {t("form.add")}
              </Button>
            </div>
            {data.workExperience.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  {t("form.emptyExperience")}
                </CardContent>
              </Card>
            )}
            {data.workExperience.map((item, index) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">{`${t("form.entry")} ${index + 1}`}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => removeWorkExperience(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("form.position")}</Label>
                      <Input
                        value={item.position}
                        onChange={(e) => updateWorkExperience(item.id, "position", e.target.value)}
                        placeholder="Projektmanager"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("form.company")}</Label>
                      <Input
                        value={item.company}
                        onChange={(e) => updateWorkExperience(item.id, "company", e.target.value)}
                        placeholder="Muster GmbH"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("form.location")}</Label>
                      <Input
                        value={item.location}
                        onChange={(e) => updateWorkExperience(item.id, "location", e.target.value)}
                        placeholder="Hamburg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("form.period")}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.startDate}
                          onChange={(e) => updateWorkExperience(item.id, "startDate", e.target.value)}
                          placeholder="MM/YYYY"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          value={item.endDate}
                          onChange={(e) => updateWorkExperience(item.id, "endDate", e.target.value)}
                          placeholder="MM/YYYY oder heute"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("form.description")}</Label>
                    <div className="relative">
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateWorkExperience(item.id, "description", e.target.value)}
                        placeholder={t("form.experienceDescPlaceholder")}
                        rows={4}
                        className={cn("pb-10", isRTL(item.description) && "text-right")}
                        dir={isRTL(item.description) ? "rtl" : "ltr"}
                      />
                      <VoiceInputButton
                        className="absolute right-10 bottom-2"
                        onTranscript={(text) =>
                          updateWorkExperience(
                            item.id,
                            "description",
                            item.description ? `${item.description} ${text}` : text
                          )
                        }
                      />
                      <AIAssistButton
                        text={item.description}
                        language={data.settings.language}
                        context={`${t("tab.experience")}: ${item.position} – ${item.company}`}
                        onResult={(text) => updateWorkExperience(item.id, "description", text)}
                      />

                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="education" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("tab.education")}</h3>
              <Button size="sm" onClick={addEducation}>
                <Plus className="mr-1.5 h-4 w-4" /> {t("form.add")}
              </Button>
            </div>
            {data.education.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  {t("form.emptyEducation")}
                </CardContent>
              </Card>
            )}
            {data.education.map((item, index) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">{`${t("form.entry")} ${index + 1}`}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => removeEducation(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("form.degree")}</Label>
                      <Input
                        value={item.degree}
                        onChange={(e) => updateEducation(item.id, "degree", e.target.value)}
                        placeholder="Bachelor of Arts"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("form.institution")}</Label>
                      <Input
                        value={item.institution}
                        onChange={(e) => updateEducation(item.id, "institution", e.target.value)}
                        placeholder="Universität Musterstadt"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("form.location")}</Label>
                      <Input
                        value={item.location}
                        onChange={(e) => updateEducation(item.id, "location", e.target.value)}
                        placeholder="Musterstadt"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("form.period")}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.startDate}
                          onChange={(e) => updateEducation(item.id, "startDate", e.target.value)}
                          placeholder="MM/YYYY"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          value={item.endDate}
                          onChange={(e) => updateEducation(item.id, "endDate", e.target.value)}
                          placeholder="MM/YYYY"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("form.description")}</Label>
                    <div className="relative">
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateEducation(item.id, "description", e.target.value)}
                        placeholder={t("form.educationDescPlaceholder")}
                        rows={3}
                        className={cn("pb-10", isRTL(item.description) && "text-right")}
                        dir={isRTL(item.description) ? "rtl" : "ltr"}
                      />
                      <AIAssistButton
                        text={item.description}
                        language={data.settings.language}
                        context={`${t("tab.education")}: ${item.degree} – ${item.institution}`}
                        onResult={(text) => updateEducation(item.id, "description", text)}
                      />
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{t("form.skills")}</CardTitle>
                <Button size="sm" onClick={addSkill}>
                  <Plus className="mr-1.5 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t("form.emptySkills")}</p>
                )}
                {data.skills.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Input
                      value={item.name}
                      onChange={(e) => updateSkill(item.id, "name", e.target.value)}
                      placeholder="z. B. Projektmanagement"
                      className="flex-1"
                    />
                    <Select value={item.level ?? ""} onValueChange={(v) => updateSkill(item.id, "level", v)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {levelKeys.map((key) => (
                          <SelectItem key={key} value={key}>
                            {t(`level.${key}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeSkill(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{t("form.languages")}</CardTitle>
                <Button size="sm" onClick={addLanguage}>
                  <Plus className="mr-1.5 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.languages.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t("form.emptyLanguages")}</p>
                )}
                {data.languages.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Input
                      value={item.name}
                      onChange={(e) => updateLanguage(item.id, "name", e.target.value)}
                      placeholder="z. B. Englisch"
                      className="flex-1"
                    />
                    <Select value={item.level} onValueChange={(v) => updateLanguage(item.id, "level", v)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {levelKeys.map((key) => (
                          <SelectItem key={key} value={key}>
                            {t(`level.${key}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeLanguage(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cover-letter" className="mt-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("cover.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!premium && (
                  <p className="rounded-md border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
                    {t("cover.premiumHint")}
                  </p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="company">{t("cover.company")}</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={t("cover.companyPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">{t("cover.jobDescription")}</Label>
                  <Textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder={t("cover.jobDescriptionPlaceholder")}
                    rows={5}
                  />
                </div>
                <Button className="w-full" onClick={handleGenerateCoverLetter} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("cover.generating")}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> {t("cover.generate")}
                    </>
                  )}
                </Button>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">{t("cover.editable")}</Label>
                  <Textarea
                    id="coverLetter"
                    value={data.coverLetter || ""}
                    onChange={(e) => onChange((prev) => ({ ...prev, coverLetter: e.target.value }))}
                    placeholder={t("cover.placeholder")}
                    rows={16}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-0 space-y-6">

            <Card>
              <CardHeader>
                <CardTitle>{t("form.outputSettings")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("form.outputLanguage")}</Label>
                  <Select
                    value={data.settings.language}
                    onValueChange={(v) =>
                      onChange((prev) => ({ ...prev, settings: { ...prev.settings, language: v as Locale } }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LOCALES.map((code) => (
                        <SelectItem key={code} value={code}>
                          {localeFlags[code]} {localeNames[code]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("form.template")}</Label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(["minimalist", "modern", "european"] as const).map((template) => (
                      <button
                        key={template}
                        type="button"
                        onClick={() =>
                          onChange((prev) => ({ ...prev, settings: { ...prev.settings, template } }))
                        }
                        className={cn(
                          "rounded-lg border p-4 text-left transition-colors hover:bg-accent",
                          data.settings.template === template && "border-primary bg-primary/5"
                        )}
                      >
                        <div className="text-sm font-medium text-foreground">{t(`template.${template}`)}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {template === "minimalist" && t("template.minimalistDesc")}
                          {template === "modern" && t("template.modernDesc")}
                          {template === "european" && t("template.europeanDesc")}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="targetPosition">{t("form.targetPosition")}</Label>
                  <Input
                    id="targetPosition"
                    value={data.settings.targetPosition || ""}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, targetPosition: e.target.value },
                      }))
                    }
                    placeholder={t("form.targetPositionPlaceholder")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      <PremiumUpsellDialog open={showUpsell} onOpenChange={setShowUpsell} feature="cover-letter" />
    </div>

  );
}
