<script>
  import { goto } from "@sapper/app";
  import { storeUser } from "../../store.js";
  // import axios from "axios";
  import LoadingIndicator from '../components/LoadingIndicator.svelte'

  // global vars

  let user = {
    id: "",
    password: "",
    bots: [
      {isActive: "true", leverage: 45, accRiskPerc: 34.5},
      {isActive: "true", leverage: 24, accRiskPerc: 12.5},
      {isActive: "false", leverage: 80, accRiskPerc: 3}
    ],
  };

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
        <p>DEBUG NOTE: Just click Sign In button with empty inputs to mock sign in.</p>
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
  </div>
</main>

<style type="text/scss">
  @import "../../static/styles/_all";

  div.row.signIn {
    margin-top: 1.5rem;
  }
</style>
