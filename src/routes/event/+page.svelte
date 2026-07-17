<script>
  let { data } = $props();

  const archiveSections = [
    {
      title: "Artist in Residence & Stipendien",
      items: [
        {
          year: "2025",
          text: "Ankauf durch dieKunstsammlung des Landes Oberösterreich",
        },
        {
          year: "2022",
          text: "Artist in Residence in Český Krumlov, Land Oberösterreich",
        },
        {
          year: "2021",
          text: "Atelierstipendium Westbahnstraße des BMKOES",
        },
        {
          year: "2020",
          text: "Artist in Residence in Český Krumlov, Land Oberösterreich",
        },
        {
          year: "2019",
          text: "Ankauf durch dieKunstsammlung des Landes Oberösterreich",
        },
        {
          year: "2019",
          text: "Arbeitsaufenthalt in Kopenhagen, Dänemark",
        },
        {
          year: "2014",
          text: "Aquarellhappening in Tux, Tirol",
        },
        {
          year: "2013",
          text: "Sommerakademie Traunkirchen – Klasse Leo Kandl",
        },
      ],
    },
    {
      title: "Einzelausstellungen / Solo Shows",
      items: [
        {
          year: "2020",
          text: "Als ich über Bäume sprang – Edition:, Linz",
        },
        {
          year: "2019",
          text: "Top Shelf / Bottom Drawer – Sonntagszimmer, Wien",
        },
        {
          year: "2016",
          text: "the importance of destruction in an environment of harmony – Paradigma, Linz",
        },
        {
          year: "2014",
          text: "rocket scientists remember how it feels to fly – Kunst im Bad, Linz",
        },
      ],
    },
    {
      title: "Gruppenausstellungen und Messebeteiligungen (Auswahl)",
      items: [
        {
          year: "2026",
          text: "Neue Zugänge – dieKunstsammlung, Linz",
        },
        {
          year: "2026",
          text: "RELATIONS – Galerie Dia:log, Kufstein",
        },
        {
          year: "2026",
          text: "Soft Tensions – Kunsttankstelle Ottakring & MASC Foundations, Wien",
        },
        {
          year: "2026",
          text: "Das Jahr der Pferde – splace, Linz",
        },
        {
          year: "2025",
          text: "Parallel Art Fair (repr. by KaH) – Otto Wagner Areal, Wien",
        },
        {
          year: "2025",
          text: "Where The Wild Things Are – AK Linz",
        },
        {
          year: "2023",
          text: "Parallel Art Fair Project Statement – Otto Wagner Areal, Wien",
        },
        {
          year: "2023",
          text: "Apollo packte das schlechte Gewissen – Apollo Garage (KÖR), Wien",
        },
        {
          year: "2023",
          text: "be water my friend – KünstlerInnenvereinigung MAERZ, Linz",
        },
        {
          year: "2022",
          text: "constantly producing the past – Plateau, Wien",
        },
        {
          year: "2022",
          text: "aufwärts fallen – OÖ Kunstverein, Linz",
        },
        {
          year: "2021",
          text: "Art Austria Highlights – Wiener Eislaufverein, Wien",
        },
        {
          year: "2021",
          text: "4 Mal Solo 1 Mal im Duo – Galerie Jonathan Seiffert, Wien",
        },
        {
          year: "2021",
          text: "Wo ist das schöne Leben hin? – RCS Karlsplatz, Wien",
        },
        {
          year: "2020",
          text: "In the Deep Lightness – Kluckyland, Wien",
        },
        {
          year: "2020",
          text: "Parallel Art Fair (repr. by KaH) – Rudolf Sallinger Platz 1, Wien",
        },
        {
          year: "2020",
          text: "Kultur braucht Kunst – Schlossmuseum Linz, Linz",
        },
        {
          year: "2019",
          text: "FROZEN FINGERS – Kunsthalle Linz, Linz",
        },
        {
          year: "2019",
          text: "dissolution as solution Part II – Die Schöne, Wien",
        },
        {
          year: "2019",
          text: "dissolution as solution – Galeri Riga, Kopenhagen, Dänemark",
        },
        {
          year: "2019",
          text: "Parallel Art Fair (represented by KaH) – Lassallestraße 5, Wien",
        },
        {
          year: "2018",
          text: "Viel Spaß noch – Raumschiff, Linz",
        },
        {
          year: "2018",
          text: "schade, aber schön – kaeshmaesh, Wien",
        },
        {
          year: "2018",
          text: "Open Call Exhibition – Delphian Gallery, London, UK",
        },
      ],
    },
  ];

  function parseDate(dateString) {
    if (!dateString) return null;

    const value = String(dateString).trim();

    const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00`
      : value;

    const date = new Date(normalizedDate);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  function formatDate(dateString) {
    const date = parseDate(dateString);

    if (!date) {
      return dateString || "";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function getEventYear(dateString) {
    const date = parseDate(dateString);

    if (!date) return "";

    return date.getFullYear();
  }

  function getEventDateLabel(event) {
    if (!event?.date) return "Event";

    return getEventYear(event.date) || formatDate(event.date);
  }

  function getEventLocation(event) {
    return [event.location, event.address].filter(Boolean).join(", ");
  }
</script>

<svelte:head>
  <title>Events | Eva Eichinger</title>
  <meta
    name="description"
    content="Upcoming events, exhibitions, residencies and selected presentations by Eva Eichinger."
  />
</svelte:head>

<section class="event-page">
  <div class="event-inner">
    <header class="event-header">
      <p class="event-label">Exhibitions and Updates</p>
      <h1>Upcoming</h1>

      <p class="event-intro">
        Selected events, art fairs and public presentations.
      </p>
    </header>

    <section class="upcoming-section" aria-labelledby="upcoming-events-title">
      <h2 id="upcoming-events-title" class="section-title">Upcoming Events</h2>

      {#if data.events?.length > 0}
        <div class="event-list">
          {#each data.events as event}
            <article class="event-item">
              <div class="event-line">
                <span class="list-marker" aria-hidden="true">///</span>

                <div class="event-content">
                  <div class="event-title-line">
                    <span class="event-date">
                      {getEventDateLabel(event)}:
                    </span>

                    {#if event.website}
                      <a
                        class="event-title"
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {event.title}
                      </a>
                    {:else}
                      <h3 class="event-title">{event.title}</h3>
                    {/if}
                  </div>

                  {#if getEventLocation(event)}
                    <p class="event-location">
                      {getEventLocation(event)}
                    </p>
                  {/if}

                  {#if event.startTime || event.endTime}
                    <p class="event-time">
                      {#if event.startTime}
                        {event.startTime}
                      {/if}

                      {#if event.startTime && event.endTime}
                        –
                      {/if}

                      {#if event.endTime}
                        {event.endTime}
                      {/if}
                    </p>
                  {/if}

                  {#if event.content}
                    <div class="event-description">
                      {@html event.content}
                    </div>
                  {/if}

                  {#if event.website}
                    <a
                      class="event-link"
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit event website ↗
                    </a>
                  {/if}
                </div>
              </div>
            </article>
          {/each}
        </div>
      {:else}
        <p class="empty-message">No upcoming events at the moment.</p>
      {/if}
    </section>

    <div class="archive-sections">
      {#each archiveSections as section}
        <section class="archive-section">
          <h2 class="section-title">{section.title}</h2>

          <div class="archive-list">
            {#each section.items as item}
              <div class="archive-item">
                <span class="list-marker" aria-hidden="true">///</span>

                <p class="archive-text">
                  <strong>{item.year}:</strong>
                  {item.text}
                </p>
              </div>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  </div>
</section>

<style>
  :global(:root) {
    --site-font-family: Arial, Helvetica, sans-serif;
  }

  :global(html),
  :global(body),
  .event-page {
    font-family: var(--site-font-family);
  }

  :global(body) {
    margin: 0;
    overflow-x: hidden;
    background: #ffffff;
    color: #000000;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .event-page {
    width: 100%;
    min-height: 100vh;
    padding: 116px 72px 90px 28px;
    background: #ffffff;
    color: #000000;
  }

  .event-inner {
    width: 100%;
    max-width: 1500px;
  }

  .event-header {
    width: 100%;
    max-width: 760px;
    margin-bottom: 52px;
    text-transform: uppercase;
  }

  .event-label {
    margin: 0 0 8px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
  }

  .event-header h1 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
    animation: eventTitleIn 0.46s ease both;
  }

  .event-intro {
    max-width: 470px;
    margin: 14px 0 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: 0.006em;
    text-transform: none;
  }

  .upcoming-section,
  .archive-section {
    width: 100%;
    max-width: 1200px;
  }

  .upcoming-section {
    margin-bottom: 64px;
  }

  .archive-sections {
    width: 100%;
  }

  .archive-section {
    margin-bottom: 58px;
  }

  .archive-section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    max-width: 850px;
    margin: 0 0 28px;
    color: #000000;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.018em;
    text-transform: uppercase;
  }

  .event-list,
  .archive-list {
    width: 100%;
    animation: eventReveal 0.7s ease both;
  }

  .event-item {
    width: 100%;
    margin: 0;
    padding: 0 0 30px;
  }

  .event-item:last-child {
    padding-bottom: 0;
  }

  .event-line,
  .archive-item {
    width: 100%;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 12px;
    align-items: start;
  }

  .list-marker {
    display: inline-block;
    padding-top: 1px;
    color: #000000;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.04em;
  }

  .event-content {
    min-width: 0;
  }

  .event-title-line {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0 0.35em;
  }

  .event-date,
  .event-title {
    color: #000000;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.018em;
  }

  .event-date {
    flex: 0 0 auto;
  }

  .event-title {
    display: inline;
    margin: 0;
    text-decoration: none;
    text-transform: none;
    transition: opacity 0.25s ease;
  }

  a.event-title:hover,
  a.event-title:focus {
    opacity: 0.5;
  }

  .event-location {
    margin: 8px 0 0;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.35;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    opacity: 0.65;
  }

  .event-time {
    margin: 4px 0 0;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.48;
  }

  .event-description {
    max-width: 760px;
    margin-top: 14px;
    color: #000000;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.003em;
    text-transform: none;
  }

  .event-description :global(p) {
    margin: 0 0 10px;
  }

  .event-description :global(p:last-child) {
    margin-bottom: 0;
  }

  .event-description :global(ul),
  .event-description :global(ol) {
    margin: 10px 0;
    padding-left: 20px;
  }

  .event-description :global(a) {
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .event-link {
    display: inline-block;
    width: fit-content;
    margin-top: 14px;
    color: #000000;
    font-size: 11px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.012em;
    text-decoration: none;
    text-transform: uppercase;
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }

  .event-link:hover,
  .event-link:focus {
    opacity: 0.5;
    transform: translateX(4px);
  }

  .archive-item {
    margin-bottom: 18px;
  }

  .archive-item:last-child {
    margin-bottom: 0;
  }

  .archive-text {
    max-width: 1050px;
    margin: 0;
    color: #000000;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -0.008em;
    text-transform: none;
  }

  .archive-text strong {
    font-weight: 700;
  }

  .empty-message {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
    text-transform: uppercase;
  }

  @keyframes eventReveal {
    from {
      opacity: 0;
      transform: translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes eventTitleIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 1680px) {
    .event-page {
      padding-right: 76px;
    }

    .event-inner {
      max-width: 1650px;
    }

    .upcoming-section,
    .archive-section {
      max-width: 1280px;
    }
  }

  @media (max-width: 1024px) {
    .event-page {
      min-height: 100vh;
      min-height: 100dvh;
      padding: 118px 24px 82px;
    }

    .event-header {
      margin-bottom: 44px;
    }

    .event-header h1 {
      font-size: 18px;
    }

    .event-intro {
      margin-top: 12px;
      font-size: 12px;
    }

    .upcoming-section {
      margin-bottom: 52px;
    }

    .archive-section {
      margin-bottom: 48px;
    }

    .section-title {
      margin-bottom: 24px;
      font-size: 17px;
    }

    .event-item {
      padding-bottom: 26px;
    }

    .event-line,
    .archive-item {
      gap: 10px;
    }

    .event-date,
    .event-title {
      font-size: 17px;
    }

    .event-location {
      font-size: 11px;
    }

    .event-time {
      font-size: 10px;
    }

    .event-description {
      max-width: 680px;
      font-size: 13px;
      line-height: 1.46;
    }

    .archive-item {
      margin-bottom: 16px;
    }

    .archive-text {
      font-size: 14px;
      line-height: 1.32;
    }
  }

  @media (max-width: 700px) {
    .event-page {
      min-height: 100vh;
      min-height: 100dvh;
      padding: 108px 16px 72px;
    }

    .event-header {
      margin-bottom: 38px;
    }

    .event-label {
      margin-bottom: 7px;
      font-size: 11px;
    }

    .event-header h1 {
      font-size: 18px;
    }

    .event-intro {
      max-width: 330px;
      margin-top: 10px;
      font-size: 12px;
      line-height: 1.35;
    }

    .upcoming-section {
      margin-bottom: 46px;
    }

    .archive-section {
      margin-bottom: 42px;
    }

    .section-title {
      margin-bottom: 21px;
      font-size: 16px;
      line-height: 1.1;
    }

    .event-item {
      padding-bottom: 24px;
    }

    .event-line,
    .archive-item {
      grid-template-columns: auto minmax(0, 1fr);
      gap: 8px;
    }

    .list-marker {
      padding-top: 1px;
      font-size: 12px;
    }

    .event-title-line {
      display: block;
    }

    .event-date,
    .event-title {
      font-size: 15px;
      line-height: 1.22;
      letter-spacing: -0.014em;
    }

    .event-date {
      display: inline;
      margin-right: 0.22em;
    }

    .event-title {
      display: inline;
    }

    .event-location {
      margin-top: 7px;
      font-size: 10px;
      line-height: 1.3;
    }

    .event-time {
      margin-top: 4px;
      font-size: 10px;
    }

    .event-description {
      margin-top: 12px;
      font-size: 12px;
      line-height: 1.43;
    }

    .event-link {
      margin-top: 12px;
      font-size: 10px;
    }

    .archive-item {
      margin-bottom: 15px;
    }

    .archive-text {
      font-size: 14px;
      line-height: 1.32;
      letter-spacing: -0.006em;
    }
  }

  @media (max-width: 420px) {
    .event-line,
    .archive-item {
      gap: 7px;
    }

    .section-title {
      font-size: 15px;
    }

    .event-date,
    .event-title {
      font-size: 14px;
    }

    .archive-text {
      font-size: 14px;
    }
  }
</style>
