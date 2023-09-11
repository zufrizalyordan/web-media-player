"use strict"

export const typeSelectorEvents = () => {

    const selectors = document.querySelectorAll(".type-selector a")
    selectors.forEach(el => {
        el.addEventListener("click", () => {
            switch (el.getAttribute("data-type")) {
                case "radio":
                    console.log("filter by radio type")
                    break;
                case "music":
                    console.log("filter by music type")
                    break;

                default:
                    console.log("show all")
                    break;
            }
        })
    })
}