"use strict"

import { setState } from "./DataSource.js"

const updatePlayer = (data) => {
    const audioPlayer = document.querySelector("#player audio")

    audioPlayer.pause()
    audioPlayer.src = data.stream_url
    audioPlayer.play()
}

const updatePlayerControls = () => {
    const controls = document.querySelector('.radio-player-controls')
    if(controls.classList.contains('hidden')) {
        controls.classList.remove("hidden")
    }

    const volume = document.querySelector('.radio-player-volume')
    if(volume.classList.contains('hidden')) {
        volume.classList.remove("hidden")
    }
}

const updatePlayerInfo = (data) => {
    const title = document.querySelector('#radio-player-info h1')
    title.textContent = data.title
}

const showLoadingDots = (timeout) => {
    const loadingDots = document.querySelector('.loading-dots')
    loadingDots.classList.add('is-loading')
    setTimeout(() => {
        loadingDots.classList.remove('is-loading')
    }, timeout)
}

const updateToggleControls = async () => {
    const audioPlayer = document.querySelector("#player audio")
    const playControl = document.querySelector(".radio-player-controls .__play")
    const pauseControl = document.querySelector(".radio-player-controls .__pause")

    if(!playControl.classList.contains('hidden')) {
        playControl.classList.add('hidden')
    }

    if(!pauseControl.classList.contains('hidden')) {
        pauseControl.classList.add('hidden')
    }

    const timeout = !audioPlayer.paused ? 3000 : 500
    showLoadingDots(timeout)

    if (!audioPlayer.paused) {
        pauseControl.classList.remove('hidden')
    } else {
        playControl.classList.remove('hidden')
    }
}

export const toggleRadioPlayClicks = () => {
    const audioPlayer = document.querySelector("#player audio")
    const playControl = document.querySelector(".radio-player-controls .__play")
    const pauseControl = document.querySelector(".radio-player-controls .__pause")

    playControl.onclick = () => {
        audioPlayer.play()
        updateToggleControls()
    }

    pauseControl.onclick = () => {
        audioPlayer.pause()
        updateToggleControls()
    }
}

const updatePlayerSignalInfo = (data) => {
    const signalNo = document.querySelector('.__signal-no')
    const signalText = document.querySelector('.__signal-text b')

    signalNo.textContent = data.id
    signalText.textContent = data.signal
}

const toggleRadioPlayButtons = () => {
    const audioPlayer = document.querySelector("#player audio")
    const playControl = document.querySelector(".radio-player-controls .__play")
    const pauseControl = document.querySelector(".radio-player-controls .__pause")

    if (audioPlayer.paused) {
        playControl.click()
    } else {
        pauseControl.click()
    }

    updateToggleControls()
}

export const radioKeyboardActions = () => {
    const playerContainer = document.getElementById("player")
    // only enable when player is active, in this case its not hidden
    if (!playerContainer.classList.contains('hidden')) {
        document.addEventListener("keydown", (e) => {

            // Spacebar key was pressed.
            if (e.keyCode === 32) {
                toggleRadioPlayButtons()
            }
        })
    }
}

export const loadRadioData = (data) => {
    setState({ selectedItem: data })
    updatePlayer(data)
    updatePlayerControls()
    updatePlayerInfo(data)
    updateToggleControls()
    updatePlayerSignalInfo(data)
}