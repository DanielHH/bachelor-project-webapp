import { AppPage } from './app.po';
import { browser, by, element, ExpectedConditions, Button } from 'protractor';

describe('PUMApp', function() {

  const documentsFromMenu = element(by.linkText('Handlingar'));
  const cardFromMenu = element(by.linkText('Kort'));
  const receiptsFromMenu = element(by.linkText('Kvittenser'));
  const logsFromMenu = element(by.linkText('Loggar'));

  const editFromDropdown = element(by.linkText('Ändra'));
  const lostFromDropdown = element(by.linkText('Borttappat'));
  const resetFromDropdown = element(by.linkText('Återställ'));

  beforeEach(function() {
    browser.get('http://pum.nlsn.se/');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('PUMApp');
  });

  it('should work to click documents in the side-menu', function() {
    documentsFromMenu.click();
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/documents');
  });

  it('should work to click cards in the side-menu', function() {
    cardFromMenu.click();
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/cards');
  });

  it('should work to click receipts in the side-menu', function() {
    receiptsFromMenu.click();
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/receipts');
  });

  it('should work to click logs in the side-menu', function() {
    logsFromMenu.click();
    expect(browser.getCurrentUrl()).toEqual('http://pum.nlsn.se/logs');
  });

  it('should work to click edit in the dropdown-menu', function() {
    cardFromMenu.click();
    element.all(by.className('btn-menu')).first().click();
    editFromDropdown.click();
    browser.sleep(500);
    expect(element(by.buttonText('Submit')).isDisplayed()).toBe(true);
    element(by.id('locationInput')).clear();
    element(by.id('locationInput')).sendKeys('Skåp 55');
    browser.sleep(500);
    element(by.buttonText('Submit')).click();
    browser.sleep(500);
    expect(element.all(by.className('col')).getText()).toContain('Skåp 55');
  });

  it('should work to click lost and reset in the dropdown-menu', function() {
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
});
