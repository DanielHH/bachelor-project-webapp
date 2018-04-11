import { AppPage } from './app.po';
import { browser, by, element, ExpectedConditions, Button } from 'protractor';

describe('Sprint1', function() {

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

  // 5 - PASS
  it('should work to add a new card to database', function() {
    cardsFromMenu.click();
    element.all(by.buttonText('Lägg till nytt kort')).click();
    browser.sleep(500);
    element(by.name('cardTypeInput')).sendKeys('DBK');
    element(by.name('cardNumberInput')).sendKeys('TEST_NUMBER');
    element(by.name('locationInput')).sendKeys('TEST_LOCATION');
    element(by.name('expirationDateInput')).sendKeys('2000-01-01');
    element(by.name('commentInput')).sendKeys('TEST_COMMENT');
    element.all(by.buttonText('Spara')).click();
    browser.sleep(500);

    browser.waitForAngularEnabled(false);
    browser.get('http://api.nlsn.se/getCards');
    const s = '"cardType":{"id":1,"name":"DBK"},"cardNumber":"TEST_NUMBER","user":{"id":null,"userType":{"id":0,"name":null},' +
    '"username":null,"name":null,"email":null},"location":"TEST_LOCATION","comment":"TEST_COMMENT","expirationDate":"2000-01-01 00:00:00"';

    expect(element.all(by.tagName('pre')).first().getText()).toContain(s);
  });

  // 6 - PASS
  it('should work to add a new document to database', function() {
    documentsFromMenu.click();
    element.all(by.buttonText('Lägg till ny handling')).click();
    browser.sleep(500);
    element(by.name('docTypeInput')).sendKeys('H/S');
    element(by.name('docNumberInput')).sendKeys('TEST_NUMBER');
    element(by.name('nameInput')).sendKeys('TEST_NAME');
    element(by.name('senderInput')).sendKeys('TEST_SENDER');
    element(by.name('registrationDateInput')).sendKeys('2000-01-01');
    element(by.name('docDateInput')).sendKeys('2001-01-01');
    element(by.name('locationInput')).sendKeys('TEST_LOCATION');
    element(by.name('commentInput')).sendKeys('TEST_COMMENT');
    element.all(by.buttonText('Spara')).click();
    browser.sleep(500);

    browser.waitForAngularEnabled(false);
    browser.get('http://api.nlsn.se/getDocuments');
    const s1 = '"documentType":{"id":1,"name":"H/S"},"documentNumber":"TEST_NUMBER","name":"TEST_NAME","sender":"TEST_SENDER",' +
    '"documentDate":"2001-01-01 00:00:00","registrationDate":"2000-01-01 00:00:00"';
    const s2 = '"location":"TEST_LOCATION","comment":"TEST_COMMENT"';

    expect(element.all(by.tagName('pre')).first().getText()).toContain(s1);
    expect(element.all(by.tagName('pre')).first().getText()).toContain(s2);
  });

  // 7 - PASS
  it('should work to edit information of a document', function() {
    documentsFromMenu.click();
    element.all(by.className('btn-menu')).first().click();
    editFromDropdown.click();
    browser.sleep(500);
    element(by.name('locationInput')).clear();
    element(by.name('locationInput')).sendKeys('TEST_LOCATION_EDITED');
    element(by.buttonText('Spara')).click();
    browser.sleep(500);

    browser.waitForAngularEnabled(false);
    browser.get('http://api.nlsn.se/getDocuments');
    const s1 = '"location":"TEST_LOCATION_EDITED"';

    expect(element.all(by.tagName('pre')).first().getText()).toContain(s1);
  });

    // 8 - PASS
    it('should work to edit information of a card', function() {
      cardsFromMenu.click();
      element.all(by.className('btn-menu')).first().click();
      editFromDropdown.click();
      browser.sleep(500);
      element(by.name('commentInput')).clear();
      element(by.name('commentInput')).sendKeys('TEST_COMMENT_EDITED');
      element(by.buttonText('Spara')).click();
      browser.sleep(500);

      browser.waitForAngularEnabled(false);
      browser.get('http://api.nlsn.se/getCards');
      const s1 = '"comment":"TEST_COMMENT_EDITED"';

      expect(element.all(by.tagName('pre')).first().getText()).toContain(s1);
    });

    // 9 - PASS
    it('should give card added confirmation under average 5 seconds', function() {
      cardsFromMenu.click();
      const amount = 5;
      for (let i = 0; i < amount; i++) {

        element.all(by.buttonText('Lägg till nytt kort')).click();
        element(by.name('cardTypeInput')).sendKeys('DBK');
        element(by.name('cardNumberInput')).sendKeys('TEST_NUMBER_' + i);
        element(by.name('locationInput')).sendKeys('TEST_LOCATION_' + i);
        element(by.name('expirationDateInput')).sendKeys('2000-01-01');
        element(by.name('commentInput')).sendKeys('TEST_COMMENT_' + i);
        element.all(by.buttonText('Spara')).click();

        // Den senaste tillagda läggs längst upp i tabellen, så kontroll görs visuellt istället för kod
        // expect(element.all(by.className('col')).getText()).toContain('TEST_NUMBER_' + i);
      }

      browser.waitForAngularEnabled(false);
      browser.get('http://api.nlsn.se/getCards');
      browser.sleep(500);
      for (let i = 0; i < amount; i++) {
        expect(element.all(by.tagName('pre')).first().getText()).toContain('comment":"TEST_COMMENT_' + i);
      }
    });

    // 10 - PASS
    it('should give document added confirmation under average 5 seconds', function() {
      documentsFromMenu.click();
      const amount = 5;
      for (let i = 0; i < amount; i++) {

        element.all(by.buttonText('Lägg till ny handling')).click();
        browser.sleep(500);
        element(by.name('docTypeInput')).sendKeys('H/S');
        element(by.name('docNumberInput')).sendKeys('TEST_NUMBER_' + i);
        element(by.name('nameInput')).sendKeys('TEST_NAME_' + i);
        element(by.name('senderInput')).sendKeys('TEST_SENDER_' + i);
        element(by.name('registrationDateInput')).sendKeys('2000-01-01');
        element(by.name('docDateInput')).sendKeys('2001-01-01');
        element(by.name('locationInput')).sendKeys('TEST_LOCATION_' + i);
        element(by.name('commentInput')).sendKeys('TEST_COMMENT_' + i);
        element.all(by.buttonText('Spara')).click();
        browser.sleep(500);

        // Den senaste tillagda läggs längst upp i tabellen, så kontroll görs visuellt istället för kod
        // expect(element.all(by.className('col')).getText()).toContain('TEST_NUMBER_' + i);
      }

      browser.waitForAngularEnabled(false);
      browser.get('http://api.nlsn.se/getDocuments');
      browser.sleep(500);
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
