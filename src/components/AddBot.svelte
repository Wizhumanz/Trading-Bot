<script>
  import axios from "axios";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import { storeUser, storeAppTheme } from "../../store.js";

  //global variables
  let appThemeIsDark = false;

  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  let loading = false;
  let addedAlert = "display: none;";
  let tickerData = []
  let ticker;
  let period;
  let botName;
  let strategySelect;
  let accSizePerc;
  let accRiskPerc;
  let leverage;
  let exchange;
  let customWebhookID;
  let user = {};
  let periodTime = ["1MIN", "2MIN", "3MIN", "4MIN", "5MIN", "6MIN", "10MIN", "15MIN", "20MIN", "30MIN", "1HRS", "2HRS", "3HRS", "4HRS", "6HRS", "8HRS", "12HRS", "1DAY", "2DAY"]

  user.publicWebhookConns = [];

  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  //helper functions
  function reassignProperties() {
    ticker = "";
    botName = "";
    accSizePerc = null;
    accRiskPerc = null;
    leverage = null;
    exchange = "";
    period = ""
  }

  function createNewDate() {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    return today.toISOString().slice(0,today.toISOString().indexOf(".")+1).concat("+0000").replace("T","_").replace(".","_")
  }

  function createNewWebhookConnection() {
    return new Promise((resolve, reject) => {
      const hds = {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        Authorization: user.password,
      };
      axios
        .post("http://localhost:8000/webhook" + "?user=" + user.id, null, {
          headers: hds,
          mode: "cors",
        })
        .then((res) => {
          customWebhookID = res.data.body;
          storeUser.set(JSON.stringify(user));
          resolve(res.data.body);
        })
        .catch((error) => {
          console.log(error.response);
        });
    });
  }

  //post request for Bot
  function addBotHandler() {
    loading = true;
    const hds = {
      // "Content-Type": "application/json",
      Authorization: user.password,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };

    //Don't change any of these properties
    let data = {
      Name: botName,
      UserID: user.id,
      ExchangeConnection: exchange.toString(),
      AccountRiskPercPerTrade: accRiskPerc.toString(),
      AccountSizePercToTrade: accSizePerc.toString(),
      IsActive: "false",
      IsArchived: "false",
      Leverage: leverage.toString(),
      Ticker: ticker,
      Period: period,
      WebhookConnectionID: strategySelect,
      CreationDate: createNewDate()
    };

    if (strategySelect !== "custom") {
      axios
        .post("http://localhost:8000/bot", data, {
          headers: hds,
          mode: "cors",
        })
        .then(() => {
          loading = false;
          addedAlert = "display: block;";
          if (user.bots === null || user.bots === undefined) {
            user.bots = [data];
          } else {
            user.bots.push(data);
          }
          console.log(data)
          storeUser.set(JSON.stringify(user));

          reassignProperties();

          setTimeout(() => {
            addedAlert = "display: none;";
          }, 7000);
        })
        .catch((error) => {
          loading = false;
          console.log(error.response);
        });
    } else {
      createNewWebhookConnection().then((res) => {
        data.WebhookConnectionID = customWebhookID;
        axios
          .post("http://localhost:8000/bot", data, {
            headers: hds,
            mode: "cors",
          })
          .then(() => {
            loading = false;
            addedAlert = "display: block;";
            if (user.bots === null || user.bots === undefined) {
              user.bots = [data];
            } else {
              user.bots.push(data);
            }

            storeUser.set(JSON.stringify(user));

            reassignProperties();

            setTimeout(() => {
              addedAlert = "display: none;";
            }, 7000);
          })
          .catch((error) => {
            loading = false;
            console.log(error.response);
          });
      });
    }
  }

  function getExchanges() {
  let hd = {
    // "Content-Type": "application/json",
    // Authorization: user.password,
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  }
  axios
    .get("http://localhost:8001" + "/getChartmasterTickers", {
      headers: hd,
      mode: "cors",
    })
    .then((res) => {
      //sort alphabetically
      tickerData = res.data
      tickerData.sort(function (a, b) {
        if (a.symbol_id_exchange < b.symbol_id_exchange) { return -1; }
        if (a.symbol_id_exchange > b.symbol_id_exchange) { return 1; }
        return 0;
      })
    })
    .catch((error) => {
      console.log(error);
    });
}
getExchanges()
</script>

<!--Loading Sign-->
{#if loading}
  <LoadingIndicator />
{/if}

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-12 col-md-1" />
    <div class="col-sm-12 col-md-10">
      <div id="fields-box">
        <form class="form" on:submit|preventDefault={addBotHandler}>
          <div class="mb-3">
            <label for="botName" class="form-label">Name</label>
            <input
              required="required"
              type="text"
              class="form-control"
              class:dark={appThemeIsDark}
              id="botName"
              placeholder="Evermore 50x Long"
              bind:value={botName}
            />
          </div>
          <div class="mb-3">
            <label for="tickerSelect" class="form-label">Ticker</label>
            <select class="form-control" class:dark={appThemeIsDark} bind:value={ticker} name="tickerSelect" id="tickerSelect">
              <!-- filled dynamically by API call -->
              {#each tickerData as t}
                {#if t.symbol_id === "BINANCEFTS_PERP_BTC_USDT"}
                  <option selected="selected" value={t.symbol_id}>{t.symbol_id_exchange + "  (" + t.symbol_id + ")"}</option>
                {:else}
                  <option value={t.symbol_id}>{t.symbol_id_exchange + "  (" + t.symbol_id + ")"}</option>
                {/if}
              {/each}
            </select>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="mb-3">
                <label for="period" class="form-label">Period</label>
                <select class="form-control" class:dark={appThemeIsDark} bind:value={period} name="periodSelect" id="periodSelect">
                  {#each periodTime as p}
                    <option value={p}>{p}</option>
                  {/each}
                </select>
              </div>
            </div>
            <div class="col-6">
              <div class="mb-3">
                <label for="webhookConn" class="form-label">Strategy</label>
                <select
                  id="webhookConn"
                  class="form-select"
                  class:dark={appThemeIsDark}
                  bind:value={strategySelect}
                >
                  {#if user.publicWebhookConns}
                    {#each user.publicWebhookConns as w}
                      <option value={w.KEY}>{w.Name}</option>
                    {/each}
                  {/if}
                  <!-- keep this option outside #each to allow custom strategy definition -->
                  <option value="custom">Create my own webhook URL</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="mb-3">
                <label for="accSize" class="form-label"
                  >Account Size to Trade (%)</label
                >
                <input
                  required="required"
                  type="number"
                  step=".01"
                  class="form-control"
                  class:dark={appThemeIsDark}
                  id="accSize"
                  placeholder="20"
                  bind:value={accSizePerc}
                />
              </div>
              <div class="mb-3">
                <label for="accRisk" class="form-label"
                  >Account Risked per Trade (%)</label
                >
                <input
                  required="required"
                  type="number"
                  step=".01"
                  class="form-control"
                  class:dark={appThemeIsDark}
                  id="accRisk"
                  placeholder="1.5"
                  bind:value={accRiskPerc}
                />
              </div>
            </div>
            <div class="col-6">
              <div class="mb-3">
                <label for="leverage" class="form-label">Leverage (x)</label>
                <input
                  required="required"
                  type="number"
                  class="form-control"
                  class:dark={appThemeIsDark}
                  id="leverage"
                  placeholder="10"
                  bind:value={leverage}
                />
              </div>
              <div class="mb-3">
                <label for="area" class="form-label">Exchange</label>
                <!-- input below supposed to be a dropdown -->
                <input
                  required="required"
                  type="text"
                  class="form-control"
                  class:dark={appThemeIsDark}
                  id="area"
                  placeholder="000000000"
                  bind:value={exchange}
                />
              </div>
            </div>
          </div>
          <div class="btn-row">
            <button type="submit" class:dark={appThemeIsDark}>Add Bot</button>
          </div>
          <div style={addedAlert}>
            <p>Bot Added</p>
          </div>
        </form>
      </div>
    </div>
    <div class="col-sm-12 col-md-1" />
    <hr />
  </div>
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

  div.container {
    text-align: center;
    padding-bottom: 4rem;
  }

  #head {
    margin-bottom: 2rem;
  }

  #fields-box {
    padding: 0 4rem;
    text-align: left;
  }

  .form-check {
    margin: 0.75rem 0.5rem;

    label {
      // padding-left: 0.5rem;
    }
  }

  .btn-row {
    text-align: center;
  }

  button {
    margin-bottom: 1rem;
  }
</style>
