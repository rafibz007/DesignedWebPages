const boom = "💥";
const ballon = "🎈";
const minSize = 30; //px
const maxSize = 300; //px
const startSize = 100; //px

// HANDLES
let ballonContainer = document.querySelector('.container')
let resetButton = document.querySelector('header button');
resetButton.addEventListener('click', start);


// PREVENT PAGE FROM SCROLLING USING ARROWS
window.addEventListener('keydown', (event)=>{
    if (["ArrowUp", "ArrowDown"].includes(event.key))
        event.preventDefault();
})

// START GAME
start();

// FUNCTION THAT STARTS AND SET UP EVERYTHING
function start(event){
    // SET UP BALLON
    ballonContainer.innerHTML = ballon;
    ballonContainer.style.fontSize = startSize + "px";

    // ADDING ARROWS EVENTS TO ALLOW GROWING AND SHRINKING OF BALLON
    window.addEventListener('keydown', growBallon)
    window.addEventListener('keydown', shrinkBallon)

    // ADDING EVENT TO SHOW MENU WHEN rIGHT CLICK + CTRL ON BALLON
    ballonContainer.addEventListener('contextmenu', showDetails);
}

// INCREASE SIZE OF BALLON BY 10%
function growBallon(event){
    if (event.key != "ArrowUp")
        return;

    let currentSize = parseInt(ballonContainer.style.fontSize);
    let newSize = Math.min(maxSize, currentSize*1.1);

    ballonContainer.style.fontSize = newSize + "px";
    if (newSize >= maxSize)
        explodeBallon();

}

// DECREASE SIZE OF BALLON BY 10%
function shrinkBallon(event){
    if (event.key != "ArrowDown")
        return;

    let currentSize = parseInt(ballonContainer.style.fontSize);
    let newSize = Math.max(minSize, currentSize*0.9);

    ballonContainer.style.fontSize = newSize + "px";

}

// REPLACES BALLON WITH EXPLOSION EMOJI AND REMOVING POSSIBILITY TO SHINK AND GROW IT
function explodeBallon(){
    window.removeEventListener('keydown', growBallon);
    window.removeEventListener('keydown', shrinkBallon);
    ballonContainer.innerHTML = boom;
    ballonContainer.removeEventListener('contextmenu', showDetails);
}

// DISPLAYING MENU ON RIGHT CLICK + CTRL ON BALLON
function showDetails(event){
    // CHECK IF PROPER KEYS PRESSED
    if (event.button != 2 || !event.ctrlKey)
        return;
    
    
    // CREATING MENU ELEMENT
    let contextMenu = document.createElement('div');
    contextMenu.classList.add('context-menu');
    contextMenu.style.top = event.clientY + "px";
    contextMenu.style.left = event.clientX + "px";
    contextMenu.innerText = "Size: " + Math.floor(((parseInt(ballonContainer.style.fontSize)-minSize) / (maxSize-minSize))*100) + "%";

    document.querySelector("body").appendChild(contextMenu);

    // ADDING EVENTS THAT WILL COUSE NEXT CLICK ANYWHERE TO CLOSE OUR CONTEXT MENU
    window.addEventListener('click', closeContextMenu, true);
    window.addEventListener('keydown', closeContextMenu, true);
    window.addEventListener('contextmenu', closeContextMenu, true);
    ballonContainer.removeEventListener('contextmenu', showDetails);
    
    
    event.preventDefault();
}


// CLOSE CONTEXT MENU OF BALLON SIZE
function closeContextMenu(event){
    let menu = document.querySelector('.context-menu');
    if (menu != null) menu.remove();
    
    
    // RESTORING PREVIOUS LISTENERS TO ANABLE SHOWING MENU AGAIN
    ballonContainer.addEventListener('contextmenu', showDetails);
    window.removeEventListener('click', closeContextMenu, true);
    window.removeEventListener('keydown', closeContextMenu, true);
    window.removeEventListener('contextmenu', closeContextMenu, true);

    
    event.preventDefault();
    event.stopPropagation();
}

// CLOSE CONTEXT MENU ON RESIZE
window.onresize = ()=>{
    closeContextMenu();
}