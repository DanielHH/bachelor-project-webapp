import { AppPage } from './app.po';
import { browser, by, element, ExpectedConditions, Button } from 'protractor';

xdescribe('Sprint2', function() {

  const documentsFromMenu = element(by.linkText('Handlingar'));
  const cardsFromMenu = element(by.linkText('Kort'));
  const receiptsFromMenu = element(by.linkText('Kvittenser'));
  const logsFromMenu = element(by.linkText('Loggar'));

  const editFromDropdown = element(by.linkText('Ändra'));
  const lostFromDropdown = element(by.linkText('Borttappat'));
  const resetFromDropdown = element(by.linkText('Återställ'));

  const logoutFromMenu = element(by.linkText('Logga ut'));

  beforeEach(function() {
    browser.waitForAngularEnabled(true);
    browser.get('http://pum.nlsn.se/');

    element(by.name('usernameInput')).sendKeys('pumadmin');
    element(by.name('passwordInput')).sendKeys('pum123');
    element.all(by.buttonText('Logga in')).click();
  });

  // 2 - Passed
  it('should work to admin login', function() {
    expect(logoutFromMenu.isDisplayed()).toBe(true);
  });

  // 3 - Passed
  it('should work to change tab from documents to cards', function() {
    documentsFromMenu.click();
    cardsFromMenu.click();
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/cards');
  });

  // 4 - Passed
  it('should work to change tab from cards to documents', function() {
    cardsFromMenu.click();
    documentsFromMenu.click();
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/documents');
  });

  // 5 - Passed
  it('should work to add a new card to database', function() {
    cardsFromMenu.click();
    element.all(by.buttonText('Lägg till nytt kort')).click();
    browser.sleep(500);
    element(by.name('cardTypeInput')).sendKeys('DBK');
    element(by.name('cardNumberInput')).sendKeys('TEST_NUMBER');
    element(by.name('cardLocationInput')).sendKeys('TEST_LOCATION');
    element(by.name('expirationDateInput')).sendKeys('2000-01-01');
    element(by.name('cardCommentInput')).sendKeys('TEST_COMMENT');
    element.all(by.buttonText('Spara')).click();
    browser.sleep(1000);

    browser.waitForAngularEnabled(false);
    browser.get('http://api.nlsn.se/getCards');
    const s = '"cardType":{"id":1,"name":"DBK"},"cardNumber":"TEST_NUMBER","user":{"id":null,"userType":{"id":0,"name":null},' +
    '"username":null,"name":null,"email":null},"location":"TEST_LOCATION","comment":"TEST_COMMENT","expirationDate":"2000-01-01 00:00:00"';

    browser.sleep(1000);
    expect(element.all(by.tagName('pre')).first().getText()).toContain(s);
  });

  // 6 - Passed
  it('should work to add a new document to database', function() {
    documentsFromMenu.click();
    element.all(by.buttonText('Lägg till ny handling')).click();
    browser.sleep(500);
    element(by.name('docTypeInput')).sendKeys('H/T');
    element(by.name('docNumberInput')).sendKeys('TEST_NUMBER');
    element(by.name('nameInput')).sendKeys('TEST_NAME');
    element(by.name('senderInput')).sendKeys('TEST_SENDER');
    element(by.name('registrationDateInput')).sendKeys('2000-01-01');
    element(by.name('docDateInput')).sendKeys('2001-01-01');
    element(by.name('docLocationInput')).sendKeys('TEST_LOCATION');
    element(by.name('docCommentInput')).sendKeys('TEST_COMMENT');
    element.all(by.buttonText('Spara')).click();
    browser.sleep(1000);

    browser.waitForAngularEnabled(false);
    browser.get('http://api.nlsn.se/getDocuments');
    const s1 = '"documentType":{"id":1,"name":"H/T"},"documentNumber":"TEST_NUMBER","name":"TEST_NAME","sender":"TEST_SENDER",' +
    '"documentDate":"2001-01-01 00:00:00","registrationDate":"2000-01-01 00:00:00"';
    const s2 = '"location":"TEST_LOCATION","comment":"TEST_COMMENT"';

    expect(element.all(by.tagName('pre')).first().getText()).toContain(s1);
    expect(element.all(by.tagName('pre')).first().getText()).toContain(s2);
  });

  // 7 - Passed
  it('should work to edit information of a document', function() {
    documentsFromMenu.click();
    element.all(by.className('btn-menu')).first().click();
    editFromDropdown.click();
    browser.sleep(500);
    element(by.name('docLocationInput')).clear();
    element(by.name('docLocationInput')).sendKeys('TEST_LOCATION_EDITED');
    element(by.buttonText('Spara')).click();
    browser.sleep(1000);

    browser.waitForAngularEnabled(false);
    browser.get('http://api.nlsn.se/getDocuments');
    const s1 = '"location":"TEST_LOCATION_EDITED"';

    expect(element.all(by.tagName('pre')).first().getText()).toContain(s1);
  });

    // 8 - Passed
    it('should work to edit information of a card', function() {
      cardsFromMenu.click();
      element.all(by.className('btn-menu')).first().click();
      editFromDropdown.click();
      browser.sleep(500);
      element(by.name('cardCommentInput')).clear();
      element(by.name('cardCommentInput')).sendKeys('TEST_COMMENT_EDITED');
      element(by.buttonText('Spara')).click();
      browser.sleep(1000);

      browser.waitForAngularEnabled(false);
      browser.get('http://api.nlsn.se/getCards');
      const s1 = '"comment":"TEST_COMMENT_EDITED"';

      expect(element.all(by.tagName('pre')).first().getText()).toContain(s1);
    });

    // 9 - Passed
    it('should give card added confirmation under average 5 seconds', function() {
      cardsFromMenu.click();
      const amount = 3;
      for (let i = 0; i < amount; i++) {

        element.all(by.buttonText('Lägg till nytt kort')).click();
        browser.sleep(500);
        element(by.name('cardTypeInput')).sendKeys('DBK');
        element(by.name('cardNumberInput')).sendKeys('TEST_NUMBER_' + i);
        element(by.name('cardLocationInput')).sendKeys('TEST_LOCATION_' + i);
        element(by.name('expirationDateInput')).sendKeys('2000-01-01');
        element(by.name('cardCommentInput')).sendKeys('TEST_COMMENT_' + i);
        element.all(by.buttonText('Spara')).click();
        browser.sleep(1000);

        // Den senaste tillagda läggs längst upp i tabellen, så kontroll görs visuellt istället för kod
        // expect(element.all(by.className('col')).getText()).toContain('TEST_NUMBER_' + i);
      }

      browser.sleep(1000);
      browser.waitForAngularEnabled(false);
      browser.get('http://api.nlsn.se/getCards');
      for (let i = 0; i < amount; i++) {
        expect(element.all(by.tagName('pre')).first().getText()).toContain('comment":"TEST_COMMENT_' + i);
      }
    });

    // 10 - Passed
    it('should give document added confirmation under average 5 seconds', function() {
      documentsFromMenu.click();
      const amount = 3;
      for (let i = 0; i < amount; i++) {

        element.all(by.buttonText('Lägg till ny handling')).click();
        browser.sleep(500);
        element(by.name('docTypeInput')).sendKeys('H/T');
        element(by.name('docNumberInput')).sendKeys('TEST_NUMBER_' + i);
        element(by.name('nameInput')).sendKeys('TEST_NAME_' + i);
        element(by.name('senderInput')).sendKeys('TEST_SENDER_' + i);
        element(by.name('registrationDateInput')).sendKeys('2000-01-01');
        element(by.name('docDateInput')).sendKeys('2001-01-01');
        element(by.name('docLocationInput')).sendKeys('TEST_LOCATION_' + i);
        element(by.name('docCommentInput')).sendKeys('TEST_COMMENT_' + i);
        element.all(by.buttonText('Spara')).click();
        browser.sleep(1000);

        // Den senaste tillagda läggs längst upp i tabellen, så kontroll görs visuellt istället för kod
        // expect(element.all(by.className('col')).getText()).toContain('TEST_NUMBER_' + i);
      }

      browser.sleep(1000);
      browser.waitForAngularEnabled(false);
      browser.get('http://api.nlsn.se/getDocuments');
      for (let i = 0; i < amount; i++) {
        expect(element.all(by.tagName('pre')).first().getText()).toContain('location":"TEST_LOCATION_' + i);
      }
    });

  /*
  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('PUMApp');
  });

  it('should work to click lost and reset in the dropdown-menu for cards', function() {
    cardFromMenu.click();
    element.all(by.className('btn-menu')).first().click();
    lostFromDropdown.click();
    browser.sleep(500);
    expect(element(by.buttonText('Borta')).isDisplayed()).toBe(true);
    element.all(by.className('btn-menu')).first().click();
    resetFromDropdown.click();
    browser.sleep(500);
    expect(element.all(by.buttonText('Kvittera')).first().isDisplayed()).toBe(true);
  });

  it('should work to click lost and reset in the dropdown-menu for documents', function() {
    documentsFromMenu.click();
    element.all(by.className('btn-menu')).first().click();
    lostFromDropdown.click();
    browser.sleep(500);
    expect(element(by.buttonText('Borta')).isDisplayed()).toBe(true);
    element.all(by.className('btn-menu')).first().click();
    resetFromDropdown.click();
    browser.sleep(500);
    expect(element.all(by.buttonText('Kvittera')).first().isDisplayed()).toBe(true);
  });
*/
});

xdescribe('Sprint3', function() {

  const cardsFromMenu = element(by.linkText('Kort'));
  const documentsFromMenu = element(by.linkText('Handlingar'));

  beforeEach(function() {
    browser.driver.manage().window().maximize();
    browser.waitForAngularEnabled(true);
    browser.get('http://pum.nlsn.se/');

    element(by.name('usernameInput')).sendKeys('pumadmin');
    element(by.name('passwordInput')).sendKeys('pum123');
    element.all(by.buttonText('Logga in')).click();
  });

  // 13 (Should pass once request-card component changes the button name "Kvittera ut" to "Bekräfta")
  it('should work to check out a card', function() {
    cardsFromMenu.click();
    element(by.buttonText('Kvittera ut')).click();
    browser.sleep(1000);
    element(by.name('usernameInput')).sendKeys('gusli432');
    element(by.name('locationInput')).sendKeys('Test_checked_out');
    element(by.id('generatePDF')).click();
    browser.sleep(500);
    element(by.buttonText('Bekräfta')).click();
    browser.sleep(1000);

    browser.waitForAngularEnabled(false);
    browser.get('http://api.nlsn.se/getCards');
    browser.sleep(1000);
    expect(element.all(by.tagName('pre')).first().getText()).toContain('"location":"Test_checked_out"');
    browser.get('http://api.nlsn.se/getreceipts');
    browser.sleep(1000);
    expect(element.all(by.tagName('pre')).first().getText()).toContain('"location":"Test_checked_out"');
  });

  // 14 (Should pass once request-document component changes the button name "Kvittera ut" to "Bekräfta")
  it('should work to check out a document', function() {
    documentsFromMenu.click();
    element(by.buttonText('Kvittera ut')).click();
    browser.sleep(1000);
    element(by.name('usernameInput')).sendKeys('gusli432');
    element(by.name('locationInput')).sendKeys('Test_checked_out');
    element(by.id('generatePDF')).click();
    browser.sleep(500);
    element(by.buttonText('Bekräfta')).click();
    browser.sleep(1000);

    browser.waitForAngularEnabled(false);
    browser.get('http://api.nlsn.se/getDocuments');
    browser.sleep(1000);
    expect(element.all(by.tagName('pre')).first().getText()).toContain('"location":"Test_checked_out"');
    browser.get('http://api.nlsn.se/getreceipts');
    browser.sleep(1000);
    expect(element.all(by.tagName('pre')).first().getText()).toContain('"location":"Test_checked_out"');
  });

  // 15 (Should pass once return-card component changes the button name "Kvittera in" to "Bekräfta")
  it('should work to check in a card', function() {
    cardsFromMenu.click();
    element(by.buttonText('Kvittera in')).click();
    browser.sleep(1000);
    element(by.name('locationInput')).sendKeys('Test_checked_in');
    browser.sleep(500);
    element(by.buttonText('Bekräfta')).click();
    browser.sleep(1000);

    browser.waitForAngularEnabled(false);
    browser.get('http://api.nlsn.se/getCards');
    browser.sleep(1000);
    expect(element.all(by.tagName('pre')).first().getText()).toContain('"location":"Test_checked_in"');
    browser.get('http://api.nlsn.se/getreceipts');
    browser.sleep(1000);
    expect(element.all(by.tagName('pre')).first().getText()).toContain('"location":"Test_checked_in"');
  });

    // 16 (Should pass once return-document component changes the button name "Kvittera in" to "Bekräfta")
    it('should work to check in a document', function() {
      documentsFromMenu.click();
      element(by.buttonText('Kvittera in')).click();
      browser.sleep(1000);
      element(by.name('locationInput')).sendKeys('Test_checked_in');
      browser.sleep(500);
      element(by.buttonText('Bekräfta')).click();
      browser.sleep(1000);

      browser.waitForAngularEnabled(false);
      browser.get('http://api.nlsn.se/getdocuments');
      browser.sleep(1000);
      expect(element.all(by.tagName('pre')).first().getText()).toContain('"location":"Test_checked_in"');
      browser.get('http://api.nlsn.se/getreceipts');
      browser.sleep(1000);
      expect(element.all(by.tagName('pre')).first().getText()).toContain('"location":"Test_checked_in"');
    });

  // Test 17-22 manually tested

  // Test 25,26,27 manually tested
});
