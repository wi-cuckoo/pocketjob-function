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

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.refreshUserOpenId = functions.database.ref('/users/{userId}')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      const { js_code } = event.data.val()
      console.log('User', event.params.userId, `\t${js_code}`)
      
      // call api of weixin to fetch the openid
      return getOpenId(js_code).then( resp => {
      	resp && event.data.ref.child('openid').set(resp.openid)
      })

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      // return event.data.ref.child('openid').set('real openid');
    })