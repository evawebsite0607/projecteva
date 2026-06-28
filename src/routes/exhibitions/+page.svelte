<script>
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";

  let { data } = $props();

  const allExhibitionsId = "ALL EXHIBITIONS";
  const exhibitionColor = "#24d480";

  let selectedExhibitionId = $state(null);
  let selectedImageIndex = $state(null);
  let hoveredImageIndex = $state(null);
  let exhibitionGridElement = $state(null);
  let infoExpanded = $state(false);

  let exhibitions = $derived(
    Array.isArray(data.selectedExhibitions) ? data.selectedExhibitions : [],
  );

  let initialExhibition = $derived(
    exhibitions.find((exhibition) => exhibition.id === data.requestedPostId) ??
      exhibitions[0],
  );

  $effect(() => {
    if (selectedExhibitionId === null && exhibitions.length) {
      selectedExhibitionId =
        data.requestedPostId && initialExhibition
          ? initialExhibition.id
          : allExhibitionsId;
    }
  });

  function isAllExhibitions() {
    return (
      selectedExhibitionId === allExhibitionsId || selectedExhibitionId === null
    );
  }

  let selectedExhibition = $derived.by(() => {
    if (isAllExhibitions()) return null;

    return (
      exhibitions.find(
        (exhibition) => exhibition.id === selectedExhibitionId,
      ) || exhibitions[0]
    );
  });

  let allExhibitionImages = $derived.by(() => {
    return exhibitions.flatMap((exhibition) =>
      (exhibition.images || []).map((image, imageIndex) => ({
        ...image,
        imageIndex,
        exhibitionTitle: exhibition.title,
        exhibitionId: exhibition.id,
      })),
    );
  });

  let selectedImages = $derived.by(() => {
    if (isAllExhibitions()) {
      return allExhibitionImages;
    }

    return (selectedExhibition?.images || []).map((image, imageIndex) => ({
      ...image,
      imageIndex,
      exhibitionTitle: selectedExhibition?.title || "Exhibition",
      exhibitionId: selectedExhibition?.id,
    }));
  });

  let selectedImage = $derived(
    selectedImageIndex !== null ? selectedImages[selectedImageIndex] : null,
  );

  let previewTitle = $derived(
    isAllExhibitions()
      ? allExhibitionsId
      : selectedExhibition?.title || allExhibitionsId,
  );

  let shouldShowInfoToggle = $derived(
    !isAllExhibitions() && (selectedExhibition?.info || "").length > 200,
  );

  function cleanHtml(value) {
    return value || "";
  }

  function getDesktopLastCardOffset(count) {
    const position = count % 4;

    if (position === 1) return 0;
    if (position === 2) return 34;
    if (position === 3) return 8;

    return 42;
  }

  function unlockPageLocks() {
    if (!browser) return;

    document.documentElement.classList.remove("menu-open-lock");
    document.body.classList.remove("menu-open-lock");

    document.documentElement.style.overflow = "";
    document.documentElement.style.height = "";
    document.documentElement.style.position = "";
    document.documentElement.style.width = "";
    document.documentElement.style.touchAction = "";

    document.body.style.overflow = "";
    document.body.style.height = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    document.body.style.touchAction = "";
  }

  function scrollGridToTop() {
    if (exhibitionGridElement) {
      exhibitionGridElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function selectAllExhibitions() {
    selectedExhibitionId = allExhibitionsId;
    selectedImageIndex = null;
    hoveredImageIndex = null;
    infoExpanded = false;
    scrollGridToTop();
  }

  function selectExhibition(exhibition) {
    selectedExhibitionId = exhibition.id;
    selectedImageIndex = null;
    hoveredImageIndex = null;
    infoExpanded = false;
    scrollGridToTop();
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
    scrollGridToTop();
  }

  function handleKeydown(event) {
    if (selectedImageIndex === null) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPreviousImage();
    if (event.key === "ArrowRight") showNextImage();
  }

  onMount(() => {
    unlockPageLocks();

    requestAnimationFrame(() => {
      unlockPageLocks();
    });

    setTimeout(() => {
      unlockPageLocks();
    }, 0);

    return () => {
      unlockPageLocks();
    };
  });

  onDestroy(() => {
    if (browser) {
      document.body.style.overflow = "";
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title>{previewTitle} | Eva Eichinger</title>

  <meta
    name="description"
    content="Explore selected exhibitions, visual works, image galleries, and contemporary art projects by Eva Eichinger."
  />
</svelte:head>

<main
  class="exhibitions-page"
  style={`--exhibition-color: ${exhibitionColor};`}
>
  {#if exhibitions.length > 0}
    <section class="exhibitions-layout" aria-label="Exhibitions">
      <aside class="left-column" aria-label="Exhibition navigation">
        <div class="exhibition-filter" aria-label="Exhibition categories">
          <button
            type="button"
            class="all-exhibitions-button"
            class:active={isAllExhibitions()}
            onclick={selectAllExhibitions}
          >
            <span class="exhibition-button-label">
              <span>ALL EXHIBITIONS</span>
            </span>
          </button>

          {#each exhibitions as exhibition, index}
            <button
              type="button"
              class="selected-exhibition-button"
              class:active={selectedExhibition?.id === exhibition.id}
              onclick={() => selectExhibition(exhibition)}
            >
              <span class="exhibition-list-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span class="exhibition-button-label">
                <span>{exhibition.title}</span>
              </span>
            </button>
          {/each}
        </div>

        <div class="exhibition-preview">
          <h1>{previewTitle}</h1>

          <div class="preview-bottom">
            <div class="preview-info">
              {#if isAllExhibitions()}
                <strong>EXHIBITIONS</strong>
                <p>Selected exhibition images and documentation.</p>
              {:else if selectedExhibition?.info}
                <strong>EXHIBITION</strong>

                <div
                  class="exhibition-description"
                  class:expanded={infoExpanded}
                >
                  <p>{@html cleanHtml(selectedExhibition.info)}</p>
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
                <strong>EXHIBITION</strong>
                <p>Selected exhibition images and documentation.</p>
              {/if}
            </div>
          </div>
        </div>
      </aside>

      <section class="right-column" aria-label="Exhibition content">
        {#if selectedImages.length}
          {#key selectedExhibitionId}
            <div
              class="image-grid"
              bind:this={exhibitionGridElement}
              style={`--last-desktop-offset: ${getDesktopLastCardOffset(selectedImages.length)}px;`}
            >
              {#each selectedImages as image, index}
                <button
                  type="button"
                  class="image-card"
                  class:active={hoveredImageIndex === index}
                  onmouseenter={() => setHoveredImage(index)}
                  onfocus={() => setHoveredImage(index)}
                  onclick={() => openLightbox(index)}
                  aria-label={`Open ${image.alt || image.exhibitionTitle || "exhibition image"}`}
                >
                  <figure>
                    <img
                      src={image.src}
                      alt={image.alt ||
                        image.exhibitionTitle ||
                        "Exhibition image"}
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                  </figure>

                  <span class="magnify-icon" aria-hidden="true"> ⛶ </span>

                  <span class="image-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
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
          <p class="empty-message">No images found for this exhibition.</p>
        {/if}
      </section>
    </section>
  {:else}
    <p class="empty-message">No exhibition posts found.</p>
  {/if}

  {#if selectedImage}
    <div class="exhibition-lightbox" role="dialog" aria-modal="true">
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
          alt={selectedImage.alt ||
            selectedImage.exhibitionTitle ||
            "Exhibition image"}
        />

        <div class="lightbox-meta">
          <span>
            {String((selectedImageIndex ?? 0) + 1).padStart(2, "0")} — {String(
              selectedImages.length,
            ).padStart(2, "0")}
          </span>

          {#if selectedImage.alt}
            <p>{selectedImage.alt}</p>
          {:else if selectedImage.exhibitionTitle}
            <p>{selectedImage.exhibitionTitle}</p>
          {:else}
            <p>Exhibition image</p>
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
  .exhibitions-page {
    font-family: Arial, Helvetica, sans-serif;
  }

  :global(html),
  :global(body) {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  :global(html::-webkit-scrollbar),
  :global(body::-webkit-scrollbar) {
    width: 0;
    height: 0;
    display: none;
    background: transparent;
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

  .exhibitions-page {
    --desktop-card-height: clamp(455px, 28vw, 515px);

    width: 100%;
    height: 100vh;
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
    padding: 96px 72px 90px 28px;
    background: #ffffff;
    text-transform: uppercase;
  }

  .exhibitions-page button,
  .exhibitions-page a {
    font-family: inherit;
  }

  .exhibitions-page p {
    text-transform: none;
  }

  .exhibitions-layout {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-columns: clamp(210px, 15vw, 265px) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
    overflow: hidden;
  }

  .left-column {
    position: relative;
    top: auto;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .exhibition-filter {
    width: 100%;
    max-height: 44vh;
    overflow-y: auto;
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .exhibition-filter::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  .all-exhibitions-button,
  .selected-exhibition-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    width: auto;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #b8b8b8;
    font-size: clamp(12px, 0.78vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.01em;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    transition:
      color 0.28s ease,
      opacity 0.28s ease;
    text-transform: uppercase;
  }

  .all-exhibitions-button .exhibition-button-label > span {
    text-decoration-line: none;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .all-exhibitions-button.active .exhibition-button-label > span,
  .all-exhibitions-button:hover .exhibition-button-label > span {
    text-decoration-line: underline;
  }

  .all-exhibitions-button.active,
  .all-exhibitions-button:hover,
  .all-exhibitions-button:focus,
  .selected-exhibition-button.active,
  .selected-exhibition-button:hover,
  .selected-exhibition-button:focus {
    color: var(--exhibition-color);
  }

  .all-exhibitions-button:hover .exhibition-button-label span,
  .all-exhibitions-button.active .exhibition-button-label span,
  .selected-exhibition-button:hover .exhibition-button-label span,
  .selected-exhibition-button.active .exhibition-button-label span {
    animation: exhibitionTextLift 0.42s ease both;
  }

  .exhibition-list-number {
    display: inline-block;
    min-width: 0;
    margin-right: 0;
    color: inherit;
    font-size: 0.82em;
    font-weight: 700;
    opacity: 0.62;
    transform: translateY(-0.5px);
  }

  .exhibition-button-label {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }

  .exhibition-button-label span {
    display: inline-block;
  }

  @keyframes exhibitionTextLift {
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    42% {
      transform: translateY(-110%);
      opacity: 0;
    }

    43% {
      transform: translateY(110%);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .exhibition-preview {
    width: 100%;
  }

  .exhibition-preview h1 {
    max-width: 280px;
    margin: 0 0 42px;
    color: var(--exhibition-color);
    font-size: clamp(18px, calc(0.78vw + 6px), 20px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: 0.005em;
    animation: previewTitleIn 0.46s ease both;
    transition:
      color 0.28s ease,
      opacity 0.35s ease,
      transform 0.35s ease;
  }

  @keyframes previewTitleIn {
    0% {
      opacity: 0;
      transform: translateY(5px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .preview-bottom {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: start;
  }

  .preview-info {
    max-width: 265px;
  }

  .preview-info strong {
    display: block;
    margin: 0 0 9px;
    color: #000000;
    font-size: clamp(12px, 0.72vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
  }

  .preview-info p {
    margin: 0;
    color: #000000;
    font-size: clamp(11px, 0.66vw, 12px);
    font-weight: 500;
    line-height: 1.16;
    letter-spacing: 0.006em;
    text-transform: uppercase;
  }

  .exhibition-description {
    max-height: 120px;
    overflow-y: auto;
    padding-right: 6px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .exhibition-description::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .exhibition-description p {
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
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }

  .image-grid {
    --image-card-gap: clamp(22px, 1.6vw, 30px);

    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-content: start;
    gap: var(--image-card-gap);
    padding: 0 0 var(--last-desktop-offset, 0px);
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
    -ms-overflow-style: none;
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

  .image-card {
    position: relative;
    display: block;
    height: var(--desktop-card-height);
    min-height: 0;
    overflow: hidden;
    padding: 0;
    border: 0;
    color: #000000;
    background: #f8f8f6;
    text-align: left;
    cursor: pointer;
    isolation: isolate;
    transition:
      background 0.45s ease,
      transform 0.45s ease;
  }

  .image-card::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.22),
        rgba(255, 255, 255, 0) 30%
      ),
      linear-gradient(to top, rgba(0, 0, 0, 0.055), rgba(0, 0, 0, 0) 42%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.42s ease;
  }

  .image-card::after {
    content: "";
    position: absolute;
    inset: 18px;
    z-index: 3;
    background: rgba(255, 255, 255, 0.06);
    opacity: 0;
    pointer-events: none;
    transform: scale(0.985);
    transition:
      opacity 0.42s ease,
      transform 0.42s ease;
  }

  .image-card figure {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f8f6;
  }

  .image-card img {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: block;
    object-fit: cover;
    object-position: center;
    transform: scale(1.01);
    transition:
      opacity 0.45s ease,
      width 0.65s ease,
      height 0.65s ease,
      transform 0.65s ease,
      filter 0.65s ease;
  }

  .image-grid:hover .image-card img {
    opacity: 0.38;
    filter: grayscale(12%) contrast(0.94) brightness(1.03);
  }

  .image-grid:hover .image-card:hover,
  .image-grid:hover .image-card.active {
    background: #fbfaf7;
  }

  .image-grid:hover .image-card:hover::before,
  .image-grid:hover .image-card.active::before {
    opacity: 1;
  }

  .image-grid:hover .image-card:hover::after,
  .image-grid:hover .image-card.active::after {
    opacity: 1;
    transform: scale(1);
  }

  .image-grid:hover .image-card:hover img,
  .image-grid:hover .image-card.active img {
    width: calc(100% - 46px);
    height: calc(100% - 46px);
    min-height: 0;
    opacity: 1;
    object-fit: contain;
    transform: scale(1);
    filter: none;
  }

  .magnify-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 5;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #000000;
    border-radius: 50%;
    color: #000000;
    background: rgba(255, 255, 255, 0.78);
    font-size: 24px;
    font-weight: 400;
    line-height: 1;
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0.9);
    transition:
      opacity 0.32s ease,
      transform 0.32s ease,
      background 0.32s ease;
  }

  .image-card:hover .magnify-icon,
  .image-card.active .magnify-icon {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .image-number {
    position: absolute;
    top: 22px;
    left: 22px;
    z-index: 4;
    color: #000000;
    font-size: 12px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.05em;
    opacity: 0;
    transform: translateY(4px);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .image-card:hover .image-number,
  .image-card.active .image-number {
    opacity: 1;
    transform: translateY(0);
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
    text-transform: uppercase;
  }

  .empty-message {
    margin: 0;
    padding: 120px 0;
    color: #000000;
    font-size: 15px;
    font-weight: 900;
    text-transform: uppercase;
  }

  .exhibition-lightbox {
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

  .lightbox-meta span {
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.05em;
    text-transform: uppercase;
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
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 22px;
    cursor: pointer;
  }

  .lightbox-arrow-left {
    justify-self: start;
  }

  .lightbox-arrow-right {
    justify-self: end;
  }

  @media (min-width: 1025px) {
    .image-card:nth-child(4n + 1) {
      transform: translateY(0);
    }

    .image-card:nth-child(4n + 2) {
      transform: translateY(34px);
    }

    .image-card:nth-child(4n + 3) {
      transform: translateY(8px);
    }

    .image-card:nth-child(4n + 4) {
      transform: translateY(42px);
    }

    .image-card:nth-child(4n + 1):hover,
    .image-card:nth-child(4n + 1).active {
      transform: translateY(-3px);
    }

    .image-card:nth-child(4n + 2):hover,
    .image-card:nth-child(4n + 2).active {
      transform: translateY(31px);
    }

    .image-card:nth-child(4n + 3):hover,
    .image-card:nth-child(4n + 3).active {
      transform: translateY(5px);
    }

    .image-card:nth-child(4n + 4):hover,
    .image-card:nth-child(4n + 4).active {
      transform: translateY(39px);
    }
  }

  @media (min-width: 1440px) {
    .exhibitions-page {
      --desktop-card-height: clamp(455px, 27vw, 510px);

      padding-right: 72px;
    }

    .exhibitions-layout {
      grid-template-columns: clamp(210px, 14vw, 255px) minmax(0, 1fr);
      gap: 14px;
    }
  }

  @media (min-width: 1680px) {
    .exhibitions-page {
      --desktop-card-height: 510px;

      padding-right: 76px;
    }

    .exhibitions-layout {
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 14px;
    }

    .exhibition-preview h1 {
      max-width: 270px;
    }

    .preview-info {
      max-width: 260px;
    }
  }

  @media (max-width: 1280px) {
    .exhibitions-page {
      --desktop-card-height: 455px;

      padding: 96px 72px 90px 28px;
    }

    .exhibitions-layout {
      grid-template-columns: clamp(210px, 18vw, 250px) minmax(0, 1fr);
      gap: 18px;
    }

    .exhibition-preview h1 {
      max-width: 280px;
      font-size: clamp(19px, calc(0.95vw + 6px), 21px);
    }

    .image-grid {
      column-gap: 22px;
      row-gap: 32px;
    }
  }

  @media (max-width: 1024px) {
    .exhibitions-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 118px 24px 0;
    }

    .exhibitions-layout {
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
      padding-top: 116px;
      padding-bottom: 26px;
      background: #ffffff;
    }

    .exhibition-filter {
      position: fixed;
      top: 108px;
      left: 16px;
      right: 16px;
      z-index: 40;
      width: auto;
      max-height: 106px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 7px;
      margin: 0;
      padding: 0;
      text-align: left;
      background: #ffffff;
    }

    .all-exhibitions-button,
    .selected-exhibition-button {
      display: inline-flex;
      justify-content: flex-start;
      width: clamp(125px, 42vw, 180px);
      margin: 0;
      padding: 0;
      text-align: left;
      font-size: 12px;
      line-height: 1.08;
    }

    .exhibition-preview {
      width: 100%;
      max-width: none;
      display: block;
      text-align: left;
    }

    .exhibition-preview h1 {
      max-width: 520px;
      margin: 0 0 8px;
      font-size: 16px;
      text-align: left;
      line-height: 1;
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

    .preview-info strong {
      font-size: 14px;
    }

    .preview-info p {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.12;
    }

    .exhibition-description {
      width: 100%;
      max-width: none;
      max-height: 72px;
      overflow: hidden;
      padding-top: 2px;
      padding-bottom: 2px;
    }

    .exhibition-description.expanded {
      max-height: 24vh;
      overflow-y: auto;
      padding-top: 4px;
      padding-right: 8px;
      padding-bottom: 12px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .exhibition-description.expanded::-webkit-scrollbar {
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
      width: 100%;
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
      -webkit-overflow-scrolling: touch;
    }

    .image-grid::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
      background: transparent;
    }

    .image-card,
    .image-card:nth-child(even),
    .image-card:nth-child(4n + 1),
    .image-card:nth-child(4n + 2),
    .image-card:nth-child(4n + 3),
    .image-card:nth-child(4n + 4) {
      height: 440px;
      min-height: 0;
      overflow: hidden;
      background: #eeeeee;
      transform: none;
    }

    .image-card:nth-child(4n + 1):hover,
    .image-card:nth-child(4n + 1).active,
    .image-card:nth-child(4n + 2):hover,
    .image-card:nth-child(4n + 2).active,
    .image-card:nth-child(4n + 3):hover,
    .image-card:nth-child(4n + 3).active,
    .image-card:nth-child(4n + 4):hover,
    .image-card:nth-child(4n + 4).active {
      transform: none;
    }

    .image-card::before,
    .image-card::after {
      display: none;
    }

    .image-card figure {
      width: 100%;
      height: 100%;
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
      min-height: 0;
      object-fit: cover;
      transform: none;
    }

    .image-grid:hover .image-card img {
      opacity: 0.42;
      filter: grayscale(10%) contrast(0.96) brightness(1.02);
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      width: calc(100% - 36px);
      height: calc(100% - 36px);
      min-height: 0;
      object-fit: contain;
      opacity: 1;
      filter: none;
    }

    .magnify-icon {
      display: none;
    }

    .image-number {
      display: none;
    }

    .back-to-top {
      display: block;
      margin: 44px 0 0;
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
      font-size: 14px;
    }
  }

  @media (max-width: 700px) {
    .exhibitions-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 108px 16px 0;
    }

    .left-column {
      padding-top: 104px;
      padding-bottom: 24px;
    }

    .exhibition-filter {
      position: fixed;
      top: 108px;
      left: 16px;
      right: 16px;
      z-index: 40;
      width: auto;
      max-height: 100px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 7px;
      margin: 0;
      padding: 0;
      text-align: left;
      background: #ffffff;
    }

    .all-exhibitions-button,
    .selected-exhibition-button {
      display: inline-flex;
      justify-content: flex-start;
      width: clamp(125px, 42vw, 180px);
      margin: 0;
      padding: 0;
      text-align: left;
      font-size: 12px;
      line-height: 1.08;
    }

    .exhibition-preview h1 {
      max-width: 100%;
      margin: 0 0 8px;
      font-size: 14px;
      text-align: left;
    }

    .preview-info strong {
      font-size: 12px;
    }

    .preview-info p {
      font-size: 12px;
      font-weight: 500;
      line-height: 1.12;
    }

    .exhibition-description {
      max-height: 58px;
      padding-top: 2px;
      padding-bottom: 2px;
    }

    .exhibition-description.expanded {
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

    .image-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 10px;
      padding: 0 0 calc(145px + env(safe-area-inset-bottom));
    }

    .image-card,
    .image-card:nth-child(even),
    .image-card:nth-child(4n + 1),
    .image-card:nth-child(4n + 2),
    .image-card:nth-child(4n + 3),
    .image-card:nth-child(4n + 4) {
      height: auto;
      min-height: auto;
      overflow: visible;
      background: transparent;
    }

    .image-card figure {
      height: 260px;
      background: #eeeeee;
      overflow: hidden;
    }

    .image-card img {
      width: 100%;
      height: 100%;
      min-height: 260px;
      object-fit: cover;
    }

    .image-grid:hover .image-card img {
      opacity: 1;
      filter: none;
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

    .exhibition-lightbox {
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
      padding-top: 100px;
      padding-bottom: 22px;
    }

    .exhibition-preview h1 {
      font-size: 14px;
    }

    .exhibition-description {
      max-height: 54px;
    }

    .exhibition-description.expanded {
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
