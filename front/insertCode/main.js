let myId = null
let destinyId = null

const connectToSSE = () => {
    const eventSourcer = new EventSource('http://localhost:3001/listen')
    eventSourcer.onmessage = event => {
        const data = JSON.parse(event.data.replace(/'/g, '"'))
        const [ messageType, message ] = data.message.split('|--|')

        if(data.id == myId) {
            switch(messageType) {
                case 'user_id':
                    destinyId = message
                    const messageForm = document.querySelector('#message-form')
                    messageForm.style.display = 'flex'
                    break

                case 'message':
                    const messages = document.querySelector("#messages")
                    const newMessage = document.createElement('p')
                    newMessage.textContent = message
                    messages.appendChild(newMessage)
                    break
            }
        }
    }
}

const sendCode = async code => {
    const url = 'http://localhost:3001/send-code'
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ code: code }),
            headers: headers
        })
    
        const data = await response.json()
        return data

    } catch (error) {
        return false
    }
}

const sendMessage = async (message, destinyId) => {
    const url = 'http://localhost:3001/send-message'
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ message: message, id: destinyId }),
            headers: headers
        })

        const data = await response.json()
        return data

    } catch (error) {
        return false
    }
}

window.onload = () => {
    const codeButton = document.querySelector('#code-button')
    const messageForm = document.querySelector('#message-form')
    const messageButton = document.querySelector('#message-button')

    codeButton.addEventListener('click', async event => {
        event.preventDefault()
        const codeInput = document.querySelector('#code-input')
        const response = await sendCode(codeInput.value)
        
        console.log(response)

        myId = response.user_id
        destinyId = response.destiny_id
        connectToSSE()
        
        if(destinyId) messageForm.style.display = 'flex'

        codeInput.value = ''
    })

    messageButton.addEventListener('click', async event => {
        event.preventDefault()
        const messageInput = document.querySelector('#message-text')
        sendMessage(messageInput.value, destinyId)
        messageInput.value = ""
    })
}