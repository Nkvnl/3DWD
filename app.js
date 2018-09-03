var express = require("express"); // call express
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
var zlib = require('zlib');
var http = require('http');
var fs = require('fs');
// var compressible = require('compressible')
// const exphbs     = require("handlebars");
var app = express();
// server example
// Running a gzip operation on every request is quite expensive.
// It would be much more efficient to cache the compressed buffer.

http.createServer(function(request, response) {
    var raw = fs.createReadStream('index.html');
    var acceptEncoding = request.headers['accept-encoding'];
    if (!acceptEncoding) {
        acceptEncoding = '';
    }

    // Note: this is not a conformant accept-encoding parser.
    // See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
    if (acceptEncoding.match(/\bdeflate\b/)) {
        response.writeHead(200, { 'content-encoding': 'deflate' });
        raw.pipe(zlib.createDeflate()).pipe(response);
    }
    else if (acceptEncoding.match(/\bgzip\b/)) {
        response.writeHead(200, { 'content-encoding': 'gzip' });
        raw.pipe(zlib.createGzip()).pipe(response);
    }
    else {
        response.writeHead(200, {});
        raw.pipe(response);
    }
}).listen(1337);



app.set("view engine", "ejs");
// app.use(compressible());

// app.engine("handelbars", exphbs());
app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", function(req, res) {
    res.render("theme-blue");
});

app.get("/red", function(req, res) {
    res.render("theme-red");
});

app.get("/green", function(req, res) {
    res.render("theme-green");
});

app.get("/yellow", function(req, res) {
    res.render("theme-yellow");
});

app.get("/test", function(req, res) {
    res.render("bedankt");
});

app.get("/blog", function(req, res) {
    res.render("blog")
})

app.get("/website", function(req, res) {
    res.render("website")
})


app.post("/signup", (req, res) => {
    var name = (req.body.name);
    var output = `
    <h3> Nieuwe aanmelding nieuwsbrief<h3>
    <h5>${req.body.email}<h5>
    `

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'mailserver163@gmail.com',
            pass: 'ma1ls3rv3r'
        }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"3DWD" <mailserver163@gmail.com>', // sender address
        to: 'niek_losenoord@hotmail.com', // list of receivers
        subject: 'Aanmelding nieuwsbrief', // Subject line
        text: '', // plain text body
        html: output // html body
    };

    var msg = "Bedankt voor je bericht! Binnen 24 uur zijn we bij je terug."
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        res.render("bedankt")

    });
});


app.post("/send", (req, res) => {
    var name = (req.body.name);
    var output = `
    <h3> Nieuw bericht van ${req.body.name}.<h3>
    <h5> Details <h5>
    <ul>
        <li>Naam : ${req.body.name}</li>
        <li>Email : ${req.body.email}</li>
        <li>Telefoon : ${req.body.tel}</li>
    </ul>
    <p>${req.body.bericht}<p>
    `

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'mailserver163@gmail.com',
            pass: 'ma1ls3rv3r'
        }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"3DWD" <mailserver163@gmail.com>', // sender address
        to: 'niek_losenoord@hotmail.com', // list of receivers
        subject: name + ' Heeft een bericht gestuurd via de website.', // Subject line
        text: '', // plain text body
        html: output // html body
    };

    var msg = "Bedankt voor je bericht! Binnen 24 uur zijn we bij je terug."
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        res.render("bedankt")

    });
});

// app = express.createServer();

// app.use(express.bodyParser());

// app.post('/formProcess', function (req, res) {
//     var data=req.body;
//   var Naam = req.body["g52-name"];
//   var mail = req.body["g52-email"];
//   var Telefoon = req.body["g52-website"];
//   var Bericht = req.body["g52-comment"];

//     var smtpTransport = nodemailer.createTransport("SMTP",{
//       service: "Gmail", 
//       auth: {
//       user: "niekvanlosenoord@gmail.com",
//       pass: "*******"
//       }});

//   smtpTransport.sendMail({  //email options
//   from: "Sender Name <3DWD@gmail.com>",
//   to: "Receiver Name <niekvanlosenoord@email.com, niek_losenoord@hotmail.com>", // receiver
//   subject: "Nieuw bericht op 3DWD", // subject
//   html: "here your data goes" // body (var data which we've declared)
//     }, function(error, response){  //callback
//          if(error){
//           console.log("De mailserver is tijdelijk offline, probeer het later opnieuw of mail mij direct op niek_losenoord@hotmail.com");
//         }else{
//           console.log("Bedankt voor je bericht! U krijgt binnen 24 uur reactie.");
//       }

//   smtpTransport.close(); 
//     }); });

app.listen(process.env.PORT, process.env.IP, function() { // tell node to listen & define a port to view app
    console.log("3D Web Dev server starting...");
});
