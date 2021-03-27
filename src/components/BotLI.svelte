<script>
  import { onMount } from "svelte";
  import { storeUser } from "../../store.js";
  import axios from "axios";

  export let id;
  export let bot;

  // component vars

  let newRiskPerc;
  let newAccSizePerc;
  let newLeverage;
  let active;

  function toggleBotStatus() {
    bot.IsActive = !bot.IsActive;
  }

  //TEMP sample only
  const addListing = () => {
    showEdit = false;
    let listingSubstitute = { ...listing };
    listingSubstitute.name = null;
    listingSubstitute.isPublic = listing.isPublic.toString();
    listingSubstitute.isPending = listing.isPending.toString();
    listingSubstitute.isCompleted = listing.isCompleted.toString();
    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      auth: "agent",
    };
    axios
      .put(
        "https://anastasia-api.myika.co/listing/" +
          listing.name.replaceAll(" ", "+") +
          id,
        JSON.stringify(listingSubstitute),
        {
          headers: hds,
        }
      )
      .then((res) => {
        console.log(res.status + " -- " + JSON.stringify(res.data));

        // console.log("Before" + JSON.stringify(user.listings))
        let storeListings = [];
        user.listings.forEach((l) => {
          if (l.name == listing.name) {
            storeListings.push(listing);
          } else {
            storeListings.push(l);
          }
        });
        user.listings = storeListings;
        storeUser.set(JSON.stringify(user));
      })
      .catch((error) => console.log(error.response));
  };

  onMount(() => {
    newRiskPerc = bot.AccountRiskPercPerTrade;
    newAccSizePerc = bot.AccountSizePercToTrade;
    newLeverage = bot.Leverage;
    active = bot.IsActive;
    console.log(bot.AccountRiskPercPerTrade);
    console.log(bot.AccountSizePercToTrade);
    console.log(bot.Leverage);
    console.log(bot.IsActive);
    console.log(bot.Name);
  });
</script>

<div class="container-fluid" class:active>
  <div class="row">
    <div class="col-sm col-md-2" />
    <div class="col-sm-10 col-md-8 main-box">
      <div class="row">
        <div class="col-sm-12 col-lg-4">
          <p>{bot.Name}</p>
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
        </div>
        <div class="col-sm-12 col-lg-8 settings-col">
          <div class="row">
            <div class="col-7">% of account to trade</div>
            <div class="col-5 val-col">
              {bot.AccountSizePercToTrade}%
            </div>
            {#if newAccSizePerc !== bot.AccountSizePercToTrade && newAccSizePerc !== null}
              <p class="changeVal">=> {newAccSizePerc}% UNSAVED</p>
            {/if}
          </div>
          <div class="row">
            <div class="col-7">% of account risked per trade</div>
            <div class="col-5 val-col">
              {bot.AccountRiskPercPerTrade}%
            </div>
            {#if newRiskPerc !== bot.AccountRiskPercPerTrade && newRiskPerc !== null}
              <p class="changeVal">=> {newRiskPerc}% UNSAVED</p>
            {/if}
          </div>
          <div class="row">
            <div class="col-7">Leverage</div>
            <div class="col-5 val-col">
              {bot.Leverage}x
            </div>
            {#if newLeverage !== bot.Leverage && newLeverage !== null}
              <p class="changeVal">=> {newLeverage}% UNSAVED</p>
            {/if}
          </div>
          <button
            class="save-btn"
            on:click={() => {
              console.log("bitch");
            }}>Save</button
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
              <div class="col-7">Webhook URL</div>
              <div class="col-5 lowkey-val-col">
                {bot.WebhookURL}
              </div>
            </div>
          </div>
          <hr />
          <!-- inputs -->
          <div class="form">
            <div class="mb-3">
              <label for="riskPerc" class="form-label">Risk % per trade</label>
              <input
                type="number"
                class="form-control"
                id="riskPerc"
                placeholder="20"
                bind:value={newRiskPerc}
              />
            </div>
            <div class="mb-3">
              <label for="leverage" class="form-label">Leverage</label>
              <input
                type="number"
                class="form-control"
                id="leverage"
                placeholder="5"
                bind:value={newLeverage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-1 col-md-2" />
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
    border: $blue 3px solid;
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
    color: red;
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
