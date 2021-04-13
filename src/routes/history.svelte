<script>
  import { storeUser, storeAppTheme } from "../../store.js";
  import axios from "axios";

  let view = "grouped";
  let groupedView = {};
  let showHistoryBool = false;
  let user = {};
  let whichKey = "";
  let showLong = true;
  let showShort = true;
  let showOpen = true;
  let showClose = true;
  let showUpdate = true;
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  let appThemeIsDark = false;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  function viewOptionsHandler() {
    //logic for grouped view
    user.trades.forEach((v) => {
      if (v.BotID in groupedView) {
        groupedView[v.BotID].push(v);
      } else {
        groupedView[v.BotID] = [v];
      }
    });
    // for (var key in groupedView) {
    //   console.log(key);
    //   groupedView[key].forEach((v) => {
    //     console.log(v);
    //   });
    // }
  }

  function showHideHistoryHandler(e) {
    whichKey = e.target.innerText;
    showHistoryBool = !showHistoryBool;
    if (showHistoryBool === true) {
      showHistory = "display: block;";
    } else {
      showHistory = "display: none;";
    }
  }

  //need this for some reason. Otherwise it gives an error
  user.trades = [];

  //get request for TradeAction/trade history
  const hds = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
    Authorization: user.password,
  };
  axios
    .get("https://ana-api.myika.co/trades" + "?user=" + user.id, {
      headers: hds,
      mode: "cors",
    })
    .then((res) => {
      user.trades = res.data;
      // console.log(res.status + " -- " + JSON.stringify(res.data));
      viewOptionsHandler();
    })
    .catch((error) => {
      console.log(error.response);
    });
</script>

<div id="tradeHistory">
  <div class="container-fluid">
    <h1>Trade History</h1>
    <div class="row options">
      <div class="col-1 col-md-1">
        <div id="filterMenu">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class:dark={appThemeIsDark}
            data-bs-toggle="collapse"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            Display
          </a>
          <div class="collapse" id="collapseExample">
            <div class="form-check">
              <label class="form-check-label" for="flexCheckDefault">
                Long
              </label>
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                bind:checked={showLong}
              />
              <label class="form-check-label" for="flexCheckDefault">
                Short
              </label>
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                bind:checked={showShort}
              />
            </div>
          </div>
          <div class="collapse" id="collapseExample">
            <div class="form-check">
              <label class="form-check-label" for="flexCheckDefault">
                Open
              </label>
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                bind:checked={showOpen}
              />
              <label class="form-check-label" for="flexCheckDefault">
                Close
              </label>
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                bind:checked={showClose}
              />
              <label class="form-check-label" for="flexCheckDefault">
                Update
              </label>
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                bind:checked={showUpdate}
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-7 col-md-8" />
      <div class="col-4 col-md-3">
        <ul id="viewOptions">
          <!-- svelte-ignore a11y-missing-attribute -->

          <li>
            <a
              on:click={() => {
                view = "log";
              }}
              class:dark={appThemeIsDark}>Log Mode</a
            >
          </li>
          <li>/</li>

          <!-- svelte-ignore a11y-missing-attribute -->

          <li>
            <a
              on:click={() => {
                view = "grouped";
              }}
              class:dark={appThemeIsDark}>Grouped Mode</a
            >
          </li>
        </ul>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr class:dark={appThemeIsDark}>
          <th scope="col">Action</th>
          <th scope="col">Ticker</th>
          <th scope="col">Size</th>
          <th scope="col">Timestamp</th>
          <th scope="col">BotID</th>
          <th scope="col">AggregateID</th>
          <th scope="col">ID</th>
          <th scope="col">Exchange</th>
        </tr>
      </thead>
      <tbody>
        {#if view === "log"}
          {#each user.trades as t}
            <tr class:dark={appThemeIsDark}>
              <td>{t.Action}</td>
              <td>{t.Ticker}</td>
              <td>{t.Size}</td>
              <td>{t.Timestamp}</td>
              <td>{t.BotID}</td>
              <td>{t.AggregateID}</td>
              <td>{t.KEY}</td>
              <td>{t.Exchange}</td>
            </tr>
          {/each}
        {:else if view === "grouped"}
          {#each Object.keys(groupedView) as key}
            <tr class:dark={appThemeIsDark}>
              <td on:click={showHideHistoryHandler}>{key}</td>
            </tr>
            <!-- if the row is expanded -->
            {#if whichKey == key}
              {#each groupedView[key] as history}
                <!-- <tr style={showHistory} class:dark={appThemeIsDark}> -->
                <tr class:dark={appThemeIsDark} hidden={!showHistoryBool}>
                  <td class="expanded-row">{history.Action}</td>
                  <td class="expanded-row">{history.Ticker}</td>
                  <td class="expanded-row">{history.Size}</td>
                  <td class="expanded-row">{history.Timestamp}</td>
                  <td class="expanded-row">{history.BotID}</td>
                  <td class="expanded-row">{history.AggregateID}</td>
                  <td class="expanded-row">{history.KEY}</td>
                  <td class="expanded-row">{history.Exchange}</td>
                </tr>
              {/each}
            {/if}
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

  #tradeHistory {
    background-color: black;
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 1rem;
  }

  .container-fluid {
    padding: 1rem 2rem;
    text-align: center;
  }

  #filterMenu {
    text-align: left;

    a {
      display: inline-block;
      color: $blue;
    }

    a.dark {
      color: $cream;
    }
  }

  #viewOptions {
    font-size: smaller;
    text-align: right;

    li {
      display: inline;

      a {
        font-family: $title-font;
        text-decoration: underline;
        color: $blue;
      }

      a.dark {
        color: $cream;
      }
    }
  }

  table {
    margin-top: 0.75rem;
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

  .expanded-row {
    background-color: $blue;
  }
</style>
