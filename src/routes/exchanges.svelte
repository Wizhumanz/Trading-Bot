<script>
  import { stores } from "@sapper/app";
  import { storeUser, currentPage } from "../../store.js";

  import AddBot from "./add.svelte";
  import BotLI from "../components/ExchangeLI.svelte";
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
</script>

<!--Loading Sign-->
{#if loading}
  <LoadingIndicator />
{/if}

<div class="container">
  <h1>Exchanges</h1>

  <div class="row">
    <div class="col-sm-12 col-md-7">
      <AddBot />
    </div>
    <div class="col-sm-12 col-md-5">
      <div class="botList">
        {#if user.bots && user.bots.length > 0}
          {#each user.bots as b}
            <BotLI bot={b} id={user.id} />
          {/each}
        {:else}
          <p>Error: No bots to show.</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

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
