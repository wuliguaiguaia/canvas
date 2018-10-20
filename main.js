/*TODO
* 1.改变窗口画布内容不变
* 2.自定义图形
* 3.自定义线宽
*/ 


// 1.初始化，创建颜色
init();
// 2.画布大小
let cxt = canvas.getContext('2d');
let diff = {
    x: 5,
    y: canvas.offsetTop
};

// 3.监听事件
listenUser();

let paintFlag = true,
    using = false;
let x1, x2, y1, y2, color;

canvas.onmousedown = function (e) {
    using = true;
    x1 = e.clientX - diff.x;
    y1 = e.clientY - diff.y;
    cxt.clearRect(x1, y1, 10, 10)
    canvas.onmousemove = function (e) {
        x2 = e.clientX - diff.x;
        y2 = e.clientY - diff.y;
        if (using) {
            if (paintFlag) {
                drawLine(cxt, x1, y1, x2, y2, color)
                x1 = x2;
                y1 = y2;

            } else {
                cxt.clearRect(x2, y2, 10, 10)
            }
        }
    }
    canvas.onmouseup = function (e) {
        using = false;
    }
}

colorBox.onclick = function (e) {
    if (e.target != colorBox) {
        color = e.target.dataColor;
    }
}

button.onclick = function () {
    if (this.classList.contains("active")) {

        this.classList.remove("active");
        paintFlag = false;
    } else {
        this.classList.add("active");
        paintFlag = true;
    }
}




// 工具函数
function init() {
    createColor();
    resize();
}

function listenUser() {
    window.onresize = resize;
}

function drawLine(cxt, x1, y1, x2, y2, color) {
    cxt.beginPath();
    cxt.moveTo(x1, y1);
    cxt.lineTo(x2, y2);
    cxt.lineWidth = 4;
    cxt.strokeStyle = color;
    cxt.stroke();
}

function createColor() {
    let colorHash = ['#000', "#7f7f7f", "#880015", "#1d1c24", "#ff2f27", "#fff200", "#22b14c", "#00a2e8",
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
    let W = getComputedStyle(canvas.parentNode, null).width;
    let H = window.innerHeight - canvas.offsetTop - 10;
    canvas.width = parseInt(W);
    canvas.height = parseInt(H);
}