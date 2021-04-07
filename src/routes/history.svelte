<script>
  import { storeUser } from "../../store.js";
  import axios from "axios";

  let user = {};
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
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
    })
    .then((res) => {
      user.trades = res.data;
      console.log(res.status + " -- " + JSON.stringify(res.data));
    })
    .catch((error) => {
      console.log(error.response);
    });
</script>

<div class="container-fluid">
  <h1>Trade History</h1>
  <div id="filterMenu">
    <a
      class="btn"
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
      <tr>
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
        <tr>
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
    width: 100%;
    text-align: left;
  }

  .btn {
    padding: 0 1rem;
    margin-top: -1rem;
    color: $ivory !important;
  }

  table {
    margin-top: 0.75rem;
    text-align: left;
  }

  tr:hover {
    background-color: $blood;
    color: $cream;
  }
</style>
