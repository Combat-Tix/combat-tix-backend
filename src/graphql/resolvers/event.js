import Event from "../../models/event.js";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";

export const resolvers = {
  Query: {
    getEvents: async (_, { first = 10, after }) => {
      if (first < 1) {
        throw new GraphQLError("First must be a positive integer", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (after && !mongoose.Types.ObjectId.isValid(after)) {
        throw new GraphQLError("Invalid cursor ID", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      try {
        const query = {};
        if (after) {
          query._id = { $gt: new mongoose.Types.ObjectId(after) };
        }

        const events = await Event.find(query)
          .sort({ _id: 1 })
          .limit(first + 1);

        const hasNextPage = events.length > first;
        if (hasNextPage) {
          events.pop();
        }

        return {
          edges: events.map((event) => ({
            cursor: event._id.toString(),
            node: event,
          })),
          pageInfo: {
            hasNextPage,
            endCursor: events.length
              ? events[events.length - 1]._id.toString()
              : null,
          },
        };
      } catch (error) {
        console.error("Error fetching events:", error);
        throw new GraphQLError("Failed to fetch events", {
          extensions: { code: "INTERNAL_SERVER_ERROR", details: error.message },
        });
      }
    },
    getEventsByFlag: async (_, { flag, value, first = 10, after }) => {
      const validFlags = ["isHeroBanner", "isFeatured", "isMainEvent"];
      if (!validFlags.includes(flag)) {
        throw new GraphQLError("Invalid flag", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Validate pagination parameters
      if (first < 1) {
        throw new GraphQLError("First must be a positive integer", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (after && !mongoose.Types.ObjectId.isValid(after)) {
        throw new GraphQLError("Invalid cursor ID", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      try {
        // Build the query
        const query = { [`flags.${flag}.value`]: value };
        if (after) {
          query._id = { $gt: new mongoose.Types.ObjectId(after) };
        }

        // Fetch events
        const events = await Event.find(query)
          .sort({ _id: 1 }) // Sort by _id (acts as the cursor)
          .limit(first + 1); // Fetch one extra to check if there's a next page

        const hasNextPage = events.length > first;
        if (hasNextPage) {
          events.pop(); // Remove the extra item
        }

        return {
          edges: events.map((event) => ({
            cursor: event._id.toString(),
            node: event,
          })),
          pageInfo: {
            hasNextPage,
            endCursor: events.length
              ? events[events.length - 1]._id.toString()
              : null,
          },
        };
      } catch (error) {
        console.error("Error fetching events by flag:", error);
        throw new GraphQLError("Failed to fetch events by flag", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    getEvent: async (_, { id }) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new GraphQLError("Invalid event ID format", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Check if the event exists
      const event = await Event.findById(id);
      if (!event) {
        throw new GraphQLError("Event not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      try {
        return event;
      } catch (error) {
        console.error("Error fetching event:", error);
        throw new GraphQLError("Failed to fetch event", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    getUpcomingEvents: async (_, { first = 10, after }) => {
      try {
        if (first < 1) {
          throw new GraphQLError("First must be a positive integer", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        if (after && !mongoose.Types.ObjectId.isValid(after)) {
          throw new GraphQLError("Invalid cursor ID", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const query = {
          "eventDateTime.date": { $gte: new Date().toISOString() },
        };

        if (after) {
          query._id = { $gt: new mongoose.Types.ObjectId(after) };
        }

        const events = await Event.find(query)
          .sort({ "eventDateTime.date": 1, _id: 1 })
          .limit(first + 1);

        const hasNextPage = events.length > first;
        if (hasNextPage) {
          events.pop();
        }

        return {
          edges: events.map((event) => ({
            cursor: event._id.toString(),
            node: event,
          })),
          pageInfo: {
            hasNextPage,
            endCursor: events.length
              ? events[events.length - 1]._id.toString()
              : null,
          },
        };
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
        throw new GraphQLError("Failed to fetch upcoming events", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
  },

  Mutation: {
    createEvent: async (_, { input }) => {
      const requiredFields = [
        "promoterId",
        "name",
        "venue",
        "capacity",
        "eventType",
        "bannerURL",
        "splitPercentage",
        "description",
        "subDescription",
      ];

      const missingFields = requiredFields.filter((field) => !input[field]);
      
      if (missingFields.length > 0) {
        throw new GraphQLError("Missing required fields", {
          extensions: {
            code: "BAD_USER_INPUT",
            fields: missingFields,
          },
        });
      }

      const validEventTypes = ["MMA", "Boxing", "Kickboxing", "BJJ", "Other"];
      if (!validEventTypes.includes(input.eventType)) {
        throw new GraphQLError("Invalid event type", {
          extensions: {
            code: "BAD_USER_INPUT",
            allowedValues: validEventTypes,
          },
        });
      }

      if (input.capacity <= 0 || !Number.isInteger(input.capacity)) {
        throw new GraphQLError("Capacity must be a positive integer", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (input.splitPercentage < 0 || input.splitPercentage > 100) {
        throw new GraphQLError("splitPercentage must be between 0 and 100", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      try {
        const event = new Event(input);
        await event.save();
        return event;
      } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
          throw new GraphQLError("Validation Error", {
            extensions: {
              code: "BAD_USER_INPUT",
              details: error.errors,
            },
          });
        }
        throw new GraphQLError("Failed to create event", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    deleteEvent: async (_, { id }) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new GraphQLError("Invalid event ID format", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const event = await Event.findByIdAndDelete(id);

      if (!event) {
        throw new GraphQLError("Event not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      try {
        return {
          success: true,
          message: "Event deleted successfully",
          id: event._id.toString(),
        };
      } catch (error) {
        throw new GraphQLError("Failed to delete event", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    updateEvent: async (_, { id, input }) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new GraphQLError("Invalid event ID format", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const event = await Event.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      });

      if (!event) {
        throw new GraphQLError("Event not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      try {
        return {
          success: true,
          message: "Event updated successfully",
          event,
        };
      } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
          throw new GraphQLError("Validation Error", {
            extensions: {
              code: "BAD_USER_INPUT",
              details: error.errors,
            },
          });
        }

        throw new GraphQLError("Failed to update event", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
  },
};
