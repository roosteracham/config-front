/*
*  操作图形
* */

// 清除工程元素
$("#clearElements").on("click", function () {
    if (svg !== null) {
        svg.clear();
    }
});

// 选中删除元素
$("#deleteEle").on("click", function () {
    var del = SVG.select('.selected');
    for (var i = 0; i < del.length(); i++) {
        var o = del.get(i);
        if (isSVGElementByClass(o)) {
            o.selectize(false)
                .resize('stop');

            // 如果没有其他关联相同测点的图形，则把测点从测点集合中删除
            deleteFromBindPoint(o);

            // 删除图形
            o.remove();
        }
    }

});

// 从测点集合中删除测点
function deleteFromBindPoint(o) {
    var clas = o.classes();
    for (var j = 0; j < clas.length; j++) {
        var cla = clas[j];
        if (cla === 'grouparent') {
            var children = o.children();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.hasClass('bp')) {
                    deleteFromBindPoint(child);
                }
            }
        } else if (cla.indexOf('bindPoint') > -1) {

            // no else elements binded with same class with cla
            if (SVG.select("." + cla).length() === 1) {

                delete bindPoints[cla.substr(cla.length - 1)];
            }
        }
    }
}

//组合元素
$('#groupEle').on('click', function () {

    var group = svg.group()
        .addClass('grouparent')
        .addClass('ele');
    var eles = SVG.select('.selected');
    if (eles.length() > 1) {
        for (var i = 0; i < eles.length(); i++) {

            var ele = eles.get(i);
            ele.draggable(false)
                .selectize(false)
                //.resize('stop')
                .addClass('groupEle')
                .removeClass('ele')
                .removeClass('selected');
            group.add(ele);
        }
        group.selectize()
            .resize()
            .draggable();
    }
});

//旋转元素
function rotate(arc) {
    var del = SVG.select('.selected');
    for (var i = 0; i < del.length(); i++) {
        var o = del.get(i);
        if (isSvgElement(o.node.nodeName)) {
            o.transform({
                rotation: arc, // 旋转角度
                relative: true // 相对当前位置旋转
            });
            limiteDragArea(o);
        }
    }
}

// 旋转
// 左旋90度
$("#rotateLeft_90").on("click", function () {
    rotate(-90);
});

// 右旋90度
$("#rotateRight_90").on("click", function () {
    rotate(90);
});

// 左旋45度
$("#rotateLeft_45").on("click", function () {
    rotate(-45);
});

// 右旋45度
$("#rotateRight_45").on("click", function () {
    rotate(45);
});

// 左旋30度
$("#rotateLeft_30").on("click", function () {
    rotate(-30);
});

// 右旋30度
$("#rotateRight_30").on("click", function () {
    rotate(30);
});

// 图形层次变换
// 图形置最底层
$('#backLayer').on('click', function () {

    // 只有一个图形被选中才能够置底层
    var eles = SVG.select('.selected');
    if (eles.length() === 1) {

        // 清除选中状态
        clearAllSelected();
        eles.get(0).back();
    }
});

// 图形置向下一层
$('#backwardLayer').on('click', function () {

    // 只有一个图形被选中才能够置向下一层
    var eles = SVG.select('.selected');
    if (eles.length() === 1) {

        // 清除选中状态
        clearAllSelected();
        eles.get(0).backward();
    }
});

// 图形置最顶层
$('#frontLayer').on('click', function () {

    // 只有一个图形被选中才能够置顶层
    var eles = SVG.select('.selected');
    if (eles.length() === 1) {

        // 清除选中状态
        clearAllSelected();
        eles.get(0).front();
    }
});

// 图形置向上一层
$('#forwardLayer').on('click', function () {

    // 只有一个图形被选中才能够置向上一层
    var eles = SVG.select('.selected');
    if (eles.length() === 1) {

        // 清除选中状态
        clearAllSelected();
        eles.get(0).forward();
    }
});

// 改变颜色,弹出颜色选择器
$('#changeColor').on('click', function (e) {
    document.getElementById('colorPicker').jscolor.show()
});

// 改变图形的颜色， 修改fill属性
$('#colorPicker').on('change', function () {
    var c = '#' + document.getElementById('colorPicker').value;
    // 只有一个图形被选中才能够置向上一层
    var eles = SVG.select('.selected');
    if (eles.length() === 1) {
        eles.get(0).fill(c);
    }
});

// 保存
var selectedEle = null;

// 绑定测点
$('#bindPoint').on('click', function () {

    var eles = SVG.select('.selected');
    if (eles.length() === 1) {
        selectedEle = eles.get(0);
    }

    // show 模态框
    $('#myBindPointModal').modal('show');
});

// websocket实例
var ws = null;

// 测点类型
var pointTypes = {
    NUMBER: 'number',
    LIQUIDLEVEL: 'liquidLevel',
    SWITCH: 'switch'
};

// 运行
$('#point').on('click', function () {
    //
    var data = '';
    for (var key in bindPoints) {
        data += key + ',';
    }
    if ("WebSocket" in window) {
        console.log("您的浏览器支持 WebSocket!");

        // 绑定测点的元素 $("[class^='class_']")
        //var eles = SVG.select("[class^='.bindPoint_']");

        if (ws === null) {
            var url = 'ws://localhost:8888/websocket';
            ws = createNewWS(url);
        }

        // ws.send("发送数据");
        //var ele = eles.get(0);
        //console.log(ele.data('pointName'), ele.data('type') , ele.data('value'))
        ws.onopen = function () {
            // 发送所有测点
            ws.send(data);
            // Web Socket 已连接上，使用 send() 方法发送数据
            console.log("数据发送中...");
        };

        ws.onmessage = function (evt) {
            var received_msg = JSON.parse(evt.data);
            //ele.node.firstChild.textContent = received_msg;

            // 更新绑定该测点的所有图形
            for (var key in received_msg) {

                // 测点数据
                var d = received_msg[key];

                // 选择绑定该测点的所有图形
                var cla = '.bindPoint_' + key;
                var eles = SVG.select(cla);

                // 更新图形
                for (var i = 0; i < eles.length(); i++) {
                    var ele = eles.get(i);
                    updateDataOnEle(ele, d);
                }
            }
            // 更新图形
            console.log("数据已接收 : " + received_msg);
        };

        ws.onclose = function () {
            ws.close();
            console.log("连接已关闭...");
        };
    } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
    }
});

$('#stop').on('click', function () {
    if (ws !== null) {
        ws.close();
        ws = null;
    }
});

// 更新数据
function updateDataOnEle(o, data) {
    var descs = o.data('desc').split(' ');
    var type = descs[1];
    switch (type) {
        case pointTypes.NUMBER:
            updateNumber(o, data);
            break;
        case pointTypes.LIQUIDLEVEL:
            UpdateLiquidLevel(o, data);
            break;
        case pointTypes.SWITCH:
            updateSwitch(o, data);
            break;
    }
}
// 更新数字
function updateNumber(o, data) {
    if (o.node.nodeName === 'text') {
        updateText(o, data);
    }
}

// 更新液位
function UpdateLiquidLevel(o, data) {
    updateRect(o, data);
}

// 文本变化
function updateText(o, data) {
    o.node.firstChild.textContent = data;
}

// 矩形变化
function updateRect(o, data) {
    var s = o.data('desc').split(' ');
    var desc = s[0]; // 最大值
    var maxHeight = s[2]; // 最大高度
    var nHeight = o.attr('height'); // 当前高度
    var height = data / desc * maxHeight;
    o.attr('height', height);
    o.dy(nHeight - height);
}

// 更新开关
function updateSwitch(o, data) {

    var thresh = parseInt(o.data('desc').split(' ')[0]);
    if (parseInt(data) < thresh) {
        o.fill('green');
    } else {
        o.fill('red');
    }
}

$('#copyEle').on('click', function () {
   if (svg === null) {
       return;
   }

   var eles = SVG.select('.selected');
   for (var i = 0; i < eles.length(); i++) {
       var ele = eles.get(i);
       var x = ele.x();
       var y = ele.y();
       var  temp = ele.clone();
       temp.move(100, 100);
       ele.selectize(false);
   }
});

$('#modifyText').on('click', function () {

    if (svg === null) {
        return;
    }

    var eles = SVG.select('.selected');
    if (eles.length() === 1) {
        $('#myModalLabel')[0].innerHeight = '修稿文本';
        id = 'modifyText';
        $('#myModal').modal('show');
    }
})