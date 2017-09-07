const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('./config')
const ConversationV1 = require('watson-developer-cloud/conversation/v1')

const conversation = new ConversationV1({
  username: config.username,
  password: config.password,
  version_date: ConversationV1.VERSION_DATE_2017_05_26
})

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

app.use(express.static(__dirname + '/public'))

app.post('/watson', (req, res) => {
  conversation.message({
    workspace_id: config.WORKSPACE_ID,
    input: req.body.input
  }, (error, data) => {
    if (error) throw error
    sendResponse(data, res)
  })
})

function sendResponse(watsonResponse, res) {
  res.status(200).json({
    response: watsonResponse.output.text[0]
  })
}
app.set('port', process.env.PORT || config.port)

app.listen(app.get('port'), () => {
  console.log('running on port', app.get('port'))
})