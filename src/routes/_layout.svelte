<script>
  import { storeAppTheme } from "../../store.js";
  import Navbar from "../components/Navbar.svelte";
  import Footer from "../components/Footer.svelte";

  let appThemeIsDark = false;

  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });
</script>

<main class:dark={appThemeIsDark}>
  <Navbar />

  <slot />

  <Footer />
</main>

<style type="text/scss">
  @import "../../static/styles/_all";

  main {
    width: 100%;
    height: 100%;
  }

  main.dark {
    background-color: black;
    color: $cream;
  }
</style>
