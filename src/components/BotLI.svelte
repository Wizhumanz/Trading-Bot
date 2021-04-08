<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import { storeUser } from "../../store.js";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let bot;

  // global variables
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

  $: if (showConfirm) {
    showConfirmBtn = "display: block;";
  } else {
    showConfirmBtn = "display: none;";
  }

  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
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
          if (user !== undefined && user.privateWebhookConns !== undefined) {
            let priv = user.privateWebhookConns.find(
              (element) => element.KEY === bot.WebhookConnectionID
            );
            webhookDisplayData = priv.URL;
          }
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

  onMount(() => {
    newTicker = bot.Ticker;
    newRiskPerc = bot.AccountRiskPercPerTrade;
    newAccSizePerc = bot.AccountSizePercToTrade;
    newLeverage = bot.Leverage;
    active = bot.IsActive;
  });

  //post request for Bot
  function toggleBotStatus() {
    loading = true;
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
    delete data.WebhookURL;
    data.IsActive = data.IsActive.toString();
    data.AccountRiskPercPerTrade = data.AccountRiskPercPerTrade.toString();
    data.AccountSizePercToTrade = data.AccountSizePercToTrade.toString();
    data.Leverage = data.Leverage.toString();

    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: user.password,
    };
    axios
      .put(
        "https://ana-api.myika.co/bot/" + bot.AggregateID + "?user=" + user.id,
        data,
        {
          headers: hds,
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
    const hds = {
      //"Content-Type": "application/json",
      Authorization: user.password,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
    axios
      .delete("http://localhost:8000/bot/" + bot.KEY + "?user=" + user.id, {
        headers: hds,
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
</script>

{#if loading}
  <LoadingIndicator />
{/if}

<div class="container-fluid" class:active>
  <div class="row">
    <div class="col-sm-12 col-md-2" />
    <div class="col-sm-12 col-md-8 main-box">
      <div class="row">
        <div class="col-sm-12 col-lg-4">
          <h4>{bot.Name}</h4>
          <p>{bot.KEY}</p>
          <div class="red">
            {#if bot.IsActive === "true" || bot.IsActive === true}
              <p>ACTIVE</p>
            {:else}
              <p>INACTIVE</p>
            {/if}

            <button
              on:click={toggleBotStatus}
              type="button"
              class="btn blood-btn"
            >
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
          <div class="row">
            <div class="col-7">Ticker</div>
            <div class="col-5 val-col">
              {newTicker}
            </div>
            {#if newTicker !== bot.Ticker && newTicker !== null}
              <p class="changeVal">=> {bot.Ticker} UNSAVED</p>
            {/if}
          </div>
          <div class="row">
            <div class="col-7">% of account to trade</div>
            <div class="col-5 val-col">
              {newAccSizePerc}%
            </div>
            {#if parseFloat(newAccSizePerc) !== parseFloat(bot.AccountSizePercToTrade) && newAccSizePerc !== null}
              <p class="changeVal">=> {bot.AccountSizePercToTrade}% UNSAVED</p>
            {/if}
          </div>
          <div class="row">
            <div class="col-7">% of account risked per trade</div>
            <div class="col-5 val-col">
              {newRiskPerc}%
            </div>
            {#if parseFloat(newRiskPerc) !== parseFloat(bot.AccountRiskPercPerTrade) && newRiskPerc !== null}
              <p class="changeVal">=> {bot.AccountRiskPercPerTrade}% UNSAVED</p>
            {/if}
          </div>
          <div class="row">
            <div class="col-7">Leverage</div>
            <div class="col-5 val-col">
              {newLeverage}x
            </div>
            {#if parseInt(newLeverage) !== parseInt(bot.Leverage) && newLeverage !== null}
              <p class="changeVal">=> {bot.Leverage}% UNSAVED</p>
            {/if}
          </div>
          <button class="save-btn" style={showSaveBtnAlert} on:click={updateBot}
            >Save</button
          >
          <!-- display-only fields -->
          <div class="display-fields">
            <div class="row">
              <div class="col-7">Exchange</div>
              <div class="col-5 lowkey-val-col">
                {bot.ExchangeConnection}
              </div>
            </div>
            <div class="row">
              <div class="col-7">Webhook</div>
              <div class="col-5 lowkey-val-col urlDisplay">
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                  on:click={copyText}
                  data-toggle="tooltip"
                  title="Copy to Clipboard">{webhookDisplayData}</a
                >
              </div>
            </div>
          </div>
          <hr />
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
                    id={"ticker" + bot.WebhookURL}
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
                    id="leverage"
                    bind:value={bot.Leverage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          class="del-btn"
          on:click={() => {
            showConfirm = !showConfirm;
          }}
        >
          <i class="bi bi-exclamation-triangle" />
          DELETE
          <i class="bi bi-exclamation-triangle" /></button
        >
        <button
          style={showConfirmBtn}
          class="del-btn-confirm"
          on:click={deleteBot}
        >
          CONFIRM
        </button>
      </div>
    </div>
    <div class="col-sm-12 col-md-2" />
  </div>
  <hr />
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
    border: $blue 3px solid;
    border-radius: 5px;
    padding: 2rem;
  }

  div.red {
    border: $blood 3px solid;
    background-color: $blood;
    border-radius: 3px;
    color: $ivory;
    text-align: center;
    margin: auto auto 1.5rem auto;
    padding: 1.5rem;

    p {
      background-color: $blood;
      color: $cream;
    }
  }

  div.settings-col {
    hr {
      color: $cream;
    }
  }

  .val-col {
    font-family: $title-font;
    font-size: large;
  }

  .lowkey-val-col {
    font-family: $title-font;
    font-size: small;
  }

  button {
    background-color: $cream;
    color: black;
    border-radius: 5px;
  }

  .save-btn {
    padding: 0.25rem 0.75rem;
    margin-bottom: 1rem;
    color: $cream;
    background-color: $blue;
    border: $cream 2px dashed;
    font-size: small;
  }

  .display-fields {
    font-size: small;
  }

  p.changeVal {
    color: yellow;
    font-weight: bold;
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
  }

  button.del-btn {
    color: $blood;

    i {
      background-color: $cream;
      color: black;
    }
  }

  button.del-btn-confirm {
    margin-bottom: -0.5rem;
    color: $cream;
    background-color: $blood;
    border-color: $blood;
  }
</style>
