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
    browser.driver.manage().window().maximize();
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
  const historyFromDropdown = element(by.linkText('Historik'));

  beforeEach(function() {
    browser.driver.manage().window().maximize();
    browser.waitForAngularEnabled(true);
    browser.get('http://pum.nlsn.se/');

    element(by.name('usernameInput')).sendKeys('pumadmin');
    element(by.name('passwordInput')).sendKeys('pum123');
    element.all(by.buttonText('Logga in')).click();
  });

  // 11
  it('should work to click history in dropdown-menu for cards', function() {
    cardsFromMenu.click();
    element.all(by.className('btn-menu')).first().click();
    historyFromDropdown.click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/card-history');
  });

  // 12
  it('should work to click history in dropdown-menu for documents', function() {
    documentsFromMenu.click();
    element.all(by.className('btn-menu')).first().click();
    historyFromDropdown.click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/document-history');
  });

  // 13 (Should pass once request-card component changes the button name "Kvittera ut" to "Bekräfta")
  it('should work to check out a card', function() {
    cardsFromMenu.click();
    element(by.buttonText('Kvittera ut')).click();
    browser.sleep(500);
    element(by.name('usernameInput')).sendKeys('gusli432');
    element(by.name('locationInput')).sendKeys('Test_checked_out');
    element(by.id('generatePDF')).click();
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
    browser.sleep(500);
    element(by.name('usernameInput')).sendKeys('gusli432');
    element(by.name('locationInput')).sendKeys('Test_checked_out');
    element(by.id('generatePDF')).click();
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
    browser.sleep(500);
    element(by.name('locationInput')).sendKeys('Test_checked_in');
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
      browser.sleep(500);
      element(by.name('locationInput')).sendKeys('Test_checked_in');
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

  // Test 17-27 manually tested
});


///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

xdescribe('Sprint4', function() {

  const logsFromMenu = element(by.linkText('Loggar'));
  const logoutFromMenu = element(by.linkText('Logga ut'));
  const cardsFromMenu = element(by.linkText('Kort'));
  const documentsFromMenu = element(by.linkText('Handlingar'));
  const editFromDropdown = element(by.linkText('Ändra'));

  beforeEach(function() {
    browser.waitForAngularEnabled(true);
    browser.get('http://pum.nlsn.se/');

    element(by.name('usernameInput')).sendKeys('pumadmin');
    element(by.name('passwordInput')).sendKeys('pum123');
    element.all(by.buttonText('Logga in')).click();
  });

  // 28
  it('should check that a change to a card is added to the logs', function() {
    cardsFromMenu.click();
    element.all(by.className('btn-menu')).first().click();
    editFromDropdown.click();
    browser.sleep(500);
    element(by.name('cardCommentInput')).clear();
    element(by.name('cardCommentInput')).sendKeys('LOG_CHECK');
    element(by.buttonText('Spara')).click();
    browser.sleep(1000);

    logsFromMenu.click();
    expect(element.all(by.className('col-2')).getText()).toContain('Ändring');

  });

  // 29
  it('should check that a change to a document is added to the logs', function() {
    documentsFromMenu.click();
    element.all(by.className('btn-menu')).first().click();
    editFromDropdown.click();
    browser.sleep(500);
    element(by.name('docLocationInput')).clear();
    element(by.name('docLocationInput')).sendKeys('LOG_CHECK');
    element(by.buttonText('Spara')).click();
    browser.sleep(1000);

    logsFromMenu.click();
    expect(element.all(by.className('col-2')).getText()).toContain('Ändring');
  });

  // 31
  it('should work to change tab to logs', function() {
    logsFromMenu.click();
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/logs');
  });

  // 32
  it('should work to have 3 users log in at the same time', function() {
    const browser2 = browser.forkNewDriverInstance(true);
    browser2.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser2.element(by.name('passwordInput')).sendKeys('pum123');
    browser2.element.all(by.buttonText('Logga in')).click();

    const browser3 = browser.forkNewDriverInstance(true);
    browser3.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser3.element(by.name('passwordInput')).sendKeys('pum123');
    browser3.element.all(by.buttonText('Logga in')).click();

    browser.element(by.linkText('Kvittenser')).click();
    browser2.element(by.linkText('Kort')).click();
    browser3.element(by.linkText('Handlingar')).click();

    browser.sleep(10000);
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/receipts');
    expect(browser2.getCurrentUrl()).toEqual('http://pum.nlsn.se/cards');
    expect(browser3.getCurrentUrl()).toEqual('http://pum.nlsn.se/documents');

    browser2.close();
    browser3.close();
  });

  // 33
  it('should work to have 20 users log in at the same time', function() {
    const browser2 = browser.forkNewDriverInstance(true);
    browser2.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser2.element(by.name('passwordInput')).sendKeys('pum123');
    browser2.element.all(by.buttonText('Logga in')).click();

    const browser3 = browser.forkNewDriverInstance(true);
    browser3.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser3.element(by.name('passwordInput')).sendKeys('pum123');
    browser3.element.all(by.buttonText('Logga in')).click();

    const browser4 = browser.forkNewDriverInstance(true);
    browser4.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser4.element(by.name('passwordInput')).sendKeys('pum123');
    browser4.element.all(by.buttonText('Logga in')).click();

    const browser5 = browser.forkNewDriverInstance(true);
    browser5.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser5.element(by.name('passwordInput')).sendKeys('pum123');
    browser5.element.all(by.buttonText('Logga in')).click();

    const browser6 = browser.forkNewDriverInstance(true);
    browser6.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser6.element(by.name('passwordInput')).sendKeys('pum123');
    browser6.element.all(by.buttonText('Logga in')).click();

    const browser7 = browser.forkNewDriverInstance(true);
    browser7.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser7.element(by.name('passwordInput')).sendKeys('pum123');
    browser7.element.all(by.buttonText('Logga in')).click();

    const browser8 = browser.forkNewDriverInstance(true);
    browser8.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser8.element(by.name('passwordInput')).sendKeys('pum123');
    browser8.element.all(by.buttonText('Logga in')).click();

    const browser9 = browser.forkNewDriverInstance(true);
    browser9.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser9.element(by.name('passwordInput')).sendKeys('pum123');
    browser9.element.all(by.buttonText('Logga in')).click();

    const browser10 = browser.forkNewDriverInstance(true);
    browser10.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser10.element(by.name('passwordInput')).sendKeys('pum123');
    browser10.element.all(by.buttonText('Logga in')).click();

    const browser11 = browser.forkNewDriverInstance(true);
    browser11.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser11.element(by.name('passwordInput')).sendKeys('pum123');
    browser11.element.all(by.buttonText('Logga in')).click();

    const browser12 = browser.forkNewDriverInstance(true);
    browser12.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser12.element(by.name('passwordInput')).sendKeys('pum123');
    browser12.element.all(by.buttonText('Logga in')).click();

    const browser13 = browser.forkNewDriverInstance(true);
    browser13.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser13.element(by.name('passwordInput')).sendKeys('pum123');
    browser13.element.all(by.buttonText('Logga in')).click();

    const browser14 = browser.forkNewDriverInstance(true);
    browser14.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser14.element(by.name('passwordInput')).sendKeys('pum123');
    browser14.element.all(by.buttonText('Logga in')).click();

    const browser15 = browser.forkNewDriverInstance(true);
    browser15.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser15.element(by.name('passwordInput')).sendKeys('pum123');
    browser15.element.all(by.buttonText('Logga in')).click();

    const browser16 = browser.forkNewDriverInstance(true);
    browser16.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser16.element(by.name('passwordInput')).sendKeys('pum123');
    browser16.element.all(by.buttonText('Logga in')).click();

    const browser17 = browser.forkNewDriverInstance(true);
    browser17.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser17.element(by.name('passwordInput')).sendKeys('pum123');
    browser17.element.all(by.buttonText('Logga in')).click();

    const browser18 = browser.forkNewDriverInstance(true);
    browser18.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser18.element(by.name('passwordInput')).sendKeys('pum123');
    browser18.element.all(by.buttonText('Logga in')).click();

    const browser19 = browser.forkNewDriverInstance(true);
    browser19.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser19.element(by.name('passwordInput')).sendKeys('pum123');
    browser19.element.all(by.buttonText('Logga in')).click();

    const browser20 = browser.forkNewDriverInstance(true);
    browser20.element(by.name('usernameInput')).sendKeys('pumadmin');
    browser20.element(by.name('passwordInput')).sendKeys('pum123');
    browser20.element.all(by.buttonText('Logga in')).click();

    browser.element(by.linkText('Kvittenser')).click();
    browser2.element(by.linkText('Kort')).click();
    browser3.element(by.linkText('Handlingar')).click();
    browser4.element(by.linkText('Kvittenser')).click();
    browser5.element(by.linkText('Kort')).click();
    browser6.element(by.linkText('Handlingar')).click();
    browser7.element(by.linkText('Kvittenser')).click();
    browser8.element(by.linkText('Kort')).click();
    browser9.element(by.linkText('Handlingar')).click();
    browser10.element(by.linkText('Kvittenser')).click();
    browser11.element(by.linkText('Kort')).click();
    browser12.element(by.linkText('Handlingar')).click();
    browser13.element(by.linkText('Kvittenser')).click();
    browser14.element(by.linkText('Kort')).click();
    browser15.element(by.linkText('Handlingar')).click();
    browser16.element(by.linkText('Kvittenser')).click();
    browser17.element(by.linkText('Kort')).click();
    browser18.element(by.linkText('Handlingar')).click();
    browser19.element(by.linkText('Kvittenser')).click();
    browser20.element(by.linkText('Kort')).click();

    browser.sleep(10000);
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/receipts');
    expect(browser2.getCurrentUrl()).toEqual('http://pum.nlsn.se/cards');
    expect(browser3.getCurrentUrl()).toEqual('http://pum.nlsn.se/documents');
    expect(browser4.getCurrentUrl()).toEqual('http://pum.nlsn.se/receipts');
    expect(browser5.getCurrentUrl()).toEqual('http://pum.nlsn.se/cards');
    expect(browser6.getCurrentUrl()).toEqual('http://pum.nlsn.se/documents');
    expect(browser7.getCurrentUrl()).toEqual('http://pum.nlsn.se/receipts');
    expect(browser8.getCurrentUrl()).toEqual('http://pum.nlsn.se/cards');
    expect(browser9.getCurrentUrl()).toEqual('http://pum.nlsn.se/documents');
    expect(browser10.getCurrentUrl()).toEqual('http://pum.nlsn.se/receipts');
    expect(browser11.getCurrentUrl()).toEqual('http://pum.nlsn.se/cards');
    expect(browser12.getCurrentUrl()).toEqual('http://pum.nlsn.se/documents');
    expect(browser13.getCurrentUrl()).toEqual('http://pum.nlsn.se/receipts');
    expect(browser14.getCurrentUrl()).toEqual('http://pum.nlsn.se/cards');
    expect(browser15.getCurrentUrl()).toEqual('http://pum.nlsn.se/documents');
    expect(browser16.getCurrentUrl()).toEqual('http://pum.nlsn.se/receipts');
    expect(browser17.getCurrentUrl()).toEqual('http://pum.nlsn.se/cards');
    expect(browser18.getCurrentUrl()).toEqual('http://pum.nlsn.se/documents');
    expect(browser19.getCurrentUrl()).toEqual('http://pum.nlsn.se/receipts');
    expect(browser20.getCurrentUrl()).toEqual('http://pum.nlsn.se/cards');
  });
});
