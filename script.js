// ctx.fillStyle="red";
// ctx.fillRect(50,50, 100, 100);

// ctx.strokeStyle="red";
// ctx.lineWidth='10';
// ctx.strokeRect(50, 50, 100, 100);

// ctx.arc(50, 50, 100, 0, Math.PI*2); 
// ctx.fill();

// ctx.beginPath();
// ctx.moveTo(50, 50);
// ctx.lineTo(25, 100);    
// ctx.lineTo(75, 100);
// ctx.closePath();  
// ctx.stroke();  


const canv = document.querySelector('canvas');
const ctx = canv.getContext("2d");
const pixel = 20;

canv.width = 500;
canv.height = 500;
let mouseDown = false;


canv.addEventListener('mousedown', function(){
  mouseDown = true;
  ctx.lineWidth = 10 * 2;
  ctx.strokeStyle= 'black';
  ctx.beginPath();
});

canv.addEventListener('mouseup', function(){
  mouseDown = false;
});



canv.addEventListener('mousemove', function(e){
  if(mouseDown){
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(e.clientX, e.clientY, 10, 0, Math.PI*2);
    //ctx.fillStyle="red";
    ctx.fill();

    ctx.beginPath();
    
    ctx.moveTo(e.clientX, e.clientY);
} 
});

function convasClear(){
  ctx.clearRect(0, 0, canv.width, canv.height);
  console.log('Начата кнопка')
}

function drawLine(x1, y1, x2, y2, color = 'grey'){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineJoin = 'miter';
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawCell(x, y, w, h){

  ctx.fillStyle = 'blue';
  ctx.strokeStyle = 'blue';
  ctx.lineJoin = 'miter';
  ctx.lineWidth = 1;
  ctx.rect(x, y, w, h);
  ctx.fill();
}

function setka(){
  const w = canv.width;
  const h = canv.height;
  const p = w/pixel; 

  const xStep = w/p;
  const yStep = h/p;

  for(let x = 0; x < w; x = x+xStep){
    drawLine(x, 0, x, h)
  }

  for(let y = 0; y < h; y = y+yStep){
    drawLine(0, y, w, y);
  }
}

function calculate( draw = false){
 
  const w = canv.width;
  const h = canv.height;
  const p = w/pixel; 
  
  const xStep = w/p;
  const yStep = h/p;

  const vector = [];
  let _draw = [];

  for(let x = 0; x < w; x = x + xStep){
    for(let y = 0; y < h; y = y + yStep){
      const data = ctx.getImageData(x, y, xStep, yStep);
      let nonPixels = 0;
      for(let i = 0; i < data.data.length; i = i + 10){
        
        const isEmpty = data.data[i] === 0;
          if(!isEmpty){
          
            nonPixels = nonPixels + 1;
          }
      }
      if(nonPixels > 1 && draw){
        _draw.push([x, y, xStep, yStep]);
      }
      vector.push(nonPixels > 1 ? 1 : 0);
    } 
  }
  if(draw){
    this.convasClear();
    this.setka();
    for(_d in _draw){
    drawCell(_draw[_d][0], _draw[_d][1], _draw[_d][2], _draw[_d][3]);
    }
  }
  console.log(vector);
  return vector
}
 


document.addEventListener('keypress', function(e){
  if (e.key.toLowerCase()==='c'){
    ctx.clearRect(0, 0, canv.width, canv.height);
  }

  if (e.key.toLowerCase()==='v'){

      vector =   calculate(true);
      if (confirm('Positiv?')){
    trainData.push({
    input: vector,
    output: {positiv: 1}
});
      } else{
          trainData.push({
          input: vector,
          output: {negativ: 1}
        })
      }
  } 
  if (e.key.toLowerCase()==='b'){
    const net = new brain.NeuralNetwork();
    net.train(trainData);

    const result = brain.likely(calculate(), net);
    alert(result);
  }
})

let vector = [];
let net = null;
let trainData = [];











