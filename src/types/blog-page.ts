export interface BlogPost {
  id: string;
  title: string;
  link: string;
  icon: string;
  category: string;
  date: string;
  read_time: string;
  resume: string;
}

export interface BlogPageAttributes {
  title: string;
  intro: string;
  view_more: string;
  posts: BlogPost[];
}
