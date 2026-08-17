import { PUBLIC_WP_API_URL } from "$env/static/public";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").trim();
}

function decodeHtml(text = "") {
  return text
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function getFeaturedImage(post) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large
      ?.source_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    ""
  );
}

function formatCategoryName(category) {
  return decodeHtml(category?.name || category?.slug || "Home Page");
}

function getMainCategory(post, categoriesMap) {
  const postCategories = post.categories || [];

  for (const categoryId of postCategories) {
    const category = categoriesMap[categoryId];

    if (!category) continue;

    return category;
  }

  return null;
}

function getFrontendLink(post, category) {
  const postSlug = post.slug || "";

  if (!postSlug) {
    return "#";
  }

  if (category?.slug === "exhibitions") {
    return `/exhibitions/${postSlug}`;
  }

  if (category?.slug === "paintings") {
    return `/painting/${postSlug}`;
  }

  if (category?.slug === "performances") {
    return `/performances/${postSlug}`;
  }

  return "#";
}

/*
 * Extract the first H2 from the WordPress homepage.
 *
 * The text inside this H2 becomes the text shown
 * in the SvelteKit homepage announcement bar.
 */
function extractHomepageH2(html = "") {
  if (!html) return "";

  const match = html.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i);

  if (!match?.[1]) {
    return "";
  }

  return decodeHtml(stripHtml(match[1]));
}

/*
 * Find the WordPress page being used as the homepage.
 *
 * We first look for common homepage slugs.
 * If those are not available, we fall back to the
 * first published page that contains an H2.
 */
function findHomepagePage(pages = []) {
  const preferredSlugs = [
    "home",
    "homepage",
    "front-page",
    "startseite",
    "start",
  ];

  for (const slug of preferredSlugs) {
    const page = pages.find((item) => item?.slug === slug);

    if (page) {
      return page;
    }
  }

  const pageWithH2 = pages.find((item) =>
    /<h2\b[^>]*>[\s\S]*?<\/h2>/i.test(item?.content?.rendered || ""),
  );

  return pageWithH2 || null;
}

export async function load({ fetch }) {
  const apiBase = PUBLIC_WP_API_URL?.replace(/\/$/, "");

  if (!apiBase) {
    return {
      works: [],
      announcementText: "",
    };
  }

  try {
    const [
      postsResponse,
      categoriesResponse,
      pagesResponse,
    ] = await Promise.all([
      fetch(`${apiBase}/posts?_embed&per_page=100`),
      fetch(`${apiBase}/categories?per_page=100`),

      /*
       * Fetch WordPress pages so we can read the homepage H2.
       */
      fetch(
        `${apiBase}/pages?per_page=100&_fields=id,slug,title,content,status`,
      ),
    ]);

    const posts = postsResponse.ok
      ? await postsResponse.json()
      : [];

    const categories = categoriesResponse.ok
      ? await categoriesResponse.json()
      : [];

    const pages = pagesResponse.ok
      ? await pagesResponse.json()
      : [];

    const categoriesMap = {};

    categories.forEach((category) => {
      categoriesMap[category.id] = category;
    });

    const works = posts.map((post) => {
      const mainCategory = getMainCategory(post, categoriesMap);

      const group = mainCategory
        ? formatCategoryName(mainCategory)
        : "Home Page";

      return {
        id: post.id,
        postSlug: post.slug,
        title: decodeHtml(stripHtml(post.title?.rendered || "")),
        group,
        categorySlug: mainCategory?.slug || "home-page",
        categoryId: mainCategory?.id || null,
        featuredImage: getFeaturedImage(post),
        frontendLink: getFrontendLink(post, mainCategory),
      };
    });

    /*
     * Find the WordPress homepage and extract its H2.
     */
    const homepagePage = findHomepagePage(pages);

    const announcementText = homepagePage
      ? extractHomepageH2(homepagePage.content?.rendered || "")
      : "";

    return {
      works,
      announcementText,
    };
  } catch (error) {
    console.error("Homepage data could not be loaded:", error);

    return {
      works: [],
      announcementText: "",
    };
  }
}