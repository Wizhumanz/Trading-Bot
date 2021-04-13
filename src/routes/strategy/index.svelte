<script>
  import { storeAppTheme } from "../../../store.js";

  let appThemeIsDark = false;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });
</script>

<div id="stratIndex" class:dark={appThemeIsDark}>
  <h1>Strat Index!</h1>
</div>

<style type="text/scss">
  @import "../../../static/styles/_all";

  #stratIndex {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  #stratIndex.dark {
    background-color: black;
    color: $cream;
  }
</style>
