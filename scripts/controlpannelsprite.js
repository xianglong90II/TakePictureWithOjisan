//调整精灵大小
function resizeSprite(sprite, heightPercent) {
    // 获取屏幕高度
    const screenHeight = window.innerHeight;
    console.log(screenHeight);
    // 计算精灵的高度
    const newHeight = screenHeight * heightPercent;
    console.log(newHeight);

    // 判断精灵的高度是否为零
    if (newHeight === 0) {
        // 如果为零，则将精灵的高度设置为屏幕高度的 10%
        newHeight = screenHeight * 0.1;
        console.log(newHeight);
    }

    // 设置精灵的高度
    sprite.height = newHeight;

    // 设置精灵的宽度
    sprite.width = newHeight / sprite.texture.height * sprite.texture.width;
}


// 添加精灵按钮点击事件
document.getElementById("addSpriteBtn").addEventListener("click", function() {
    // 随机选择一个图片文件名
    const loader = new PIXI.Loader();
    const randomImageFileName = getRandomImageFileName();
    // 加载图片
    loader.add('mypic', `./randpic/${randomImageFileName}`).load((loader, resources) => {
        // 创建一个新的Sprite
        const newSprite = new PIXI.Sprite(resources.mypic.texture);
        //调整精灵大小
        resizeSprite(newSprite,0.3);
        // 设置Sprite的位置为屏幕中心
        newSprite.x = window.innerWidth / 2 - newSprite.width / 2;
        newSprite.y = window.innerHeight / 2 - newSprite.height / 2;

        // 开启Sprite的交互性
        newSprite.interactive = true;
        // 设置拖拽功能
        newSprite
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    
        // 将新的Sprite添加到舞台上
        app.stage.addChild(newSprite);
        
        // 将新的Sprite添加到精灵数组中
        sprites.push(newSprite);
    });
}
);
  
// 随机选择图片文件名的函数
function getRandomImageFileName() {
// 这里可以根据实际情况获取文件夹中的所有文件名，然后随机选择一个
// 这里简化为假设文件夹中有固定的文件名列表
// const availableFileNames = ['pic1.png'
// ];
// const randomIndex = Math.floor(Math.random() * availableFileNames.length);
// return availableFileNames[randomIndex];

const randIndex = Math.floor(Math.random() * 18)+1;
const finalfilename = 'pic'+ String(randIndex) +'.png';
console.log(finalfilename);
return finalfilename;

}
// 上移按钮点击事件
document.getElementById("moveUpBtn").addEventListener("click", function() {
    moveSprite(true);
});

// 下移按钮点击事件
document.getElementById("moveDownBtn").addEventListener("click", function() {
    moveSprite(false);  
});

// 移动精灵
function moveSprite(moveUp) {
// 找到当前选中的精灵
    const selectedSprite = getSelectedSprite();
    if (selectedSprite) {
        const currentIndex = sprites.indexOf(selectedSprite);
        if (currentIndex !== -1) {
        const newIndex = moveUp ? currentIndex - 1 : currentIndex + 1;
        // 确保 newIndex 在有效范围内
        if (newIndex >= 0 && newIndex < sprites.length) {
                // 从数组中移除选中的精灵
                sprites.splice(currentIndex, 1);
                // 在新的位置插入选中的精灵
                sprites.splice(newIndex, 0, selectedSprite);

                // 重新调整精灵在舞台上的顺序
                app.stage.removeChild(selectedSprite);
                app.stage.addChildAt(selectedSprite, newIndex);
            }
        }
    }
}

// 获取当前选中的精灵
function getSelectedSprite() {
    for (const sprite of sprites) {
        if (sprite.alpha === 0.5) {
            return sprite;  
        }
    }
    return null;
}

// 清屏按钮点击事件
document.getElementById("clearScreenBtn").addEventListener("click", function() {
    clearScreen(); 
});

// 移动精灵
function moveSprite(moveUp) {
    // 找到当前选中的精灵
    const selectedSprite = getSelectedSprite();
    if (selectedSprite) {
        const currentIndex = sprites.indexOf(selectedSprite);
        if (currentIndex !== -1) {
        const newIndex = moveUp ? currentIndex - 1 : currentIndex + 1;
        // 确保 newIndex 在有效范围内
            if (newIndex >= 0 && newIndex < sprites.length) {
                // 从数组中移除选中的精灵
                sprites.splice(currentIndex, 1);
                // 在新的位置插入选中的精灵
                sprites.splice(newIndex, 0, selectedSprite);

                // 重新调整精灵在舞台上的顺序
                app.stage.removeChild(selectedSprite);
                app.stage.addChildAt(selectedSprite, newIndex);
            }
        }
    }
}   

// 清屏
function clearScreen() {
    // 移除所有精灵
    for (const sprite of sprites) {
        app.stage.removeChild(sprite);
    }
    // 清空精灵数组
    sprites = [];
}  

let dragging = false;
sprite.interactive = true;

// 拖拽开始
function onDragStart(event) {
    dragging = true;
    // 记录鼠标相对于精灵的位置
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}
// 拖拽结束
function onDragEnd() {
    dragging = false;
    this.alpha = 1;
    this.dragging = false;
    // 清空数据
    this.data = null;
}
// 拖拽中
function onDragMove() {
    if (dragging && this.data && this.parent) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x - this.width / 2;
        this.y = newPosition.y - this.height / 2;
    }
}

// 上传精灵按钮变化事件
document.getElementById("uploadSpriteBtn").addEventListener("change", function(event) {
const fileInput = event.target;
const file = fileInput.files[0];

if (file) {
    // 通过FileReader读取图片，并将其作为纹理应用到PIXI的Sprite上
    const reader = new FileReader();
    reader.onload = function(e) {
    const texture = PIXI.Texture.from(e.target.result);
    const sprite = new PIXI.Sprite(texture);

    // 设置Sprite的位置为屏幕中心
    sprite.x = window.innerWidth / 2 - sprite.width / 2;
    sprite.y = window.innerHeight / 2 - sprite.height / 2;

    // 开启Sprite的交互性
    sprite.interactive = true;
    // 设置拖拽功能
    sprite
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    // 将新的Sprite添加到舞台上
    app.stage.addChild(sprite);

    // 将新的Sprite添加到精灵数组中
    sprites.push(sprite);
    };
    reader.readAsDataURL(file);
}
});

    