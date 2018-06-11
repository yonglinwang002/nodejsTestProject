var nodemailer = require('nodemailer');


function testSend(){

    var transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        secureConnection: true,
        port:465,
        auth: {
            user: 'liuxingzi00001@163.com',
            pass: 'XXXXXXXX',//邮箱授权码，不是密码
        }
    });
    
    var mailOptions = {
        from: 'liuxingzi00001@163.com ', // sender address
        to: 'liuxingzi002@163.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ✔', // plaintext body
        html: '<b>Hello world ✔</b>' // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
}

exports.testSend = testSend;