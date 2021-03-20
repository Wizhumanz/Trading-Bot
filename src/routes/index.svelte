<script>
  // import { goto } from "@sapper/app";
  // import { storeUser } from "../../store.js";
  // import axios from "axios";

  let botStatus = false;
	let riskPerc = 1
	let newRiskPerc = riskPerc
	let leverage = 1

	function toggleBotStatus() {
		botStatus = !botStatus;
	}
</script>

<main>
	<div class="container-fluid">
		<div class="row main">
			<div class="col-sm-2 col-md-3" />
			<div class="col-sm-8 col-md-6 main-box" style="padding: 2rem;">
				<div class="red">
					{#if botStatus}
						<p>LIVE</p>
					{:else}
						<p>INACTIVE</p>
					{/if}

					<button
						on:click={toggleBotStatus}
						type="button"
						class="btn blood-btn"
					>
						{botStatus ? "Shut Down" : "Activate"}
					</button>
				</div>

				<!-- TODO: loop through array of new + original vals	 -->
				<p>Account risked per trade = {riskPerc}%</p>
				{#if newRiskPerc !== riskPerc && newRiskPerc !== null}
					<p class="changeVal">=> {newRiskPerc}% UNSAVED</p>
				{/if}

				<p class="breaker">* * *</p>

				<h4 class="section-head">Settings Config</h4>
				<div class="form">
					<div class="mb-3">
						<label for="riskPerc" class="form-label">
							Risk % per trade</label
						>
						<input
							type="number"
							class="form-control"
							id="riskPerc"
							placeholder="20"
							bind:value={newRiskPerc}
						/>
					</div>
					<div class="mb-3">
						<label for="leverage" class="form-label">
							Leverage</label
						>
						<input
							type="number"
							class="form-control"
							id="leverage"
							placeholder="5"
						/>
					</div>
				</div>
			</div>
			<div class="col-sm-2 col-md-3" />
		</div>
	</div>
</main>

<style type="text/scss">
@import "../../static/styles/_all";

	div.red {
		border: $blood 3px solid;
    border-radius: 3px;
		color: $ivory;
		text-align: center;
		margin: 1.5em auto 1.5em auto;
		padding: 1.5rem;
	}

	p.changeVal {
		color: red;
	}
</style>
