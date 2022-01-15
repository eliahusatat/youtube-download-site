const nodemailer = require('nodemailer')
const { logger } = require('../utils/logger')

const sendMail = ({ from, to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })
  return transporter.sendMail({ from, to, subject, text }, (error, info) => {
    if (error) {
      console.log(error)
      logger.error({ name: 'email error', message: error })
    }
  })
}

// for thesting all the api  send to http://localhost:3001/youtube/mail with this json :
/*
{
    "from": "<eliahusatat.youtube@outlook.co.il>",
     "to" : "eliahusatat@gmail.com",
     "subject" : "test mail api!!!",
     "text" : "test mail api!!!"

}
*/

// for testing in the script node ./service/MailService.js
/* async function main() {
    const transporter = nodemailer.createTransport({
        service : "hotmail",
        auth: {
            user: 'eliahusatat.youtube@outlook.co.il',
            pass:  'youtube123'
        }
    });

// setup e-mail data
var mailOptions = {
    from: '"Our Code World " <eliahusatat.youtube@outlook.co.il>', // sender address (who sends)
    to: 'eliahusatat@gmail.com', // list of receivers (who receives)
    subject: 'Hello', // Subject line
    text: 'Hello world ', // plaintext body
    html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

    console.log('Message sent: ' + info.response);
});
}
main().catch(console.error);
*/

module.exports = sendMail
