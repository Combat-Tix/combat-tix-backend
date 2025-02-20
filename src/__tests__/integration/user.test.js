import mongoose from "mongoose";
import User from "../../models/user";

describe("User Model Tests", () => {
  it("Should the fullName be visible in the object", async () => {
    const user = new User({ firstName: "Olawole", lastName: "Omosuyi" });
    user.toObject();
    expect(user.fullName).toBe("Olawole Omosuyi");
  });
  describe("Phone Number", () => {
    it("Should the phone Number field be required", async () => {
      const user = new User({});
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.phoneNumber).toBeDefined();
    });
    it("Should Error if the phone Number field if not of a Number type", async () => {
      const user = new User({ phoneNumber: "ol" });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.phoneNumber).toBeDefined();
    });
    it("Should pass if the phone Number field is of a Number type", async () => {
      const user = new User({ phoneNumber: "+234 90" });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.phoneNumber).not.toBeDefined();
    });
  });
  describe("Email", () => {
    it("Should the email field be required", async () => {
      const user = new User({});
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.email).toBeDefined();
    });
    it("Should throw an error if the email is invalid", async () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test-gmail.com",
        password: "Test1234##",
        phoneNumber: 90,
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.email).toBeDefined();
      expect(validationErrors.errors.email.message).toBe("Please provide a valid email address");
    });
    it("Should pass if the email is valid", async () => {
      const user = new User({
        email: "test@gmail.com",
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.email).not.toBeDefined();
    });
  });
  describe("Password", () => {
    it("Should the password field be required", async () => {
      const user = new User({});
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.password).toBeDefined();
    });
    it("Should throw an error if password is less than 8 characters", async () => {
      const user = new User({
        fullName: "Omosuyi Olawole",
        email: "test@gmail.com",
        password: "e",
        phoneNumber: 90,
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.password).toBeDefined();
      expect(validationErrors.errors.password.message).toBe("Password must be at least 8 characters long");
    });
    it('Should pass if password meets the security requirements which is "Password must contain at least one lowercase character, one uppercase character, and one number, symbol, or whitespace character",', async () => {
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
      expect(validationErrors.errors.password).toBeDefined();
      expect(validationErrors.errors.password.message).toBe(
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
        role: "fighter",
        dateOfBirth: "",
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.dateOfBirth).toBeDefined();
      expect(validationErrors.errors.dateOfBirth.message).toBe("Please provide date of birth");
    });
    it("Should date of birth field be optional if the user is not a fighter", async () => {
      const user = new User({
        role: "promoter",
        dateOfBirth: "",
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.dateOfBirth).not.toBeDefined();
    });
    it("Should pass if the date of birth is supplied for a fighter role", async () => {
      const user = new User({
        role: "fighter",
        dateOfBirth: new Date(),
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.dateOfBirth).not.toBeDefined();
    });
  });
  describe.skip("Business", () => {
    //TODO fix issue
    it("Should the user verification number be required if business name is provided", () => {
      const user = new User({
        business: {
          name: "My business",
          verificationNumber: "",
        },
      });
      const validationErrors = user.validateSync();
      console.log(validationErrors);
      expect(validationErrors.errors.business.verificationNumber).toBeDefined();
      expect(validationErrors.errors.business.verificationNumber.message).toBe(
        "Business registration number is required"
      );
    });
    it("Should the user verification number be optional if business name is not provided", () => {
      const user = new User({
        business: {
          verificationNumber: "",
        },
      });
      const validationErrors = user.validateSync();
      expect(validationErrors.errors.business.verificationNumber).not.toBeDefined();
    });
    it("Should the business verification status (isVerified) field be a valid field in the schema", () => {
      const user = new User({ business: { isVerified: false } });
      expect(user.business.isVerified).toBeDefined();
    });
    describe("Address", () => {
      it("Should the business street address be required if business name is provided", () => {
        const user = new User({
          business: {
            name: "My Test Business",
            address: {
              street: "",
            },
          },
        });
        const validationErrors = user.validateSync();
        console.log(validationErrors);
        expect(validationErrors.errors.business.address.street).toBeDefined();
        expect(validationErrors.errors.business.address.street).toBe(
          "Please enter the street where your business is located."
        );
      });
      it("Should the business city name be required if business name is provided", () => {
        const user = new User({
          business: {
            name: "My Test Business",
            address: {
              city: "",
            },
          },
        });
        const validationErrors = user.validateSync();
        expect(validationErrors.errors.business.address.city).toBeDefined();
        expect(validationErrors.errors.business.address.city).toBe(
          "Please enter the city where your business is located."
        );
      });
      it("Should the business postal code be required if business name is provided", () => {
        const user = new User({
          business: {
            name: "My Test Business",
            address: {
              postalCode: "",
            },
          },
        });
        const validationErrors = user.validateSync();
        expect(validationErrors.errors.business.address.street).toBeDefined();
        expect(validationErrors.errors.business.address.street).toBe(
          "Please enter your business's postal code."
        );
      });
      it("Should the business country be required if business name is provided", () => {
        const user = new User({
          business: {
            name: "My Test Business",
            address: {
              country: "",
            },
          },
        });
        const validationErrors = user.validateSync();
        expect(validationErrors.errors.business.address.street).toBeDefined();
        expect(validationErrors.errors.business.address.street).toBe(
          "Please enter the country where your business is located."
        );
      });
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
