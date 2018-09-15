var express = require("express"); // call express
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
var compression = require('compression');
var app = express();
var path = require('path');


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function(req, res) {
    res.render("theme-blue");
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
    `;

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'mailserver163@gmail.com',
            pass: 'HIB56JIB79BONc'
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

app.listen(process.env.PORT, process.env.IP, function() { // tell node to listen & define a port to view app
    console.log("3D Web Dev server starting...");
});
