"use strict"

import { setState, getState } from "./DataSource.js"
import { updatePlaylistActiveItem } from "./Playlist.js"

let audioContext = null
let analyser = null
let animationFrame = null
let sourceNode = null
let currentPlayerElement = null

const initAudioVisualizer = () => {
    const canvas = document.getElementById('visualiser')
    if (!canvas) {
        console.warn('Visualizer canvas not found')
        return
    }

    // Responsive canvas
    const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth || 400
        canvas.height = canvas.offsetHeight || 60
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const ctx = canvas.getContext('2d')
    const state = getState()
    const player = state.player

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)()
        console.log('AudioContext created')
    }
    if (!analyser) {
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 128
        console.log('AnalyserNode created')
    }
    // Only create sourceNode if not already created for this player
    if (!sourceNode || currentPlayerElement !== player) {
        if (sourceNode) {
            sourceNode.disconnect()
        }
        sourceNode = audioContext.createMediaElementSource(player)
        currentPlayerElement = player
        sourceNode.connect(analyser)
        analyser.connect(audioContext.destination)
        console.log('MediaElementSource connected')
    }

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
        animationFrame = requestAnimationFrame(draw)
        analyser.getByteFrequencyData(dataArray)

        // Log the first 10 bytes for debugging
        console.log('Audio bytes:', dataArray.slice(0, 10))

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const barWidth = canvas.width / bufferLength
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height
            ctx.fillStyle = `hsl(${i * 360 / bufferLength}, 80%, 60%)`
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight)
        }
    }

    console.log('Starting visualizer draw loop')
    draw()
}

const stopAudioVisualizer = () => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame)
        animationFrame = null
    }
    if (sourceNode) {
        sourceNode.disconnect()
        sourceNode = null
    }
}

const updatePlayer = async (data) => {
    try {
        const state = getState()
        const player = state.player
        player.crossOrigin = 'anonymous'
        // Set the stream URL directly (no proxy)
        player.src = data.stream_url

        // Show loading dots when playback is requested
        const loadingDots = document.querySelector('.loading-dots')
        if (loadingDots) loadingDots.classList.add('is-loading')

        // Helper to hide loading dots and clean up listeners
        let loadingTimeout
        const cleanup = () => {
            if (loadingDots) loadingDots.classList.remove('is-loading')
            player.removeEventListener('progress', onData)
            player.removeEventListener('playing', onData)
            player.removeEventListener('canplay', onData)
            player.removeEventListener('canplaythrough', onData)
            player.removeEventListener('error', onError)
            player.removeEventListener('pause', onPauseOrEnd)
            player.removeEventListener('ended', onPauseOrEnd)
            if (loadingTimeout) clearTimeout(loadingTimeout)
        }
        const onData = () => {
            cleanup()
        }
        const onError = () => {
            cleanup()
            showError('Unable to play audio. Please try again.')
        }
        const onPauseOrEnd = () => {
            cleanup()
        }
        player.addEventListener('progress', onData)
        player.addEventListener('playing', onData)
        player.addEventListener('canplay', onData)
        player.addEventListener('canplaythrough', onData)
        player.addEventListener('error', onError)
        player.addEventListener('pause', onPauseOrEnd)
        player.addEventListener('ended', onPauseOrEnd)

        // Timeout: if no data after 10s, show error
        loadingTimeout = setTimeout(() => {
            cleanup()
            showError('Network timeout. Unable to play audio.')
        }, 10000)

        // Initialize visualizer when audio starts playing
        player.addEventListener('play', () => {
            if (audioContext?.state === 'suspended') {
                audioContext.resume()
            }
            initAudioVisualizer()
        }, { once: true })

        player.addEventListener('pause', () => {
            stopAudioVisualizer()
        })

        player.addEventListener('ended', () => {
            stopAudioVisualizer()
        })

        await player.play()
    } catch (error) {
        const loadingDots = document.querySelector('.loading-dots')
        if (loadingDots) loadingDots.classList.remove('is-loading')
        console.error('Error playing audio:', error)
        showError('Unable to play audio. Please try again.')
    }
}

const showError = (message) => {
    const title = document.querySelector('#now-playing-message')
    title.textContent = message
    title.style.color = '#ff4444'
    title.setAttribute('aria-live', 'assertive')
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
    const title = document.querySelector('#now-playing-message')
    title.textContent = data.title
    title.style.color = '' // Reset error color if any
    title.setAttribute('aria-live', 'polite')
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
    
    // Initialize audio context on user interaction
    document.addEventListener('click', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)()
        }
    }, { once: true })
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
    updatePlayerInfo(data)
    updatePlayer(data)
    updatePlayerControls()
    updateToggleControls()
    updatePlayerSignalInfo(data)
    updatePlaylistActiveItem(data)
}

const showVisualizer = () => {
    // Do nothing: keep visualiser hidden
};
const hideVisualizer = () => {
    const visualiser = document.getElementById('visualiser');
    if (visualiser) visualiser.classList.add('hidden');
};