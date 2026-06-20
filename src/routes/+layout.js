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
    .replace(/&amp;/g, "&");
}

function getFeaturedImage(post) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.thumbnail
      ?.source_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium
      ?.source_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    ""
  );
}

function getYearCategory(post, categoriesMap) {
  const postCategories = post.categories || [];

  for (const categoryId of postCategories) {
    const category = categoriesMap[categoryId];

    if (!category) continue;

    if (/^\d{4}$/.test(category.slug)) {
      return category;
    }

    if (category.parent && categoriesMap[category.parent]) {
      const parentCategory = categoriesMap[category.parent];

      if (/^\d{4}$/.test(parentCategory.slug)) {
        return parentCategory;
      }
    }
  }

  return null;
}

export async function load({ fetch }) {
  const postsResponse = await fetch(
    `${PUBLIC_WP_API_URL}/posts?_embed&per_page=100`,
  );

  const categoriesResponse = await fetch(
    `${PUBLIC_WP_API_URL}/categories?per_page=100`,
  );

  const posts = postsResponse.ok ? await postsResponse.json() : [];
  const categories = categoriesResponse.ok
    ? await categoriesResponse.json()
    : [];

  const categoriesMap = {};

  categories.forEach((category) => {
    categoriesMap[category.id] = category;
  });

  const exhibitionsCategory = categories.find(
    (category) => category.slug === "exhibitions",
  );

  const works = posts.map((post) => {
    const postCategoryIds = post.categories || [];

    const isExhibitionPost = exhibitionsCategory
      ? postCategoryIds.includes(exhibitionsCategory.id)
      : false;

    const yearCategory = getYearCategory(post, categoriesMap);
    const yearSlug = yearCategory ? yearCategory.slug : "";

    return {
      id: post.id,
      label: decodeHtml(stripHtml(post.title?.rendered)),
      yearSlug,
      isExhibitionPost,
      featuredImage: getFeaturedImage(post),
      href: isExhibitionPost
        ? `/exhibitions?post=${post.id}`
        : yearSlug
          ? "/painting"
          : "#",
    };
  });

  const paintingMenuItems = works.filter((work) => !work.isExhibitionPost);

  const exhibitionMenuItems = works.filter((work) => work.isExhibitionPost);

  const eventsResponse = await fetch(
    `${PUBLIC_WP_API_URL}/events?_embed&per_page=100`,
  );

  const eventsData = eventsResponse.ok ? await eventsResponse.json() : [];

  const eventMenuItems = eventsData.map((event) => ({
    id: event.id,
    label: decodeHtml(stripHtml(event.title?.rendered)),
    href: "/event",
    featuredImage:
      event.event_details?.featured_image_url ||
      event._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "",
  }));

  return {
    paintingMenuItems,
    exhibitionMenuItems,
    eventMenuItems,
  };
}