<script>
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let { data } = $props();

  const initialPerformance =
    data.performances?.find(
      (performance) => performance.id === data.requestedPostId,
    ) || data.performances?.[0];

  let selectedPerformanceSlug = $state(initialPerformance?.postSlug || "");
  let selectedImageIndex = $state(null);
  let hoveredImageIndex = $state(null);
  let performanceGridElement = $state(null);
  let infoExpanded = $state(false);

  let selectedPerformance = $derived(
    data.performances?.find(
      (performance) => performance.postSlug === selectedPerformanceSlug,
    ) || data.performances?.[0],
  );

  let selectedImages = $derived(selectedPerformance?.images || []);

  let selectedImage = $derived(
    selectedImageIndex !== null ? selectedImages[selectedImageIndex] : null,
  );

  let shouldShowInfoToggle = $derived(
    (selectedPerformance?.info || "").length > 200,
  );

  function selectPerformance(performance) {
    selectedPerformanceSlug = performance.postSlug;
    selectedImageIndex = null;
    hoveredImageIndex = null;
    infoExpanded = false;

    if (performanceGridElement) {
      performanceGridElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function setHoveredImage(index) {
    hoveredImageIndex = index;
  }

  function openLightbox(index) {
    selectedImageIndex = index;

    if (browser) {
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    selectedImageIndex = null;

    if (browser) {
      document.body.style.overflow = "";
    }
  }

  function showPreviousImage() {
    if (!selectedImages.length || selectedImageIndex === null) return;

    selectedImageIndex =
      selectedImageIndex === 0
        ? selectedImages.length - 1
        : selectedImageIndex - 1;
  }

  function showNextImage() {
    if (!selectedImages.length || selectedImageIndex === null) return;

    selectedImageIndex =
      selectedImageIndex === selectedImages.length - 1
        ? 0
        : selectedImageIndex + 1;
  }

  function handleKeydown(event) {
    if (selectedImageIndex === null) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPreviousImage();
    if (event.key === "ArrowRight") showNextImage();
  }

  onDestroy(() => {
    if (browser) {
      document.body.style.overflow = "";
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title>Performances | Eva Eichinger</title>

  <meta
    name="description"
    content="Explore selected performances, image galleries, documentation, and contemporary art projects by Eva Eichinger."
  />
</svelte:head>

<main class="performances-page">
  {#if data.performances && data.performances.length > 0}
    <section class="performances-layout" aria-label="Performances">
      <aside class="left-column" aria-label="Performance navigation">
        <div class="navigation-area">
          <div class="section-links">
            <button type="button" class="section-button active">
              Selected Performances
            </button>
          </div>

          <div class="selected-performance-links">
            {#each data.performances as performance, index}
              <button
                type="button"
                class="selected-performance-button"
                class:active={selectedPerformance?.postSlug ===
                  performance.postSlug}
                onclick={() => selectPerformance(performance)}
              >
                <span class="performance-list-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{performance.title}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="performance-preview">
          {#if selectedPerformance}
            <h1>{selectedPerformance.title}</h1>

            <div class="preview-bottom">
              <div class="preview-info">
                {#if selectedPerformance.info}
                  <div
                    class="performance-description"
                    class:expanded={infoExpanded}
                  >
                    <p>{selectedPerformance.info}</p>
                  </div>

                  {#if shouldShowInfoToggle}
                    <button
                      type="button"
                      class="info-toggle"
                      onclick={() => (infoExpanded = !infoExpanded)}
                    >
                      {infoExpanded ? "Less −" : "More +"}
                    </button>
                  {/if}
                {:else}
                  <p>Selected performance images and documentation.</p>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </aside>

      <section class="right-column" aria-label="Performance content">
        {#if selectedPerformance?.images?.length}
          {#key selectedPerformance.postSlug}
            <div class="image-grid" bind:this={performanceGridElement}>
              {#each selectedPerformance.images as image, index}
                <button
                  type="button"
                  class="image-card"
                  class:active={hoveredImageIndex === index}
                  onmouseenter={() => setHoveredImage(index)}
                  onfocus={() => setHoveredImage(index)}
                  onclick={() => openLightbox(index)}
                  aria-label={`Open ${image.alt || selectedPerformance.title}`}
                >
                  <figure>
                    <img
                      src={image.src}
                      alt={image.alt || selectedPerformance.title}
                    />
                  </figure>
                </button>
              {/each}
            </div>
          {/key}
        {:else}
          <p class="empty-message">No images found for this performance.</p>
        {/if}
      </section>
    </section>
  {:else}
    <p class="empty-message">No performance posts found.</p>
  {/if}

  {#if selectedImage}
    <div class="performance-lightbox" role="dialog" aria-modal="true">
      <button
        class="lightbox-close"
        type="button"
        onclick={closeLightbox}
        aria-label="Close image viewer"
      >
        Close ×
      </button>

      <button
        class="lightbox-arrow lightbox-arrow-left"
        type="button"
        onclick={showPreviousImage}
        aria-label="Previous image"
      >
        ←
      </button>

      <div class="lightbox-content">
        <img
          src={selectedImage.src}
          alt={selectedImage.alt || selectedPerformance.title}
        />

        <div class="lightbox-meta">
          {#if selectedImage.alt}
            <p>{selectedImage.alt}</p>
          {:else}
            <p>{selectedPerformance.title}</p>
          {/if}
        </div>
      </div>

      <button
        class="lightbox-arrow lightbox-arrow-right"
        type="button"
        onclick={showNextImage}
        aria-label="Next image"
      >
        →
      </button>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    overflow-x: hidden;
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
    color: #000000;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .performances-page {
    width: 100%;
    min-height: 100vh;
    padding: 96px 90px 90px 28px;
    background: #ffffff;
  }

  .performances-layout {
    width: 100%;
    display: grid;
    grid-template-columns: 19% 81%;
    gap: 34px;
    align-items: start;
  }

  .left-column {
    position: sticky;
    top: 96px;
    height: calc(100vh - 186px);
    min-height: 620px;
    display: grid;
    grid-template-rows: auto 1fr;
    align-content: start;
  }

  .navigation-area {
    width: 100%;
    display: grid;
    grid-template-rows: auto auto;
    align-content: start;
    gap: 14px;
    margin: 0;
    padding: 0;
  }

  .section-links,
  .selected-performance-links {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin: 0;
    padding: 0;
    text-align: left;
  }

  .selected-performance-links {
    max-height: 220px;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .selected-performance-links::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .section-button,
  .selected-performance-button {
    display: block;
    width: auto;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #bdbdbd;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.08;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .selected-performance-button {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .performance-list-number {
    min-width: 20px;
    display: inline-block;
  }

  .section-button.active,
  .section-button:hover,
  .section-button:focus,
  .selected-performance-button.active,
  .selected-performance-button:hover,
  .selected-performance-button:focus {
    color: #000000;
  }

  .performance-preview {
    width: 100%;
    align-self: end;
    min-height: 0;
  }

  .performance-preview h1 {
    max-width: 340px;
    margin: 0 0 46px;
    color: #000000;
    font-size: clamp(24px, 2vw, 30px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.055em;
  }

  .preview-bottom {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: start;
  }

  .preview-info {
    max-width: 330px;
  }

  .preview-info p {
    margin: 0;
    color: #000000;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
  }

  .performance-description {
    max-height: 120px;
    overflow-y: auto;
    padding-right: 6px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .performance-description::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .performance-description p {
    margin: 0;
  }

  .info-toggle {
    display: none;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000000;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
    cursor: pointer;
  }

  .right-column {
    width: 100%;
    min-width: 0;
  }

  .image-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 12px;
    row-gap: 12px;
    padding: 0;
  }

  .image-card {
    position: relative;
    display: block;
    min-height: 560px;
    overflow: hidden;
    padding: 0;
    border: 0;
    color: #000000;
    background: #eeeeee;
    text-align: left;
    cursor: pointer;
  }

  .image-card figure {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eeeeee;
  }

  .image-card img {
    width: 100%;
    height: 100%;
    min-height: 560px;
    display: block;
    object-fit: cover;
    object-position: center;
    transition:
      opacity 0.35s ease,
      width 0.55s ease,
      height 0.55s ease,
      filter 0.55s ease;
  }

  .image-grid:hover .image-card img {
    opacity: 0.12;
    filter: grayscale(10%);
  }

  .image-grid:hover .image-card:hover img,
  .image-grid:hover .image-card.active img {
    width: 92%;
    height: 92%;
    min-height: 0;
    opacity: 1;
    object-fit: contain;
    filter: none;
  }

  .empty-message {
    margin: 0;
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    text-transform: uppercase;
  }

  .performance-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    align-items: center;
    padding: 34px 40px;
    background: rgba(255, 255, 255, 0.98);
  }

  .lightbox-content {
    max-width: 100%;
    max-height: 100%;
    text-align: center;
  }

  .lightbox-content img {
    max-width: 100%;
    max-height: 78vh;
    display: block;
    margin: 0 auto;
    object-fit: contain;
  }

  .lightbox-meta {
    margin: 18px auto 0;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #000000;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.35;
    text-transform: uppercase;
  }

  .lightbox-meta p {
    margin: 0;
  }

  .lightbox-close {
    position: fixed;
    top: 34px;
    right: 40px;
    z-index: 2;
    border: 0;
    background: transparent;
    color: #000000;
    font-family: inherit;
    font-size: 13px;
    text-transform: uppercase;
    cursor: pointer;
  }

  .lightbox-arrow {
    width: 46px;
    height: 46px;
    border: 1px solid #d8d2cc;
    border-radius: 50%;
    background: #ffffff;
    color: #000000;
    font-family: inherit;
    font-size: 18px;
    cursor: pointer;
  }

  .lightbox-arrow-left {
    justify-self: start;
  }

  .lightbox-arrow-right {
    justify-self: end;
  }

  @media (max-width: 1280px) {
    .performances-page {
      padding: 96px 80px 90px 28px;
    }

    .performances-layout {
      grid-template-columns: 21% 79%;
    }

    .performance-preview h1 {
      font-size: clamp(24px, 2vw, 30px);
    }

    .image-card,
    .image-card img {
      min-height: 500px;
    }
  }

  @media (max-width: 1024px) {
    :global(html),
    :global(body) {
      height: 100%;
      overflow: hidden;
    }

    .performances-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 118px 24px 0;
    }

    .performances-layout {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      gap: 0;
    }

    .left-column {
      position: relative;
      top: auto;
      z-index: 20;
      height: auto;
      min-height: 0;
      flex: 0 0 auto;
      display: grid;
      grid-template-rows: auto auto;
      align-content: start;
      margin: 0;
      padding-bottom: 22px;
      background: #ffffff;
    }

    .navigation-area {
      width: 100%;
      display: grid;
      grid-template-rows: auto auto;
      gap: 12px;
      margin: 0 0 20px;
      padding: 0 0 18px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    .section-links {
      width: 100%;
      display: block;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    .section-button {
      display: block;
      width: 100%;
      min-height: 20px;
      margin: 0;
      padding: 0;
      text-align: left;
      font-size: 15px;
      line-height: 1.1;
    }

    .selected-performance-links {
      width: 100%;
      max-height: none;
      overflow: visible;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 18px;
      row-gap: 7px;
      align-items: start;
      justify-items: stretch;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    .selected-performance-button {
      display: flex;
      width: 100%;
      min-width: 0;
      min-height: 19px;
      margin: 0;
      padding: 0;
      text-align: left;
      font-size: 14px;
      line-height: 1.08;
      white-space: normal;
      word-break: normal;
      overflow-wrap: anywhere;
      transform: none;
      letter-spacing: 0;
    }

    .selected-performance-button.active,
    .selected-performance-button:hover,
    .selected-performance-button:focus {
      color: #000000;
      transform: none;
      letter-spacing: 0;
    }

    .performance-preview {
      width: 100%;
      max-width: none;
      align-self: start;
      display: block;
      text-align: left;
    }

    .performance-preview h1 {
      width: 100%;
      max-width: none;
      margin: 0 0 10px;
      font-size: clamp(18px, 3.2vw, 25px);
      text-align: left;
    }

    .preview-bottom {
      width: 100%;
      max-width: none;
      gap: 8px;
      text-align: left;
    }

    .preview-info {
      width: 100%;
      max-width: none;
      margin-bottom: 0;
      text-align: left;
    }

    .performance-description {
      width: 100%;
      max-width: none;
      max-height: 80px;
      overflow: hidden;
    }

    .performance-description.expanded {
      max-height: 22vh;
      overflow-y: auto;
      padding-right: 8px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .performance-description.expanded::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    .info-toggle {
      display: block;
      margin-top: 8px;
    }

    .right-column {
      height: 100%;
      min-height: 0;
      flex: 1 1 auto;
      display: block;
      overflow: hidden;
    }

    .image-grid {
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-content: start;
      gap: 18px 12px;
      padding: 0 0 calc(150px + env(safe-area-inset-bottom));
      scrollbar-width: none;
      scrollbar-color: transparent transparent;
      -ms-overflow-style: none;
      overscroll-behavior: contain;
    }

    .image-grid::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
      background: transparent;
    }

    .image-card {
      min-height: auto;
      overflow: visible;
      background: transparent;
    }

    .image-card figure {
      height: 440px;
      background: #eeeeee;
      overflow: hidden;
    }

    .image-card img {
      min-height: 440px;
    }

    .image-grid:hover .image-card img {
      opacity: 1;
      filter: none;
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 440px;
      object-fit: cover;
    }
  }

  @media (max-width: 700px) {
    .performances-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 108px 16px 0;
    }

    .left-column {
      display: grid;
      grid-template-rows: auto auto;
      align-content: start;
      padding-bottom: 18px;
    }

    .navigation-area {
      display: grid;
      grid-template-rows: auto auto;
      gap: 10px;
      margin: 0 0 16px;
      padding: 0 0 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .section-links {
      width: 100%;
      display: block;
      text-align: left;
    }

    .section-button {
      display: block;
      width: 100%;
      min-height: 20px;
      margin: 0;
      padding: 0;
      font-size: 14px;
      line-height: 1.1;
      text-align: left;
    }

    .selected-performance-links {
      width: 100%;
      max-height: none;
      overflow: visible;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 14px;
      row-gap: 6px;
      align-items: start;
      justify-items: stretch;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    .selected-performance-button {
      display: flex;
      width: 100%;
      min-width: 0;
      min-height: 18px;
      margin: 0;
      padding: 0;
      font-size: 12px;
      line-height: 1.08;
      text-align: left;
      white-space: normal;
      overflow-wrap: anywhere;
      transform: none;
      letter-spacing: 0;
    }

    .performance-list-number {
      min-width: 18px;
    }

    .selected-performance-button.active,
    .selected-performance-button:hover,
    .selected-performance-button:focus {
      transform: none;
      letter-spacing: 0;
    }

    .performance-preview h1,
    .preview-bottom,
    .preview-info,
    .performance-description {
      width: 100%;
      max-width: none;
    }

    .performance-preview h1 {
      font-size: clamp(15px, 4.2vw, 20px);
    }

    .performance-description {
      max-height: 60px;
    }

    .performance-description.expanded {
      max-height: 20vh;
      overflow-y: auto;
    }

    .info-toggle {
      font-size: 11px;
    }

    .right-column {
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }

    .image-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 10px;
      padding: 0 0 calc(145px + env(safe-area-inset-bottom));
    }

    .image-card figure {
      height: 260px;
    }

    .image-card img {
      min-height: 260px;
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 260px;
      object-fit: cover;
    }

    .performance-lightbox {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "image image"
        "left right";
      gap: 22px;
      padding: 78px 24px 90px;
    }

    .lightbox-content {
      grid-area: image;
    }

    .lightbox-content img {
      max-height: 60vh;
    }

    .lightbox-arrow-left {
      grid-area: left;
      justify-self: start;
    }

    .lightbox-arrow-right {
      grid-area: right;
      justify-self: end;
    }

    .lightbox-close {
      top: 24px;
      right: 24px;
    }
  }

  @media (max-width: 420px) {
    .left-column {
      padding-bottom: 16px;
    }

    .performance-preview h1 {
      font-size: clamp(14px, 4vw, 18px);
    }

    .selected-performance-links {
      column-gap: 12px;
      row-gap: 5px;
    }

    .selected-performance-button {
      font-size: 11px;
      min-height: 17px;
    }

    .performance-list-number {
      min-width: 17px;
    }

    .image-card figure {
      height: 220px;
    }

    .image-card img {
      min-height: 220px;
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      min-height: 220px;
    }
  }
</style>
