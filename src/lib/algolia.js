import { algoliasearch } from "algoliasearch";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_API_KEY) {
  throw new Error("Algolia Credentials missing");
}

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);

const indices = ["events"];
export { client, indices };
