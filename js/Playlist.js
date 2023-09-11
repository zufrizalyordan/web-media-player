"use strict"
import { baseUrl, secondsToMinutes } from "./Utils.js"
import { playlistClicks } from "./PlaylistActions.js"
import { getState } from "./DataSource.js"

export const registerPlaylistEvents = () => {
    playlistClicks()
}

export const updatePlaylistActiveItem = () => {
    const state = getState()
    const activeItem = document.querySelector(".playlist-items li.active")
    activeItem?.classList.remove("active")

    const playlist = document.querySelectorAll(".playlist-items li")
    playlist.forEach(item => {
        if (item.getAttribute('data-id') == state.selectedItem.id) {
            item.classList.add('active')
        }
    })
}

export const buildPlaylist = (data) => {
    if (data.length>0) {
        const list = data.map(item => {
            let img = ""
            if (item.image.logo !== undefined) {
                img = baseUrl+item.image.logo
            } else if (item.image.cover !== undefined) {
                img = item.image.cover
            }

            const image = (img) ? `<div class="playlist-logo" style="background-image: url(${img})"></div>` : ""

            let meta = ""
            let metaDuration = secondsToMinutes(item.meta.duration)
            if(item.type == "music") {
                meta = `<span class="meta">${item.meta.artist} &middot; ${item.meta.year} &middot; ${metaDuration}</span>`
            }

            return `<li data-id="${item.id}" data-type="${item.type}" class="playlist-item">${image}<div class="playlist-info"><span class="title">${item.title}</span>${meta}</div></li>`
        })

        const playlistContainer = document.querySelector(".playlist-items")
        list.forEach(item => {
            playlistContainer.innerHTML += item
        })
    } else {
        alert("No playlist data. please refresh.")
    }
}

export const initPlaylist = async (data) => {
    await buildPlaylist(data)
    await registerPlaylistEvents()
}