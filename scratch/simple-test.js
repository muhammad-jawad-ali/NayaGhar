const { MongoClient } = require('mongodb');

async function test() {
  const uri = "mongodb+srv://jawad:Uh.7p8qjpT.4w4A@nayaghar-db.pdghymc.mongodb.net/?appName=NayaGhar-DB";
  const client = new MongoClient(uri);
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected!");
    const db = client.db("nayaghar");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const briefs = await db.collection("briefs").find({}).limit(1).toArray();
    console.log("One brief:", JSON.stringify(briefs[0], null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

test();
