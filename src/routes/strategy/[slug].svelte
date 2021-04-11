<script>
  import { stores } from "@sapper/app";

  const { page } = stores();
  var route = "";

  page.subscribe(({ path, params, query }) => {
    route = params.slug;
  });
</script>

<h1>{route}</h1>
