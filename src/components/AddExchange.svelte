<script>
  import axios from "axios";
  import { storeUser } from "../../store.js";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  //global variables
  let loading = false;
  let addedAlert = "display: none;";
  let user = {};
  let exchangeName;
  let apiKey;

  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  function addExchangeHandler() {
    loading = true;

    const hds = {
      // "Content-Type": "application/json",
      Authorization: user.password,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };

    //Don't change any of these properties
    let data = {
      Name: exchangeName,
      APIKey: apiKey,
      UserID: user.id,
      IsDeleted: "false",
    };

    axios
      .post("https://ana-api.myika.co/exchange", data, {
        headers: hds,
      })
      .then((res) => {
        loading = false;
        addedAlert = "display: block;";
        console.log(res.status + " -- " + JSON.stringify(res.data));
        document.location.reload();

        exchangeName = "";
        apiKey = "";

        setTimeout(() => {
          addedAlert = "display: none;";
        }, 7000);
      })
      .catch((error) => {
        loading = false;
        console.log(error.response);
      });
  }
</script>

<!--Loading Sign-->
{#if loading}
  <LoadingIndicator />
{/if}

<div class="container-fluid">
  <h3>Add Exchange</h3>

  <div id="fields-box">
    <form class="form" on:submit|preventDefault={addExchangeHandler}>
      <div class="mb-3">
        <label for="exchangeName" class="form-label">Name</label>
        <input
          required="required"
          type="text"
          class="form-control"
          id="exchangeName"
          placeholder="Uniswap"
          bind:value={exchangeName}
        />
      </div>
      <div class="mb-3">
        <label for="apiKey" class="form-label">API Key</label>
        <input
          required="required"
          type="text"
          class="form-control"
          id="apiKey"
          placeholder="acgy67cmpque013uvcmto69420"
          bind:value={apiKey}
        />
      </div>
      <div>
        <button type="submit">Add Exchange</button>
      </div>
      <div style={addedAlert}>
        <p>Exchange Added</p>
      </div>
    </form>
  </div>
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

  div.container {
    text-align: center;
    padding-bottom: 4rem;
  }

  #head {
    margin-bottom: 2rem;
  }

  #fields-box {
    text-align: left;
  }

  select {
    font-family: $body-font;
    background-color: $ivory;
    border: $blood 1px dashed;
  }

  .form-check {
    margin: 0.75rem 0.5rem;

    label {
      // padding-left: 0.5rem;
    }
  }

  button {
    margin-bottom: 1rem;
  }

  #excel-upload {
    margin: 5rem auto;
  }
</style>
