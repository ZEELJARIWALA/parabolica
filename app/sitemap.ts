import { MetadataRoute } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

const fallbackBlogs = ["p1", "p2", "p3"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const defaultPages = [
        {
            url: "https://parabolica.com",
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1.0,
        },
        {
            url: "https://parabolica.com/f1",
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: "https://parabolica.com/blogs",
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
        {
            url: "https://parabolica.com/shop",
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
    ];

    try {
        const res = await fetch(`${API_BASE}/blogs`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const blogs = await res.json();
            const blogUrls = blogs.map((blog: any) => ({
                url: `https://parabolica.com/blogs/${blog.id}`,
                lastModified: new Date(blog.created_at),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));
            return [...defaultPages, ...blogUrls];
        }
    } catch (e) {
        console.error("Sitemap compilation failed. Using local defaults:", e);
    }

    // Fallback urls mapping
    const fallbackUrls = fallbackBlogs.map((id) => ({
        url: `https://parabolica.com/blogs/${id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [...defaultPages, ...fallbackUrls];
}
