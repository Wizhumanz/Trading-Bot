<script>
  import { stores } from "@sapper/app";
  import { storeUser, currentPage, storeAppTheme } from "../../../store.js";
  import AddBot from "../../components/AddBot.svelte";
  import BotLI from "../../components/BotLI.svelte";
  import LoadingIndicator from "../../components/LoadingIndicator.svelte";

  let socket = new WebSocket("ws://localhost:8000/ws");
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
    socket.send("Hi From the Client!");
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };

  socket.onmessage = (msg) => {
    console.log("Msg from ws server: " + msg.data);
  };

  //global variables
  const { page } = stores();
  var route;
  let user = {};
  let loading = false;
  let appThemeIsDark = false;

  page.subscribe(({ path, params, query }) => {
    route = params.slug;
    currentPage.set(route);
  });

  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });
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

  <div class="collapse" id="collapseExample">
    <AddBot />
  </div>

  <div class="botList">
    {#if user.bots && user.bots.length > 0}
      {#each user.bots as b}
        <BotLI bot={b} />
      {/each}
    {:else}
      <p>Error: No bots to show.</p>
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
