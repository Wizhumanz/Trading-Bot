<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import { storeUser, storeAppTheme } from "../../store.js";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let bot;

  // global variables
  let appThemeIsDark = false;
  let user = {};
  let loading = false;
  let newTicker;
  let newRiskPerc;
  let newAccSizePerc;
  let newLeverage;
  let active;
  let webhookDisplayData;
  let showSaveBtnAlert = "display: none;";
  let updateErrorAlert = "display: none;";
  let showConfirm = false;
  let showConfirmBtn;
  let groupedView = {}
  let url = "https://ana-api.myika.co"

  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  $: if (showConfirm) {
    showConfirmBtn = "display: block;";
  } else {
    showConfirmBtn = "display: none;";
  }

  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
      if (user.trades) {
        latestTradeAction()
      }
      //display names for public webhookConns, display URL for private webhookConns
      if (user !== undefined && user.publicWebhookConns !== undefined) {
        let found = user.publicWebhookConns.find(
          (element) => element.KEY === bot.WebhookConnectionID
        );
        if (found) {
          //is public webhookConn, display Name
          webhookDisplayData = found.Name;
        } else {
          //is private webhookConn, display URL
          getPrivateWebhooksInfo().then(() => {
            if (user !== undefined && user.privateWebhookConns !== undefined) {
              let priv = user.privateWebhookConns.find(
                (element) => element.KEY === bot.WebhookConnectionID
              );
              webhookDisplayData = priv.URL;
            }
          });
        }
      }
    }
  });

  //notification when values have been modified
  $: if (
    parseFloat(newAccSizePerc) !== parseFloat(bot.AccountSizePercToTrade) ||
    parseFloat(newRiskPerc) !== parseFloat(bot.AccountRiskPercPerTrade) ||
    parseInt(newLeverage) !== parseInt(bot.Leverage) ||
    newTicker !== bot.Ticker
  ) {
    showSaveBtnAlert = "display: block;";
  } else {
    showSaveBtnAlert = "display: none;";
  }

  //helper function
  function reassignProperties() {
    newRiskPerc = bot.AccountRiskPercPerTrade;
    newAccSizePerc = bot.AccountSizePercToTrade;
    newLeverage = bot.Leverage;
    newTicker = bot.Ticker;
    active = bot.IsActive;
  }

  function copyText(e) {
    e.preventDefault();
    var copyText = webhookDisplayData;
    document.addEventListener(
      "copy",
      function (e) {
        e.clipboardData.setData("text/plain", copyText);
        e.preventDefault();
      },
      true
    );
    document.execCommand("copy");
  }

  function header(auth) {
    if (auth) {
      return {
        // "Content-Type": "application/json",
        Authorization: user.password,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      }
    } else {
      return {
        // "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      };
    }
  }

  onMount(() => {
    newTicker = bot.Ticker;
    newRiskPerc = bot.AccountRiskPercPerTrade;
    newAccSizePerc = bot.AccountSizePercToTrade;
    newLeverage = bot.Leverage;
    active = bot.IsActive;
  });

  function latestTradeAction() {
    user.trades.forEach((v) => {
      if (v.BotID in groupedView) {
        groupedView[v.BotID].push(v);
      } else {
        groupedView[v.BotID] = [v];
      }
    })
    for (let key in groupedView) {
      groupedView[key].sort((a, b) => new Date(b.Timestamp.replaceAll("_"," ")).getTime() - new Date(a.Timestamp.replaceAll("_"," ")).getTime())
    }
  }

  //post request for Bot
  function toggleBotStatus() {
    loading = true;
    if (typeof(bot.IsActive) == "string"){
      bot.IsActive = (bot.IsActive === "true")? true : false
    }
    bot.IsActive = !bot.IsActive;
    updateBot();
  }

  const updateBot = () => {
    loading = true;

    // if (newRiskPerc < 0) {
    //   alert("Risk % per trade must be GREATER THAN 0!\nBot update cancelled.");
    //   loading = false;
    //   return;
    // }
    // if (newAccSizePerc < 0) {
    //   alert(
    //     "Account size % to trade must be GREATER THAN 0!\nBot update cancelled."
    //   );
    //   loading = false;
    //   return;
    // }
    // if (!Number.isInteger(newLeverage)) {
    //   alert("Leverage must be a whole number!\nBot update cancelled.");
    //   loading = false;
    //   return;
    // }
    let data = { ...bot };
    delete data.AggregateID;
    data.IsActive = data.IsActive.toString();
    data.AccountRiskPercPerTrade = data.AccountRiskPercPerTrade.toString();
    data.AccountSizePercToTrade = data.AccountSizePercToTrade.toString();
    data.Leverage = data.Leverage.toString();
    data.CreationDate = data.Timestamp;

    axios
      .put(url + "/bot/" + bot.AggregateID + "?user=" + user.id,
        data,
        {
          headers: header(true),
          mode: "cors",
        }
      )
      .then((res) => {
        //updating the local state
        let storeBots = [];
        user.bots.forEach((b) => {
          if (b.AggregateID === bot.AggregateID) {
            storeBots.push(bot);
          } else {
            storeBots.push(b);
          }
        });
        user.bots = storeBots;
        console.log(res.status + " -- " + JSON.stringify(res.data));
        storeUser.set(JSON.stringify(user));
        loading = false;

        reassignProperties();
      })
      .catch((error) => {
        console.log(error.response);
        updateErrorAlert = "display: block;";
        loading = false;
      });
  };

  function deleteBot() {
    loading = true;
    axios
      .delete(url + "/bot/" + bot.KEY + "?user=" + user.id, {
        headers: header(true),
        mode: "cors",
      })
      .then(() => {
        loading = false;

        let storeBots = [];
        user.bots.forEach((b) => {
          if (b.KEY !== bot.KEY) {
            storeBots.push(b);
          }
        });

        user.bots = storeBots;
        storeUser.set(JSON.stringify(user));
        document.location.reload();
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  function getPrivateWebhooksInfo() {
    return new Promise((resolve, reject) => {
      //get ids of private WebhookConnections
      let privateIDs = [];
      user.bots.forEach((bot) => {
        //if webhookConnID of bot isn't found in public webhooks array, must fetch
        let found = user.publicWebhookConns.find(
          (element) => element.KEY === bot.WebhookConnectionID
        );
        if (!found) {
          privateIDs.push(bot.WebhookConnectionID);
        }
      });

      //build query string with all IDs
      let webhookURL = privateIDs[0];
      console.log(privateIDs)

      privateIDs.forEach((id, index) => {
        if (index != 0 && id != "") {
          webhookURL = webhookURL + "+" + id;
        console.log(webhookURL)
        }
      });
      console.log(webhookURL)

      axios
        .get(url + "/webhook?user=" + user.id + "&ids=" + webhookURL, {
          headers: header(true),
          mode: "cors",
        })
        .then((res) => {
          user.privateWebhookConns = res.data;
          resolve(user.privateWebhookConns);
          storeUser.set(JSON.stringify(user));
        })
        .catch((error) => {
          console.log(error.response);
        });
    });
  }
</script>

{#if loading}
  <LoadingIndicator />
{/if}

<div class="container-fluid" class:active>
  <div class="row">
    <div class="col-sm-12 col-md-2" />
    <div class="col-sm-12 col-md-8 main-box" class:dark={appThemeIsDark}>
      <div class="row">
        <div class="col-sm-12 col-lg-4">
          <h4>{bot.Name}</h4>
          {#if Object.keys(groupedView).length > 0 && Object.keys(groupedView).includes(bot.KEY)}
            <h5>{groupedView[bot.KEY][0].Action}</h5>
          {/if}
          <div class="statusDiv" class:dark={appThemeIsDark}>
            {#if bot.IsActive === "true" || bot.IsActive === true}
              <h4>ACTIVE</h4>
            {:else}
              <h4>INACTIVE</h4>
            {/if}

            <button on:click={toggleBotStatus} class:dark={appThemeIsDark}>
              {bot.IsActive === "true" || bot.IsActive === true
                ? "Shut Down"
                : "Activate"}
            </button>
          </div>
          <div style={updateErrorAlert}>
            <p>
              Something went wrong with the update. Please contact customer
              service
            </p>
          </div>
        </div>
        <div class="col-sm-12 col-lg-8 settings-col">
          <div class="settingsDisplayBox">
            <div class="row">
              <div class="col-7">Ticker</div>
              <div class="col-5 val-col">
                {newTicker}
              </div>
            </div>
            {#if newTicker !== bot.Ticker && newTicker !== null}
              <div class="changeVal" class:dark={appThemeIsDark}>
                <p><i class="bi bi-arrow-right" /> {bot.Ticker} | UNSAVED</p>
              </div>
            {/if}
            <div class="row">
              <div class="col-7">% of account to trade</div>
              <div class="col-5 val-col">
                {newAccSizePerc}%
              </div>
            </div>
            {#if parseFloat(newAccSizePerc) !== parseFloat(bot.AccountSizePercToTrade) && newAccSizePerc !== null}
              <div class="changeVal" class:dark={appThemeIsDark}>
                <p>
                  <i class="bi bi-arrow-right" />
                  {bot.AccountSizePercToTrade}% | UNSAVED
                </p>
              </div>
            {/if}
            <div class="row">
              <div class="col-7">% of account risked per trade</div>
              <div class="col-5 val-col">
                {newRiskPerc}%
              </div>
            </div>
            {#if parseFloat(newRiskPerc) !== parseFloat(bot.AccountRiskPercPerTrade) && newRiskPerc !== null}
              <div class="changeVal" class:dark={appThemeIsDark}>
                <p>
                  <i class="bi bi-arrow-right" />
                  {bot.AccountRiskPercPerTrade}% | UNSAVED
                </p>
              </div>
            {/if}
            <div class="row">
              <div class="col-7">Leverage</div>
              <div class="col-5 val-col">
                {newLeverage}x
              </div>
            </div>
            {#if parseInt(newLeverage) !== parseInt(bot.Leverage) && newLeverage !== null}
              <div class="changeVal" class:dark={appThemeIsDark}>
                <p><i class="bi bi-arrow-right" /> {bot.Leverage}% | UNSAVED</p>
              </div>
            {/if}
            <button
              class="save-btn"
              class:dark={appThemeIsDark}
              style={showSaveBtnAlert}
              on:click={updateBot}>Save</button
            >
            <div class="displayOnlyFields">
              <!-- display-only fields -->
              <div class="display-fields">
                <div class="row">
                  <div class="col-7">Exchange</div>
                  <div class="col-5 lowkey-val-col">
                    {#each user.exchanges as e}
                      {#if e.KEY == bot.ExchangeConnection}
                        {e.Name}
                      {/if}
                    {/each}
                  </div>
                </div>
                <div class="row">
                  <div class="col-7">Webhook</div>
                  <div class="col-5 lowkey-val-col urlDisplay">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a
                      on:click={copyText}
                      data-toggle="tooltip"
                      title="Copy link to clipboard">{webhookDisplayData}</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- inputs -->
          <div class="form">
            <div class="row">
              <div class="col-sm-12 col-md-6">
                <div class="mb-3">
                  <label for={"ticker" + bot.WebhookURL} class="form-label"
                    >Ticker</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    class:dark={appThemeIsDark}
                    id={"ticker" + bot.WebhookConnectionID}
                    bind:value={bot.Ticker}
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-6">
                <div class="mb-3">
                  <label for="accSizePerc" class="form-label"
                    >% of account to trade</label
                  >
                  <input
                    type="number"
                    step=".01"
                    min="0"
                    class="form-control"
                    class:dark={appThemeIsDark}
                    id="accSizePerc"
                    bind:value={bot.AccountSizePercToTrade}
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12 col-md-6">
                <div class="mb-3">
                  <label for="riskPerc" class="form-label"
                    >Risk % per trade</label
                  >
                  <input
                    type="number"
                    step=".01"
                    min="0"
                    class="form-control"
                    class:dark={appThemeIsDark}
                    id="riskPerc"
                    bind:value={bot.AccountRiskPercPerTrade}
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-6">
                <div class="mb-3">
                  <label for="leverage" class="form-label">Leverage</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    class="form-control"
                    class:dark={appThemeIsDark}
                    id="leverage"
                    bind:value={bot.Leverage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="del-btn-row">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class:dark={appThemeIsDark}
          on:click={() => {
            showConfirm = !showConfirm;
          }}
        >
          {showConfirm === false ? "DELETE" : "Cancel"}</a
        >
        <button
          style={showConfirmBtn}
          class:dark={appThemeIsDark}
          on:click={deleteBot}
        >
          <i class="bi bi-exclamation-triangle" />
          CONFIRM
        </button>
      </div>
    </div>
    <div class="col-sm-12 col-md-2" />
  </div>
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

  div.container-fluid {
    font-family: $body-font;
    margin: 1rem auto;
    text-align: left;
    border-radius: 3px;

    p {
      margin: 0;
    }
  }

  .main-box {
    background-color: $blue;
    color: $ivory;
    border: none;
    border-radius: 10px;
    padding: 2rem 3rem 1rem 3rem;
    margin-bottom: 1rem;

    background: linear-gradient(40deg, $blue 50%, black 50%);
  }

  .main-box.dark {
    background-color: black;
    border: $blood 3px dashed;

    background: linear-gradient(40deg, #0d0000 50%, black 50%);
  }

  div.statusDiv {
    background-color: $cream;
    color: black;
    border-radius: 7px;

    text-align: center;
    margin: 0.75rem auto 1.5rem auto;
    padding: 1.25rem 1rem;

    h4 {
    }

    button {
      font-size: larger;
      padding: 0.25rem 0.75rem;
      margin-top: 0;
      border-radius: 3px;
      border: none;
      color: $ivory;
      background-color: black;

      background-size: 100% 200%;
      background-image: linear-gradient(to bottom, black 50%, $blood 50%);
      -webkit-transition: background-position 0.5s;
      -moz-transition: background-position 0.5s;
      transition: background-position 0.5s;
    }

    button:hover {
      background-position: 0 -100%;
      color: $ivory;
    }
  }

  div.statusDiv.dark {
    border: $blood 3px solid;
    background-color: $blood;
    color: $ivory;

    h4 {
      background-color: $blood;
      color: $cream;
    }

    button {
      font-size: larger;
      padding: 0.25rem 0.75rem;
      margin-top: 0;
      border-radius: 3px;
      border: none;
      color: $ivory;
      background-color: black;

      background-size: 100% 200%;
      background-image: linear-gradient(to bottom, black 50%, $cream 50%);
      -webkit-transition: background-position 0.5s;
      -moz-transition: background-position 0.5s;
      transition: background-position 0.5s;
    }

    button:hover {
      background-position: 0 -100%;
      color: $blood;
    }
  }

  div.settings-col {
    hr {
      color: $cream;
    }
  }

  .settingsDisplayBox {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    margin-bottom: 2rem;
  }

  .displayOnlyFields {
    margin-top: 1rem;
  }

  .val-col {
    font-family: $title-font;
    font-size: large;
  }

  .lowkey-val-col {
    font-family: $title-font;
    font-size: small;
  }

  .changeVal {
    font-weight: bold;
    width: fit-content;
    color: black;
    background-color: $cream;
    border-radius: 7px;
    margin: auto auto 0.75rem 0.5rem;
    padding: 0.35rem 0.75rem;
  }

  .changeVal.dark {
    background-color: $blood;
    color: $cream;

    p {
      font-weight: bold;
    }
  }

  .save-btn {
    margin-bottom: 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 3px;
    border: none;
    font-size: normal;
    background-color: $cream;
    color: black;
  }

  .save-btn:hover {
    color: $ivory;
  }

  .save-btn.dark {
    color: $cream;
    background-color: black;
    border: $cream 2px solid;
  }

  .display-fields {
    font-size: small;
  }

  #imgDisplay {
    overflow: hidden;
    display: block;
    margin: auto;
  }

  input.form-check-input {
    margin: 1rem auto;
  }

  .editA {
    height: fit-content;
    color: $blue;
    font-style: italic;
    margin-top: 0.5rem;
  }

  a {
    text-decoration: underline;
  }

  // .active {
  //   background-color: red;
  // }

  .urlDisplay {
    overflow: hidden;

    a {
      color: $ivory;
    }
    a:hover {
      color: $cream;
      text-decoration: underline;
    }
  }

  input:focus-within {
    background-color: black;
    color: $ivory;
  }

  // input.dark {
  //   background-color: black;
  //   color: $ivory;
  //   border: $blood 3px dashed;
  // }

  input.dark:focus-within {
    background-color: $blood;
    color: $cream;
    border: none;
  }

  .del-btn-row {
    text-align: center;

    a:hover {
      color: $cream;
      text-decoration: underline;
    }

    button {
      background-color: black;
      color: $cream;
      position: relative;
      width: 30%;
      margin: 0.5rem auto;
      border: none;

      background-size: 100% 200%;
      background-image: linear-gradient(to bottom, black 50%, $blood 50%);
      -webkit-transition: background-position 0.5s;
      -moz-transition: background-position 0.5s;
      transition: background-position 0.5s;
    }

    button.dark {
      background-color: $blue;
      color: $cream;

      background-size: 100% 200%;
      background-image: linear-gradient(to bottom, $blue 50%, $blood 50%);
      -webkit-transition: background-position 0.5s;
      -moz-transition: background-position 0.5s;
      transition: background-position 0.5s;
    }

    button.dark:hover {
      background-position: 0 -100%;
    }
  }
</style>
