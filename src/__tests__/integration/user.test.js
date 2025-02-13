import User from "../../models/user";

describe("User Model Tests", () => {
  ["phoneNumber", "email", "fullname", "password", "role", "userIsVerified", "emai;emailIsVerified"].map(
    (field) =>
      it(`Should throw an error when the required fields are missing`, async () => {
        const user = new User({});
        const validationErrors = await user.validate();
        console.log(validationErrors);
      })
  );
});
