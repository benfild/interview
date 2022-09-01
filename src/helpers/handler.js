require('dotenv').config();
// export handleError
// exports.handleError = (err, res) => {
//     // check if err is not null
//     if (err !== null) {
//         res.status(err.status || 500);
//         res.json({
//             error: {
//                 message: err.message
//             }
//         });
//     }
// };

exports.setHeaders = (req, res, next) => {
    const CLIENT_URL = process.env.CLIENT_URL;
    res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}; 

exports.handleError = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    // console.log(err);
    res.status(status).json({
        status: status,
        message: message,
        errors: data,
    });
    console.log("from handler: " + err);
    next();
};

exports.checkErrorStatus = (err) => {
    // check if the error is not null
    if (!err.statusCode) {
        // set the status code to 500
        err.statusCode = 500;
    }

    // check if the error is not null
    if (!err.message) {
        // set the error message to 'Server Error'
        err.message = 'Server Error';
    }

    // check if the error is not null
    if (!err.errors) {
        // set the error message to 'Server Error'
        err.errors = [];
    }
};
/**
 *
 * @param {string} message
 * @param {number} statusCode
 * @param {any[]} errors
 */
exports.throwError = (message, statusCode = 500, errors = []) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    errors.length !== 0 ? (err.data = errors) : '';
    throw err;
};
