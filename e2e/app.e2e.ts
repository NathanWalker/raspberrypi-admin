import "angular2/testing";
import { DashPage } from './app.po';

describe('dash App', function() {
  let page: DashPage;

  beforeEach(() => {
    page = new DashPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo()
    expect(page.getParagraphText()).toEqual('dash Works!');
  });
});
