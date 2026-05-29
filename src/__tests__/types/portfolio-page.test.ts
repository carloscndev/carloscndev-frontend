import { describe, it, expect } from "vitest";
import type {
  PortfolioPageAttributes,
  Project,
} from "../../types/portfolio-page";

describe("portfolio-page types", () => {
  it("Project should have all required fields", () => {
    const project: Project = {
      id: "project-1",
      title: "My Project",
      description: "A cool project",
      technologies: ["React", "TypeScript"],
      links: { repo: "https://github.com/user/repo", demo: "https://demo.com" },
    };
    expect(project.id).toBe("project-1");
    expect(project.title).toBe("My Project");
    expect(project.technologies).toHaveLength(2);
    expect(project.links.repo).toContain("github");
  });

  it("PortfolioPageAttributes should have title, intro, view_more and projects", () => {
    const portfolio: PortfolioPageAttributes = {
      title: "My Portfolio",
      intro: "Some projects...",
      view_more: "View more",
      projects: [
        {
          id: "p1",
          title: "Project 1",
          description: "Desc 1",
          technologies: ["Astro"],
          links: {},
        },
      ],
    };
    expect(portfolio.title).toBe("My Portfolio");
    expect(portfolio.view_more).toBe("View more");
    expect(portfolio.projects).toHaveLength(1);
    expect(portfolio.projects[0].links).toEqual({});
  });

  it("Project with empty links should be valid", () => {
    const project: Project = {
      id: "p2",
      title: "Simple Project",
      description: "No links",
      technologies: [],
      links: {},
    };
    expect(project.links.repo).toBeUndefined();
    expect(project.links.demo).toBeUndefined();
    expect(project.links.article).toBeUndefined();
  });
});
