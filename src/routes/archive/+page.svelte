<script>
  let { data } = $props();

  let posts = $derived(data.posts || []);
  let activePostId = $state(null);
  let menuOpen = $state(false);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Paintings", href: "/painting" },
    { label: "Exhibitions", href: "/exhibitions" },
    { label: "Events", href: "/event" },
    { label: "Contact", href: "/contact" },
    { label: "Archive", href: "/archive" },
  ];

  let activePost = $derived(
    posts.find((post) => post.id === activePostId) || posts[0],
  );

  let menuImages = $derived(() => {
    const images = [];

    posts.forEach((post) => {
      if (post.featuredImage && images.length < 10) {
        images.push(post.featuredImage);
      }
    });

    return images;
  });

  function cleanText(value) {
    return value || "";
  }

  function slugify(value = "") {
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getPostCategorySlug(post) {
    const raw =
      post.categorySlug ||
      post.category ||
      post.groupSlug ||
      post.group ||
      post.type ||
      post.postType ||
      "";

    const slug = slugify(raw);

    if (slug === "painting" || slug === "paintings") return "painting";
    if (slug === "exhibition" || slug === "exhibitions") return "exhibitions";
    if (slug === "event" || slug === "events") return "event";
    if (slug === "performance" || slug === "performances")
      return "performances";

    return slug;
  }

  function getArchivePostLink(post) {
    const categorySlug = getPostCategorySlug(post);

    if (categorySlug === "painting") {
      return `/painting?post=${post.id}`;
    }

    if (categorySlug === "exhibitions") {
      return `/exhibitions?post=${post.id}`;
    }

    if (categorySlug === "event") {
      return `/event?post=${post.id}`;
    }

    if (categorySlug === "performances") {
      return `/performances?post=${post.id}`;
    }

    if (post.frontendLink && post.frontendLink !== "#") {
      return post.frontendLink;
    }

    return `/archive?post=${post.id}`;
  }

  function selectPost(post) {
    activePostId = post.id;
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }
</script>

<svelte:head>
  <title>Archive | Eva Eichinger</title>

  <meta
    name="description"
    content="Archive of selected posts and works by Eva Eichinger."
  />
</svelte:head>

<main class="archive-page" class:menu-is-open={menuOpen}>
  <a href="/" class="archive-logo-text" onclick={closeMenu}>Eva Eichinger</a>

  <div class="archive-page-label">Archive</div>

  <button
    class="archive-menu-button"
    type="button"
    aria-label={menuOpen ? "Close menu" : "Open menu"}
    aria-expanded={menuOpen}
    onclick={toggleMenu}
  >
    <span class="desktop-menu-word">{menuOpen ? "Close" : "Menu"}</span>
    <span class="mobile-menu-lines">
      <span></span>
      <span></span>
    </span>
  </button>

  <section class="archive-hero" aria-label="Archive">
    <div class="archive-fixed-top">
      <div class="archive-center-title">
        <span>COLLECTION OF MY WORKS</span>
        <strong>{cleanText(activePost?.title) || "ARCHIVE"}</strong>
      </div>

      {#if activePost?.featuredImage}
        <div class="active-image-preview">
          <img
            src={activePost.featuredImage}
            alt={cleanText(activePost.title)}
          />
        </div>
      {/if}
    </div>

    {#if posts.length > 0}
      <div class="archive-items">
        {#each posts.slice(0, 10) as post, index}
          <a
            href={getArchivePostLink(post)}
            class={`archive-item archive-position-${index + 1}`}
            class:active={activePost?.id === post.id}
            onmouseenter={() => selectPost(post)}
            onfocus={() => selectPost(post)}
          >
            <span>{post.number || String(index + 1).padStart(2, "0")}</span>
            <strong>{cleanText(post.title)}</strong>
            <p>{cleanText(post.excerpt || post.content)}</p>
          </a>
        {/each}
      </div>
    {:else}
      <p class="empty-message">No archive posts found.</p>
    {/if}
  </section>

  <section class:open={menuOpen} class="archive-menu-overlay" aria-label="Menu">
    <div class="desktop-menu-brand-block">
      <div class="desktop-menu-brand">Eva Eichinger</div>

      <div class="desktop-menu-address">
        <address>
          Westbahnstraße 27-29<br />
          1070 Vienna
        </address>

        <a href="mailto:info@evaeichinger.com">
          Email: info@evaeichinger.com
        </a>
      </div>
    </div>

    <div class="desktop-menu-images" aria-hidden="true">
      {#if menuImages().length > 0}
        {#each menuImages() as image}
          <div class="desktop-menu-image">
            <img src={image} alt="" loading="lazy" />
          </div>
        {/each}
      {/if}
    </div>

    <nav class="menu-links-area" aria-label="Main navigation">
      <div class="menu-grid">
        {#each menuItems as item}
          <a href={item.href} class="main-menu-link" onclick={closeMenu}>
            {item.label}
          </a>
        {/each}
      </div>

      <div class="desktop-social-links">
        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
          Linkedin
        </a>

        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>
    </nav>

    <div class="desktop-menu-credit">Website by Zora Design</div>
    <div class="desktop-menu-rights">All rights reserved ©Eva Eichinger</div>

    <div class="mobile-menu-extra">
      <div class="mobile-social-icons">
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
          Facebook
        </a>

        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>

        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>

      <div class="mobile-contact-info">
        <p>Contact</p>

        <a href="mailto:info@evaeichinger.com">
          Email: info@evaeichinger.com
        </a>

        <address>
          Westbahnstraße 27-29<br />
          1070 Vienna
        </address>
      </div>
    </div>

    <div class="mobile-design-credit">Designed by zoraDesign</div>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    overflow-x: hidden;
    background: #000000;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .archive-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #000000;
    color: #ffffff;
    padding: 0;
  }

  .archive-logo-text {
    position: fixed;
    top: 32px;
    left: 28px;
    z-index: 120;
    color: rgba(255, 255, 255, 0.22);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 21px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .archive-page-label {
    position: fixed;
    top: 32px;
    right: 28px;
    z-index: 120;
    color: rgba(255, 255, 255, 0.62);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 22px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .archive-menu-button {
    position: fixed;
    top: 50%;
    right: -22px;
    z-index: 140;
    width: 110px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    color: #ffffff;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 21px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.04em;
    cursor: pointer;
    transform: rotate(-90deg);
    transform-origin: center center;
  }

  .mobile-menu-lines {
    display: none;
  }

  .menu-is-open .archive-page-label,
  .menu-is-open .archive-logo-text {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .archive-hero {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    background: #000000;
  }

  .archive-center-title {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 5;
    width: min(560px, 52vw);
    color: #ffffff;
    text-align: center;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .archive-center-title span {
    display: block;
    padding-bottom: 10px;
    font-size: 12px;
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: -0.075em;
    text-transform: uppercase;
  }

  .archive-center-title strong {
    display: block;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 40px;
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: -0.075em;
    text-transform: uppercase;
  }

  .archive-items {
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: 78px 120px 150px 28px;
  }

  .archive-item {
    position: absolute;
    z-index: 4;
    width: min(330px, 21vw);
    min-height: 80px;
    padding-left: 14px;
    border-left: 1px solid rgba(255, 255, 255, 0.24);
    color: rgba(255, 255, 255, 0.28);
    text-decoration: none;
    transition:
      color 0.3s ease,
      opacity 0.3s ease;
  }

  .archive-item:hover,
  .archive-item:focus,
  .archive-item.active {
    color: rgba(255, 255, 255, 0.82);
  }

  .archive-item strong {
    display: block;
    margin: 0 0 6px;
    color: inherit;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.15;
    text-transform: uppercase;
  }

  .archive-item span {
    display: block;
    margin: 0 0 6px;
    color: inherit;
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
  }

  .archive-item p {
    display: -webkit-box;
    margin: 0;
    overflow: hidden;
    color: inherit;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.15;
    text-transform: uppercase;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  .archive-position-1 {
    top: 8vh;
    left: 41vw;
  }

  .archive-position-2 {
    top: 8vh;
    left: 73vw;
  }

  .archive-position-3 {
    top: 27vh;
    left: 21vw;
  }

  .archive-position-4 {
    top: 27vh;
    left: 58vw;
  }

  .archive-position-5 {
    top: 46vh;
    left: 28px;
  }

  .archive-position-6 {
    top: 46vh;
    left: 65vw;
  }

  .archive-position-7 {
    top: 66vh;
    left: 55vw;
  }

  .archive-position-8 {
    top: 66vh;
    left: 77vw;
  }

  .archive-position-9 {
    top: 84vh;
    left: 30vw;
  }

  .archive-position-10 {
    top: 84vh;
    left: 58vw;
  }

  .active-image-preview {
    position: fixed;
    left: 28px;
    bottom: 34px;
    z-index: 6;
    width: 335px;
    height: 225px;
    overflow: hidden;
    background: #111111;
    opacity: 0.98;
  }

  .active-image-preview img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  .empty-message {
    position: fixed;
    left: 50%;
    top: 50%;
    margin: 0;
    color: #ffffff;
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;
    transform: translate(-50%, -50%);
  }

  .archive-menu-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: #000000;
    color: #ffffff;
    opacity: 0;
    pointer-events: none;
    transform: translateY(100%);
    transition:
      transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
      opacity 0.4s ease;
  }

  .archive-menu-overlay.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .desktop-menu-brand-block {
    position: absolute;
    left: 28px;
    bottom: 45%;
    color: #ffffff;
  }

  .desktop-menu-brand {
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: clamp(30px, 3vw, 44px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.055em;
  }

  .desktop-menu-address {
    margin-top: 18px;
    color: rgba(255, 255, 255, 0.72);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.45;
    letter-spacing: -0.02em;
  }

  .desktop-menu-address address {
    margin: 0 0 7px;
    font-style: normal;
  }

  .desktop-menu-address a {
    color: rgba(255, 255, 255, 0.72);
    text-decoration: none;
  }

  .desktop-menu-images {
    position: absolute;
    top: 0;
    left: 30vw;
    width: 160px;
    height: 100dvh;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .desktop-menu-images::-webkit-scrollbar {
    display: none;
  }

  .desktop-menu-image {
    width: 100%;
    height: 230px;
    margin-bottom: 8px;
    overflow: hidden;
    background: #222222;
  }

  .desktop-menu-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    filter: grayscale(100%);
    opacity: 0.82;
  }

  .menu-links-area {
    position: absolute;
    left: 50vw;
    top: 50%;
    z-index: 110;
    transform: translateY(-50%);
  }

  .menu-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .main-menu-link {
    display: inline-block;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: clamp(48px, 4.2vw, 76px);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.075em;
    text-decoration: none;
    text-transform: none;
    transition: opacity 0.3s ease;
  }

  .main-menu-link:hover,
  .main-menu-link:focus {
    opacity: 0.6;
  }

  .desktop-social-links {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 72px;
  }

  .desktop-social-links a {
    width: fit-content;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 0.95;
    text-decoration: none;
    text-transform: uppercase;
  }

  .desktop-menu-credit {
    position: absolute;
    left: 28px;
    bottom: 28px;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
  }

  .desktop-menu-rights {
    position: absolute;
    right: 28px;
    bottom: 28px;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
  }

  .mobile-menu-extra,
  .mobile-design-credit {
    display: none;
  }

  @media (max-width: 1024px) {
    :global(html),
    :global(body) {
      height: 100%;
      overflow: hidden;
    }

    .archive-page {
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }

    .archive-logo-text {
      top: 22px;
      left: 24px;
      z-index: 140;
      color: #ffffff;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.45rem;
      letter-spacing: 0.055em;
      text-underline-offset: 7px;
    }

    .archive-page-label {
      display: none;
    }

    .archive-menu-button {
      top: 22px;
      right: 24px;
      z-index: 145;
      width: 38px;
      height: 16px;
      display: flex;
      padding: 0;
      text-decoration: none;
      transform: none;
    }

    .desktop-menu-word {
      display: none;
    }

    .mobile-menu-lines {
      display: flex;
      width: 38px;
      height: 16px;
      flex-direction: column;
      justify-content: space-between;
    }

    .mobile-menu-lines span {
      display: block;
      width: 100%;
      height: 1px;
      background: #ffffff;
      transition: transform 0.25s ease;
    }

    .archive-menu-button[aria-expanded="true"]
      .mobile-menu-lines
      span:nth-child(1) {
      transform: translateY(7.5px) rotate(45deg);
    }

    .archive-menu-button[aria-expanded="true"]
      .mobile-menu-lines
      span:nth-child(2) {
      transform: translateY(-7.5px) rotate(-45deg);
    }

    .archive-hero {
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }

    .archive-fixed-top {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 20;
      background: #000000;
    }

    .archive-center-title {
      position: fixed;
      left: 24px;
      top: 118px;
      width: calc(100% - 48px);
      text-align: left;
      transform: none;
    }

    .archive-center-title span {
      padding-bottom: 8px;
      font-size: 12px;
      line-height: 1;
      letter-spacing: 0;
    }

    .archive-center-title strong {
      font-size: clamp(18px, 3.2vw, 25px);
      line-height: 1;
      letter-spacing: -0.055em;
    }

    .active-image-preview {
      position: fixed;
      top: 182px;
      left: 24px;
      bottom: auto;
      width: calc(100% - 48px);
      height: 280px;
      margin: 0;
    }

    .archive-items {
      position: fixed;
      top: 500px;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      gap: 44px;
      padding: 0 24px calc(100px + env(safe-area-inset-bottom));
      scrollbar-width: none;
      -ms-overflow-style: none;
      overscroll-behavior: contain;
    }

    .archive-items::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    .archive-item,
    .archive-position-1,
    .archive-position-2,
    .archive-position-3,
    .archive-position-4,
    .archive-position-5,
    .archive-position-6,
    .archive-position-7,
    .archive-position-8,
    .archive-position-9,
    .archive-position-10 {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      width: 100%;
      min-height: auto;
      margin: 0;
    }

    .archive-item {
      display: block;
      padding-left: 18px;
      color: rgba(255, 255, 255, 0.72);
    }

    .archive-item span {
      display: block;
      margin: 0 0 10px;
      font-size: 12px;
      line-height: 1;
    }

    .archive-item strong {
      display: block;
      margin: 0 0 10px;
      font-size: 13px;
      line-height: 1.25;
    }

    .archive-item p {
      display: block;
      margin: 0;
      overflow: visible;
      font-size: 13px;
      line-height: 1.35;
      -webkit-line-clamp: unset;
      -webkit-box-orient: unset;
    }

    .archive-item.active,
    .archive-item:hover,
    .archive-item:focus {
      color: #ffffff;
    }

    .archive-menu-overlay {
      padding: 120px 24px 64px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      background: radial-gradient(
          circle at top right,
          rgba(255, 255, 255, 0.12),
          transparent 34%
        ),
        linear-gradient(180deg, #050505 0%, #000000 100%);
      transform: translateX(100%);
    }

    .archive-menu-overlay.open {
      transform: translateX(0);
    }

    .desktop-menu-brand-block,
    .desktop-menu-images,
    .desktop-social-links,
    .desktop-menu-rights,
    .desktop-menu-credit {
      display: none;
    }

    .menu-links-area {
      position: static;
      transform: none;
    }

    .menu-grid {
      gap: 24px;
    }

    .main-menu-link {
      color: #ffffff;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.35rem;
      font-weight: 300;
      line-height: 1;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .mobile-menu-extra {
      display: block;
      margin-top: 38px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.22);
    }

    .mobile-social-icons {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      margin-bottom: 28px;
    }

    .mobile-social-icons a {
      color: #ffffff;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 0.9rem;
      font-weight: 300;
      letter-spacing: 0.09em;
      text-decoration: none;
      text-transform: uppercase;
      opacity: 0.82;
    }

    .mobile-contact-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
      color: rgba(255, 255, 255, 0.72);
      font-size: 0.95rem;
      font-weight: 300;
      line-height: 1.45;
      text-align: left;
    }

    .mobile-contact-info p {
      margin: 0;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 400;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .mobile-contact-info a {
      color: rgba(255, 255, 255, 0.72);
      text-decoration: none;
    }

    .mobile-contact-info address {
      margin: 0;
      font-style: normal;
    }

    .mobile-design-credit {
      display: block;
      margin-top: auto;
      padding-top: 34px;
      color: rgba(255, 255, 255, 0.65);
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0.04em;
    }
  }

  @media (max-width: 700px) {
    .archive-logo-text {
      top: 22px;
      left: 16px;
      font-size: 1.35rem;
    }

    .archive-menu-button {
      top: 22px;
      right: 16px;
    }

    .archive-center-title {
      top: 108px;
      left: 16px;
      width: calc(100% - 32px);
    }

    .archive-center-title strong {
      font-size: clamp(15px, 4.2vw, 20px);
    }

    .active-image-preview {
      top: 165px;
      left: 16px;
      width: calc(100% - 32px);
      height: 220px;
    }

    .archive-items {
      top: 420px;
      gap: 40px;
      padding: 0 16px calc(100px + env(safe-area-inset-bottom));
    }

    .archive-item {
      padding-left: 16px;
    }

    .archive-item p {
      font-size: 13px;
    }

    .archive-menu-overlay {
      padding: 112px 24px 56px;
    }
  }
</style>
