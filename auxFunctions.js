document.onkeydown = checkKey; 

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38' && currDirection != 1) lastClick = 0; // up arrow
    else if (e.keyCode == '40' && currDirection != 0) lastClick = 1; // down arrow
    else if (e.keyCode == '37' && currDirection != 3) lastClick = 2; // left arrow
    else if (e.keyCode == '39' && currDirection != 2) lastClick = 3; // right arrow
    else if (e.keyCode == '32') lastClick = -1; //space key
}
