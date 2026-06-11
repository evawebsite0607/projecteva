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
    background: transparent;
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
  }
</style>
