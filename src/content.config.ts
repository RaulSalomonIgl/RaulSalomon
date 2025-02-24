import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const blogCollections = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(), // Post title
    description: z.string(), // Short description
    image: z.string(), // Short description
    pubDate: z.coerce.date(), // Publication date
    authorType: z.enum(["self", "external"]), // Author type: 'self' or 'external'
    author: z.string().optional(), // Optional author name (for 'self' posts)
    externalAuthor: z.string().optional(), // Optional external author name (for 'external' posts)
    source: z.string().optional(), // Optional source link for cited posts
    tags: z.array(z.string()).optional(), // Optional tags
    draft: z.boolean().optional(), // Optional draft flag
    featured: z.boolean().optional(), // Optional featured flag
  }),
});

const projectCollections = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    cover: z.string(),
    description: z.string(),
    pages: z.object({
      demo: z.string(),
      repo: z.string(),
    }),
    tags: z.array(z.string()),
    lang: z.string(),
  }),
});

const technologicalCommunityCollections = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tech-communities" }),
  schema: z.object({
    logo: z.string(),
    name: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  posts: blogCollections,
  projects: projectCollections,
  techComunities: technologicalCommunityCollections,
};
