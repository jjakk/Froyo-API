// The purpose of this script is for all email related functions
const nodemailer = require('nodemailer');

const sendAutomatedEmail = async (mailOptions) => {
    let smtpTransport = nodemailer.createTransport({
        host: process.env.NOREPLY_EMAIL_HOST,
        port: process.env.NOREPLY_EMAIL_PORT,
        auth: {
            user: process.env.NOREPLY_EMAIL_ADDRESS,
            pass: process.env.NOREPLY_EMAIL_PASSWORD
        }
    });

    // Send automated email to user
    await smtpTransport.sendMail(mailOptions);
};


module.exports = {
    sendAutomatedEmail
};
