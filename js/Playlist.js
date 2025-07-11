"use strict"
import { baseUrl, secondsToMinutes } from "./Utils.js"
import { playlistClicks } from "./PlaylistActions.js"
import { getState } from "./DataSource.js"

export const registerPlaylistEvents = () => {
    playlistClicks()
}

export const updatePlaylistActiveItem = () => {
    const state = getState()
    const activeItem = document.querySelector(".playlist-item.active")
    activeItem?.classList.remove("active")

    const playlist = document.querySelectorAll(".playlist-item")
    playlist.forEach(item => {
        if (item.getAttribute('data-id') == state.selectedItem.id) {
            item.classList.add('active')
        }
    })
}

export const buildPlaylist = (data) => {
    if (data.length>0) {
        // Group data into pairs for desktop layout
        const rows = []
        for (let i = 0; i < data.length; i += 2) {
            rows.push(data.slice(i, i + 2))
        }
        
        const list = rows.map(row => {
            const items = row.map(item => {
                let img = ""
                if (item.image.logo !== undefined) {
                    img = baseUrl+item.image.logo
                } else if (item.image.cover !== undefined) {
                    img = item.image.cover
                }
                const image = (img) ? `<div class=\"playlist-logo\" style=\"background-image: url(${img})\"></div>` : ""
                let meta = ""
                let metaDuration = secondsToMinutes(item.meta.duration)
                if(item.type == "music") {
                    meta = `<span class=\"meta\">${item.meta.artist} &middot; ${item.meta.year} &middot; ${metaDuration}</span>`
                }
                return `<div data-id=\"${item.id}\" data-type=\"${item.type}\" class=\"playlist-item\" tabindex=\"0\" aria-label=\"Station: ${item.title}\">${image}<div class=\"playlist-info\"><span class=\"title\">${item.title}</span>${meta}</div></div>`
            }).join("")
            return items
        }).join("")
        
        const playlistContainer = document.querySelector(".playlist-items")
        playlistContainer.innerHTML = list

        // Add keyboard support for playlist-item activation
        playlistContainer.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    item.click()
                }
            })
        })
    } else {
        alert("No playlist data. please refresh.")
    }
}

export const initPlaylist = async (data) => {
    await buildPlaylist(data)
    await registerPlaylistEvents()
}