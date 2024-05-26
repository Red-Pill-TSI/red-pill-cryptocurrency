const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("static"));

const port = 3000;
app.listen(port, () => {
  console.debug(`Server listening on port ${port}`);
});
