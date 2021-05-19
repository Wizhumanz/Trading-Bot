<script>
  import { goto } from "@sapper/app";
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { storeUser, storeAppTheme, selectedGMT } from "../../store.js";
  import axios from "axios";

  //global vars
  let user = {};
  let appThemeIsDark = false;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  const { page } = stores();
  page.subscribe(({ path, params, query }) => {
    if (path === "/") {
      appThemeIsDark = true
    }
  });

  let selected = 0;
  var email = storeUser ? storeUser.email : null;
  var userID = storeUser ? storeUser.id : null;
  let socket;
  let displaySocketIsClosed = true;
  let wsConnLoading = false;
  $: selectedGMT.set(JSON.stringify(selected));
  let gmtLocales = {
    "-12": "Eniwetok, Kwaialein",
    "-11": "Midway Island, Samoa, New Zealand",
    "-10": "Hawaii, Honolulue",
    "-9": "Alaska",
    "-8": "Anchorage, San Francisco, Vancouver",
    "-7": "Alberta, Denver, Edmonton, Salt Lake City",
    "-6": "Chicago, Mexico City, Winnipeg",
    "-5": "Boston, Montreal, New York",
    "-4": "Caracas, Labrador",
    "-3": "Buenos Aires, Rio de Janeiro",
    "-2": "Mid-Atlantic",
    "-1": "Azores, Cape Verde",
    "0": "London",
    "1": "Amsterdam, Berlin, Warsaw",
    "2": "Cairo, Cape Town",
    "3": "Moscow, St. Petersburg, Riyadh",
    "4": "Abu Dhabi, Volgograd",
    "5": "New Delhi",
    "6": "Kathmandu, Sri Lanka",
    "7": "Bangkok, Hanoi, Jakarta",
    "8": "Penang, Singapore, Beijing, Perth",
    "9": "광주시 (경기도), Seoul, Yakutsk",
    "10": "Хабаровск, Melbourne, Vladivostok",
    "11": "Magadan, New Caledonia",
    "12": "Auckland, Samoa, Fiji",
  };

  storeUser.subscribe((newValue) => {
    if (newValue) {
      email = JSON.parse(newValue) ? JSON.parse(newValue).email : null;
      userID = JSON.parse(newValue) ? JSON.parse(newValue).id : null;
      user = JSON.parse(newValue);
    }
  });

  let chartmasterURL = `http://127.0.0.1:5500/index.html?user=${userID}`;

  //functions

  onMount(() => {
    connectWs();
  });

  function logout() {
    storeUser.set("");
    // DO NOT reset theme on regular login, use for debug only
    // storeAppTheme.set("light");
    setTimeout(() => {
      goto("/");
      if (document) {
        document.location.reload();
      }
    }, 300);
  }

  function setLightTheme() {
    storeAppTheme.set("light");
    appThemeIsDark = false;
  }
  function setDarkTheme() {
    storeAppTheme.set("dark");
    appThemeIsDark = true;
  }

  function connectWs() {
    wsConnLoading = true;
    if (userID) {
      try {
        socket = new WebSocket("wss://ana-api.myika.co/ws/" + userID);
        console.log("Attempting Connection...");
        setTimeout(() => (wsConnLoading = false), 1000);
      } catch (err) {
        console.log(err);
        setTimeout(() => (wsConnLoading = false), 1000);
      }
    } else {
      setTimeout(() => (wsConnLoading = false), 1000);
    }

    if (socket) {
      socket.onopen = () => {
        console.log("Successfully Connected");
        socket.send("Client connected");
        displaySocketIsClosed = false;

        //get request for TradeAction/trade histories
        const hds = {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
          Authorization: user.password,
        };
        axios
          .get("https://ana-api.myika.co/trades" + "?user=" + user.id, {
            headers: hds,
            mode: "cors",
          })
          .then((res) => {
            user.trades = res.data;
            storeUser.set(JSON.stringify(user));
            // console.log(res.status + " -- " + JSON.stringify(res.data));
          })
          .catch((error) => {
            console.log(error.response);
          });
      };

      socket.onclose = (event) => {
        console.log("Socket CLOSED Connection: ", event);
        displaySocketIsClosed = true;
      };

      socket.onerror = (error) => {
        console.log("Socket Error: ", error);
        displaySocketIsClosed = true;
      };

      socket.onmessage = (msg) => {
        console.log("WS server msg: " + msg.data);
        displaySocketIsClosed = false;
        //TODO: getting stringified trade action object, parse and put in store.js
        if (msg.data.includes("{")) {
          if (user.trades) {
            user.trades.push(JSON.parse(msg.data));
            user.trades = user.trades;
            storeUser.set(JSON.stringify(user));

            console.log(user.trades);
          }
        }
      };
    }
  }

  function listenOrderStatusStream(listenKey) {
    //TODO: use listenKey
    let socket = new WebSocket("wss://fstream.binance.com/ws/" + listenKey);
    console.log("Attempting Connection...");

    socket.onopen = () => {
      console.log("Successfully connected to Binance user_data stream");
    };

    socket.onclose = (event) => {
      console.log("Socket Closed Connection: ", event);
    };

    socket.onerror = (error) => {
      console.log("Socket Error: ", error);
    };

    socket.onmessage = (msg) => {
      console.log("Msg from Binance stream: " + msg.data);
    };
  }

  function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
      ans.push(i);
    }
    return ans;
  }
</script>

<nav
  class="navbar navbar-expand-md sticky-top {appThemeIsDark === true
    ? 'dark'
    : ''}"
  id="the-nav"
>
  <div class="container-fluid">
    <a href="/" class="navbar-brand" class:dark={appThemeIsDark}>Anastasia.</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <i class="bi bi-arrow-down-left-square-fill" />
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <select
            bind:value={selected}
            class="form-select"
            class:dark={appThemeIsDark}
          >
            {#each range(-12, 12) as gmtNum}
              <option value={gmtNum}
                >GMT{gmtNum.toString()[0] === "-"
                  ? gmtNum
                  : "+" + gmtNum} {gmtLocales[gmtNum.toString()]}</option
              >
            {/each}
          </select>
        </li>
        {#if email}
          <li class="nav-item">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="nav-link active"
              class:dark={appThemeIsDark}
              on:click={connectWs}
            >
              {#if !wsConnLoading}
                <i
                  class="bi bi-plug-fill"
                  class:inactiveIconBtn={displaySocketIsClosed}
                  class:activeWsIconBtn={!displaySocketIsClosed}
                />
              {:else}
                <i class="bi bi-hourglass-split" />
              {/if}
            </a>
          </li>
        {/if}
        <li class="nav-item">
          <a
            class="nav-link active"
            class:dark={appThemeIsDark}
            href={chartmasterURL}>Chartmaster</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link active"
            class:dark={appThemeIsDark}
            href="/strategy">Strategies</a
          >
        </li>
        {#if !email}
          <!-- <li class="nav-item">
            <a class="nav-link active" href="/">About</a>
          </li> -->
          <li class="nav-item">
            <a
              class="nav-link active"
              class:dark={appThemeIsDark}
              href="/pricing">Pricing</a
            >
          </li>
        {:else}
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              class:dark={appThemeIsDark}
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Bots
            </a>
            <ul
              class="dropdown-menu"
              class:dark={appThemeIsDark}
              aria-labelledby="navbarDropdown"
            >
              <li><a class="dropdown-item" href="/bots/active">Active</a></li>
              <li><a class="dropdown-item" href="/bots/all">All</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              class:dark={appThemeIsDark}
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-gear-wide-connected" />
            </a>
            <ul
              class="dropdown-menu"
              class:dark={appThemeIsDark}
              aria-labelledby="navbarDropdown"
            >
              <li><a class="dropdown-item" href="/history">History</a></li>
              <li><a class="dropdown-item" href="/exchanges">Exchanges</a></li>
              <li>
                <!-- svelte-ignore a11y-missing-attribute -->
                <a class="dropdown-item loggedInID">{email ? email : ""}</a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="nav-link active"
              class:dark={appThemeIsDark}
              on:click={logout}><i class="bi bi-box-arrow-in-left" /></a
            >
          </li>
        {/if}
        <li class="nav-tem">
          <ul id="themeSelector">
            <li>
              {#if appThemeIsDark}
                <i on:click={setLightTheme} class="bi bi-sun light" />
              {:else}
                <i
                  on:click={setLightTheme}
                  class="bi bi-brightness-high-fill light"
                />
              {/if}
            </li>
            <li>
              {#if appThemeIsDark}
                <i on:click={setDarkTheme} class="bi bi-moon-fill dark" />
              {:else}
                <i on:click={setDarkTheme} class="bi bi-moon dark" />
              {/if}
            </li>
          </ul>
        </li>
        <li class="nav-item d-md-none">
          <span>***</span>
        </li>
      </ul>
    </div>
  </div>
</nav>

<style type="text/scss">
  @import "../../static/styles/_all";

  nav {
    font-family: $title-font;
    background-color: transparent;
    color: black;

    // margin-bottom: 1rem;
    padding: 0;
  }

  nav.dark {
    background-color: black;
    color: $ivory;
  }

  a.navbar-brand {
    font-size: 1.5rem;
    padding: 0;
    margin: 1rem 2rem;
    color: $blood;

    @media only screen and (max-width: 767px) {
      margin: 0.75rem 1rem;
    }
  }

  a.navbar-brand.dark {
    color: $cream;
  }

  .navbar-collapse {
    padding-top: 0;
    margin-top: 0;
  }

  .nav-link {
    i {
      color: $cream;
    }
  }

  .nav-link.active {
    color: black;
    position: relative;
    z-index: 100;
  }

  .nav-link.active.dark {
    color: $cream;
    position: relative;
    z-index: 100;
  }

  select {
    all: unset;
    width: 250px;
  }

  .inactiveIconBtn {
    color: lightslategray !important;
  }
  .inactiveIconBtn:hover {
    color: orange !important;
  }

  .activeWsIconBtn {
    animation: blinkingText 3s infinite;
  }

  @keyframes blinkingText {
    0% {
      color: yellowgreen;
    }
    49% {
      color: yellowgreen;
    }
    60% {
      color: green;
    }
    99% {
      color: green;
    }
    100% {
      color: yellowgreen;
    }
  }

  .nav-link.dropdown-toggle {
    color: black;
  }
  .nav-link.dropdown-toggle.dark {
    color: $cream;
  }

  .dropdown-menu {
    background-color: white;
    li {
      a {
        color: black;
      }
      a:hover {
        background-color: white;
      }
      .loggedInID {
        color: $blue;
      }
      .loggedInID:hover {
        text-decoration: none;
      }
    }
  }

  .dropdown-menu.dark {
    background-color: $blood;
    li {
      a {
        color: $ivory;
      }
      a:hover {
        background-color: $blood;
      }
      .loggedInID {
        color: $cream;
      }
      .loggedInID:hover {
        text-decoration: none;
      }
    }
  }

  button.navbar-toggler {
    border: none;

    i {
      opacity: 100;
      color: $ivory;
    }
  }

  ul.navbar-nav {
    margin-right: 0;
    margin-top: 0;
    font-size: 1.2rem;

    li {
      font-family: $body-font;
      margin: 0;
      padding: 0.25rem 1rem;

      a {
        padding: 0;
      }
    }
  }

  a.disabled:hover {
    text-decoration: none;
  }

  #themeSelector {
    margin: auto -0.5rem auto -2.5rem;
    padding: auto -2rem auto 0;
    position: relative;
    z-index: 1;

    li {
      display: inline;
      margin: auto -0.5rem;
      padding: auto 0;

      i {
        margin: 0.75rem 0 auto 0;
        padding: auto 0;
      }
      i.light:hover {
        color: orangered;
      }
      i.dark:hover {
        color: blueviolet;
      }
    }
  }
</style>
