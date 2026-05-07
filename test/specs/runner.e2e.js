import { login } from "../flows/login.flow.js";
import { checkUserProfile } from "../flows/profile.flow.js";

describe("MASTER APP FLOW", () => {

    it("Step 1 - Login", async () => {
        await login();
    });

    it("Step 2 - Check User Profile", async () => {
        await checkUserProfile();
    });

    

});