const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');

connectDB();

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));



const port = process.env.PORT || 3000;
console.log(process.env.ACCESS_TOKEN_SECRET);


app.use(express.json());
app.use("/api/dossiers", require('./routes/dossierRoute'));
app.use("/api/users", require('./routes/userRoute'));
app.use("/api/stats", require('./routes/statsRoute'));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});