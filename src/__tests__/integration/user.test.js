const User = require("../../models/user");

describe("User Model Tests", () => {
  it("Should the following fields be required", async () => {
    const user = new User({});
    try {
      await user.validate();
    } catch (validationErrors) {
      expect(validationErrors.errors["password"]).toBeDefined();
      expect(validationErrors.errors["email"]).toBeDefined();
      expect(validationErrors.errors["phoneNumber"]).toBeDefined();
      expect(validationErrors.errors["fullName"]).toBeDefined();
    }
  });
  it.only("Should the Fullname consist of the Last name and first name", async () => {
    const user = new User({
      fullName: "omosuyiolawole", //fullname must be a string of lastName and first Name seperated by a space e.g "Omosuyi Olawole"
      email: "test@gmail.com",
      password: "Test1234##",
      phoneNumber: 90,
    });
    try {
      await user.validate();
    } catch (validationErrors) {
      console.log(validationErrors);
      expect(validationErrors.errors["fullName"]).toBeDefined();
      expect(validationErrors.errors["fullName"].message).toBe("Please provide Last name and First name");
    }
  });
  it("Should the following fields have a default value when user creates an account", async () => {
    const user = new User({});
    expect(user.role).toBe("fan");
    expect(user.emailIsVerified).toBe(false);
    expect(user.userIsVerified).toBe(false);
  });
});
