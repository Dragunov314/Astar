
// Create Canvas
var mycanvas = document.createElement("canvas");
mycanvas.setAttribute("width", "200");
mycanvas.setAttribute("height","200" );
mycanvas.setAttribute("style","border:1px solid #000000;");
mycanvas.appendChild(document.createTextNode("Your browser does not support the canvas element."));
document.body.appendChild(mycanvas);

// Add event listener for `click` events.
elem.addEventListener('click', function(event) {
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;

    // Collision detection between clicked offset and element.
    elements.forEach(function(element) {
        if (y > element.top && y < element.top + element.height 
            && x > element.left && x < element.left + element.width) {
            alert('clicked an element');
        }
    });

}, false);