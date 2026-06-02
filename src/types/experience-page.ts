export interface Job {
  id: string;
  company: string;
  company_url: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface ExperiencePageAttributes {
  title: string;
  intro: string;
  jobs: Job[];
}
