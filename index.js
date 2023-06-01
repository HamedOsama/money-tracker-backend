const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");


const api = require('./src/routes/index');
const connectDatabase = require("./src/db/db");
const errorMiddleWare = require("./src/middleware/error.middleware");
const ServerError = require("./src/utils/ErrorInterface");


dotenv.config();

// connect to DB
connectDatabase()

const app = express();

// https://www.kit-hardware-center.com/
// app.use(cors({ credentials: true }));
app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost:3001', 'https://admin.bestprice4deals.com' , 'https://www.bestprice4deals.com' , 'https://bestprice4deals.com' , 'https://money-tracker-admin.vercel.app'] }));
// app.use(cors({credentials : true , origin :  'https://hatlytest.trendlix.com'}));
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/', api)

app.use('/images', express.static(path.join(__dirname, "./src/images")))




app.use((req, res, next) => {
  next(ServerError.badRequest(404, 'page not found'))
})
app.use(errorMiddleWare);


app.listen(process.env.PORT, () => {
  console.log("server start on " + process.env.PORT);
});
