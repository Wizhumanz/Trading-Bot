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
  let newTicker;
  let botName;
  let strategySelect;
  let accSizePerc;
  let accRiskPerc;
  let leverage;
  let exchange;
  let customWebhookID;
  let user = {};
  user.publicWebhookConns = [];

  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  //helper functions
  function reassignProperties() {
    newTicker = "";
    botName = "";
    accSizePerc = null;
    accRiskPerc = null;
    leverage = null;
    exchange = "";
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
        .post("https://ana-api.myika.co/webhook" + "?user=" + user.id, null, {
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

  function getBots() {
    return new Promise((resolve, reject) => {
      //auth header
      const hds = {
        // "Content-Type": "application/json",
        Authorization: user.password,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      };

      //MUST replace all '+' with '%2B'
      // let GETUrl = basicURL.split("+").join("%2B");
      axios
        .get("https://ana-api.myika.co/bots" + "?user=" + user.id, {
          headers: hds,
          mode: "cors",
        })
        .then((res) => {
          console.log(res.data)
          resolve(res.data);
        })
        .catch((error) => console.log(error));
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
      Ticker: newTicker,
      WebhookConnectionID: strategySelect
    };

    if (strategySelect !== "custom") {
      axios
        .post("https://ana-api.myika.co/bot", data, {
          headers: hds,
          mode: "cors",
        })
        .then(() => {
          loading = false;
          addedAlert = "display: block;";
          // if (user.bots === null || user.bots === undefined) {
          //   user.bots = [data];
          // } else {
          //   user.bots.push(data);
          // }

          getBots().then((res) => {
            let hideIsArchived = [];
            res.forEach((b) => {
              if (b.IsArchived !== "true") {
                hideIsArchived.push(b);
              }
            });
            user.bots = hideIsArchived;
            if (user.bots !== null) {
              user.bots.reverse(); //to display most recent bots at top of list
            }
            storeUser.set(JSON.stringify(user));
          });
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
          .post("https://ana-api.myika.co/bot", data, {
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
          <div class="row">
            <div class="col-6">
              <div class="mb-3">
                <label for="ticker" class="form-label">Ticker</label>
                <input
                  required="required"
                  type="text"
                  class="form-control"
                  class:dark={appThemeIsDark}
                  id="ticker"
                  placeholder="BTC/USDT"
                  bind:value={newTicker}
                />
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
