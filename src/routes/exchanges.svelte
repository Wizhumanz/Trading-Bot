<script>
  import { stores } from "@sapper/app";
  import { storeUser, currentPage } from "../../store.js";
  import axios from "axios";

  import AddExchange from "../components/AddExchange.svelte";
  import ExchangeLI from "../components/ExchangeLI.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  const { page } = stores();
  page.subscribe(({ path, params, query }) => {
    route = params.slug;
    currentPage.set(route);
  });
  var route;
  let user = {};
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  let loading = false;
  let exchanges = [];
  const hds = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
    Authorization: user.password,
  };
  axios
    .get("https://ana-api.myika.co/exchanges" + "?user=5632499082330112", {
      headers: hds,
    })
    .then((res) => {
      exchanges = res.data;
      user.exchanges = exchanges;
      storeUser.set(JSON.stringify(user));

      console.log(res.status + " -- " + JSON.stringify(res.data));
    })
    .catch((error) => {
      console.log(error.response);
    });
</script>

<!--Loading Sign-->
{#if loading}
  <LoadingIndicator />
{/if}

<div class="container">
  <h1>Exchanges</h1>

  <div class="row">
    <div class="col-sm-12 col-md-5">
      <AddExchange />
    </div>
    <div class="col-sm-12 col-md-7">
      {#if exchanges && exchanges.length > 0}
        {#each exchanges as e}
          <ExchangeLI exchange={e} />
        {/each}
      {:else}
        <p>Error: No exchanges to show.</p>
      {/if}
    </div>
  </div>
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

  .row {
    margin-top: 1rem;
  }

  #head {
    li {
      display: inline;

      .btn {
        padding: 0 1rem;
        margin-top: -1rem;
        color: $cream;
      }

      h1,
      a {
        width: fit-content;
        display: inline;
      }
    }
  }

  div.container {
    text-align: center;
    padding-bottom: 4rem;
    margin-top: 1rem;
  }

  div.botList {
    margin-top: 1rem;
  }

  button {
    font-size: x-large;
  }

  button:disabled {
    opacity: 0.5;
  }
</style>
