<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { storeUser, storeAppTheme } from "../../store.js";
  import axios from "axios";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  //global variables
  let appThemeIsDark;
  let user = {};
  let showAlert = "display: none;"; //to display invalid auth msg
  let loading = false;
  let displayPricePeriodToggle = true;
  let userLogin = { email: "", password: "" };
  let url = "https://ana-api.myika.co";

  //user properties
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  onMount(() => {
    //if user already logged in, go straight to active bots
    if (user && user.id) {
      if (typeof window !== "undefined") {
        goto("/bots/active");
      }
    }
  });

  function header(auth) {
    if (auth) {
      return {
        // "Content-Type": "application/json",
        Authorization: user.password,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      };
    } else {
      return {
        // "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      };
    }
  }

  //helper functions
  function getBots() {
    return new Promise((resolve, reject) => {
      //MUST replace all '+' with '%2B'
      // let GETUrl = basicURL.split("+").join("%2B");
      axios
        .get(url + "/bots?user=" + user.id, {
          headers: header(true),
          mode: "cors",
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => console.log(error));
    });
  }

  function getAllWebhookConnections() {
    axios
      .get(url + "/webhooks", {
        headers: header(false),
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

  function getTradeAction() {
    axios
      .get(url + "/trades?user=" + user.id, {
        headers: header(true),
        mode: "cors",
      })
      .then((res) => {
        user.trades = res.data;
        storeUser.set(JSON.stringify(user));
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  function getExchangeConnection() {
    axios
      .get(url + "/exchanges?user=" + user.id, {
        headers: header(true),
        mode: "cors",
      })
      .then((res) => {
        user.exchanges = res.data;
        storeUser.set(JSON.stringify(user));
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  //handler functions
  function signIn(e) {
    console.log("signed in")
    loading = true;
    axios
      .post(url + "/login", {
        headers: header(false),
        email: userLogin.email,
        password: userLogin.password,
        mode: "cors",
      })
      .then((res) => {
        user.id = res.data.body;
        user.email = userLogin.email;
        user.password = userLogin.password;
        getUser().then((res) => {
          if (res.cancellation === false) {
            //wait for fetch to complete before needed page reload
            getBots().then((res) => {
              console.log(res)
              loading = false;
              user.allBots = res;
              if (res !== null) {
                user.bots = res.filter((b) => {
                  return b.IsArchived !== "true";
                });
              
                if (user.bots !== null) {
                  user.bots.reverse(); //to display most recent bots at top of list
                }
            }
              storeUser.set(JSON.stringify(user));
              getAllWebhookConnections();
              getTradeAction();
              getExchangeConnection();
              goto("/bots/active");
            });
          } else {
            loading = false;
            showAlert = "display: block;";
          }
        });
      })
      .catch((error) => {
        console.log(error.response);
        loading = false;
        showAlert = "display: block;";
      });
  }

  function getUser() {
    return new Promise((resolve, reject) => {
    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0"
    };
    axios
      .get("http://localhost:8000/getUser?email=" + user.email, {
        headers: hds,
        mode: "cors",
      })
      .then((res) => {
        resolve(res.data[0])
      })
      .catch((error) => console.log(error));
    })
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
    Log In
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
        <h1>World's Best<br />Trading Bot Platform</h1>
        <button>Sign Me Up</button>
      
        <p class="headerP">
          <span class="strikethrough">$229</span>
          <!-- svelte-ignore a11y-missing-attribute -->
          <a class="pricingLink"> $99 </a>
          /month
          <br />Pre-launch offer!
        </p>
      </div>
      <h2><i class="bi bi-chevron-double-down" /></h2>
    </div>

    <!-- main feature -->
    <div class="row clean display">
      <div class="col-sm-12 col-md-5">
        <div class="feature">
          <h1>Why are we the best?</h1>
          <p>
            Control all the necessary settings you need for serious trading. <br>
            Risk management: Check. 
            <br />
          </p>
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <div class="main-box">
          <!-- mock bot controls -->
          <div class="row">
            <div class="col-sm-12 col-lg-4 mockStatusCol">
              <h4>EMA Scalp Bot</h4>
              <div class="statusDiv">
                <h4>ACTIVE</h4>
                <button> Abort </button>
              </div>
            </div>
            <div class="col-sm-12 col-lg-8 settings-col">
              <div class="settingsDisplayBox">
                <div class="row">
                  <div class="col-7">Ticker</div>
                  <div class="col-5 val-col">BTC/USDT</div>
                </div>
                <div class="row">
                  <div class="col-7">Account % used</div>
                  <div class="col-5 val-col">35%</div>
                </div>
                <div class="row">
                  <div class="col-7">Account % risked per trade</div>
                  <div class="col-5 val-col">1.5%</div>
                </div>
                <div class="row">
                  <div class="col-7">Leverage</div>
                  <div class="col-5 val-col">12x</div>
                </div>
                <div class="displayOnlyFields">
                  <!-- display-only fields -->
                  <div class="display-fields">
                    <div class="row">
                      <div class="col-7">Exchange</div>
                      <div class="col-5 lowkey-val-col">Binance 3</div>
                    </div>
                    <div class="row">
                      <div class="col-7">Webhook</div>
                      <div class="col-5 lowkey-val-col urlDisplay">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <a>A65-45m EMA Cross</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-1" />
    </div>

    <!-- text features -->
    <div class="row display colored">
      <!-- one column of features -->
      <div class="col-6">
        <!-- one feature -->
        <div class="row feature-li">
          <div class="col-3 icon-col">
            <h1><i class="bi bi-check" /></h1>
          </div>
          <div class="col-9">
            <h1 class="highlight">No code required</h1>
          </div>
        </div>
        <div class="row feature-li">
          <div class="col-3 icon-col">
            <h1><i class="bi bi-check" /></h1>
          </div>
          <div class="col-9">
            <h1>Plug n' play strategies</h1>
          </div>
        </div>
        <div class="row feature-li">
          <div class="col-3 icon-col">
            <h1><i class="bi bi-check" /></h1>
          </div>
          <div class="col-9">
            <h1>Pro risk management</h1>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="row feature-li">
          <div class="col-3 icon-col">
            <h1><i class="bi bi-check" /></h1>
          </div>
          <div class="col-9">
            <h1>Fully autonomous</h1>
          </div>
        </div>
        <div class="row feature-li">
          <div class="col-3 icon-col">
            <h1><i class="bi bi-check" /></h1>
          </div>
          <div class="col-9">
            <h1 class="highlight">No custodianship</h1>
          </div>
        </div>
        <div class="row feature-li">
          <div class="col-3 icon-col">
            <h1><i class="bi bi-check" /></h1>
          </div>
          <div class="col-9">
            <h1>Built + tested by pro traders</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="row display red">
      <h1>Keep your own money.</h1>
      <p>
        Just input your exchange API keys to connect bots.
        <br />No deposits required.
      </p>
    </div>

    <div class="row display thin">
      <div class="col-sm-12 col-lg-6">
        <div class="profile-card">
          <h1>Simon Jeong</h1>
          <p>
            Simon's passions in life include neuroscience, AI, and bread
            blending.
          </p>
        </div>
      </div>
      <div class="col-sm-12 col-lg-6">
        <div class="profile-card">
          <h1>Mika Yeap</h1>
          <p>
            Backend engineer at work, designer at heart. Mika spends most of his
            time cleaning up Simon's code.
          </p>
        </div>
      </div>
    </div>
    <div class="row display black">
      <div class="col-sm-1 col-md-4" />
      <div class="col-sm-10 col-md-4">
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- <a class="pricingLink" class:dark={appThemeIsDark}>
          Pre-launch deal!
        </a> -->
        <div class="center card">
          <div class="priceTag">
            <h4 class="dollarSign">
              $
              {#if displayPricePeriodToggle}
                <span class="strikethrough">169</span>
              {:else}
                <span class="strikethrough">229</span>
              {/if}
            </h4>
            <h1>
              {#if displayPricePeriodToggle}
                99
              {:else}
                149
              {/if}
            </h1>
            <h4>/mo</h4>
          </div>
          <div class="feature-list">
            <div class="feature-li display-li">
              <h3><i class="bi bi-check2" /><span />No code required</h3>
            </div>
            <div class="feature-li">
              <h3>
                <i class="bi bi-check2" /><span />Custom TradingView webhooks
              </h3>
            </div>
            <div class="feature-li">
              <h3><i class="bi bi-check2" /><span />Fully autonomous</h3>
            </div>
            <div class="feature-li">
              <h3>
                <i class="bi bi-check2" /><span />Realtime dashboard
              </h3>
            </div>
            <div class="feature-li">
              <h3><i class="bi bi-check2" /><span />No trading fees</h3>
            </div>
          </div>
        </div>
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            id="pricePeriodToggle"
            bind:checked={displayPricePeriodToggle}
          />
          <label class="form-check-label" for="flexSwitchCheckChecked"
            ><h5>Biannual billing</h5></label
          >
        </div>
        <div class="center">
          <button>I want this deal.</button>
        </div>
      </div>
      <div class="col-sm-1 col-md-4" />
    </div>
  </div>
</main>

<style type="text/scss">
  @import "../../static/styles/_all";

  #hiddenSignIn {
    z-index: 100;
    font-family: $body-font;
    position: absolute;
    right: 1%;
    color: $cream;
  }

  #hiddenSignIn:hover {
    color: $cream;
  }

  .container-fluid {
    background-color: white;
    padding: 0;
    overflow-x: hidden;

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

    h2 {
      position: absolute;
      bottom: 1%;
      width: 100%;
      text-align: center;
    }
  }

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
      margin-top: 2.5rem;
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

  .row.display {
    padding: 5rem 2rem 4rem 2rem;
    text-align: center;
    background-color: white;
    color: black;

    p {
      font-size: x-large;
    }
  }

  .row.clean {
    padding: 5rem 2rem 4rem 4rem;
    background-color: white;

    .feature {
      width: 70%;
      margin: auto;
      text-align: left;

      h1 {
        color: $blue;
      }
    }
  }

  .row.colored {
    background-color: $blue;
    color: $ivory;
    text-align: left;
  }

  .row.thin {
    padding-top: 2rem;
  }

  .row.black {
    background-color: black;
    color: $ivory;
  }

  .feature-li {
    margin: 0.75rem;
  }

  .feature-li.display {
    margin: 0.5rem;
  }

  .icon-col {
    text-align: right;
  }

  .highlight {
    width: fit-content;
    background-color: $blood;
  }

  .row.red {
    h1 {
      margin-bottom: 1rem;
      font-size: 3rem;
      color: $blood;
    }
  }

  .profile-card {
    width: 80%;
    margin: auto;
    text-align: left;
    background-color: black;
    color: $ivory;
    border-radius: 10px;
    padding: 4rem 5rem;
  }

  .center.card {
    margin-top: 0.5rem;
    padding: 2.5rem 4.5rem 6.5rem 4.5rem;
    border: $cream 3px solid;
    border-radius: 15px;

    background: rgb(138, 0, 0);
    background: linear-gradient(
      142deg,
      rgba(138, 0, 0, 1) 0%,
      rgba(0, 27, 107, 1) 100%
    );
  }

  .priceTag {
    margin-bottom: 0.75rem;

    h1,
    h4 {
      display: inline;
    }
    .dollarSign {
      height: fit-content;
      vertical-align: top;
      font-size: 3rem;
    }
    h1 {
      font-size: 7rem;
    }

    span {
      color: gold;
      border-color: red;
    }
  }

  .feature-list {
    text-align: left;
    width: fit-content;
    margin: auto;

    //spacer
    span {
      margin: auto 0.4rem;
    }
  }

  .form-switch {
    margin: 1.5rem 0;
    width: 270px;
    vertical-align: middle;

    input {
      height: 25px;
      width: 40px;
      margin-top: 0;
      margin-right: 0;
    }

    label {
      h5 {
        font-family: $body-font;
      }
    }
  }

  #pricePeriodToggle {
    background-color: gray;
    border: none;
  }

  #pricePeriodToggle:checked {
    background-color: $blue;
  }

  // mock bot controls

  .main-box {
    text-align: left;
    background-color: $blue;
    color: $ivory;
    border: none;
    border-radius: 10px;
    padding: 2.5rem 3.5rem 2rem 3rem;
    margin-bottom: 1rem;

    background: linear-gradient(40deg, $blue 50%, black 50%);
  }

  .mockStatusCol {
    text-align: left;
  }

  div.statusDiv {
    background-color: $cream;
    color: black;
    border-radius: 7px;

    text-align: center;
    margin: 0.75rem auto 1.5rem auto;
    padding: 1.25rem 1rem;

    button {
      font-size: larger;
      padding: 0.5rem 1rem;
      margin-top: 0;
      border-radius: 3px;
      border: none;
      color: $ivory;
      background-color: black;

      background-size: 100% 200%;
      background-image: linear-gradient(to bottom, black 50%, $blood 50%);
      -webkit-transition: background-position 0.5s;
      -moz-transition: background-position 0.5s;
      transition: background-position 0.5s;
    }

    button:hover {
      background-position: 0 -100%;
      color: $ivory;
    }
  }

  div.settings-col {
    hr {
      color: $cream;
    }
  }

  .settingsDisplayBox {
    font-family: $body-font;
    font-size: 1.3rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    margin-bottom: 2rem;
  }

  .displayOnlyFields {
    margin-top: 1rem;
  }

  .val-col {
    font-family: $body-font;
    font-size: 1.3rem;
  }

  .lowkey-val-col {
    font-family: $body-font;
    font-size: 1rem;
  }

  .display-fields {
    font-size: 1rem;
  }

  a {
    text-decoration: underline;
  }

  .urlDisplay {
    overflow: hidden;

    a {
      color: $ivory;
    }
    a:hover {
      color: $cream;
      text-decoration: underline;
    }
  }

  //payment process
  /* Variables */
  // body {
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   background: #242d60;
  //   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
  //     "Helvetica Neue", "Ubuntu", sans-serif;
  //   height: 100vh;
  //   margin: 0;
  //   -webkit-font-smoothing: antialiased;
  //   -moz-osx-font-smoothing: grayscale;
  // }
  // section {
  //   background: #ffffff;
  //   display: flex;
  //   flex-direction: column;
  //   width: 400px;
  //   height: 112px;
  //   border-radius: 6px;
  //   justify-content: space-between;
  // }
  .product {
    display: flex;
  }
  .description {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  // p {
  //   font-style: normal;
  //   font-weight: 500;
  //   font-size: 14px;
  //   line-height: 20px;
  //   letter-spacing: -0.154px;
  //   color: #242d60;
  //   height: 100%;
  //   width: 100%;
  //   padding: 0 20px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   box-sizing: border-box;
  // }
  img {
    border-radius: 6px;
    margin: 10px;
    width: 54px;
    height: 57px;
  }
  // h3,
  // h5 {
  //   font-style: normal;
  //   font-weight: 500;
  //   font-size: 14px;
  //   line-height: 20px;
  //   letter-spacing: -0.154px;
  //   color: #242d60;
  //   margin: 0;
  // }
  // h5 {
  //   opacity: 0.5;
  // }
  #checkout-button {
    height: 36px;
    background: #556cd6;
    color: white;
    width: 100%;
    font-size: 14px;
    border: 0;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.6;
    border-radius: 0 0 6px 6px;
    transition: all 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  }
  #checkout-button:hover {
    opacity: 0.8;
  }
</style>
