import { describe, it, expect } from "vitest";
import type { BlogPageAttributes, BlogPost } from "../../types/blog-page";

describe("blog-page types", () => {
  it("BlogPost should have all required fields", () => {
    const post: BlogPost = {
      id: "post-1",
      title: "My Post",
      link: "/posts/my-post",
      icon: "tech-icon",
      category: "Technology",
      date: "2024-01-01",
      read_time: "5 min",
      resume: "A brief summary",
    };
    expect(post.id).toBe("post-1");
    expect(post.title).toBe("My Post");
    expect(post.icon).toBe("tech-icon");
  });

  it("BlogPageAttributes should have title, intro, view_more and posts", () => {
    const blog: BlogPageAttributes = {
      title: "My Blog",
      intro: "Welcome to my blog",
      view_more: "View more",
      posts: [
        {
          id: "p1",
          title: "Post 1",
          link: "/p1",
          icon: "tech-icon",
          category: "Tech",
          date: "2024-01-01",
          read_time: "3 min",
          resume: "Summary",
        },
      ],
    };
    expect(blog.title).toBe("My Blog");
    expect(blog.posts).toHaveLength(1);
    expect(blog.view_more).toBe("View more");
  });

  it("BlogPageAttributes with empty posts should be valid", () => {
    const blog: BlogPageAttributes = {
      title: "Blog",
      intro: "Posts coming soon",
      view_more: "View more",
      posts: [],
    };
    expect(blog.posts).toHaveLength(0);
  });
});
