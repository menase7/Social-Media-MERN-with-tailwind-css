const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const bodyparser = require("body-parser");

const helmet = require("helmet");
const dbConnection = require("./dbConfig");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const router = require("./routes/index");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
dbConnection();

app.use(helmet());
app.use(cors());
app.use(bodyparser.json());
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true}));

app.use(morgan("dev"));

app.use(router);

app.use(errorMiddleware);

app.listen(PORT, ()=>{
  console.log(`Server runnig on port: ${PORT}`);
});

