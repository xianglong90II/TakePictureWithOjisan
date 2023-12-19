   // 获取音频上下文
function playVol() {
    const audio = document.getElementById('audio');
    const audiop = document.getElementById('audiop');
    audio.play();
    audiop.play();
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
    let volume = 0;
    for (let i = 0; i < bufferLength; i++) {
        volume += dataArray[i];
    }
    // 将音量打印到console
    volume -=15000
    if (volume<0){
        volume = 0;
    }
    else if (volume>3000){
        volume = 1;
    }
    else{
        volume = volume/3000
    }
    console.log(volume);
    let text = volume; 
    document.getElementById('text').innerHTML = text;
    }, 100);
}