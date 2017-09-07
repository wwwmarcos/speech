const APP_LANG = 'pt-BR'
const API_URL = '/watson'
const recognition = new webkitSpeechRecognition()

recognition.lang = APP_LANG
recognition.onresult = onResult
recognition.onend = onEnd

function onResult(event) {
  for (let result of event.results) {
    if (result.isFinal) {
      resolveTranscript(result[0].transcript)
    }
  }
}

async function resolveTranscript(transcript) {
  try {
    printTranscript(transcript)

    const awnser = await getAwnser(transcript)
    speak(awnser.data.response)

    printWatsonResponse(awnser.data.response)
  } catch (error) {
    alert(error)
    console.error(error)
  }
}

function getAwnser(transcript) {
  return axios.post(API_URL, {
    input: {
      text: transcript
    }
  })
}

function speak(synthesis) {
  const msg = new SpeechSynthesisUtterance(synthesis)
  msg.lang = APP_LANG
  window.speechSynthesis.speak(msg)
}

function onEnd() {
  console.log('end')
}

function start() {
  recognition.start()
}

function printTranscript(transcript) {
  document.querySelector('#print').innerHTML = `Eu entendi: ${transcript}`
}

function printWatsonResponse(response) {
  document.querySelector('#watson').innerHTML = `Resposta: ${response}`
}


document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('#start').addEventListener('click', start)
})