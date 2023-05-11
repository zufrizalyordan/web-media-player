"use strict"

import { setState, fetchUrl } from './DataSource.js'
import Playlist from './Playlist.js'
import Player from './Player.js'

const data = await fetchUrl("/data/playlist.json")
const playlist  = new Playlist()
const player  = new Player()

class App {
    constructor() {

    }

    init = async () => {
        if (data) {
            // set data
            await setState({playlist: data})

            // initiate playlist
            await playlist.init(data)

            // initiate player
            await player.init()
        } else {
            alert("No data to build playlist")
        }
    }
}

const app = new App()
app.init()