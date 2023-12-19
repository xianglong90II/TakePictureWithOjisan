//const cubism2Model =
//"https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json";
const cubism4Model =
"./KusoProf/KusoProf.model3.json";
const live2d = PIXI.live2d;

const volBuffer = [];
const bfl = 1; 
smoothVolume = 0


function playVol() {
  const audio = document.getElementById('audio');
  const audiop = document.getElementById('audiop');
  audio.play();
  audiop.play();
  playing = true;
  audio.onended = function() 
{
    playing = false;
};
  volume = 0;
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.fftSize = 256;

  // 创建数据数组保存analyser处理后的音频数据
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // 每隔一段时间获取当前时刻的音频数据
  setInterval(() => {

  // 将当前时刻的音频数据复制到数组中
  analyser.getByteTimeDomainData(dataArray); 

  // 计算当前总音量
  
  for (let i = 0; i < bufferLength; i++) {
      volume += dataArray[i];
  }
  // 将音量打印到console
  volume -=15000
  if (playing==false){
    volume=0;
    smoothVolume = 0;
  }
  else if (volume<0){
      volume = 0;
  }
  else if (volume>3000){
      volume = 1;
  }
  else{
      volume = volume/3000
  }
  const newVolume = volume //...获取最新音量

  // 添加到缓冲区
  volBuffer.push(newVolume);

  // 限制缓冲区长度
  if(volBuffer.length > bfl) {
    volBuffer.shift();
  }

  // 计算缓冲区平均音量
  let sum = 0;
  for(let v of volBuffer) {
    sum += v;
  }
  smoothVolume = sum / volBuffer.length;
  //console.log(volume);
  let text = smoothVolume; 
  document.getElementById('text').innerHTML = text;
  }, 100);
}

let app;
let backgroundContainer;
let sprites = [];
(async function main() {
   app = new PIXI.Application({
    view: document.getElementById("canvas"),
    autoStart: true,
    resizeTo: window,
    backgroundColor: 0xFFFFFF });
    // 初始化特定背景的容器
    backgroundContainer = new PIXI.Container();
    app.stage.addChild(backgroundContainer);

  const models = await Promise.all([
  //live2d.Live2DModel.from(cubism2Model),
  live2d.Live2DModel.from(cubism4Model)]);
  models.forEach(model => {
    app.stage.addChild(model);

    const scaleX = innerWidth * 1.5 / model.width;
    const scaleY = innerHeight * 1.5 / model.height;

    // fit the window
    model.scale.set(Math.min(scaleX, scaleY));

    model.y = innerHeight * 0;
    model.x = app.renderer.width - model.width;// 设置元素的 x 为渲染器的宽度

    draggable(model);
    //异步往这里放
    
    setInterval(() => {
      model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY',smoothVolume);
      }, 100);
    }
    
  );//异步结束




  const model4 = models[0];
  model4.x = app.renderer.width - model4.width;
})();

function draggable(model) {
  model.buttonMode = true;
  model.on("pointerdown", e => {
    model.dragging = true;
    model._pointerX = e.data.global.x - model.x;
    model._pointerY = e.data.global.y - model.y;
  });
  model.on("pointermove", e => {
    if (model.dragging) {
      model.position.x = e.data.global.x - model._pointerX;
      model.position.y = e.data.global.y - model._pointerY;
    }
  });
  model.on("pointerupoutside", () => model.dragging = false);
  model.on("pointerup", () => model.dragging = false);
}