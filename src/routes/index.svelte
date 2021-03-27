<script>
  import { goto } from "@sapper/app";
  import { storeUser } from "../../store.js";
  import axios from "axios";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  // global vars
  //only for user login
  let userLogin = {
    email: "",
    password: "",
  };

  let showAlert = "display: none;"; //to display invalid auth msg
  let loading = false;

  let user = {
    id: "",
    password: "",
    bots: [
      {
        KEY: "5642368648740864",
        Name: "Binance EMA Cross",
        AggregateID: "2",
        UserID: "5632499082330112",
        ExchangeConnection: "5634161670881280",
        AccountRiskPercPerTrade: "1.2",
        AccountSizePercToTrade: "20.5",
        IsActive: "true",
        IsArchived: "false",
        Leverage: "15",
        WebhookURL: "https://anastasia-api/webhook/chy781e3",
      },
      {
        KEY: "5644004762845184",
        Name: "Binance Long Triple Pivot",
        AggregateID: "1",
        UserID: "5632499082330112",
        ExchangeConnection: "5634161670881280",
        AccountRiskPercPerTrade: "33.2",
        AccountSizePercToTrade: "50",
        IsActive: "true",
        IsArchived: "false",
        Leverage: "12",
        WebhookURL: "https://anastasia-api/webhook/hu989ko3",
      },
      {
        KEY: "5710353417633792",
        Name: "Binance H&S Play",
        AggregateID: "0",
        UserID: "5632499082330112",
        ExchangeConnection: "5634161670881280",
        AccountRiskPercPerTrade: "70",
        AccountSizePercToTrade: "29",
        IsActive: "false",
        IsArchived: "false",
        Leverage: "98",
        WebhookURL: "https://anastasia-api/webhook/kmow894w",
      },
    ],
  };

  function getBots() {
    return new Promise((resolve, reject) => {
      //auth header
      const hds = {
        // "Content-Type": "application/json",
        auth: user.password,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      };

      //MUST replace all '+' with '%2B'
      // let GETUrl = basicURL.split("+").join("%2B");
      axios
        .get("https://ana-api.myika.co/bots", {
          headers: hds,
        })
        .then((res) => {
          user.bots = res.data;
          loading = false;
          storeUser.set(JSON.stringify(user));
          resolve(user.bots);
        })
        .catch((error) => console.log(error));
    });
  }

  function signIn(e) {
    loading = true;

    getBots().then((res) => {
      loading = false;
      goto("/listings/all");
      loading = false;
      //document.location.reload();
    });

    // const hds = {
    //   "Cache-Control": "no-cache",
    //   Pragma: "no-cache",
    //   Expires: "0",
    // };
    // axios
    //   .post("https://anastasia-api.myika.co/login", {
    //     headers: hds,
    //     email: userLogin.email,
    //     password: userLogin.password,
    //   })
    //   .then((res) => {
    //     user.id = userLogin.email;
    //     user.password = userLogin.password;
    //     //wait for fetch to complete before needed page reload
    //     getBots().then((res) => {
    //       loading = false;
    //       goto("/listings/all");
    //       //document.location.reload();
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     showAlert = "display: block;";
    //   });
  }
</script>

<main>
  {#if loading}
    <LoadingIndicator />
  {/if}

  <div class="container-fluid">
    <div class="row signIn">
      <div class="col-2" />
      <div class="col-8">
        <p>
          DEBUG NOTE: Just click Sign In button with empty inputs to mock sign
          in.
        </p>
        <!-- Sign In tab -->
        <div style={showAlert}>
          <p>Incorrect Login Details</p>
        </div>
        <form class="form" on:submit|preventDefault={signIn}>
          <div class="mb-3">
            <label for="emailLogin" class="form-label"> Email</label>
            <input
              type="email"
              class="form-control"
              id="emailLogin"
              placeholder="name@agency.com"
              bind:value={userLogin.email}
            />
          </div>
          <div class="mb-3">
            <label for="passwordLogin" class="form-label"> Password</label>
            <input
              type="password"
              class="form-control"
              id="passwordLogin"
              placeholder="password"
              bind:value={userLogin.password}
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div class="col-2" />
    </div>
  </div>
</main>

<style type="text/scss">
  @import "../../static/styles/_all";

  div.row.signIn {
    margin-top: 1.5rem;
  }
</style>
