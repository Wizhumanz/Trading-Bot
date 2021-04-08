"use strict";

var mockLoginResp = [
  {
    "message": "Successfully logged in!",
    "body": "5632499082330112"
  }
];

page.setRequestInterception(true);

page.on('request', request => {
  console.log("Req in: " + request.url())

  if (request.url() === 'https://ana-api.myika.co/login') {
    console.log("Intercepting")
    request.respond({
      content: 'application/json',
      body: JSON.stringify(mockLoginResp),
      status: 200,
    })
  } else request.continue()
})

page
  .on('console', message =>
    console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
  .on('pageerror', ({ message }) => console.log(message))
  .on('response', response =>
    console.log(`${response.status()} ${response.url()}`))
  .on('requestfailed', request =>
    console.log(`${request.failure().errorText} ${request.url()}`))

// tests

describe("Login page", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3001");
  });

  it("should show login page", () => {
    expect(page).toMatch("Sign In")
    expect(page).toMatch("Register")
  })

  it("should show active bots after login", async (done) => {
    await page.$eval("#emailLogin", el => el.value = "t@trader.com");
    await page.$eval("#passwordLogin", el => el.value = "trader");
    await page.$eval("#signInBtn", elem => elem.click());

    setTimeout(() => {
      expect(page.url()).toMatch("http://localhost:3001/bots/active")
      expect(page).toMatch("Active Bots")
      expect(page).toMatch("Leverage")
      done()
    }, 7000)
  }, 13000)
});

// it("checking All Listings page", async () => {
  //   await page.goto("http://localhost:3000/listings/all");
  //   await expect(page).toMatch("All Listings")
  //   await page.click("#flexCheckDefault");
  //   await page.click("#flexCheckChecked");
  // })
  // it("checking Pending Listings page", async () => {
  //   await page.goto("http://localhost:3000/listings/pending");
  //   await expect(page).toMatch("Pending Listings")
  //   await page.click("#flexCheckDefault");
  //   await page.click("#flexCheckPending");
  // })
  // it("checking Add Listings page", async () => {
  //   await page.goto("http://localhost:3000/add");
  //   await expect(page).toMatch("Add Listing")
  //   await expect(page).toMatch("Manual Add")
  //   await page.click("#excel-upload");
  //   await page.click("#name");
  //   await page.type("#name", "Diamond Villa");
  //   await page.click("#address");
  //   await page.type("#address", "ABC");
  //   await page.click("#listingType");
  //   await page.select("[id="listingType"]", "Buy");
  //   await page.click("#price");
  //   await page.type("#price", "1000");
  //   await page.click(".form");
  //   await page.click("[type="submit"]");
  // })