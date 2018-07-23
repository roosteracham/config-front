$(".leftsidebar_box dt").css({"background-color":"#3992d0"});

$(".leftsidebar_box dt img").attr("src","../images/left/select_xl01.png");

// 页面加载完之后才被调用
$(function(){

    $(".system_log dd").hide();

    $(".system_log dt").on('click', clickToggle);

    newSVG();
});

function clickToggle(e){
    // 原生点击事件的this和vue组件点击事件的this指示不一样的实例。
    // vue中的this指代vue实例
    // 原生的 this 指代被点击对象本身
    if (e.type === 'click') {
        e = $(this);
    }

    $(".leftsidebar_box dt").css({"background-color":"#3992d0"})
    e.css({"background-color": "#317eb4"});
    e.parent().find('dd').removeClass("menu_chioce");
    $(".leftsidebar_box dt img").attr("src","../images/left/select_xl01.png");
    e.parent().find('img').attr("src","../images/left/select_xl.png");
    $(".menu_chioce").slideUp();
    e.parent().find('dd').slideToggle();
    e.parent().find('dd').addClass("menu_chioce");
}

// 当前svg根元素
var svg = null;

// svg图形
var simpleSVG = [
    "RECT",
    "CIRCLE",
    "ELLIPSE",
    "LINE",
    "POLYGON",
    "POLYLINE",
    "PATH",
    "TEXT",
    "TSPAN",
    "GROUP"
];

// 是否是图形元素
function isSvgElement(name) {
    for (var i = 0; i < simpleSVG.length; i++) {
        if (simpleSVG[i].toLowerCase() === name) {
            return true;
        }
    }
    return false;
}

// 依据class 判断是否是图形元素
function isSVGElementByClass(o) {
    if (typeof(o) === 'undefined') {
        return false;
    }
    return hasClass(o.classes(), 'ele');
}

// 是否是组合的元素
function isGroupedEle(o) {
   return o.hasClass('groupEle');
}

function isNodeGroupedEle(node) {
    var clas = node.classList;
    return hasClass(clas, 'groupEle');
}

// 是否具有某个class， 有则返回true
function hasClass(clas, cla) {

    for (var i = 0; i < clas.length; i++) {

        if (clas[i] === cla) {
            // 如果具有cla 则返回true
            return true;
        }
    }

    // 如果不具有cla 则返回false
    return false;
}

// 是否是点击事件
var isClick = true;

// 鼠标按下时间
var downTime = 0,
    upTime = 0;  // 鼠标弹起时间

// 为true时，鼠标移动事件有效
var isMouseover = false;

// 定义鼠标按下和弹起时的坐标
var beginX, beginY,
    widthM = 0, heightM = 0;

// 保存矩形
var rectOnMousemove = null;

// 多个元素被选中，一起拖动
var clearOthers = true;

var clickEle = null;

var clickEleX = 0,
clickEleY = 0;
// 鼠标按下事件
function mousedownOnNonEle(e) {

    getAllEles();
    //将宽度和高度重置为0
    widthM = 0;
    heightM = 0;

    downTime = new Date().getTime();

    // 鼠标移动时响应，画矩形
    isMouseover = true;

    if (e.target.nodeName === 'svg') {

        // 如果class 为 rectMousemove 的元素仍存在则删除
        deleteRectMousemove();

        //清除所有选中状态
        clearAllSelected();

        // 获取鼠标点击时相对于svg背景的坐标
        beginX = e.layerX;
        beginY = e.layerY;

        // 画矩形， 此矩形被 rectMousemove class标识 ， 在鼠标弹起时依据此class 删除
        // 在鼠标移动时，依据此class 选择，并根据鼠标偏移量设置此矩形的宽度和高度
        rectOnMousemove = svg.rect(0, 0, 0, 0)
           .fill('none')
           .stroke({
                width : 1
           })
           .addClass('rectMousemove')
           .move(beginX, beginY)
    } else { // 若点击在图形元素上，则判断是否被选中，未被选中清除其他元素被选中的状态
        var o;
        if (isNodeGroupedEle(e.target)) {
            o = e.target.parentNode.instance;
        } else {
            o = e.target.instance;
        }
        clickEle = o;
        clickEleX = clickEle.x();
        clickEleY = clickEle.y();
        var classes = o.classes();
        for (var i = 0; i < classes.length; i++) {
            if (classes[i] === 'selected') {
                clearOthers = false;
                break;
            }
        }
        if (clearOthers) {
            clearAllSelected();
        }
    }
}

// 删除随鼠标变化的矩形
function deleteRectMousemove() {

    var rects = SVG.select('.rectMousemove');
    for (var i = 0; i < rects.length(); i++) {
        var rect = rects.get(i);
        rect.remove()
    }
}

// 获取所有元素
function getAllEles() {
    var eles;
    try {
        eles = SVG.select('.ele');
    } catch (e) {
        eles = getAllEles();
    }
    return eles;
}

// 鼠标弹起处理事件
function mouseupOnSVG(e) {

    getAllEles();
    if (SVG.select('.selected').length() > 1) {
        var eles = SVG.select('.selected');
        for (var i = 0; i < eles.length(); i++) {
            var ele = eles.get(i);
            if (ele !== clickEle)
                ele.dmove(clickEle.x() - clickEleX, clickEle.y() - clickEleY);
        }
    }
    if (isMouseover) {

        if (rectOnMousemove !== null){

            // 判断矩形中包含的图形，在其中则被选中
            var eles = getAllEles();
            for (var i = 0; i < eles.length(); i++) {

                var ele = eles.get(i);
                var cx = ele.cx(),
                    cy = ele.cy();

                // 如果元素中心在class为的矩形内， 则该元素被选中
                if (rectOnMousemove.inside(cx, cy)) {
                    limiteDragArea(ele).selectize()
                        .addClass('selected')
                        .resize();
                }
            }
        }

        // 删除虽鼠标变化的矩形
        deleteRectMousemove();
    }

    // 鼠标移动时，不做任何处理
    isMouseover = false;

    // 保存矩形的变量置null
    rectOnMousemove = null;

    // 计算鼠标点击经过的时间，时间大于200ms，阻止click事件
    if (downTime > upTime) {

        upTime = new Date().getTime();
    }
    if ((upTime - downTime) > 200) {
        isClick = false;
    } else {
        isClick = true;
    }
    downTime = upTime;

    if (isSvgElement(e.target.nodeName) && clearOthers) {
        var o = e.target.instance;
        if (isNodeGroupedEle(e.target)) {
            o = e.target.parentNode.instance;
        }
        selectClicked(o);
    } else {
        clearOthers = true;
    }
}

// 鼠标移动到svg上的处理事件
function mouseoverOnSVG(e) {
    getAllEles();
    if (isMouseover) {

        // 获取鼠标偏移量
        var dx = e.movementX,
            dy = e.movementY;

        // 设置矩形宽度和高度
        widthM += dx;
        heightM += dy;
        
        if (e.target.nodeName === 'svg') {

            widthM = widthM > 0 ? widthM : 0;
            heightM = heightM > 0 ? heightM : 0;

            var rect = SVG.select('.rectMousemove');

            // svg中只应该有一个class 为 rectMouseMove 的矩形
            if(rect.length() === 1) {

                rect.get(0).size(widthM, heightM);
            }
        } /*else {
            var eles = SVG.select('.selected');
            for (var i = 0; i < eles.length(); i++) {
                var ele = eles.get(i);
                ele.dmove(dx, dy);
            }
        }*/
    }
}

//点击元素选中，其他元素清除选中效果
function selectClicked(o) {
    clearAllSelected();
    // 选中点击的元素
    o.selectize()
        .resize();
    o.addClass('selected');
}

//清除所有元素选中效果
function clearAllSelected() {
    // 获取svg孩子元素，孩子节点.node才是
    //var c = svg.children();
    // 使用SVG选择器选择所有图形， svg的子节点中的图形具有ele class
    var c = SVG.select('.selected')

    //判断孩子节点是否是图形元素，如果是去除选中
    for (var i = 0; i < c.length(); i++) {
        var o = c.get(i);
        o.selectize(false)
            .resize('stop');
        o.removeClass('selected')
    }
}

// 点击非图片区域取消选中, 点击图形元素被选中
function clickNonEleToClear(e) {
    getAllEles();
    if (isClick) { // 点击
        clearAllSelected();
        if (e.target.nodeName === 'svg') {
            return;
        }
        var o = e.target.instance;
        if (isSVGElementByClass(o) || isSVGElementByClass(e.target.parentNode.instance)) {

            if (isNodeGroupedEle(e.target)) {
                o = e.target.parentNode.instance;
            }
            limiteDragArea(o)
                .selectize()
                .addClass('selected')
                .resize();
            deleteRectMousemove();
        }
    }
}

//拖放区域限制
function limiteDragArea(o) {
    // 首先获取svg的范围
   /* var b = svg.viewbox();
    var width = b.width,
        height = b.height;

    // 移动区域
    var opt = {
        minX: 0,
        minY: 0,
        maxX: width,
        maxY: height
    };
*/
    // 可拖放，可缩放
    o.draggable();
    return o;
}

// 图形点击可以调整大小
function myResize(o) {

    //定义图形原始位置
    o.move(100, 100) // 图形原始位置

    // 清除所有选中效果
    clearAllSelected();

    // 限制移动范围
        limiteDragArea(o)
            .selectize()
        .resize();   // 可缩放

    // 被点击的图形添加selected属性，标记被选中
    o.addClass('selected')
        .addClass('ele');

    // 为元素添加点击事件
    //selectClickedEle(o);

    // 为元素添加鼠标按下事件
    mousedownOnEle(o);

    // 为元素添加鼠标弹起事件
    //mouseupOnEle(o);
    return o;
}

// 鼠标在元素上被按下
function mousedownOnEle(o) {
    o.mousedown(mousedownOnNonEle);
}

// 鼠标在元素上被弹起
function mouseupOnEle(o) {
    o.mouseup(mouseupOnSVG);
}
// 点击选中
function selectClickedEle(o) {
    o.click(selectClicked(o));
}

// 唯一id  五位
function uuid() {
    return Number(Math.random().toString().substr(2, 5));
}