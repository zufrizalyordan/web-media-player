"use strict"

import {
    toggleRadioPlayClicks,
    radioKeyboardActions
} from './RadioPlayerActions.js'

export default class Player {
    constructor() {

    }

    registerEvents = () => {
        toggleRadioPlayClicks()
        radioKeyboardActions()
    }

    init = () => {
        const playerElement = document.getElementById("player")

        const audio = document.createElement('audio')
        audio.type = 'audio/mpeg'
        playerElement.appendChild(audio)

        this.volume(audio)

        this.registerEvents()
    }

    volume = (audio) => {
        const slider = document.getElementById("volume-slider")
        slider.addEventListener("change", (e) => {
            audio.volume = e.currentTarget.value / 100
        })
    }
}