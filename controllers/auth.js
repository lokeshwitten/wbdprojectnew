const { json } = require('express/lib/response')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//sendSmtpEmail.subject = "My {{params.subject}}";
//sendSmtpEmail.htmlContent = "<html><body><h1>Welcome to UFIT.Glad tohave you with us {{params.parameter}}</h1></body></html>";
//sendSmtpEmail.sender = { "name": "Lokesh", "email": "gurorkrupa@gmail.com" };
//sendSmtpEmail.to = [{ "email": "lokesh.g19@iiits.in", "name": "Jane Doe" }];

exports.signup = (req, res, next) => {
    User.findAll({ where: { email: req.body.email } }).then(
        (users) => {
            if (users.length > 0) {
                res.status(401).json({ message: "The user already exists Please try a different user" })
            } else {
                User.create({
                    email: req.body.email,
                    name: req.body.name,
                    password: req.body.password
                }).then((user) => {
                    res.status(200).json({ message: "User Created Succesfully", isAuth: true })
                }).catch((err) => { res.status(401).json({ message: "Couldnt Create User.Try Again" }) })
            }
        })
}


exports.login = (req, res, next) => {
    User.findAll({ where: { email: req.body.email } }).then(
        (users) => {
            user = users[0]
            if (users.length > 0) {
                if (user.password == req.body.password) {
                    const token = jwt.sign({ email: req.body.email, password: req.body.password }, 'happykumarjayswal')
                    res.status(200).json({ message: "Login successfull", token: token, userId: user.id, userName: user.name })
                        // sendSmtpEmail.subject = "UFIT Login";
                        // sendSmtpEmail.htmlContent = "<html><body><h1>Welcome to UFIT. Glad to have you with us </h1></body></html>";
                        // sendSmtpEmail.sender = { "name": "Lokesh", "email": "gurorkrupa@gmail.com" };
                        // sendSmtpEmail.to = [{ "email": "lokesh.g19@iiits.in", "name": "Jane Doe" }];
                        // apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
                        //     console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                        // }, function(error) {
                        //     console.error(error);
                        // });

                } else {
                    res.status(401).json({ message: "Incorrect Password.Retry" })
                }
            } else {
                res.status(402).json({ message: "The user does not exist or check your email" })

            }
        }
    )


}
exports.email_verify = (req, res, next) => {

}
exports.otp_verify = (req, res, next) => {

}