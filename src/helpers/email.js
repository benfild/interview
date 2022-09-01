require('dotenv').config();

const { checkErrorStatus, throwError } = require('../helpers/handler');

//import mailjet and connect
const mailjet = require('node-mailjet').connect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);

// exports sendEmailVerification function with verifyTime nice styled html part
exports.sendEmailVerification = async (user, verifyTime) => {
  // send the email
  const response = await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'fildben@gmail.com',
          Name: 'Benward',
        },
        To: [
          {
            Email: user.email,
            Name: user.username,
          },
        ],
        Subject: 'Confirm your email address',
        // TextPart: `${result.req.name}, ${result.req.email}, ${result.req.mobileNumber}, ${result.req.nationality}, ${result.req.tourDate}, ${result.req.adultsNumber}, ${result.req.childrenNumber}`,
        HTMLPart: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <meta http-equiv="x-ua-compatible" content="ie=edge" />
                <title>Email Confirmation</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style type="text/css">
                  /**
               * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
               */
                  @media screen {
                    @font-face {
                      font-family: 'Source Sans Pro';
                      font-style: normal;
                      font-weight: 400;
                      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'),
                        url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff)
                          format('woff');
                    }
    
                    @font-face {
                      font-family: 'Source Sans Pro';
                      font-style: normal;
                      font-weight: 700;
                      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'),
                        url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff)
                          format('woff');
                    }
                  }
    
                  /**
               * Avoid browser level font resizing.
               * 1. Windows Mobile
               * 2. iOS / OSX
               */
                  body,
                  table,
                  td,
                  a {
                    -ms-text-size-adjust: 100%; /* 1 */
                    -webkit-text-size-adjust: 100%; /* 2 */
                  }
    
                  /**
               * Remove extra space added to tables and cells in Outlook.
               */
                  table,
                  td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  }
    
                  /**
               * Better fluid images in Internet Explorer.
               */
                  img {
                    -ms-interpolation-mode: bicubic;
                  }
    
                  /**
               * Remove blue links for iOS devices.
               */
                  a[x-apple-data-detectors] {
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    color: inherit !important;
                    text-decoration: none !important;
                  }
    
                  /**
               * Fix centering issues in Android 4.4.
               */
                  div[style*='margin: 16px 0;'] {
                    margin: 0 !important;
                  }
    
                  body {
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                  }
    
                  /**
               * Collapse table borders to avoid space between cells.
               */
                  table {
                    border-collapse: collapse !important;
                  }
    
                  a {
                    color: #1a82e2;
                  }
    
                  img {
                    height: auto;
                    line-height: 100%;
                    text-decoration: none;
                    border: 0;
                    outline: none;
                  }
                  .email-masthead_name {
                    font-size: 16px;
                    font-weight: bold;
                    color: grey;
                    text-decoration: none;
                    text-shadow: 0 1px 0 white;
                  }
                </style>
              </head>
              <body style="background-color: #e9ecef">
                <!-- start preheader -->
                <div
                  class="preheader"
                  style="
                    display: none;
                    max-width: 0;
                    max-height: 0;
                    overflow: hidden;
                    font-size: 1px;
                    line-height: 1px;
                    color: #fff;
                    opacity: 0;
                  "
                >
                  Use this confirm your email. The link is only valid for
                  ${verifyTime} minutes
                </div>
                <!-- end preheader -->
    
                <!-- start body -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <!-- start logo -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef">
                      <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="max-width: 600px"
                      >
                        <tr>
                          <td align="center" valign="top" style="padding: 36px 24px">
                            <a
                              href="${process.env.CLIENT_URL}"
                              class="email-masthead_name"
                            >
                              ${process.env.CLIENT_NAME}
                            </a>
                          </td>
                        </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                    </td>
                  </tr>
                  <!-- end logo -->
    
                  <!-- start hero -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef">
                      <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="max-width: 600px"
                      >
                        <tr>
                          <td
                            align="left"
                            bgcolor="#ffffff"
                            style="
                              padding: 36px 24px 0;
                              font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                              border-top: 3px solid #d4dadf;
                            "
                          >
                            <h1
                              style="
                                margin: 0;
                                font-size: 32px;
                                font-weight: 700;
                                letter-spacing: -1px;
                                line-height: 48px;
                              "
                            >
                              Confirm Your Email Address
                            </h1>
                          </td>
                        </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                    </td>
                  </tr>
                  <!-- end hero -->
    
                  <!-- start copy block -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef">
                      <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="max-width: 600px"
                      >
                        <!-- start copy -->
                        <tr>
                          <td
                            align="left"
                            bgcolor="#ffffff"
                            style="
                              padding: 24px;
                              font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                              font-size: 16px;
                              line-height: 24px;
                            "
                          >
                            <p style="margin: 0">
                              Tap the button below to confirm your email address. If you
                              didn't create an account with
                              <a href="${process.env.CLIENT_URL}"
                                >${process.env.CLIENT_NAME}</a
                              >, you can safely delete this email.
                            </p>
                          </td>
                        </tr>
                        <!-- end copy -->
    
                        <!-- start button -->
                        <tr>
                          <td align="left" bgcolor="#ffffff">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td align="center" bgcolor="#ffffff" style="padding: 12px">
                                  <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td
                                        align="center"
                                        bgcolor="#1a82e2"
                                        style="border-radius: 6px"
                                      >
                                        <a
                                          href="${process.env.BASE_URL}/api/v1/verify-email?token=${user.verificationToken}"
                                          target="_blank"
                                          style="
                                            display: inline-block;
                                            padding: 16px 36px;
                                            font-family: 'Source Sans Pro', Helvetica, Arial,
                                              sans-serif;
                                            font-size: 16px;
                                            color: #ffffff;
                                            text-decoration: none;
                                            border-radius: 6px;
                                          "
                                          >Confirm</a
                                        >
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <!-- end button -->
    
                        <!-- start copy -->
                        <tr>
                          <td
                            align="left"
                            bgcolor="#ffffff"
                            style="
                              padding: 24px;
                              font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                              font-size: 16px;
                              line-height: 24px;
                            "
                          >
                            <p style="margin: 0">
                              If that doesn't work, copy and paste the following link in
                              your browser:
                            </p>
                            <p style="margin: 0">
                              <a
                                href="${process.env.BASE_URL}/api/v1/verify-email?token=${user.verificationToken}"
                                target="_blank"
                                >${process.env.BASE_URL}/api/v1/verify-email?token=${user.verificationToken}</a
                              >
                            </p>
                          </td>
                        </tr>
                        <!-- end copy -->
    
                        <!-- start copy -->
                        <tr>
                          <td
                            align="left"
                            bgcolor="#ffffff"
                            style="
                              padding: 24px;
                              font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                              font-size: 16px;
                              line-height: 24px;
                              border-bottom: 3px solid #d4dadf;
                            "
                          >
                            <p style="margin: 0">
                              Cheers,<br />
                              ${process.env.CLIENT_NAME}
                            </p>
                          </td>
                        </tr>
                        <!-- end copy -->
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                    </td>
                  </tr>
                  <!-- end copy block -->
    
                  <!-- start footer -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 24px">
                      <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="max-width: 600px"
                      >
                        <!-- start permission -->
                        <tr>
                          <td
                            align="center"
                            bgcolor="#e9ecef"
                            style="
                              padding: 12px 24px;
                              font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                              font-size: 14px;
                              line-height: 20px;
                              color: #666;
                            "
                          >
                            <p style="margin: 0">
                              You received this email because we received a request for
                              confirming you email. If you didn't request you can safely
                              delete this email.
                            </p>
                          </td>
                        </tr>
                        <!-- end permission -->
    
                        <tr>
                          <td
                            align="center"
                            bgcolor="#e9ecef"
                            style="
                              padding: 12px 24px;
                              font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                              font-size: 14px;
                              line-height: 20px;
                              color: #666;
                            "
                          >
                            <p style="margin: 0">Science, <br />Kijitonyama</p>
                          </td>
                        </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                    </td>
                  </tr>
                  <!-- end footer -->
                </table>
                <!-- end body -->
              </body>
            </html>
    
              `,
      },
    ],
  });
  // if (!response) {
  //   throwError(
  //     'Could not send verification token through you email, resend.'
  //   );
  // }
  console.log('Mailjet: ', response.body);

  if (!response) {
    throwError('Could not send verification token through you email, resend.');
  }
};

// exports sendPasswordResetEmail function with user, expiresTime and requestingPlatform
exports.sendPasswordResetEmail = async (
  user,
  expiresTime,
  requestingPlatform
) => {
  // create email object
  const emailObject = {
    Messages: [
      {
        From: {
          Email: 'fildben@gmail.com',
          Name: 'Benward',
        },
        To: [
          {
            Email: user.email,
            Name: `${user.firstName} ${user.lastName}`,
          },
        ],
        Subject: 'Reset your password',
        // TextPart: `${result.req.name}, ${result.req.email}, ${result.req.mobileNumber}, ${result.req.nationality}, ${result.req.tourDate}, ${result.req.adultsNumber}, ${result.req.childrenNumber}`,
        HTMLPart: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Reset Passowrd</title>
                <style type="text/css" rel="stylesheet" media="all">
                /**
                 * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                 */
                    @media screen {
                      @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'),
                          url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff)
                            format('woff');
                      }
              
                      @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'),
                          url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff)
                            format('woff');
                      }
                    }
              
                    /**
                 * Avoid browser level font resizing.
                 * 1. Windows Mobile
                 * 2. iOS / OSX
                 */
                    body,
                    table,
                    td,
                    a {
                      -ms-text-size-adjust: 100%; /* 1 */
                      -webkit-text-size-adjust: 100%; /* 2 */
                    }
              
                    /**
                 * Remove extra space added to tables and cells in Outlook.
                 */
                    table,
                    td {
                      mso-table-rspace: 0pt;
                      mso-table-lspace: 0pt;
                    }
              
                    /**
                 * Better fluid images in Internet Explorer.
                 */
                    img {
                      -ms-interpolation-mode: bicubic;
                    }
              
                    /**
                 * Remove blue links for iOS devices.
                 */
                    a[x-apple-data-detectors] {
                      font-family: inherit !important;
                      font-size: inherit !important;
                      font-weight: inherit !important;
                      line-height: inherit !important;
                      color: inherit !important;
                      text-decoration: none !important;
                    }
              
                    /**
                 * Fix centering issues in Android 4.4.
                 */
                    div[style*='margin: 16px 0;'] {
                      margin: 0 !important;
                    }
              
                    /**
                 * Collapse table borders to avoid space between cells.
                 */
                    table {
                      border-collapse: collapse !important;
                    }
                  *:not(br):not(tr):not(html) {
                    font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
                    box-sizing: border-box;
                  }

                  body {
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    line-height: 1.4;
                    background-color: #f2f4f6;
                    color: #74787e;
                    -webkit-text-size-adjust: none;
                  }

                  p,
                  ul,
                  ol,
                  blockquote {
                    line-height: 1.4;
                    text-align: left;
                  }

                  a {
                    color: #3869d4;
                  }

                  a img {
                    border: none;
                  }

                  td {
                    word-break: break-word;
                  }
                  /* Layout ------------------------------ */

                  .email-wrapper {
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    -premailer-width: 100%;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                    background-color: #f2f4f6;
                  }

                  .email-content {
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    -premailer-width: 100%;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                  }
                  /* Masthead ----------------------- */

                  .email-masthead {
                    padding: 25px 0;
                    text-align: center;
                  }

                  .email-masthead_logo {
                    width: 94px;
                  }

                  .email-masthead_name {
                    font-size: 16px;
                    font-weight: bold;
                    color: #bbbfc3;
                    text-decoration: none;
                    text-shadow: 0 1px 0 white;
                  }
                  /* Body ------------------------------ */

                  .email-body {
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    -premailer-width: 100%;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                    border-top: 1px solid #edeff2;
                    border-bottom: 1px solid #edeff2;
                    background-color: #ffffff;
                  }

                  .email-body_inner {
                    width: 570px;
                    margin: 0 auto;
                    padding: 0;
                    -premailer-width: 570px;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                    background-color: #ffffff;
                  }

                  .email-footer {
                    width: 570px;
                    margin: 0 auto;
                    padding: 0;
                    -premailer-width: 570px;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                    text-align: center;
                  }

                  .email-footer p {
                    color: #aeaeae;
                  }

                  .body-action {
                    width: 100%;
                    margin: 30px auto;
                    padding: 0;
                    -premailer-width: 100%;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                    text-align: center;
                  }

                  .body-sub {
                    margin-top: 25px;
                    padding-top: 25px;
                    border-top: 1px solid #edeff2;
                  }

                  .content-cell {
                    padding: 35px;
                  }

                  .preheader {
                    display: none !important;
                    visibility: hidden;
                    mso-hide: all;
                    font-size: 1px;
                    line-height: 1px;
                    max-height: 0;
                    max-width: 0;
                    opacity: 0;
                    overflow: hidden;
                  }
                  /* Attribute list ------------------------------ */

                  .attributes {
                    margin: 0 0 21px;
                  }

                  .attributes_content {
                    background-color: #edeff2;
                    padding: 16px;
                  }

                  .attributes_item {
                    padding: 0;
                  }
                  /* Related Items ------------------------------ */

                  .related {
                    width: 100%;
                    margin: 0;
                    padding: 25px 0 0 0;
                    -premailer-width: 100%;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                  }

                  .related_item {
                    padding: 10px 0;
                    color: #74787e;
                    font-size: 15px;
                    line-height: 18px;
                  }

                  .related_item-title {
                    display: block;
                    margin: 0.5em 0 0;
                  }

                  .related_item-thumb {
                    display: block;
                    padding-bottom: 10px;
                  }

                  .related_heading {
                    border-top: 1px solid #edeff2;
                    text-align: center;
                    padding: 25px 0 10px;
                  }
                  /* Discount Code ------------------------------ */

                  .discount {
                    width: 100%;
                    margin: 0;
                    padding: 24px;
                    -premailer-width: 100%;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                    background-color: #edeff2;
                    border: 2px dashed #9ba2ab;
                  }

                  .discount_heading {
                    text-align: center;
                  }

                  .discount_body {
                    text-align: center;
                    font-size: 15px;
                  }
                  /* Social Icons ------------------------------ */

                  .social {
                    width: auto;
                  }

                  .social td {
                    padding: 0;
                    width: auto;
                  }

                  .social_icon {
                    height: 20px;
                    margin: 0 8px 10px 8px;
                    padding: 0;
                  }
                  /* Data table ------------------------------ */

                  .purchase {
                    width: 100%;
                    margin: 0;
                    padding: 35px 0;
                    -premailer-width: 100%;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                  }

                  .purchase_content {
                    width: 100%;
                    margin: 0;
                    padding: 25px 0 0 0;
                    -premailer-width: 100%;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                  }

                  .purchase_item {
                    padding: 10px 0;
                    color: #74787e;
                    font-size: 15px;
                    line-height: 18px;
                  }

                  .purchase_heading {
                    padding-bottom: 8px;
                    border-bottom: 1px solid #edeff2;
                  }

                  .purchase_heading p {
                    margin: 0;
                    color: #9ba2ab;
                    font-size: 12px;
                  }

                  .purchase_footer {
                    padding-top: 15px;
                    border-top: 1px solid #edeff2;
                  }

                  .purchase_total {
                    margin: 0;
                    text-align: right;
                    font-weight: bold;
                    color: #2f3133;
                  }

                  .purchase_total--label {
                    padding: 0 15px 0 0;
                  }
                  /* Utilities ------------------------------ */

                  .align-right {
                    text-align: right;
                  }

                  .align-left {
                    text-align: left;
                  }

                  .align-center {
                    text-align: center;
                  }
                  /*Media Queries ------------------------------ */

                  @media only screen and (max-width: 600px) {
                    .email-body_inner,
                    .email-footer {
                      width: 100% !important;
                    }
                  }

                  @media only screen and (max-width: 500px) {
                    .button {
                      width: 100% !important;
                    }
                  }
                  /* Buttons ------------------------------ */

                  .button {
                    background-color: #3869d4;
                    border-top: 10px solid #3869d4;
                    border-right: 18px solid #3869d4;
                    border-bottom: 10px solid #3869d4;
                    border-left: 18px solid #3869d4;
                    display: inline-block;
                    color: #fff !important;
                    text-decoration: none;
                    border-radius: 3px;
                    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
                    -webkit-text-size-adjust: none;
                  }

                  .button--blue {
                    background-color: #007bff;
                    border-top: 10px solid #007bff;
                    border-right: 18px solid #007bff;
                    border-bottom: 10px solid #007bff;
                    border-left: 18px solid #007bff;
                  }
                  /* Type ------------------------------ */

                  h1 {
                    margin-top: 0;
                    color: #2f3133;
                    font-size: 19px;
                    font-weight: bold;
                    text-align: left;
                  }

                  h2 {
                    margin-top: 0;
                    color: #2f3133;
                    font-size: 16px;
                    font-weight: bold;
                    text-align: left;
                  }

                  h3 {
                    margin-top: 0;
                    color: #2f3133;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: left;
                  }

                  p {
                    margin-top: 0;
                    color: #74787e;
                    font-size: 16px;
                    line-height: 1.5em;
                    text-align: left;
                  }

                  p.sub {
                    font-size: 12px;
                  }

                  p.center {
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <span class="preheader">
                  Use this link to reset your password. The link is only valid for ${expireTime}
                  minutes
                </span>
                <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <table
                        class="email-content"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td class="email-masthead">
                            <a href="${
                              process.env.CLIENT_URL
                            }" class="email-masthead_name">
                              ${process.env.CLIENT_NAME}
                            </a>
                          </td>
                        </tr>
                        <!-- Email Body -->
                        <tr>
                          <td
                            class="email-body"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <table
                              class="email-body_inner"
                              align="center"
                              width="570"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <!-- Body content -->
                              <tr>
                                <td class="content-cell">
                                  <h1>Hi ${user.firstName},</h1>
                                  <p>
                                    You recently requested to reset your password for your
                                    ${
                                      process.env.CLIENT_NAME
                                    } account. Use the button below to reset it.
                                    <strong>
                                      This password reset is only valid for the next ${expireTime}
                                      minutes.
                                    </strong>
                                  </p>
                                  <!-- Action -->
                                  <table
                                    class="body-action"
                                    align="center"
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                  >
                                    <tr>
                                      <td align="center">
                                        <table
                                          width="100%"
                                          border="0"
                                          cellspacing="0"
                                          cellpadding="0"
                                        >
                                          <tr>
                                            <td align="center">
                                              <table
                                                border="0"
                                                cellspacing="0"
                                                cellpadding="0"
                                              >
                                                <tr>
                                                  <td>
                                                    <a
                                                      href="${
                                                        process.env.CLIENT_URL
                                                      }/auth/reset-password?token=${
          user.verificationToken
        }"
                                                      class="button button--blue"
                                                      target="_blank"
                                                      >Reset your password</a
                                                    >
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                  <p>
                                    For security, this request was received from
                                    ${
                                      requestingPlatform.requestOS
                                    } device using ${
          requestingPlatform.requestBrowser
        }. If
                                    you did not request a password reset, please ignore this
                                    email or
                                    <a href="${
                                      process.env.CLIENT_URL
                                    }/contact">contact support</a> if you
                                    have questions.
                                  </p>
                                  <p>Thanks, <br />The [${
                                    process.env.CLIENT_NAME
                                  }] Team</p>
                                  <!-- Sub copy -->
                                  <table class="body-sub">
                                    <tr>
                                      <td>
                                        <p class="sub">
                                          If you’re having trouble with the button above,
                                          copy and paste the URL below into your web
                                          browser.
                                        </p>
                                        <p class="sub">${
                                          process.env.CLIENT_URL
                                        }/auth/reset-password?token=${
          user.verificationToken
        }</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <table
                              class="email-footer"
                              align="center"
                              width="570"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tr>
                                <td class="content-cell" align="center">
                                  <p class="sub align-center">
                                    &copy; ${new Date().getFullYear()} ${
          process.env.CLIENT_NAME
        }. All rights reserved.
                                  </p>
                                  <p class="sub align-center">
                                    [${process.env.CLIENT_NAME}]
                                    <br />Science, <br />Kijitonyama
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            `,
      },
    ],
  };

  // send the email
  try {
    const response = await mailjet
      .post('send', { version: 'v3.1' })
      .request(emailObject);
    return response;
  } catch (error) {
    checkErrorStatus(error);
    throwError(error.status, error.message);
  }
};
