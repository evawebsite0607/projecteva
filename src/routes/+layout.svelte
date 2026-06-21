<script>
  let { children, data } = $props();

  let menuOpen = $state(false);

  const aboutItems = data?.aboutMenuItems || [];
  const paintingItems = data?.paintingMenuItems || [];
  const exhibitionItems = data?.exhibitionMenuItems || [];
  const eventItems = data?.eventMenuItems || [];

  const menuItems = [
    {
      label: "About",
      href: "/about",
      children: aboutItems,
    },
    {
      label: "Paintings",
      href: "/painting",
      children: paintingItems,
    },
    {
      label: "Exhibitions",
      href: "/exhibitions",
      children: exhibitionItems,
    },
    {
      label: "Events",
      href: "/event",
      children: eventItems,
    },
  ];

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }
</script>

<header class="site-header">
  <a href="/" class="logo" onclick={closeMenu}>Eva Eichinger</a>

  <button
    class="menu-toggle"
    type="button"
    aria-label={menuOpen ? "Close menu" : "Open menu"}
    aria-expanded={menuOpen}
    onclick={toggleMenu}
  >
    <span></span>
    <span></span>
    <span></span>
  </button>

  <nav class:open={menuOpen} class="main-nav" aria-label="Main navigation">
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
          St. Ulrichs-Platz 6,<br />
          1070 Wien
        </address>
      </div>
    </div>
  </nav>
</header>

{@render children()}

<footer class="site-footer">
  <p>© 2006 Eva Eichinger</p>
  <p>Design by Zora Design</p>
</footer>

<style>
  :global(body) {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    background: #ffffff;
    color: #4d4a47;
  }

  .site-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    box-sizing: border-box;
    padding: 28px 210px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
  }

  .logo {
    color: #2f2d2b;
    text-decoration: none;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.65rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.055em;
    transition: opacity 0.25s ease;
    z-index: 102;
  }

  .logo::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    margin-top: 7px;
    background: currentColor;
    opacity: 0.55;
  }

  .logo:hover {
    opacity: 0.7;
  }

  .menu-toggle {
    position: relative;
    z-index: 102;
    display: flex;
    width: 34px;
    height: 26px;
    padding: 0;
    border: none;
    background: transparent;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
  }

  @media (min-width: 1025px) {
    .menu-toggle {
      transform: translateX(0px);
    }
  }

  .menu-toggle span {
    display: block;
    width: 100%;
    height: 1px;
    background: #2f2d2b;
    transition:
      transform 0.25s ease,
      opacity 0.25s ease;
  }

  .menu-toggle[aria-expanded="true"] span:nth-child(1) {
    transform: translateY(12.5px) rotate(45deg);
  }

  .menu-toggle[aria-expanded="true"] span:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle[aria-expanded="true"] span:nth-child(3) {
    transform: translateY(-12.5px) rotate(-45deg);
  }

  .main-nav {
    position: fixed;
    inset: 0;
    z-index: 101;
    width: 100%;
    height: 100dvh;
    padding: 104px 210px 38px;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 24px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.98);
    transform: translateX(100%);
    opacity: 0;
    transition:
      transform 0.45s cubic-bezier(0.77, 0, 0.175, 1),
      opacity 0.35s ease;
  }

  .main-nav.open {
    transform: translateX(0);
    opacity: 1;
  }

  .menu-grid {
    width: 100%;
    max-width: 1480px;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: clamp(34px, 4vw, 76px);
    align-self: start;
    overflow: hidden;
  }

  .menu-grid-item {
    min-height: 0;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .main-nav a {
    color: #6f6b68;
    text-decoration: none;
    font-family: Georgia, "Times New Roman", serif;
    transition:
      color 0.3s ease,
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .main-menu-link {
    display: inline-block;
    color: #2f2d2b;
    font-size: clamp(1.05rem, 1.18vw, 1.36rem);
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .main-menu-link::after {
    content: "";
    display: block;
    width: 0;
    height: 1px;
    margin-top: 13px;
    background: currentColor;
    transition: width 0.45s ease;
  }

  .menu-grid-item:hover .main-menu-link::after,
  .main-menu-link:focus::after {
    width: 100%;
  }

  .submenu-grid {
    max-height: calc(100dvh - 260px);
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 34px;
    overflow-y: auto;
    padding-right: 8px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .submenu-grid::-webkit-scrollbar {
    display: none;
  }

  .submenu-link {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #77716d;
    font-size: 0.72rem;
    font-weight: 300;
    line-height: 1.25;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    opacity: 0.72;
  }

  .submenu-link span {
    min-width: 0;
  }

  .submenu-link:hover,
  .submenu-link:focus {
    color: #2f2d2b;
    opacity: 1;
    transform: translateX(4px);
  }

  .submenu-thumb {
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    display: block;
    object-fit: cover;
    object-position: center;
    filter: grayscale(100%);
    opacity: 0.58;
    transition:
      filter 0.35s ease,
      opacity 0.35s ease,
      transform 0.35s ease;
  }

  .submenu-link:hover .submenu-thumb,
  .submenu-link:focus .submenu-thumb {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.04);
  }

  .mobile-menu-extra {
    max-width: 1480px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 34px;
    align-items: end;
    padding-top: 18px;
  }

  .mobile-social-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 0;
  }

  .mobile-social-icons a {
    color: #2f2d2b;
    font-size: 0.8rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.76;
  }

  .mobile-social-icons a:hover,
  .mobile-social-icons a:focus {
    opacity: 1;
  }

  .mobile-contact-info {
    display: flex;
    flex-direction: column;
    gap: 7px;
    color: #6f6b68;
    font-size: 0.8rem;
    font-weight: 300;
    line-height: 1.35;
    text-align: right;
  }

  .mobile-contact-info p {
    margin: 0;
    color: #2f2d2b;
    font-size: 0.84rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .mobile-contact-info a {
    color: #6f6b68;
    font-size: 0.8rem;
    line-height: 1.35;
  }

  .mobile-contact-info address {
    margin: 0;
    font-style: normal;
  }

  .site-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 210px;
    box-sizing: border-box;
    color: #8e8781;
    font-size: 14px;
    font-weight: 300;
    background: #ffffff;
    pointer-events: none;
  }

  .site-footer p {
    margin: 0;
  }

  @media (max-width: 1024px) {
    .site-header {
      padding: 22px 24px 18px;
    }

    .logo {
      font-size: 1.45rem;
    }

    .main-nav {
      height: 100dvh;
      padding: 120px 24px 40px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 34px;
      overflow-y: auto;
      background: #ffffff;
    }

    .menu-grid {
      display: flex;
      flex-direction: column;
      gap: 26px;
      overflow: visible;
    }

    .menu-grid-item {
      height: auto;
      min-height: auto;
      padding: 0;
      overflow: visible;
    }

    .main-menu-link {
      font-size: 1.25rem;
      letter-spacing: 0.055em;
    }

    .main-menu-link::after {
      display: none;
    }

    .submenu-grid {
      display: none;
    }

    .mobile-menu-extra {
      display: block;
      padding-top: 10px;
      border-top: 1px solid rgba(47, 45, 43, 0.18);
    }

    .mobile-social-icons {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      margin-bottom: 24px;
    }

    .mobile-social-icons a {
      color: #2f2d2b;
      font-size: 1rem;
      font-weight: 300;
      letter-spacing: normal;
      text-transform: uppercase;
      opacity: 1;
    }

    .mobile-contact-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
      color: #6f6b68;
      font-size: 1rem;
      font-weight: 300;
      line-height: 1.35;
      text-align: left;
    }

    .mobile-contact-info p {
      margin: 0;
      color: #2f2d2b;
      font-size: 1.1rem;
      font-weight: 400;
      letter-spacing: normal;
      text-transform: uppercase;
    }

    .mobile-contact-info a {
      color: #6f6b68;
      font-size: 1rem;
      line-height: 1.35;
    }

    .mobile-contact-info address {
      margin: 0;
      font-style: normal;
    }

    .site-footer {
      padding: 16px 24px;
      font-size: 13px;
      flex-direction: column;
      gap: 7px;
      align-items: flex-start;
    }
  }

  @media (max-width: 600px) {
    .main-nav {
      padding: 110px 24px 40px;
    }

    .menu-grid {
      gap: 28px;
    }

    .main-menu-link {
      font-size: 1.25rem;
    }
  }
</style>
