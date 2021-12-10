// "start": "nodemon src/app.js --exec  \"npm run lint && node\"",
// "lint": "eslint src/**/*.js"
console.log("server start..."); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');


const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/status', (req,res) => {
    res.send({
        message : 'hello world'
    })
});
app.listen(8081);
