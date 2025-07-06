const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');

connectDB();

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;
console.log(process.env.ACCESS_TOKEN_SECRET);


app.use(express.json());
app.use("/api/dossiers", require('./routes/dossierRoute'));
app.use("/api/users", require('./routes/userRoute'));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});