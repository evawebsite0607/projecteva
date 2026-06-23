<script>
  let { data } = $props();

  let email = $state("");
  let newsletterMessage = $state("");

  const contact = data.contact;

  function handleNewsletterSubmit(event) {
    event.preventDefault();

    newsletterMessage =
      "Thank you. Newsletter registration will be connected soon.";

    email = "";
  }
</script>

<svelte:head>
  <title>kontakt | Eva Eichinger</title>
  <meta
    name="description"
    content="Contact Eva Eichinger by email, Instagram, website or address in Vienna."
  />
</svelte:head>

<main class="contact-page">
  <section class="contact-section" aria-labelledby="contact-title">
    <div class="contact-intro">
      <span class="page-number">STAY IN TOUCH</span>

      <p class="eyebrow">{contact.eyebrow}</p>

      <h1 id="contact-title">
        Studio,<br />
        inquiries<br />
        and news.
      </h1>
    </div>

    <div class="contact-panel">
      <div class="panel-top">
        <p class="panel-label">__</p>
        <h2>{contact.name}</h2>
      </div>

      <div class="contact-lines">
        <a href={`mailto:${contact.email}`} class="contact-line">
          <span>E</span>
          <strong>{contact.email}</strong>
        </a>

        <a
          href={contact.mapUrl}
          target="_blank"
          rel="noreferrer"
          class="contact-line"
        >
          <span>A</span>
          <strong>{contact.address}</strong>
        </a>

        <a
          href={contact.instagramUrl}
          target="_blank"
          rel="noreferrer"
          class="contact-line"
        >
          <span>I</span>
          <strong>{contact.instagram}</strong>
        </a>

        <a
          href={contact.websiteUrl}
          target="_blank"
          rel="noreferrer"
          class="contact-line"
        >
          <span>W</span>
          <strong>{contact.website}</strong>
        </a>
      </div>

      <form class="newsletter-form" onsubmit={handleNewsletterSubmit}>
        <div class="newsletter-heading">
          <span>Newsletter</span>

          <p>
            Receive occasional updates about exhibitions, performances and
            studio news.
          </p>
        </div>

        <div class="newsletter-input-row">
          <input
            type="email"
            bind:value={email}
            placeholder="Email address"
            aria-label="Email address"
            required
          />

          <button type="submit">Join</button>
        </div>

        {#if newsletterMessage}
          <p class="newsletter-message">{newsletterMessage}</p>
        {/if}
      </form>
    </div>
  </section>
</main>

<style>
  .contact-page {
    min-height: 100dvh;
    background: #ffffff;
    color: #2f2d2b;
    font-family: Arial, Helvetica, sans-serif;
  }

  .contact-section {
    min-height: 100dvh;
    display: grid;
    grid-template-columns: minmax(260px, 0.8fr) minmax(420px, 1.2fr);
    gap: clamp(40px, 6vw, 96px);
    align-items: center;
    padding: 120px 8vw 90px;
    box-sizing: border-box;
    background: #ffffff;
  }

  .contact-intro {
    min-height: 420px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background: #ffffff;
  }

  .page-number {
    margin-bottom: auto;
    color: rgba(47, 45, 43, 0.36);
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.14em;
  }

  .eyebrow {
    margin: 0 0 20px;
    color: rgba(47, 45, 43, 0.58);
    font-size: 13px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h1,
  h2,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 0;
    max-width: 420px;
    color: #2f2d2b;
    font-size: clamp(38px, 4.2vw, 64px);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.06em;
  }

  .contact-panel {
    max-width: 720px;
    padding: 0;
    background: #ffffff;
    border: 0;
    box-shadow: none;
  }

  .panel-top {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    margin-bottom: 48px;
    background: #ffffff;
  }

  .panel-label {
    margin: 0;
    color: rgba(47, 45, 43, 0.52);
    font-size: 13px;
    line-height: 1;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    color: #2f2d2b;
    font-size: clamp(24px, 2vw, 34px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.045em;
    text-align: right;
  }

  .contact-lines {
    display: flex;
    flex-direction: column;
    background: #ffffff;
  }

  .contact-line {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 22px;
    align-items: center;
    min-height: 66px;
    color: #2f2d2b;
    text-decoration: none;
    background: #ffffff;
    transition:
      opacity 0.25s ease,
      padding-left 0.25s ease;
  }

  .contact-line span {
    color: rgba(47, 45, 43, 0.48);
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .contact-line strong {
    font-size: clamp(17px, 1.25vw, 21px);
    font-weight: 400;
    line-height: 1.16;
    letter-spacing: -0.035em;
  }

  .newsletter-form {
    margin-top: 58px;
    background: #ffffff;
  }

  .newsletter-heading {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 28px;
    margin-bottom: 24px;
    background: #ffffff;
  }

  .newsletter-heading span {
    color: #2f2d2b;
    font-size: 13px;
    line-height: 1;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .newsletter-heading p {
    margin-bottom: 0;
    max-width: 380px;
    color: rgba(47, 45, 43, 0.58);
    font-size: 14px;
    line-height: 1.45;
    letter-spacing: -0.01em;
  }

  .newsletter-input-row {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid #2f2d2b;
    background: #ffffff;
  }

  .newsletter-input-row input {
    width: 100%;
    padding: 16px 0;
    border: 0;
    background: #ffffff;
    color: #2f2d2b;
    font: inherit;
    font-size: 16px;
    outline: none;
  }

  .newsletter-input-row input::placeholder {
    color: rgba(47, 45, 43, 0.46);
  }

  .newsletter-input-row button {
    padding: 16px 0 16px 28px;
    border: 0;
    background: #ffffff;
    color: #2f2d2b;
    font: inherit;
    font-size: 16px;
    letter-spacing: -0.02em;
    cursor: pointer;
  }

  .newsletter-input-row button:hover {
    opacity: 0.6;
  }

  .newsletter-message {
    margin: 14px 0 0;
    color: rgba(47, 45, 43, 0.58);
    font-size: 13px;
    line-height: 1.45;
    background: #ffffff;
  }

  @media (max-width: 1024px) {
    .contact-section {
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      gap: 42px;
      padding: 120px 24px 72px;
      background: #ffffff;
    }

    .contact-intro {
      min-height: auto;
      background: #ffffff;
    }

    .page-number {
      margin-bottom: 30px;
      display: block;
    }

    .eyebrow {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 0.78rem;
      letter-spacing: 0.13em;
    }

    h1 {
      max-width: 460px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(2.45rem, 9vw, 4.2rem);
      line-height: 1;
      letter-spacing: -0.035em;
    }

    .contact-panel {
      max-width: none;
      background: #ffffff;
    }

    .panel-top {
      flex-direction: column;
      gap: 14px;
      margin-bottom: 34px;
      background: #ffffff;
    }

    .panel-label {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 0.78rem;
      letter-spacing: 0.13em;
    }

    h2 {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.35rem;
      letter-spacing: 0.04em;
      text-align: left;
      text-transform: uppercase;
    }

    .contact-line {
      grid-template-columns: 34px 1fr;
      gap: 16px;
      min-height: 62px;
      background: #ffffff;
    }

    .contact-line:hover {
      padding-left: 0;
    }

    .contact-line strong {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1rem;
      line-height: 1.25;
      letter-spacing: 0.02em;
    }

    .newsletter-form {
      margin-top: 46px;
      background: #ffffff;
    }

    .newsletter-heading {
      grid-template-columns: 1fr;
      gap: 12px;
      background: #ffffff;
    }

    .newsletter-heading span {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 0.78rem;
      letter-spacing: 0.13em;
    }

    .newsletter-heading p {
      max-width: none;
    }
  }

  @media (max-width: 600px) {
    .contact-section {
      padding: 112px 20px 56px;
      gap: 34px;
      background: #ffffff;
    }

    h1 {
      max-width: 340px;
      font-size: clamp(2.1rem, 11vw, 3.2rem);
    }

    .contact-line {
      grid-template-columns: 28px 1fr;
      gap: 12px;
      min-height: 58px;
      background: #ffffff;
    }

    .contact-line strong {
      font-size: 0.95rem;
    }

    .newsletter-input-row {
      grid-template-columns: 1fr;
      gap: 10px;
      border-bottom: 0;
      background: #ffffff;
    }

    .newsletter-input-row input {
      border-bottom: 1px solid #2f2d2b;
      background: #ffffff;
    }

    .newsletter-input-row button {
      width: fit-content;
      padding: 8px 0;
      background: #ffffff;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 4px;
    }
  }
</style>
