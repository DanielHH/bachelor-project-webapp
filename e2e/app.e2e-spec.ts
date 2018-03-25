import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';

describe('PUMApp', function() {
  const documentsFromMenu = element(by.linkText('Handlingar'));
  const cardFromMenu = element(by.linkText('Kort'));
  const receiptsFromMenu = element(by.linkText('Kvittenser'));
  const logsFromMenu = element(by.linkText('Loggar'));

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
});
