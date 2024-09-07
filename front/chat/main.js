window.onload = () => {
    const button = document.querySelector('#text-button')

    button.addEventListener('click', async event => {
        event.preventDefault()
        const textInput = document.querySelector('#text-input')
        
        console.log(textInput.value)

        textInput.value = ''

    })
}