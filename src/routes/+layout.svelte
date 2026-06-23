<script>
  import { page } from "$app/state";

  let { children, data } = $props();

  let menuOpen = $state(false);

  const aboutItems = data?.aboutMenuItems || [];
  const paintingItems = data?.paintingMenuItems || [];
  const exhibitionItems = data?.exhibitionMenuItems || [];
  const eventItems = data?.eventMenuItems || [];

  const menuItems = [
    { label: "Home", href: "/", children: [] },
    { label: "About", href: "/about", children: aboutItems },
    { label: "Paintings", href: "/painting", children: paintingItems },
    { label: "Exhibitions", href: "/exhibitions", children: exhibitionItems },
    { label: "Events", href: "/event", children: eventItems },
    { label: "Contact", href: "/contact", children: [] },
    { label: "Archive", href: "/archive", children: [] },
  ];

  let menuImages = $derived(() => {
    const images = [];

    [
      ...paintingItems,
      ...exhibitionItems,
      ...eventItems,
      ...aboutItems,
    ].forEach((item) => {
      if (item.featuredImage && images.length < 10) {
        images.push(item.featuredImage);
      }
    });

    return images;
  });

  let currentPageLabel = $derived(() => {
    const path = page.url.pathname;

    if (path === "/") return "Home";
    if (path.startsWith("/about")) return "About";
    if (path.startsWith("/painting")) return "Paintings";
    if (path.startsWith("/exhibitions")) return "Exhibitions";
    if (path.startsWith("/event")) return "Events";
    if (path.startsWith("/archive")) return "Archive";
    if (path.startsWith("/contact")) return "Contact";

    return "Work";
  });

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }
</script>

<header class="site-header" class:menu-is-open={menuOpen}>
  <a href="/" class="logo" onclick={closeMenu}>Eva Eichinger</a>

  <div class="desktop-page-label">
    {currentPageLabel()}
  </div>

  <button
    class="desktop-side-label desktop-menu-text"
    type="button"
    aria-label={menuOpen ? "Close menu" : "Open menu"}
    aria-expanded={menuOpen}
    onclick={toggleMenu}
  >
    {menuOpen ? "Close" : "Menu"}
  </button>

  <a
    href="/archive"
    class="desktop-side-label desktop-archive-fixed"
    onclick={closeMenu}
  >
    Archive
  </a>

  <button
    class="menu-toggle"
    type="button"
    aria-label={menuOpen ? "Close menu" : "Open menu"}
    aria-expanded={menuOpen}
    onclick={toggleMenu}
  >
    <span></span>
    <span></span>
  </button>

  <nav class:open={menuOpen} class="main-nav" aria-label="Main navigation">
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

    <div class="menu-links-area">
      <div class="menu-grid">
        {#each menuItems as item}
          <div class="menu-grid-item">
            <a href={item.href} class="main-menu-link" onclick={closeMenu}>
              {item.label}
            </a>

            {#if item.children && item.children.length > 0}
              <div class="submenu-grid">
                {#each item.children as child}
                  <a href={child.href} class="submenu-link" onclick={closeMenu}>
                    {#if child.featuredImage}
                      <img
                        src={child.featuredImage}
                        alt=""
                        class="submenu-thumb"
                        loading="lazy"
                      />
                    {/if}

                    <span>{child.label}</span>
                  </a>
                {/each}
              </div>
            {/if}
          </div>
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
    </div>

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
  </nav>
</header>

{@render children()}

<style>
  .site-header {
    position: fixed;
    inset: 0 0 auto;
    z-index: 100;
    width: 100%;
    pointer-events: none;
  }

  .logo {
    position: fixed;
    top: 32px;
    left: 28px;
    z-index: 105;
    color: #2f2d2b;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 21px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.04em;
    pointer-events: auto;
    transition:
      color 0.25s ease,
      opacity 0.25s ease;
  }

  .logo:hover {
    opacity: 0.7;
  }

  .desktop-side-label {
    position: fixed;
    right: -22px;
    z-index: 105;
    width: 110px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2f2d2b;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 21px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.04em;
    transform: rotate(-90deg);
    transform-origin: center center;
    transition:
      color 0.25s ease,
      opacity 0.25s ease;
  }

  .desktop-page-label {
    position: fixed;
    top: 32px;
    right: 28px;
    z-index: 105;

    color: #2f2d2b;

    font-family: Arial, Helvetica, sans-serif;
    font-size: 22px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.04em;

    text-decoration: none;

    width: auto;
    height: auto;

    transform: none;
    transform-origin: initial;

    pointer-events: none;

    transition:
      color 0.25s ease,
      opacity 0.25s ease;
  }

  .desktop-menu-text,
  .desktop-archive-fixed {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }

  .desktop-menu-text {
    top: 50%;
    margin-top: -14px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    pointer-events: auto;
  }

  .desktop-menu-text:hover {
    opacity: 0.6;
  }

  .desktop-archive-fixed {
    bottom: 120px;
    pointer-events: auto;
  }

  .desktop-archive-fixed:hover {
    opacity: 0.6;
  }

  .site-header.menu-is-open .desktop-page-label,
  .site-header.menu-is-open .desktop-archive-fixed,
  .site-header.menu-is-open .logo {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .site-header.menu-is-open .desktop-menu-text {
    color: #ffffff;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .menu-toggle {
    display: none;
  }

  .main-nav {
    position: fixed;
    inset: 0;
    z-index: 103;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background-color: #000000;
    color: #ffffff;
    opacity: 0;
    pointer-events: none;
    transform: translateY(100%);
    transition:
      transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
      opacity 0.4s ease;
  }

  .main-nav.open {
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
    transform: translateY(-50%);
  }

  .menu-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .menu-grid-item {
    margin: 0;
    padding: 0;
  }

  .main-nav a {
    color: #ffffff;
    text-decoration: none;
    font-family: Arial, Helvetica, sans-serif;
  }

  .main-menu-link {
    display: inline-block;
    color: #ffffff;
    font-size: clamp(48px, 4.2vw, 76px);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.075em;
    text-transform: none;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .main-menu-link:hover,
  .main-menu-link:focus {
    opacity: 0.6;
    transform: translateX(8px);
  }

  .submenu-grid {
    display: none;
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
    font-size: 15px;
    font-weight: 900;
    line-height: 0.95;
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
    .logo {
      top: 22px;
      left: 24px;
      color: #2f2d2b;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.45rem;
      letter-spacing: 0.055em;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 7px;
    }

    .desktop-page-label,
    .desktop-menu-text,
    .desktop-archive-fixed,
    .desktop-menu-brand-block,
    .desktop-menu-images,
    .desktop-social-links,
    .desktop-menu-rights,
    .desktop-menu-credit {
      display: none;
    }

    .site-header.menu-is-open .logo {
      color: #ffffff;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .menu-toggle {
      position: fixed;
      top: 22px;
      right: 24px;
      z-index: 105;
      display: flex;
      width: 38px;
      height: 16px;
      padding: 0;
      border: none;
      background: transparent;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      pointer-events: auto;
    }

    .menu-toggle span {
      display: block;
      width: 100%;
      height: 1px;
      background: #2f2d2b;
      transition:
        transform 0.25s ease,
        background 0.25s ease;
    }

    .menu-toggle[aria-expanded="true"] span {
      background: #ffffff;
    }

    .menu-toggle[aria-expanded="true"] span:nth-child(1) {
      transform: translateY(7.5px) rotate(45deg);
    }

    .menu-toggle[aria-expanded="true"] span:nth-child(2) {
      transform: translateY(-7.5px) rotate(-45deg);
    }

    .main-nav {
      height: 100dvh;
      padding: 120px 24px 64px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 38px;
      overflow-y: auto;
      background: radial-gradient(
          circle at top right,
          rgba(255, 255, 255, 0.12),
          transparent 34%
        ),
        linear-gradient(180deg, #050505 0%, #000000 100%);
      color: #ffffff;
      transform: translateX(100%);
    }

    .main-nav.open {
      transform: translateX(0);
    }

    .menu-links-area {
      position: static;
      transform: none;
    }

    .menu-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow: visible;
    }

    .main-nav a {
      color: #ffffff;
      font-family: Georgia, "Times New Roman", serif;
    }

    .main-menu-link {
      color: #ffffff;
      font-size: 1.35rem;
      font-weight: 300;
      line-height: 1;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .main-menu-link:hover,
    .main-menu-link:focus {
      opacity: 0.65;
      transform: none;
    }

    .submenu-grid {
      display: none;
    }

    .mobile-menu-extra {
      display: block;
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
      font-size: 0.9rem;
      font-weight: 300;
      letter-spacing: 0.09em;
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
      font-size: 0.95rem;
      line-height: 1.45;
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

  @media (max-width: 600px) {
    .main-nav {
      padding: 112px 24px 56px;
    }

    .menu-grid {
      gap: 26px;
    }

    .main-menu-link {
      font-size: 1.3rem;
    }
  }
</style>
