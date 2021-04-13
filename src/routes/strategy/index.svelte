<script>
  import { storeUser, storeAppTheme } from "../../../store.js";

  let appThemeIsDark = false;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  let user = {};
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  //TODO: MOCK
  var strats = [
    {
      name: "Infinity Long",
      timeframe: "1D",
      monthlyPercGain: "3.22%",
      winrate: "29.7%",
    },
    {
      name: "100X Everything",
      timeframe: "2min",
      monthlyPercGain: "17.22%",
      winrate: "24.9%",
    },
    {
      name: "Simon's Strategy",
      timeframe: "69min",
      monthlyPercGain: "4.20%",
      winrate: "77.1%",
    },
    {
      name: "Dollar Store Strat",
      timeframe: "1H",
      monthlyPercGain: "20.05%",
      winrate: "40.37%",
    },
    {
      name: "Algo W5-78R",
      timeframe: "4H",
      monthlyPercGain: "21.66%",
      winrate: "13.8%%",
    },
    {
      name: "F-72 Stack Shorter",
      timeframe: "15min",
      monthlyPercGain: "6.31%",
      winrate: "78.1%",
    },
  ];
</script>

<div id="stratIndex" class:dark={appThemeIsDark}>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4" />
      <div class="col-4">
        <!-- top strats carousel -->
        <div
          id="topStratsCarouselIndic"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <div class="carousel-indicators">
            <button
              data-bs-target="#topStratsCarouselIndic"
              data-bs-slide-to="0"
              aria-current="true"
              aria-label="Slide 1"><i class="bi bi-circle" /></button
            >
            <button
              data-bs-target="#topStratsCarouselIndic"
              data-bs-slide-to="1"
              aria-label="Slide 2"><i class="bi bi-diamond" /></button
            >
            <button
              data-bs-target="#topStratsCarouselIndic"
              data-bs-slide-to="2"
              aria-label="Slide 3"><i class="bi bi-hexagon" /></button
            >
          </div>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <h1>#1: {strats[0].name}</h1>
              <p>Timeframe: {strats[0].timeframe}</p>
              <p>Monthly % Gain: {strats[0].monthlyPercGain}</p>
              <p>Winrate: {strats[0].winrate}</p>
            </div>
            <div class="carousel-item">
              <h1>#2: {strats[1].name}</h1>
              <p>Timeframe: {strats[1].timeframe}</p>
              <p>Monthly % Gain: {strats[1].monthlyPercGain}</p>
              <p>Winrate: {strats[1].winrate}</p>
            </div>
            <div class="carousel-item">
              <h1>#3: {strats[2].name}</h1>
              <p>Timeframe: {strats[2].timeframe}</p>
              <p>Monthly % Gain: {strats[2].monthlyPercGain}</p>
              <p>Winrate: {strats[2].winrate}</p>
            </div>
          </div>
          <!-- <button
            class="carousel-control-prev carouselBtn"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true" />
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next carouselBtn"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true" />
            <span class="visually-hidden">Next</span>
          </button> -->
        </div>
      </div>
      <div class="col-4" />
    </div>

    <div class="row charts">
      <div class="col-1" />
      <div class="col-10">
        <!-- charts -->
        <table class="table">
          <thead>
            <tr class:dark={appThemeIsDark}>
              <th scope="col">Name</th>
              <th scope="col">Timeframe</th>
              <th scope="col">Monthly % Gain</th>
              <th scope="col">Winrate</th>
            </tr>
          </thead>
          <tbody>
            {#each strats as t}
              <tr class:dark={appThemeIsDark}>
                <td>{t.name}</td>
                <td>{t.timeframe}</td>
                <td>{t.monthlyPercGain}</td>
                <td>{t.winrate}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="col-1" />
    </div>
  </div>
</div>

<style type="text/scss">
  @import "../../../static/styles/_all";

  #stratIndex {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 1rem;
  }

  #stratIndex.dark {
    background-color: black;
    color: $cream;
  }

  .row {
    text-align: center;
  }

  .carousel-indicators {
    margin-top: 1.5rem;
    margin-bottom: 1rem;

    button {
      all: initial;
      all: unset;
      margin: auto 0.35rem;

      color: $ivory;
    }

    button:hover,
    button:focus {
      color: $cream;
    }
  }

  .carousel-item {
    padding: 2rem;
    border: $cream 3px dashed;
    border-radius: 5px;
    background-color: black;
  }

  .row.charts {
    margin-top: 1.5rem;
  }

  table {
    margin-top: 2rem;
    text-align: left;
    font-family: $body-font;
  }

  thead {
    font-style: italic;
  }

  tr {
    color: black;
  }

  tr.dark {
    color: $ivory;
  }

  tr:hover {
    background-color: $blue;
    color: $ivory;
  }

  tr.dark:hover {
    background-color: $blood;
    color: $cream;
  }
</style>
