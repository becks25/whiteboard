app.factory('Whiteboard', function (Session) {

window.whiteboard = new window.EventEmitter();

(function () {

    // AuthService.getLoggedInUser().then(function (user) {
    //     var user = user;
    // console.log(user);

    // });

   // if(!Session) return;
    var person;
    if(Session.user) person = Session.user.name;
    else person = null;

    //var person = prompt("Please enter your name", "") || 'Mystery person';
    //whiteboard.emit('name', {name: person});
    
            
    // Ultimately, the color of our stroke;
    var color;



    // The color selection elements on the DOM.
    //var colorElements = [].slice.call(document.querySelectorAll('.marker'));

    //colorElements.forEach(function (el) {

        // Set the background color of this element
        // to its id (purple, red, blue, etc).
        //el.style.backgroundColor = el.id;

        // Attach a click handler that will set our color variable to
        // the elements id, remove the selected class from all colors,
        // and then add the selected class to the clicked color.
    //     el.addEventListener('click', function () {
    //         // color = this.id;
    //         // console.log('here');
    //         document.querySelector('.selected').classList.remove('selected');
    //         this.classList.add('selected');
    //     });

    // });


    var canvas = document.querySelector('#paint');
    var sketch = document.querySelector('#sketch');
    var body = document.querySelector('body');

    var sketchStyle = getComputedStyle(sketch);

    canvas.width = parseInt(sketchStyle.getPropertyValue('width'));
    canvas.height = parseInt(sketchStyle.getPropertyValue('height'));

    var ctx = canvas.getContext('2d');

    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    var currentMousePosition = {
        x: 0,
        y: 0
    };

    var lastMousePosition = {
        x: 0,
        y: 0
    };

    var startMousePosition = {
        x: 0,
        y: 0
    };

    var drawing = false;
    var shape = 'line';

    body.addEventListener('mousedown', function (e) {
        drawing = true;
        shape = document.querySelector('.selectedShape').tagName.toLowerCase();

        currentMousePosition.x = e.pageX - this.offsetLeft;
        currentMousePosition.y = e.pageY -140 - this.offsetTop;
        startMousePosition.x = currentMousePosition.x;
        startMousePosition.y = currentMousePosition.y;
        if(shape !== 'line'){
            lastMousePosition.x = currentMousePosition.x;
            lastMousePosition.y = currentMousePosition.y;
        }
    });


    body.addEventListener('mouseup', function () {
        // debugger;
        drawing = false;
        if(startMousePosition.y < 0 && currentMousePosition.y < 0) return;

        if(shape !== 'line'){
            var size = {};

            size.x = lastMousePosition.x- startMousePosition.x;
            size.y = lastMousePosition.y - startMousePosition.y;
            if(size.x == 0){
                size.x = 50;
                startMousePosition.x = startMousePosition.x-25;
            }
            if(size.y == 0){
                size.y = 50;
                startMousePosition.y = startMousePosition.y-25;

            }
            if(shape == 'square'){
                whiteboard.drawShape(startMousePosition, size, 'square');
            }else if(shape == 'circle'){
                var start = {};
                start.x = startMousePosition.x + (size.x/2);
                start.y = startMousePosition.y + (size.y/2);

                var radius = Math.sqrt((size.x/2 * size.x/2) + (size.y/2 * size.y/2));
                whiteboard.drawShape(start, radius, 'circle');
            }
        }

    });

    body.addEventListener('mousemove', function (e) {



        if (!drawing) return;

        lastMousePosition.x = currentMousePosition.x;
        lastMousePosition.y = currentMousePosition.y;

        currentMousePosition.x = e.pageX - this.offsetLeft;
        currentMousePosition.y = e.pageY -140 - this.offsetTop;
        if(currentMousePosition.y < 0) return;

        var selected = document.querySelector('.selected');
        color = selected.id;
        if(shape == 'line'){
            whiteboard.draw(lastMousePosition, currentMousePosition, color, true, person, whiteboard.width);
       }
    });

    var follower = {};
    var name = window.location.pathname.slice(1);
    whiteboard.drawShape = function(start, size, shape){
        whiteboard.draw(start, size, color, true, person, whiteboard.width, shape);
    }

    whiteboard.draw = function (start, end, strokeColor, shouldBroadcast, username, width, shape) {
        if(!username) return;
        if (!follower[username]) {
            follower[username] = $('<p class="person" id="'+username+'">'+username+'</p>');
            $('#sketch').append(follower[username]);
        }
        if(shape !== 'line'){
            follower[username].offset({left: start.x, top: start.y+120});
        }else{
            follower[username].offset({left: end.x, top:end.y +120});
        }
        follower[username].css('color', strokeColor || 'black');


        canvas.focus();


       // console.log(end);

        // Draw the line between the start and end positions
        // that is colored with the given color.
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = strokeColor || 'black';

        if(shape == 'square'){
            ctx.rect(start.x, start.y, end.x, end.y);
        }else if(shape == 'circle'){
            ctx.arc(start.x, start.y, end, 0, 2 * Math.PI, false);

        }else{
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
        }
        ctx.closePath();
        ctx.stroke();

        // If shouldBroadcast is truthy, we will emit a draw event to listeners
        // with the start, end and color data.


        if (shouldBroadcast) {
            whiteboard.emit('draw', start, end, strokeColor, username, ctx.lineWidth);
            whiteboard.saveImage();
        }
        
    };

    whiteboard.width = 5;
    whiteboard.clear = function(shouldBroadcast){
        ctx.fillStyle = 'white';
        ctx.clearRect(0,0,canvas.width, canvas.height);

        Object.keys(follower).forEach(function(elem){
            follower[elem].remove();
        });

        follower = {};

        if(shouldBroadcast) whiteboard.emit('clear');
    };

    whiteboard.saveImage = function(){
        var dataURL = canvas.toDataURL();

        whiteboard.emit('imageSaved', dataURL);
    };

    whiteboard.drawBackground = function(dataURL){
        var imageObj = new Image();
        imageObj.onload = function() {
          ctx.drawImage(this, 0, 0);
        };

        imageObj.src = dataURL;
    };

})();

    return whiteboard;
});