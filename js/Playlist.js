"use strict"
import { baseUrl } from "./Utils.js"
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
            const image = (item.image.logo) ? `<div class="playlist-logo" style="background-image: url(${baseUrl}${item.image.logo})"></div>` : ""
            return `<li data-id="${item.id}"><div class="playlist-item">${image}<span>${item.title}</span></div></li>`
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