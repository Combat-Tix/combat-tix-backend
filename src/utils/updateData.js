import Event from "../models/event.js";
import { saveRecordToAlgolia } from "./algoliaUtil.js";
// import { convertToTimestamp } from "./convertToTimestamp.js";
// import { formatLocation } from "./formatter.js";
//<---------- This is just used to update all the previous data we have on the database and index it on algolia --------->

//<------- Function for updating all the documents based on criteria ------->
// export const batchUpdate = async () => {
//   const events = await Event.find().exec();
//   for (let index = 0; index < events.length; index++) {
//     const event = events[index];
//     const eventTimeStamp = await convertToTimestamp({
//       date: event.eventDateTime.date,
//       startTime: event.eventDateTime.startTime,
//     });
//     const fullLocation = await formatLocation(event.location);
//     await Event.findByIdAndUpdate(
//       { _id: event.id },
//       {
//         popularity: Math.floor(Math.random() * 101),
//         eventTimeStamp,
//         fullLocation,
//       }
//     );
//   }
// };

// export const indexToAlgolia = async () => {
//   const events = await Event.find().exec();
//   for (let index = 0; index < events.length; index++) {
//     const event = events[index];
//     await saveRecordToAlgolia({
//       indexType: "events",
//       body: {
//         objectID: event._id.toString(),
//         popularity: event.popularity,
//         eventTimeStamp: event.eventTimeStamp,
//         name: event.name,
//         venue: event.venue,
//         eventType: event.eventType,
//         fullLocation: event.fullLocation,
//         eventDateTime: event.eventDateTime,
//         images: event.images,
//       },
//     });
//   }
// };
