/**
 * Created by Carlos Varela on 11/24/2015.
 */
var net = require('net');
var users = [];

fs = require('fs');

var pushUser = function (s,data) {
    var found = false;
    for(var i = 0; i < users.length; i++){
        console.log("arr" + users[i].username );
        console.log("data"+data.username);
        if(users[i].username == data.username){
            found=true;
            s.write(JSON.stringify({Exists:"Username already in use"}));
        }else if(users[i].id == data.id){
            found=true;
            s.write(JSON.stringify({Exists:"Id already registered"}));

        }else if(users[i].email == data.email){
            found=true;
            s.write(JSON.stringify({Exists: "Email already Taken"}));

        }
    }
    if(!found)
        users.push(data);
       // console.log(users[0]);
}


var searchUser = function (s,data) {
    var found = false;
        for(var i = 0; i < users.length; i++){
            if(users[i].username == data){
                user = users[i];
                found=true;
                s.write(JSON.stringify(user));
            }
        }
   if(!found)
          s.write(JSON.stringify({Found:found}));
}
var deleteUser = function (s,data) {
    var deleted = false;
    for(var i = 0; i < users.length; i++){
        if(users[i].username == data){
            users.splice(i, 1);
            deleted = true;
        }
    }
    s.write(JSON.stringify({Deleted:deleted}));


}
var sendEmail = function(){
    var domain = 'sandboxc53a54ee60d74130ad038e8fb6c64c34.mailgun.org';
    var mailgun = require('mailgun-js')({ apiKey: "key-9b2be08330ce6fe41a9a15a950f624c0", domain: domain });
    var mailcomposer = require('mailcomposer');
    var file = fs.readFileSync('file.jpg');
    var mail = mailcomposer({
        from: 'mailgun@sandboxc53a54ee60d74130ad038e8fb6c64c34.mailgun.org',
        to: 'cvarela1496@gmail.com',
        html: 'Embedded image: <img src="cid:file"/>',
        attachments: [{
            filename: 'file.jpg',
            path:'F:\\Projects\\nodejs\\Server_Node\\file.jpg',
            cid: 'file' //same cid value as in the html img src
        }]
    });

    mail.build(function(mailBuildError, message) {

        var dataToSend = {
            to: 'cvarela1496@gmail.com',
        message: message.toString('ascii')
    };

        mailgun.messages().sendMime(dataToSend, function (sendError, body) {
            if (sendError) {
                console.log(sendError);
                return;
            }
        });
    });
}
var fillArray = function () {
    var contents = fs.readFileSync("users.txt");
    users = JSON.parse(contents)
    console.log(users[1]);
}
var server = net.createServer(function (socket) {
fillArray();
    sendEmail();
socket.on('data', function (data) {
    console.log(''+data);
    request = JSON.parse(data);
    if(request.tipo == "1")
    pushUser(socket,JSON.parse(request.data));
    else if(request.tipo == "2")
    searchUser(socket,request.data);
    else if(request.tipo == "3")
        deleteUser(socket,request.data);
    else if(request.tipo=="0")
        fillArray(socket);
});
});
server.on('close', function() {
    fs.writeFile("users.txt",JSON.stringify(users));
    console.log(' Stopping ...');
});

process.on('SIGINT', function() {
    fs.writeFile("users.txt",JSON.stringify(users));
    server.close();
});
server.listen(7000, "localhost");
console.log("TCP server listening on port 7000 at localhost.");
process.on('uncaughtException', function (err) {

    fs.writeFile("users.txt", JSON.stringify(users));
    console.log(err);
});
