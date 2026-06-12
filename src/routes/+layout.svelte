<script>
  let { children } = $props();

  const menuItems = [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Exhibitions",
      href: "/exhibitions",
    },
    {
      label: "Performance",
      href: "/performance",
    },
    {
      label: "Events",
      href: "/events",
    },
  ];
</script>

<header class="site-header">
  <a href="/" class="logo">Eva Eichinger</a>

  <nav class="main-nav">
    {#each menuItems as item}
      <a href={item.href}>{item.label}</a>
    {/each}
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
    background: #111;
    color: #fff;
  }

  .site-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    box-sizing: border-box;
    padding: 24px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(247, 246, 244, 0.92);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .logo {
    color: #4d4a47;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 6px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.7rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    transition: opacity 0.3s ease;
  }

  .logo:hover {
    opacity: 0.75;
  }

  .main-nav {
    display: flex;
    align-items: center;
    gap: 40px;
  }

  .main-nav a {
    color: #6f6b68;
    text-decoration: none;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.15rem;
    font-weight: 300;
    letter-spacing: 0.03em;
    transition:
      color 0.3s ease,
      opacity 0.3s ease;
  }

  .main-nav a:hover {
    color: #4d4a47;
    opacity: 1;
  }

  .site-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 58px;
    box-sizing: border-box;
    color: #6f6b68;
    font-size: 16px;
    font-weight: 300;

    background: rgba(247, 246, 244, 0.92);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    pointer-events: none;
  }

  .site-footer p {
    margin: 0;
  }

  @media (max-width: 700px) {
    .site-header {
      padding: 20px 24px;
      flex-direction: column;
      gap: 20px;
      align-items: flex-start;
    }

    .logo {
      font-size: 1.5rem;
    }

    .main-nav {
      flex-wrap: wrap;
      gap: 20px;
    }

    .main-nav a {
      font-size: 1rem;
    }

    .site-footer {
      left: 24px;
      right: 24px;
      bottom: 24px;
      font-size: 14px;
      flex-direction: column;
      gap: 8px;
    }
  }
</style>
