import "angular2/testing";

export class DashPage {
  navigateTo() { return browser.get('/'); }
  getParagraphText() { return element(by.css('Dash-app p')).getText(); }
}
