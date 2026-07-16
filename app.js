const camera = document.getElementById('camera');
const loading = document.getElementById('loading');
const stage = document.getElementById('stage');
const startBtn = document.getElementById('startBtn');
const bobiWrap = document.getElementById('bobiWrap');
const bobi = document.getElementById('bobi');
const speech = document.getElementById('speech');
const countdown = document.getElementById('countdown');
const result = document.getElementById('result');
const photoResult = document.getElementById('photoResult');
const downloadBtn = document.getElementById('downloadBtn');

let stream;
let pos = {x: innerWidth/2, y: innerHeight*.53, scale: 1};
let dragStart = null;
let pinchStart = null;

async function startCamera(){
  try{
    stream = await navigator.mediaDevices.getUserMedia({
      video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},
      audio:false
    });
    camera.srcObject = stream;
    await camera.play();
    loading.classList.add('hidden');
    stage.classList.remove('hidden');
    bobiWrap.classList.add('enter');
    setTimeout(()=>{bobiWrap.classList.remove('enter');bobiWrap.classList.add('idle')},1300);
  }catch(err){
    alert('無法開啟相機。請使用 HTTPS 網址並允許相機權限。');
    console.error(err);
  }
}
startBtn.addEventListener('click', startCamera);

function animate(type,text){
  bobiWrap.classList.remove('idle','wave','heart');
  void bobiWrap.offsetWidth;
  bobiWrap.classList.add(type);
  speech.textContent = text;
  setTimeout(()=>{bobiWrap.classList.remove(type);bobiWrap.classList.add('idle');speech.textContent='嗨！歡迎來到啵比星球！'},2200);
}
document.getElementById('waveBtn').onclick=()=>animate('wave','嗨～一起拍照吧！');
document.getElementById('heartBtn').onclick=()=>animate('heart','送你一個大愛心 ❤️');
document.getElementById('resetBtn').onclick=()=>{
  pos={x:innerWidth/2,y:innerHeight*.53,scale:1};applyTransform();
};

function applyTransform(){
  bobiWrap.style.left = pos.x+'px';
  bobiWrap.style.top = pos.y+'px';
  bobiWrap.style.width = `min(${42*pos.scale}vw, ${260*pos.scale}px)`;
}
stage.addEventListener('pointerdown',e=>{
  if(!e.target.closest('#bobiWrap')) return;
  dragStart={x:e.clientX,y:e.clientY,px:pos.x,py:pos.y};
  stage.setPointerCapture(e.pointerId);
});
stage.addEventListener('pointermove',e=>{
  if(!dragStart) return;
  pos.x=dragStart.px+(e.clientX-dragStart.x);
  pos.y=dragStart.py+(e.clientY-dragStart.y);
  applyTransform();
});
stage.addEventListener('pointerup',()=>dragStart=null);

stage.addEventListener('touchstart',e=>{
  if(e.touches.length===2){
    const [a,b]=e.touches;
    pinchStart={distance:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),scale:pos.scale};
  }
},{passive:true});
stage.addEventListener('touchmove',e=>{
  if(e.touches.length===2 && pinchStart){
    const [a,b]=e.touches;
    const d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
    pos.scale=Math.min(2.2,Math.max(.45,pinchStart.scale*d/pinchStart.distance));
    applyTransform();
  }
},{passive:true});
stage.addEventListener('touchend',()=>pinchStart=null,{passive:true});

document.getElementById('photoBtn').onclick=async()=>{
  countdown.classList.remove('hidden');
  for(const n of ['3','2','1']){
    countdown.textContent=n;
    await new Promise(r=>setTimeout(r,700));
  }
  countdown.textContent='📸';
  await new Promise(r=>setTimeout(r,300));
  countdown.classList.add('hidden');
  capture();
};

function capture(){
  const canvas=document.getElementById('captureCanvas');
  const ctx=canvas.getContext('2d');
  canvas.width=innerWidth*devicePixelRatio;
  canvas.height=innerHeight*devicePixelRatio;
  ctx.scale(devicePixelRatio,devicePixelRatio);

  const vw=camera.videoWidth, vh=camera.videoHeight;
  const screenRatio=innerWidth/innerHeight, videoRatio=vw/vh;
  let sx=0,sy=0,sw=vw,sh=vh;
  if(videoRatio>screenRatio){sw=vh*screenRatio;sx=(vw-sw)/2;}
  else{sh=vw/screenRatio;sy=(vh-sh)/2;}
  ctx.drawImage(camera,sx,sy,sw,sh,0,0,innerWidth,innerHeight);

  const rect=bobi.getBoundingClientRect();
  ctx.drawImage(bobi,rect.left,rect.top,rect.width,rect.height);

  // Branded footer
  ctx.fillStyle='rgba(0,0,0,.45)';
  ctx.fillRect(0,innerHeight-72,innerWidth,72);
  ctx.fillStyle='#fff';
  ctx.font='700 22px system-ui';
  ctx.fillText('啵比星球 AR 合照',18,innerHeight-36);
  ctx.font='14px system-ui';
  ctx.fillText(new Date().toLocaleDateString('zh-TW'),18,innerHeight-14);

  const data=canvas.toDataURL('image/png');
  photoResult.src=data;
  downloadBtn.href=data;
  stage.classList.add('hidden');
  result.classList.remove('hidden');
}
document.getElementById('againBtn').onclick=()=>{
  result.classList.add('hidden');
  stage.classList.remove('hidden');
};
