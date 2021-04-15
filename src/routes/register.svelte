<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { storeUser, storeAppTheme } from "../../store.js";
  import axios from "axios";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  //global variables
  let appThemeIsDark;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  let showAlert = "display: none;"; //to display invalid auth msg
  let loading = false;

  //only for user login
  let userRegister = {
    name: "",
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

  //helper functions
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
          resolve(res.data);
        })
        .catch((error) => console.log(error));
    });
  }

  //handler functions
  function registerUser(e) {
    loading = true;

    let newUser = {
      name: userRegister.name,
      email: userRegister.email,
      password: userRegister.password,
    };

    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
    axios
      .post("https://ana-api.myika.co/user", newUser, {
        headers: hds,
        mode: "cors",
      })
      .then((res) => {
        user.id = res.data.body;
        user.email = userRegister.email;
        user.password = userRegister.password;
        //wait for fetch to complete before needed page reload
        storeUser.set(JSON.stringify(user));
        loading = false;
        goto("/bots/active");
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

  <div class="container-fluid" class:dark={appThemeIsDark}>
    <h1>
      <a href="/" class="pageNav"
        ><i class="bi bi-arrow-left-circle pageNav" /></a
      >Register Now
    </h1>
    <div class="row signIn">
      <div class="col-2" />
      <div class="col-8">
        <!-- Sign In tab -->
        <div style={showAlert}>
          <p>Incorrect Login Details</p>
        </div>
        <form class="form" on:submit|preventDefault={registerUser}>
          <div class="mb-3">
            <label for="nameInput" class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              class:dark={appThemeIsDark}
              id="nameInput"
              placeholder="Trader Joe"
              bind:value={userRegister.name}
            />
          </div>
          <div class="mb-3">
            <label for="emailInput" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              class:dark={appThemeIsDark}
              id="emailInput"
              placeholder="mika@stonks.com"
              bind:value={userRegister.email}
            />
          </div>
          <div class="mb-3">
            <label for="passInput" class="form-label"> Password</label>
            <input
              type="password"
              class="form-control"
              class:dark={appThemeIsDark}
              id="passInput"
              placeholder="$$$$$$"
              bind:value={userRegister.password}
            />
          </div>
          <div class="mb-3">
            <button type="submit" class:dark={appThemeIsDark}>Register</button>
          </div>
        </form>
      </div>
      <div class="col-2" />
    </div>
  </div>
</main>

<style type="text/scss">
  @import "../../static/styles/_all";

  .container-fluid {
    height: 100%;
    position: fixed;
    background-color: white;
    text-align: center;

    h1 {
      margin-top: 0.75rem;
    }
  }

  .container-fluid.dark {
    background-color: black;
  }

  .mb-3 {
    text-align: left;
  }

  div.row.signIn {
    margin-top: 1.5rem;
  }
</style>
