import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    link: z.string().optional(),
    linkText: z.string().default('查看项目'),
    featured: z.boolean().default(true),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
