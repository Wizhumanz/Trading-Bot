<script>
  import { stores } from "@sapper/app";
  import { storeUser, resetState, currentPage } from "../../../store.js";

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
    console.log("slug.svelte user = " + user)
  });

  var checkBoxArr = [];
  let loading = false;

  function handleUpdateBtnClick() {
    resetState.set(true);

    loading = true;
    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      auth: "agent",
    };

    let checkBoxSet = new Set(checkBoxArr);
    checkBoxArr = checkBoxSet;

    checkBoxSet.forEach((n) => {
      let found = user.listings.find((e) => e.name === n);
      if (found && found != "" && found != null) {
        //update listing in DB
        let listingSubstitute = { ...found };
        listingSubstitute.name = null;
        listingSubstitute.isPublic = found.isPublic.toString();
        listingSubstitute.isPending = found.isPending.toString();
        listingSubstitute.isCompleted = found.isCompleted.toString();

        //trying hacky way
        setTimeout(function () {
          axios
            .put(
              "https://anastasia-api.myika.co/listing/" +
                found.name.replaceAll(" ", "+") +
                "?user=agent%40agent.com",
              JSON.stringify(listingSubstitute),
              {
                headers: hds,
              }
            )
            .then((res) => {
              loading = false;
              console.log(res.status + " -- " + JSON.stringify(res.data));
            })
            .catch((error) => console.log(error.response));
        }, 5000);
      }
    });
  }
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
        <BotLI bot={b}/>
      {/each}
    {:else}
      <p>Error: No bots to show.</p>
    {/if}
  </div>

  {#if user.id && user.id !== "" && checkBoxArr.length > 0}
    <button on:click={handleUpdateBtnClick}>Update Listings</button>
  {/if}
</div>

<style type="text/scss">
  @import "../../../static/styles/_all";

  div.container {
    text-align: center;
    padding-bottom: 4rem;
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
