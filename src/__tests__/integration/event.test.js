import mongoose from "mongoose";
import Event from "../../models/event";

describe("Event Model Tests", () => {
  describe("Promoter Id Field", () => {
    it("Should throw an Error if the promoter id is not provided", () => {
      const event = new Event({});
      const validationError = event.validateSync();
      expect(validationError.errors.promoterId).toBeDefined();
      expect(validationError.errors.promoterId.message).toBe("Please provide promoter id.");
    });
    it("Should throw an Error if the promoter id is not of valid mongodb object id type", () => {
      const event = new Event({ promoterId: "1234" });
      const validationError = event.validateSync();
      expect(validationError.errors.promoterId).toBeDefined();
    });
    it("Should pass if the promoter id is of valid mongodb object id type", () => {
      const event = new Event({
        promoterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
      });
      const validationError = event.validateSync();
      expect(validationError.errors.promoterId).not.toBeDefined();
    });
  });
  describe("Name Field", () => {
    it("Should throw an Error if the Event name is not provided", () => {
      const event = new Event({});
      const validationError = event.validateSync();
      expect(validationError.errors.name).toBeDefined();
      expect(validationError.errors.name.message).toBe("Please provide Event name.");
    });
    it("Should pass if the event name is of valid String type", () => {
      const event = new Event({ name: "O2 Arena" });
      const validationError = event.validateSync();
      expect(validationError.errors.name).not.toBeDefined();
    });
  });
  describe("Venue Field", () => {
    it("Should throw an Error if the Event venue is not provided", () => {
      const event = new Event({});
      const validationError = event.validateSync();
      expect(validationError.errors.venue).toBeDefined();
      expect(validationError.errors.venue.message).toBe("Please provide venue for the event.");
    });
    it("Should pass if the event venue is of valid String type", () => {
      const event = new Event({ venue: "O2 Arena" });
      const validationError = event.validateSync();
      expect(validationError.errors.venue).not.toBeDefined();
    });
  });
  describe("Capacity Field ", () => {
    it("Should throw an Error if the Event capacity is not provided", () => {
      const event = new Event({});
      const validationError = event.validateSync();
      expect(validationError.errors.capacity).toBeDefined();
      expect(validationError.errors.capacity.message).toBe("Please provide Event capacity.");
    });
    it("Should throw an Error if the Event capacity is not of valid Number type", () => {
      const event = new Event({ capacity: "12340xxx" });
      const validationError = event.validateSync();
      expect(validationError.errors.capacity).toBeDefined();
    });
    it("Should pass if the Event capacity is of valid Number type", () => {
      const event = new Event({ capacity: 10000 });
      const validationError = event.validateSync();
      expect(validationError.errors.capacity).not.toBeDefined();
    });
  });
  describe("Location Field", () => {
    it("Should throw an Error if the Event location is not provided", () => {
      const event = new Event({});
      const validationError = event.validateSync();
      expect(validationError.errors.location).toBeDefined();
      expect(validationError.errors.location.message).toBe("Please provide Event location.");
    });
    it("Should pass if the event venue is of valid String type", () => {
      const event = new Event({ location: "No. 50 02 arena" });
      const validationError = event.validateSync();
      expect(validationError.errors.location).not.toBeDefined();
    });
  });
  describe("Event Date Time Field", () => {
    describe("Date field", () => {
      it("Should throw an Error if the Event date is not provided", () => {
        const event = new Event({});
        const validationError = event.validateSync();
        expect(validationError.errors.eventDateTime.date).toBeDefined();
        expect(validationError.errors.eventDateTime.date.message).toBe("Please provide date for the event.");
      });
      it("Should throw an Error if the Event date is not of valid Date type", () => {
        const event = new Event({ eventDateTime: { date: "xxxx" } });
        const validationError = event.validateSync();
        expect(validationError.errors.eventDateTime.date).toBeDefined();
      });
      it("Should pass if the Event date is of valid Date type", () => {
        const event = new Event({ eventDateTime: { date: Date.now() } });
        const validationError = event.validateSync();
        expect(validationError.errors.eventDateTime.date).not.toBeDefined();
      });
    });
    describe("Time field", () => {
      it("Should throw an Error if the Event time is not provided", () => {
        const event = new Event({});
        const validationError = event.validateSync();
        expect(validationError.errors.eventDateTime.time).toBeDefined();
        expect(validationError.errors.eventDateTime.time.message).toBe("Please provide time for the event.");
      });

      it("Should pass if the Event time is of valid Date type", () => {
        const event = new Event({ eventDateTime: { time: "10:00 am" } });
        const validationError = event.validateSync();
        expect(validationError.errors.eventDateTime.time).not.toBeDefined();
      });
    });
  });
  describe("Event Type Field", () => {
    it("Should throw an Error if the Event type is not provided", () => {
      const event = new Event({});
      const validationError = event.validateSync();
      expect(validationError.errors.eventType).toBeDefined();
      expect(validationError.errors.eventType.message).toBe("Please provide an event type.");
    });
    it("Should pass if the Event Type is of valid String type", () => {
      const event = new Event({ eventType: "Boxing" });
      const validationError = event.validateSync();
      expect(validationError.errors.eventType).not.toBeDefined();
    });
  });
  describe("Banner URL", () => {
    it("Should throw an Error if the Banner URL is not provided", () => {
      const event = new Event({});
      const validationError = event.validateSync();
      expect(validationError.errors.bannerURL).toBeDefined();
      expect(validationError.errors.bannerURL.message).toBe("Please provide banner image.");
    });
    it("Should pass if the Banner URL is of valid String type", () => {
      const event = new Event({ bannerURL: "https://" });
      const validationError = event.validateSync();
      expect(validationError.errors.bannerURL).not.toBeDefined();
    });
  });
  describe("Images field", () => {
    it("Should pass if the Images is of valid Array type", () => {
      const event = new Event({ images: [] });

      const validationError = event.validateSync();
      expect(validationError.errors.images).not.toBeDefined();
    });
  });
  describe("Videos field", () => {
    it("Should pass if the Videos is of valid Array type", () => {
      const event = new Event({ videos: [] });
      const validationError = event.validateSync();
      expect(validationError.errors.videos).not.toBeDefined();
    });
  });
  describe("Split Percentage Field ", () => {
    it("Should throw an Error if the Split Percentage is not provided", () => {
      const event = new Event({});
      const validationError = event.validateSync();
      expect(validationError.errors.splitPercentage).toBeDefined();
      expect(validationError.errors.splitPercentage.message).toBe("Please provide split percentage.");
    });
    it("Should throw an Error if the Split Percentage is not of valid Number type", () => {
      const event = new Event({ splitPercentage: "12340xxx" });
      const validationError = event.validateSync();
      expect(validationError.errors.splitPercentage).toBeDefined();
    });
    it("Should pass if the Split Percentage is of valid Number type", () => {
      const event = new Event({ splitPercentage: 10000 });
      const validationError = event.validateSync();
      expect(validationError.errors.splitPercentage).not.toBeDefined();
    });
  });
  describe("Total amount Field ", () => {
    it("Should throw an Error if the Total amount is not of valid Number type", () => {
      const event = new Event({ totalAmount: "12340xxx" });
      const validationError = event.validateSync();
      expect(validationError.errors.totalAmount).toBeDefined();
    });
    it("Should the Total amount default to 0 if not provided ", () => {
      const event = new Event({});
      expect(event.totalAmount).toBe(0);
    });
    it("Should pass if the Total amount is of valid Number type", () => {
      const event = new Event({ totalAmount: 10000 });
      const validationError = event.validateSync();
      expect(validationError.errors.totalAmount).not.toBeDefined();
    });
  });
  describe("Promo code Field ", () => {
    it("Should promo code be visible in the event if provided", () => {
      const event = new Event({ promoCode: "12340xxx" });
      expect(event.promoCode).toBeDefined();
    });
  });
  describe("Ticket Types", () => {
    describe("Type Field", () => {
      it("Should throw an error when ticket type is not provided in an object of a ticket types array", () => {
        const event = new Event({
          ticketTypes: [{}],
          //<-------- supply all other required fields -------->
          promoterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
          splitPercentage: 50,
          bannerURL: "https://banner",
          eventType: "Boxing",
          location: "No. 50 O2 arena",
          capacity: 10000,
          venue: "02 arena",
          name: "Boxing stars event",
          eventDateTime: {
            time: "10:00am",
            date: Date.now(),
          },
        });
        const validationErrors = event.validateSync();

        expect(validationErrors.errors.ticketTypes[0].type).toBeDefined();
        expect(validationErrors.errors.ticketTypes[0].type.message).toBe("Please provide ticket type.");
      });
      ["VIP", "general", "standing", "seating"].map((type) => {
        it(`Should pass when the ${type} ticket type is provided as a ticket type`, () => {
          const event = new Event({
            ticketTypes: [{ type }],
          });
          const validationErrors = event.validateSync();
          expect(validationErrors.errors.ticketTypes[0].type).not.toBeDefined();
        });
      });
      it('Should throw an error when an invalid ticket type is provided', () => {
        const event = new Event({
          ticketTypes: [{ type: "invalid-type" }],
        });
        const validationErrors = event.validateSync();
        expect(validationErrors.errors.ticketTypes[0].type).toBeDefined();
      });
    });
    describe("Price Field", () => {
      it('Should throw an error when the ticket type is provided without a corresponding price', () => {
        const event = new Event({
          ticketTypes: [{ type: "seating", price: "" }],
        });
        const validationErrors = event.validateSync();
        expect(validationErrors.errors.ticketTypes[0].price).toBeDefined();
      });
      it('Should pass when the ticket type is provided with a corresponding price', () => {
        const event = new Event({
          ticketTypes: [{ type: "seating", price: 5000 }],
        });
        const validationErrors = event.validateSync();
        expect(validationErrors.errors.ticketTypes[0].price).not.toBeDefined();
      });
    });
  });
  describe("Fights", () => {
    describe("Team Name Field", () => {
      it("Should the teamName be available if provided when a promoter creates a fight", () => {
        const event = new Event({
          fights: [{ teams: [{ teamName: "Red warriors" }] }],
        });
        expect(event.fights[0].teams[0].teamName).toBe("Red warriors");
      });
    });
    describe("Fighters", () => {
      describe("Fighters ID", () => {
        it("Should throw an error if the fighter Id is not provided", () => {
          const event = new Event({
            fights: [{ teams: [{ fighters: [{}] }] }],
          });
          const validationErrors = event.validateSync();
          expect(validationErrors.errors.fights[0].teams[0].fighters[0].fighterId).toBeDefined();
        });
        it("Should throw an error if the fighter Id provided is not of valid mongodb object type", () => {
          const event = new Event({
            fights: [{ teams: [{ fighters: [{ fighterId: "123" }] }] }],
          });
          const validationErrors = event.validateSync();
          expect(validationErrors.errors.fights[0].teams[0].fighters[0].fighterId).toBeDefined();
        });
        it("Should pass if the fighter Id provided is of valid mongodb object type", () => {
          const event = new Event({
            fights: [
              {
                teams: [
                  {
                    fighters: [
                      {
                        fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                      },
                    ],
                  },
                ],
              },
            ],
          });
          const validationErrors = event.validateSync();
          expect(validationErrors.errors.fights[0].teams[0].fighters[0].fighterId).not.toBeDefined();
        });
      });
    });

    describe("Functionality", () => {
      it("Should allow promoter create a 1 X 1 fight match", () => {
        const event = new Event({
          fights: [
            {
              teams: [
                {
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
                {
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
              ],
            },
          ],
        });

        expect(event.fights[0].teams[0].fighters[0].fighterId).toBeDefined();
        expect(event.fights[0].teams[1].fighters[0].fighterId).toBeDefined();
      });
      it("Should allow promoter create a tag team ( 2 X 2 ) fight match", () => {
        const event = new Event({
          fights: [
            {
              teams: [
                {
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
                {
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
              ],
            },
          ],
        });

        expect(event.fights[0].teams[0].fighters[0].fighterId).toBeDefined();
        expect(event.fights[0].teams[0].fighters[1].fighterId).toBeDefined();
        expect(event.fights[0].teams[1].fighters[0].fighterId).toBeDefined();
        expect(event.fights[0].teams[1].fighters[1].fighterId).toBeDefined();
      });
      it("Should allow promoter create a Battle Royal match ( 3 X 3 ) fight match or more", () => {
        const event = new Event({
          fights: [
            {
              teams: [
                {
                  teamName: "Black diamond",
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
                {
                  teamName: "red diamond",
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
                {
                  teamName: "Red warriors",
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
              ],
            },
          ],
        });

        expect(event.fights[0].teams[0].fighters[0].fighterId).toBeDefined();
        expect(event.fights[0].teams[1].fighters[0].fighterId).toBeDefined();
        expect(event.fights[0].teams[2].fighters[0].fighterId).toBeDefined();
      });
      it("Should allow promoter create Two fights in an event", () => {
        const event = new Event({
          fights: [
            {
              teams: [
                {
                  teamName: "Black diamond",
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
                {
                  teamName: "red diamond",
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
              ],
            },
            {
              teams: [
                {
                  teamName: "Black diamond Fight 2",
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
                {
                  teamName: "red diamond Fight 2",
                  fighters: [
                    {
                      fighterId: new mongoose.Types.ObjectId("6696475178b2ced7e1b87d40"),
                    },
                  ],
                },
              ],
            },
          ],
        });
        //For fight 1 (1 x 1 fight)
        expect(event.fights[0].teams[0].fighters[0].fighterId).toBeDefined();
        expect(event.fights[0].teams[1].fighters[0].fighterId).toBeDefined();
        //For fight 2 (1 x 1 fight)
        expect(event.fights[1].teams[0].fighters[0].fighterId).toBeDefined();
        expect(event.fights[1].teams[1].fighters[0].fighterId).toBeDefined();
      });
    });
  });
});
