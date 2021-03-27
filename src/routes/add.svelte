<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { storeUser } from "../../store.js";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  let loading = false;
  let showAlert = "display: none;";

  let now = new Date(),
    month,
    day,
    year;
  let botName;
  let accSizePerc;
  let accRiskPerc;
  let leverage;
  let exchange;

  onMount(() => {});

  function addListing() {
    loading = true;
    // TEMP FAKE CALL - delete when making actual API call
    setTimeout(() => {
      loading = false;
    }, 1500);
    return;
    // TEMP FAKE CALL

    if (loading) {
      const hds = {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        auth: "agent",
      };
      //Don't change any of these properties
      let data = {
        user: user.id, //get user.id from store.js
        owner: owner,
        name: name, //name of listings are immutable
        address: address,
        postcode: postcode,
        area: area,
        price: price.toString(),
        propertyType: propertyType.toString(),
        listingType: listingType.toString(),
        availableDate: dateString.toString(),
        isPublic: isPublic.toString(),
        isCompleted: isCompleted.toString(),
        isPending: isPending.toString(),
        imgs: filesStr,
      };

      axios
        .post("https://anastasia-api.myika.co/listing", data, {
          headers: hds,
        })
        .then((res) => {
          loading = false;
          showAlert = "display: block;";
          console.log(res.status + " -- " + JSON.stringify(res.data));

          (now = new Date()), month, day, year;
          files;
          filesStr = [];
          owner = "";
          name = "";
          address = "";
          postcode = "";
          area = "";
          price = 1000;
          propertyType;
          listingType;
          dateString;
          isPublic = false;
          isCompleted = false;
          isPending = false;

          setTimeout(() => {
            showAlert = "display: none;";
          }, 7000);
        })
        .catch((error) => console.log(error.response));
    }
  }
</script>

<!--Loading Sign-->
{#if loading}
  <LoadingIndicator />
{/if}

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-12 col-md-1" />
    <div class="col-sm-12 col-md-10">
      <div id="fields-box">
        <form class="form" on:submit|preventDefault={addListing}>
          <div class="mb-3">
            <label for="botName" class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              id="botName"
              placeholder="Long Bot"
              bind:value={botName}
            />
          </div>
          <div class="row">
            <div class="col-6">
              <div class="mb-3">
                <label for="accSize" class="form-label"
                  >Account Size to Trade (%)</label
                >
                <input
                  type="number"
                  class="form-control"
                  id="accSize"
                  placeholder="20"
                  bind:value={accSizePerc}
                />
              </div>
              <div class="mb-3">
                <label for="accRisk" class="form-label"
                  >% of Account Risked per Trade</label
                >
                <input
                  type="number"
                  class="form-control"
                  id="accRisk"
                  placeholder="1.5"
                  bind:value={accRiskPerc}
                />
              </div>
            </div>
            <div class="col-6">
              <div class="mb-3">
                <label for="leverage" class="form-label">Leverage (x)</label>
                <input
                  type="number"
                  class="form-control"
                  id="leverage"
                  placeholder="10"
                  bind:value={leverage}
                />
              </div>
              <div class="mb-3">
                <label for="area" class="form-label">Exchange</label>
                <!-- input below supposed to be a dropdown -->
                <input
                  type="number"
                  class="form-control"
                  id="area"
                  placeholder="000000000"
                  bind:value={exchange}
                />
              </div>
            </div>
          </div>
          <div>
            <button type="submit">Add Bot</button>
          </div>
          <div style={showAlert}>
            <p>Bot Added</p>
          </div>
        </form>
      </div>
    </div>
    <div class="col-sm-12 col-md-1" />
    <hr />
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
    padding: 0 4rem;
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
