const env = process.env.NODE_ENV || "development";
if (env === "development") {
  process.env.PORT = 5000;
  process.env.MONGO_URI = "mongodb://localhost:27017/quotables";
} else if(env === "test") {
  process.env.PORT = 5000;
  process.env.MONGO_URI = "mongodb://localhost:27017/quotablesTest";
}