export interface ProjectLink {
  repo?: string;
  demo?: string;
  article?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  links: ProjectLink;
}

export interface PortfolioPageAttributes {
  title: string;
  intro: string;
  view_more: string;
  projects: Project[];
}
