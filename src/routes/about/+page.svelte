<script>
  import { onMount } from "svelte";

  let { data } = $props();

  let scrollProgress = $state(0);

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
</script>

<main class="about-page">
  <section class="about-sections">
    {#each data.sections as section}
      <div class="about-section">
        <div class="about-section-title">
          <h2>{@html section.title}</h2>
        </div>

        <div class="about-section-text">
          {#each section.text as paragraph}
            <p>{@html paragraph}</p>
          {/each}
        </div>
      </div>
    {/each}
  </section>

  <div class="about-title-block">
    <span>{data.pageTitle}</span>

    <div class="progress-line">
      <div
        class="progress-indicator"
        style={`height: ${scrollProgress}%`}
      ></div>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: Georgia, "Times New Roman", serif;
    background: #f7f6f4;
    color: #6f6b68;
  }

  .about-page {
    min-height: 100vh;
    padding: 200px 8vw 120px;
    box-sizing: border-box;
  }

  .about-sections {
    max-width: 900px;
    margin-left: 6vw;
    padding-right: 24vw;
  }

  .about-section {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 60px;
    align-items: start;
    margin-bottom: 90px;
  }

  .about-section-title h2 {
    margin: 0;
    color: #6f6b68;
    font-size: 24px;
    font-weight: 700;
    font-style: normal;
    line-height: 1.2;
  }

  .about-section-text p {
    margin: 0 0 30px;
    color: #7f7974;
    font-size: clamp(20px, 1.7vw, 27px);
    font-weight: 400;
    line-height: 1.38;
  }

  :global(.about-section-text a) {
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }

  :global(.about-section-text a:hover) {
    color: #4d4a47;
  }

  .about-title-block {
    position: fixed;
    top: 50%;
    right: 7vw;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 70px;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .about-title-block span {
    color: #e2ddda;
    font-size: clamp(72px, 8vw, 140px);
    font-style: italic;
    font-weight: 400;
    line-height: 0.8;
  }

  .progress-line {
    position: relative;
    width: 2px;
    height: 260px;
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

  @media (max-width: 900px) {
    .about-page {
      padding: 150px 24px 90px;
    }

    .about-sections {
      max-width: 100%;
      margin-left: 0;
      padding-right: 0;
    }

    .about-section {
      grid-template-columns: 1fr;
      gap: 28px;
      margin-bottom: 70px;
    }

    .about-title-block {
      position: relative;
      top: auto;
      right: auto;
      transform: none;
      margin-top: 80px;
      gap: 30px;
    }

    .about-title-block span {
      font-size: 72px;
    }

    .progress-line {
      height: 120px;
    }
  }

  @media (max-width: 600px) {
    .about-section-title h2 {
      font-size: 22px;
    }

    .about-section-text p {
      font-size: 18px;
    }
  }
</style>
