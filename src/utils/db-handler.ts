import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
const mongod = new MongoMemoryServer();
 
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const connect = async () => {
  const uri = await mongod.getUri();
 
  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  };
 
  await mongoose.connect(uri, mongooseOpts);
};
 
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};
 
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
 
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
