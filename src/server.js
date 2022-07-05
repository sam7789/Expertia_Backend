const app = require("./index");
const connect = require("./configs/db");
const port = process.env.PORT || 2000;

app.listen(port, async () => {
  try {
    await connect();
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    console.log(err);
  }
});
