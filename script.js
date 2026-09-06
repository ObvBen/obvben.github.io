/* =========================
   SHOW CARDS
   ========================= */

function createCard(show) {

  const card = document.createElement("article");

  card.className = "show-card";

  card.dataset.type = show.type;
  card.dataset.nature = show.nature;


  /* =========================
     CAST
     ========================= */

  let castHTML = "";

  if (show.cast.length === 0) {

    castHTML = '<div class="missing">Missing info</div>';

  } else {

    castHTML = show.cast.map(member => {

      if (member.character) {

        return `
          <div class="cast-member">
            <span class="actor">${member.actor}</span>
            <span class="character">(${member.character})</span>
          </div>
        `;

      }

      return `
        <div class="cast-member">
          <span class="actor">${member.actor}</span>
        </div>
      `;

    }).join("");

  }


  /* =========================
     CARD HTML
     ========================= */

  card.innerHTML = `

    <header class="show-header">

      <h1 class="show-title">
        ${show.show}
      </h1>

      <div class="show-types">

        <span class="show-type ${show.type.toLowerCase()}">
          ${show.type}
        </span>

        <span class="document-type ${show.nature.toLowerCase()}">
          ${show.nature}
        </span>

      </div>

    </header>


    <div class="show-content">

      <div class="show-content-inner">


        <!-- DATE / SOURCE / FILE -->

        <div class="show-info">

          <div>
            <div class="info-label">
              Date
            </div>

            <div class="info-value">
              ${show.date}
            </div>
          </div>


          <div>
            <div class="info-label">
              Source
            </div>

            <div class="info-value">
              ${show.source}
            </div>
          </div>


          <div>
            <div class="info-label">
              File
            </div>

            <div class="info-value">
              ${show.file}
            </div>
          </div>

        </div>


        <!-- CAST -->

        <section class="show-section">

          <div class="section-title">
            Cast
          </div>

          <div class="cast">

            ${castHTML}

          </div>

        </section>


        <!-- NOTES -->

        <section class="show-section">

          <div class="section-title">
            Notes
          </div>

          <div class="info-value">
            ${show.notes}
          </div>

        </section>


        <!-- SUBTITLES -->

        <section class="show-section">

          <div class="section-title">
            Subtitles
          </div>

          <div class="info-value">
            ${show.subtitles}
          </div>

        </section>


        <!-- STATUS -->

        <section class="show-section">

          <div class="section-title">
            Gifting Status
          </div>

          <div class="info-value">
            ${show.status}
          </div>

        </section>


      </div>

    </div>

  `;


  /* =========================
     OPEN / CLOSE
     ========================= */

  const header = card.querySelector(".show-header");

  header.addEventListener("click", () => {

    card.classList.toggle("open");

  });


  return card;
}


/* =========================
   LOAD SHOWS
   ========================= */

async function loadShows() {

  const response = await fetch("shows.json");

  const shows = await response.json();

  const container =
    document.getElementById("shows-container");


  shows.forEach(show => {

    const card = createCard(show);

    container.appendChild(card);

  });


  applyFilters();

}


/* =========================
   FILTERS
   ========================= */

let selectedType = "Musical";
let selectedNature = "Video";


function applyFilters() {

  const cards =
    document.querySelectorAll(".show-card");


  cards.forEach(card => {

    const type = card.dataset.type;
    const nature = card.dataset.nature;


    const matchesType =
      type === selectedType;

    const matchesNature =
      nature === selectedNature;


    card.style.display =
      matchesType && matchesNature
        ? ""
        : "none";

  });

}


/* =========================
   FILTER BUTTONS
   ========================= */

document
  .querySelectorAll(".filter-button")
  .forEach(button => {

    button.addEventListener("click", () => {

      const filter =
        button.dataset.filter;

      const value =
        button.dataset.value;


      if (filter === "type") {

        selectedType = value;

        document
          .querySelectorAll('[data-filter="type"]')
          .forEach(button => {

            button.classList.remove("active");

          });

      }


      if (filter === "nature") {

        selectedNature = value;

        document
          .querySelectorAll('[data-filter="nature"]')
          .forEach(button => {

            button.classList.remove("active");

          });

      }


      button.classList.add("active");

      applyFilters();

    });

  });


/* =========================
   START
   ========================= */

loadShows();

