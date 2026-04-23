const { androidPaths } = require("../selectors/android.selector");

class ProductsPage {
  get backpackItem() {
    return $(androidPaths.backpackItem);
  }

  async clickBackpack() {
    await this.backpackItem.click();
  }
}

module.exports = new ProductsPage();
