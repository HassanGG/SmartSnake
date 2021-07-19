function clearScreen() {
    for(let i = 0; i < dimension * dimension; i++) {
        let box = document.getElementsByClassName('box')[i];
        box.style.backgroundColor = "white";
    }
}

// makes sure the page is loaded before running the javascript
window.onload = () => {
    clearScreen();
    console.log("yo");
}

