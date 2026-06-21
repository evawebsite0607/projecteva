export async function load({ fetch }) {
  const response = await fetch(
    "https://testing.zorawebdesign.com/wp-json/wp/v2/pages?slug=about&_embed",
  );

  const pages = await response.json();
  const page = pages[0];

  const content = page.content.rendered;

  const h2Matches = [...content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)];
  const pMatches = [...content.matchAll(/<p[^>]*>(.*?)<\/p>/gs)];

  const h2Items = h2Matches.map((match) => match[1]);
  const pItems = pMatches.map((match) => match[1]);

  const featuredImage =
    page._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large
      ?.source_url ||
    page._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium
      ?.source_url ||
    page._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "";

  return {
    pageTitle: page.title.rendered,
    featuredImage,
    sections: [
      {
        title: h2Items[0],
        text: h2Items.slice(1, 4),
      },
      {
        title: h2Items[4],
        text: pItems,
      },
    ],
  };
}