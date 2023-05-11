"use strict"

import {
    toggleRadioPlayClicks
} from './RadioPlayerActions.js'

export default class Player {
    constructor() {

    }

    registerEvents = () => {
        toggleRadioPlayClicks()
    }

    init = () => {
        const playerElement = document.getElementById("player")

        const audio = document.createElement('audio')
        audio.type = 'audio/mpeg'

        playerElement.appendChild(audio)

        this.registerEvents()
    }
}