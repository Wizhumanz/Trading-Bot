<script>
  import { storeUser, storeAppTheme } from "../../store.js";
  import axios from "axios";

  let user = {};
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  let appThemeIsDark = false;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  //need this for some reason. Otherwise it gives an error
  user.trades = [];

  //get request for TradeAction/trade history

  const hds = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
    Authorization: user.password,
  };
  axios
    .get("https://ana-api.myika.co/trades" + "?user=" + user.id, {
      headers: hds,
      mode: "cors",
    })
    .then((res) => {
      user.trades = res.data;
      console.log(res.status + " -- " + JSON.stringify(res.data));
    })
    .catch((error) => {
      console.log(error.response);
    });

  // const testURL = "https://ana-api.myika.co/trades" + "?user=" + user.id;
  // const myInit = {
  //   method: "GET",
  //   mode: "cors",
  //   headers: hds,
  //   cache: "default",
  // };
  // fetch(testURL, myInit)
  //   .then(function (response) {
  //     if (response.ok) {
  //       console.log("Success");
  //     } else {
  //       console.log("Fail");
  //     }
  //     return response.json();
  //   })
  //   .then(function (response) {
  //     user.trades = response;
  //     storeUser.set(JSON.stringify(user));
  //   })
  //   .catch(function (e) {
  //     console.log(e);
  //   });
</script>

<div class="container-fluid">
  <h1>Trade History</h1>
  <div id="filterMenu">
    <a
      class:dark={appThemeIsDark}
      data-bs-toggle="collapse"
      href="#collapseExample"
      role="button"
      aria-expanded="false"
      aria-controls="collapseExample"
    >
      Filter ▼
    </a>
    <div class="collapse" id="collapseExample">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckDefault"
        />
        <label class="form-check-label" for="flexCheckDefault">
          FAKE field 1
        </label>

        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckDefault"
        />
        <label class="form-check-label" for="flexCheckDefault">
          FAKE field 2
        </label>
      </div>
    </div>
  </div>

  <table class="table">
    <thead>
      <tr class:dark={appThemeIsDark}>
        <th scope="col">Action</th>
        <th scope="col">Ticker</th>
        <th scope="col">Size</th>
        <th scope="col">Timestamp</th>
        <th scope="col">BotID</th>
        <th scope="col">AggregateID</th>
        <th scope="col">ID</th>
        <th scope="col">Exchange</th>
      </tr>
    </thead>
    <tbody>
      {#each user.trades as t}
        <tr class:dark={appThemeIsDark}>
          <td>{t.Action}</td>
          <td>{t.Ticker}</td>
          <td>{t.Size}</td>
          <td>{t.Timestamp}</td>
          <td>{t.BotID}</td>
          <td>{t.AggregateID}</td>
          <td>{t.KEY}</td>
          <td>{t.Exchange}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

  .container-fluid {
    padding: 1rem 2rem;
    text-align: center;
  }

  #filterMenu {
    margin-left: 1rem;
    text-align: left;

    a {
      color: $blue;
    }

    a.dark {
      color: $cream;
    }
  }

  .btn {
    padding: 0 1rem;
    margin-top: -1rem;
    color: $ivory !important;
  }

  table {
    margin-top: 0.75rem;
    text-align: left;
    font-family: $body-font;
  }

  thead {
    font-style: italic;
  }

  tr {
    color: black;
  }

  tr.dark {
    color: $ivory;
  }

  tr:hover {
    background-color: $blue;
    color: $ivory;
  }

  tr.dark:hover {
    background-color: $blood;
    color: $cream;
  }
</style>
