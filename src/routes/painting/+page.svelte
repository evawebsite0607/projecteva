<script>
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let { data } = $props();

  const initialPainting =
    data.paintings?.find((painting) => painting.id === data.requestedPostId) ||
    data.paintings?.[0];

  let selectedPaintingSlug = $state(initialPainting?.postSlug || "");
  let selectedImageIndex = $state(null);
  let hoveredImageIndex = $state(null);
  let paintingGridElement = $state(null);
  let infoExpanded = $state(false);

  let selectedPainting = $derived(
    data.paintings?.find(
      (painting) => painting.postSlug === selectedPaintingSlug,
    ) || data.paintings?.[0],
  );

  let selectedImages = $derived(selectedPainting?.images || []);

  let selectedImage = $derived(
    selectedImageIndex !== null ? selectedImages[selectedImageIndex] : null,
  );

  let shouldShowInfoToggle = $derived(
    (selectedPainting?.info || "").length > 200,
  );

  function selectPainting(painting) {
    selectedPaintingSlug = painting.postSlug;
    selectedImageIndex = null;
    hoveredImageIndex = null;
    infoExpanded = false;

    if (paintingGridElement) {
      paintingGridElement.scrollTo({
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

  function scrollBackToTop() {
    if (paintingGridElement) {
      paintingGridElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
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
  <title>Paintings | Eva Eichinger</title>

  <meta
    name="description"
    content="Explore selected paintings, visual works, image galleries, and contemporary art projects by Eva Eichinger."
  />
</svelte:head>

<main class="paintings-page">
  {#if data.paintings && data.paintings.length > 0}
    <section class="paintings-layout" aria-label="Paintings">
      <aside class="left-column" aria-label="Painting navigation">
        <div class="navigation-area">
          <div class="section-links">
            <button type="button" class="section-button active">
              Selected Paintings
            </button>
          </div>

          <div class="selected-painting-links">
            {#each data.paintings as painting, index}
              <button
                type="button"
                class="selected-painting-button"
                class:active={selectedPainting?.postSlug === painting.postSlug}
                onclick={() => selectPainting(painting)}
              >
                <span class="painting-list-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{painting.title}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="painting-preview">
          {#if selectedPainting}
            <h1>{selectedPainting.title}</h1>

            <div class="preview-bottom">
              <div class="preview-info">
                {#if selectedPainting.info}
                  <div
                    class="painting-description"
                    class:expanded={infoExpanded}
                  >
                    <p>{selectedPainting.info}</p>
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
                  <p>Selected painting images and documentation.</p>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </aside>

      <section class="right-column" aria-label="Painting content">
        {#if selectedPainting?.images?.length}
          {#key selectedPainting.postSlug}
            <div class="image-grid" bind:this={paintingGridElement}>
              {#each selectedPainting.images as image, index}
                <button
                  type="button"
                  class="image-card"
                  class:active={hoveredImageIndex === index}
                  onmouseenter={() => setHoveredImage(index)}
                  onfocus={() => setHoveredImage(index)}
                  onclick={() => openLightbox(index)}
                  aria-label={`Open ${image.alt || selectedPainting.title}`}
                >
                  <figure>
                    <img
                      src={image.src}
                      alt={image.alt || selectedPainting.title}
                    />
                  </figure>
                </button>
              {/each}

              <button
                type="button"
                class="back-to-top"
                onclick={scrollBackToTop}
              >
                BACK TO TOP
              </button>
            </div>
          {/key}
        {:else}
          <p class="empty-message">No images found for this painting.</p>
        {/if}
      </section>
    </section>
  {:else}
    <p class="empty-message">No painting posts found.</p>
  {/if}

  {#if selectedImage}
    <div class="painting-lightbox" role="dialog" aria-modal="true">
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
          alt={selectedImage.alt || selectedPainting.title}
        />

        <div class="lightbox-meta">
          {#if selectedImage.alt}
            <p>{selectedImage.alt}</p>
          {:else}
            <p>{selectedPainting.title}</p>
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
  :global(html),
  :global(body),
  .paintings-page {
    font-family: "Inconsolata", monospace;
  }

  :global(body) {
    margin: 0;
    overflow-x: hidden;
    background: #ffffff;
    color: #000000;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .paintings-page {
    width: 100%;
    min-height: 100vh;
    padding: 96px 72px 90px 28px;
    background: #ffffff;
    text-transform: uppercase;
  }

  .paintings-page button,
  .paintings-page a {
    font-family: inherit;
  }

  .paintings-page p {
    text-transform: none;
  }

  .paintings-layout {
    width: 100%;
    display: grid;
    grid-template-columns: clamp(210px, 15vw, 265px) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }

  .left-column {
    position: sticky;
    top: 96px;
    height: calc(100vh - 186px);
    min-height: 620px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .navigation-area {
    width: 100%;
    display: grid;
    grid-template-rows: auto auto;
    align-content: start;
    gap: 12px;
    margin: 0;
    padding: 0;
  }

  .section-links,
  .selected-painting-links {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    margin: 0;
    padding: 0;
    text-align: left;
  }

  .selected-painting-links {
    max-height: 240px;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .selected-painting-links::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .section-button,
  .selected-painting-button {
    width: auto;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #bdbdbd;
    font-size: clamp(13px, 0.8vw, 15px);
    font-weight: 900;
    line-height: 1;
    text-align: left;
    cursor: pointer;
    transition: color 0.25s ease;
    text-transform: uppercase;
  }

  .selected-painting-button {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .painting-list-number {
    min-width: 22px;
    display: inline-block;
    flex-shrink: 0;
    color: inherit;
    font-size: 0.9em;
    font-weight: 900;
    letter-spacing: 0.04em;
  }

  .section-button.active,
  .section-button:hover,
  .section-button:focus,
  .selected-painting-button.active,
  .selected-painting-button:hover,
  .selected-painting-button:focus {
    color: #000000;
  }

  .painting-preview {
    width: 100%;
  }

  .painting-preview h1 {
    max-width: 300px;
    margin: 0 0 46px;
    color: #000000;
    font-size: clamp(14px, 0.85vw, 16px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0;
  }

  .preview-bottom {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: start;
  }

  .preview-info {
    max-width: 285px;
  }

  .preview-info p {
    margin: 0;
    color: #2c2b2b;
    font-size: clamp(12px, 0.72vw, 14px);
    font-weight: 400;
    line-height: 1;
    text-transform: uppercase;
  }

  .painting-description {
    max-height: 120px;
    overflow-y: auto;
    padding-right: 6px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .painting-description::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .painting-description p {
    margin: 0;
    text-transform: uppercase;
  }

  .info-toggle {
    display: none;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 12px;
    font-weight: 900;
    line-height: 1;
    cursor: pointer;
    text-transform: uppercase;
  }

  .right-column {
    width: 100%;
    min-width: 0;
  }

  .image-grid {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(18px, 1.45vw, 28px);
    row-gap: clamp(26px, 1.8vw, 34px);
    padding: 6px 0 40px;
  }

  .image-card {
    position: relative;
    display: block;
    min-height: clamp(500px, 32vw, 570px);
    overflow: hidden;
    padding: 0;
    border: 0;
    color: #000000;
    background: #f6f6f4;
    text-align: left;
    cursor: pointer;
    isolation: isolate;
  }

  .image-card::before {
    content: "";
    position: absolute;
    inset: 14px;
    z-index: 2;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.35s ease,
      inset 0.35s ease;
  }

  .image-card::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.08),
      rgba(0, 0, 0, 0.08)
    );
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s ease;
  }

  .image-card figure {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f6f6f4;
  }

  .image-card img {
    width: 100%;
    height: 100%;
    min-height: clamp(500px, 32vw, 570px);
    display: block;
    object-fit: cover;
    object-position: center;
    transform: scale(1.015);
    transition:
      opacity 0.35s ease,
      width 0.6s ease,
      height 0.6s ease,
      transform 0.6s ease,
      filter 0.6s ease;
  }

  .image-grid:hover .image-card img {
    opacity: 0.22;
    filter: grayscale(20%) contrast(0.88);
  }

  .image-grid:hover .image-card:hover,
  .image-grid:hover .image-card.active {
    background: #f8f7f4;
  }

  .image-grid:hover .image-card:hover::before,
  .image-grid:hover .image-card.active::before {
    inset: 18px;
    opacity: 1;
  }

  .image-grid:hover .image-card:hover::after,
  .image-grid:hover .image-card.active::after {
    opacity: 1;
  }

  .image-grid:hover .image-card:hover img,
  .image-grid:hover .image-card.active img {
    width: calc(100% - 54px);
    height: calc(100% - 54px);
    min-height: 0;
    opacity: 1;
    object-fit: contain;
    transform: scale(1);
    filter: none;
  }

  .back-to-top {
    display: none;
    grid-column: 1 / -1;
    justify-self: center;
    margin: 48px 0 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    cursor: pointer;
  }

  .empty-message {
    margin: 0;
    padding: 120px 0;
    color: #000000;
    font-size: 15px;
    font-weight: 900;
  }

  .painting-lightbox {
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
  }

  .lightbox-meta p {
    margin: 0;
    text-transform: none;
  }

  .lightbox-close {
    position: fixed;
    top: 34px;
    right: 40px;
    z-index: 2;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 13px;
    font-weight: 900;
    cursor: pointer;
    text-transform: uppercase;
  }

  .lightbox-arrow {
    width: 46px;
    height: 46px;
    border: 1px solid #d8d2cc;
    border-radius: 50%;
    background: #ffffff;
    color: #000000;
    font-size: 18px;
    cursor: pointer;
  }

  .lightbox-arrow-left {
    justify-self: start;
  }

  .lightbox-arrow-right {
    justify-self: end;
  }

  @media (min-width: 1025px) {
    .image-card:nth-child(even) {
      transform: translateY(42px);
    }

    .image-card:nth-child(4n + 1) {
      min-height: clamp(570px, 35vw, 640px);
    }

    .image-card:nth-child(4n + 1) img {
      min-height: clamp(570px, 35vw, 640px);
    }

    .image-card:nth-child(4n + 2) {
      min-height: clamp(470px, 28vw, 520px);
    }

    .image-card:nth-child(4n + 2) img {
      min-height: clamp(470px, 28vw, 520px);
    }

    .image-card:nth-child(4n + 3) {
      min-height: clamp(490px, 29vw, 540px);
    }

    .image-card:nth-child(4n + 3) img {
      min-height: clamp(490px, 29vw, 540px);
    }

    .image-card:nth-child(4n + 4) {
      min-height: clamp(580px, 36vw, 650px);
    }

    .image-card:nth-child(4n + 4) img {
      min-height: clamp(580px, 36vw, 650px);
    }
  }

  @media (min-width: 1440px) {
    .paintings-page {
      padding-right: 72px;
    }

    .paintings-layout {
      grid-template-columns: clamp(210px, 14vw, 255px) minmax(0, 1fr);
      gap: 14px;
    }
  }

  @media (min-width: 1680px) {
    .paintings-page {
      padding-right: 76px;
    }

    .paintings-layout {
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 14px;
    }

    .painting-preview h1 {
      max-width: 285px;
    }

    .preview-info {
      max-width: 275px;
    }
  }

  @media (max-width: 1280px) {
    .paintings-page {
      padding: 96px 72px 90px 28px;
    }

    .paintings-layout {
      grid-template-columns: clamp(210px, 18vw, 250px) minmax(0, 1fr);
      gap: 18px;
    }

    .painting-preview h1 {
      max-width: 300px;
      font-size: clamp(14px, 1vw, 16px);
    }

    .image-grid {
      column-gap: 22px;
      row-gap: 30px;
    }

    .image-card,
    .image-card img {
      min-height: 500px;
    }

    .image-card:nth-child(4n + 1),
    .image-card:nth-child(4n + 1) img {
      min-height: 570px;
    }

    .image-card:nth-child(4n + 2),
    .image-card:nth-child(4n + 2) img {
      min-height: 470px;
    }

    .image-card:nth-child(4n + 3),
    .image-card:nth-child(4n + 3) img {
      min-height: 490px;
    }

    .image-card:nth-child(4n + 4),
    .image-card:nth-child(4n + 4) img {
      min-height: 580px;
    }
  }

  @media (max-width: 1024px) {
    :global(html),
    :global(body) {
      height: 100%;
      overflow: hidden;
    }

    .paintings-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 118px 24px 0;
    }

    .paintings-layout {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      gap: 0;
    }

    .left-column {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      z-index: 20;
      height: auto;
      min-height: 0;
      flex: 0 0 auto;
      display: block;
      margin: 0;
      padding-bottom: 28px;
      background: #ffffff;
    }

    .navigation-area {
      width: 100%;
      display: grid;
      grid-template-rows: auto auto;
      gap: 10px;
      margin: 0 0 24px;
      padding: 0;
      border-bottom: 0;
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
      min-height: 0;
      margin: 0;
      padding: 0;
      color: #000000;
      font-size: 14px;
      font-weight: 900;
      line-height: 1;
      text-align: left;
    }

    .selected-painting-links {
      width: 100%;
      max-height: none;
      overflow: visible;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 12px;
      row-gap: 7px;
      align-items: start;
      justify-items: stretch;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    .selected-painting-button {
      display: flex;
      width: 100%;
      min-width: 0;
      min-height: 0;
      margin: 0;
      padding: 0;
      color: #bdbdbd;
      font-size: 14px;
      font-weight: 900;
      line-height: 1.08;
      text-align: left;
      white-space: normal;
      word-break: normal;
      overflow-wrap: anywhere;
      transform: none;
      letter-spacing: 0;
    }

    .painting-list-number {
      min-width: 22px;
      font-size: 0.9em;
    }

    .selected-painting-button.active,
    .selected-painting-button:hover,
    .selected-painting-button:focus {
      color: #000000;
      transform: none;
      letter-spacing: 0;
    }

    .painting-preview {
      width: 100%;
      max-width: none;
      display: block;
      text-align: left;
    }

    .painting-preview h1 {
      width: 100%;
      max-width: 520px;
      margin: 0 0 8px;
      font-size: clamp(18px, 3.2vw, 25px);
      font-weight: 800;
      line-height: 1;
      letter-spacing: 0;
      text-align: left;
    }

    .preview-bottom {
      width: 100%;
      max-width: none;
      gap: 0;
      text-align: left;
    }

    .preview-info {
      width: 100%;
      max-width: none;
      margin-bottom: 0;
      text-align: left;
    }

    .preview-info p {
      font-size: 14px;
      line-height: 1.12;
    }

    .painting-description {
      width: 100%;
      max-width: none;
      max-height: 72px;
      overflow: hidden;
      padding-top: 2px;
      padding-bottom: 2px;
    }

    .painting-description.expanded {
      max-height: 24vh;
      overflow-y: auto;
      padding-top: 4px;
      padding-right: 8px;
      padding-bottom: 12px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .painting-description.expanded::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    .info-toggle {
      display: block;
      margin-top: 12px;
      padding-top: 4px;
      padding-bottom: 4px;
      font-size: 12px;
      font-weight: 900;
      line-height: 1;
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

    .image-grid::-webkit-scrollbar-track {
      background: transparent;
    }

    .image-grid::-webkit-scrollbar-thumb {
      background: transparent;
    }

    .image-card,
    .image-card:nth-child(even),
    .image-card:nth-child(4n + 1),
    .image-card:nth-child(4n + 2),
    .image-card:nth-child(4n + 3),
    .image-card:nth-child(4n + 4) {
      min-height: auto;
      overflow: visible;
      background: transparent;
      transform: none;
    }

    .image-card::before,
    .image-card::after {
      display: none;
    }

    .image-card figure {
      height: 440px;
      background: #eeeeee;
      overflow: hidden;
    }

    .image-card img,
    .image-card:nth-child(4n + 1) img,
    .image-card:nth-child(4n + 2) img,
    .image-card:nth-child(4n + 3) img,
    .image-card:nth-child(4n + 4) img {
      width: 100%;
      height: 100%;
      min-height: 440px;
      transform: none;
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

    .back-to-top {
      display: block;
      margin: 44px 0 0;
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
      font-size: 14px;
    }
  }

  @media (max-width: 700px) {
    .paintings-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 108px 16px 0;
    }

    .left-column {
      padding-bottom: 24px;
    }

    .navigation-area {
      gap: 9px;
      margin: 0 0 22px;
      padding: 0;
      border-bottom: 0;
    }

    .section-button {
      font-size: 12px;
      line-height: 1.08;
    }

    .selected-painting-links {
      width: 100%;
      max-height: none;
      overflow: visible;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 10px;
      row-gap: 6px;
      align-items: start;
      justify-items: stretch;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    .selected-painting-button {
      display: flex;
      width: 100%;
      min-width: 0;
      min-height: 0;
      margin: 0;
      padding: 0;
      font-size: 12px;
      font-weight: 900;
      line-height: 1.08;
      text-align: left;
      white-space: normal;
      overflow-wrap: anywhere;
      transform: none;
      letter-spacing: 0;
    }

    .painting-list-number {
      min-width: 18px;
      font-size: 0.9em;
    }

    .selected-painting-button.active,
    .selected-painting-button:hover,
    .selected-painting-button:focus {
      transform: none;
      letter-spacing: 0;
    }

    .painting-preview h1,
    .preview-bottom,
    .preview-info,
    .painting-description {
      width: 100%;
      max-width: none;
    }

    .painting-preview h1 {
      margin: 0 0 8px;
      font-size: clamp(15px, 4.2vw, 20px);
      font-weight: 800;
      line-height: 1;
      text-align: left;
    }

    .preview-info p {
      font-size: 12px;
      line-height: 1.12;
    }

    .painting-description {
      max-height: 58px;
      padding-top: 2px;
      padding-bottom: 2px;
    }

    .painting-description.expanded {
      max-height: 22vh;
      overflow-y: auto;
      padding-top: 4px;
      padding-bottom: 14px;
    }

    .info-toggle {
      margin-top: 12px;
      padding-top: 5px;
      padding-bottom: 5px;
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

    .back-to-top {
      display: block;
      margin-top: 38px;
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
      font-size: 12px;
    }

    .painting-lightbox {
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
      padding-bottom: 22px;
    }

    .navigation-area {
      margin-bottom: 20px;
    }

    .painting-preview h1 {
      font-size: clamp(14px, 4vw, 18px);
    }

    .selected-painting-links {
      column-gap: 9px;
      row-gap: 5px;
    }

    .selected-painting-button {
      font-size: 11px;
      line-height: 1.08;
    }

    .painting-list-number {
      min-width: 17px;
    }

    .painting-description {
      max-height: 54px;
    }

    .painting-description.expanded {
      max-height: 21vh;
      padding-bottom: 14px;
    }

    .info-toggle {
      margin-top: 11px;
      padding-top: 5px;
      padding-bottom: 5px;
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
