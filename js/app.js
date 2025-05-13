"use strict"

import { setState, fetchUrl } from './DataSource.js'
import { baseUrl } from './Utils.js'
import { initPlaylist } from './Playlist.js?v=1'
import { initPlayer } from './Player.js'
import { typeSelectorEvents } from './GenericEvents.js'

// Helper to get query parameter
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const playlistUrl = getQueryParam('playlistUrl') || (baseUrl + "/data/playlist.json");
const data = await fetchUrl(playlistUrl);

const registerEvents = () => {
    typeSelectorEvents()
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        const activeElement = document.activeElement
        const playlistItems = document.querySelectorAll('.playlist-items li')
        const currentIndex = Array.from(playlistItems).indexOf(activeElement)
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault()
                if (currentIndex > 0) {
                    playlistItems[currentIndex - 1].focus()
                }
                break
            case 'ArrowDown':
                e.preventDefault()
                if (currentIndex < playlistItems.length - 1) {
                    playlistItems[currentIndex + 1].focus()
                }
                break
            case 'Enter':
            case ' ':
                if (activeElement.classList.contains('playlist-items__item')) {
                    e.preventDefault()
                    activeElement.click()
                }
                break
        }
    })

    // Add volume slider smooth update
    const volumeSlider = document.getElementById('volume-slider')
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value
            e.target.style.setProperty('--volume-level', `${value}%`)
        })
    }
}

const initApp = async () => {
    try {
        if (data) {
            const audio = new Audio()
            audio.preload = 'metadata'
            
            await setState({
                playlist: data,
                player: audio,
                currentFilter: 'all'
            })

            await initPlaylist(data)
            await initPlayer()
            await registerEvents()

            // Initialize visualizer if supported
            if (window.AudioContext || window.webkitAudioContext) {
                const visualiser = document.getElementById('visualiser')
                if (visualiser) {
                    visualiser.classList.remove('hidden')
                }
            }
        } else {
            throw new Error('No playlist data available')
        }
    } catch (error) {
        console.error('Error initializing app:', error)
        const app = document.getElementById('app')
        app.innerHTML = '<div class="error-message">Unable to initialize the application. Please try again later.</div>'
    }
}

// Handle offline/online status
window.addEventListener('online', () => {
    const app = document.getElementById('app')
    if (app.querySelector('.error-message')) {
        window.location.reload()
    }
})

window.addEventListener('offline', () => {
    const app = document.getElementById('app')
    if (!app.querySelector('.error-message')) {
        app.innerHTML = '<div class="error-message">You are offline. Please check your internet connection.</div>'
    }
})

// Initialize the application
await initApp()