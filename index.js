
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
var currentR
var currentX
const ratio=1.1
canvas.width=700
canvas.height=canvas.width*ratio
const Z0 = 50;
var mirror=0
var points = []
var objects = []
const freq = 2000000000
points.push([1000,1000])
var mark=0
c.fillStyle='#ffffff'
const updateButton = document.getElementById("update-button");
const pointsTable = document.getElementById("points-table").querySelector("tbody");
const container = document.getElementById('container');
//c.fillRect(0,0,canvas.width,canvas.height)
class CircuitElement {
    constructor(value, imageUrl) {
      this.value = value;
      this.imageUrl = imageUrl;
    }
}
objects.push(new CircuitElement(Z0,'images/load.png'))





c.strokeStyle = "white";
c.beginPath();
c.moveTo(0, canvas.height / 2);
c.lineTo(canvas.width, canvas.height / 2);
c.stroke();


c.beginPath();
c.moveTo(canvas.width / 2, 0);
c.lineTo(canvas.width / 2, canvas.height);
c.stroke();





c.translate(canvas.width/2, canvas.height/2); 
c.lineWidth=1
drawConstantR(1,'white')
drawConstantR(-1,'white')


c.lineWidth=1.3



canvas.addEventListener('click', function(event) {  
    var mercx,mercy
    var locx = event.offsetX
    var locy =  event.offsetY

    if(locx >= canvas.width/2){
        mercx = locx-canvas.width/2
    }
    else if (locx < canvas.width/2){
        mercx = -(canvas.width/2-locx)
    }
    if(locy > canvas.height/2){
        mercy = (locy-canvas.height/2)
    }
    else if(locy <= canvas.height/2){
        mercy = -(canvas.height/2 - locy)
    }


    var Ymerc = -(2*Math.PI)*mercy/canvas.height;
    var Xmerc = -(2*Math.PI)*mercx/canvas.width;

    var delta = ((Math.atan(Math.exp(Ymerc)))-Math.PI/4)*2
    var theta = Math.PI/2 - delta

    var gR = (-1 + Math.sqrt(Math.pow(Math.tan(theta), 2) + 1)) / (Math.tan(theta) * (1/Math.cos(Xmerc)));
    let gR1 = -1 * (Math.sqrt(Math.pow(Math.tan(theta), 2) + 1) + 1) / (Math.tan(theta) * (1/Math.cos(Xmerc)));

    if(mercy>0){
        gR=gR1
    }
   
    gI=Math.tan(Xmerc)*gR
    
    var Yplot=Ymerc*canvas.height/(2*Math.PI)
    var Xplot=Xmerc*canvas.width/(2*Math.PI)  

    R = (1-gR*gR-gI*gI)/(((1-gR)**2)+gI*gI)
    X = 2*gI/(((1-gR)**2)+gI*gI)
 
    var checkR = points[mark][0]
    var checkX = points[mark][1]
    //////////console.log(R,checkR.toFixed(2),X,checkX.toFixed(2))

    var cgR=(checkR ** 2 - 1 + checkX ** 2) / ((checkR + 1) ** 2 + checkX ** 2)
    var cgI = (2 * checkX) / ((checkR + 1) ** 2 + checkX ** 2);
    var ctheta=Math.atan2((2 * Math.sqrt(cgR ** 2 + cgI ** 2)),(1 - cgR ** 2 - cgI ** 2))
    var cdelta = Math.PI/2 - ctheta
    var cYmerc=Math.log(Math.tan(Math.PI/4+cdelta/2))

    var cXmerc=Math.atan2(cgI,cgR) 
    
 
    var cYplot=cYmerc*canvas.height/(2*Math.PI)
    var cXplot=cXmerc*canvas.width/(2*Math.PI)    
    if(Xplot==cXplot){
        
    }
  
    else if(Math.abs(Yplot-cYplot)<=1){
        moveAlongVSWR(R,X,-mercx,-mercy)
        //////////console.log('vswr')
    }

    if(R>=1&&X>=1){
        if (Math.abs(R.toFixed(2) == checkR.toFixed(2))) {
            movePointAlongR(checkR, X, -mercx, -mercy);
        } else if (Math.abs(X.toFixed(2) - checkX.toFixed(2)) <= 0.03) {
            movePointAlongX(R, checkX, -mercx, -mercy);
        } 
        
    }  
    else if(R>=1&&X<1){
        if (Math.abs(R.toFixed(2) - checkR.toFixed(2)) <= 0.03) {
            movePointAlongR(checkR, X, -mercx, -mercy);
        } else if (Math.abs(X.toFixed(3) - checkX.toFixed(3)) <= 0.03) {
            movePointAlongX(R, checkX, -mercx, -mercy);
        } 
        
    }
    else if(R<1&&X>=1){
        if (Math.abs(R.toFixed(3) - checkR.toFixed(3)) <= 0.03) {
            movePointAlongR(checkR, X, -mercx, -mercy);
        } else if (Math.abs(X.toFixed(2) - checkX.toFixed(2)) <= 0.03) {
            movePointAlongX(R, checkX, -mercx, -mercy);
        }         
    }
    else if(R<1&&X<1){
        if (Math.abs(R.toFixed(3) - checkR.toFixed(3)) <= 0.03) {
            movePointAlongR(checkR, X, -mercx, -mercy);
        } else if (Math.abs(X.toFixed(3) - checkX.toFixed(3)) <= 0.03) {
            movePointAlongX(R, checkX, -mercx, -mercy);
        }
    }
    ////////console.log(points)
})

function movePointAlongR(R,X,Xplot,Yplot){
    var pR=points[mark][0]
    var pX=points[mark][1]

    mirrorPoint(-R.toFixed(2),-X.toFixed(2))

    if(Math.abs(X.toFixed(2))<=0.09){
        X=0.00
    }

    delX=X.toFixed(2)-pX.toFixed(2)
    
    delG=-delX
    //console.log(delX)
    //////console.log(delX)
    //////console.log('hi')
    if(mirror%2==0){
    if(delX>0){
        
        var ind = (delX*Z0)/(2*Math.PI*freq)
        ind*=1000000000000
        ////////console.log(`${ind.toFixed(2)} pico henry inductor in series`);
        objects.push(new CircuitElement(ind.toFixed(2),'images/seriesind.png'))
        //////console.log(objects,'h')
        drawCircuit()
    }
    else if(delX<0){
        console.log(delX)
        var cap = (1/(2*Math.PI*freq*Math.abs(delX)*Z0))
        console.log(cap)
        cap*=1000000000000
        ////////console.log(`${cap.toFixed(2)} pico farad capacitor in series`);
        objects.push(new CircuitElement(cap.toFixed(2),'images/seriescap.png'))
        //////console.log(objects,'h')
        drawCircuit()
    }
    }
    else{
        
        console.log(delG)
        if(delG>0){
      
            var cap = (delG/(2*Math.PI*freq*Z0))
            cap*=1000000000000
            ////////console.log(`${cap.toFixed(2)} pico farad capacitor in parallel`);
            objects.push(new CircuitElement(cap.toFixed(2),'images/shuntcap.png'))
            drawCircuit()
    
        }
        else if(delG<0){
          
            var ind = (Z0)/(2*Math.PI*freq*Math.abs(delG))
            ind*=1000000000000
            ////////console.log(`${ind.toFixed(2)} pico henry inductor in parallel`);
            objects.push(new CircuitElement(ind.toFixed(2),'images/shuntind.png'))
            drawCircuit()
    

        }

    }
}
function drawcR(a,b){
    c.beginPath()
    c.setLineDash([])
    c.strokeStyle='yellow'
    c.lineWidth=2.5
    var x1=Math.min(Math.abs(a),Math.abs(b))
    var x2=Math.max(Math.abs(a),Math.abs(b))
    for(var X=x1;X<=x2;X+=0.001){
        var gR=(R ** 2 - 1 + X ** 2) / ((R + 1) ** 2 + X ** 2)
        var gI = (2 * X) / ((R + 1) ** 2 + X ** 2);
        var theta=Math.atan2((2 * Math.sqrt(gR ** 2 + gI ** 2)),(1 - gR ** 2 - gI ** 2))
        var delta = Math.PI/2 - theta
        var Ymerc=Math.log(Math.tan(Math.PI/4+delta/2))
        var Xmerc=Math.atan2(gI,gR) 
        var Yplot=Ymerc*canvas.height/(2*Math.PI)
        var Xplot=Xmerc*canvas.width/(2*Math.PI)
        
        if(X==0){
            c.moveTo(Xplot,-Yplot)
        }
        c.lineTo(Xplot,-Yplot)
        
    }
    c.stroke()
}
function movePointAlongX(R,X,Xplot,Yplot){
    //////////console.log('moved')
    //points.push([R,X])
   
    mirrorPoint(-R.toFixed(2),-X.toFixed(2))

   

    delR=pR-R


    if(mirror%2==0){
    if(delR>0){
        
        var ind = (delX*Z0)/(2*Math.PI*freq)
        ind*=1000000000000
        ////////console.log(`${ind.toFixed(2)} pico henry inductor in series`);
        objects.push(new CircuitElement(ind,'images/seriesind.png'))
        //////console.log(objects,'h')
        drawCircuit()
    }
    else if(delR<0){
        var cap = (1/(2*Math.PI*freq*Math.abs(delX)*Z0))
        cap*=1000000000000
        ////////console.log(`${cap.toFixed(2)} pico farad capacitor in series`);
        objects.push(new CircuitElement(cap,'images/seriescap.png'))
        //////console.log(objects,'h')
        drawCircuit()
    }
    }
    else{
        
        


    }
}
function moveAlongVSWR(R,X,Xplot,Yplot){
    

    var pR=points[mark][0]
    var pX=points[mark][1]
    var pgR=(pR ** 2 - 1 + pX ** 2) / ((pR + 1) ** 2 + pX ** 2)
    var pgI = (2 * pX) / ((pR + 1) ** 2 + pX ** 2);
    var ptheta=Math.atan2((2 * Math.sqrt(pgR ** 2 + pgI ** 2)),(1 - pgR ** 2 - pgI ** 2))
    var pdelta = Math.PI/2 - ptheta
    var pYmerc=Math.log(Math.tan(Math.PI/4+pdelta/2))
    var pXmerc=Math.atan2(pgI,pgR) 
    var pYplot=pYmerc*canvas.height/(2*Math.PI)
    var pXplot=pXmerc*canvas.width/(2*Math.PI)
    //points.push([R,X])
    c.beginPath()
    c.setLineDash([])
    c.lineWidth=2.5
    c.strokeStyle='red'
    c.moveTo(-pXplot,-pYplot)
    c.lineTo(-Xplot,-Yplot)
    c.stroke()
    mirrorPoint(-R.toFixed(1),-X.toFixed(1))
}
function plotPoint(R,X,color){
   
    points.push([R,X])
    mark++
    //////////console.log(points)

    c.fillStyle = color
    c.strokeStyle=color
    var gR=(R ** 2 - 1 + X ** 2) / ((R + 1) ** 2 + X ** 2)
    var gI = (2 * X) / ((R + 1) ** 2 + X ** 2);
    var theta=Math.atan2((2 * Math.sqrt(gR ** 2 + gI ** 2)),(1 - gR ** 2 - gI ** 2))
    var delta = Math.PI/2 - theta
    var Ymerc=Math.log(Math.tan(Math.PI/4+delta/2))
    var Xmerc=Math.atan2(gI,gR) 
    var Yplot=Ymerc*canvas.height/(2*Math.PI)
    var Xplot=Xmerc*canvas.width/(2*Math.PI)
  
    var modg=Math.sqrt(gR*gR+gI*gI)
    var vswr=(1+modg)/(1-modg)

    ////////console.log(gR,gI)


    c.lineWidth=1.3
    c.setLineDash([]);
    drawConstantR(R,color)
    drawConstantX(X,color)
    
    c.fillStyle=color



    c.beginPath()
    c.fillStyle='yellow';
    c.arc(-Xplot, -Yplot, 3, 0, 2 * Math.PI);
    c.fillText('P'+mark,-Xplot+5,-Yplot+5)
    c.fill();
    c.beginPath();
    c.setLineDash([5, 5]);
    c.fillStyle=color
    c.lineWidth=0.3
    ////////console.log(-Xplot,-Yplot)
    c.moveTo(-canvas.width/2, -Yplot);
    c.lineTo(canvas.width, -Yplot);
    c.moveTo(-Xplot, -canvas.height/2);
    c.lineTo(-Xplot, canvas.height);
    
    c.stroke();
   
    c.lineWidth=1

    c.font = "12px Arial";
    
    var value
    if(Xplot<0){
    value=(-2*Xplot/canvas.width+1)*0.25
    }
    else{
        ////////////console.log(2*Xplot/canvas.width)
        value=(1-2*Xplot/canvas.width)*0.25
    }
    value=value.toFixed(2)

    c.fillText(value,-Xplot,canvas.height/2-5)
    c.fillText(vswr.toFixed(2),-canvas.width/2+5,-Yplot-3)

    updateTable()
    ////////////console.log(Xplot)
}



  







    
  
   
function drawConstantX(X,color){
    c.beginPath()
    c.setLineDash([5,5])
    c.fillStyle=color
    for(var R=0;R<=100;R+=0.0001){
        var gR=(R ** 2 - 1 + X ** 2) / ((R + 1) ** 2 + X ** 2)
        var gI = (2 * X) / ((R + 1) ** 2 + X ** 2);
        var theta=Math.atan2((2 * Math.sqrt(gR ** 2 + gI ** 2)),(1 - gR ** 2 - gI ** 2))
        var delta = Math.PI/2 - theta
        var Ymerc=Math.log(Math.tan(Math.PI/4+delta/2))
       
        var Xmerc=Math.atan2(gI,gR) 
        //var Ymerc=Math.log((1 - gR ** 2 - gI ** 2) / (2 * Math.sqrt(gR ** 2 + gI ** 2)));
        var Yplot=Ymerc*canvas.height/(2*Math.PI)
        var Xplot=Xmerc*canvas.width/(2*Math.PI)
       
        if(R<=1.5&&R>1.4999){

            c.font = "12px Arial";
           
            c.fillText(X,-Xplot,-Yplot)
        } 
        
        c.lineTo(-Xplot,Yplot)
        
    }
    c.stroke()
    c.beginPath()
    for(var R=0;R<=100;R+=0.0001){
        var gR=(R ** 2 - 1 + X ** 2) / ((R + 1) ** 2 + X ** 2)
        var gI = (2 * X) / ((R + 1) ** 2 + X ** 2);
        var theta=Math.atan2((2 * Math.sqrt(gR ** 2 + gI ** 2)),(1 - gR ** 2 - gI ** 2))
        var delta = Math.PI/2 - theta
        var Ymerc=Math.log(Math.tan(Math.PI/4+delta/2))
        //////////////console.log(gI/gR)
        var Xmerc=Math.atan2(gI,gR) 
        
        //var Ymerc=Math.log((1 - gR ** 2 - gI ** 2) / (2 * Math.sqrt(gR ** 2 + gI ** 2)));
        var Yplot=Ymerc*canvas.height/(2*Math.PI)
        var Xplot=Xmerc*canvas.width/(2*Math.PI)    
        c.lineTo(-Xplot,-Yplot)   
    }
    c.stroke()
}

 
//Plotting constant R arcs








function clearChart(){
    location.reload()

    c.translate(-canvas.width/2,-canvas.height/2)
    c.strokeStyle = "white";
    c.beginPath();
    c.moveTo(0, canvas.height / 2);
    c.lineTo(canvas.width, canvas.height / 2);
    c.stroke();


    c.beginPath();
    c.moveTo(canvas.width / 2, 0);
    c.lineTo(canvas.width / 2, canvas.height);
    c.stroke();
    
    
    c.translate(canvas.width/2, canvas.height/2); 

    c.lineWidth=1.3
}


function mirrorPoint(R,X){

    plotPoint(-R,-X,'white')

}

function mirrrPoint(R,X){
    mirror++
    plotPoint(-R,-X,'white')

}




function drawConstantR(R,color){
c.beginPath()
c.strokeStyle=color
for(var X=0;X<=100;X+=0.001){
    var gR=(R ** 2 - 1 + X ** 2) / ((R + 1) ** 2 + X ** 2)
    var gI = (2 * X) / ((R + 1) ** 2 + X ** 2);
    var theta=Math.atan2((2 * Math.sqrt(gR ** 2 + gI ** 2)),(1 - gR ** 2 - gI ** 2))
    var delta = Math.PI/2 - theta
    var Ymerc=Math.log(Math.tan(Math.PI/4+delta/2))
    var Xmerc=Math.atan2(gI,gR) 
    var Yplot=Ymerc*canvas.height/(2*Math.PI)
    var Xplot=Xmerc*canvas.width/(2*Math.PI)
    
    if(X==0){
        c.moveTo(Xplot,-Yplot)
    }

    if(X<=0.5&&X>0.499){

    c.font = "12px Arial";
    
    c.fillText(R,Xplot,-Yplot+10)
    } 
    c.strokeStyle=color
    c.lineTo(Xplot,-Yplot)
}

for(var X=0;X<=100;X+=0.001){
    var gR=(R ** 2 - 1 + X ** 2) / ((R + 1) ** 2 + X ** 2)
    var gI = (2 * X) / ((R + 1) ** 2 + X ** 2);
    var theta=Math.atan2((2 * Math.sqrt(gR ** 2 + gI ** 2)),(1 - gR ** 2 - gI ** 2))
    var delta = Math.PI/2 - theta
    var Ymerc=Math.log(Math.tan(Math.PI/4+delta/2))
    //////////////console.log(gI/gR)
    var Xmerc=Math.atan2(gI,gR) 
    //var Ymerc=Math.log((1 - gR ** 2 - gI ** 2) / (2 * Math.sqrt(gR ** 2 + gI ** 2)));
    var Yplot=Ymerc*canvas.height/(2*Math.PI)
    var Xplot=Xmerc*canvas.width/(2*Math.PI)
    if(X==0.001||X==0){
        c.moveTo(-Xplot,-Yplot)
    }
    c.strokeStyle=color
    c.lineTo(-Xplot,-Yplot)
}
c.stroke()
}

function complexDivision(z1, z2) {
    const denominator = z2.re * z2.re + z2.im * z2.im;
    const realPart = (z1.re * z2.re + z1.im * z2.im) / denominator;
    const imagPart = (z1.im * z2.re - z1.re * z2.im) / denominator;
    return { re: realPart, im: imagPart };
  }
function updateTable() {
   
    //pointsTable.innerHTML = "";
  
    // Loop through the `points` array and create a new row for each element
  
      const row = document.createElement("tr");
      const indexCell = document.createElement("td");
      const rCell = document.createElement("td");
      const xCell = document.createElement("td");
      const yCell = document.createElement("td");
      const gCell = document.createElement("td");
      const vswrCell = document.createElement("td");
      
  
      indexCell.textContent = mark;
      
      if(mirror%2==0){
      var tR = points[mark][0];
      var tX = points[mark][1];
      const z1 = { re: 1, im: 0 }; 
      const z2 = { re: tR, im: tX };
      const result = complexDivision(z1, z2);
      var tY = result.re
      var tG = result.im
      }
      else{
       var tY = -points[mark][0];
       var tG = -points[mark][1];
       const z1 = { re: 1, im: 0 }; 
       const z2 = { re: tY, im: tG };
       const result = complexDivision(z1, z2);
       var tR = result.re
       var tX = result.im
      }
      console.log(tR,tX,tY,tG)

      rCell.textContent = tR.toFixed(2)
      xCell.textContent = tX.toFixed(2)
      yCell.textContent = tY.toFixed(2)
      gCell.textContent = tG.toFixed(2)
      
      
      //////////console.log(tgR,tgI)
      var tgR=(tR ** 2 - 1 + tX ** 2) / ((tR + 1) ** 2 + tX ** 2)
      var tgI = (2 * tX) / ((tR + 1) ** 2 + tX ** 2);
      ////////console.log(tR,tX)
      var tmodg=Math.sqrt(tgR**2+tgI**2)
      if(mirror%2==0)
      var tvswr=Math.abs(((1+tmodg)/(1-tmodg)))
      else
      var tvswr=((1+tmodg)/(tmodg-1))
      

      
      vswrCell.textContent = tvswr.toFixed(2)
      row.appendChild(indexCell);
      row.appendChild(rCell);
      row.appendChild(xCell);
      row.appendChild(yCell)
      row.appendChild(gCell)
      row.appendChild(vswrCell)
  
      pointsTable.appendChild(row);

  }

  function drawCircuit() {
    // Clear the previous circuit diagram
 
    container.innerHTML = '';
  
    objects.forEach((object) => {
      // Create a new element for the object
      const objectElement = document.createElement('div');
  
      // Add a class to the object element
      objectElement.classList.add('circuit-object'); // Add a class to each object
  
      // Add the image to the element
      const imageElement = document.createElement('img');
      imageElement.src = object.imageUrl;
      objectElement.appendChild(imageElement);
  
      // Add the value to the element
      const valueElement = document.createElement('p');
      valueElement.style.color = "white";
      valueElement.style.fontSize = "10px";

      valueElement.innerText = `${object.value} p`;
      objectElement.appendChild(valueElement);
  
      // Add the object element to the container
      container.appendChild(objectElement);
    });
  }

  function complexDivision(z1, z2) {
    const denominator = z2.re * z2.re + z2.im * z2.im;
    const realPart = (z1.re * z2.re + z1.im * z2.im) / denominator;
    const imagPart = (z1.im * z2.re - z1.re * z2.im) / denominator;
    return { re: realPart, im: imagPart };
  }


function drawG(){
  
    c.translate(-canvas.width/2,0)
    drawConstantR(1)
    c.translate(canvas.width/2,0)
}
drawG()


/*for(var X=-1;X<=1;X+=0.1){
    for(var R=0;R<=1000;R+=0.001){
        var gR=(R ** 2 - 1 + X ** 2) / ((R + 1) ** 2 + X ** 2)
        var gI = (2 * X) / ((R + 1) ** 2 + X ** 2);
        //////////////console.log(gI/gR)
        var Xmerc=Math.atan2(gI,gR) 
        var Ymerc=Math.log((1 - gR ** 2 - gI ** 2) / (2 * Math.sqrt(gR ** 2 + gI ** 2)));
        var Yplot=Ymerc*canvas.height/(2*Math.PI)+(200-Ymerc)
   
        if(Yplot>=0){
        c.lineTo(Xmerc*canvas.width/(2*Math.PI),Yplot)
        }
    }
    for(var R=0.001;R<=1000;R+=0.001){
    
        var gR=(R ** 2 - 1 + X ** 2) / ((R + 1) ** 2 + X ** 2)
        var gI = (2 * X) / ((R + 1) ** 2 + X ** 2);
        //////////////console.log(gI/gR)
        var Xmerc=Math.atan2(gI,gR) 
        var Ymerc=Math.log((1 - gR ** 2 - gI ** 2) / (2 * Math.sqrt(gR ** 2 + gI ** 2)));
        var Yplot=-Ymerc*canvas.height/(2*Math.PI)-(200-Ymerc)
    
        if(Yplot<0){
        c.lineTo(Xmerc*canvas.width/(2*Math.PI),Yplot)
        }
    }
    c.stroke()
}
*/



/*const slider = document.querySelector('#slider');
const valueOutput = document.querySelector('#value');

var submitBtn = document.getElementById("submit-btn");
var submitBtn2 = document.getElementById("submit-btn2");


// add an event listener to the button that listens for the "click" event
submitBtn.addEventListener("click", function(event) {
  // prevent the default behavior of the button
  event.preventDefault();

  // call the updateChar() function here
    updateChar();
});

submitBtn2.addEventListener("click", function(event) {
    // prevent the default behavior of the button
    event.preventDefault();
  
    // call the updateChar() function here
    updateFreq();
  });

slider.addEventListener('input', () => {
  const sliderValue = parseFloat(slider.value);
  dotsize = sliderValue;
  valueOutput.textContent = dotsize;
});


var freq=2000000000;
let prevx = 100000000000
let prevy = 100000000000
let prevR=1000000000000;
let prevX=1000000000000;
let prevY=1000000000000;
let prevG=1000000000000;
let prevDtheta=1000000000000;
let prevVswrrad=100000000000;
canvas.width = 700;
canvas.height = 700;
c.font="10px Arial"
var mod = 0; // initialize mod variable to 0

function setMod(value) {
  mod = value; // set mod variable to the value of the clicked checkbox
}


function updateChar() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    char = document.getElementById("char-input").value;
    DrawReaCircles()
    DrawResCircles()
    DrawCondCircles() 
}

function updateFreq() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    freq = document.getElementById("freq-input").value;
    DrawReaCircles()
    DrawResCircles()
    DrawCondCircles() 
    ////////////console.log(freq)
}
document.addEventListener("mousemove", updateCursorValues);

function updateCursorValues(event) {
    // Get the cursor position from the event object
    var x = event.offsetX;
    var y = event.offsetY;

    if(x>=350){
        x-=350
    }
    else if(x<350){
        x=-1*(350-x);
    }
    if(y<=350){
        y=350-y
  
    }
    else if(y>350){
        y=-1*(y-350)
    }
    var vswrrad = Math.sqrt(x*x+y*y)
    x/=scale
    y/=scale

    let numerator = -1 + Math.pow(x, 2) + Math.pow(y, 2);
    let denominator = 1 - 2 * x + Math.pow(x, 2) + Math.pow(y, 2);
    var R = -numerator / denominator;
    var X = (2*y) / (1 - 2*x + x**2 + y**2);
    const z1 = { re: 1, im: 0 }; 
    const z2 = { re: R, im: X };
    const result = complexDivision(z1, z2);
    var Y = result.re
    var G = result.im
    R*=char
    X*=char



    Y*=char
    G*=char

    if(x>=0&&y>=0){
        var theta = Math.atan(y / x);
       }
       else if(x>0&&y<0){
           var theta = 2*Math.PI-Math.atan((-1*y)/x);
       }
       else if(x<0&&y<0){
           var theta = Math.PI + Math.atan((-1*y)/(-1*x))
       }
       else{
           var theta = Math.PI - Math.atan(y/(-1*x))
       }
       
       var dtheta = Math.round(100*theta/Math.PI)/100
       dtheta*=180
       var gmag = vswrrad/scale

   
  
    // Update the text of the HTML element with the cursor values
    const cursorValuesElement = document.getElementById("cursorValues");
    cursorValuesElement.innerText = `Gamma: ${gmag.toFixed(2)} ${dtheta.toFixed(2)}° |  R: ${R.toFixed(2)} | X: ${X.toFixed(2)} | rad: ${Math.round(vswrrad)} | Y: ${Y.toFixed(2)} | G: ${G.toFixed(2)}`;
}
// add a click event listener to the canvas 
canvas.addEventListener('click', function(event) {  
  var locx = event.offsetX
  var locy = event.offsetY

  var x = event.offsetX;
  var y = event.offsetY;

  if(x>=350){
      x-=350
  }
  else if(x<350){
      x=-1*(350-x);
  }
  if(y<=350){
      y=350-y

  }
  else if(y>350){
      y=-1*(y-350)
  }

  var vswrrad = Math.sqrt(x*x+y*y)
 
  //////////////console.log(x,y)



  x/=scale
  y/=scale
  if(x>=0&&y>=0){
    var theta = Math.atan(y / x);
   }
   else if(x>0&&y<0){
       var theta = 2*Math.PI-Math.atan((-1*y)/x);
   }
   else if(x<0&&y<0){
       var theta = Math.PI + Math.atan((-1*y)/(-1*x))
   }
   else{
       var theta = Math.PI - Math.atan(y/(-1*x))
   }
   
   const dtheta = Math.round(100*theta/Math.PI)/100
  
  let numerator = -1 + Math.pow(x, 2) + Math.pow(y, 2);
  let denominator = 1 - 2 * x + Math.pow(x, 2) + Math.pow(y, 2);
  var R = -numerator / denominator;
  //var radius = (scale/(R+1))
  //////////////console.log(dtheta)
  var X = (2*y) / (1 - 2*x + x**2 + y**2);

  const z1 = { re: 1, im: 0 }; 
  const z2 = { re: R, im: X };
  const result = complexDivision(z1, z2);
  var Y = result.re
  var G = result.im
  //////////////console.log(prevY)
  //////////////console.log(Y)
  //moving along constant R circle primary
  //////////////console.log(prevR)



if(prevx===100000000000||prevR==R.toFixed(2)||prevY==Y.toFixed(2)||Math.round(vswrrad)==prevVswrrad||R===0){
  c.beginPath()
  c.lineWidth=0.3;
  c.arc(350,350,vswrrad,0,2*Math.PI)
  c.stroke()

  c.beginPath();
  c.arc(locx, locy, dotsize, 0, 2 * Math.PI);
  c.fillStyle = 'red';
  c.fill();
  if(prevR==R.toFixed(2)){
    let delX = -1*(prevX - X.toFixed(2))
   

    if(delX>0){
        //series inductor
        var ind = (delX*char)/(2*Math.PI*freq)
        ind*=1000000000000
        ////////////console.log(`${ind.toFixed(2)} pico henry inductor in series`);
        objects.push(new CircuitElement(ind.toFixed(2),'images/seriesind.png'))
        drawCircuit()
    }
    else if(delX<0){
        //series capacitor
        
        var cap = (1/(2*Math.PI*freq*Math.abs(delX)*char))
        cap*=1000000000000
        ////////////console.log(`${cap.toFixed(2)} pico farad capacitor in series`);
        objects.push(new CircuitElement(cap.toFixed(2),'images/seriescap.png'))
        drawCircuit()

    }
    //drawArc()
    //calcLump()
    //////////////console.log(R.toFixed(2))
    //////////////console.log(prevx,prevy,locx,locy,radius)
  }
  //moving along constant X circle primary
 
  else if(prevY==Y.toFixed(2)){
    
    let delG=G.toFixed(2)-prevG
    
    if(delG>0){
  
        var cap = (delG/(2*Math.PI*freq*char))
        cap*=1000000000000
        ////////////console.log(`${cap.toFixed(2)} pico farad capacitor in parallel`);
        objects.push(new CircuitElement(cap.toFixed(2),'images/shuntcap.png'))
        drawCircuit()

    }
    else if(delG<0){
      
        var ind = (char)/(2*Math.PI*freq*Math.abs(delG))
        ind*=1000000000000
        ////////////console.log(`${ind.toFixed(2)} pico henry inductor in parallel`);
        objects.push(new CircuitElement(ind.toFixed(2),'images/shuntind.png'))
        drawCircuit()

    }
   
  }

  var deltheta = prevDtheta-dtheta

  var lambda1 = (deltheta*0.5/2)
  if(lambda1<0){
      lambda1+=0.50
  }
  ////////////console.log(lambda1.toFixed(2))
  prevR=R.toFixed(2)
  prevX=X.toFixed(2)
  prevY=Y.toFixed(2)
  prevG=G.toFixed(2)    
  prevx=locx
  prevy=locy
  prevDtheta=dtheta
  prevVswrrad=Math.round(vswrrad)
}
  //////////////console.log(R,X)
  //((1/(R+1))*scale)
  //////////////console.log(scale/X)
  //////////////console.log(solveForR(x,y))





  
   
   //
   //////////////console.log(`${(dtheta)} PI`)
   



   
   
   //////////////console.log(vswr);
   
});

function solveForR(x, y) {
    let numerator = -1 + x * x + y * y;
    let denominator = 1 - 2 * x + x * x + y * y;
    let R = numerator / denominator;
    return R;
  }

class ResCircle{
    constructor(resistance) {
        this.resistance = resistance;
    }

    draw(){
        
        c.strokeStyle='#ff0000'
        c.beginPath();
        c.arc(this.resistance.center,canvas.height/2,this.resistance.radius,0,2*Math.PI)
        c.stroke()


    }

    mark(){
        c.fillText(this.resistance.value,this.resistance.center-this.resistance.radius,canvas.height/2)
    }
}

class CondCircle{
    constructor(resistance) {
        this.resistance = resistance;
    }

    draw(){
        
        c.strokeStyle='#ff0000'
        c.beginPath();
        c.arc(750-this.resistance.center,canvas.height/2,this.resistance.radius,0,2*Math.PI)
        c.stroke()


    }

    mark(){
        c.fillText(this.resistance.value,this.resistance.center-this.resistance.radius,canvas.height/2)
    }
}

class ReaCircle{
    constructor(reactance) {
        this.reactance = reactance;
    }

    draw(){
        
        c.strokeStyle='#0000ff'
        c.beginPath();
        c.arc(700,canvas.height/2+this.reactance.center,this.reactance.radius,0,2*Math.PI)
        c.arc(700,canvas.height/2-this.reactance.center,this.reactance.radius,0,2*Math.PI)
        c.stroke()


    }

  
}



c.lineWidth=10






 
function DrawResCircles(){

//plotting all circles
    for(var j=0;j<=100;j=j+0.01){
        const rescircle = new ResCircle({
            
            center: 700 -((1/(j+1))*scale),
            radius: (1/(j+1))*scale,
            value: (j)*char
        })
        
        c.lineWidth=0.1;
        if(j>100){
            c.lineWidth=0.0001;
        }
        rescircle.draw() 
    }

//labelling 0 to 1
    for(var j=0;j<0.9;j=j+0.1){
        const rescircle = new ResCircle({
            center: 700-((1/(j+1))*scale),
            radius: (1/(j+1))*scale,
            value: Math.round((j)*char*10)/10
        })
        
        c.lineWidth=0.3;

        rescircle.draw()
        rescircle.mark()
    }
//labelling 1 to 2
    for(var j=1;j<1.9;j=j+0.2){
        const rescircle = new ResCircle({
            center: 700-((1/(j+1))*scale),
            radius: (1/(j+1))*scale,
            value: Math.round((j)*char*10)/10
        })
        
        c.lineWidth=0.3;

        rescircle.draw()
        rescircle.mark()
    }
//labelling 2 to 10
    for(var j=2;j<10;j=j+1){
        const rescircle = new ResCircle({
            center: 700-((1/(j+1))*scale),
            radius: (1/(j+1))*scale,
            value: Math.round((j)*char*10)/10
        })
        
        c.lineWidth=0.3;

        rescircle.draw()
        rescircle.mark()

    }
}

function DrawReaCircles(){

    c.fillText(0.1*char,7,282)
    c.fillText(0.2*char,27,220)
    c.fillText(0.3*char,59,159)
    c.fillText(0.4*char,99,110)
    c.fillText(0.5*char,142,74)
    c.fillText(0.6*char,188,47)
    c.fillText((0.7*char),231,30)
    c.fillText((0.8*char),274,17)
    c.fillText((0.9*char),313,10)
    c.fillText((1*char),350,9)
    c.fillText(1.2*char,411,15)
    c.fillText(1.4*char,460,29)
    c.fillText(1.6*char,490,45)
    c.fillText(1.8*char,515,56)
    c.fillText(2*char,553,78)
    c.fillText(3*char,592,112)
    c.fillText(4*char,617,141)
    c.fillText(5*char,634,164)
    c.fillText(-0.1*char, 7, -282);


    



    //plotting all circles
    c.strokeStyle='#0000ff'
    c.lineWidth=0.5;
    c.beginPath();
    c.moveTo(canvas.width/2+scale, canvas.height/2);
    c.lineTo(canvas.width/2-scale, canvas.height/2);
    c.stroke();

        for(var j=0;j<=1000;j=j+0.01){
            const reacircle = new ReaCircle({
                
                center: ((1/(j))*scale),
                radius: (1/(j))*scale,
                value: (j)*char
            })
            
            c.lineWidth=0.01;
            if(j>10){
                c.lineWidth=0.0001;
            }
      
            reacircle.draw() 
        }
    
    //labelling 0 to 1
        for(var j=0;j<0.9;j=j+0.1){
            const reacircle = new ReaCircle({
                center: ((1/(j))*scale),
                radius: (1/(j))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.3;
    
            reacircle.draw()
            //reacircle.mark()
        }
    //labelling 1 to 2
        for(var j=1;j<1.9;j=j+0.2){
            const reacircle = new ReaCircle({
                center: ((1/(j))*scale),
                radius: (1/(j))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.3;
    
            reacircle.draw()
            //rescircle.mark()
        }
    //labelling 2 to 10
        for(var j=2;j<100;j=j+0.5){
            const reacircle = new ReaCircle({
                center: ((1/(j))*scale),
                radius: (1/(j))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.3;
    
            reacircle.draw()
            //reacircle.mark()
    
        }

    }



    
    //rescircle.draw()
    //rescircle.mark()



DrawResCircles()
DrawReaCircles()
c.fillText("O",canvas.width,canvas.height/2)


function calcLump(){


}








function DrawCondCircles(){


    //plotting all circles
        for(var j=0;j<=100;j=j+0.01){
            const condcircle = new CondCircle({
                
                center: 750 -((1/(j+1))*scale),
                radius: (1/(j+1))*scale,
                value: (j)*char
            })
            
            c.lineWidth=0.1;

            condcircle.draw() 
        }
    
    //labelling 0 to 1
        for(var j=0;j<0.9;j=j+0.1){
            const condcircle = new CondCircle({
                center: 750-((1/(j+1))*scale),
                radius: (1/(j+1))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.1;
    
            condcircle.draw()
            //condcircle.mark()
        }
        const condcircle = new CondCircle({
            center: 750-((1/(1+1))*scale),
            radius: (1/(1+1))*scale,
            value: Math.round((1)*char*10)/10
        })
        
        c.lineWidth=0.3;

        condcircle.draw()
    //labelling 1 to 2
        for(var j=1;j<1.9;j=j+0.2){
            const condcircle = new CondCircle({
                center: 750-((1/(j+1))*scale),
                radius: (1/(j+1))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.1;
    
            condcircle.draw()
            //condcircle.mark()
        }
    //labelling 2 to 10
        for(var j=2;j<10;j=j+1){
            const condcircle = new CondCircle({
                center: 750-((1/(j+1))*scale),
                radius: (1/(j+1))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.1;
    
            condcircle.draw()
            //condcircle.mark()
    
        }
    }

    function complexDivision(z1, z2) {
        const denominator = z2.re * z2.re + z2.im * z2.im;
        const realPart = (z1.re * z2.re + z1.im * z2.im) / denominator;
        const imagPart = (z1.im * z2.re - z1.re * z2.im) / denominator;
        return { re: realPart, im: imagPart };
      }
      
   DrawCondCircles()






   // Define the class
class CircuitElement {
    constructor(value, imageUrl) {
      this.value = value;
      this.imageUrl = imageUrl;
    }
}
  
  // Create some instances of the class
  const objects = [
        new CircuitElement(0,'images/load.png')
 
  ];
  
  // Get the container element to display the objects
  const container = document.getElementById('container');
  
  // Loop through the objects array and create a new HTML element for each object

  function drawCircuit() {
    // Clear the previous circuit diagram
 
    container.innerHTML = '';
  
    objects.forEach((object) => {
      // Create a new element for the object
      const objectElement = document.createElement('div');
  
      // Add a class to the object element
      objectElement.classList.add('circuit-object'); // Add a class to each object
  
      // Add the image to the element
      const imageElement = document.createElement('img');
      imageElement.src = object.imageUrl;
      objectElement.appendChild(imageElement);
  
      // Add the value to the element
      const valueElement = document.createElement('p');
      valueElement.innerText = `Value: ${object.value}`;
      objectElement.appendChild(valueElement);
  
      // Add the object element to the container
      container.appendChild(objectElement);
    });
  }

  drawCircuit()
  
  
  
  */
