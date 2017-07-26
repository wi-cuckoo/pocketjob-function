const functions = require('firebase-functions')
const http = require('./http.js')
const config = require('./config.js')

// function to query openid and session_key
const getOpenId = (js_code) => {
	let url = '/sns/jscode2session'
	let params = {}
	params.grant_type = 'authorization_code'
	params.appid = config.APP_ID
	params.secret = config.APP_SECRET
	params.js_code = js_code
	console.log(params)
	return http.get(url, params)
}

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const nodemailer = require('nodemailer');

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

const APP_NAME = 'PocketJob Tech';
const ADMIN_MAIL = 'only_one23@163.com';
const CC_MAIL = 'yp_liuwei@live.com';

// Sends a welcome email to the given user.
function sendNotification(email, resume) {
  const mailOptions = {
    from: `${APP_NAME} <ypliuwei@gmail.com>`,
    to: email,
    cc: CC_MAIL
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `New Resume From ${APP_NAME}`;
  mailOptions.text = `杨总，你有新的消息，请注意查收！！！\n\n` +
    `\t姓名：\t${resume.name}\n` +
    `\t年龄：\t${resume.age}\n` +
    `\t毕业院校：\t${resume.university}\n` +
    `\t电话号码：\t${resume.phone}\n` +
    `\t申请职位：\t${resume.job}\n` +
    `\t自我介绍：\t${resume.intro}\n\n\n` +
    ` Copyright © 2017 PocketJob Tech`;

  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New notify email sent to:', email);
  });
}

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.newResumeNotify = functions.database.ref('/candidates/{resumeId}')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      if (!event.data.exists()) {
        return;
      }

      const resume = event.data.val()
      console.log(resume)
      console.log('new resume: ', event.params.resumeId)
      
      // call api of weixin to fetch the openid
      // return getOpenId(js_code).then( resp => {
      // 	resp && event.data.ref.child('openid').set(resp.openid)
      // })

      // sent email as an alteration
      return sendNotification(ADMIN_MAIL, resume)

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      // return event.data.ref.child('openid').set('real openid');
    })