// * Modules Imports
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const app = express();

const config = require('./config/config');


// * Helpers variables
const { upload } = require('./src/helpers/multer');
const { setHeaders, handleError } = require('./src/helpers/handler');;

// * set express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
// use multer
app.use(upload.fields(
    [
        {
            name: 'image', maxCount: 1
        },
        {
            name: 'voice', maxCount: 1
        }
    ]
));


//set headers
app.use(setHeaders);
// app.use(cors());
// * ROUTES VARIABLES
const authRoutes = require('./src/routes/auth.route');
const citizenRoutes = require('./src/routes/citizen.route');
const adminRoutes = require('./src/routes/admin.route');

// * ROUTES API's
app.use('/api/auth', authRoutes);
app.use('/api/citizen', citizenRoutes);
app.use('/api/admin', adminRoutes);

app.all('*', (req, res, next) => {
    res.json({
        message: 'Welcome to NodeJS tutorial!',
    });
});

// error handling for responses
app.use(handleError);

// import session and mongoDB store then create mongoDb store
// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);
// const store = new MongoDBStore({
    // uri: config.db.url,
//     collection: 'sessions'
// });

// use session
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false,
//     store: store
// }));


// connect to mongodb then start express server
mongoose.connect(config.db.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(config.db.port, () => {
            console.log('Listening on port: ' + config.server.port);
        });
    }
    ).catch(err => {
        console.log(err);
    }
    );