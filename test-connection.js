const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://praneshbharadwaj631:Pranesh123@cluster0.gwupm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB successfully!");
        const databases = await client.db().admin().listDatabases();
        console.log("Databases:", databases.databases.map(db => db.name));
    } catch (err) {
        console.error("❌ Connection failed:", err.message);
    } finally {
        await client.close();
    }
}

run();