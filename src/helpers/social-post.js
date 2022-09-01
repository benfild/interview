require('dotenv').config();

const { checkErrorStatus, throwError } = require('../helpers/handler');

/** Cut & Paste Node.js Code **/
const SocialPost = require("social-post-api"); // Install "npm i social-post-api"

const url = "https://lostandfound.muneersahel.com/";
const API_KEY = process.env.AYRSHARE_API_KEY;

// Live API Key
const social = new SocialPost(API_KEY);

exports.sendPost = async (report) => {
    const caption = report.full_name + " " + report.reason + " - " + report.description;
    const image = url + report.image;
    const post = await social.post({
        "post": caption,
        "platforms": ["facebook", "instagram"],
        "mediaUrls": [image]
    }).catch(err => {
        checkErrorStatus(err);
        throwError(err);
    });

    console.log(post);
    if (!post) {
        throwError('Could not post to social media, re-post.');
    }
    console.log("Posted to social media.");
}