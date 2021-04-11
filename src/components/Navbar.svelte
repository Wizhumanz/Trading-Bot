<script>
  import { goto } from "@sapper/app";
  import { storeUser, storeAppTheme } from "../../store.js";

  let appThemeIsDark = false;
  storeAppTheme.subscribe((newVal) => {
    appThemeIsDark = newVal === "dark";
  });

  var email = storeUser ? storeUser.email : null;
  storeUser.subscribe((newValue) => {
    if (newValue) {
      email = JSON.parse(newValue) ? JSON.parse(newValue).email : null;
    }
  });

  function logout() {
    storeUser.set("");
    // DO NOT reset theme on regular login, use for debug only
    // storeAppTheme.set("light");
    setTimeout(() => {
      goto("/");
      if (document) {
        document.location.reload();
      }
    }, 300);
  }

  function setLightTheme() {
    storeAppTheme.set("light");
    appThemeIsDark = false;
  }
  function setDarkTheme() {
    storeAppTheme.set("dark");
    appThemeIsDark = true;
  }
</script>

<nav
  class="navbar navbar-expand-md sticky-top {appThemeIsDark === true
    ? 'dark'
    : ''}"
  id="the-nav"
>
  <div class="container-fluid">
    <a class="navbar-brand {appThemeIsDark === true ? 'dark' : ''}" href="/"
      >Anastasia</a
    >
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <i class="bi bi-arrow-down-left-square-fill" />
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a class="nav-link disabled loggedInID" disabled
            >{email ? email : ""}</a
          >
        </li>
        {#if !email}
          <!-- <li class="nav-item">
            <a class="nav-link active" href="/">About</a>
          </li> -->
          <li class="nav-item">
            <a class="nav-link active" href="/pricing">Pricing</a>
          </li>
        {:else}
          <li class="nav-item">
            <a class="nav-link active" href="/bots/active">Active</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="/bots/all">All</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="/history">History</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="/exchanges">Exchanges</a>
          </li>
          <li class="nav-item">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a class="nav-link active" on:click={logout}>Log Out</a>
          </li>
        {/if}
        <li class="nav-tem">
          <ul id="themeSelector">
            <li>
              {#if appThemeIsDark}
                <i on:click={setLightTheme} class="bi bi-sun light" />
              {:else}
                <i
                  on:click={setLightTheme}
                  class="bi bi-brightness-high-fill light"
                />
              {/if}
            </li>
            <li>
              {#if appThemeIsDark}
                <i on:click={setDarkTheme} class="bi bi-moon-fill dark" />
              {:else}
                <i on:click={setDarkTheme} class="bi bi-moon dark" />
              {/if}
            </li>
          </ul>
        </li>
        <li class="nav-item d-md-none">
          <span>***</span>
        </li>
      </ul>
    </div>
  </div>
</nav>

<style type="text/scss">
  @import "../../static/styles/_all";

  nav {
    font-family: $title-font;
    background-color: white;
    color: black;

    // margin-bottom: 1rem;
    padding: 0;

    @media only screen and (max-width: 767px) {
      margin-bottom: 0.5rem;
    }
  }

  nav.dark {
    background-color: black;
    color: $ivory;
  }

  a.navbar-brand {
    font-size: 1.5rem;
    padding: 0;
    margin: 1rem 2rem;
    color: $blood;

    @media only screen and (max-width: 767px) {
      margin: 0.75rem 1rem;
    }
  }

  a.navbar-brand.dark {
    color: $cream;
  }

  .navbar-collapse {
    padding-top: 0;
    margin-top: 0;
  }

  .nav-link.active {
    color: inherit;
    position: relative;
    z-index: 100;
  }

  button.navbar-toggler {
    border: none;

    i {
      opacity: 100;
      color: $cream;
    }
  }

  ul.navbar-nav {
    margin-right: 0;
    margin-top: 0;
    font-size: 1.2rem;

    li {
      font-family: $body-font;
      margin: 0;
      padding: 0.25rem 1rem;

      a {
        padding: 0;
      }
    }
  }

  a.disabled:hover {
    text-decoration: none;
  }

  .loggedInID {
    color: gray !important;
  }

  #themeSelector {
    margin: 0.1rem -0.5rem auto -2.5rem;
    padding: auto -2rem auto 0;
    position: relative;
    z-index: 1;

    li {
      display: inline;
      margin: auto -0.5rem;
      padding: auto 0;

      i {
        margin: 0.75rem 0 auto 0;
        padding: auto 0;
      }
      i.light:hover {
        color: $blood;
      }
      i.dark:hover {
        color: blue;
      }
    }
  }
</style>
