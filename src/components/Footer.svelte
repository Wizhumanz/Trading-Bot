<script>
  import { stores } from "@sapper/app";
  import { storeAppTheme } from "../../store.js";

  let appThemeIsDark = false;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  const { page } = stores();
  page.subscribe(({ path, params, query }) => {
    if (path === "/") {
      appThemeIsDark = true;
    }
  });
</script>

<div class="container-fluid" class:dark={appThemeIsDark}>
  <div class="row">
    <div class="col-sm-12 col-md-1" />
    <div class="col-sm-12 col-md-5">
      <p><i class="bi bi-badge-tm" /><span /> Myika Technologies Pte Ltd</p>
    </div>
    <div class="col-sm-12 col-md-6">
      <p>
        “Each moment free from fear makes a man immortal."
        <br />
        - Alexander the Great
      </p>
    </div>
  </div>
</div>

<style type="text/scss">
  @import "../../static/styles/_all";

  .container-fluid {
    padding-top: 4rem;
    color: black;
  }
  .container-fluid.dark {
    color: $cream;
    background-color: black;
  }

  div.row {
    padding: 1rem 1rem 4rem 1rem;
  }

  span {
    margin: auto 0.25rem;
  }
</style>
