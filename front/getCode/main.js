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

const getCode  = async () => {
    const url = 'http://localhost:3001/get-code'
    try {
        const request = await fetch(url)
        const data = await request.json()
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

window.onload = async() => {
    const codeSpan = document.querySelector('#code')
    const messageForm = document.querySelector('#message-form')
    const messageButton = document.querySelector('#message-button')
    const data = await getCode()
    myId = data.id

    if(data) {
        codeSpan.innerHTML = data.code
        
        connectToSSE()
    }

    messageButton.addEventListener('click', async event => {
        event.preventDefault()
        const messageInput = document.querySelector('#message-text')
        sendMessage(messageInput.value, destinyId)
        messageInput.value = ""
    })
}