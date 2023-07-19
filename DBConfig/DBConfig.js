const { MongoClient, ServerApiVersion } = require("mongodb");
const { usersRouter } = require("../routes/usersRoutes/usersRoutes");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.270jmf9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let usersCollection;
let isLoggedInCollection;
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    usersCollection = client.db("houseHunter-DB").collection("users");
    isLoggedInCollection = client.db("houseHunter-DB").collection("isLoggedIn");

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
module.exports = { usersCollection,isLoggedInCollection };
