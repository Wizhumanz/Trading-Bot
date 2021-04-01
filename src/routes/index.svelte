<script>
  import { onMount } from "svelte";
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
        Action: "FAKEentryOrderSubmitted",
        AggregateID: "1",
        BotID: 0,
        OrderType: 0,
        Size: 1.69,
        TimeStamp: "2021-03-23 05:53:18 +0800",
      },
      {
        Action: "FAKEentryOrderFilled",
        AggregateID: "1",
        BotID: 0,
        OrderType: 0,
        size: 3.14,
        timeStamp: "2021-03-23 05:55:11 +0800",
      },
      {
        Action: "FAKEexitOrderSubmitted",
        AggregateID: "1",
        BotID: 0,
        OrderType: 1,
        size: 1.11,
        timeStamp: "2021-03-23 05:59:14 +0000",
      },
    ],
  };
  // storeUser.subscribe((newValue) => {
  //   if (newValue) {
  //     user = JSON.parse(newValue) ? JSON.parse(newValue) : null;
  //   }
  // });

  onMount(() => {
    //if user already logged in, go straight to all listings
    user = storeUser;
    if (user.bots && user.bots.length > 0) {
      if (typeof window !== "undefined") {
        goto("/bots/all");
      }
    }
  });

  function getBots() {
    return new Promise((resolve, reject) => {
      console.log(userLogin.password);
      //auth header
      const hds = {
        // "Content-Type": "application/json",
        Authorization: userLogin.password,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      };

      //MUST replace all '+' with '%2B'
      // let GETUrl = basicURL.split("+").join("%2B");
      axios
        .get("http://localhost:8000/bots" + "?user=5632499082330112", {
          headers: hds,
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => console.log(error));
    });
  }

  function signIn(e) {
    loading = true;

    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
    axios
      .post("http://localhost:8000/login", {
        headers: hds,
        email: userLogin.email,
        password: userLogin.password,
      })
      .then((res) => {
        user.id = userLogin.email;
        user.password = userLogin.password;
        //wait for fetch to complete before needed page reload
        getBots().then((res) => {
          loading = false;
          user.bots = res;
          user.bots.reverse(); //to display most recent bots at top of list
          storeUser.set(JSON.stringify(user));
          loading = false;
          goto("/bots/all");
          //document.location.reload();
        });
      })
      .catch((error) => {
        console.log(error.response);
        loading = false;
        showAlert = "display: block;";
      });
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
