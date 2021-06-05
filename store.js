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

var gmt = (typeof window !== 'undefined') && (localStorage.getItem("gmt"))
  ? localStorage.getItem("gmt")
  : "";
export var selectedGMT = writable(gmt)
selectedGMT.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("gmt", value);
  }
});

var payment = (typeof window !== 'undefined') && (localStorage.getItem("payment"))
  ? localStorage.getItem("payment")
  : "";
export var paymentInfo = writable(payment)
paymentInfo.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("payment", value);
  }
});