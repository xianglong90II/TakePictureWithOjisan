//const cubism2Model =
//"https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json";
const cubism4Model =
"KusoProf/KusoProf.model3.json";
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


(async function main() {
  const app = new PIXI.Application({
    view: document.getElementById("canvas"),
    autoStart: true,
    resizeTo: window,
    backgroundColor: 0x333333 });

  const models = await Promise.all([
  //live2d.Live2DModel.from(cubism2Model),
  live2d.Live2DModel.from(cubism4Model)]);
  models.forEach(model => {
    app.stage.addChild(model);

    const scaleX = innerWidth * 0.8 / model.width;
    const scaleY = innerHeight * 1.2 / model.height;

    // fit the window
    model.scale.set(Math.min(scaleX, scaleY));

    model.y = innerHeight * 0.1;

    draggable(model);
    addFrame(model);
    //异步往这里放
    
    setInterval(() => {
      model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY',smoothVolume);
      }, 100);
    }
    //model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY',1);
       // 获取音频上下文
    
  );//异步结束




  const model4 = models[0];
  model4.x = 0;
/*
  model4.on("hit", hitAreas => {
    if (hitAreas.includes("Body")) {
      model4.motion("Tap");
    }

    if (hitAreas.includes("Head")) {
      model4.expression();
    }
  });
  */

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

function addFrame(model) {
  const foreground = PIXI.Sprite.from(PIXI.Texture.WHITE);
  foreground.width = model.internalModel.width;
  foreground.height = model.internalModel.height;
  foreground.alpha = 0.2;

  model.addChild(foreground);

  checkbox("Model Frames", checked => foreground.visible = checked);
}

function addHitAreaFrames(model) {
  const hitAreaFrames = new live2d.HitAreaFrames();

  model.addChild(hitAreaFrames);

  checkbox("Hit Area Frames", checked => hitAreaFrames.visible = checked);
}

function checkbox(name, onChange) {
  const id = name.replace(/\W/g, "").toLowerCase();

  let checkbox = document.getElementById(id);

  if (!checkbox) {
    const p = document.createElement("p");
    p.innerHTML = `<input type="checkbox" id="${id}"> <label for="${id}">${name}</label>`;

    document.getElementById("control").appendChild(p);
    checkbox = p.firstChild;
  }

  checkbox.addEventListener("change", () => {
    onChange(checkbox.checked);
  });

  onChange(checkbox.checked);
//}


}