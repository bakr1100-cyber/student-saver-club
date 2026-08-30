export interface AccentPreset {
  id: string;
  /** Solid accent colour (used for headers, bullets, badges). */
  color: string;
  /** Very light tint of the accent (used for sidebars). */
  soft: string;
}

export const accentPresets: AccentPreset[] = [
  { id: "slate", color: "#0f172a", soft: "#f1f5f9" },
  { id: "petrol", color: "#0f766e", soft: "#eef8f6" },
  { id: "navy", color: "#1e3a8a", soft: "#eef2fd" },
  { id: "burgundy", color: "#7f1d3a", soft: "#fdf0f4" },
  { id: "forest", color: "#166534", soft: "#eff8f0" },
  { id: "violet", color: "#5b21b6", soft: "#f4f0fe" },
];

export const defaultAccentId = "slate";

export function getAccent(id?: string): AccentPreset {
  return accentPresets.find((preset) => preset.id === id) ?? accentPresets[0]!;
}
