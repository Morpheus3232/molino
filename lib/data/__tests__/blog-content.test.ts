import { describe, expect, test } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/data/blog-content";

describe("BLOG_POSTS", () => {
  test("los slugs no se repiten", () => {
    const slugs = BLOG_POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test.each(BLOG_POSTS.map((p) => [p.slug, p] as const))("%s: la portada existe en public/", (_, post) => {
    expect(existsSync(join(process.cwd(), "public", post.image))).toBe(true);
  });

  test.each(BLOG_POSTS.map((p) => [p.slug, p] as const))("%s: los relacionados son artículos reales", (_, post) => {
    for (const rel of post.related) expect(getBlogPostBySlug(rel), rel).toBeTruthy();
  });
});
