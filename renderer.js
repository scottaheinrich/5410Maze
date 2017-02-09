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

    function Rectangle(spec) {
        let that = {};

        that.update = function() {
            spec.rotation += 0.01;
        };

        that.draw = function() {
            context.save();

            context.translate(spec.corner.x + spec.size.w / 2, spec.corner.y + spec.size.h / 2);
            context.rotate(spec.rotation);
            context.translate(-(spec.corner.x + spec.size.w / 2), -(spec.corner.y + spec.size.h / 2));

            context.fillStyle = spec.fillStyle;
            context.fillRect(spec.corner.x, spec.corner.y, spec.size.w, spec.size.h);

            context.strokeStyle = spec.strokeStyle;
            context.strokeRect(spec.corner.x, spec.corner.y, spec.size.w, spec.size.h);

            context.restore();
        }

        return that;
    }

    function Triangle(spec) {
		var that = {};

		that.update = function() {
			spec.rotation += 0.015;
		};

		that.draw = function() {
			context.save();

			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);

			context.beginPath();
			context.moveTo(spec.pt1.x, spec.pt1.y);
			context.lineTo(spec.pt2.x, spec.pt2.y);
			context.lineTo(spec.pt3.x, spec.pt3.y);
			context.closePath();

			context.fillStyle = spec.fillStyle;
			context.fill();

			context.strokeStyle = spec.strokeStyle;
			context.lineWidth = spec.lineWidth;
			context.stroke();

			context.restore();
		};

        return that;
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
            //spec.rotation += 0.01;
        }

        that.moveLeft = function(elapsedTime) {
            spec.center.x -= (spec.speed * (elapsedTime / 1000));
        };

        that.moveRight = function(elapsedTime) {
            spec.center.x += (spec.speed * (elapsedTime / 1000));
        };

        that.rotateLeft = function(elapsedTime) {
            spec.rotation -= (spec.rotateRate * (elapsedTime / 1000));
        };

        that.rotateRight = function(elapsedTime) {
            spec.rotation += (spec.rotateRate * (elapsedTime / 1000));
        };

        that.draw = function() {
            if (ready) {
                context.save();

                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
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
        Rectangle: Rectangle,
        Triangle: Triangle,
        Texture: Texture
    };
}());

let MyGame = (function() {
    let that = {};
    let previousTime = performance.now();
    let elapsedTime = 0;
    let inputDispatch = {};

    let mySquare = Graphics.Rectangle({
        corner: { x: 100, y: 100 },
        size: { w: 100, h: 100 },
        rotation: 0,
        fillStyle: 'rgba(255, 0, 0, 0.5)',
        strokeStyle: 'rgba(0, 0, 255, 1)'
    });

    let mySquare2 = Graphics.Rectangle({
        corner: { x: 150, y: 150 },
        size: { w: 100, h: 100 },
        rotation: 0,
        fillStyle: 'rgba(255, 0, 0, 0.5)',
        strokeStyle: 'rgba(0, 0, 255, 1)'
    });

    let myTriangle = Graphics.Triangle({
        center: { x: 250, y: 200 },
        rotation: 0,
        lineWidth: 1,
        pt1: { x: 200, y: 150 },
        pt2: { x: 300, y: 150 },
        pt3: { x: 250, y: 250 },
        fillStyle: 'rgba(0, 0, 255, 0.5)',
        strokeStyle: 'rgba(255, 0, 0, 1)'
    });

    let myTexture = Graphics.Texture({
        imageSource: 'USU-Logo.png',
        center: { x: 250, y: 250 },
        width: 100,
        height: 100,
        rotation: 0,
        speed: 300, // pixels per second
        rotateRate: 3.14159 // radians per second
    });

    function update() {
        // mySquare.update();
        // mySquare2.update();
        // myTriangle.update();
        myTexture.update();
    }

    function render() {
        Graphics.beginRender();
        // mySquare.draw();
        // mySquare2.draw();
        // myTriangle.draw();
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
        inputDispatch['q'] = myTexture.rotateLeft;
        inputDispatch['e'] = myTexture.rotateRight;

        gameLoop();
    }

    return that;
}());
