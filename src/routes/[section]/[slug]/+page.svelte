<script>
  import WorkGalleryPage from "$lib/components/WorkGalleryPage.svelte";

  let { data } = $props();
</script>

<WorkGalleryPage
  items={data.items}
  requestedPostSlug={data.requestedPostSlug}
  allLabel={data.config.allLabel}
  itemLabel={data.config.itemLabel}
  itemLabelPlural={data.config.itemLabelPlural}
  themeColor={data.config.themeColor}
  metaTitle={data.config.metaTitle}
  metaDescription={data.config.metaDescription}
/>
