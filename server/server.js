const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/", routes);

app.listen(process.env.PORT || "3000", () => {
  console.log(`Server is running on port: ${process.env.PORT || "3000"}`);
});
