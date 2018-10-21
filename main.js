/*TODO
 * 1.改变窗口画布内容不变
 * 2.自定义图形
 * 3.自定义线宽
 */


// 1.初始化，创建颜色
init();
let cxt = canvas.getContext('2d');
// canvas的偏移位置
let diff = {
    x: 5,
    y: canvas.offsetTop
};

// 3.监听事件
listenUser();

let paintFlag = true,
    color,
    lineWidth = lineConfig.value,
    eraserRect = wipeConfig.value;



colorBox.onclick = function (e) {
    if (paintFlag) {
        if (e.target != colorBox) {
            color = e.target.dataColor;
            pen.style.color = color == "#fff" ? "#ccc" : color;
        }
    }
}

button.onclick = function (e) {

    e.target.classList.add("active");
    if (e.target == pen) {
        paintFlag = true;
        eraser.classList.remove("active");
    } else {
        paintFlag = false;
        pen.classList.remove("active");
    }
}

lineConfig.oninput = function (e) {
    lineWidth = e.target.value;
}
wipeConfig.oninput = function (e) {
    eraserRect = e.target.value;
}



// 工具函数
function init() {
    createColor();
    resize();
}

function listenUser() {
    window.onresize = resize;
    canvasDrawing();
}

function drawLine(cxt, x1, y1, x2, y2, color, lineWidth) {
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
    let H = window.innerHeight - canvas.offsetTop - 10;
    canvas.width = parseInt(W);
    canvas.height = parseInt(H);
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
        if (e.touches) e = e.touches[0];
        using = true;
        x1 = e.clientX - diff.x;
        y1 = e.clientY - diff.y;
        cxt.clearRect(x1, y1, eraserRect, eraserRect)
    }

    function move(e) {
        if (e.touches) e = e.touches[0]
        x2 = e.clientX - diff.x;
        y2 = e.clientY - diff.y;
        if (using) {
            if (paintFlag) {
                drawLine(cxt, x1, y1, x2, y2, color, lineWidth)
                x1 = x2;
                y1 = y2;

            } else {
                cxt.clearRect(x2, y2, eraserRect, eraserRect)
            }
        }
    }

    function end() {
        using = false;
    }
}