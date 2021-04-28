<script >
  import { scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  export let data
  export let selectedColumn
  
  const height = 600;
  const width = 600;
  const buffer = 10;
  const axisSpace = 50;

  $: xExtent = extent(data, (d) => d[selectedColumn]);
  let yExtent = extent(data, (d) => d.Profit);
  $: xScale = scaleLinear()
      .domain(xExtent)
      .range([buffer + axisSpace, width - buffer]);
  let yScale = scaleLinear()
      .domain(yExtent)
      .range([height - buffer - axisSpace, buffer]);

  $: console.log(data)

</script>

<svg {height} {width}>
  {#each data as item}
    <circle
      r="3"
      cx={xScale(item[selectedColumn])}
      cy={yScale(item.Profit)}
      fill="red" />
  {/each}

  {#each xScale.ticks() as tick}
    <g transform={`translate(${xScale(tick)} ${height - 20})`}>
      <line y1="-5" y2="0" stroke="green" />
      <text y="20" fill="green" text-anchor="middle">{tick}</text>
    </g>
  {/each}

  {#each yScale.ticks() as tick}
    <g transform={`translate(0 ${yScale(tick)})`}>
      <line x1="35" x2="40" stroke="green" />
      <text x="30" fill="green" dominant-baseline="middle" text-anchor="end">{tick}</text>
    </g>
  {/each}
</svg>