<script>
  import { onMount, onDestroy } from "svelte";

  let { data } = $props();

  const itemWidth = 350;

  let currentIndex = $state(0);

  let currentYear = $derived(data.years[currentIndex]);

  let sliderTransform = $derived(
    `translateX(calc(50vw - ${currentIndex * itemWidth + itemWidth / 2}px))`,
  );

  onMount(() => {
    const header = document.querySelector(".site-header");

    if (header) {
      header.style.display = "none";
    }
  });

  onDestroy(() => {
    const header = document.querySelector(".site-header");

    if (header) {
      header.style.display = "";
    }
  });

  function nextYear() {
    currentIndex =
      currentIndex === data.years.length - 1 ? 0 : currentIndex + 1;
  }

  function previousYear() {
    currentIndex =
      currentIndex === 0 ? data.years.length - 1 : currentIndex - 1;
  }

  function selectYear(index) {
    currentIndex = index;
  }
</script>

<main class="exhibitions-page">
  <a href="/" class="return-link">Return</a>

  <button
    class="year-arrow year-arrow-left"
    onclick={previousYear}
    aria-label="Previous year"
  >
    ←
  </button>

  <section class="year-selector">
    <div class="selected-year">{currentYear}</div>

    <div class="year-mask">
      <div class="year-row" style={`transform: ${sliderTransform}`}>
        {#each data.years as year, index}
          <a
            href={`/exhibitions/${year}`}
            class="year-item"
            class:active={index === currentIndex}
            onclick={(event) => {
              event.preventDefault();
              selectYear(index);
            }}
          >
            {year}
          </a>
        {/each}
      </div>
    </div>

    <div class="year-bottom">
      <span class="year-count">
        {String(currentIndex + 1).padStart(2, "0")} — {String(
          data.years.length,
        ).padStart(2, "0")}
      </span>

      <div class="discover-wrapper">
        <p class="discover-instruction">Select a year, then click Discover</p>

        <a href={`/exhibitions/${currentYear}`} class="discover-link">
          Discover
          <span></span>
        </a>
      </div>
    </div>
  </section>

  <button
    class="year-arrow year-arrow-right"
    onclick={nextYear}
    aria-label="Next year"
  >
    →
  </button>
</main>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden;
    font-family: Georgia, "Times New Roman", serif;
    background: #151515;
    color: #f4f1ee;
  }

  .exhibitions-page {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #151515;
  }

  .return-link {
    position: fixed;
    top: 48px;
    right: 8vw;
    z-index: 80;
    color: #8c8884;
    text-decoration: none;
    font-size: 22px;
  }

  .return-link:hover {
    color: #f4f1ee;
  }

  .year-selector {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .selected-year {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -48%);
    color: rgba(255, 255, 255, 0.035);
    font-size: clamp(180px, 28vw, 520px);
    font-weight: 400;
    line-height: 1;
    pointer-events: none;
  }

  .year-mask {
    position: absolute;
    inset: 0;
    z-index: 30;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .year-row {
    position: relative;
    display: flex;
    align-items: center;
    width: max-content;
    transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
  }

  .year-item {
    width: 350px;
    flex: 0 0 350px;
    text-align: center;
    color: #55514e;
    text-decoration: none;
    font-size: 82px;
    font-weight: 400;
    line-height: 1;
    white-space: nowrap;
    opacity: 0.75;
    transition:
      color 0.35s ease,
      font-size 0.35s ease,
      opacity 0.35s ease,
      transform 0.35s ease;
  }

  .year-item.active {
    color: #f4f1ee;
    font-size: 150px;
    opacity: 1;
    transform: translateY(-4px);
  }

  .year-item:hover {
    color: #f4f1ee;
    opacity: 1;
  }

  .year-arrow {
    position: fixed;
    top: 50%;
    z-index: 70;
    transform: translateY(-50%);
    border: 0;
    background: transparent;
    color: #8c8884;
    font-family: inherit;
    font-size: 54px;
    line-height: 1;
    cursor: pointer;
    padding: 70px 46px;
  }

  .year-arrow:hover {
    color: #f4f1ee;
  }

  .year-arrow-left {
    left: 0;
  }

  .year-arrow-right {
    right: 0;
  }

  .year-bottom {
    position: fixed;
    left: 8vw;
    right: 8vw;
    bottom: 90px;
    z-index: 80;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .year-count {
    color: #4d4d4d;
    font-size: 18px;
  }

  .discover-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 14px;
  }

  .discover-instruction {
    margin: 0;
    color: #ffffff;
    font-size: 14px;
    font-style: italic;
    letter-spacing: 0.03em;
    opacity: 0.8;
  }

  .discover-link {
    display: flex;
    align-items: center;
    gap: 28px;
    color: #f4f1ee;
    text-decoration: none;
    font-size: 54px;
    font-style: italic;
    line-height: 1;
  }

  .discover-link span {
    display: block;
    width: 70px;
    height: 1px;
    background: #8c8884;
  }

  .discover-link:hover {
    color: #8c8884;
  }

  @media (max-width: 900px) {
    .year-item {
      width: 240px;
      flex-basis: 240px;
      font-size: 58px;
    }

    .year-item.active {
      font-size: 92px;
    }

    .selected-year {
      font-size: 220px;
    }

    .year-arrow {
      font-size: 38px;
      padding: 40px 20px;
    }

    .year-bottom {
      bottom: 60px;
    }
  }

  @media (max-width: 600px) {
    .return-link {
      top: 32px;
      right: 24px;
      font-size: 18px;
    }

    .year-item {
      width: 150px;
      flex-basis: 150px;
      font-size: 34px;
    }

    .year-item.active {
      font-size: 56px;
    }

    .selected-year {
      font-size: 140px;
    }

    .year-arrow {
      font-size: 30px;
      padding: 28px 10px;
    }

    .year-bottom {
      left: 24px;
      right: 24px;
      bottom: 42px;
      gap: 24px;
    }

    .discover-wrapper {
      align-items: flex-end;
    }

    .discover-instruction {
      font-size: 13px;
      text-align: right;
    }

    .discover-link {
      font-size: 32px;
    }

    .discover-link span {
      width: 44px;
    }
  }
</style>
