import { writable } from 'svelte/store'

var user = (typeof window !== 'undefined') && (localStorage.getItem("user"))
  ? localStorage.getItem("user")
  : "";
export var storeUser = writable(user)
storeUser.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("user", value); //value already stringified before setting to store
  }
});

export var currentPage = writable('')

var localTheme = (typeof window !== 'undefined') && (localStorage.getItem("theme"))
  ? localStorage.getItem("theme")
  : "";
export var storeAppTheme = writable(localTheme)
storeAppTheme.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("theme", value);
  }
});
