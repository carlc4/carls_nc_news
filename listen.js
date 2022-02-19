const app = require("./app");

const { PORT = 9090 } = process.env.PORT;

app.listen(PORT);
