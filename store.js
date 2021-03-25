import { writable } from 'svelte/store'

var user = typeof window !== 'undefined' ? localStorage.getItem("user") : "";
export var storeUser = writable(user)
storeUser.subscribe(user => {
  if (typeof window !== 'undefined' && user) {
    localStorage.setItem("user", user); //value already stringified before setting to store
  }
});

export var resetState = writable(false)
export var currentPage = writable('')