const express = require("express");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(express.json());
require("./config/database").connect();

//routes
const user = require("./routes/user");
app.use("/api/v1", user);

app.listen(port, (err) => {
  if (err) {
    console.log("err message");
  } else {
    console.log("Serve is start on port", port);
  }
});
