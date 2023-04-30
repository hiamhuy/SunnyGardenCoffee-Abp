import { SunnyGardenCoffeeTemplatePage } from './app.po';

describe('SunnyGardenCoffee App', function() {
  let page: SunnyGardenCoffeeTemplatePage;

  beforeEach(() => {
    page = new SunnyGardenCoffeeTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
