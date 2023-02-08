const express = require("express");

const app = express();
app.use(express.json());

app.listen(8000);
// Get Books API
app.get("/books/", async (request, response) => {
  response.send("Books");
});

//Get Book API
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  response.send(bookId);
});

//Add Book API
console.log("Server Started");
