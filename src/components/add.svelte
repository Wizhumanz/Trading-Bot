<script>
  import axios from "axios";
  import { storeUser } from "../../store.js";
  import LoadingIndicator from "./LoadingIndicator.svelte";

  let loading = false;
  let addedAlert = "display: none;";

  let user = {};
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });
  let newTicker;
  let botName;
  let accSizePerc;
  let accRiskPerc;
  let leverage;
  let exchange;

  function addBotHandler() {
    loading = true;
    // TEMP FAKE CALL - delete when making actual API call
    // setTimeout(() => {
    //   loading = false;
    // }, 1500);
    // return;
    // TEMP FAKE CALL
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
    };

    axios
      .post("https://ana-api.myika.co/bot", data, {
        headers: hds,
      })
      .then((res) => {
        loading = false;
        addedAlert = "display: block;";
        console.log(res.status + " -- " + JSON.stringify(res.data));
        user.bots.push(data);
        storeUser.set(JSON.stringify(user));

        newTicker = "";
        botName = "";
        accSizePerc = 0;
        accRiskPerc = 0;
        leverage = 0;
        exchange = "";

        setTimeout(() => {
          addedAlert = "display: none;";
        }, 7000);
      })
      .catch((error) => {
        loading = false;
        console.log(error.response);
      });
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
              id="botName"
              placeholder="Long Bot"
              bind:value={botName}
            />
          </div>
          <div class="mb-3">
            <label for="ticker" class="form-label">Ticker</label>
            <input
              required="required"
              type="text"
              class="form-control"
              id="ticker"
              placeholder="BTC/USDT"
              bind:value={newTicker}
            />
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
                  id="area"
                  placeholder="000000000"
                  bind:value={exchange}
                />
              </div>
            </div>
          </div>
          <div>
            <button type="submit">Add Bot</button>
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

  select {
    font-family: $body-font;
    background-color: $ivory;
    border: $blood 1px dashed;
  }

  .form-check {
    margin: 0.75rem 0.5rem;

    label {
      // padding-left: 0.5rem;
    }
  }

  button {
    margin-bottom: 1rem;
  }

  #excel-upload {
    margin: 5rem auto;
  }
</style>
