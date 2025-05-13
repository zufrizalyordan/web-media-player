"use strict"

import { getState, setState } from './DataSource.js'

export const typeSelectorEvents = () => {
    const selectors = document.querySelectorAll(".type-selector button")
    const playlistItems = document.querySelectorAll('.playlist-items li')
    
    selectors.forEach(button => {
        button.addEventListener("click", () => {
            // Update button states
            selectors.forEach(btn => {
                btn.setAttribute('aria-pressed', 'false')
            })
            button.setAttribute('aria-pressed', 'true')
            
            const type = button.getAttribute("data-type")
            const state = getState()
            
            // Filter playlist items
            playlistItems.forEach(item => {
                if (type === 'all' || item.getAttribute('data-type') === type) {
                    item.style.display = ''
                } else {
                    item.style.display = 'none'
                }
            })
            
            // Update state
            setState({
                ...state,
                currentFilter: type
            })
        })
    })
}