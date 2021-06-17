<script>
  import axios from "axios";
  import { storeUser, storeAppTheme } from "../../store.js";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let exchange;

  //global variables
  let appThemeIsDark = false;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });
  let user = {};
  let loading = false;
  let exchangeBool = exchange.IsDeleted === "true" ? true : false;
  let hideExchange = exchangeBool ? "display: none;" : "display: block;";

  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  //handler functions
  function deleteExchange() {
    hideExchange = "display: none;";
    exchange.IsDeleted = "true";

    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: user.password,
    };
    axios
      .delete(
        "http://localhost:8000/exchange/" +
          exchange.KEY +
          "?user=" +
          user.id,
        {
          headers: hds,
          mode: "cors",
        }
      )
      .then(() => {
        let exchangesList = [];
        user.exchanges.forEach((e) => {
          if (e.KEY === exchange.KEY) {
            exchangesList.push(exchange);
          } else {
            exchangesList.push(e);
          }
        });
        user.exchanges = exchangesList;
        storeUser.set(JSON.stringify(user));
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
</script>

{#if loading}
  <LoadingIndicator />
{/if}

{#if user.exchanges[0].APIKey !== exchange.APIKey}
  <h3><i class="bi bi-chevron-compact-down" /></h3>
{/if}
<div class="container-fluid" style={hideExchange}>
  <div class="row">
    <div class="col-sm col-md-1" />
    <div class="col-sm col-md-10 main-box" class:dark={appThemeIsDark}>
      <div class="row val-row">
        <div class="col-3"><h4>Name</h4></div>
        <div class="col-9 val-col">
          {exchange.Name}
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <h4>API <i class="bi bi-key" /></h4>
        </div>
        <div class="col-9 val-col">
          {exchange.APIKey}
        </div>
      </div>
      <button class="delete-btn" on:click={deleteExchange}>Delete</button>
    </div>
    <div class="col-sm col-md-1" />
  </div>
  <span />
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

  h4 {
    color: $cream;
  }

  div.container-fluid {
    font-family: $body-font;
    margin: 1rem auto;
    text-align: left;
    border-radius: 3px;

    p {
      margin: 0;
    }
  }

  div.main-box {
    background-color: $blue;
    color: $ivory;
    border: none;
    border-radius: 5px;
    padding: 1.5rem 2.5rem 1rem 2rem;

    button {
      font-size: larger;
      margin-top: 1rem;
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

  div.main-box.dark {
    background-color: black;
    border: $blood 3px dotted;
    border-radius: 5px;
    padding: 1.5rem;
  }

  .val-row {
    margin-bottom: 0.5rem;
    text-align: left;
  }

  .bi-key {
    margin-left: 0.25rem;
  }

  .val-col {
    padding-top: 0.25rem;
  }

  .mb-3 {
    margin-top: 0.5rem;
  }
</style>
