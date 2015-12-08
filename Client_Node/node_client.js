/**
 * Created by Carlos Varela on 11/24/2015.
 */
var net = require('net');
var readline = require('readline');
var user = require("./User.js");
var client = new net.Socket();
var exists = false;
client.connect(7000, '127.0.0.1', function () {

});
var users = [];
client.on('data', function (data) {
   console.log(JSON.parse(data));
        options();
});

var option = 0;
var options = function() {

        console.log("1. Add User");
        console.log("2. Search User");
        console.log("3. Search User");
        console.log("Option: ");
        var rl = readline.createInterface({input: process.stdin});
        rl.on('line', function (input) {
            option = parseInt(input);
            switch (option) {
                case 1:
                    rl.close();
                    addUser();
                    break;
                case 2:
                    rl.close();
                    searchUser();
                    break;
                case 3:
                    rl.close();
                    deleteUser();
                    break;
            }
        });
};


        var addUser = function() {
            user.createUser(function (user) {
                user = JSON.stringify(user);
                client.write(JSON.stringify({tipo:"1",data: user}));
                options();
            });
        };

        var searchUser = function() {
            console.log("Enter Username");
            var rl = readline.createInterface({input: process.stdin});
            rl.on('line', function (input) {
               client.write(JSON.stringify({tipo: "2", data: input.trim()}));
                rl.close();

            });
        };

        var deleteUser = function () {
            console.log("Enter Username");
            var rl = readline.createInterface({input: process.stdin});
            rl.on('line', function (input) {
                client.write(JSON.stringify({tipo: "3", data: input.trim()}));
                rl.close();

            });
        }
            process.on('uncaughtException', function (err) {

                console.log(err);
            });


options();