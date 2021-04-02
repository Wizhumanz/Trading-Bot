<script>
  import { onMount } from "svelte";
  import { storeUser } from "../../store.js";
  import axios from "axios";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let exchange;

  let user = {};
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  // component vars
  let loading = false;
  let exchangeBool = exchange.IsDeleted === "true" ? true : false;
  let hideExchange = exchangeBool ? "display: none;" : "display: block;";
  function deleteExchange() {
    console.log("delete");
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
        "https://ana-api.myika.co/exchange/" +
          exchange.KEY +
          "?user=5632499082330112",
        {
          headers: hds,
        }
      )
      .then((res) => {
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

<div class="container-fluid" style={hideExchange}>
  <div class="row">
    <div class="col-sm col-md-1" />
    <div class="col-sm col-md-10 main-box">
      <div class="row">
        <div class="col-7"><h4>Name</h4></div>
        <div class="col-5 val-col">
          {exchange.Name}
        </div>
      </div>
      <div class="row">
        <div class="col-7"><h4>API Key</h4></div>
        <div class="col-5 val-col">
          {exchange.APIKey}
        </div>
      </div>
      <button class="delete-btn" on:click={deleteExchange}>Delete</button>
    </div>
    <div class="col-sm col-md-1" />
  </div>
  <hr />
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

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
    border: $blood 3px dotted;
    border-radius: 5px;
    padding: 1.5rem;
  }

  div.red {
    border: $blood 3px solid;
    background-color: $blood;
    border-radius: 3px;
    color: $ivory;
    text-align: center;
    margin: auto auto 1.5rem auto;
    padding: 1.5rem;

    p {
      background-color: $blood;
      color: $cream;
    }
  }

  .mb-3 {
    margin-top: 0.5rem;
  }

  div.settings-col {
    hr {
      color: $cream;
    }
  }

  .val-col {
    font-family: $title-font;
    font-size: large;
  }

  .lowkey-val-col {
    font-family: $title-font;
    font-size: small;
  }

  button {
    background-color: $cream;
    color: black;
    border-radius: 5px;
  }

  .save-btn {
    padding: 0.25rem 0.75rem;
    margin-bottom: 1rem;
    color: $cream;
    background-color: $blue;
    border: $cream 2px dashed;
    font-size: small;
  }

  .display-fields {
    font-size: small;
  }

  p.changeVal {
    color: yellow;
    font-weight: bold;
  }

  #imgDisplay {
    overflow: hidden;
    display: block;
    margin: auto;
  }

  input.form-check-input {
    margin: 1rem auto;
  }

  .editA {
    height: fit-content;
    color: $blue;
    font-style: italic;
    margin-top: 0.5rem;
  }

  a {
    text-decoration: underline;
  }

  // .active {
  //   background-color: red;
  // }
</style>
