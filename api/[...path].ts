import { createServer } from "../server";
import serverless from "serverless-http";

// Create the Express app once per function instance
const app = createServer();

// Wrap Express app for Vercel serverless
const handler = serverless(app);
export default handler;

