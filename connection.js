let mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

let db = mongoose.connection;
db.once('open', function() {
  console.log('Connected to MongoDB')
})
