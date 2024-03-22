const jwt = require("jsonwebtoken");
let crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');

//Database
const db = require("../models/index");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Users = db.Users;

//JWT
var secret = require("../config/config.json");


module.exports = {


    async signup(req, res, next) {
        try {

            //Post Data
            let postData = req.body.data

            // Check name
            if (postData.name.length <= 0) {
                res.send({ success: false, message: "Name is required", redirect: "", error: null });
                return;
            }

            // Check email
            if (postData.email.length <= 0) {
                res.send({ success: false, message: "Email is required", redirect: "", error: null });
                return;
            }

            // Check password length
            if (postData.password.length < 8) {
                res.send({ success: false, message: "Password must be greater than 7 characters", redirect: "", error: null });
                return;
            }

            // check if passwords match
            if (postData.password !== postData.retypePassword) {
                res.send({ success: false, message: "Passwords do not match", redirect: "", error: null });
                return;
            }



            // check if user doesnt already exist
            const user = await Users.findAll({ where: { email: postData.email } });
            if (user.length > 0) {
                res.send({ success: false, message: "User with same email already exists", redirect: "", error: null });
                return;
            }

            // hash password by bcrypt
            hashedPassword = crypto.createHash('md5').update(postData.password).digest('hex');


            // create user
            let newUser = await Users.create({
                name: postData.name,
                password: hashedPassword,
                email: postData.email,
                avatar: null
            });

            let userData = newUser.get({ plain: true });
            let accessToken = jwt.sign(userData, secret.accessToken, { expiresIn: '24h' });
            let refreshToken = jwt.sign(userData, secret.refreshToken);

            // return success
            res.send({
                success: true,
                message: "Account created",
                redirect: "dashboard",
                error: null,
                accessToken: accessToken,
                refreshToken: refreshToken
            });


            // Log action (after  creation of log)
        } catch (error) {
            console.log("User registeration unsuccessfull");
            console.log(error);
            res.send({ success: false, message: "Server side error", redirect: "", error: null });
        }
    },

    async login(req, res, next) {

        try {

            //Post Data
            let postData = req.body.data

            // Check email
            if (postData.email.length <= 0) {
                res.send({ success: false, message: "Email is required", redirect: "", error: null });
                return;
            }

            // Check password length
            if (postData.password.length <= 0) {
                res.send({ success: false, message: "Password is required", redirect: "", error: null });
                return;
            }

            // hash password by bcrypt
            hashedPassword = crypto.createHash('md5').update(postData.password).digest('hex');

            // check if user exist
            const user = await Users.findOne({ where: { email: postData.email, password: hashedPassword } });
            if (user.length <= 0) {
                res.send({ success: false, message: "User does not exists", redirect: "", error: null });
                return;
            }

            let userData = user.get({ plain: true });
            let accessToken = jwt.sign(userData, secret.accessToken, { expiresIn: '24h' });
            let refreshToken = jwt.sign(userData, secret.refreshToken);

            let userObj = {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                accessToken: accessToken,
                refreshToken: refreshToken
            }

            // return success
            res.send({
                success: true,
                message: "User login",
                redirect: "dashboard",
                error: null,
                data: userObj,
            });




        } catch (error) {
            console.log("User login unsuccessfull");
            console.log(error);
            res.send({ success: false, message: "Server side error", redirect: "", error: null });
        }

    },

    async uploadImage(req, res, next) {

        let token = req.header('authorization');
        let user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        let userID = user.id;

        try {
            const storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, 'public/uploads') // Destination folder where images will be stored
                },
                filename: function (req, file, cb) {
                    cb(null, Date.now() + '-' + file.originalname) // Define how the file should be named
                }
            });

            const upload = multer({ storage: storage }).single('image');

            upload(req, res, async function (err) {
                if (err) {
                    res.send({ success: false, message: err, redirect: "", error: null });
                    return;
                }
                let path = '/uploads/' + req.file.filename
                // console.log(req.file);
                await Users.update(
                    {
                        avatar: path,
                    },
                    { where: { id: userID } }
                ).then(async (success) => {
                    // return success
                    res.send({
                        success: true,
                        message: "Avatar update",
                        redirect: "",
                        error: null,
                        data: path,
                    });
                    return;
                }).catch((err) => {
                    res.send({ success: false, message: err, redirect: "", error: null });
                    return;
                });

            });
        } catch (error) {
            console.log(error);
        }




    },

    async update(req, res, next) {

        try {

            //Post Data
            let postData = req.body.data

            //JWT decode
            let token = req.header('authorization');
            let user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
            let userID = user.id;

            await Users.update(
                {
                    name: postData.name,
                    email: postData.email
                },
                { where: { id: userID } }
            ).then(async (success) => {
                // return success
                res.send({
                    success: true,
                    message: "User update",
                    redirect: "",
                    error: null,
                    data: {},
                });
                return;
            }).catch((err) => {
                res.send({ success: false, message: err, redirect: "", error: null });
                return;
            });



        } catch (error) {
            console.log("User update unsuccessfull");
            console.log(error);
            res.send({ success: false, message: "Server side error", redirect: "", error: null });
        }

    }

}