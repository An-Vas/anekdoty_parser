const MongoClient = require("mongodb").MongoClient;


const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

async function updateDb(jokes) {
    if (jokes.length !== 0){
        try {
            await mongoClient.connect();
            const db = mongoClient.db("jokessdb");
            const collection = db.collection("jokes");
            const dropResult = await collection.drop();
            const insertManyResult = await db.collection('jokes').insertMany(jokes)

        } catch(err) {
            console.log(err);

        } finally {
            await mongoClient.close();

        }
    }
}

module.exports = { updateDb };