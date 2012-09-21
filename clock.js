/*
 * Simple HTML5 Canvas Analog Clock
 * By Matt Willis (http://www.mrwillis.net)
 *
 * The author disclaims copyright to this source code.  In place of             
 * a legal notice, here is a blessing:                                          
 *                                                                              
 *    May you do good and not evil.                                             
 *    May you find forgiveness for yourself and forgive others.                 
 *    May you share freely, never taking more than you give.
 *
 */
(function() {

	// TODO: Make the colors configurable.
	// TODO: Make the text configurable (but it should only allow up to 10 characters or so).

	this.AnalogClock = function(width, height) {
		var initialized = false;
		var running = false;
		
		var canvas, ctx;
		
		function _init() {
			var newCanvas = document.createElement('canvas');
			
			// If we don't get a proper drawing context, the browser doesn't support the canvas, so don't bother.
			if(!!(newCanvas.getContext && newCanvas.getContext("2d"))) {
				canvas = newCanvas;
				ctx = canvas.getContext("2d");
				canvas.width = width || 200; // Default to 200 width
				canvas.height = height || canvas.width; // If a height is not specified, make it square.
				document.body.appendChild(canvas);
				initialized = true;
			}
		}
		
		_init();
		
		function _draw() {
			canvas.width = canvas.width; // Reset the canvas.
			var centerX = canvas.width / 2;
			var centerY = canvas.height / 2;
			var circleWidth = 5;
			var clockRadius = Math.min(centerX, centerY) - circleWidth;
			var fullCircle = Math.PI * 2;
			var quarterCircle = Math.PI / 2;

			var now = new Date();
			var nowSeconds = now.getSeconds() / 3600;
			var nowMinutes = (now.getMinutes() / 60) + nowSeconds;
			var nowHours = now.getHours() + nowMinutes;

			// Draw clock circle
			ctx.beginPath();
			ctx.arc(centerX, centerY, clockRadius, 0, fullCircle, true);
			
			// Fill in the white background.
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();
			
			 // Draw the black border.
			ctx.lineWidth = circleWidth;
			ctx.strokeStyle = "#000000";
			ctx.stroke();
			ctx.closePath();

			// Draw the numbers
			var fontSize = clockRadius * 0.2; // Base the font size on the size of the clock itself.
			ctx.font = "bold " + fontSize + "px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#000000";
			for(var i = 1; i <= 12; i++) {
				var distance = clockRadius * 0.8;
				var angle = (fullCircle * (i / 12)) - quarterCircle;
				var x = centerX + Math.cos(angle) * distance;
				var y = centerY + Math.sin(angle) * distance;
				ctx.fillText(i, x, y);
			}
			
			// Draw the clock text
			ctx.font = "normal " + (fontSize * 0.8) + "px sans-serif";
			ctx.fillText("Willis", centerX, centerY + (clockRadius * 0.4));

			// Draw the hour hand
			_drawClockHand(centerX, centerY, 5, clockRadius * 0.6, (fullCircle * (nowHours / 12)) - quarterCircle);

			// Draw the minute hand
			_drawClockHand(centerX, centerY, 3, clockRadius * 0.8, (fullCircle * nowMinutes) - quarterCircle);

			// Draw the second hand
			_drawClockHand(centerX, centerY, 1, clockRadius * 0.8, (fullCircle * nowSeconds * 60) - quarterCircle, "#FF0000"); // Draw the second hand in red. :)

			// Draw center dot on top.
			ctx.beginPath();
			ctx.arc(centerX, centerY, clockRadius * 0.05, 0, fullCircle, true);
			ctx.fill();
			ctx.closePath();
		}
		
		function _drawClockHand(centerX, centerY, handWidth, handLength, angle, handColor) {
			var handX = centerX + Math.cos(angle) * handLength;
			var handY = centerY + Math.sin(angle) * handLength;
			_drawLine(centerX, centerY, handX, handY, handWidth, handColor);
		}

		function _drawLine(startX, startY, endX, endY, lineWidth, lineStyle) {
			// Save old lineWidth and strokeStyle
			var oldLW = ctx.lineWidth;
			var oldSS = ctx.strokeStyle;
			
			// Draw the line
			ctx.beginPath();
			ctx.lineWidth = lineWidth || ctx.lineWidth;
			ctx.strokeStyle = lineStyle || ctx.strokeStyle;
			ctx.moveTo(startX, startY);
			ctx.lineTo(endX, endY);
			ctx.stroke();
			ctx.closePath();
			
			// Reset lineWidth and strokeStyle
			ctx.lineWidth = oldLW;
			ctx.strokeStyle = oldSS;
		}

		function _animate() {
			_draw();
			if(running) {
				window.setTimeout(_animate, 1000); // Tick every second.
			}
		}
		
		// Start the clock running.
		this.start = function() {
			if(initialized) {
				running = true;
				_animate();
			}
			return this;
		}
		
		// Not entirely sure why you'd want to stop the clock, but it's nice to have the ability.
		this.stop = function() {
			running = false;
			return this;
		}
		
		return this;
	}
	
})();
