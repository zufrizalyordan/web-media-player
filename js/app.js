"use strict"

import { setState, fetchUrl } from './DataSource.js'
import { baseUrl } from './Utils.js'
import { initPlaylist } from './Playlist.js?v=1'
import { initPlayer } from './Player.js'

const data = await fetchUrl(baseUrl+"/data/playlist.json")

const initApp = async () => {
    if (data) {
        const audio = new Audio()
        await setState({
            playlist: data,
            player: audio
        })

        await initPlaylist(data)

        await initPlayer()
    } else {
        alert("No data to build playlist")
    }
}

await initApp()