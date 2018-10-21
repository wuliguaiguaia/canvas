/*TODO
 * 1.改变窗口画布内容不变
 * 2.自定义鼠标
 */

/*说明
 *
 * 快捷选择线宽打开画笔， 同时关闭橡皮擦
 *
 */

// 1.初始化 
let cxt = canvas.getContext('2d'),
    // canvas的偏移位置
    diff = {
        x: 0,
        y: canvas.offsetTop
    },
    paintFlag = true,
    color,
    lineWidth = lineConfig.value,
    eraserRect = wipeConfig.value,
    controls = document.querySelectorAll(".control"),
    newPen = pen.cloneNode(true),
    newEraser = eraser.cloneNode(true);
let size = resize();
cxt.fillStyle = "#fff";
cxt.fillRect(0, 0, canvas.width, canvas.height);
createColor(); //创建颜色
customDefine(); //用户自定义
// 2.画图
canvasDrawing();
// 3.监听事件
listenUser();


// newPen.id="newPen";
// newEraser.id="newEraser";
// main.appendChild(newPen);
// main.appendChild(newEraser);



function customDefine() {
    lineConfig.oninput = function (e) {
        lineWidth = e.target.value;
        clearActive(quickLineConfig)
    }
    wipeConfig.oninput = function (e) {
        eraserRect = e.target.value;
        clearActive(quickEraserConfig)
    };
    quickLineConfig.onclick = function (e) {
        lineWidth = e.target.dataset.line;
        lineConfig.value = lineWidth;
        clearActive(this);
        clearActive(quickEraserConfig)
        e.target.classList.add("active");

        paintFlag = true;
        eraser.classList.remove("active");
        pen.classList.add("active");

    }

    quickEraserConfig.onclick = function (e) {
        eraserRect = e.target.dataset.eraser;
        wipeConfig.value = eraserRect;
        clearActive(this);
        clearActive(quickLineConfig)
        e.target.classList.add("active");

        paintFlag = false;
        eraser.classList.add("active");
        pen.classList.remove("active");
    };
}

function clearActive(ele) {
    [...ele.children].forEach(item => {
        item.classList.remove("active")
    })
}

function listenUser() {
    window.onresize = resize;
    [...controls].forEach(item => {
        item.onclick = function (e) {
            clearActive(this.parentNode);
            this.classList.add("active")
        }
    });

    // 选色
    colorBox.onclick = function (e) {
        if (paintFlag) {
            if (e.target != colorBox) {
                color = e.target.dataColor;
                pen.style.color = color;
            }
        } else {
            alert("请选择画笔工具")
        }
    }

    // pen or eraser
    button.onclick = function (e) {
        e.target.classList.add("active");
        if (e.target == pen) {
            paintFlag = true;
            eraser.classList.remove("active");
        } else {
            paintFlag = false;
            pen.classList.remove("active");
        }
    };

    // 清空
    clearCanvas.onclick = function () {
        cxt.clearRect(0, 0, canvas.width, canvas.height)
    }

    // 保存
    saveCanvas.onclick = function () {
        let url = canvas.toDataURL("image/png");
        let a = document.createElement("a");
        a.href = url;
        a.download = "paint";
        a.click();
    }
}

function drawLine(x1, y1, x2, y2, color, lineWidth) {
    cxt.beginPath();
    cxt.moveTo(x1, y1);
    cxt.lineTo(x2, y2);
    cxt.lineWidth = lineWidth;
    cxt.strokeStyle = color;
    cxt.stroke();
}

function createColor() {
    let colorHash = ['#000', "#7f7f7f", "#880015", "#ff2f27", "#fff200", "#22b14c", "#00a2e8",
        "#3f48cc",
        "#a349a4", "#fff", "#c3c3c3", "#b97a57", "#ffaec9"
    ];
    for (let i in colorHash) {
        let color = colorHash[i];
        let span = document.createElement("span");
        span.title = color;
        span.className = "color";
        span.dataColor = color
        span.style.background = color;
        colorBox.appendChild(span);
    }
}

function resize() {
    let W = canvas.parentNode.offsetWidth;
    let H = window.innerHeight - canvas.offsetTop - 5;
    canvas.width = parseInt(W);
    canvas.height = parseInt(H);
    return {
        W,
        H
    }
}

function canvasDrawing() {
    let x1, x2, y1, y2, using = false;
    canvas.onmousedown = start
    canvas.onmousemove = move
    canvas.onmouseup = end
    canvas.ontouchstart = start
    canvas.ontouchmove = move
    canvas.ontouchend = end;

    function start(e) {
        clearActive(controls[0].parentNode);
        if (e.touches) e = e.touches[0];
        using = true;
        x1 = e.clientX - diff.x;
        y1 = e.clientY - diff.y;
        cxt.clearRect(x1, y1, eraserRect, eraserRect);

        // newPen.style.left = e.clientX + 'px';
        // newPen.style.top = e.clientY + 'px';

    }

    function move(e) {
        if (e.touches) e = e.touches[0]
        x2 = e.clientX - diff.x;
        y2 = e.clientY - diff.y;
        if (using) {
            if (paintFlag) {
                drawLine(x1, y1, x2, y2, color, lineWidth)
                x1 = x2;
                y1 = y2;

            } else {
                cxt.clearRect(x2, y2, eraserRect, eraserRect)
            }
        }

        // newPen.style.left = e.clientX + 'px';
        // newPen.style.top = e.clientY + 'px';
    }

    function end() {
        using = false;
    }
}