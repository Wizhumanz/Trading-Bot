<script>
  import { onMount } from "svelte";
  import { storeUser } from "../../store.js";
  import axios from "axios";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let bot;

  let user = {};
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  // component vars
  let loading = false;
  let newRiskPerc;
  let newAccSizePerc;
  let newLeverage;
  let active;
  let showSaveBtnAlert = "display: none;";
  let updateErrorAlert = "display: none;";

  $: if (
    parseFloat(newAccSizePerc) !== parseFloat(bot.AccountSizePercToTrade) ||
    parseFloat(newRiskPerc) !== parseFloat(bot.AccountRiskPercPerTrade) ||
    parseFloat(newLeverage) !== parseFloat(bot.Leverage)
  ) {
    showSaveBtnAlert = "display: block;";
  } else {
    showSaveBtnAlert = "display: none;";
  }

  function toggleBotStatus() {
    loading = true;
    bot.IsActive = !bot.IsActive;

    updateBot();
  }

  //TEMP sample only
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
    console.log(bot);
    console.log(data);
    console.log(user.bots);

    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: "trader",
    };
    axios
      .put(
        "http://localhost:8000/bot/" +
          bot.AggregateID +
          "?user=5632499082330112",
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

        //resetting the current state
        newRiskPerc = bot.AccountRiskPercPerTrade;
        newAccSizePerc = bot.AccountSizePercToTrade;
        newLeverage = bot.Leverage;
        active = bot.IsActive;
      })
      .catch((error) => {
        console.log(error.response);
        updateErrorAlert = "display: block;";
        loading = false;
      });
  };

  onMount(() => {
    newRiskPerc = bot.AccountRiskPercPerTrade;
    newAccSizePerc = bot.AccountSizePercToTrade;
    newLeverage = bot.Leverage;
    active = bot.IsActive;
  });
</script>

{#if loading}
  <LoadingIndicator />
{/if}

<div class="container-fluid" class:active>
  <div class="row">
    <div class="col-sm col-md-1" />
    <div class="col-sm col-md-10 main-box">
      <div class="row">
        <div class="col-7"><h4>Name</h4></div>
        <div class="col-5 val-col">
          {bot.AccountRiskPercPerTrade}
        </div>
        {#if parseFloat(newRiskPerc) !== parseFloat(bot.AccountRiskPercPerTrade) && newRiskPerc !== null}
          <p class="changeVal">=> {bot.AccountRiskPercPerTrade} UNSAVED</p>
        {/if}
      </div>
      <div class="mb-3">
        <input
          type="text"
          class="form-control"
          id="exchangeName"
          bind:value={bot.AccountRiskPercPerTrade}
        />
      </div>
      <div class="row">
        <div class="col-7"><h4>API Key</h4></div>
        <div class="col-5 val-col">
          {bot.Leverage}
        </div>
        {#if parseInt(newLeverage) !== parseInt(bot.Leverage) && newLeverage !== null}
          <p class="changeVal">=> {bot.Leverage} UNSAVED</p>
        {/if}
      </div>
      <div class="mb-3">
        <input
          type="text"
          class="form-control"
          id="apiKey"
          bind:value={bot.Leverage}
        />
      </div>

      <button class="save-btn" style={showSaveBtnAlert} on:click={updateBot}
        >Save</button
      >
    </div>
    <div class="col-sm col-md-1" />
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

  div.main-box {
    border: $blood 3px dotted;
    border-radius: 5px;
    padding: 1.5rem;
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

  .mb-3 {
    margin-top: 0.5rem;
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
</style>
