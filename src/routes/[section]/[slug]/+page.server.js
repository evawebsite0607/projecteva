import { PUBLIC_WP_API_URL } from "$env/static/public";
import { error } from "@sveltejs/kit";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").trim();
}

function decodeHtml(text = "") {
  return text
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&");
}

function getFirstH2(post) {
  const html = post.content?.rendered || "";
  const match = html.match(/<h2[^>]*>(.*?)<\/h2>/i);

  return match ? decodeHtml(stripHtml(match[1])) : "";
}

function getFeaturedImage(post) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  if (!media) return null;

  const src =
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.medium_large?.source_url ||
    media.media_details?.sizes?.full?.source_url ||
    media.source_url ||
    "";

  if (!src) return null;

  return {
    src,
    alt:
      decodeHtml(media.alt_text || "") ||
      decodeHtml(stripHtml(post.title?.rendered || "")) ||
      "Image",
  };
}

function extractGalleryImages(post, featuredImage = null) {
  const html = post.content?.rendered || "";
  const images = [];
  const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;

  let match;

  while ((match = regex.exec(html)) !== null) {
    const imgTag = match[0];
    const src = match[1];

    const altMatch = imgTag.match(/alt=["']([^"']*)["']/);

    const alt = altMatch
      ? decodeHtml(altMatch[1])
      : decodeHtml(stripHtml(post.title?.rendered || ""));

    const isDuplicate = images.some((image) => image.src === src);
    const isFeaturedImage =
      featuredImage?.src && src === featuredImage.src;

    if (src && !isDuplicate && !isFeaturedImage) {
      images.push({
        src,
        alt,
      });
    }
  }

  return images;
}

function getPostYear(post) {
  if (!post.date) return "Works";

  return String(new Date(post.date).getFullYear());
}

const sectionConfig = {
  painting: {
    categorySlug: "paintings",
    allLabel: "ALL PAINTINGS",
    itemLabel: "Painting",
    itemLabelPlural: "Paintings",
    themeColor: "#ff5c01",
    metaTitle: "Paintings | Eva Eichinger",
    metaDescription:
      "Explore selected paintings, visual works, image galleries, and contemporary art projects by Eva Eichinger.",
  },

  exhibitions: {
    categorySlug: "exhibitions",
    allLabel: "ALL EXHIBITIONS",
    itemLabel: "Exhibition",
    itemLabelPlural: "Exhibitions",
    themeColor: "#ff5c01",
    metaTitle: "Exhibitions | Eva Eichinger",
    metaDescription:
      "Explore selected exhibitions and exhibition projects by Eva Eichinger.",
  },

  performances: {
    categorySlug: "performances",
    allLabel: "ALL PERFORMANCES",
    itemLabel: "Performance",
    itemLabelPlural: "Performances",
    themeColor: "#ff5c01",
    metaTitle: "Performances | Eva Eichinger",
    metaDescription:
      "Explore selected performances and performance projects by Eva Eichinger.",
  },
};

export async function load({ fetch, params }) {
  const config = sectionConfig[params.section];

  if (!config) {
    throw error(404, "Section not found");
  }

  const categoriesResponse = await fetch(
    `${PUBLIC_WP_API_URL}/categories?per_page=100`,
  );

  if (!categoriesResponse.ok) {
    throw error(500, "Could not load categories");
  }

  const categories = await categoriesResponse.json();

  const category = categories.find(
    (item) => item.slug === config.categorySlug,
  );

  if (!category) {
    throw error(404, "Category not found");
  }

  const postsResponse = await fetch(
    `${PUBLIC_WP_API_URL}/posts?_embed=1&per_page=100&categories=${category.id}`,
  );

  if (!postsResponse.ok) {
    throw error(500, "Could not load posts");
  }

  const posts = await postsResponse.json();

  const items = posts.map((post) => {
    const featuredImage = getFeaturedImage(post);

    return {
      id: post.id,
      year: getPostYear(post),
      postSlug: post.slug,
      title: decodeHtml(stripHtml(post.title?.rendered || "")),
      info: getFirstH2(post),
      featuredImage,
      images: extractGalleryImages(post, featuredImage),
    };
  });

  const selectedItem = items.find(
    (item) => item.postSlug === params.slug,
  );

  if (!selectedItem) {
    throw error(404, "Post not found");
  }

  return {
    items,
    requestedPostSlug: params.slug,
    config,
  };
}