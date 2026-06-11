<script>
  import { onMount, onDestroy } from "svelte";

  let { data } = $props();

  let selectedImage = $state(null);
  let scrollProgress = $state(0);

  function openLightbox(image) {
    selectedImage = image;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    selectedImage = null;
    document.body.style.overflow = "";
  }

  onMount(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;

      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      scrollProgress =
        scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
    };

    updateProgress();

    window.addEventListener("scroll", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  });

  onDestroy(() => {
    document.body.style.overflow = "";
  });
</script>

<main class="exhibition-page">
  <section class="exhibition-intro">
    <p class="section-label">Exhibition</p>

    <h1>{data.title}</h1>

    <p class="credit">{data.credit}</p>
  </section>

  <div class="year-block">
    <span>{data.year}</span>

    <div class="progress-line">
      <div
        class="progress-indicator"
        style={`height: ${scrollProgress}%`}
      ></div>
    </div>
  </div>

  <section class="artwork-list">
    {#each data.images as image, index}
      <button
        class="artwork-card"
        class:right={index % 2 !== 0}
        onclick={() => openLightbox(image)}
      >
        <img src={image.src} alt={image.alt} />

        <span class="artwork-title">{image.alt}</span>
      </button>
    {/each}
  </section>

  {#if data.nextYear}
    <a href={`/exhibitions/${data.nextYear}`} class="next-year-link">
      <span></span>
      {data.nextYear}
    </a>
  {/if}

  {#if selectedImage}
    <div class="lightbox">
      <button class="lightbox-close" onclick={closeLightbox}>Close ×</button>

      <div class="lightbox-content">
        <img src={selectedImage.src} alt={selectedImage.alt} />

        <p>{selectedImage.alt}</p>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    overflow: auto;
    font-family: Georgia, "Times New Roman", serif;
    background: #f7f6f4;
    color: #6f6b68;
  }

  .exhibition-page {
    min-height: 100vh;
    padding: 140px 8vw 100px;
    box-sizing: border-box;
  }

  .exhibition-intro {
    max-width: 760px;
    margin-bottom: 70px;
  }

  .section-label {
    margin: 0 0 24px;
    font-size: 15px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #aaa39e;
  }

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 400;
    line-height: 1.4;
  }

  .credit {
    margin-top: 24px;
    font-size: 18px;
    color: #9b948f;
  }

  .year-block {
    position: fixed;
    top: 50%;
    right: 7vw;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 28px;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .year-block span {
    font-size: clamp(72px, 9vw, 150px);
    font-style: italic;
    line-height: 0.8;
    color: #d8d2ce;
  }

  .progress-line {
    position: relative;
    width: 2px;
    height: 300px;
    background: #d8d2ce;
    overflow: hidden;
  }

  .progress-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #6f6b68;
    transition: height 0.15s ease-out;
  }

  .artwork-list {
    display: flex;
    flex-direction: column;
    gap: 70px;
    padding-right: 22vw;
  }

  .artwork-card {
    width: min(40vw, 520px);
    border: 0;
    background: transparent;
    padding: 0;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
  }

  .artwork-card.right {
    margin-left: auto;
    margin-top: -180px;
  }

  .artwork-card img {
    width: 100%;
    height: auto;
    display: block;
  }

  .artwork-title {
    display: block;
    margin: 14px 0 0;
    font-size: 17px;
    color: #8f8883;
  }

  .next-year-link {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 28px;
    margin-top: 120px;
    padding-right: 22vw;
    color: #d8d2ce;
    text-decoration: none;
    font-size: clamp(64px, 9vw, 140px);
    font-style: italic;
    line-height: 1;
  }

  .next-year-link span {
    width: 1px;
    height: 160px;
    background: #d8d2ce;
  }

  .next-year-link:hover {
    color: #6f6b68;
  }

  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(247, 246, 244, 0.94);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    box-sizing: border-box;
  }

  .lightbox-content {
    max-width: 90vw;
    max-height: 90vh;
    text-align: center;
  }

  .lightbox-content img {
    max-width: 100%;
    max-height: 82vh;
    display: block;
    object-fit: contain;
  }

  .lightbox-content p {
    margin: 18px 0 0;
    font-size: 18px;
    color: #6f6b68;
  }

  .lightbox-close {
    position: fixed;
    top: 34px;
    right: 44px;
    border: 0;
    background: transparent;
    color: #6f6b68;
    font-size: 46px;
    line-height: 1;
    cursor: pointer;
  }

  @media (max-width: 800px) {
    .exhibition-page {
      padding: 120px 24px 80px;
    }

    .exhibition-intro {
      margin-bottom: 60px;
    }

    h1 {
      font-size: 20px;
    }

    .year-block {
      position: relative;
      top: auto;
      right: auto;
      transform: none;
      margin-bottom: 50px;
      pointer-events: auto;
    }

    .year-block span {
      font-size: 72px;
    }

    .progress-line {
      height: 120px;
    }

    .artwork-list {
      gap: 50px;
      padding-right: 0;
    }

    .artwork-card {
      width: 100%;
    }

    .lightbox {
      padding: 24px;
    }

    .lightbox-close {
      top: 22px;
      right: 24px;
      font-size: 40px;
    }
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 18px;
    }

    .artwork-title {
      font-size: 15px;
    }

    .lightbox-content p {
      font-size: 15px;
    }
  }
</style>
