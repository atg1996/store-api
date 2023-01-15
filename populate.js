// exeecute this file to populate mongoDB.


require('dotenv').config();

const connectDb = require('./db/connect');
const Product  = require('./models/product');

const productJson = require('./products.json');

const start = async () => {
    try{
        await connectDb(process.env.MONGO_URI)
        await Product.deleteMany();
        await Product.create(productJson);
        console.log("populate.js file starts operating")
        process.exit(0);
    }catch(error) {
        console.log(error);
        process.exit(1);
    }
}

start();