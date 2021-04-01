<script>
  import { storeUser } from "../../store.js";
  import axios from "axios";

  // let user = {};
  // storeUser.subscribe((newValue) => {
  //   if (newValue) {
  //     user = JSON.parse(newValue);
  //   }
  // });

  //MOCK
  let user = {
    id: "",
    password: "",
    bots: [
      {
        KEY: "5642368648740862",
        Name: "FAKE EMA Cross",
        AggregateID: "2",
        UserID: "5632499082330111",
        ExchangeConnection: "5634161670881280",
        AccountRiskPercPerTrade: "1.7",
        AccountSizePercToTrade: "32.5",
        IsActive: "true",
        IsArchived: "false",
        Leverage: "17",
        WebhookURL: "https://ana-api/webhook/chy781e3FAKE",
      },
      {
        KEY: "5644004762845180",
        Name: "FAKE Long Triple Pivot",
        AggregateID: "1",
        UserID: "5632499082330111",
        ExchangeConnection: "5634161670881280",
        AccountRiskPercPerTrade: "3.2",
        AccountSizePercToTrade: "55",
        IsActive: "true",
        IsArchived: "false",
        Leverage: "35",
        WebhookURL: "https://ana-api/webhook/hu989ko3FAKE",
      },
      {
        KEY: "5710353417633793",
        Name: "FAKE H&S Play",
        AggregateID: "0",
        UserID: "5632499082330111",
        ExchangeConnection: "5634161670881280",
        AccountRiskPercPerTrade: "20",
        AccountSizePercToTrade: "60",
        IsActive: "false",
        IsArchived: "false",
        Leverage: "5",
        WebhookURL: "https://ana-api/webhook/kmow894wFAKE",
      },
    ],
    trades: [
      {
        KEY: "1732781787",
        Action: "FAKEentryOrderSubmitted",
        AggregateID: "1",
        BotID: 0,
        OrderType: 0,
        Size: 1.69,
        TimeStamp: "2021-03-23 05:53:18 +0800",
      },
      {
        KEY: "1732333787",
        Action: "FAKEentryOrderFilled",
        AggregateID: "1",
        BotID: 0,
        OrderType: 0,
        Size: 3.14,
        TimeStamp: "2021-03-23 05:55:11 +0800",
      },
      {
        KEY: "1732780917",
        Action: "FAKEexitOrderSubmitted",
        AggregateID: "1",
        BotID: 0,
        OrderType: 1,
        Size: 1.11,
        TimeStamp: "2021-03-23 05:59:14 +0000",
      },
    ],
  };

  const hds = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
    Authorization: "trader",
  };
  axios
    .get("http://localhost:8000/trades" + "?user=5632499082330112", {
      headers: hds,
    })
    .then((res) => {
      user.trades = res.data;
      console.log(res.status + " -- " + JSON.stringify(res.data));
      console.log(res.data);
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
        <th scope="col">OrderType</th>
        <th scope="col">Size</th>
        <th scope="col">TimeStamp</th>
        <th scope="col">BotID</th>
        <th scope="col">AggregateID</th>
        <th scope="col">ID</th>
      </tr>
    </thead>
    <tbody>
      {#each user.trades as t}
        <tr>
          <td>{t.Action}</td>
          <td>{t.OrderType}</td>
          <td>{t.Size}</td>
          <td>{t.TimeStamp}</td>
          <td>{t.BotID}</td>
          <td>{t.AggregateID}</td>
          <td>{t.KEY}</td>
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
