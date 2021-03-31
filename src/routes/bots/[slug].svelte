<script>
  import { stores } from "@sapper/app";
  import { storeUser, currentPage } from "../../../store.js";

  import axios from "axios";

  import BotLI from "../../components/BotLI.svelte";
  import LoadingIndicator from "../../components/LoadingIndicator.svelte";

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
  {#if route == "active"}
    <h1>Active Bots</h1>
  {:else if route == "all"}
    <h1>All Bots</h1>
  {/if}

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

<style type="text/scss">
  @import "../../../static/styles/_all";

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
