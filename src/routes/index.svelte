<script>
  import { goto } from "@sapper/app";
  import { storeUser } from "../../store.js";
  // import axios from "axios";
  import LoadingIndicator from '../components/LoadingIndicator.svelte'

  // global vars

  let user = {
    id: "",
    password: "",
    bots: [],
  };

  // component vars

  let botStatus = false;
  let riskPerc = 1;
  let newRiskPerc = riskPerc;
  let leverage = 1;

  //only for user login
  let userLogin = {
    email: "",
    password: "",
  };

  let showAlert = "display: none;"; //to display invalid auth msg
  let loading = false;

  function toggleBotStatus() {
    botStatus = !botStatus;
  }

  function signIn(e) {
    // TEMP FAKE LOGIN
    loading = true;
    setTimeout(() => {
      loading = false;
      user.id = userLogin.email;
      storeUser.set(JSON.stringify(user));
      goto("/bots/active");
    }, 2000);
    return;
    // TEMP FAKE LOGIN

    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
    axios
      .post("https://anastasia-api.myika.co/login", {
        headers: hds,
        email: userLogin.email,
        password: userLogin.password,
      })
      .then((res) => {
        user.id = userLogin.email;
        user.password = userLogin.password;
        //wait for fetch to complete before needed page reload
        getListings(false).then((res) => {
          loading = false;
          goto("/listings/all");
          //document.location.reload();
        });
      })
      .catch((error) => {
        console.log(error);
        showAlert = "display: block;";
      });
  }
</script>

<main>
  {#if loading}
    <LoadingIndicator />
  {/if}

  <div class="container-fluid">
    <div class="row signIn">
      <div class="col-2" />
      <div class="col-8">
        <!-- Sign In tab -->
        <div style={showAlert}>
          <p>Incorrect Login Details</p>
        </div>
        <form class="form" on:submit|preventDefault={signIn}>
          <div class="mb-3">
            <label for="emailLogin" class="form-label"> Email</label>
            <input
              type="email"
              class="form-control"
              id="emailLogin"
              placeholder="name@agency.com"
              bind:value={userLogin.email}
            />
          </div>
          <div class="mb-3">
            <label for="passwordLogin" class="form-label"> Password</label>
            <input
              type="password"
              class="form-control"
              id="passwordLogin"
              placeholder="password"
              bind:value={userLogin.password}
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div class="col-2" />
    </div>

    <div class="row main">
      <div class="col-sm-2 col-md-3" />
      <div class="col-sm-8 col-md-6 main-box" style="padding: 2rem;">
        <div class="red">
          {#if botStatus}
            <p>LIVE</p>
          {:else}
            <p>INACTIVE</p>
          {/if}

          <button
            on:click={toggleBotStatus}
            type="button"
            class="btn blood-btn"
          >
            {botStatus ? "Shut Down" : "Activate"}
          </button>
        </div>

        <!-- TODO: loop through array of new + original vals	 -->
        <p>Account risked per trade = {riskPerc}%</p>
        {#if newRiskPerc !== riskPerc && newRiskPerc !== null}
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
  </div>
</main>

<style type="text/scss">
  @import "../../static/styles/_all";

  div.row.signIn {
    margin-top: 1.5rem;
  }

  div.red {
    border: $blood 3px solid;
    border-radius: 3px;
    color: $ivory;
    text-align: center;
    margin: 1.5em auto 1.5em auto;
    padding: 1.5rem;
  }

  p.changeVal {
    color: red;
  }
</style>
