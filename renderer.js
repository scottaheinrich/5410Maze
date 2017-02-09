'use strict';


let Graphics = (function () {
    let context = null;

    function initialize() {
        let canvas = document.getElementById('canvas-main');
        context = canvas.getContext('2d');

        CanvasRenderingContext2D.prototype.clear = function() {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);
            this.restore();
        };
    }



    function Texture(spec) {
        var that = {},
            ready = false,
            image = new Image();

        image.onload = () => {
            ready = true;
        };
        image.src = spec.imageSource;

        that.update = function() {

        }

        that.moveLeft = function(elapsedTime) {
            if (spec.center.x > 25) {
              spec.center.x -= 50;//(spec.speed * (elapsedTime / 1000));
            }
        };

        that.moveRight = function(elapsedTime) {
            if (spec.center.x < 475) {
              spec.center.x += 50;
            }
        };

        that.moveUp = function(elapsedTime) {
            if (spec.center.y > 25) {
              spec.center.y -= 50;
            }
        };

        that.moveDown = function(elapsedTime) {
            if (spec.center.y < 475) {
              spec.center.y += 50;
            }
        };


        that.draw = function() {
            if (ready) {
                context.save();

                context.translate(spec.center.x, spec.center.y);
                context.translate(-spec.center.x, -spec.center.y);

                context.drawImage(
                    image,
                    spec.center.x - spec.width / 2,
                    spec.center.y - spec.height / 2,
                    spec.width, spec.height);

                context.restore();
            }
        }

        return that;
    }

    function beginRender() {
        context.clear();
    }

    return {
        beginRender: beginRender,
        initialize: initialize,
        Texture: Texture
    };
}());

let MyGame = (function() {
    let that = {};
    let previousTime = performance.now();
    let elapsedTime = 0;
    let inputDispatch = {};

    let myTexture = Graphics.Texture({
        imageSource: 'USU-Logo.png',
        center: { x: 25, y: 25 },
        width: 50,
        height: 50,
        speed: 300, // pixels per second
    });

    function update() {
        myTexture.update();
    }

    function render() {
        Graphics.beginRender();
        myTexture.draw();
    }

    function gameLoop(time) {
        elapsedTime = time - previousTime;
        previousTime = time;

        update();
        render();

        requestAnimationFrame(gameLoop);
    }

    function keyDown(e) {
        if (inputDispatch.hasOwnProperty(e.key)) {
            inputDispatch[e.key](elapsedTime);
        }
    }

    that.initialize = function() {
        Graphics.initialize();

        window.addEventListener('keydown', keyDown);

        inputDispatch['a'] = myTexture.moveLeft;
        inputDispatch['d'] = myTexture.moveRight;
        inputDispatch['w'] = myTexture.moveUp;
        inputDispatch['s'] = myTexture.moveDown;

        gameLoop();
    }

    return that;
}());
