<script>
  import { stores } from "@sapper/app";
  import { storeUser, storeAppTheme } from "../../../store.js";

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
    currentStrat = user.strats.find((s) => s.id === route);
  });
</script>

<h1>{route}</h1>
<p>{currentStrat.name}</p>
