    // global settings
    var headerSpace = 200; // for menu bar
    var sideSpace = 250; // for space left and right
    var spaceLeft = 40; // for y axis description
    var spaceRight = 30; // for overlapping x axis
    var spaceBottom = 30; // for x axis description
    var spaceTop = 20; // for overlapping y axis
    var canvasBgColor = "#EFEFEF";
    //var canvasRadarBgColor = "#FFFFE6";
    var bubbleLineColor = "white";
    var bubbleShadowColor = "lightgrey";
    var bubbleShadowBlur = 5;
    var axisColor = "black";
    var helpLineColor = "thistle";
    var transitionColor = "gray";
    // calculated vars
    var canvasWidth = -1;
    var canvasHeight = -1;
    var widthColumn = -1;
    var heightColumn = -1;
    var radiusBubbles = -1;
    var bubblePositionsX = new Array(12);
    var bubblePositionsY = new Array(9);
    var bubbleLineWidth = -1;
    var allColors = initializeColors(50);
    // toggle to draw text near bubble
    var drawText = false;
    // global setting to activate debug logging
    var debug = false;
    
    function RadarBubble(name, stage, relevance, xtend, ytend, desc, tecRadarId, categoryId, color) {
       this.id = -1;
       this.name = name;
       this.stage = 1 * stage;
       this.relevance = 1 * relevance;
       this.xtend = 1 * xtend;
       this.ytend = 1 * ytend;
       this.desc = desc;
       this.idxX = (1 * stage) + (1 * xtend);
       this.idxY = (1 * relevance) + (1 * ytend);
       this.tecradarid = tecRadarId;
       this.categoryid = categoryId;
       this.relativeAddCount = 0;
       this.color = color;
    } 
    
    function Transition(xA, yA, xB, yB) {
       this.xA = xA;
       this.yA = yA;
       this.xB = xB;
       this.yB = yB;
    }     
    
    function drawCoordinateSystem(canvasRadarBgColor) {
        var canvas = document.getElementById("radar");
        var ctx = canvas.getContext("2d");  
        // draw background
        ctx.fillStyle = canvasBgColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // draw fields background
        ctx.fillStyle = canvasRadarBgColor;
        ctx.fillRect(spaceLeft, spaceTop, 4 * widthColumn, 3 * heightColumn); 
        // draw keep and adopt bg darker
        var canvasRadarBgColorDarker = calcColorLuminance(canvasRadarBgColor, -0.05);
        ctx.fillStyle = canvasRadarBgColorDarker;
        ctx.fillRect(spaceLeft + widthColumn, spaceTop, 2 * widthColumn, 3 * heightColumn); 
        // draw horizontal lines
        ctx.beginPath();
        ctx.moveTo(spaceLeft, 0 * heightColumn + spaceTop);
        ctx.lineTo(4 * widthColumn + spaceLeft, 0 * heightColumn + spaceTop);
        ctx.moveTo(spaceLeft, 1 * heightColumn + spaceTop);
        ctx.lineTo(4 * widthColumn + spaceLeft, 1 * heightColumn + spaceTop);
        ctx.moveTo(spaceLeft, 2 * heightColumn + spaceTop);
        ctx.lineTo(4 * widthColumn + spaceLeft, 2 * heightColumn + spaceTop);
        ctx.lineWidth = 1;
        ctx.strokeStyle = helpLineColor;
        ctx.stroke();
        // draw vertical lines
        ctx.beginPath();
        ctx.moveTo(spaceLeft + 1 * widthColumn, spaceTop);
        ctx.lineTo(spaceLeft + 1 * widthColumn, 3 * heightColumn + spaceTop);
        ctx.moveTo(spaceLeft + 2 * widthColumn, spaceTop);
        ctx.lineTo(spaceLeft + 2 * widthColumn, 3 * heightColumn + spaceTop);
        ctx.moveTo(spaceLeft + 3 * widthColumn, spaceTop);
        ctx.lineTo(spaceLeft + 3 * widthColumn, 3 * heightColumn + spaceTop);
        ctx.moveTo(spaceLeft + 4 * widthColumn, spaceTop);
        ctx.lineTo(spaceLeft + 4 * widthColumn, 3 * heightColumn + spaceTop);
        ctx.lineWidth = 1;
        ctx.strokeStyle = helpLineColor;
        ctx.stroke();
        // draw x,y axis upon
        ctx.beginPath();
        ctx.moveTo(spaceLeft, spaceTop / 2);
        ctx.lineTo(spaceLeft, 3 * heightColumn + spaceTop);
        ctx.lineTo(4 * widthColumn + spaceLeft+ spaceTop / 2, 3 * heightColumn + spaceTop);
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = axisColor;
        ctx.stroke();
        // add axis description
        var txtOffset = -10; // TODO: workaround to center text in column
        ctx.beginPath();
        ctx.font = "bold 11px sans-serif";
        ctx.lineWidth = 0.8;
        ctx.fillStyle = "black";
        ctx.fillText("high", 5, spaceTop + heightColumn / 2);
        ctx.fillText("med.", 5, spaceTop + 1 * heightColumn + heightColumn / 2);
        ctx.fillText("low", 5, spaceTop + 2 * heightColumn + heightColumn / 2);
        ctx.fillText("hold", spaceLeft + widthColumn / 2 + txtOffset, 3 * heightColumn + spaceTop + spaceBottom / 2);
        ctx.fillText("keep", spaceLeft + 1 * widthColumn + widthColumn / 2 + txtOffset, 3 * heightColumn + spaceTop + spaceBottom / 2);
        ctx.fillText("adopt", spaceLeft + 2 * widthColumn + widthColumn / 2 + txtOffset, 3 * heightColumn + spaceTop + spaceBottom / 2);
        ctx.fillText("trial", spaceLeft + 3 * widthColumn + widthColumn / 2 + txtOffset, 3 * heightColumn + spaceTop + spaceBottom / 2);
        //ctx.font = "bold 11px sans-serif";
        ctx.fillStyle = "dimgray";
        ctx.fillText("Relevance", spaceLeft + 5, spaceTop + 15); // TODO: make generic
        ctx.fillText("Stage (Lifecycle)", spaceLeft + 4 * widthColumn - 17 * 5.5, 3 * heightColumn + spaceTop - 10);
        if (debug) { console.log("drawed coordinate system."); }
    }
    
    function calculateCanvasSizes() {
        var winWidth = window.innerWidth;
        canvasWidth = winWidth - sideSpace; // space left and right beneath the radar
        canvasHeight = Math.floor(canvasWidth / 4 * 3);  // maybe add space top and bottomfor better relation of sizes
        if (window.innerHeight < canvasHeight) {
           canvasHeight = window.innerHeight - headerSpace; // offset for header
           canvasWidth = Math.floor(canvasHeight / 3 * 4);
        }
        widthColumn = Math.floor( (canvasWidth - spaceLeft - spaceRight) / 4 ); // maybe account line width
        heightColumn = Math.floor( (canvasHeight - spaceTop - spaceBottom) / 3 ); // maybe account line width
        radiusBubbles = Math.floor(heightColumn / 16);
        bubbleLineWidth = Math.floor(radiusBubbles / 3.5);
        if (debug) { console.log("calculated canvasWidth: " + canvasWidth + "; canvasHeight: " + canvasHeight + "; widthColumn: " + widthColumn + "; heightColumn: " + heightColumn + "; radiusBubbles: " + radiusBubbles + "; bubbleLineWidth: " + bubbleLineWidth); }
        
        var widthColSegment = Math.floor(widthColumn / 4); 
        bubblePositionsX[0] = spaceLeft + 1 * widthColSegment;
        bubblePositionsX[1] = spaceLeft + 2 * widthColSegment;
        bubblePositionsX[2] = spaceLeft + 3 * widthColSegment;
        bubblePositionsX[3] = spaceLeft + 1 * widthColumn + 1 * widthColSegment;
        bubblePositionsX[4] = spaceLeft + 1 * widthColumn + 2 * widthColSegment;
        bubblePositionsX[5] = spaceLeft + 1 * widthColumn + 3 * widthColSegment;
        bubblePositionsX[6] = spaceLeft + 2 * widthColumn + 1 * widthColSegment;
        bubblePositionsX[7] = spaceLeft + 2 * widthColumn + 2 * widthColSegment;
        bubblePositionsX[8] = spaceLeft + 2 * widthColumn + 3 * widthColSegment;
        bubblePositionsX[9] = spaceLeft + 3 * widthColumn + 1 * widthColSegment;
        bubblePositionsX[10] = spaceLeft + 3 * widthColumn + 2 * widthColSegment;
        bubblePositionsX[11] = spaceLeft + 3 * widthColumn + 3 * widthColSegment;
        
        var heightColSegment = Math.floor(heightColumn / 4); 
        bubblePositionsY[0] = spaceTop + 2 * heightColumn + 3 * heightColSegment;
        bubblePositionsY[1] = spaceTop + 2 * heightColumn + 2 * heightColSegment;
        bubblePositionsY[2] = spaceTop + 2 * heightColumn + 1 * heightColSegment;
        bubblePositionsY[3] = spaceTop + 1 * heightColumn + 3 * heightColSegment;
        bubblePositionsY[4] = spaceTop + 1 * heightColumn + 2 * heightColSegment;
        bubblePositionsY[5] = spaceTop + 1 * heightColumn + 1 * heightColSegment;
        bubblePositionsY[6] = spaceTop + 3 * heightColSegment;
        bubblePositionsY[7] = spaceTop + 2 * heightColSegment;
        bubblePositionsY[8] = spaceTop + 1 * heightColSegment;
        if (debug) { console.log("bubblePositionsX: " + bubblePositionsX); }  
        if (debug) { console.log("bubblePositionsY: " + bubblePositionsY); }  
    }
    
    function getBubbleColor(idx) {
        return allColors[idx];
    }

    function initializeColors(maxColors) {
		var allCalculatedColors = new Array();
		for ( var i = 0; i < maxColors; i++) {
			var curColor = calcColor(i);
			var trials = 1;
			var newIdx = i + 1;
			while ((colorAlreadyExists(allCalculatedColors, curColor) || curColor == "#ffffff" || curColor == "#000000") && trials < 10) {
				curColor = calcColor(newIdx);
				if (debug) { console.log("color unusable - replaced by color: " + curColor + " using index: " + newIdx + " instead of idx: " + i); }
				newIdx++; trials++;
			}
			allCalculatedColors[i] = curColor;
		}
		//printArray(allCalculatedColors);
		return allCalculatedColors;
	}
    
    function colorAlreadyExists(colorArray, curColor) {
        var found = false;
        for(var i = 0; i < colorArray.length; i++) {
           if (colorArray[i] == curColor) {
             found = true;
             break;
           }
        }
        return found;
     }
    
    function printArray(arrayToPrint) {
    	var allElements = "";
        for(var i = 1; i < arrayToPrint.length; i++) {
        	allElements += "; " + arrayToPrint[i];
        }
        console.log(allElements);
     }
        
    function calcColor(idx) {
      var r, g, b = 0;
      var rcalc, gcalc, bcalc = 0;
      
      var one = idx % 4;
      var two = Math.floor(idx/4) % 4;
      var three = Math.floor(idx/8 % 4);
      
      // switch a bit
      var mod3 = idx % 3;
      if (mod3 == 0) {
        rcalc = one * 85;
        gcalc = two * 85;
        bcalc = three * 85;
      }
      if (mod3 == 2) {
        rcalc = three * 85;
        gcalc = two * 85;
        bcalc = one * 85;
      }
      if (mod3 == 1) {
        rcalc = two * 85;
        gcalc = three * 85;
        bcalc = one * 85;
      }

      if (debug) { console.log("rgb idxs[" + Math.floor(rcalc / 85) + "," + Math.floor(gcalc / 85) + "," + Math.floor(bcalc / 85) + "]"); }
      if (debug) { console.log("rgb[" + rcalc + "," + gcalc + "," + bcalc + "]"); }
      if (bcalc > 255) { bcalc = 255; }
      if (gcalc > 255) { gcalc = 255; }
      if (rcalc > 255) { rcalc = 255; }

      b = bcalc.toString(16);
      if (b.length == 1) { b = "0" + b; }
      g = gcalc.toString(16);
      if (g.length == 1) { g = "0" + g; }
      r = rcalc.toString(16);
      if (r.length == 1) { r = "0" + r; }
      
      var colorStr = "#" + r + "" + g + "" + b;
      return colorStr;
    }    
    
    function calcColorLuminance(hex, lum) {

    	// validate hex string
    	hex = String(hex).replace(/[^0-9a-f]/gi, '');
    	if (hex.length < 6) {
    		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    	}
    	lum = lum || 0;

    	// convert to decimal and change luminosity
    	var rgb = "#", c, i;
    	for (i = 0; i < 3; i++) {
    		c = parseInt(hex.substr(i*2,2), 16);
    		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    		rgb += ("00"+c).substr(c.length);
    	}
    	if (debug) { console.log("old color: " + hex + "; new color: " + rgb); }
    	return rgb;
    }
    
    function drawARadarBubble(radarBubble, xCoord, yCoord, idx) {  
       // TODO: desc as overlay: http://www.html5canvastutorials.com/kineticjs/html5-canvas-path-mouseover/
       var canvas = document.getElementById("radar");
       var ctx = canvas.getContext("2d"); 
       ctx.beginPath();
       var yCoordCalculated = yCoord - (radarBubble.relativeAddCount * radiusBubbles);
       if (debug) { console.log("draw bubble["+radarBubble.name+"] at position: x:" + xCoord + ", y:" + yCoordCalculated); }
       ctx.arc(xCoord, yCoordCalculated, radiusBubbles, 0, 2 * Math.PI);
       ctx.lineWidth = bubbleLineWidth;
       ctx.strokeStyle = bubbleLineColor;
       ctx.shadowBlur = bubbleShadowBlur;
       ctx.shadowColor = bubbleShadowColor;
       ctx.stroke();
       //console.log("draw a radar bubble["+radarBubble.name+"] with color: " + radarBubble.color); 
       ctx.fillStyle = radarBubble.color;
       ctx.fill();
       ctx.shadowBlur = 0;
    } 
    
    function drawABubbleText(radarBubble, xCoord, yCoord) {
       if (drawText) {
         var canvas = document.getElementById("radar");
         var ctx = canvas.getContext("2d"); 
         ctx.beginPath();
         ctx.font = "bold 11px sans-serif";
         ctx.lineWidth = 0.8;
         
         var yCoordText = yCoord + 3 - (radarBubble.relativeAddCount * radiusBubbles);
//         var gradient=ctx.createLinearGradient(xCoord, yCoordText, xCoord + (radarBubble.name.length * 5), yCoordText);
//         gradient.addColorStop("0","lightgray");
//         gradient.addColorStop("1.0","black");
         ctx.fillStyle = "black";
         ctx.fillText(radarBubble.name, xCoord, yCoordText); // TODO: calculate middle of text
         ctx.strokeStyle = "white";
         ctx.strokeText(radarBubble.name, xCoord, yCoordText);
         ctx.shadowBlur = 0;
       }
    } 
    
    function drawATransition(transition) {
       var canvas = document.getElementById("radar");
       var ctx = canvas.getContext("2d"); 
       if (debug) { console.log("draw transition from point[x="+transition.xA+",y="+transition.yA+"] to point:[x="+transition.xB+",y="+transition.yB+"]"); }
       ctx.beginPath();
       ctx.moveTo(transition.xA, transition.yA);
       ctx.lineTo(transition.xB, transition.yB);
       ctx.lineWidth = 2;
       ctx.strokeStyle = transitionColor;
       ctx.stroke();
    }  
      