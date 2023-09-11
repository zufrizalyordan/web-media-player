"use strict"

import { setState, getState } from "./DataSource.js"
import { updatePlaylistActiveItem } from "./Playlist.js"

const audioVis = () => {
    const state = getState()
    const player = state.player

    const audioCtx = window.AudioContext || window.webkitAudioContext

    const ctx = new audioCtx()
    const stream = new MediaStream(source)
    // const src = ctx.createMediaStreamSource(stream)
    // src.connect(audioCtx.destination)
    // new Audio().srcObject = stream

    // ___
    // let audioSource = audioCtx.createMediaStreamSource(stream)
    // let analyser = audioCtx.createAnalyser()
    // audioSource.connect(analyser)
    // analyser.connect(audioCtx.destination)
    // new Audio().srcObject = stream
    // analyser.fftSize = 128

    // const bufferLength = analyser.frequencyBinCount
    // const dataArray = new Uint8Array(bufferLength)
    // const barWidth = canvas.width / bufferLength
    // let barHeight

    // function animate() {
    //     x = 0
    //     ctx.clearRect(0, 0, canvas.width, canvas.height)
    //     analyser.getByteFrequencyData(dataArray)
    //     console.log(analyser)
    //     for (let i = 0; i < bufferLength; i++) {
    //         barHeight = dataArray[i];
    //         ctx.fillStyle = "white"
    //         ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
    //         x += barWidth
    //     }

    //     requestAnimationFrame(animate)
    //     console.log("animate")
    // }

    // animate()
}

const updatePlayer = async (data) => {
    const state = getState()
    const player = state.player
    player.crossOrigin = true
    player.src = data.stream_url
    player.play()

    player.addEventListener('loadedmetadata', () => {
        // console.clear()
        // console.log("metadata loaded. playing stream..")
    }, false)
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
    const state = getState()
    const player = state.player
    const playControl = document.querySelector(".radio-player-controls .__play")
    const pauseControl = document.querySelector(".radio-player-controls .__pause")

    if(!playControl.classList.contains('hidden')) {
        playControl.classList.add('hidden')
    }

    if(!pauseControl.classList.contains('hidden')) {
        pauseControl.classList.add('hidden')
    }

    const timeout = !player.paused ? 3000 : 500
    showLoadingDots(timeout)

    if (!player.paused) {
        pauseControl.classList.remove('hidden')
    } else {
        playControl.classList.remove('hidden')
    }
}

const toggleRadioPlayClickEvents = () => {
    const state = getState()
    const player = state.player
    const playControl = document.querySelector(".radio-player-controls .__play")
    const pauseControl = document.querySelector(".radio-player-controls .__pause")

    playControl.onclick = () => {
        player.play()
        updateToggleControls()
    }

    pauseControl.onclick = () => {
        player.pause()
        updateToggleControls()
    }
}

const updatePlayerSignalInfo = (data) => {
    const signalInfo = document.querySelector('.radio-player-info__signal')
    const signalNo = document.querySelector('.__signal-no')
    const signalText = document.querySelector('.__signal-text b')
    const signalTitle = document.querySelector('.__signal-title')
    const signalTextContainer = document.querySelector('.__signal-text')
    const musicImage = document.querySelector('.__music-image')

    if(data.type == "music") {
        if (!signalNo.classList.contains("hidden")) {
            signalNo.classList.add("hidden")
            signalText.classList.add("hidden")
            signalTitle.classList.add("hidden")
            signalTextContainer.classList.add("hidden")
        }

        if(musicImage.classList.contains("hidden")) {
            musicImage.classList.remove("hidden")
        }

        if(!signalInfo.classList.contains('music')) {
            signalInfo.classList.remove('radio')
            signalInfo.classList.add('music')
        }

        musicImage.style.backgroundImage = "url('"+data.image.cover+"')"
    } else {
        if(!musicImage.classList.contains("hidden")) {
            musicImage.classList.add("hidden")

            signalNo.classList.remove("hidden")
            signalText.classList.remove("hidden")
            signalTitle.classList.remove("hidden")
            signalTextContainer.classList.remove("hidden")
            signalInfo.classList.remove('music')
        }
    }

    signalNo.textContent = data.id
    signalText.textContent = data.signal
}

const toggleRadioPlayButtons = () => {
    const state = getState()
    const player = state.player
    const playControl = document.querySelector(".radio-player-controls .__play")
    const pauseControl = document.querySelector(".radio-player-controls .__pause")

    if (player.paused) {
        playControl.click()
    } else {
        pauseControl.click()
    }

    updateToggleControls()
}

export const setPlayerVolume = () => {
    const state = getState()
    const player = state.player
    const slider = document.getElementById("volume-slider")
    slider.addEventListener("change", (e) => {
        player.volume = e.currentTarget.value / 100
    })
}

const moveVolume =  (mode) => {
    const state = getState()
    const player = state.player
    const volumeSlider = document.querySelector('#volume-slider')
    const volumeValue = parseInt(volumeSlider.value)

    if (mode === "up" && volumeValue < 100) {
        volumeSlider.value = volumeValue+10
    }

    if (mode === "down" && volumeValue > 0) {
        volumeSlider.value = volumeValue-10
    }

    player.volume = volumeSlider.value / 100
}

const getItem = (mode) => {
    const state = getState()
    const items = state.playlist

    const idx = items.findIndex((object) => {
        return parseInt(object.id) === parseInt(state.selectedItem.id)
    })

    let index = idx
    let item = {}
    if (mode == "prev") {
        item = (idx == 0) ? items[items.length-1] : items[index-1]
    } else {
        item = (idx == items.length-1) ? items[0] : items[index+1]
    }

    return item
}

export const initRadioPlayer = () => {
    toggleRadioPlayClickEvents()
    radioKeyboardEvents()
    setPlayerVolume()
}

const radioKeyboardEvents = () => {
    const playerContainer = document.getElementById("player")
    // only enable when player is active, in this case its not hidden
    if (!playerContainer.classList.contains('hidden')) {
        document.addEventListener("keydown", (e) => {
            // Spacebar key was pressed.
            if (e.code === "Space") {
                toggleRadioPlayButtons()
            }

            // Left key pressed
            if (e.key === "ArrowLeft") {
                moveVolume("down")
            }

            // Right key pressed
            if (e.key === "ArrowRight") {
                moveVolume("up")
            }

            // Up key pressed. prev
            if (e.key === "ArrowUp") {
                loadTitle(getItem("prev"))
            }

            // Down key pressed. next
            if (e.key === "ArrowDown") {
                loadTitle(getItem("next"))
            }
        })
    }
}

export const loadTitle = (data) => {
    const state = getState()
    setState({ selectedItem: data })
    updatePlayer(data)
    updatePlayerControls()
    updatePlayerInfo(data)
    updateToggleControls()
    updatePlayerSignalInfo(data)
    updatePlaylistActiveItem(data)
}