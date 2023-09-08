"use strict"

import {
    toggleRadioPlayClicks,
    radioKeyboardActions
} from './RadioPlayerActions.js'

export const initPlayer = () => {
    const playerElement = document.getElementById("player")

    const audio = document.createElement('audio')
    audio.type = 'audio/mpeg'
    playerElement.appendChild(audio)

    setPlayerVolume(audio)

    registerPlayerEvents()
}

export const registerPlayerEvents = () => {
    toggleRadioPlayClicks()
    radioKeyboardActions()
}

export const setPlayerVolume = (audio) => {
    const slider = document.getElementById("volume-slider")
    slider.addEventListener("change", (e) => {
        audio.volume = e.currentTarget.value / 100
    })
}