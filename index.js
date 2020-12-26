const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();
const nodemailer = require("nodemailer");

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// enable CORS - Cross Origin Resource Sharing
app.use(cors());
// HTTP request logger middleware for node.js
app.use(morgan('dev'));

const port = 5000;

app.listen('5000', () => {
    console.log(`server started on  port ${port}`);
});

/* GET home page. */

app.post('/', (req, res) => {
    sendMail(req.body)
    .then(() => {
        res.json('Email is sent successfully')
    })
    .catch(console.error);
})

async function sendMail(mailbody) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: process.env.username,
            clientId: process.env.clientId,
            clientSecret: process.env.clientSecret,
            refreshToken: process.env.refreshToken,
            accessToken: process.env.accessToken
        }
    });

    console.log(mailbody)
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: process.env.username, // sender address
        to: 'trytechcontact@gmail.com', // list of receivers
        subject: mailbody.subject, // Subject line
        text: `from ${mailbody.senderName} <${mailbody.senderEmail}> said ${mailbody.message}`, // plain text body
        html: `<b>from ${mailbody.senderName} (${mailbody.senderEmail}) said ${mailbody.message}</b>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = app;