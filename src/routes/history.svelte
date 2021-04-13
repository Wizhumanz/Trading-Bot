<script>
  import { storeUser, storeAppTheme } from "../../store.js";
  import axios from "axios";

  let view = "grouped";
  let groupedView = {};
  let showHistoryBool = true;
  let user = {};
  let whichKey = [];
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
    if (whichKey.includes(e.target.innerText)) {
      showHistoryBool = !showHistoryBool;

      delete whichKey[whichKey.indexOf(e.target.innerText)];
    } else {
      showHistoryBool = true;

      whichKey = [...whichKey, e.target.innerText];
      console.log(whichKey);
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
            class="viewOptionsToggle"
            data-bs-toggle="collapse"
            href="#displayOptionsCollapse"
            role="button"
            aria-expanded="false"
            aria-controls="displayOptionsCollapse"
          >
            View Options...
          </a>
          <div class="collapse" id="displayOptionsCollapse">
            <p>Trade Direction</p>
            <div class="checkbox-row row">
              <div class="col-4">
                <input type="checkbox" id="longCheck" bind:checked={showLong} />
              </div>
              <div class="col-8">
                <label class="form-check-label" for="longCheck"> Long </label>
              </div>
            </div>
            <div class="checkbox-row row">
              <div class="col-4">
                <input
                  type="checkbox"
                  id="shortCheck"
                  bind:checked={showShort}
                />
              </div>
              <div class="col-8">
                <label class="form-check-label" for="shortCheck"> Short </label>
              </div>
            </div>
            <p>Action Type</p>
            <div class="checkbox-row row">
              <div class="col-4">
                <input type="checkbox" id="showOpen" bind:checked={showOpen} />
              </div>
              <div class="col-8">
                <label class="form-check-label" for="showOpen"> Open </label>
              </div>
            </div>
            <div class="checkbox-row row">
              <div class="col-4">
                <input
                  type="checkbox"
                  id="showClose"
                  bind:checked={showClose}
                />
              </div>
              <div class="col-8">
                <label class="form-check-label" for="showClose"> Close </label>
              </div>
            </div>
            <div class="checkbox-row row">
              <div class="col-4">
                <input
                  type="checkbox"
                  id="showUpdate"
                  bind:checked={showUpdate}
                />
              </div>
              <div class="col-8">
                <label class="form-check-label" for="showUpdate">
                  Update
                </label>
              </div>
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
            {#if whichKey.includes(key)}
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

  .viewOptionsToggle {
    font-family: $title-font;
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

  #displayOptionsCollapse {
    width: 150px;
    text-align: left;
    padding: 0.75rem;
    padding-top: 0;
    margin-top: 0.25rem;
    border-left: $cream 1px dashed;
    border-right: $cream 1px dashed;
    border-bottom: $cream 1px dashed;

    p {
      margin-bottom: 0;
      margin-top: 0.5rem;
    }

    .col-4 {
      margin-top: 0.25rem;
      input {
        margin-left: 0.75rem;
        width: 18px;
        height: 18px;
      }
      input:checked {
        background-color: $blood;
      }
    }
  }

  input[type="checkbox"] {
    /* change "blue" browser chrome to yellow */
    filter: invert(100%) hue-rotate(-18deg) brightness(1.7);
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
