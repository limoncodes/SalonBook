import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";

const client = new MongoClient(`mongodb+srv://${process.env.BETTER_AUTH_USERNAME_URL}:${process.env.BETTER_AUTH_PASSWORD_URL}@cluster0.4dwew1j.mongodb.net/`);
const db = client.db("SalonBook");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
   emailAndPassword: { 
    enabled: true, 
  }, 
   plugins: [
        admin({
            defaultRole:"user"
        }) 
    ]
});