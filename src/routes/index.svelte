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

  <a
    id="hiddenSignIn"
    data-bs-toggle="collapse"
    href="#signInCollapse"
    role="button"
    aria-expanded="false"
    aria-controls="signInCollapse"
  >
    войти
  </a>

  <div class="container-fluid" class:dark={appThemeIsDark}>
    <div class="collapse" id="signInCollapse">
      <div class="row signIn">
        <div class="col-sm-2 col-md-3 col-lg-4" />
        <div class="col-sm-8 col-md-6 col-lg-4">
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
                placeholder="ana@myika.co"
                class:dark={appThemeIsDark}
                bind:value={userLogin.email}
              />
            </div>
            <div class="mb-3">
              <label for="passwordLogin" class="form-label"> Password</label>
              <input
                type="password"
                class="form-control"
                id="passwordLogin"
                placeholder="g@iN$z"
                class:dark={appThemeIsDark}
                bind:value={userLogin.password}
              />
            </div>
            <button type="submit" class:dark={appThemeIsDark}>Sign In</button>
            <a class="register" href="/register" class:dark={appThemeIsDark}
              >Register</a
            >
          </form>
        </div>
        <div class="col-sm-2 col-md-3 col-lg-4" />
      </div>
    </div>
  </div>

  <!-- landing page -->
  <div class="container-fluid">
    <div class="row banner">
      <div class="center">
        <h1>The best trading bot platform<br />in the world.</h1>
        <button>Sign Me Up</button>
        <p>
          <s>$229</s>
          <span />
          <a href="/pricing" class="pricingLink" class:dark={appThemeIsDark}>
            $99
          </a>
          /month
          <br />Pre-launch offer!
        </p>
      </div>
      <h2><i class="bi bi-chevron-double-down" /></h2>
    </div>

    <div class="row">
      <div class="col-sm-12 col-md-5">
        <h1>What makes us so good?</h1>
        <p>
          Risk management: Fine bot controls for deploying world-class
          strategies.
        </p>
      </div>
      <div class="col-sm-12 col-md-7">
        <p>hdouijdijdiojiojediji idjiojdoijeiodjwoidje ijd28480dj0jjdi</p>
      </div>
    </div>
  </div>
</main>

<style type="text/scss">
  @import "../../static/styles/_all";

  #hiddenSignIn {
    z-index: 100;
    font-family: $body-font;
    font-size: xx-small;
    position: absolute;
    right: 1%;
    top: 8%;
    color: $blue;
  }

  #hiddenSignIn:hover {
    color: $cream;
  }

  .container-fluid {
    background-color: white;
    padding: 0;

    .row {
      padding: 0;
    }
  }

  .container-fluid.dark {
    background-color: black;
  }

  div.row.signIn {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  a.register {
    color: black;
    font-family: $title-font;
    text-decoration: underline;
    margin-left: 0.75rem;
  }

  a.register.dark {
    color: $cream;
  }

  .banner {
    z-index: 1;
    position: relative;
    padding: 0;
    margin: 0;
    height: 700px;
    width: 100%;
    vertical-align: middle;
    background-color: black;

    // background: linear-gradient(219deg, $blood, $blue);
    // background-size: 400% 400%;

    // -webkit-animation: AnimationName 6s ease infinite;
    // -moz-animation: AnimationName 6s ease infinite;
    // animation: AnimationName 6s ease infinite;

    h2 {
      position: absolute;
      bottom: 1%;
      width: 100%;
      text-align: center;
    }
  }

  // @-webkit-keyframes AnimationName {
  //   0% {
  //     background-position: 0% 67%;
  //   }
  //   10% {
  //     background-position: 100% 44%;
  //   }
  //   100% {
  //     background-position: 0% 67%;
  //   }
  // }
  // @-moz-keyframes AnimationName {
  //   0% {
  //     background-position: 0% 67%;
  //   }
  //   10% {
  //     background-position: 100% 44%;
  //   }
  //   100% {
  //     background-position: 0% 67%;
  //   }
  // }
  // @keyframes AnimationName {
  //   0% {
  //     background-position: 0% 67%;
  //   }
  //   10% {
  //     background-position: 100% 44%;
  //   }
  //   100% {
  //     background-position: 0% 67%;
  //   }
  // }

  .center {
    text-align: center;
    width: fit-content;
    margin: auto;

    h1 {
      font-size: 3.5rem;
      color: $ivory;
    }

    button {
      all: initial;
      all: unset;
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      font-family: $body-font;
      font-size: 1.5rem;
      border-radius: 7px;
      // border: $ivory 1px solid;
      background-color: $blood;
      color: $ivory;
      cursor: pointer;
    }

    p {
      margin-top: 0.75rem;
      span {
        margin-left: 0.2rem;
      }
    }
  }
</style>
