// express
const express = require('express');
const app = express();


//functions
const jsonParserSettings = require('./utils/getDefaultData').jsonParserSettings(); 

// modules
const path = require('path');
const fs = require('fs');
 
require('dotenv').config({path: { path: 'C:\Users\אליהו סתת\Desktop\my site\youtube-download-site\server\src\a.env' }});
const port = process.env.PORT;
console.log(process.env.PORT);
console.log(process.env.API_KEY);

// packages
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors({origin: (origin, callback) => callback(null, true), optionsSuccessStatus: 200, credentials: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

// App Routes
const youtubeRoutes = require('./routes/youtube');
const wikipediaRoutes = require('./routes/wikipedia');

// App routes
app.use('/youtube', bodyParser.json(jsonParserSettings), youtubeRoutes);
app.use('/wikipedia', bodyParser.json(jsonParserSettings), wikipediaRoutes);


app.listen(port, () => {
    console.log(`Node Server listening on port: ${port}`, '\n');
}).setTimeout(50000000);

