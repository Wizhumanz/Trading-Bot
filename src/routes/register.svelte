<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { storeUser, storeAppTheme } from "../../store.js";
  import axios from "axios";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  //global variables
  let appThemeIsDark;
  let showAlert = "display: none;"; //to display invalid auth msg
  let loading = false;
  let url = "http://localhost:8000"

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

  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });
  
  onMount(() => {
    //if user already logged in, go straight to active bots
    user = storeUser;
    if (user.bots && user.bots.length > 0) {
      if (typeof window !== "undefined") {
        goto("/bots/active");
      }
    }
  });

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
      .post(url + "/user", newUser, {
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
      <div class="col-sm-2 col-md-3 col-lg-4" />
      <div class="col-sm-8 col-md-6 col-lg-4">
        <div style={showAlert}>
          <p>An error occured.</p>
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
      <div class="col-sm-2 col-md-3 col-lg-4" />
    </div>
  </div>
</main>

<style type="text/scss">
  @import "../../static/styles/_all";

  .container-fluid {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
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
