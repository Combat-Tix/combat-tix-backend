import { jest } from "@jest/globals";
import Event from "../../models/event.js";
import { resolvers } from "../../graphql/resolvers/event.js";
import mongoose from "mongoose";
jest.mock("../../models/event.js");

describe("Event Resolvers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Query.getEvents", () => {
    it("should return a paginated list of events", async () => {
      const mockEvents = [
        { _id: new mongoose.Types.ObjectId(), name: "Event 1" },
        { _id: new mongoose.Types.ObjectId(), name: "Event 2" },
      ];

      Event.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([
            { _id: new mongoose.Types.ObjectId(), name: "Event 1" },
            { _id: new mongoose.Types.ObjectId(), name: "Event 2" },
          ]),
        }),
      });

      const result = await resolvers.Query.getEvents({}, { first: 2 });

      expect(result.edges).toHaveLength(2);
      expect(result.edges[0].node.name).toBe("Event 1");
      expect(result.pageInfo.hasNextPage).toBe(false);
    });

    it("should throw an error when first is not a positive integer", async () => {
      await expect(resolvers.Query.getEvents({}, { first: 0 })).rejects.toThrow(
        "First must be a positive integer"
      );
    });

    it("should throw an error when 'after' is not a valid ObjectId", async () => {
      await expect(
        resolvers.Query.getEvents({}, { after: "invalidId" })
      ).rejects.toThrow("Invalid cursor ID");
    });
  });

  describe("Query.getEventsByFlag", () => {
    it("should return a paginated list of events with the specified flag set to true", async () => {
      const mockEvents = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Event 1",
          flags: { isHeroBanner: { value: true, priority: 1 } },
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Event 2",
          flags: { isHeroBanner: { value: true, priority: 2 } },
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Event 3",
          flags: { isHeroBanner: { value: true, priority: 3 } },
        },
      ];

      Event.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockEvents),
        }),
      });

      const result = await resolvers.Query.getEventsByFlag(
        {},
        { flag: "isHeroBanner", value: true, first: 2 }
      );

      expect(result.edges).toHaveLength(2);
      expect(result.edges[0].node.name).toBe("Event 1");
      expect(result.edges[1].node.name).toBe("Event 2");
      expect(result.pageInfo.hasNextPage).toBe(true);
      expect(result.pageInfo.endCursor).toBe(mockEvents[1]._id.toString());
    });

    it("should throw an error for an invalid flag", async () => {
      await expect(
        resolvers.Query.getEventsByFlag(
          {},
          { flag: "invalidFlag", value: true, first: 10 }
        )
      ).rejects.toThrow("Invalid flag");
    });

    it("should throw an error if first is not a positive integer", async () => {
      await expect(
        resolvers.Query.getEventsByFlag(
          {},
          { flag: "isHeroBanner", value: true, first: 0 }
        )
      ).rejects.toThrow("First must be a positive integer");
    });

    it("should throw an error if after is not a valid ObjectId", async () => {
      await expect(
        resolvers.Query.getEventsByFlag(
          {},
          { flag: "isHeroBanner", value: true, first: 10, after: "invalidId" }
        )
      ).rejects.toThrow("Invalid cursor ID");
    });
  });

  describe("Query.getEvent", () => {
    it("should return a single event by ID", async () => {
      const mockEvent = {
        _id: "64df8a439ba3c3f6d6b7e7d1",
        name: "Sample Event",
      };

      Event.findById = jest.fn().mockResolvedValue(mockEvent);

      const result = await resolvers.Query.getEvent(
        {},
        { id: "64df8a439ba3c3f6d6b7e7d1" }
      );

      expect(result.name).toBe("Sample Event");
    });

    it("should throw an error if event is not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      Event.findById = jest.fn().mockResolvedValue(null);

      await expect(
        resolvers.Query.getEvent({}, { id: nonExistentId })
      ).rejects.toThrow("Event not found");
    });
  });

  describe("Mutation.createEvent", () => {
    it("should create and return a new event", async () => {
      const mockInput = {
        promoterId: "123",
        name: "New Event",
        venue: "Venue",
        capacity: 100,
        eventType: "MMA",
        bannerURL: "http://example.com/banner.jpg",
        splitPercentage: 50,
      };

      const mockEvent = { _id: "64df8a439ba3c3f6d6b7e7d3", ...mockInput };

      Event.prototype.save = jest.fn().mockResolvedValue(mockEvent);

      const result = await resolvers.Mutation.createEvent(
        {},
        { input: mockInput }
      );

      expect(result.name).toBe("New Event");
      expect(result.capacity).toBe(100);
    });

    it("should throw an error if required fields are missing", async () => {
      const invalidInput = {
        name: "Incomplete Event",
      };

      await expect(
        resolvers.Mutation.createEvent({}, { input: invalidInput })
      ).rejects.toThrow("Missing required fields");
    });

    it("should throw an error if capacity is invalid", async () => {
      const invalidInput = {
        promoterId: "123",
        name: "New Event",
        venue: "Venue",
        capacity: -10, // Invalid capacity
        eventType: "MMA",
        bannerURL: "http://example.com/banner.jpg",
        splitPercentage: 50,
      };

      await expect(
        resolvers.Mutation.createEvent({}, { input: invalidInput })
      ).rejects.toThrow("Capacity must be a positive integer");
    });
  });

  describe("Mutation.deleteEvent", () => {
    it("should delete an event successfully", async () => {
      const mockEvent = {
        _id: new mongoose.Types.ObjectId(),
        name: "MMA Championship",
      };

      Event.findByIdAndDelete = jest.fn().mockResolvedValue(mockEvent);

      const result = await resolvers.Mutation.deleteEvent(null, {
        id: mockEvent._id.toString(),
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Event deleted successfully");
      expect(result.id).toBe(mockEvent._id.toString());
    });

    it("should throw an error if the event is not found", async () => {
      Event.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await expect(
        resolvers.Mutation.deleteEvent(null, {
          id: new mongoose.Types.ObjectId().toString(),
        })
      ).rejects.toThrow("Event not found");
    });

    it("should throw an error if the ID is invalid", async () => {
      await expect(
        resolvers.Mutation.deleteEvent(null, { id: "invalid-id" })
      ).rejects.toThrow("Invalid event ID format");
    });
  });

  describe("Mutation.updateEvent", () => {
    it("should update an event successfully", async () => {
      const mockEvent = {
        _id: new mongoose.Types.ObjectId(),
        name: "Updated Event Name",
        venue: "Updated Venue",
        capacity: 2000,
        eventType: "MMA",
      };

      Event.findByIdAndUpdate = jest.fn().mockResolvedValue(mockEvent);

      const result = await resolvers.Mutation.updateEvent(null, {
        id: mockEvent._id.toString(),
        input: {
          name: "Updated Event Name",
          venue: "Updated Venue",
          capacity: 2000,
          eventType: "MMA",
        },
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Event updated successfully");
      expect(result.event.name).toBe("Updated Event Name");
    });

    it("should throw an error if the event is not found", async () => {
      Event.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(
        resolvers.Mutation.updateEvent(null, {
          id: new mongoose.Types.ObjectId().toString(),
          input: {
            name: "Updated Event Name",
          },
        })
      ).rejects.toThrow("Event not found");
    });

    it("should throw an error if the ID is invalid", async () => {
      await expect(
        resolvers.Mutation.updateEvent(null, {
          id: "invalid-id",
          input: {
            name: "Updated Event Name",
          },
        })
      ).rejects.toThrow("Invalid event ID format");
    });
  });
});
