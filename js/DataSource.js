"use strict"

let state = {
    playlist: {},
    selectedItem: {},
}

export const setState = (data) => {
    const mergedObject = {
        ...state,
        ...data,
    }

    state = mergedObject
}

export const getState = () => {
    return state
}

export const fetchUrl = async (url) => {
    const response = await fetch(url)
    return await response.json()
}