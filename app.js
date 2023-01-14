require('dotenv').config();
require("express-async-errors");
const dbConnect = require("./db/connect")
const productRoutes = require("./routes/products")

//async errors
 
const express = require('express');
const app = express();

const notFOundMIddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

const port = process.env.port || 3000;

//middleware
app.use(express.json());


//routes

app.get("/", (req,res) => {
    res.send("<h1>Stroe API </h1><a href='/api/v1/products'></a>")
})


app.use('/api/v1/products', productRoutes )

//products route
app.use(notFOundMIddleware);
app.use(errorMiddleware);


const start = async () => {
    try {
        await dbConnect(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`app is listening to the port ${port}`);
        })
    }catch(error) {
        console.log(error);
    }
}

start();



