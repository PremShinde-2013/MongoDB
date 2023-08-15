const { MongoClient } = require("mongodb");

let dbConnection;

let uri =
  "mongodb+srv://shindePrem:Shinde123@cluster0.7qoyn4g.mongodb.net/?retryWrites=true&w=majority";
module.exports = {
  connectToDb: (cb) => {
    // MongoClient.connect("mongodb://localhost:27017/anime")
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
