import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Upload, Mic } from "lucide-react";
import type { ResumeData, Education, WorkExperience, Skill, Language } from "@/lib/resume-types";
import { languageLevelLabels, templateLabels } from "@/lib/resume-types";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { AIAssistButton } from "./AIAssistButton";
import { useServerFn } from "@tanstack/react-start";
import { generateCoverLetter } from "@/lib/resume-ai.functions";
import { toast } from "sonner";

interface ResumeFormProps {
  data: ResumeData;
  onChange: (updater: (prev: ResumeData) => ResumeData) => void;
}

const steps = [
  { id: "personal", label: "Persönlich" },
  { id: "experience", label: "Berufserfahrung" },
  { id: "education", label: "Ausbildung" },
  { id: "skills", label: "Fähigkeiten" },
  { id: "cover-letter", label: "Anschreiben" },
  { id: "settings", label: "Einstellungen" },
];

function isRTL(text: string) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <Tabs defaultValue="personal" className="w-full">
        <div className="sticky top-[57px] z-40 border-b border-border bg-background/95 px-4 py-2 backdrop-blur-md">
          <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-transparent p-0 sm:grid-cols-6">
            {steps.map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                className="truncate rounded-md px-1 py-1.5 text-[10px] font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:text-xs"
              >
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="p-4 pb-24 lg:p-6">
          <TabsContent value="personal" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Persönliche Daten</CardTitle>
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
                    <Label htmlFor="photo-upload">Profilfoto</Label>
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
                    <Label htmlFor="fullName">Vollständiger Name</Label>
                    <Input
                      id="fullName"
                      value={data.personalDetails.fullName}
                      onChange={(e) => updatePersonal("fullName", e.target.value)}
                      placeholder="Max Mustermann"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Geburtsdatum</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={data.personalDetails.dateOfBirth}
                      onChange={(e) => updatePersonal("dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Ort</Label>
                    <Input
                      id="location"
                      value={data.personalDetails.location}
                      onChange={(e) => updatePersonal("location", e.target.value)}
                      placeholder="Berlin, Deutschland"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.personalDetails.email}
                      onChange={(e) => updatePersonal("email", e.target.value)}
                      placeholder="max@beispiel.de"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
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
                  <Label htmlFor="summary">Profil / Zusammenfassung</Label>
                  <div className="relative">
                    <Textarea
                      id="summary"
                      value={data.personalDetails.summary}
                      onChange={(e) => updatePersonal("summary", e.target.value)}
                      placeholder="Kurze Zusammenfassung deiner Erfahrung und Stärken"
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
                      context="Profil / Zusammenfassung im Lebenslauf"
                      onResult={(text) => updatePersonal("summary", text)}
                    />
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Berufserfahrung</h3>
              <Button size="sm" onClick={addWorkExperience}>
                <Plus className="mr-1.5 h-4 w-4" /> Hinzufügen
              </Button>
            </div>
            {data.workExperience.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  Noch keine Berufserfahrung hinzugefügt.
                </CardContent>
              </Card>
            )}
            {data.workExperience.map((item, index) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Eintrag {index + 1}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => removeWorkExperience(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input
                        value={item.position}
                        onChange={(e) => updateWorkExperience(item.id, "position", e.target.value)}
                        placeholder="Projektmanager"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unternehmen</Label>
                      <Input
                        value={item.company}
                        onChange={(e) => updateWorkExperience(item.id, "company", e.target.value)}
                        placeholder="Muster GmbH"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ort</Label>
                      <Input
                        value={item.location}
                        onChange={(e) => updateWorkExperience(item.id, "location", e.target.value)}
                        placeholder="Hamburg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Zeitraum</Label>
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
                    <Label>Beschreibung</Label>
                    <div className="relative">
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateWorkExperience(item.id, "description", e.target.value)}
                        placeholder="Beschreibe deine Aufgaben und Erfolge"
                        rows={4}
                        className={cn(isRTL(item.description) && "text-right")}
                        dir={isRTL(item.description) ? "rtl" : "ltr"}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 bottom-2 h-8 w-8"
                        type="button"
                        title="Spracheingabe (bald verfügbar)"
                        disabled
                      >
                        <Mic className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="education" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ausbildung</h3>
              <Button size="sm" onClick={addEducation}>
                <Plus className="mr-1.5 h-4 w-4" /> Hinzufügen
              </Button>
            </div>
            {data.education.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  Noch keine Ausbildung hinzugefügt.
                </CardContent>
              </Card>
            )}
            {data.education.map((item, index) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Eintrag {index + 1}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => removeEducation(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Abschluss / Titel</Label>
                      <Input
                        value={item.degree}
                        onChange={(e) => updateEducation(item.id, "degree", e.target.value)}
                        placeholder="Bachelor of Arts"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={item.institution}
                        onChange={(e) => updateEducation(item.id, "institution", e.target.value)}
                        placeholder="Universität Musterstadt"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ort</Label>
                      <Input
                        value={item.location}
                        onChange={(e) => updateEducation(item.id, "location", e.target.value)}
                        placeholder="Musterstadt"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Zeitraum</Label>
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
                    <Label>Beschreibung</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateEducation(item.id, "description", e.target.value)}
                      placeholder="Schwerpunkte, Noten, Projekte"
                      rows={3}
                      className={cn(isRTL(item.description) && "text-right")}
                      dir={isRTL(item.description) ? "rtl" : "ltr"}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Fähigkeiten</CardTitle>
                <Button size="sm" onClick={addSkill}>
                  <Plus className="mr-1.5 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">Noch keine Fähigkeiten hinzugefügt.</p>
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
                        {Object.entries(languageLevelLabels).map(([key, labels]) => (
                          <SelectItem key={key} value={key}>
                            {labels.de}
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
                <CardTitle>Sprachen</CardTitle>
                <Button size="sm" onClick={addLanguage}>
                  <Plus className="mr-1.5 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.languages.length === 0 && (
                  <p className="text-sm text-muted-foreground">Noch keine Sprachen hinzugefügt.</p>
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
                        {Object.entries(languageLevelLabels).map(([key, labels]) => (
                          <SelectItem key={key} value={key}>
                            {labels.de}
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

          <TabsContent value="settings" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ausgabe-Einstellungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Zielsprache</Label>
                  <Select
                    value={data.settings.language}
                    onValueChange={(v) =>
                      onChange((prev) => ({ ...prev, settings: { ...prev.settings, language: v as "de" | "en" } }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="en">Englisch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vorlage</Label>
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
                        <div className="text-sm font-medium text-foreground">{templateLabels[template]?.de ?? template}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {template === "minimalist" && "Schlicht und übersichtlich"}
                          {template === "modern" && "Zeitgemäß mit klarem Fokus"}
                          {template === "european" && "Klassisches europäisches Format"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="targetPosition">Zielposition (optional)</Label>
                  <Input
                    id="targetPosition"
                    value={data.settings.targetPosition || ""}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, targetPosition: e.target.value },
                      }))
                    }
                    placeholder="z. B. Projektmanager"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
