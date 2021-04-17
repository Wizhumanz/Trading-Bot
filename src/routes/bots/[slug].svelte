<script>
  import { stores } from "@sapper/app";
  import { storeUser, currentPage, storeAppTheme } from "../../../store.js";
  import AddBot from "../../components/AddBot.svelte";
  import BotLI from "../../components/BotLI.svelte";
  import LoadingIndicator from "../../components/LoadingIndicator.svelte";

  //global variables
  let appThemeIsDark = false;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  let user = {};
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  const { page } = stores();
  var route;
  page.subscribe(({ path, params, query }) => {
    route = params.slug;
    currentPage.set(route);
  });

  let loading = false;
  let numInactiveBots = 0;
  let showNoActiveBots = false;
  if (user.bots) {
    Array.from(user.bots).forEach((b) => {
      if (b.IsActive === "false") {
        numInactiveBots += 1;
      }
    });

    if (numInactiveBots === user.bots.length) {
      showNoActiveBots = true;
    }
  }
</script>

<!--Loading Sign-->
{#if loading}
  <LoadingIndicator />
{/if}

<div class="container">
  {#if route == "active"}
    <ul id="head">
      <li><h1>Active Bots</h1></li>
      <li>
        <h1>
          <a
            class="btn"
            class:dark={appThemeIsDark}
            data-bs-toggle="collapse"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            + Add Bot
          </a>
        </h1>
      </li>
    </ul>
  {:else if route == "all"}
    <h1>All Bots</h1>
  {/if}
  {#if route == "active"}
    <div class="collapse" id="collapseExample">
      <AddBot/>
    </div>
  {/if}

  <div class="botList">
    {#if user.bots && user.bots.length > 0}
      {#each user.bots.sort((a, b) => new Date(b.Timestamp.replaceAll("_", " ")).getTime() - new Date(a.Timestamp.replaceAll("_", " ")).getTime()) as b}
        {#if (b.IsActive === "true" || b.IsActive === true) && route === "active"}
          <BotLI bot={b} />
        {:else if route === "all"}
          <BotLI bot={b} />
        {/if}
      {/each}
    {:else}
      <p>Error: No bots to show.</p>
    {/if}
    {#if showNoActiveBots == true}
      <p>No active bots to show.</p>
    {/if}
  </div>
</div>

<style type="text/scss">
  @import "../../../static/styles/_all";

  #head {
    li {
      display: inline;

      .btn {
        padding: 0 1rem;
        margin: -5rem 1rem auto auto;
        color: $blood;
      }

      .btn.dark {
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
    margin-top: 1.5rem;
  }

  button {
    font-size: x-large;
  }

  button:disabled {
    opacity: 0.5;
  }
</style>
