import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('PUMApp', function() {
  it('should have a title', function() {
    browser.get('http://pum.nlsn.se/');

    expect(browser.getTitle()).toEqual('PUMApp');
  });
});
