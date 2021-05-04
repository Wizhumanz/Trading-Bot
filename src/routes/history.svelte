<script>
  import { storeUser, storeAppTheme, selectedGMT } from "../../store.js";
  import axios from "axios";

  let appThemeIsDark = false;
  let timezone
  let view = "grouped";
  let groupedView = {};
  let numOfTradeAction = {};
  let timestampTA = {};
  let whichKey = [];
  let showLong = true;
  let showShort = true;
  let showOpen = true;
  let showClose = true;
  let showUpdate = true;
  let searchTicker = "";
  let searchSize = null;
  let user = {};
  let snapShots = [];
  let noTA = false
  let url = "https://ana-api.myika.co";

  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  selectedGMT.subscribe((newVal) => {
    timezone = newVal
  })

  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
      if (user.trades) {
        if (user.trades.length > 0) {
          viewOptionsHandler();

          noTA = false
        } else {
          noTA = true
        }
      }
    }
  });

  function timeDiff(curr, prev) {
    var ms_Min = 60 * 1000; // milliseconds in Minute
    var ms_Hour = ms_Min * 60; // milliseconds in Hour
    var ms_Day = ms_Hour * 24; // milliseconds in day
    var ms_Mon = ms_Day * 30; // milliseconds in Month
    var ms_Yr = ms_Day * 365; // milliseconds in Year
    var diff = curr - prev; //difference between dates.
    // If the diff is less then milliseconds in a minute
    if (diff < ms_Min) {
      return Math.round(diff / 1000) + " seconds ago";

      // If the diff is less then milliseconds in a Hour
    } else if (diff < ms_Hour) {
      return Math.round(diff / ms_Min) + " minutes ago";

      // If the diff is less then milliseconds in a day
    } else if (diff < ms_Day) {
      return Math.round(diff / ms_Hour) + " hours ago";

      // If the diff is less then milliseconds in a Month
    } else if (diff < ms_Mon) {
      return "Around " + Math.round(diff / ms_Day) + " days ago";

      // If the diff is less then milliseconds in a year
    } else if (diff < ms_Yr) {
      return "Around " + Math.round(diff / ms_Mon) + " months ago";
    } else {
      return "Around " + Math.round(diff / ms_Yr) + " years ago";
    }
  }
  function viewOptionsHandler() {
    //logic for grouped view
    user.trades.forEach((v) => {
      if (v.AggregateID in groupedView) {
        groupedView[v.AggregateID].push(v);
      } else {
        groupedView[v.AggregateID] = [v];
      }
    });

    timestampLogic();
  }


  function timestampLogic() {
    for (let key in groupedView) {
      let dict = {};
      groupedView[key].forEach((v) => {
        dict[v.Timestamp] = timeDiff(
          new Date(),
          new Date(v.Timestamp.replaceAll("_", " "))
        );
      });
      timestampTA[key] = dict;
    }
  }

  function convertGMT(timestamp,timezone) {
    let convertTime = Date.parse(timestamp.replaceAll("_", " "))
    let changeTime = new Date((convertTime + 3600000*timezone)).toUTCString()
    let cleanTime = changeTime.substring(0,changeTime.indexOf("G")-1)
    return cleanTime
  }

  function showHideHistoryHandler(aggID) {
    if (whichKey.includes(aggID)) {
      delete whichKey[whichKey.indexOf(aggID)];
      whichKey = whichKey;
    } else {
      whichKey = [...whichKey, aggID];
    }
  }

  let unoriginalTrades = [];

  function getAllUserTrades() {
    if (user.trades) {
      user.trades.forEach((x) => {
        if (!user.bots.map((b) => b.KEY).includes(x.BotID)) {
          unoriginalTrades.push(x.BotID);
        }
      });
    }

    if (unoriginalTrades.length !== 0) {
      getSnapShotBot();
    }
  }

  getAllUserTrades();

  function getSnapShotBot() {
    //return new Promise((resolve, reject) => {
    //botIDs.forEach((id) => {
    //build query string with all IDs
    let snapShotURLSet = new Set(unoriginalTrades);
    let snapShotURLArr = [...snapShotURLSet];
    let snapShotURL = snapShotURLArr[0];

    snapShotURLArr.forEach((id, index) => {
      if (index != 0) {
        snapShotURL = snapShotURL + "+" + id;
      }
    });
    const hds = {
      // "Content-Type": "application/json",
      Authorization: user.password,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
    axios
      .get(url + "/bot?user=" + user.id + "&ids=" + snapShotURL, {
        headers: hds,
        mode: "cors",
      })
      .then((res) => {
        snapShots = res.data;
        console.log(snapShots);
        //console.log(snapShots.map((x) => {return x.KEY}))
      })
      .catch((error) => {
        console.log(error.response);
      });
    //});
    //})
  }

  // Number of trade actions for each view options
  //&& ((v.Direction === "LONG" && showLong) || (v.Direction === "SHORT" && showShort))
  $: for (let key in groupedView) {
    let num = 0;
    numOfTradeAction[key] = 0;
    groupedView[key].forEach((v) => {
      if (
        (v.Action.toLowerCase().includes("enter") && showOpen) ||
        (v.Action.toLowerCase().includes("exit") && showClose) ||
        (!v.Action.toLowerCase().includes("enter") &&
          !v.Action.toLowerCase().includes("exit") &&
          showUpdate &&
          ((v.Direction === "LONG" && showLong) ||
            (v.Direction === "SHORT" && showShort)))
      ) {
        if (
          (v.Direction === "LONG" && showLong) ||
          (v.Direction === "SHORT" && showShort)
        ) {
          if (
            (v.Ticker.toLowerCase().includes(searchTicker.toLowerCase()) ||
              searchTicker == "") &&
            (v.Size == searchSize || searchSize === null)
          ) {
            numOfTradeAction[key] = num += 1;
          }
        }
      }
    });
  }
</script>

<div id="tradeHistory">
  <div class="container-fluid">
    <h1>Trade History</h1>
    <div class="row options">
      <div class="col-sm-7 col-md-4">
        <div id="filterMenu">
          <div class="row controls">
            <div class="col-4">
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
                ▼ Options...
              </a>
            </div>
            <div class="col-4">
              <input
                type="search"
                placeholder="Search ticker"
                class:dark={appThemeIsDark}
                aria-label="Search ticker"
                bind:value={searchTicker}
              />
            </div>
            <div class="col-4">
              <input
                type="number"
                placeholder="Search order size"
                class:dark={appThemeIsDark}
                aria-label="Search order size"
                bind:value={searchSize}
              />
            </div>
          </div>
          <div class="collapse" id="displayOptionsCollapse">
            <div class="row">
              <div class="col-5">
                <p>Direction</p>
                <div class="checkbox-row row">
                  <div class="col-4">
                    <input
                      type="checkbox"
                      id="longCheck"
                      bind:checked={showLong}
                    />
                  </div>
                  <div class="col-8">
                    <label class="form-check-label" for="longCheck">
                      Long
                    </label>
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
                    <label class="form-check-label" for="shortCheck">
                      Short
                    </label>
                  </div>
                </div>
                <p>Action Type</p>
                <div class="checkbox-row row">
                  <div class="col-4">
                    <input
                      type="checkbox"
                      id="showOpen"
                      bind:checked={showOpen}
                    />
                  </div>
                  <div class="col-8">
                    <label class="form-check-label" for="showOpen">
                      Open
                    </label>
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
                    <label class="form-check-label" for="showClose">
                      Close
                    </label>
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
              <div class="col-7" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-4" />
      <div class="col-sm-5 col-md-4">
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
          <th scope="col">Bot</th>
          <th scope="col">AggregateID</th>
          <th scope="col">Exchange</th>
          <th scope="col">Trade Direction</th>
        </tr>
      </thead>
      <tbody>
        {#if noTA}
        <h2 style="color:white;" class="container-fluid">No Trade Action Exists.</h2>
        {:else}
          {#if view === "log"}
            {#each user.trades.sort((a, b) => new Date(b.Timestamp.replaceAll("_", " ")).getTime() - new Date(a.Timestamp.replaceAll("_", " ")).getTime()) as t}
              <!--
            {#if (!t.Action.toLowerCase().includes("enter") || !t.Action.toLowerCase().includes("exit") && showUpdate)}
            -->
              {#if (t.Ticker.toLowerCase().includes(searchTicker.toLowerCase()) || searchTicker == "") && (t.Size == searchSize || searchSize === null)}
                {#if (t.Action.toLowerCase().includes("enter") && showOpen) || (t.Action.toLowerCase().includes("exit") && showClose) || (!t.Action.toLowerCase().includes("enter") && !t.Action.toLowerCase().includes("exit") && showUpdate)}
                  {#if (t.Direction === "LONG" && showLong) || (t.Direction === "SHORT" && showShort)}
                    <tr class:dark={appThemeIsDark}>
                      <td>{t.Action}</td>
                      <td>{t.Ticker}</td>
                      <td>{t.Size}</td>
                      {#if timestampTA[t.AggregateID][t.Timestamp].includes("Around")}
                        <td class="timeDetailHover">
                          {convertGMT(t.Timestamp,timezone)}
                          <div class="hoverInfo">
                            <p>
                              {timestampTA[t.AggregateID][t.Timestamp]}
                            </p>
                          </div>
                        </td>
                      {:else}
                        <td class="timeDetailHover">
                          {timestampTA[t.AggregateID][t.Timestamp]}
                          <div class="hoverInfo">
                            <p>
                              {convertGMT(t.Timestamp,timezone)}
                            </p>
                          </div>
                        </td>
                      {/if}
                      {#if snapShots.map((x) => {return x.KEY;}).includes(t.BotID)}
                        {#each snapShots as s}
                          {#if t.BotID == s.KEY}
                            <td class="botDetailHover">
                              {s.Name}
                              <div class="hoverInfo">
                                <p>
                                  Ticker: {s.Ticker} <br>
                                  Size: {s.AccountSizePercToTrade} <br>
                                  Risk: {s.AccountRiskPercPerTrade}<br>
                                  Leverage: {s.Leverage} <br>
                                </p>
                              </div>
                            </td>
                          {/if}
                        {/each}
                      {:else}
                        {#each user.bots as b}
                          {#if t.BotID == b.KEY}
                            <td class="botDetailHover">
                              {b.Name}
                              <div class="hoverInfo">
                                <p>
                                  Ticker: {b.Ticker} <br>
                                  Size: {b.AccountSizePercToTrade} <br>
                                  Risk: {b.AccountRiskPercPerTrade}<br>
                                  Leverage: {b.Leverage} <br>
                                </p>
                              </div>
                            </td>
                          {/if}
                        {/each}
                      {/if}
                      <td>{t.AggregateID}</td>
                      {#each user.exchanges as e}
                        {#if e.KEY == t.Exchange}
                          <td>{e.Name}</td>
                        {/if}
                      {/each}
                      <td>{t.Direction}</td>
                    </tr>
                  {/if}
                {/if}
              {/if}
            {/each}
          {:else if view === "grouped"}
            {#each Object.keys(groupedView).sort(function (a, b) {
              return b - a;
            }) as key}
              {#if numOfTradeAction[key] !== 0}
                <tr
                  class:dark={appThemeIsDark}
                  on:click={showHideHistoryHandler(
                    groupedView[key][0].AggregateID
                  )}
                >
                  <td>({groupedView[key].length}) {numOfTradeAction[key]}</td>
                  <td>{groupedView[key][0].Ticker}</td>
                  <td>-</td>
                  <td>-</td>
                  {#if snapShots.map((x) => {return x.KEY;}).includes(groupedView[key][0].BotID)}
                    {#each snapShots as s}
                      {#if groupedView[key][0].BotID == s.KEY}
                        <td class="botDetailHover">
                          {s.Name}
                          <div class="hoverInfo">
                            <p>
                              Ticker: {s.Ticker} <br>
                              Size: {s.AccountSizePercToTrade} <br>
                              Risk: {s.AccountRiskPercPerTrade}<br>
                              Leverage: {s.Leverage} <br>
                            </p>
                          </div>
                        </td>
                      {/if}
                    {/each}
                  {:else}
                    {#each user.bots as b}
                      {#if b.KEY == groupedView[key][0].BotID}
                        <td class="botDetailHover">
                          {b.Name}
                          <div class="hoverInfo">
                            <p>
                              Ticker: {b.Ticker} <br>
                              Size: {b.AccountSizePercToTrade} <br>
                              Risk: {b.AccountRiskPercPerTrade}<br>
                              Leverage: {b.Leverage} <br>
                            </p>
                          </div>
                        </td>
                      {/if}
                    {/each}
                  {/if}
                  <td>{groupedView[key][0].AggregateID}</td>
                  {#each user.exchanges as e}
                    {#if e.KEY == groupedView[key][0].Exchange}
                      <td>{e.Name}</td>
                    {/if}
                  {/each}
                  <td>{groupedView[key][0].Direction}</td>
                </tr>
              {/if}
              <!-- if the row is expanded -->
              {#each groupedView[key].sort((a, b) => new Date(b.Timestamp.replaceAll("_", " ")).getTime() - new Date(a.Timestamp.replaceAll("_", " ")).getTime()) as tradeAction}
                <!-- <tr style={showHistory} class:dark={appThemeIsDark}> -->
                {#if (tradeAction.Ticker.toLowerCase().includes(searchTicker.toLowerCase()) || searchTicker == "") && (tradeAction.Size == searchSize || searchSize === null)}
                  {#if (tradeAction.Action.toLowerCase().includes("enter") && showOpen) || (tradeAction.Action.toLowerCase().includes("exit") && showClose) || (!tradeAction.Action.toLowerCase().includes("enter") && !tradeAction.Action.toLowerCase().includes("exit") && showUpdate)}
                    {#if (tradeAction.Direction === "LONG" && showLong) || (tradeAction.Direction === "SHORT" && showShort)}
                      {#if whichKey.includes(key)}
                        <tr class:dark={appThemeIsDark}>
                          <td class="expanded-row">{tradeAction.Action}</td>
                          <td class="expanded-row">{tradeAction.Ticker}</td>
                          <td class="expanded-row">{tradeAction.Size}</td>
                          {#if timestampTA[key][tradeAction.Timestamp].includes("Around")}
                            <td class="timeDetailHover expanded-row">
                              {convertGMT(tradeAction.Timestamp,timezone)}
                              <div class="hoverInfo">
                                <p>
                                  {timestampTA[tradeAction.AggregateID][tradeAction.Timestamp]}
                                </p>
                              </div>
                            </td>
                          {:else}
                            <td class="timeDetailHover expanded-row">
                              {timestampTA[key][tradeAction.Timestamp]}
                              <div class="hoverInfo">
                                <p>
                                  {convertGMT(tradeAction.Timestamp,timezone)}
                                </p>
                              </div>
                            </td>
                          {/if}
                          {#if snapShots
                            .map((x) => {
                              return x.KEY;
                            })
                            .includes(tradeAction.BotID)}
                            {#each snapShots as s}
                              {#if tradeAction.BotID == s.KEY}
                                <td class="botDetailHover expanded-row">
                                  {s.Name}
                                  <div class="hoverInfo">
                                    <p>
                                      Ticker: {s.Ticker} <br>
                                      Size: {s.AccountSizePercToTrade} <br>
                                      Risk: {s.AccountRiskPercPerTrade}<br>
                                      Leverage: {s.Leverage} <br>
                                    </p>
                                  </div>
                                </td>
                              {/if}
                            {/each}
                          {:else}
                            {#each user.bots as b}
                              {#if b.KEY == tradeAction.BotID}
                                <td class="botDetailHover expanded-row">
                                  {b.Name}
                                  <div class="hoverInfo">
                                    <p>
                                      Ticker: {b.Ticker} <br>
                                      Size: {b.AccountSizePercToTrade} <br>
                                      Risk: {b.AccountRiskPercPerTrade}<br>
                                      Leverage: {b.Leverage} <br>
                                    </p>
                                  </div>
                                </td>
                              {/if}
                            {/each}
                          {/if}
                          <td class="expanded-row">{tradeAction.AggregateID}</td>
                          {#each user.exchanges as e}
                            {#if e.KEY == tradeAction.Exchange}
                              <td class="expanded-row">{e.Name}</td>
                            {/if}
                          {/each}
                          <td class="expanded-row">{tradeAction.Direction}</td>
                        </tr>
                      {/if}
                    {/if}
                  {/if}
                {/if}
              {/each}
            {/each}
          {/if}
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
    padding: 1rem 0;
  }

  .container-fluid {
    padding: 1rem 2rem;
    width: 100%;
    text-align: center;
    background-color: black;
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
    width: 300px;
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

  .row.controls {
    align-items: flex-start;
  }

  input.dark {
    border-radius: 5px;
    font-size: smaller;
    padding: 0.3rem;
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

  .hoverInfo {
      display: none;
  }
  
  .botDetailHover:hover {
    .hoverInfo {
      display: block;
      position: absolute;
      margin-top: -5rem;
      margin-left: 6rem;
      width: fit-content;
      border-radius: 7px;
      background-color: $blood;
      opacity: 0.75;
      color: $cream;

      p {
        font-size: 0.75rem;
        margin: 0.75rem;
      }
    }
  }

  .timeDetailHover:hover {
    .hoverInfo {
      display: block;
      position: absolute;
      margin-top: -5rem;
      margin-left: 6rem;
      width: fit-content;
      border-radius: 7px;
      background-color: $blood;
      opacity: 0.75;
      color: $cream;

      p {
        font-size: 0.75rem;
        margin: 0.75rem;
      }
    }
  }
</style>
