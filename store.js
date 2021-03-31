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
