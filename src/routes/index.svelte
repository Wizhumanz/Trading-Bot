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

  <div class="container-fluid" class:dark={appThemeIsDark}>
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

    <!-- landing page -->
    <ul class="cb-slideshow">
      <li>
        <span>Image 01</span>
        <div>
          <h3>re·lax·a·tion</h3>
        </div>
      </li>
      <li>
        <span>Image 02</span>
        <div>
          <h3>re·lax·a·tion2</h3>
        </div>
      </li>
      <li>
        <span>Image 03</span>
        <div>
          <h3>re·lax·a·tion3</h3>
        </div>
      </li>
      <li>
        <span>Image 04</span>
        <div>
          <h3>re·lax·a·tion4</h3>
        </div>
      </li>
      <li>
        <span>Image 05</span>
        <div>
          <h3>re·lax·a·tion5</h3>
        </div>
      </li>
      <li>
        <span>Image 06</span>
        <div>
          <h3>re·lax·a·tion6</h3>
        </div>
      </li>
    </ul>

    <!-- <div class="row banner">
      <h1 class="center">The best trading bot platform<br />in the world.</h1>
    </div> -->
  </div>
</main>

<style type="text/scss">
  @import "../../static/styles/_all";

  #hiddenSignIn {
    font-family: $body-font;
    position: absolute;
    right: 1%;
    top: 0;
  }

  #hiddenSignIn:hover {
    color: $blood;
  }

  .container-fluid {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
    height: 100%;
    position: fixed;
    background-color: white;
  }

  .container-fluid.dark {
    background-color: black;
  }

  div.row.signIn {
    margin-top: 1.5rem;
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

  .cb-slideshow,
  .cb-slideshow:after {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 0;
  }
  .cb-slideshow:after {
    content: "";
    background: transparent
      url(https://upload.wikimedia.org/wikipedia/commons/e/e1/Alexander_the_Great_mosaic.jpg)
      repeat top left;
  }

  .cb-slideshow li span {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    color: transparent;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: none;
    opacity: 0;
    z-index: 0;
    animation: imageAnimation 36s linear infinite 0s;
  }

  .cb-slideshow li:nth-child(1) span {
    background-image: url(https://lh3.googleusercontent.com/proxy/B5xHjGT2wZnlXtx_AIfZH7Ly6hk_e-AN-pwu5xHQ1qBEuS9NNFVthtFWaUdbwfApPelVE5KRsNO0s0ardxmnCBvVTYOusvujPg-pNBuHVmFa5_dUfpeE5dB_tGE1EVD8SnrBQYSMAJguHctuT7SjaBTJEiNNSg);
  }
  .cb-slideshow li:nth-child(2) span {
    background-image: url(https://i.pinimg.com/originals/91/63/f7/9163f74d49ef8a277977a4ad045d81ae.jpg);
    animation-delay: 6s;
  }
  .cb-slideshow li:nth-child(3) span {
    background-image: url(https://i.pinimg.com/originals/50/98/86/5098866589940e3d320a0c23c6ee95b6.jpg);
    animation-delay: 12s;
  }
  .cb-slideshow li:nth-child(4) span {
    background-image: url(https://cdn3.vectorstock.com/i/1000x1000/42/92/ancient-greek-goddess-aphrodite-vector-18294292.jpg);
    animation-delay: 18s;
  }
  .cb-slideshow li:nth-child(5) span {
    background-image: url(https://lh3.googleusercontent.com/proxy/B5xHjGT2wZnlXtx_AIfZH7Ly6hk_e-AN-pwu5xHQ1qBEuS9NNFVthtFWaUdbwfApPelVE5KRsNO0s0ardxmnCBvVTYOusvujPg-pNBuHVmFa5_dUfpeE5dB_tGE1EVD8SnrBQYSMAJguHctuT7SjaBTJEiNNSg);
    animation-delay: 24s;
  }
  .cb-slideshow li:nth-child(6) span {
    background-image: url(https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/palekh-box-traditional-russian-lacquer-work-detail-russian-school.jpg);
    animation-delay: 30s;
  }

  .cb-slideshow li:nth-child(2) div {
    animation-delay: 6s;
  }
  .cb-slideshow li:nth-child(3) div {
    animation-delay: 12s;
  }
  .cb-slideshow li:nth-child(4) div {
    animation-delay: 18s;
  }
  .cb-slideshow li:nth-child(5) div {
    animation-delay: 24s;
  }
  .cb-slideshow li:nth-child(6) div {
    animation-delay: 30s;
  }

  @keyframes imageAnimation {
    0% {
      opacity: 0;
      animation-timing-function: ease-in;
    }
    8% {
      opacity: 1;
      animation-timing-function: ease-out;
    }
    17% {
      opacity: 1;
    }
    25% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  .row.banner {
  }

  .center {
    text-align: center;
    width: fit-content;
    margin: 3rem auto;
  }
</style>
