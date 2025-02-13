// jest.mock("../../models/user", () => {
//   return {
//     create: jest
//       .fn()
//       .mockResolvedValueOnce({ email: "test@example.com" })
//       .mockRejectedValueOnce({ code: 11000 }),
//   };
// });
const User = require("../../models/user");
const mongoose = require("mongoose");

describe("User Model Tests", () => {
  //TODO -----------> LEARN HOW TO HASH PASSWORD and compare password
  //TODO it.only("Should a user be able to create an account", async () => {
  //   const user = new User({
  //     fullName: "Omosuyi Olawole",
  //     email: "test@gmail.com",
  //     password: "Test1234##",
  //     phoneNumber: 90,
  //   });
  //   await user.save();
  //   console.log(user);
  // });
  it("Should the following fields (password,email,phoneNumber,fullName) be required", async () => {
    const user = new User({});
    const validationErrors = user.validateSync();

    expect(validationErrors.errors["password"]).toBeDefined();
    expect(validationErrors.errors["email"]).toBeDefined();
    expect(validationErrors.errors["phoneNumber"]).toBeDefined();
    expect(validationErrors.errors["fullName"]).toBeDefined();
  });
  it("Should throw an Error if the fullname does not consist of the Last name and first name", async () => {
    const user = new User({
      fullName: "omosuyiolawole", //fullname must be a string of lastName and first Name seperated by a space e.g "Omosuyi Olawole"
      email: "test@gmail.com",
      password: "Test1234##",
      phoneNumber: 90,
    });
    const validationErrors = user.validateSync();
    expect(validationErrors.errors["fullName"]).toBeDefined();
    expect(validationErrors.errors["fullName"].message).toBe("Please provide Last name and First name");
  });
  describe("Email", () => {
    it("Should throw an error if the email is invalid", async () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test-gmail.com",
        password: "Test1234##",
        phoneNumber: 90,
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors["email"]).toBeDefined();
      expect(validationErrors.errors["email"].message).toBe("Please provide a valid email address");
    });
    it("Should pass if the email is valid", async () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test@gmail.com",
        password: "Test1234##",
        phoneNumber: 90,
      });
      const validationErrors = user.validateSync();
      expect(validationErrors).not.toBeDefined();
    });
    it("Should throw an Error when email address already exist (i.e Check uniqueness of email address)", async () => {
      await User.create({
        fullName: "Omosuyi Olawole",
        email: "test@gmail.com",
        password: "Test1234##",
        phoneNumber: 90,
      });
      try {
        await User.create({
          fullName: "Omosuyi Olawole",
          email: "test@gmail.com",
          password: "Test1234##",
          phoneNumber: 90,
        });
      } catch (validationError) {
        expect(validationError.code).toBe(11000); //where 11000 is mongodb uniqueness code error
      }
    });
  });
  describe("Password", () => {
    it("Should throw an error if password is less than 8 characters", async () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test@gmail.com",
        password: "e",
        phoneNumber: 90,
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors["password"]).toBeDefined();
      expect(validationErrors.errors["password"].message).toBe("Password must be at least 8 characters long");
    });
    it(`Should pass if password meets the security requirements which is 
       "Password must contain at least one lowercase character, 
       one uppercase character, and one number, symbol, or whitespace character",`, async () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test@gmail.com",
        password: "Test1234##",
        phoneNumber: 90,
      });
      const validationErrors = user.validateSync();
      expect(validationErrors).not.toBeDefined();
    });
    it("Should throw an Error when passwords does not meet the security requirements", async () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test@gmail.com",
        password: "est1234##",
        phoneNumber: 90,
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors["password"]).toBeDefined();
      expect(validationErrors.errors["password"].message).toBe(
        "Password must contain at least one lowercase character, one uppercase character, and one number, symbol, or whitespace character"
      );
    });
  });
  describe("Role", () => {
    it("Should the user Role have a default value of fan when user creates an account", async () => {
      const user = new User({});
      expect(user.role).toBe("fan");
    });
    ["fan", "fighter", "promoter", "admin"].map((role) => {
      it(`Should the ${role} be a valid user role`, () => {
        const user = new User({
          fullName: "Omosuyi Olawole",
          email: "test@gmail.com",
          password: "Test1234##",
          phoneNumber: 90,
          role,
        });
        const validationErrors = user.validateSync();
        expect(validationErrors).not.toBeDefined();
      });
    });
  });
  describe("Date of Birth ", () => {
    it("Should date of birth field be required if the user is a fighter", async () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test@gmail.com",
        password: "Test1234##",
        phoneNumber: 90,
        role: "fighter",
        dateOfBirth: "",
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors["dateOfBirth"]).toBeDefined();
      expect(validationErrors.errors["dateOfBirth"].message).toBe("Please provide date of birth");
    });
    it("Should date of birth field be optional if the user is not a fighter", async () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test@gmail.com",
        password: "Test1234##",
        phoneNumber: 90,
        role: "fan",
        dateOfBirth: "",
      });
      const validationErrors = user.validateSync();
      expect(validationErrors).not.toBeDefined();
    });
  });
  describe("Business", () => {
    it("Should the user verification number be required if business name is provided", () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test@gmail.com",
        password: "Test1234##",
        phoneNumber: 90,
        business: {
          name: "My Test Business",
          verificationNumber: "",
        },
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors["business.verificationNumber"]).toBeDefined();
      expect(validationErrors.errors["business.verificationNumber"].message).toBe(
        "Business registration number is required"
      );
    });
    it("Should the user verification number be optional if business name is not provided", () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test@gmail.com",
        password: "Test1234##",
        phoneNumber: 90,
        business: {
          verificationNumber: "",
        },
      });
      const validationErrors = user.validateSync();
      expect(validationErrors).not.toBeDefined();
    });
    it("Should the business verification status (isVerified) field be a valid field in the schema", () => {
      const user = new User({ business: { isVerified: false } });
      expect(user.business.isVerified).toBeDefined();
    });
    it("Should the business address field be a valid field in the schema", () => {
      const user = new User({ business: { address: "internet" } });
      expect(user.business.address).toBeDefined();
    });
  });
  describe("Fields Validity", () => {
    it("Should the website field be a valid field in the schema", () => {
      const user = new User({ website: "www.test.com" });
      expect(user.website).toBeDefined();
    });
    it("Should the gymAffiliation field be a valid field in the schema", () => {
      const user = new User({ gymAffiliation: "De latinos gym" });
      expect(user.gymAffiliation).toBeDefined();
    });
  });

  it("Should the following fields have a default value when user creates an account", async () => {
    const user = new User({});
    expect(user.emailIsVerified).toBe(false);
    expect(user.userIsVerified).toBe(false);
  });
});
