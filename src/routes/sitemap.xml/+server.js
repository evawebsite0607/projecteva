import { PUBLIC_WP_API_URL } from "$env/static/public";

const SITE_URL = "https://www.evaeichinger.com";

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getFrontendPath(post, categoriesMap) {
  const postCategories = post.categories || [];

  for (const categoryId of postCategories) {
    const category = categoriesMap[categoryId];

    if (!category) continue;

    if (category.slug === "paintings") {
      return `/painting/${post.slug}`;
    }

    if (category.slug === "exhibitions") {
      return `/exhibitions/${post.slug}`;
    }

    if (category.slug === "performances") {
      return `/performances/${post.slug}`;
    }
  }

  return null;
}

export async function GET({ fetch }) {
  const staticPages = [
    {
      url: "/",
      priority: "1.0",
      changefreq: "weekly",
    },
    {
      url: "/about",
      priority: "0.8",
      changefreq: "monthly",
    },
    {
      url: "/painting",
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      url: "/exhibitions",
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      url: "/performances",
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      url: "/event",
      priority: "0.8",
      changefreq: "weekly",
    },
    {
      url: "/contact",
      priority: "0.6",
      changefreq: "yearly",
    },
    {
      url: "/archive",
      priority: "0.8",
      changefreq: "weekly",
    },
    {
      url: "/privacy",
      priority: "0.3",
      changefreq: "yearly",
    },
  ];

  let postPages = [];

  try {
    const [postsResponse, categoriesResponse] = await Promise.all([
      fetch(`${PUBLIC_WP_API_URL}/posts?per_page=100`),
      fetch(`${PUBLIC_WP_API_URL}/categories?per_page=100`),
    ]);

    if (postsResponse.ok && categoriesResponse.ok) {
      const posts = await postsResponse.json();
      const categories = await categoriesResponse.json();

      const categoriesMap = {};

      categories.forEach((category) => {
        categoriesMap[category.id] = category;
      });

      postPages = posts
        .map((post) => {
          const path = getFrontendPath(post, categoriesMap);

          if (!path) return null;

          return {
            url: path,
            lastmod: post.modified || post.date || "",
            priority: "0.8",
            changefreq: "monthly",
          };
        })
        .filter(Boolean);
    }
  } catch (error) {
    console.error(
      "Could not generate WordPress sitemap entries:",
      error,
    );
  }

  const pages = [...staticPages, ...postPages];

  const urls = pages
    .map((page) => {
      const loc = `${SITE_URL}${page.url}`;

      return `
  <url>
    <loc>${escapeXml(loc)}</loc>${
      page.lastmod
        ? `
    <lastmod>${escapeXml(page.lastmod)}</lastmod>`
        : ""
    }
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}