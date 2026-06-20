<script>
  let { data } = $props();

  const dummySections = [
    {
      id: "studio",
      title: "Studio",
      text: [
        "Studio text will be added here later. This is placeholder content for now.",
      ],
    },
    {
      id: "press",
      title: "Press",
      text: [
        "Press information will be added here later. This is placeholder content for now.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      text: [
        "Contact details will be added here later. This is placeholder content for now.",
      ],
    },
  ];

  const aboutSections = [
    ...(data.sections || []).map((section, index) => ({
      id: `section-${index}`,
      title: section.title,
      text: section.text,
    })),
    ...dummySections,
  ];

  let activeSectionId = $state(aboutSections[0]?.id || "");

  let activeSection = $derived(
    aboutSections.find((section) => section.id === activeSectionId) ||
      aboutSections[0],
  );

  function selectSection(sectionId) {
    activeSectionId = sectionId;
  }
</script>

<main class="about-page">
  <section class="about-feature" aria-label="About Eva Eichinger">
    <aside class="about-list-column" aria-label="About sections">
      <div class="about-heading">
        <h1 class="about-label">{data.pageTitle}</h1>
      </div>

      <div class="about-scroll-area">
        <div class="about-links">
          {#each aboutSections as section}
            <button
              type="button"
              class="about-button"
              class:active={activeSectionId === section.id}
              onclick={() => selectSection(section.id)}
            >
              {@html section.title}
            </button>
          {/each}
        </div>
      </div>
    </aside>

    <div class="about-content-column">
      {#if activeSection}
        <div class="about-panel">
          <h2>{@html activeSection.title}</h2>

          <div class="about-section-text">
            {#each activeSection.text as paragraph}
              <p>{@html paragraph}</p>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    overflow-x: hidden;
    font-family: Georgia, "Times New Roman", serif;
    background: #ffffff;
    color: #4d4a47;
  }

  .about-page {
    width: 100%;
    min-height: 100vh;
    padding: 116px clamp(28px, 5vw, 72px) 92px;
    box-sizing: border-box;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .about-feature {
    width: 100%;
    max-width: 1500px;
    display: grid;
    grid-template-columns: 20% minmax(0, 80%);
    gap: clamp(14px, 2vw, 32px);
    align-items: center;
    background: #ffffff;
  }

  .about-list-column {
    width: 100%;
    height: min(76vh, 820px);
    justify-self: start;
    display: flex;
    flex-direction: column;
  }

  .about-heading {
    margin-bottom: 34px;
  }

  .about-label {
    margin: 0;
    color: #3f3c39;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.15;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .about-scroll-area {
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .about-scroll-area::-webkit-scrollbar {
    display: none;
  }

  .about-links {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .about-button {
    width: fit-content;
    max-width: 100%;
    display: inline-block;
    padding: 0;
    border: 0;
    background: transparent;
    color: #77716d;
    font-family: inherit;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.25;
    letter-spacing: 0.08em;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      color 0.35s ease,
      opacity 0.35s ease;
  }

  .about-button::after {
    content: "";
    display: block;
    width: 0;
    height: 1px;
    margin-top: 5px;
    background: currentColor;
    transition: width 0.5s ease;
  }

  .about-button:hover,
  .about-button:focus,
  .about-button.active {
    color: #1f1f1f;
  }

  .about-button:hover::after,
  .about-button:focus::after,
  .about-button.active::after {
    width: 100%;
  }

  .about-content-column {
    width: 100%;
    min-width: 0;
    height: min(76vh, 820px);
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .about-content-column::-webkit-scrollbar {
    display: none;
  }

  .about-panel {
    width: 100%;
    animation: contentReveal 0.65s ease both;
  }

  .about-panel h2 {
    margin: 0 0 34px;
    color: #2f2d2b;
    font-size: 22px;
    font-weight: 300;
    line-height: 1.3;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .about-section-text {
    width: 100%;
  }

  .about-section-text p {
    margin: 0 0 22px;
    color: #7f7974;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.75;
    letter-spacing: 0.02em;
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

  @keyframes contentReveal {
    from {
      opacity: 0;
      transform: scale(1.015);
      filter: blur(4px);
    }

    to {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }
  }

  @media (max-width: 900px) {
    .about-page {
      padding: 120px 40px 92px;
    }

    .about-feature {
      grid-template-columns: 220px minmax(0, 1fr);
      gap: 34px;
    }

    .about-list-column {
      max-width: 220px;
      height: min(62vh, 620px);
    }

    .about-content-column {
      height: min(76vh, 760px);
    }
  }

  @media (max-width: 700px) {
    :global(body) {
      overflow: hidden;
    }

    .about-page {
      height: 100dvh;
      min-height: 100dvh;
      padding: 118px 24px 0;
      align-items: stretch;
      overflow: hidden;
    }

    .about-feature {
      width: 100%;
      height: calc(100dvh - 118px);
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto minmax(0, 1fr);
      gap: 24px;
      align-items: stretch;
      overflow-x: visible;
      overflow-y: hidden;
    }

    .about-list-column {
      order: 1;
      max-width: none;
      height: auto;
      overflow: visible;
    }

    .about-heading {
      margin-bottom: 18px;
    }

    .about-label {
      font-size: 18px;
    }

    .about-scroll-area {
      width: calc(100vw - 48px);
      max-width: calc(100vw - 48px);
      overflow-x: auto;
      overflow-y: hidden;
      padding-right: 0;
      padding-bottom: 10px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-x;
    }

    .about-scroll-area::-webkit-scrollbar {
      display: none;
    }

    .about-links {
      width: max-content;
      min-width: max-content;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 28px;
      padding-bottom: 4px;
    }

    .about-button {
      flex: 0 0 auto;
      width: auto;
      max-width: none;
      font-size: 14px;
      white-space: nowrap;
    }

    .about-content-column {
      order: 2;
      height: 100%;
      padding-bottom: 130px;
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
    }

    .about-panel h2 {
      font-size: 20px;
    }

    @media (max-width: 700px) {
      .about-section-text p {
        font-size: 14px;
        line-height: 1.7;
      }
    }
  }
</style>
