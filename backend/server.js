const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./GraphqlSchema/schema')
const { mongoDB, frontendURL } = require('./utils/config');
const cors = require("cors");

const app = express();

app.use(cors({ origin: frontendURL, credentials: true }));

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

//mongodb connect
const mongoose = require('mongoose');

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0
};

mongoose.connect(mongoDB, options, (err, res) => {
    if (err) {
        console.log(err);
        console.log(`MongoDB Connection Failed`);
    } else {
        console.log(`MongoDB Connected`);
    }
});

const images = require("./utils/images");
app.use("/images", images);

app.listen(3001, () => console.log("Server started on port 3001"));