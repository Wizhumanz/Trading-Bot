<script>
</script>

<div class="container">
    <h1>Price List</h1>
    <div class="row">
        <div class="col-4 center card">
          <h2>Peasant Tier</h2>
          <p>Free</p>
          <p>Limited to 10 custom webhook requests</p>
          <p>Unlimited strategy store uses, full price</p>
          <div class="product">
            <div class="description">
            </div>
          </div>
          <button type="button" id="first-tier">Checkout</button>
        </div>
        <div class="col-4 center card">
          <h2>Silver Tier</h2>
          <p>$149/month</p>
          <p>All strategies 50% off</p>
          <p>Bring your own custom strategies (unlimited requests)</p>
          <div class="product">
            <div class="description">
            </div>
          </div>
          <button type="button" id="second-tier">Checkout</button>
        </div>
        <div class="col-4 center card">
          <h2>Gold Tier</h2>
          <p>$333/month</p>
          <p>12-hour support</p>
          <p>Advanced analytics + monitoring system (e.g. auto detect high latency)</p>
          <div class="product">
            <div class="description">
            </div>
          </div>
          <button type="button" id="third-tier">Checkout</button>
        </div>
    </div>
</div>

<style type="text/scss">
    @import "../../static/styles/_all";

    .container {
        text-align: center;
    }

    .row {
      display: flex;
      justify-content: center;
    }

    .center.card {
      margin: 0.5rem;
      padding: 2rem 4.5rem 5.5rem 4.5rem;
      border-radius: 15px;

      background: rgb(138, 0, 0);
      background: linear-gradient(
        142deg,
        rgba(138, 0, 0, 1) 0%,
        rgba(0, 27, 107, 1) 100%
      );
    }
</style>
