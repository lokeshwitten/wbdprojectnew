const { json } = require('express/lib/response')
const jwt = require('jsonwebtoken')
const client = require('../util/cache')
const User = require('../models/user')
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { token } = require('morgan');
const { SendSmtpEmail } = require('sib-api-v3-sdk');
const { use } = require('chai');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
sendSmtpEmail.sender = { "name": "Lokesh", "email": "gurorkrupa@gmail.com" };

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
                    const secretcode = Math.floor(Math.random() * 899999 + 100000).toString()
                    const temptoken = jwt.sign({ email: req.body.email, password: req.body.password }, secretcode)
                    client.setEx(req.body.email + 'token', 5000, temptoken)
                    client.setEx(req.body.email + 'secretkey', 5000, secretcode)


                    sendSmtpEmail.subject = "UFIT Login";
                    sendSmtpEmail.textContent = "The OTP for the site is " + secretcode

                    sendSmtpEmail.to = [{ "email": req.body.email, "name": "Jane Doe" }];

                    console.log(SendSmtpEmail.sender)
                    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
                        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                        return res.status(200).json({ message: "OTP sent to the email", temptoken: temptoken, tempuserid: user.id })
                    }, function(error) {
                        console.error(error);
                    });
                    /////

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
exports.otp_verify = async(req, res, next) => {
    console.log('In the verificaion fucntion')
    const userid = req.body.tempuserid
    const otp = req.body.otp
    if (!otp) {
        return res.status(401).json("EMPTY OTP field Not permitted")
    }
    if (!userid) {
        return res.status(401).json("Session Expired.Please try again")
    }
    const user = await User.findByPk(userid)
    if (user) {
        console.log('User exists')
        const email = user.email
        const redistoken = email + 'token'
        console.log(redistoken)
        try {
            const token = await client.get(redistoken)
            console.log(token)
            if (token !== null) {
                try {
                    const decodedtoken = jwt.verify(token, otp)
                    if (decodedtoken) {
                        const usertoken = jwt.sign({ email: email, password: user.password }, 'happykumarjayswal')

                        return res.status(200).json({ message: "Succesfuly Logged in", token: usertoken })
                    }
                } catch {
                    return res.status(401).json({ message: "Incorrect OTP.Try again" })
                }
            }
        } catch (err) {
            console.log(err)
            return res.status(401).json({ message: "OTP expired.Try again" })
        }
    }
}