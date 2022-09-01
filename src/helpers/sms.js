require('dotenv').config();

const { checkErrorStatus, throwError } = require('../helpers/handler');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.sendSMSVerification = async (phoneNumber, code) => {
   await client.messages
        .create({
            body: `From LFPMS: Your verification code is ${code}`,
            from: '+13393311737',
            to: phoneNumber.toString()
        })
        .then(
            (message, res , req , next) => {
                console.log(message.status)
                if (!message) {
                    throwError('Could not send verification code through your phone, resend.');
                }
});
}

exports.sendApprovalSMS = async (phoneNumber, reason) => {
    await client.messages
        .create({
            body: `From LFPMS: Your ${reason} case has been approved by Police and posted to social media.`,
            from: '+13393311737',
            to: phoneNumber.toString()
        })
        .then(
            (message, res, req, next) => {
                console.log(message.status)
                if (!message) {
                    throwError('Could not send approval text through your phone.');
                }
            });
}

exports.sendUpdateSMS = async (phoneNumber, reason) => {
    await client.messages
        .create({
            body: `From LFPMS: You have new message on your ${reason} case.`,
            from: '+13393311737',
            to: phoneNumber.toString()
        })
        .then(
            (message, res, req, next) => {
                console.log(message.status)
                if (!message) {
                    throwError('Could not send updates through your phone.');
                }
            });
}

exports.sendReportReceivedSMS = async (phoneNumber) => {
    await client.messages
        .create({
            body: `From LFPMS: Your case has been received, Please wait for Police approval.`,
            from: '+13393311737',
            to: phoneNumber.toString()
        })
        .then(
            (message, res, req, next) => {
                console.log(message.status)
                if (!message) {
                    throwError('Could not send updates through your phone.');
                }
            });
}

exports.sendSpecialUserSMS = async (phoneNumber, role, password) => {
    await client.messages
        .create({
            body: `From LFPMS: You have been added as ${role}, Your password is ${password}`,
            from: '+13393311737',
            to: phoneNumber.toString()
        })
        .then(
            (message, res, req, next) => {
                console.log(message.status)
                if (!message) {
                    throwError('Could not send updates through your phone.');
                }
            });
}

exports.outGoingSMSValidate = async (phoneNumber, username) => {
    await client.validationRequests
        .create({ friendlyName: username.toString(), phoneNumber: phoneNumber.toString() })
        .then(validation_request => console.log(validation_request.friendlyName));

        client.validationRequests
}

