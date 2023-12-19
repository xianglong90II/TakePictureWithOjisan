dragElement(document.getElementById("controlPanel"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id)) {
    document.getElementById(elmnt.id).onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


function changeCanvasBackground(color) {
  app.renderer.backgroundColor = color;
}

// 随机颜色按钮点击事件
document.getElementById("randomColorBtn").addEventListener("click", function() {
  // 传入你想要的颜色值，例如0xFF0000表示红色
  changeCanvasBackground(getRandomColor());
});

    // 上传图片按钮变化事件
document.getElementById("uploadImageBtn").addEventListener("change", function(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    // 通过FileReader读取图片，并将其作为纹理应用到PIXI的Sprite上
    const reader = new FileReader();
    reader.onload = function(e) {
      const texture = PIXI.Texture.from(e.target.result);
      const sprite = new PIXI.Sprite(texture);

      // 清除特定背景的容器
      backgroundContainer.removeChildren();

      // 缩放Sprite以填满整个屏幕
      sprite.width = window.innerWidth;
      sprite.height = window.innerHeight;

      // 将新的Sprite添加到特定背景的容器中
      backgroundContainer.addChild(sprite);

      sprites.push(sprite);
    };
    reader.readAsDataURL(file);
  }
});


function getRandomColor() {
  // 生成一个随机的16进制颜色值
  return Math.floor(Math.random()*16777215);
  // return 0xFF0000;
}
// function addSprite() {
//   // Add your logic for adding a sprite here
//   alert("添加精灵的功能还未实现！");
// }

function minimizeControlPanel() {
  document.getElementById("controlPanel").style.display = "none";
  document.getElementById("openBtn").style.display = "block";
}

function openControlPanel() {
  document.getElementById("controlPanel").style.display = "block";
  document.getElementById("openBtn").style.display = "none";
}
