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
        // draw fields background
        ctx.fillStyle = canvasBgColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // draw fields background
        ctx.fillStyle = canvasRadarBgColor;
        ctx.fillRect(spaceLeft, spaceTop, 4 * widthColumn, 3 * heightColumn); 
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
        ctx.font = "11px Verdana";
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = "black";
        ctx.strokeText("high", 5, spaceTop + heightColumn / 2);
        ctx.strokeText("med.", 5, spaceTop + 1 * heightColumn + heightColumn / 2);
        ctx.strokeText("low", 5, spaceTop + 2 * heightColumn + heightColumn / 2);
        ctx.strokeText("hold", spaceLeft + widthColumn / 2 + txtOffset, 3 * heightColumn + spaceTop + spaceBottom / 2);
        ctx.strokeText("keep", spaceLeft + 1 * widthColumn + widthColumn / 2 + txtOffset, 3 * heightColumn + spaceTop + spaceBottom / 2);
        ctx.strokeText("adopt", spaceLeft + 2 * widthColumn + widthColumn / 2 + txtOffset, 3 * heightColumn + spaceTop + spaceBottom / 2);
        ctx.strokeText("trial", spaceLeft + 3 * widthColumn + widthColumn / 2 + txtOffset, 3 * heightColumn + spaceTop + spaceBottom / 2);
        ctx.font = "10px Arial";
        ctx.strokeStyle = "dimgray";
        ctx.strokeText("Relevance", spaceLeft + 5, spaceTop + 15); // TODO: make generic
        ctx.strokeText("Stage (Lifecycle)", spaceLeft + 4 * widthColumn - 17 * 5, 3 * heightColumn + spaceTop - 10);
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
    
    function calculateBubbleFillColor(idx) {
       var fillColors = new Array("#FF0000", "#00FF00", "#FFFF00", "#0000FF", "#FF00FF", "#00FFFF", "#800000", "#008000", "#808000", "#808000", "#000080", "#800080", "#008080"); // TODO: real calculate it!
       return fillColors[idx];
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
       //ctx.shadowBlur = bubbleShadowBlur;
       //ctx.shadowColor = bubbleShadowColor;
       ctx.stroke();
       //ctx.fillStyle = calculateBubbleFillColor(idx);
       ctx.fillStyle = radarBubble.color;
       ctx.fill();
       /*
       if (drawText) {
         ctx.font = "11px Verdana";
         ctx.lineWidth = 0.8;
         ctx.strokeStyle = "black";
         ctx.strokeText(radarBubble.name, xCoord, yCoord + 3 - (radarBubble.relativeAddCount * radiusBubbles)); // TODO: calculate middle of text
       } */
    } 
    
    function drawABubbleText(radarBubble, xCoord, yCoord) {
       if (drawText) {
         var canvas = document.getElementById("radar");
         var ctx = canvas.getContext("2d"); 
         ctx.beginPath();
         ctx.font = "11px Verdana";
         ctx.lineWidth = 0.8;
         ctx.strokeStyle = "black";
         ctx.strokeText(radarBubble.name, xCoord, yCoord + 3 - (radarBubble.relativeAddCount * radiusBubbles)); // TODO: calculate middle of text
       }
    } 
    
    function drawATransition(transition) {
       var canvas = document.getElementById("radar");
       var ctx = canvas.getContext("2d"); 
       if (debug) { console.log("draw transition from point[x="+transition.xA+",y="+transition.yA+"] to point:[x="+transition.xB+",y="+transition.yB+"]"); }
       ctx.beginPath();
       ctx.moveTo(transition.xA, transition.yA);
       ctx.lineTo(transition.xB, transition.yB);
       ctx.lineWidth = 3;
       ctx.strokeStyle = transitionColor;
       ctx.stroke();
    }  
      