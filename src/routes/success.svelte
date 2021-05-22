<script>
  import { onMount } from "svelte";
  import axios from "axios";

  let sessionID
  let customerID

  onMount(() => {
    sessionID = localStorage.getItem("sessionId")
    customerID = localStorage.getItem("customerId")
  });
  $: console.log(sessionID)
  $: console.log(customerID)
  
  let userRegister = {
    name: "",
    phone: "",
    email: "",
    password: "",
  }
  function register(e) {
    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0"
    };
    axios
      .post("http://localhost:8000/user", {
        headers: hds,
        name: userRegister.name,
        email: userRegister.email,
        password: userRegister.password,
        sessionID: sessionID,
        customerID: customerID,
        mode: "cors",
      })
      .then((res) => {
        console.log(res.status + " -- " + res.data);
        // goto("/listings/all");
      })
      .catch((error) => console.log(error));
  }
</script>

<main>
  <form class="form" on:submit|preventDefault={register}>
    <div class="mb-3">
      <label for="email" class="form-label">Name</label>
      <input
        type="text"
        class="form-control"
        id="name"
        bind:value={userRegister.name}
      />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input
        type="email"
        class="form-control"
        id="email"
        bind:value={userRegister.email}
      />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label"> Password</label>
      <input
        type="text"
        class="form-control"
        id="password"
        bind:value={userRegister.password}
      />
    </div>
    <button type="submit">Register</button>
  </form>

  <form id="manage-billing-form">
    <button>Manage Billing</button>
  </form>
</main>

<style type="text/scss">
  @import "../../static/styles/_all";

  .brand {
    font-family: $body-font;
  }

  #info-col {
    text-align: center;
    padding: 3rem;
    font-size: larger;
  }
  strong {
    color: $blue;
  }
  #login-col {
    text-align: left;
    padding: 4rem auto;
  }

  button.nav-link {
    color: gray;
    font-size: larger;
  }

  button.nav-link.active {
    background-color: $ivory;
    color: $blood;
  }

  form {
    margin-top: 1rem;
  }

  #phone {
    text-align: left;
    li {
      display: inline-block;
    }
  }

  input {
    font-family: $body-font;
    background-color: $ivory;
    border: $blood 1px dashed;
  }
  input:focus-within {
    background-color: $blood;
    color: $ivory;
  }

  select {
    padding: 0.5rem 0.5rem;
  }

  hr {
    margin: 3rem auto;
  }
</style>