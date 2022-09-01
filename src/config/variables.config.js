const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;

const HOST = process.env.HOST;

const SECRET_KEY = process.env.SECRET_KEY;

const BCRYPT_SALT = process.env.BCRYPT_SALT;

const MONGO_URI = process.env.MONGO_URI;

const NODE_ENV = process.env.NODE_ENV || 'production';


exports.config = {
    db: {
        name: "MONGO DB",
        url: MONGO_URI,
        // user: DB_USER,
        // pass: DB_PASS,
        host: HOST,
    },
    server: {
        port: PORT,
        host: HOST,
    },
    secretKey: SECRET_KEY,
    bcrypt: {
        salt: BCRYPT_SALT,
    },
    nodeEnv: NODE_ENV
};