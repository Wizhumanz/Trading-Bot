<script>
  import { storeUser } from "../../store.js";
  import axios from "axios";

  export let id;
  export let bot;

  // component vars

  let newRiskPerc = bot.accRiskPerc;
  let active = bot.isActive;

  function toggleBotStatus() {
    bot.isActive = !bot.isActive;
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
</script>

<div class="container-fluid" class:active>
  <div class="row main">
    <div class="col-sm-2 col-md-3" />
    <div class="col-sm-8 col-md-6 main-box" style="padding: 2rem;">
      <div class="red">
        {#if bot.isActive === "true" || bot.isActive === true}
          <p>LIVE</p>
        {:else}
          <p>INACTIVE</p>
        {/if}

        <button on:click={toggleBotStatus} type="button" class="btn blood-btn">
          {bot.isActive === "true" || bot.isActive === true ? "Shut Down" : "Activate"}
        </button>
      </div>

      <!-- TODO: loop through array of new + original vals	 -->
      <p>Account risked per trade = {bot.accRiskPerc}%</p>
      {#if newRiskPerc !== bot.accRiskPerc && newRiskPerc !== null}
        <p class="changeVal">=> {newRiskPerc}% UNSAVED</p>
      {/if}

      <p class="breaker">* * *</p>

      <h4 class="section-head">Settings Config</h4>
      <div class="form">
        <div class="mb-3">
          <label for="riskPerc" class="form-label"> Risk % per trade</label>
          <input
            type="number"
            class="form-control"
            id="riskPerc"
            placeholder="20"
            bind:value={newRiskPerc}
          />
        </div>
        <div class="mb-3">
          <label for="leverage" class="form-label"> Leverage</label>
          <input
            type="number"
            class="form-control"
            id="leverage"
            placeholder="5"
          />
        </div>
      </div>
    </div>
    <div class="col-sm-2 col-md-3" />
  </div>
  <hr />
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

  div.container-fluid {
    font-family: $body-font;
    margin: 1.5rem auto;
    text-align: left;
    border-radius: 3px;

    p {
      margin: 0;
    }
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

  .active {
    background-color: red;
  }
</style>
