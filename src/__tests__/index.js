
describe('Login page', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3001');
  });

  it('should show login page', () => {
    expect(page).toMatch('Sign In')
    expect(page).toMatch('Register')
  })

  it('should show active bots after login', () => {
    page.click("#emailLogin");
    page.type("#emailLogin", 't@trader.com');
    page.click("#passwordLogin");
    page.type("#passwordLogin", 'trader');
    page.click("[type='submit']");
    setTimeout(() => {
      expect(page.url()).toMatch('http://localhost:3001/bots/active')
    }, 7000)
  })
});

// it('checking All Listings page', async () => {
  //   await page.goto('http://localhost:3000/listings/all');
  //   await expect(page).toMatch('All Listings')
  //   await page.click("#flexCheckDefault");
  //   await page.click("#flexCheckChecked");
  // })
  // it('checking Pending Listings page', async () => {
  //   await page.goto('http://localhost:3000/listings/pending');
  //   await expect(page).toMatch('Pending Listings')
  //   await page.click("#flexCheckDefault");
  //   await page.click("#flexCheckPending");
  // })
  // it('checking Add Listings page', async () => {
  //   await page.goto('http://localhost:3000/add');
  //   await expect(page).toMatch('Add Listing')
  //   await expect(page).toMatch('Manual Add')
  //   await page.click("#excel-upload");
  //   await page.click("#name");
  //   await page.type("#name", 'Diamond Villa');
  //   await page.click("#address");
  //   await page.type("#address", 'ABC');
  //   await page.click("#listingType");
  //   await page.select("[id='listingType']", 'Buy');
  //   await page.click("#price");
  //   await page.type("#price", '1000');
  //   await page.click(".form");
  //   await page.click("[type='submit']");
  // })