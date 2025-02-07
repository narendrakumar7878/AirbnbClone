const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const URL_MONGO = 'mongodb://127.0.0.1:27017/wonderlusts';
main().then(() => {
    console.log("connect DB");
})
    .catch((err) => {
        console.log(err)
    });
async function main() {
    await mongoose.connect(URL_MONGO);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "66a88032a6c1e28fc5abdc7c" }))
    await Listing.insertMany(initData.data);
    console.log("data was saved");
}

initDB();



