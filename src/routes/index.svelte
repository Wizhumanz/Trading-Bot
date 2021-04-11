<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { storeUser, storeAppTheme } from "../../store.js";
  import axios from "axios";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  //global variables
  let showAlert = "display: none;"; //to display invalid auth msg
  let loading = false;
  let appThemeIsDark = true;

  //only for user login
  let userLogin = {
    email: "",
    password: "",
  };

  //user properties
  let user = {
    id: "",
    email: "",
    password: "",
    bots: [],
    trades: [],
    exchanges: [],
    publicWebhookConns: [],
    privateWebhookConns: [],
  };

  onMount(() => {
    //if user already logged in, go straight to active bots
    user = storeUser;
    if (user.bots && user.bots.length > 0) {
      if (typeof window !== "undefined") {
        goto("/bots/active");
      }
    }
  });

  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
    console.log(appThemeIsDark);
  });

  //helper functions
  function getBots() {
    return new Promise((resolve, reject) => {
      //auth header
      const hds = {
        // "Content-Type": "application/json",
        Authorization: userLogin.password,
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
          resolve(res.data);
        })
        .catch((error) => console.log(error));
    });
  }

  function getAllWebhookConnections() {
    // get all webhook connections
    const hds = {
      //"Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
    axios
      .get("https://ana-api.myika.co/webhooks", {
        headers: hds,
        mode: "cors",
      })
      .then((res) => {
        user.publicWebhookConns = res.data;
        storeUser.set(JSON.stringify(user));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //handler functions
  function signIn(e) {
    loading = true;

    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
    axios
      .post("https://ana-api.myika.co/login", {
        headers: hds,
        email: userLogin.email,
        password: userLogin.password,
        mode: "cors",
      })
      .then((res) => {
        user.id = res.data.body;
        user.email = userLogin.email;
        user.password = userLogin.password;
        //wait for fetch to complete before needed page reload
        getBots().then((res) => {
          loading = false;
          //assign properties to user
          user.bots = res;
          if (user.bots !== null) {
            user.bots.reverse(); //to display most recent bots at top of list
          }

          storeUser.set(JSON.stringify(user));
          loading = false;
          goto("/bots/active");
          getAllWebhookConnections();
        });
      })
      .catch((error) => {
        console.log(error.response);
        loading = false;
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
          <button type="submit" id="signInBtn">Sign In</button>
          <a class="register" href="/register">Register</a>
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

  a.register {
    color: $cream;
    font-family: $title-font;
    text-decoration: underline;
    margin-left: 0.75rem;
  }
</style>
