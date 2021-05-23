const graphql = require('graphql');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
    GraphQLNonNull
} = graphql;

const Users = require('../models/UserModel');
const Group = require('../models/GroupModel');
const Invitation = require('../models/InvitationModel');
const Balance = require('../models/BalanceModel');
const Activity = require('../models/ActivityModel');

const ProfileType = new GraphQLObjectType({
    name: 'profile',
    fields: () => ({
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
        currency: {
            type: GraphQLString
        },
        timezone: {
            type: GraphQLString
        },
        language: {
            type: GraphQLString
        },
        image: {
            type: GraphQLString
        }
    })
})

const GroupType = new GraphQLObjectType({
    name: 'group',
    fields: () => ({
        groupname: {
            type: GraphQLString
        },
        useremail: {
            type: GraphQLString
        },
        groupimage: {
            type: GraphQLString
        }
    })
})

const InvitationType = new GraphQLObjectType({
    name: 'invitation',
    fields: () => ({
        _id: {
            type: GraphQLString
        },
        groupname: {
            type: GraphQLString
        },
        useremail: {
            type: GraphQLString
        },
        inviteduseremail: {
            type: GraphQLString
        },
        invitedusername: {
            type: GraphQLString
        },
        isaccepted: {
            type: GraphQLBoolean
        }
    })
})

const ActivityType = new GraphQLObjectType({
    name: 'activity',
    fields: () => ({
        groupname: {
            type: GraphQLString
        },
        expense: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        useremail: {
            type: GraphQLString
        },
        date: {
            type: GraphQLString
        },
        datestring: {
            type: GraphQLString
        }
    })
})

const BalanceType = new GraphQLObjectType({
    name: 'balance',
    fields: () => ({
        useroweemail: {
            type: GraphQLString
        },
        userowedemail: {
            type: GraphQLString
        },
        balance: {
            type: GraphQLString
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Root Query',
    fields: { 
        //login as a user
        login: {
            type: ProfileType,
            args: {
                email: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Users.findOne({
                        "email": args.email
                    }, (err, user) => {
                        if (err) {
                            console.log('result in error', user);
                            reject("error");
                        }
                        if (user) {
                            bcrypt.compare(args.password, user.password, (error, result) => {
                                if (result) {
                                    console.log('result', user);
                                    resolve(user)
                                }
                                else {
                                    console.log('result in error');
                                    reject("error");
                                }
                            })
                        } else{
                            console.log('result in error');
                            reject("error");
                        }
                    });
                })
            }
        },
        //get user profile
        profile: {
            type: ProfileType,
            args: {
                email: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Users.findOne({
                        "email": args.email
                    }, (err, user) => {
                        if (err) {
                            console.log('result in error');
                            reject("error")
                        }
                        else {
                            console.log('result', user);
                            resolve(user)
                        }
                    });
                })
            }
        },
        //get my groups
        mygroups: {
            type: new GraphQLList(GroupType),
            args: {
                useremail: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Group.find({
                        "useremail": args.useremail
                    }, (err, groups) => {
                        if (err) {
                            console.log('result in error');
                            reject("error")
                        }
                        else {
                            console.log('result', groups);
                            resolve(groups)
                        }
                    });
                })
            }
        },
        //get invitation list
        myinvitations: {
            type: new GraphQLList(InvitationType),
            args: {
                useremail: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Invitation.find({
                        "inviteduseremail": args.useremail
                    }, (err, invitations) => {
                        if (err) {
                            console.log('result in error');
                            reject("error")
                        }
                        else {
                            console.log('result', invitations);
                            resolve(invitations)
                        }
                    });
                })
            }
        },
        //get group member in a group
        groupmember: {
            type: new GraphQLList(GroupType),
            args: {
                groupname: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Group.find({
                        "groupname": args.groupname
                    }, (err, groups) => {
                        if (err) {
                            console.log('result in error');
                            reject("error")
                        }
                        else {
                            console.log('result', groups);
                            resolve(groups)
                        }
                    });
                })
            }
        },
        //get group activity
        groupactivity: {
            type: new GraphQLList(ActivityType),
            args: {
                groupname: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Activity.find({ groupname: args.groupname }, (error, result) => {
                        if (error) {
                            console.log('result in error');
                            reject("error")
                        }
                        if (result) {
                            console.log("group activity success get");
                            console.log('result', result);
                            resolve(result)
                        }
                    });
                })
            }
        },
        //get all groups activities the user joined
        allgroupactivity: {
            type: new GraphQLList(ActivityType),
            args: {
                useremail: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    // find all groups the user joined groupname list
                    Group.find({ useremail: args.useremail }, (error, result) => {
                        if (error) {
                            console.log('result in error');
                            reject("error")
                        }
                        if (result && result.length > 0) {
                            let groupnamearray = [];
                            result.map((listing) => {
                                groupnamearray.push(listing.groupname);
                            })
                            const length = groupnamearray.length;
                            console.log(groupnamearray, length);
                            var send = [];
                            let done = 0;
                            for( let i = 0; i < length; i++){ 
                                Activity.find({ groupname: groupnamearray[i] }, (error, response) => {
                                    if (error) {
                                        console.log('result in error');
                                        reject("error")
                                    }
                                    if (result) {
                                        send.push(response);
                                        done++;
                                        console.log(done);
                                        if (done===(length)){
                                            let sendarray = [];
                                            send.map((listing) => {
                                                listing.map((sublisting) => {
                                                    sendarray.push(sublisting);
                                                })
                                            })
                                            console.log("all groups activities success get");
                                            console.log('result', sendarray);
                                            resolve(sendarray)
                                        }
                                    }
                                });
                            }
                        }
                    });
                })
            }
        },
        //get group balance 
        groupbalance: {
            type: new GraphQLList(BalanceType),
            args: {
                groupname: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Group.find({ groupname: args.groupname }, (error, result) => {
                        if (error) {
                            console.log('result in error');
                            reject("error")
                        }
                        if (result && result.length > 0) {
                            let emailarray = [];
                            result.map((listing) => {
                                emailarray.push(listing.useremail);
                            })
                            const length = emailarray.length;
                            console.log(emailarray, length);
                            var sendowe = [];
                            let done = 0;
                            for( let i = 0; i < length; i++){ 
                                Balance.find({ useroweemail: emailarray[i] }, {useroweemail:1,userowedemail:1,balance:1}, 
                                    (error, response) => {
                                    if (error) {
                                        console.log('result in error');
                                        reject("error")
                                    }
                                    if (response){
                                        sendowe.push(response);
                                        done++;
                                        console.log(done);
                                        if (done===(length)){
                                            let sendarray = [];
                                            sendowe.map((listing) => {
                                                listing.map((sublisting) => {
                                                    sendarray.push(sublisting);
                                                })
                                            })
                                            console.log("group balance success get");
                                            console.log('result', sendarray);
                                            resolve(sendarray)
                                        }
                                    }
                                })
                            }
                        }
                    });
                })
            }
        },
        //get owe list
        getowelist: {
            type: new GraphQLList(BalanceType),
            args: {
                useremail: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Balance.find({ useroweemail: args.useremail }, (error, result) => {
                        if (error) {
                            console.log('result in error');
                            reject("error")
                        }
                        if (result) {
                            console.log("owe list success get");
                            console.log('result', result);
                            resolve(result)
                        }
                    });
                })
            }
        },
        //get owed list
        getowedlist: {
            type: new GraphQLList(BalanceType),
            args: {
                useremail: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Balance.find({ userowedemail: args.useremail }, (error, result) => {
                        if (error) {
                            console.log('result in error');
                            reject("error")
                        }
                        if (result) {
                            console.log("owed list success get");
                            console.log('result', result);
                            resolve(result)
                        }
                    });
                })
            }
        },
        //
    }
});

const signupResult = new GraphQLObjectType({
    name: 'signupResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});

const updateProfileResult = new GraphQLObjectType({
    name: 'updateProfileResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});

const createGroupResult = new GraphQLObjectType({
    name: 'createGroupResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});

const updateGroupProfileResult = new GraphQLObjectType({
    name: 'updateGroupProfileResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});

const sendInvitationResult = new GraphQLObjectType({
    name: 'sendInvitationResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});

const acceptInvitationResult = new GraphQLObjectType({
    name: 'acceptInvitationResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});

const declineInvitationResult = new GraphQLObjectType({
    name: 'declineInvitationResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});

const addAnExpenseResult = new GraphQLObjectType({
    name: 'addAnExpenseResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});

const settleupResult = new GraphQLObjectType({
    name: 'settleupResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});

const leavegroupResult = new GraphQLObjectType({
    name: 'leavegroupResult',
    fields: () => ({
        success: { type: GraphQLBoolean }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //sign up as a user
        signup: {
            type: signupResult,
            args: {
                username: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                },
                phone: {
                    type: GraphQLString
                },
                currency: {
                    type: GraphQLString
                },
                timezone: {
                    type: GraphQLString
                },
                language: {
                    type: GraphQLString
                },
                image: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                console.log("In user signup");
                return new Promise(function (resolve, reject) {
                    Users.findOne({ "email": args.email }, (err, user) => {
                        if (err) {
                            console.log('result in error');
                            reject("error");
                        }
                        if (user){ //if the email already exists
                            result = {success: false}
                            reject(result);
                        }
                        else {
                            bcrypt.hash(args.password, saltRounds, (err, hash) => {
                                if (err) {
                                    console.log(err);
                                    console.log('result in error');
                                    reject("error");
                                }
                                else{
                                    var newuser = new Users({
                                        username: args.username,
                                        email: args.email,
                                        password: hash,
                                        phone: args.phone,
                                        currency: args.currency,
                                        timezone: args.timezone,
                                        language: args.language,
                                        image: args.image
                                    });
                                    newuser.save(function (err) {
                                        if (err) {
                                            console.log(err);
                                            console.log('result in error');
                                            reject("error");
                                        }
                                        else {
                                            console.log("User signup successfully", newuser);
                                            result = {success: true}
                                            resolve(result);
                                        }
                                    });
                                }
                            });
                        }
                    });
                })
            }
        },
        //update user profile
        updateProfile: {
            type: updateProfileResult,
            args: {
                origin_email: {
                    type: GraphQLString
                },
                username: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                phone: {
                    type: GraphQLString
                },
                currency: {
                    type: GraphQLString
                },
                timezone: {
                    type: GraphQLString
                },
                language: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log("In update user profile");
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Users.find({ email: args.email }, (err, user) => {
                        if (err) {
                            console.log('result in error');
                            reject("error");
                        }
                        if (user.length > 0 && (args.origin_email !== args.email)) {
                            result = {success: false}
                            reject(result);
                            console.log("email exists, please use another email!");
                        }
                        //not exists, update user table 
                        else{
                            console.log("continue");
                            Users.updateOne({ email: args.origin_email }, {$set: {
                                "username": args.username,
                                "email": args.email,
                                "phone": args.phone,
                                "currency": args.currency,
                                "timezone": args.timezone,
                                "language": args.language
                            }}, (error, result) => {
                                if (error) {
                                    console.log('result in error');
                                    reject("error");
                                }
                            });  
                            //update group table
                            Group.updateMany({ useremail: args.origin_email }, {$set: {
                                "useremail": args.email
                            }}, (error, result) => {
                                if (error) {
                                    console.log('result in error');
                                    reject("error");
                                }
                            });
                            //update invitation table
                            Invitation.updateMany({ useremail: args.origin_email }, {$set: {
                                "useremail": args.email
                            }}, (error, result) => {
                                if (error) {
                                    console.log('result in error');
                                    reject("error");
                                }
                            });
                            Invitation.updateMany({ inviteduseremail: args.origin_email }, {$set: {
                                "inviteduseremail": args.email
                            }}, (error, result) => {
                                if (error) {
                                    console.log('result in error');
                                    reject("error");
                                }
                            });
                            //update activity table
                            Activity.updateMany({ useremail: args.origin_email }, {$set: {
                                "useremail": args.email
                            }}, (error, result) => {
                                if (error) {
                                    console.log('result in error');
                                    reject("error");
                                }
                            });
                            //update balance table
                            Balance.updateMany({ useroweemail: args.origin_email }, {$set: {
                                "useroweemail": args.email
                            }}, (error, result) => {
                                if (error) {
                                    console.log('result in error');
                                    reject("error");
                                }
                            });
                            Balance.updateMany({ userowedemail: args.origin_email }, {$set: {
                                "userowedemail": args.email
                            }}, (error, result) => {
                                if (error) {
                                    console.log('result in error');
                                    reject("error");
                                }
                            }); 
                            console.log("User profile updated successfully");
                            result = {success: true}
                            resolve(result);
                        }
                    });
                })
            }
        },
        //create a group
        createGroup: {
            type: createGroupResult,
            args: {
                groupname: {
                    type: GraphQLString
                },
                useremail: {
                    type: GraphQLString
                },
                groupimage: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                console.log("In create group");
                return new Promise(function (resolve, reject) {
                    Group.findOne({ "groupname": args.groupname }, (err, group) => {
                        if (err) {
                            console.log('result in error');
                            reject("error");
                        }
                        if (group){ //if the group name already exists
                            result = {success: false}
                            reject(result);
                        }
                        else {
                            var newgroup = new Group({
                                groupname: args.groupname,
                                useremail: args.useremail,
                                groupimage: args.groupimage
                            });
                            newgroup.save(function (err) {
                                if (err) {
                                    console.log(err);
                                    console.log('result in error');
                                    reject("error");
                                }
                                else {
                                    console.log("new group created successfully", newgroup);
                                    result = {success: true}
                                    resolve(result);
                                }
                            });
                        }
                    });
                })
            }
        },
        //update group profile  
        updateGroupProfile: {
            type: updateGroupProfileResult,
            args: {
                origin_groupname: {
                    type: GraphQLString
                },
                groupname: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log("In update group profile");
                console.log('args: ', args);
                return new Promise(function (resolve, reject) {
                    Group.find({ groupname: args.groupname }, (err, group) => {
                        if (err) {
                            console.log('result in error');
                            reject("error");
                        }
                        if (group.length > 0 && (args.origin_groupname !== args.groupname)) {
                            result = {success: false}
                            reject(result);
                            console.log("group name exists, please use another name!");
                        }
                        //not exists, update group table 
                        else{
                            Group.updateMany({ groupname: args.origin_groupname }, {$set: {
                                "groupname": args.groupname
                            }}, (error, result) => {
                                if (error) {
                                    console.log('result in error');
                                    reject("error");
                                }
                                if (result) {
                                    console.log("Group profile updated successfully");
                                    result = {success: true}
                                    resolve(result);
                                }
                            });  
                        }
                    })
                })
            }
        },
        //send invitation 
        sendInvitation: {
            type: sendInvitationResult,
            args: {
                groupname: {
                    type: GraphQLString
                },
                useremail: {
                    type: GraphQLString
                },
                inviteduseremail: {
                    type: GraphQLString
                },
                invitedusername: {
                    type: GraphQLString
                },
                isaccepted: {
                    type: GraphQLBoolean
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                console.log("In send invitation");
                return new Promise(function (resolve, reject) {
                    Users.find({ "email": args.inviteduseremail, "username": args.invitedusername}, (err, user) => {
                        if (err) {
                            console.log('result in error');
                            reject("error");
                        }
                        if (user && user.length>0){ //if exists, send invitation
                            var newinvitation = new Invitation({
                                useremail: args.useremail,
                                inviteduseremail: args.inviteduseremail,
                                groupname: args.groupname,
                                isaccepted: args.isaccepted
                            });
                            newinvitation.save(function (err) {
                                if (err) {
                                    console.log(err);
                                    console.log('result in error');
                                    reject("error");
                                }
                                else {
                                    console.log("invitation sent successfully", newinvitation);
                                    result = {success: true}
                                    resolve(result);
                                }
                            });
                        }
                        else {
                            console.log("Fail to invite. The user does not already exist!");
                            result = {success: false}
                            reject(result);
                        }
                    });
                })
            }
        },
        //accept invitation  
        acceptInvitation: {
            type: acceptInvitationResult,
            args: {
                _id: {
                    type: GraphQLString
                },
                groupname: {
                    type: GraphQLString
                },
                inviteduseremail: {
                    type: GraphQLString
                },
                isaccepted: {
                    type: GraphQLBoolean
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                console.log("In accept invitation");
                return new Promise(function (resolve, reject) {
                    //find the group img
                    Group.findOne({ "groupname": args.groupname }, (error, result) => {
                        if (error) {
                            console.log('result in error');
                            reject("error");
                        }
                        if (result) {
                            const groupimage = result.groupimage;
                            //insert to group table
                            var newmember = new Group({
                                groupname: args.groupname,
                                useremail: args.inviteduseremail,
                                groupimage: groupimage
                            });
                            newmember.save((error, data) => {
                                if (error) {
                                    console.log('result in error');
                                    reject("error");
                                }
                                else {
                                    //update invitation table
                                    const isaccepted = !args.isaccepted;
                                    Invitation.updateOne({ _id: args._id }, {$set: {
                                        "isaccepted": isaccepted
                                    }}, (error, result) => {
                                        if (error) {
                                            console.log('result in error');
                                            reject("error");
                                        }
                                        if (result) {
                                            console.log("successfully join the group");
                                            result = {success: true}
                                            resolve(result);
                                        }
                                    }
                                )}
                            });
                        }
                    });
                })
            }
        },
        //decline invitation  
        declineInvitation: {
            type: declineInvitationResult,
            args: {
                _id: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                console.log("In decline invitation");
                return new Promise(function (resolve, reject) {
                    Invitation.deleteOne({_id: args._id}, (error, result) => {
                        if (error) {
                            console.log('result in error');
                            reject("error");
                        }
                        if (result) {
                            console.log("successfully decline the group");
                            result = {success: true}
                            resolve(result);
                        }
                    })
                })
            }
        },
        //add an expense  
        addexpense: {
            type: addAnExpenseResult,
            args: {
                groupname: {
                    type: GraphQLString
                },
                useremail: {
                    type: GraphQLString
                },
                description: {
                    type: GraphQLString
                },
                expense: {
                    type: GraphQLString
                },
                groupmemberlist: {
                    type: GraphQLString
                },
            },
            resolve(parent, args) {
                console.log('args: ', args);
                console.log("In add an expense");
                const date = Date.now();
                var d = Date(); 
                const datestring = d.toString();
                var groupmemberlist = args.groupmemberlist;//user email string
                var groupmemberarray = groupmemberlist.split(" ");
                const length = groupmemberarray.length;
                //user array except himself
                for( let i = 0; i < length; i++){ 
                    if ( groupmemberarray[i] === args.useremail) {
                        groupmemberarray.splice(i, 1); 
                    }
                }
                console.log(groupmemberarray);
                return new Promise(function (resolve, reject) {
                    //insert activity into the activity table
                    var newactivity = new Activity({
                        groupname: args.groupname,
                        useremail: args.useremail,
                        expense: args.expense,
                        description: args.description,
                        date: date,
                        datestring: datestring
                    });
                    newactivity.save((error, data) => {
                        if (error) {
                            console.log('result in error');
                            reject("error");
                        }
                        else {
                            //update balance table  
                            groupmemberarray.map((listing) => {
                                Balance.findOne({ useroweemail: listing, userowedemail: args.useremail }, (error, balance) => {
                                    if (error) {
                                        console.log('result in error');
                                        reject("error");
                                    }
                                    //if already has a record, update balance
                                    if (balance){
                                        console.log("find record, updating.....");
                                        Balance.updateOne({ useroweemail: listing, userowedemail: args.useremail }, {$inc: {balance: (args.expense/length).toFixed(2)}}, (error, result) => {
                                            if (error) {
                                                console.log('result in error');
                                                reject("error");
                                            }
                                            if (result){
                                                console.log("updated balance.....");
                                            }
                                        }
                                    )}
                                    else{//if not, insert a new record
                                        var newbalance = new Balance({
                                            useroweemail: listing,
                                            userowedemail: args.useremail,
                                            balance: (args.expense/length).toFixed(2)//split among all members
                                        });
                                        newbalance.save((error, data) => {
                                            if (error) {
                                                console.log('result in error');
                                                reject("error");
                                            }
                                        });
                                    }
                                })
                            })
                            console.log("seccessfully add an expense");
                            result = {success: true}
                            resolve(result);
                        }
                    });
                })
            }
        },
        //settle up 
        settleup: {
            type: settleupResult,
            args: {
                useremail: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                console.log("In settle up");
                return new Promise(function (resolve, reject) {
                    Users.find({ email: args.email }, (error, result) => {
                        if (error) {
                            console.log('result in error');
                            reject("error");
                        }
                        if (result.length > 0) {
                            //delete the records in balance
                            Balance.deleteOne({useroweemail: args.email, userowedemail: args.useremail}, (error, result) => {
                                if (error) {
                                    console.log('result in error');
                                    reject("error");
                                }
                                if (result) {
                                    Balance.deleteOne({useroweemail: args.useremail, userowedemail: args.email}, (error, result) => {
                                        if (error) {
                                            console.log('result in error');
                                            reject("error");
                                        }
                                        if (result) {
                                            console.log("successfully settled up");
                                            result = {success: true}
                                            resolve(result);
                                        }
                                    })
                                }
                            })
                        }
                        else{  //user not exists
                            console.log("email not exists");
                            result = {success: false}
                            resolve(result);
                        }
                    });    
                })
            }
        },
        //leave the group  
        leavegroup: {
            type: leavegroupResult,
            args: {
                useremail: {
                    type: GraphQLString
                },
                groupname: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log('args: ', args);
                console.log("In leave the group");
                return new Promise(function (resolve, reject) {
                    Group.find({ groupname: args.groupname }, (error, result) => {
                        if (error) {
                            console.log('result in error');
                            reject("error");
                        }
                        if (result && result.length > 0) {
                            let emailarray = [];
                            result.map((listing) => {
                                emailarray.push(listing.useremail);
                            })
                            let length = emailarray.length;
                            for( let i = 0; i < length; i++){ //user array except himself
                                if ( emailarray[i] === args.useremail) {
                                    emailarray.splice(i, 1); 
                                }
                            }
                            console.log(emailarray, emailarray.length);
                            if (emailarray.length===0){ //if the group has only him, then leave
                                Group.deleteOne({groupname: args.groupname, useremail: args.useremail}, (error, result) => {
                                    if (error) {
                                        console.log('result in error');
                                        reject("error");
                                    }
                                    if (result) {
                                        console.log("Successfully leave the group");
                                        result = {success: true}
                                        resolve(result);
                                    }
                                })
                            }
                            else { //check due
                                let find = 0;
                                let done = 0;
                                for( let i = 0; i < emailarray.length; i++){ 
                                    Balance.find({ useroweemail: args.useremail, userowedemail: emailarray[i] }, 
                                        (error, response) => {
                                        if (error) {
                                            console.log('result in error');
                                            reject("error");
                                        }
                                        if (response && response.length > 0){
                                            find = 1;
                                        }
                                        done++;
                                        console.log("find:" + find);
                                        console.log("i:" + i);
                                        console.log("done:" + done);
                                        if (find===1 && done===emailarray.length){
                                            console.log("Failed to leave the group");
                                            result = {success: false}
                                            resolve(result);
                                        }
                                        else if(find===0 && done===emailarray.length){//leave the group
                                            Group.deleteOne({groupname: args.groupname, useremail: args.useremail}, (error, result) => {
                                                if (error) {
                                                    console.log('result in error');
                                                    reject("error");
                                                }
                                                if (result) {
                                                    console.log("Successfully leave the group");
                                                    result = {success: true}
                                                    resolve(result);
                                                }
                                            })
                                        }
                                    });    
                                }
                            }
                        }
                    });   
                })
            }
        },
        //
    }
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

module.exports = schema;