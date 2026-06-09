export type CategoryTheme = "Tech" | "Running" | "Travel" | "Books";

export interface CategoryConfig {
  theme: CategoryTheme;
  iconName: string;
}

export const CATEGORY_MAP: Record<string, CategoryConfig> = {
  Tech: { theme: "Tech", iconName: "TechIcon" },
  Running: { theme: "Running", iconName: "RunningIcon" },
  Travel: { theme: "Travel", iconName: "TravelIcon" },
  Books: { theme: "Books", iconName: "BookIcon" },
};

export function getCategoryTheme(category: string): CategoryTheme {
  return CATEGORY_MAP[category]?.theme ?? "Tech";
}

export function getIconName(category: string): string {
  return CATEGORY_MAP[category]?.iconName ?? "TechIcon";
}
