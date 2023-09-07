"use strict"
import { baseUrl } from "./Utils.js"
import { playlistClicks } from "./PlaylistActions.js"

export default class Playlist {
    constructor() {
    }

    registerEvents = () => {
        playlistClicks()
    }

    buildList = (data) => {
        const list = data.map(item => {
            const image = (item.image.logo) ? `<div class="playlist-logo" style="background-image: url(${baseUrl}${item.image.logo})"></div>` : ""
            return `<li data-id="${item.id}"><div class="playlist-item">${image}<span>${item.title}</span></div></li>`
        })

        const playlistContainer = document.querySelector(".playlist-items")
        list.forEach(item => {
            playlistContainer.innerHTML += item
        })
    }

    init = async (data) => {
        await this.buildList(data)
        await this.registerEvents()
    }
}
