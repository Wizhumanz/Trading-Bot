<script>
  import { stores } from "@sapper/app";
  import { storeUser, storeAppTheme } from "../../../store.js";

  let appThemeIsDark = false;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  let currentStrat;

  let user = {};
  storeUser.subscribe((newValue) => {
    if (newValue) {
      user = JSON.parse(newValue);
    }
  });

  const { page } = stores();
  var route = "";
  page.subscribe(({ path, params, query }) => {
    route = params.slug;
    if (user.strats && user.strats.length > 0) {
      currentStrat = user.strats.find((s) => s.id === route);
    }
  });
</script>

<div id="stratViewPage" class:dark={appThemeIsDark}>
  <div class="row">
    <div class="col-sm-1 col-md-3 col-lg-4" />
    <div class="col-sm-10 col-md-6 col-lg-4">
      {#if currentStrat && currentStrat.name}
        <h1>
          <a href="/strategy" class="pageNav"
            ><i class="bi bi-arrow-left-circle pageNav" /></a
          >{currentStrat.name}
        </h1>
        <p>{currentStrat.description}</p>
      {/if}
    </div>
    <div class="col-sm-1 col-md-3 col-lg-4" />
  </div>
</div>

<style type="text/scss">
  @import "../../../static/styles/_all";

  #stratViewPage {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 1rem;
    padding-top: 2rem;
  }

  h1 {
    margin-bottom: 1rem;
  }

  #stratViewPage.dark {
    background-color: black;
    color: $cream;
  }
</style>
