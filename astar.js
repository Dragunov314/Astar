
// Create Canvas
var mycanvas = document.createElement("canvas");
mycanvas.setAttribute("width", "200");
mycanvas.setAttribute("height","200" );
mycanvas.setAttribute("style","border:1px solid #000000;");
mycanvas.appendChild(document.createTextNode("Your browser does not support the canvas element."));

var cvLeft = mycanvas.offsetLeft,
    cvTop = mycanvas.offsetTop,
    context = mycanvas.getContext('2d'),
    blocks = [];

// Add event listener for `click` events.
mycanvas.addEventListener('click', function(event) {
    var x = event.pageX - cvLeft,
        y = event.pageY - cvTop;


}, false);

blocks.push({
    width: 20,
    height: 20,
    top: 20,
    left: 20
});

// Render blocks
blocks.forEach(function(element) {
    context.fillStyle = element.colour;
    context.rect(element.left, element.top, element.width, element.height);
});​

document.body.appendChild(mycanvas);