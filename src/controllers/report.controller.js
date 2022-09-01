const { validationResult } = require('express-validator');

// helpers variables
const { throwError, checkErrorStatus } = require('../../helpers/handler');
const { sendPost } = require('../../helpers/social-post');
const { POLICE_STATUS, REPORT_STATUS } = require('../../helpers/constants');
const { sendApprovalSMS, sendReportReceivedSMS, outGoingSMSValidate } = require('../../helpers/sms');

// import report model and user model
const Report = require('../models/report.model');
const User = require('../models/user.model');
const Citizen = require('../models/citizen.model');


// exports create function that creates a new report
exports.createReport = async (req, res, next) => {
    // get the user id from the request body
    const { firstName, lastName, age, gender, reason, health, homeAddress, lastLocation, description, persons } = req.body;
    const fullName = firstName + ' ' + lastName;
    console.log(req.body)
    // str.substring(0, str.lastIndexOf("/"));
    const image = req.files.image[0].path.slice(7);
    console.log(image);
    const voice = req.files.voice[0].path.slice(7);
    console.log(voice);
    console.log(req.body)
    console.log(persons);

    try {
        // get the validation errors
        const errors = validationResult(req);

        // check if there are errors
        if (!errors.isEmpty()) {
            // throw error
            throwError('Invalid report fields', 422, errors.array());
        }

        // get the report
        const existReport = await Report.findOne({full_name: fullName});

        // check if the report exists
        if (existReport) {
            // throw error
            throwError('That person already exists in the system!!', 422);
        }

        const reporter = { id: req.user._id, username: req.user.username };
        // create the report
        const report = new Report({
            full_name: fullName,
            age,
            image,
            gender,
            reason,
            health_status: health,
            home_address: homeAddress,
            last_location: lastLocation,
            description: description,
            voice_note: voice,
            contact_persons: persons,
            reporter: reporter,
            reported_on: new Date()
        });

        // save the report
        await report.save();

        const user = await User.findById(req.userId);
        const mob = user["phone"].toString();
        console.log(mob)
        const phone = '+255' + mob;
        console.log(phone);
        // await outGoingSMSValidate(phone, user.username);
        await sendReportReceivedSMS(phone);

        // return all reports
        const reports = await Report.find().populate('messages');
        // send the report
        res.status(200).json({
            status: 200,
            message: 'Report created successfully, Please wait for Police approval!',
            data: {reports},
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that gets all the reports
exports.getAllReports = async (req, res, next) => {
    try {
        // get all the reports
        const reports = await Report.find().populate('messages');
        console.log("Reports fetched")
        // send the reports
        res.status(200).json({
            status: 200,
            message: 'All reports fetched successfully',
            data: { reports },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that gets a report by id
exports.getReportById = async (req, res, next) => {
    // get the report id from the request query
    const { id } = req.query;

    try {
        // get the report
        const report = await Report.findById(id).populate('messages');

        // check if the report exists
        if (!report) {
            // throw error
            throwError('Report does not exist', 422);
        }

        // send the report
        res.status(200).json({
            status: 200,
            message: 'Report fetched successfully',
            data: { report },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that updates a report
exports.updateReport = async (req, res, next) => {
    // get the report id from the request query
    const { id } = req.query;

    // get the report from the request body
    const { userId, firstName, lastName, age, image, gender, reason, health, homeAddress, lastLocation, description, voice, persons } = req.body;
    const fullName = firstName + ' ' + lastName;



}

// exports function that returns approved reports by police_status
exports.getApprovedReports = async (req, res, next) => {
    try {
        // get the approved reports
        const reports = await Report.find({ police_status: POLICE_STATUS.approved }).populate('messages');

        // send the reports
        res.status(200).json({
            status: 200,
            message: 'All approved reports fetched successfully',
            data: { reports },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that returns pending reports by police_status
exports.getPendingReports = async (req, res, next) => {
    try {
        // get the pending reports
        const reports = await Report.find({ police_status: POLICE_STATUS.pending }).populate('messages');

        // send the reports
        res.status(200).json({
            status: 200,
            message: 'All pending reports fetched successfully',
            data: { reports },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that returns unsolved reports by status
exports.getUnsolvedReports = async (req, res, next) => {
    try {
        // get the unsolved reports
        const reports = await Report.find({ status: REPORT_STATUS.unsolved }).populate('messages');

        // send the reports
        res.status(200).json({
            status: 200,
            message: 'All unsolved reports fetched successfully',
            data: { reports },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that returns solved reports by status
exports.getSolvedReports = async (req, res, next) => {
    try {
        // get the solved reports
        const reports = await Report.find({ status: REPORT_STATUS.solved }).populate('messages');

        // send the reports
        res.status(200).json({
            status: 200,
            message: 'All solved reports fetched successfully',
            data: { reports },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that returns all reports reported by user
exports.getReportsByUser = async (req, res, next) => {
    // get the user id from the request query
    const id = req.userId;

    try {
        // get the reports
        const reports = await Report.find({ 'reporter.id': id }).populate('messages');
        if(!reports){
            throwError("You don't have any reports", 422);
        }
        console.log("User Reports fetched")
        // send the reports
        res.status(200).json({
            status: 200,
            message: 'All reports fetched successfully',
            data: { reports },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that returns all reports reported by user
exports.getReporter = async (req, res, next) => {
    // get the user id from the request query
    const { id } = req.query;

    try {
        // get the reporter
        let reporter = null
        const report = await Report.findById(id);
        const user = await User.findById(report.reporter.id);
        const citizen = await Citizen.findOne({phone: user.phone});
        if(citizen){
            reporter = { name: user.username, nida: citizen.nida, role: user.role, email: user.email, address: citizen.address, phone: user.phone }
            } else {
                reporter = {name: user.username, nida: user.role, role: user.role, email: user.email, address: user.role, phone: user.phone}
            }
        console.log("Reporter fetched")
        console.log(reporter)
        // send the reporter
        res.status(200).json({
            status: 200,
            message: 'All reporter fetched successfully',
            data: { reporter: reporter },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that approves a report
exports.approveReport = async (req, res, next) => {
    // get the report id from the request query
    const { id } = req.query;

    try {
        // get the report
        const report = await Report.findById(id);

        // check if the report exists
        if (!report) {
            // throw error
            throwError('Report does not exist', 422);
        }

        // update the report
        report.police_status = POLICE_STATUS.approved;

        // save the report
        await report.save();

        // send notification text
        const user = await User.findOne({_id: report.reporter.id});
        const mob = user["phone"].toString();
        console.log(mob)
        const phone = '+255' + mob;
        console.log(phone);
        // await outGoingSMSValidate(phone, user.username);
        await sendApprovalSMS(phone, report.reason);

        //send report to social media after approval
        await sendPost(report);

        // send the report
        res.status(200).json({
            status: 200,
            message: 'Report approved successfully, and posted to the public and social medias!',
            data: { report },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that solve a report
exports.solveReport = async (req, res, next) => {
    // get the report id from the request query
    const { id } = req.query;

    try {
        // get the report
        const report = await Report.findById(id);

        // check if the report exists
        if (!report) {
            // throw error
            throwError('Report does not exist', 422);
        }

        // update the report
        report.status = REPORT_STATUS.solved;

        // save the report
        await report.save();

        // send the report
        res.status(200).json({
            status: 200,
            message: 'Report solved successfully',
            data: { report },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that delete a report
exports.deleteReport = async (req, res, next) => {
    // get the report id from the request query
    const { id } = req.query;

    try {
        // get the report
        const report = await Report.findById(id);

        // check if the report exists
        if (!report) {
            // throw error
            throwError('Report does not exist', 422);
        }

        // delete the report
        await report.remove();

        // send the report
        res.status(200).json({
            status: 200,
            message: 'This report deleted successfully',
            data: { report },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that deletes all reports
exports.deleteAllReports = async (req, res, next) => {
    try {
        // get the reports
        const reports = await Report.find();

        // check if there are reports
        if (!reports.length) {
            // throw error
            throwError('There are no reports to delete', 422);
        }

        // delete all reports
        await Report.deleteMany();

        // send the reports
        res.status(200).json({
            status: 200,
            message: 'All reports deleted successfully',
            data: { reports },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// exports function that delete report with id by checking the user is the reporter
exports.deleteReportByUser = async (req, res, next) => {
    // get the report id from the request query
    const { id } = req.query;

    try {
        // get the report
        const report = await Report.findById(id);

        // check if the report exists
        if (!report) {
            // throw error
            throwError('Report does not exist', 422);
        }

        // check if the user is the reporter
        if (report.reporter.id !== req.user._id) {
            // throw error
            throwError('You are not the reporter of this report', 422);
        }

        // delete the report
        await report.remove();

        // send the report
        res.status(200).json({
            status: 200,
            message: 'Report deleted successfully',
            data: { report },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}

// get approved reports which are not solved yet
exports.getApprovedUnsolvedReports = async (req, res, next) => {
    try {
        // get the approved reports
        const reports = await Report.find({ police_status: POLICE_STATUS.approved, status: REPORT_STATUS.unsolved }).populate('messages');

        // send the reports
        res.status(200).json({
            status: 200,
            message: 'All approved unsolved reports fetched successfully',
            data: { reports },
        });
    } catch (error) {
        checkErrorStatus(error);
        next(error);
    }
}
