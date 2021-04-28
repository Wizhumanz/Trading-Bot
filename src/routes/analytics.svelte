<script>
  import Scatter from "../components/Scatter.svelte"
  const columns = [
    "Duration In Trade",
    "Order Size",
    "Leverage",
    "Time",
  ];
  let selectedColumn = "Duration In Trade";

  async function loadData() {
    const res = await fetch("http://localhost:8000/src/files/data.json");
    const data = await res.json();
    return data
  }
  let data = loadData();
  console.log(data)
</script>

<div class="container">
  <h1>Analytics</h1>
</div>

{#await data}
  <p>Loading...</p>
{:then data}
  <Scatter {data} {selectedColumn}/>
  <select bind:value={selectedColumn}>
    {#each columns as column}
        <option>{column}</option>
    {/each}
  </select>
{/await}


<style type="text/scss">
  @import "../../static/styles/_all";

</style>