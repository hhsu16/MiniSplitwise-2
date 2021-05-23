const express = require("express");
const app = express.Router();
const Users = require('../models/UserModel');
const Group = require('../models/GroupModel');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

//get user image path
app.get('/user/:user_image', (req, res) => {
    var image = path.join(__dirname, '..') + '/public/userimages/' + req.params.user_image;
    if (fs.existsSync(image)) {
        res.sendFile(image);
    }
    else {
        res.sendFile(path.join(__dirname, '..') + '/public/userimages/userdefaultimage.png')
    }
});

//get group image path
app.get('/group/:group_image', (req, res) => {
    var image = path.join(__dirname, '..') + '/public/groupimages/' + req.params.group_image;
    if (fs.existsSync(image)) {
        res.sendFile(image);
    }
    else {
        res.sendFile(path.join(__dirname, '..') + '/public/groupimages/groupdefaultimage.png')
    }
});

//upload user image
const userstorage = multer.diskStorage({
    destination: path.join(__dirname, '..') + '/public/userimages',
    filename: (req, file, cb) => {
        cb(null, req.params.email + "-" + Date.now() + path.extname(file.originalname));
    }
});

const useruploads = multer({
    storage: userstorage,
    limits: { fileSize: 1000000 },
}).single("image");

app.post("/user/:email", (req, res) => {
    const email = req.params.email;
    useruploads(req, res, function (err) {
        if (!err) {
            Users.updateOne({ email: email }, {$set: {
                "image": req.file.filename,
            }}, (error, result) => {
                if (error) {
                    res.status(500).end("Error");
                }
                else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(req.file.filename);
                }
            }); 
        }
        else {
            console.log('Error');
        }
    })
});

//upload group image
const groupstorage = multer.diskStorage({
    destination: path.join(__dirname, '..') + '/public/groupimages',
    filename: (req, file, cb) => {
        cb(null, req.params.groupname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const groupuploads = multer({
    storage: groupstorage,
    limits: { fileSize: 1000000 },
}).single("image");

app.post("/group/:groupname", (req, res) => {
    const groupname = req.params.groupname;
    groupuploads(req, res, function (err) {
        if (!err) {
            Group.updateMany({ groupname: groupname }, {$set: {
                "groupimage": req.file.filename
            }}, (error, result) => {
                if (error) {
                    res.status(500).end("Error");
                }
                else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(req.file.filename);
                }
            })
        }
        else {
            console.log('Error');
        }
    })
});

module.exports = app;