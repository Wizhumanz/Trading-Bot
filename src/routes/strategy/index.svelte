<script>
  import { goto } from "@sapper/app";
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
      id: "167267376177937",
      name: "Infinity Long",
      description:
        "Widows and orphans are terrible fucking tragedies, both in real life and definitely in typography. Be fucking bold. Greatness isn’t the height of your stature, it’s the heft of your spirit. Whatever can be captured in words can be conquered with understanding. Dedicate yourself to lifelong fucking learning. Practice won’t get you anywhere if you mindlessly fucking practice the same thing. Change only occurs when you work deliberately with purpose toward a goal. Intuition is fucking important. To go partway is easy, but mastering anything requires hard fucking work. Someday is not a fucking day of the week. The details are not the details. They make the fucking design. The graphic designer’s first fucking consideration is always the size and shape of the format, whether for the printed page or for digital display. Celebrate your fucking failures. Then you’ll prove to yourself that you can survive anything. Don’t fucking quit.",
      timeframe: "1D",
      monthlyPercGain: "3.22",
      winrate: "29.7%",
    },
    {
      id: "167267376378199",
      name: "100X Everything",
      description:
        "You won’t get good at anything by doing it a lot fucking aimlessly. Don’t fucking lie to yourself. Defy fucking convention. If you don’t test your will against the dissent of the world, it can never grow stronger. Never, never assume that what you have achieved is fucking good enough. Widows and orphans are terrible fucking tragedies, both in real life and definitely in typography. Design as if your fucking life depended on it. The details are not the details. They make the fucking design. Make your work consistent but not fucking predictable. There is no right fucking answer. The splendor of the mystery is that you don’t understand. Nothing of value comes to you without fucking working at it. Learn from fucking criticism. Don’t fucking censor yourself. Sterility leads to susceptibility. Paul Rand once said, “The public is more familiar with bad fucking design than good design. It is,",
      timeframe: "2min",
      monthlyPercGain: "17.22",
      winrate: "24.9%",
    },
    {
      id: "167267376177111",
      name: "Simon's Buns",
      description:
        "You won’t get good at anything by doing it a lot fucking aimlessly. Don’t fucking lie to yourself. Defy fucking convention. If you don’t test your will against the dissent of the world, it can never grow stronger. Never, never assume that what you have achieved is fucking good enough. Widows and orphans are terrible fucking tragedies, both in real life and definitely in typography. Design as if your fucking life depended on it. The details are not the details. They make the fucking design. Make your work consistent but not fucking predictable. There is no right fucking answer. The splendor of the mystery is that you don’t understand. Nothing of value comes to you without fucking working at it. Learn from fucking criticism. Don’t fucking censor yourself. Sterility leads to susceptibility. Paul Rand once said, “The public is more familiar with bad fucking design than good design. It is,",
      timeframe: "69min",
      monthlyPercGain: "4.20",
      winrate: "77.1%",
    },
    {
      id: "167267376177008",
      name: "Dollar Store Strat",
      description:
        "You won’t get good at anything by doing it a lot fucking aimlessly. Don’t fucking lie to yourself. Defy fucking convention. If you don’t test your will against the dissent of the world, it can never grow stronger. Never, never assume that what you have achieved is fucking good enough. Widows and orphans are terrible fucking tragedies, both in real life and definitely in typography. Design as if your fucking life depended on it. The details are not the details. They make the fucking design. Make your work consistent but not fucking predictable. There is no right fucking answer. The splendor of the mystery is that you don’t understand. Nothing of value comes to you without fucking working at it. Learn from fucking criticism. Don’t fucking censor yourself. Sterility leads to susceptibility. Paul Rand once said, “The public is more familiar with bad fucking design than good design. It is,",
      timeframe: "1H",
      monthlyPercGain: "20.05",
      winrate: "40.37%",
    },
    {
      id: "167267113177937",
      name: "Algo W5-78R",
      description:
        "You won’t get good at anything by doing it a lot fucking aimlessly. Don’t fucking lie to yourself. Defy fucking convention. If you don’t test your will against the dissent of the world, it can never grow stronger. Never, never assume that what you have achieved is fucking good enough. Widows and orphans are terrible fucking tragedies, both in real life and definitely in typography. Design as if your fucking life depended on it. The details are not the details. They make the fucking design. Make your work consistent but not fucking predictable. There is no right fucking answer. The splendor of the mystery is that you don’t understand. Nothing of value comes to you without fucking working at it. Learn from fucking criticism. Don’t fucking censor yourself. Sterility leads to susceptibility. Paul Rand once said, “The public is more familiar with bad fucking design than good design. It is,",
      timeframe: "4H",
      monthlyPercGain: "21.66",
      winrate: "13.8%%",
    },
    {
      id: "167267376177006",
      name: "F-72 Stack Shorter",
      description:
        "You won’t get good at anything by doing it a lot fucking aimlessly. Don’t fucking lie to yourself. Defy fucking convention. If you don’t test your will against the dissent of the world, it can never grow stronger. Never, never assume that what you have achieved is fucking good enough. Widows and orphans are terrible fucking tragedies, both in real life and definitely in typography. Design as if your fucking life depended on it. The details are not the details. They make the fucking design. Make your work consistent but not fucking predictable. There is no right fucking answer. The splendor of the mystery is that you don’t understand. Nothing of value comes to you without fucking working at it. Learn from fucking criticism. Don’t fucking censor yourself. Sterility leads to susceptibility. Paul Rand once said, “The public is more familiar with bad fucking design than good design. It is,",
      timeframe: "15min",
      monthlyPercGain: "6.31",
      winrate: "78.1%",
    },
  ];
  user.strats = strats;
  storeUser.set(JSON.stringify(user));
</script>

<div id="stratIndex" class:dark={appThemeIsDark}>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2" />
      <div class="col-3">
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
            {#each strats.slice(0, 3) as topStrat, i}
              <div
                class="carousel-item"
                class:active={topStrat.name === strats[0].name}
              >
                <div class="topLabel">
                  <p>
                    <i class="bi bi-lightning-charge-fill" /> TOP STRATEGY
                  </p>
                </div>
                <h1>#{i + 1}: {topStrat.name}</h1>
                <div class="row">
                  <div class="col-6"><p>Monthly Gain</p></div>
                  <div class="col-6"><h4>{topStrat.monthlyPercGain}%</h4></div>
                </div>
                <div class="row">
                  <div class="col-6"><p>Winrate</p></div>
                  <div class="col-6"><h4>{topStrat.winrate}%</h4></div>
                </div>
                <!-- <p>Timeframe: {topStrat.timeframe}</p> -->
              </div>
            {/each}
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
      <div class="col-5 stratHeader">
        <div>
          <h1>Strategy Store</h1>
          <p>
            All strategies 50% off with the <a
              href="/pricing"
              class="pricingLink"
              class:dark={appThemeIsDark}>Peasant Pass</a
            >.
          </p>
        </div>
      </div>
      <div class="col-2" />
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
              <tr
                class:dark={appThemeIsDark}
                on:click={() => goto("/strategy/" + t.id)}
              >
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
    padding-top: 2rem;
  }

  #stratIndex.dark {
    background-color: black;
    color: $cream;
  }

  .stratHeader {
    text-align: left;
    padding: 70px 0;

    div {
      padding-left: 2.5rem;

      h1 {
        margin-bottom: 0.75rem;
        width: fit-content;
      }
    }
  }

  .topLabel {
    p {
      font-size: smaller;
      color: gold;
      font-family: $title-font;

      i {
        margin-right: 0.25rem;
      }
    }
  }

  .row {
    text-align: center;
  }

  .carousel-indicators {
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
    padding: 2rem 2rem 5rem 2rem;
    border: $cream 3px dashed;
    border-radius: 5px;
    background-color: black;

    .row {
      text-align: left;
      padding-left: 3rem;
    }

    h1 {
      margin-bottom: 1rem;
    }
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
