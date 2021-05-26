<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { storeUser, storeAppTheme } from "../../store.js";

  let user = {};
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });
    // In production, this should check CSRF, and not pass the session ID.
    // The customer ID for the portal should be pulled from the 
    // authenticated user on the server.
    // For customer portal
  let sessionID
  function getUser() {
    const hds = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0"
    };
    axios
      .get("http://localhost:8000/getUser?email=" + user.email, {
        headers: hds,
        mode: "cors",
      })
      .then((res) => {
        sessionID = res.data[0].sessionID
        console.log(sessionID)
        // goto("/listings/all");
      })
      .catch((error) => console.log(error));
  }
  getUser()

  onMount(() => {
    const manageBillingForm = document.querySelector('#manage-billing-form');
    manageBillingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      fetch('http://localhost:8000/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionID
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.href = data.url;
          console.log(data.url)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  });
</script>
<div class="container">
  <h1>Payment</h1>
  <form id="manage-billing-form">
    <button>Manage Billing</button>
  </form>
</div>

