import { describe, it, expect } from "vitest";
import type {
  ExperiencePageAttributes,
  Job,
} from "../../types/experience-page";

describe("experience-page types", () => {
  it("Job should have all required fields", () => {
    const job: Job = {
      id: "c3ai",
      company: "C3 AI",
      company_url: "https://c3.ai",
      role: "Mid Software Engineer",
      period: "Ene 2023 - May 2025",
      description: ["Worked on full stack applications."],
      technologies: ["React", "TypeScript"],
    };
    expect(job.id).toBe("c3ai");
    expect(job.company).toBe("C3 AI");
    expect(job.technologies).toHaveLength(2);
  });

  it("ExperiencePageAttributes should have title, intro and jobs", () => {
    const exp: ExperiencePageAttributes = {
      title: "Experiencia Profesional",
      intro: "These are some companies...",
      jobs: [
        {
          id: "c3ai",
          company: "C3 AI",
          company_url: "https://c3.ai",
          role: "Mid Software Engineer",
          period: "Ene 2023 - May 2025",
          description: ["Worked on full stack applications."],
          technologies: ["React", "TypeScript"],
        },
      ],
    };
    expect(exp.title).toBe("Experiencia Profesional");
    expect(exp.jobs).toHaveLength(1);
    expect(exp.jobs[0].id).toBe("c3ai");
  });
});
