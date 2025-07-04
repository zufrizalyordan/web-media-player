"use strict"

import { loadTitle } from "./RadioPlayerActions.js"
import { getState } from "./DataSource.js"

export const playlistClicks = () => {
    const items = document.querySelectorAll(".playlist-item")
    const state = getState()

    items.forEach((el) => {
        el.onclick = function (){
            const searchId = this.getAttribute("data-id");

            const data = state.playlist.find(item => item.id === parseInt(searchId))

            loadTitle(data)
        }.bind(el)
    })
}