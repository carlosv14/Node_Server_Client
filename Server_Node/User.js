/**
 * Created by Carlos Varela on 11/24/2015.
 */
var readline = require('readline');
var exports = module.exports={};

var idRegex = /^\d\d\d\d-\d\d\d\d-\d\d\d\d\d$/g;
var dateRegex = /^\d\d\/\d\d\/\d\d\d\d$/g;
var emailRegex = /^[\w-][\w-]*@[\w-][\w-]*.[a-zA-Z][a-zA-Z][a-zA-Z]?$/g;

exports.user = {};
exports.createUser = function (callback) {
    console.log("Enter name: ");
    var rl = readline.createInterface({input: process.stdin});
    rl.on('line', function (input) {
            exports.user.name = input;
        rl.close();
            verifyUserName(callback);


    });

};


var verifyUserName = function(callback){
    console.log("Enter Username: ");
    var rl = readline.createInterface({input: process.stdin});
    rl.on('line', function (input) {
        if(input.trim()!="") {
           exports.user.username = input;
            rl.close();
            verifyId(callback);

        }else {
            console.log("Invalid UserName");
            rl.close();
            verifyUserName(callback);

            return;
        }
    });
};

var verifyId = function(callback){
    console.log("Enter ID: ");
    var rl = readline.createInterface({input: process.stdin});
    rl.on('line', function (input) {
        console.log(input);
        if(idRegex.test(input.replace(/\n$/, ''))) {
            idRegex.lastIndex=0;
            exports.user.id = input;
            rl.close();
            verifyBirthDate(callback);

        }else {
            console.log("Invalid ID");
            rl.close();
            idRegex.lastIndex=0;
            verifyId(callback);
            return;
        }

    });
};

var verifyBirthDate = function(callback){
    console.log("Enter Birthdate: ");
    var rl = readline.createInterface({input: process.stdin});
    rl.on('line', function (input) {
        if(dateRegex.test(input.trim())) {
            dateRegex.lastIndex =0 ;
            exports.user.bd = input;
            rl.close();
            verifyEmail(callback);

        }else {
            console.log("Invalid Date");
            rl.close();
            dateRegex.lastIndex =0 ;
            verifyBirthDate(callback);

            return;
        }

    });
};

var verifyEmail = function(callback) {
    console.log("Enter E-mail: ");
    var rl = readline.createInterface({input: process.stdin});
    rl.on('line', function (input) {
        if (emailRegex.test(input.trim())) {
            exports.user.email = input;
            rl.close();
            emailRegex.lastIndex=0;
            verifyImage(callback);

        } else {
            console.log("Invalid Email");
            rl.close();
            emailRegex.lastIndex=0;
            verifyEmail(callback);

            return;
        }

    });
};
var verifyImage = function(callback) {
    console.log("Enter Profile Picture: ");
    var rl = readline.createInterface({input: process.stdin});
    rl.on('line', function (input) {
        if (input.trim() != "") {
            exports.user.pf = input;
            rl.close();
            callback(exports.user);

        } else {


            verifyImage(callback);
            rl.close();
            return;
        }
    });
};