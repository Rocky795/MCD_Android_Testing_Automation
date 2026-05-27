const { androidPaths } = require('../constants/android.selector');

class CasePage {
    async scrollToProduct(productName) {
        // 1. Grab the scrollable string
        let scrollSelector = androidPaths.dynamic_scroll_to_text;
        
        // 2. Inject the product name you want to find
        scrollSelector = scrollSelector.replace("{TEXT}", productName);
        
        // 3. WebdriverIO will now tell Android to scroll until it sees it!
        const element = await $(scrollSelector);
        await element.waitForDisplayed({ timeout: 10000 });
        return element;
    }
}