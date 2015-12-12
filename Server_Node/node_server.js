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

var sendEmail = function(sendto,fileim,filedir,userinfo){
    var domain = 'sandboxc53a54ee60d74130ad038e8fb6c64c34.mailgun.org';
    var mailgun = require('mailgun-js')({ apiKey: "key-9b2be08330ce6fe41a9a15a950f624c0", domain: domain });
    var mailcomposer = require('mailcomposer');
    var file = fs.readFileSync(fileim);
    var mail = mailcomposer({
        from: 'mailgun@sandboxc53a54ee60d74130ad038e8fb6c64c34.mailgun.org',
        to: sendto,
        html: userinfo+' <img src="cid:file"/>',
        attachments: [{
            filename: fileim,
            path: filedir, //'F:\\Projects\\nodejs\\Node_Client_Server\\Server_Node\\file.jpg',
            cid: 'file' //same cid value as in the html img src
        }]
    });

    mail.build(function(mailBuildError, message) {

        var dataToSend = {
            to:sendto,
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
    else if(request.tipo==4){
        found = false;
        for(var i = 0; i < users.length; i++){
            if(users[i].username == request.data1){
                user = users[i];
                arr = user.pf.split("\\");
                sendEmail(request.data2,arr[arr.length-1],user.pf,'<p>Username: ' + user.username + '</p> <p> E-mail: '+ user.email + '</p><p> Name: ' + user.name + '</p><p>  ID: ' + user.id + '</p><p>  Birthday: ' + user.bd + '</p><p>  Profile Picture: ' + user.pf +'</p> ');
                socket.write(JSON.stringify({Found: true}));
                found = true;
                break;
            }
            if(!found)
            socket.write(JSON.stringify({Found: false}));
        }
    }
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
server.listen(399, "localhost");
console.log("TCP server listening on port 399 at localhost.");
process.on('uncaughtException', function (err) {

    fs.writeFile("users.txt", JSON.stringify(users));
    console.log(err);
});
