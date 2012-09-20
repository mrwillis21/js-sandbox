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
	// TODO: Make this instanceable.
	// TODO: Make the text configurable (but it should only allow up to 10 characters or so).

	this.Clock = {};

	var running = false;
	var canvas, ctx;

	function draw() {
		canvas.width = canvas.width;
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
		var handWidth = 5;
		var handLength = clockRadius * 0.6;
		var angle = (fullCircle * (nowHours / 12)) - quarterCircle;
		var handX = centerX + Math.cos(angle) * handLength;
		var handY = centerY + Math.sin(angle) * handLength;
		drawLine(centerX, centerY, handX, handY, handWidth);

		// Draw the minute hand
		handWidth = 3;
		handLength = clockRadius * 0.8;
		angle = (fullCircle * nowMinutes) - quarterCircle;
		handX = centerX + Math.cos(angle) * handLength;
		handY = centerY + Math.sin(angle) * handLength;
		drawLine(centerX, centerY, handX, handY, handWidth);

		// Draw the second hand
		handWidth = 1;
		handLength = clockRadius * 0.8;
		angle = (fullCircle * nowSeconds * 60) - quarterCircle;
		handX = centerX + Math.cos(angle) * handLength;
		handY = centerY + Math.sin(angle) * handLength;
		drawLine(centerX, centerY, handX, handY, handWidth, "#FF0000"); // Draw the second hand in red. :)

		// Draw center dot on top.
		ctx.beginPath();
		ctx.arc(centerX, centerY, clockRadius * 0.05, 0, fullCircle, true);
		ctx.fill();
		ctx.closePath();
	}

	function drawLine(startX, startY, endX, endY, lineWidth, lineStyle) {
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

	function animate() {
		draw();
		if(running) {
			window.setTimeout(animate, 250); // We'll never be more than (close to) a quarter-second off the system clock.
		}
	}

	Clock.start = function() {
		canvas = document.getElementById("clock");
		ctx = canvas.getContext("2d");
		if(ctx) { // If we get a proper canvas context, we know this browser is supported and can run the clock.
			running = true;
			animate();
		}
	};

})();
