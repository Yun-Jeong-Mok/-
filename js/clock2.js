setInterval(setClock, 1000)

const hourStick = document.querySelector('[data-hour-stick]')
const minutesStick = document.querySelector('[data-minutes-stick]')
const secondsStick = document.querySelector('[data-seconds-stick]')

function setClock() {
    const currentDate = new Date()
    const secondsRatio = currentDate.getSeconds() / 60
    const minutesRatio = (secondsRatio + currentDate.getMinutes()) / 60
    const hourRatio = (minutesRatio + currentDate.getHours()) / 12
    setRotation(secondsStick, secondsRatio)
    setRotation(minutesStick, minutesRatio)
    setRotation(hourStick, hourRatio)
}

function setRotation(element, rotationRatio) {
    element.style.setProperty('--rotation', rotationRatio * 360)
}

setClock()