/*
*  操作工程
* */

// 组态右键
$('body').rightClickMenu(
    {
        items:[
            {
                title : '绑定测点',
                action : bindPoint
            },
            {
                title : '删除元素',
                action : delElement
            },
            {
                title : '复制元素',
                action : copyEles
            },
            {
                title : '修改文本',
                action : modifyText
            },
            {
                title : '组合元素',
                action : groupEles
            },
            {
                title : '取消组合',
                action : unGroupEles
            },
            {
                title : '保存组件',
                action : saveGroup
            },
            {
                title : '置上一层',
                action : layUpper
            },
            {
                title : '置下一层',
                action : layLower
            },
            {
                title : '置顶层',
                action : layTop
            },
            {
                title : '置底层',
                action : layBottom
            },
            {
                title : '右旋90°',
                action : function(){
                    rotate(90);
                }
            },
            {
                title : '右旋45°',
                action : function(){
                    rotate(45);
                }
            },
            {
                title : '右旋30°',
                action : function(){
                    rotate(30);
                }
            },/*,
            {
                title : 'color',
                titleColor:'red',
                tips: 'tips',
                tipsColor:'yellow',
                action:function(){
                    alert('color');
                }
            }*/
        ],
        color:'#AAA',
    },'#svgContainer'
);

// 运行右键菜单
$('.run-rb').rightClickMenu(
    {
        items:[
            {
                title : '实时趋势',
                action : realTimeTrend
            },
            {
                title : '图形详情',
                action : eleDetail
            }
        ],
        color:'#AAA',
    }
);

// 模态框怎么响应，对应不同按钮的id
var eventTarget = {
    newProject : 'newProject',
    newSvg : 'newSvg',
    newComponent : 'newComponent',
    modifyText : 'modifyText'
};

$(function () {

    $('#myModal #myBindPointModal #myBindedPointModal').modal({
        backdrop : false,
        keyboard : false
    });

    // 模态框弹出前执行
    $('#myModal').on('show.bs.modal', function () {

        // 清空模态框内容
        var $modal = $('#modal');
        $modal.empty();
        var val;

        switch (id) {
            case eventTarget.newProject : // 新建工程
                val = '工程名称';
                break;
            case eventTarget.newSvg : // 新建画面
                val = '画面名称';
                break;
            case eventTarget.modifyText : // 新建画面
                val = SVG.select('.selected').get(0).node.innerHTML;
                break;
            case eventTarget.newComponent :
                val = '组件名称';
                break;
        }

        // 重新添加输入框
        var child = $("<input>", {
            type:'text',
            placeholder : val,
            id : 'newInput',
            function:function(){
                $(this).addClass('form-control');
            }
        });
        $modal.append(child);
    });

    // 模态框关闭前执行
    $('#myModal').on('hide.bs.modal', function () {

        if (isConfirmNew) {

            // 获取输入框内容
            var name = $('#newInput').val().trim();
            if (name === '' || name === null) {
                alert('名字不能为空');
                return;
            }
            if (id === 'newProject') {  // 新建工程
                projectName = name;
                // 更新工程列表
                if (!containsObject(vm.projects, projectName)) {

                    var project = {
                        index : vm.projects.length,
                        projectName : projectName
                    };
                    vm.projects.push(project);
                }
                //svg = null;
            } else if (id === 'newSvg') { // 新建画面
                svgName = name;
                svgIndex = vm.svgs.length;
                if (!isSvgExistsInCollection(svgName, projectName)) {
                    // 清空画面
                    if (svg !== null) {
                        svg.clear();
                    }
                    var data = {
                        projectName : projectName,
                        name : svgName,
                        id : 'svg-' + projectName + '-' + svgName + '-' + svgIndex,
                        index : svgIndex
                    };
                    vm.svgs.push(data);
                } else {
                    alert('工程画面已经存在！');
                }
                //newSVG();
            } else if (id === 'modifyText') { // 修改文本
                SVG.select('.selected').get(0).node.innerHTML = name;
            } else {

                var selected = SVG.select('.selected');
                // 解析为json对象
                var json = SVGToJson(selected);

                // 传入服务器
                saveGroupedEle(JSON.stringify(json), name);

                // 更新组件列表
                if (!isComponentExists(name))
                    vm.components.push(name);
            }
        }
        isConfirmNew = false;
    });

    // 判定是否是点击的模态框的确定按钮
    var isConfirmNew = false;

    // 模态框显示前执行
    $('#myBindPointModal').on('show.bs.modal', function () {

        // 清空
        $('#pointName').val(pointName);
        $('#pointDesc').val(pointDesc);
        $('#pointType').val(pointType);
    });

    // 模态框显示前执行
    $('#myBindedPointModal').on('show.bs.modal', function () {

        //
        $('#pointName').val(pointName);
        $('#pointDesc').val(pointDesc);
        $('#pointType').val(pointType);
    });

    // 绑定测点
    $('#myBindPointModal').on('click', function (e) {

        // 删除旧测点
        var clas = selectedEle.classes();
        for (var i = 0; i < clas.length; i++) {
            var cla = clas[i];
            if (cla.indexOf('bind') > -1) {
                selectedEle.removeClass(cla);
                selectedEle.removeClass('bp');
            }
            // no else elements binded with same class with cla
            if (SVG.select("." + cla).length() === 0) {

                delete bindPoints[cla.substr(cla.length - 1)];
            }
        }

        var type = $('#pointType').val().trim();
        var pointName = $('#pointName').val().trim();
        var desc = $('#pointDesc').val().trim();

        if (type !== null && pointName !== null && desc !== null &&
            type !== '' && pointName !== '' && desc !== '') {

            // 绑定测点
            desc += ' ' + type;
            var bp = 'bindPoint_' + pointName;
            selectedEle.addClass(bp);
            selectedEle.addClass('bp');
            if (type === pointTypes.LIQUIDLEVEL) {

                desc += ' ' + SVG.select('.selected').get(0).attr('height');
            }
            selectedEle.data('desc', desc, true);

            // 加入到测点集合
            bindPoints[pointName] = pointName;

            // 关闭模态框
            $('#myBindPointModal').modal('hide');
        }
    });

    // 新建工程和新建画面
    $('#confirmNewPro').click(function () {

        isConfirmNew = true;

        // 关闭模态框
        $('#myModal').modal('hide');
    });

    // 模态框选择框选择时响应
    $('#pointType').change(function () {
        var type = $('#pointType').val();
        switch (type) {
            case pointTypes.NUMBER :
                $('#pointDescLabel')['0'].innerText = '描述';
                $('#pointDesc').val('default');
                break;
            case pointTypes.LIQUIDLEVEL :
                $('#pointDescLabel')['0'].innerText = '量程';
                $('#pointDesc').val('');
                break;
            case pointTypes.SWITCH :
                $('#pointDescLabel')['0'].innerText = '阈值';
                $('#pointDesc').val('');
                break;
        }
    });
});

// 工程名称
var projectName = null;

// 组件名字
var componentName = null;
// 画面名称
var svgName = null;

// 判断时新建工程还是新建画面
var id = null;

// 画面索引
var svgIndex = null;

// 获得工程在集合中的索引
function getProjectIndex(project) {
    if (project === null || typeof project === undefined)
        project = projectName;

    var projects = vm.projects;
    for (var i = 0; i < projects.length; i++) {
        if (project === projects[i]['projectName'])
            return projects[i]['projectId'];
    }
    return -1;
}

// 画面是否存在
function isSvgExistsInCollection(name, pName) {
    var svgs = vm.svgs;
    for (var i = 0; i < svgs.length; i++) {
        if (name === svgs[i]['name'] && pName === svgs[i]['projectName']) {
            return true;
        }
    }

    return false;
}

// 组件是都存在
function isComponentExists(name) {
    var components = vm.components;
    for (var i = 0; i < components.length; i++) {
        if (name === components[i])
            return true;
    }
    return false;
}
// 新建工程
$("#newProject").on("click", newPro);

function newPro(e) {

    // 去除所有选中效果
    clearAllSelected();

    // id 被点击按钮的id
    id = 'newProject';

    // 模态框标题栏
    $('#myModalLabel')[0].innerText = '输入工程名称';

    // 显示模态框
    $('#myModal').modal('show');

    // 在画面元素添加此工程

}

// 新建画面
$("#newSvg").on("click", function (e) {

    // id 被点击按钮的id
    id = eventTarget.newSvg;

    // 去除所有选中效果
    clearAllSelected();
    // 模态框标题栏
    $('#myModalLabel')[0].innerText = '输入画面名称';

    if (projectName === null) {
        alert('未创建工程，无法新建画面');
        return;
    } else {
        $('#myModal').modal('show');
    }
});

// 更新工程列表和画面列表
function updateColletion() {
    var data = {
        projectName : projectName,
        name : svgName,
        projectIndex : getProjectIndex(projectName),
        svgIndex : svgIndex
    };

    // ajax请求
    ajaxOption(host + urls.addProject,
        'post',
        JSON.stringify(data),
        function (res) {
            if (res['success']) {
                // 更新本地
                /*if (!containsObject(vm.projects, projectName))
                    vm.projects.push(projectName);
                vm.svgs.push(data);*/
                //console.log("更新列表成功");

                // 保存画面
                saveSvg();
            } else {
                if ('login' === JSON.parse(res['data'])['token']) {
                    location = JSON.parse(res['data'])['location'];
                    return;
                }
                alert("更新列表时，服务器出错，无法保存！")
            }
        }, function (err) {
            alert("更新列表出错，无法保存！");
        },
        function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
        }
        );
}

// 数组中是否包含某元素
function containsObject(array, o) {
    for (var i = 0; i < array.length; i++) {
        if (o === array[i]['projectName'])
            return true;
    }
    return false;
}

function saveSvg() {
// 导出之前清除选中状态
    clearAllSelected();

    var eles = SVG.select('.ele');
    /*SVGToJson(eles);*/

    var svgString = JSON.stringify(SVGToJson(eles));
    // 需要导出的数据都在 data 里面，存入redis里面的数据格式为： projectName_svgName : svg
    var data = {
        projectName: projectName,
        svgName: svgName,
        index: svgIndex,
        svg: svgString
    };

    // 上传到服务器
    // ajax请求

    ajaxOption(host + urls.exportProject,
        'post',
        JSON.stringify(data),
        function (res) {
            sessionStorage.setItem('svg-' + projectName + '-' +
                svgName + '-' + svgIndex,
                svgString);
            alert("保存成功！");
        }, function (res) {
            alert("保存出错！")
        },
        function (xhr) {
            xhr.setRequestHeader('Authorization',
                'Basic ' + localStorage.getItem("token"));
        });
}

// 保存工程 提交给服务器
$('#exportProject').on('click', function () {
    if (svgName === null || projectName === null) {
        return;
    }

    // 更新工程列表和画面列表
    updateColletion();
});

// 将svg字符串转为json对象
function SVGToJson(eles) {
    var json = {};
    for (var i = 0; i < eles.length(); i++) {
        var ele = eles.get(i);
        var attrs = ele.attr();
        var eleName = ele.node.nodeName.toLocaleLowerCase();
        attrs['id'] = 'Svgjs' + eleName + uuid();
        var id = eleName + '#' + attrs['id'];
        var data = {};
        for (var key in attrs) {
            data[key] = attrs[key];
        }
        if ('text' === eleName) {
            data['text'] = ele.node.innerHTML;
        } else if (hasClass(ele.classes(), 'grouparent')) {

            // 如果是组合元素， 则调用groupedChildrenToJson
            // 将被组合元素转为json对象并作为children的值
            data['children'] = groupedChildrenToJson(ele.children());
        }
        json[id] = data;
    }
    return json;
}

// 记录有gradient修饰的图形
var gradientId = [];

// 将json对象拼接为svg字符串
function jsonToSVGAsString(json) {
    var svgString = '';

    // 遍历json对象
    for (var key in json) {
        var type = key.split('#')[0];
        svgString += '<' + type + ' ';
        var value = json[key];

        // 是否是文本元素， true的话添加元素的innerHTML为text对应的值
        var hasTextAttr = false;
        for (var attr in value) {
            if ('text' === attr) {

                // text 不是属性， 标识文本元素
                hasTextAttr = true;
                continue;
            } else if ('children' === attr)

                // children不是属性，标识组合元素
                continue;
            else if ('fill' === attr) {
                var fill = value[attr];

                // 记录有渐变效果元素的id，之后单独渲染
                if (fill.indexOf('url') > -1) {
                    gradientId[gradientId.length] = value['id'];
                }
            }
            svgString += attr + '=' + '\"' + value[attr] + '\" ';
        }

        svgString += '>';
        if (hasTextAttr)
            svgString += value['text'];
        else if ('g' === type) {
            svgString += jsonToSVGAsString(json[key]['children']);
        }
        svgString += '</' + type + '>';
        hasTextAttr = false;
    }

    return svgString;
}

// 将组合中的各元素解析成json
function groupedChildrenToJson(eles) {
    var json = {};
    for (var i = 0; i < eles.length; i++) {
        var ele = eles[i];
        var attrs = ele.attr();
        var eleName = ele.node.nodeName.toLocaleLowerCase();
        attrs['id'] = 'Svgjs' + eleName + uuid();
        var id = eleName + '#' + attrs['id'];
        var data = {};
        for (var key in attrs) {
            data[key] = attrs[key];
        }
        if ('text' === eleName) {
            data['text'] = ele.node.innerHTML;
        } else if (hasClass(ele.classes(), 'grouparent')) {

            data['children'] = groupedChildrenToJson(ele.children());
        }
        json[id] = data;
    }
    return json;
}

// 获得所有图形
function getAllElesAsString() {
    var eles = SVG.select('.ele');
    var o = '';
    for (var i = 0; i < eles.length(); i++) {
        var ele = eles.get(i);
        o += ele.svg();
    }
    return o;
}

// 导入工程， 向服务器请求
$('#importProject').on('click', function () {
    if (projectName !== null) {
        var data = {
            "projectName" : projectName,
            "svgName" : svgName,
            "svg" : ""
        };
        $.ajaxSetup({
            contentType : 'application/json; charset=utf-8',
            Authorization : sessionStorage.getItem("token")
        });
        $.post(host + urls.importProject,
            JSON.stringify(data),
            function (res) {
            generateSVG(JSON.parse(res['data']));
        });
    } else {
        alert('工程未建立，无法导入');
    }
});

function addMouseDownEventOnEle() {
    var eles = getAllEles();
    for (var i = 0; i < eles.length(); i++) {
        var ele = eles.get(i);
        mousedownOnEle(ele);
    }
}

function getGradient() {
    if (svg !== null) {
        var gradient = svg.gradient('linear', function(stop) {
            stop.at(0, 'gray')
            stop.at(0.8, 'white')
            stop.at(1, 'gray')
        });
        return gradient;
    }
}

// 生成svg
function generateSVG(data) {

    svg.clear();
    if (data === null) {
        alert("返回空画面");
        return;
    }
    bindPoints = {};
    // svg 放入sessionStorage
    sessionStorage.setItem('svg-' + projectName +
        '-' + svgName + '-' + svgIndex,
        JSON.stringify(data));

    // 生成svg
    var svgString = jsonToSVGAsString(data);
    svg.svg(svgString);

    // 将导入的测点加入测点集合
    addToBindPoints();

    // 如果gradient 则加入
    for (var i = 0; i < gradientId.length; i++) {
        var id = gradientId[i];
        var ele = SVG.select('#' + id);
        if (ele.length() === 1) {
            ele.get(0).fill(getGradient());
        }
    }
    gradientId = [];

    // 为各元素添加鼠标按下事件， 鼠标按下事件不能通过svg来添加
    //addMouseDownEventOnEle();
}

// 将导入的测点加入测点集合
function addToBindPoints() {
    // 如果没有下面函数的调用则会在执行SVG.select('.bp');的时候出错，具体原因不详
    getAllEles();
    // 绑定测点的元素 $("[class^='class_']")
    var eles;
    try {
        eles = SVG.select('.bp');
    } catch (e) {
        eles = SVG.select('.bp');
    }
    for (var i = 0; i < eles.length(); i++) {
        var ele = eles.get(i);

        var clas = ele.classes();
        for (var j = 0; j < clas.length; j++) {
            var cla = clas[j];
            if (cla.indexOf('bindPoint') > -1) {
                var index = cla.indexOf('_');
                var pointName = cla.substr(index + 1);
                bindPoints[pointName] = pointName;
            }
        }
    }

    if (ws !== null && ws.readyState === 1) {

        var data = '';
        for (var key in bindPoints) {
            data += key + ',';
        }
        ws.send(data);
    }
}

// 导出SVG
$('#exportSVG').on('click', function () {

    var eles = SVG.select('.ele');
    var data;
    for (var i = 0; i < eles.length(); i++) {
        var ele = eles.get(i);
        data = ele.svg();
        //
        console.log(data)
    }

});

// 导入SVG
$('#importSVG').on('click', function () {
    if (svg !== null) {

    } else {
        alert('工程未建立，无法导入');
    }
});

// 新建画面
function newSVG() {

    // 新建svg元素
    svg = SVG("svgContainer")
        .size("100%", "100%");

    // 为svg添加点击事件， 点击非图形元素时取消选中效果, 点击图形元素被选中
    svg.click(clickNonEleToClear);

    //svg 添加鼠标按下事件
    svg.mousedown(mousedownOnNonEle);

    //svg 添加鼠标弹起事件
    svg.mouseup(mouseupOnSVG);

    //svg 添加鼠标移动事件
    svg.mousemove(mouseoverOnSVG);

    return svg;
}

/*
*  操作图形
* */

// 清除工程元素
$("#clearElements").on("click", function () {
    if (svg !== null) {
        svg.clear();
    }
});

// 保存组件, 组件需要被选中
$('#saveGroup').on('click', saveGroup);

// 保存组件
function saveGroupedEle(json, name) {

    var data = {
        groupName : name,
        data : json
    };

    sessionStorage.setItem('group-' + name, json);

    // ajax请求
    ajaxOption(host + urls.saveGroupedEle, 'post', JSON.stringify(data), null, null,
        function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
        });

}

// 选中删除元素
$("#deleteEle").on("click", delElement);

// 从测点集合中删除测点
function deleteFromBindPoint(o) {
    var clas = o.classes();
    for (var j = 0; j < clas.length; j++) {
        var cla = clas[j];
        if (cla === 'grouparent') {

            // 若是组合元素，则对组合中的元素递归调用
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
$('#groupEle').on('click', groupEles);

// 取消组合
$("#unGroup").on('click', unGroupEles);

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
$('#backLayer').on('click', layBottom);

function layBottom() {

    // 只有一个图形被选中才能够置底层
    var eles = SVG.select('.selected');
    if (eles.length() === 1) {

        // 清除选中状态
        clearAllSelected();
        eles.get(0).back();
    }
}

// 图形置向下一层
$('#backwardLayer').on('click', layLower);

// 图形置最顶层
$('#frontLayer').on('click', layTop);

function layTop() {

    // 只有一个图形被选中才能够置顶层
    var eles = SVG.select('.selected');
    if (eles.length() === 1) {

        // 清除选中状态
        clearAllSelected();
        eles.get(0).front();
    }
}

// 图形置向上一层
$('#forwardLayer').on('click', layUpper);

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
$('#bindPoint').on('click', bindPoint);

// websocket实例
var ws = null;

// 测点集合
var bindPoints = {};

function createNewWS(url) {
    return new WebSocket(url);
}

// 测点类型
var pointTypes = {
    NUMBER: 'number',
    LIQUIDLEVEL: 'liquidLevel',
    SWITCH: 'switch'
};

// 运行
$('#point').on('click', monitoring);

function monitoring() {
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
            var url = 'ws://172.21.18.212/zutai/dev/myHandler';
            ws = createNewWS(url);
        }

        ws.onopen = function (req) {
            // 发送所有测点
            //req.setHeader("Authorization", localStorage.getItem("token"));
            ws.send(data);
            // Web Socket 已连接上，使用 send() 方法发送数据
            console.log("数据已发送");
        };

        ws.onmessage = function (evt) {
            var received_msg = JSON.parse(evt.data);
            localStorage.setItem('received_msg', JSON.stringify(received_msg));
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
            //console.log("数据已接收 : " + received_msg);
        };

        ws.onclose = function () {
            if (ws !== null)
                ws.close();
            console.log("连接已关闭...");
        };
    } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
    }
}

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
    o.node.innerHTML = data;
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

// 复制元素
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
        temp.dmove(20, 20);
        ele.selectize(false);
        ele.removeClass('selected');
        temp.selectize().draggable();
        mousedownOnEle(temp);
    }
});

// 修改文本
$('#modifyText').on('click', modifyText);

// 左对齐
$('#alignLeft').on('click', alignLeft);

function alignLeft() {

    let eles = SVG.select('.selected');
    if (eles.length() > 1) {
        let left = eles.get(0);
        // 找出最左边的元素
        for (let i = 1; i < eles.length(); i++) {
            let temp = eles.get(i);
            if (temp.x() < left.x()) {
                left = temp;
            }
        }

        // 对齐
        for (let i = 0; i < eles.length(); i++) {
            let ele = eles.get(i);
            if (left !== ele) {
                ele.y(left.y());
            }
        }
    }
}

// 右对齐
$('#alignRight').on('click', alignRight);

function alignRight() {
    let eles = SVG.select('.selected');
    if (eles.length() > 1) {
        let left = eles.get(0);

        // 找出最右边的元素
        for (let i = 1; i < eles.length(); i++) {
            let temp = eles.get(i);
            if (temp.x() > left.x()) {
                left = temp;
            }
        }

        // 对齐
        for (let i = 0; i < eles.length(); i++) {
            let ele = eles.get(i);
            if (left !== ele) {
                ele.y(left.y());
            }
        }
    }
}

// 上对齐
$('#alignTop').on('click', alignTop);

function alignTop() {
    let eles = SVG.select('.selected');
    if (eles.length() > 1) {
        let left = eles.get(0);

        // 找出最右边的元素
        for (let i = 1; i < eles.length(); i++) {
            let temp = eles.get(i);
            if (temp.y() < left.y()) {
                left = temp;
            }
        }

        // 对齐
        for (let i = 0; i < eles.length(); i++) {
            let ele = eles.get(i);
            if (left !== ele) {
                ele.x(left.x());
            }
        }
    }
}

// 下对齐
$('#alignBottom').on('click', alignBottom);

function alignBottom() {
    let eles = SVG.select('.selected');
    if (eles.length() > 1) {
        let left = eles.get(0);

        // 找出最右边的元素
        for (let i = 1; i < eles.length(); i++) {
            let temp = eles.get(i);
            if (temp.y() > left.y()) {
                left = temp;
            }
        }

        // 对齐
        for (let i = 0; i < eles.length(); i++) {
            let ele = eles.get(i);
            if (left !== ele) {
                ele.x(left.x());
            }
        }
    }
}

// 实时趋势
$('#realTimeTrend').on('click', realTimeTrend);

// 删除画面
$('#deleteSvg').on('click', function () {

    // 从数据库中删除
    deleteFromDB();
});

// 从数据库中删除
function deleteFromDB() {
    var data = {
        projectName : projectName,
        svgIndex : svgIndex,
        name : svgName
    };

    // ajax请求
    ajaxOption(host + urls.deleteSvg, 'post',
        JSON.stringify(data),
        function (res) {
            if (res['success']) {
                alert("画面删除成功！");
                var jsonDatas = vm.svgs;
                var index = -1;
                for (var i = 0; i < jsonDatas.length; i++) {
                    var jsonData = jsonDatas[i];

                    if (jsonData['projectName'] === projectName &&
                        jsonData['name'] === svgName) {
                        index = i;
                        break;
                    }
                }

                if (-1 !== index) {
                    vm.svgs.splice(index, 1);
                }
                if (vm.svgs.length !== 0) {
                    var first = vm.svgs[0];
                    projectName = first['projectName'];
                    svgName = first['name'];
                    svgIndex = first['index'];
                    var id = first['id'];
                    let item = sessionStorage.getItem(id);
                    //尝试从sessionStorage获取， 没有则从服务器获取
                    if (typeof item !== "undefined" && item !== '' && null !== item) {
                        generateSVG(JSON.parse(item));
                    } else {
                        uri = urls.importProject;

                        // 从服务器获取，同时存入sessionStorage
                        getSvg(uri);
                    }
                }
            } else {
                alert("服务器出错！")
            }
        },
        function () {
            alert("画面删除失败！")
        },
        function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
        })
}

// 绑定测点
function bindPoint() {

    var eles = SVG.select('.selected');
    if (eles.length() === 1) {
        selectedEle = eles.get(0);
        pointName = getPointName(selectedEle);

        if (pointName !== null && pointName !== '') {

            var descs = selectedEle.data('desc').split(' ');
            pointType = descs[1];
            pointDesc = descs[0];

        } else {
            pointName = '';
            pointType = '';
            pointDesc = '';
        }
        // show 模态框
        $('#myBindPointModal').modal('show');
    }
}

/* 删除选中元素*/
function delElement() {
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
}

/* 复制元素 */
function copyEles() {
    if (svg === null) {
        return;
    }

    var eles = SVG.select('.selected');
    for (var i = 0; i < eles.length(); i++) {
        var ele = eles.get(i);
        var x = ele.x();
        var y = ele.y();
        var  temp = ele.clone();
        temp.dmove(20, 20);
        ele.selectize(false);
        ele.removeClass('selected');
        temp.selectize().draggable();
        mousedownOnEle(temp);
    }
}

// 组合元素
function groupEles() {

    var group = svg.group();
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
        group.addClass('selected')
            .addClass('grouparent')
            .addClass('ele');
    }
}

// 修改文本
function modifyText() {

    if (svgName === null || projectName === null) {
        return;
    }

    var eles = SVG.select('.selected');
    if (eles.length() === 1) {
        $('#myModalLabel')[0].innerHeight = '修改文本';
        id = 'modifyText';
        $('#myModal').modal('show');
    }
}

// 取消组合
function unGroupEles() {
    if (svg !== null || SVG.select('.selected').length() === 1) {

        // 获得组合选中的组合元素
        let ele = SVG.select('.selected').get(0);
        clearAllSelected();

        // 得到组合父元素的移动距离
        let children = ele.children();
        var r = ele.node.getAttribute('transform'),
            s = r.split(',');
        let dx = parseInt(s[s.length - 2]);
        let dy = parseInt(s[s.length - 1].split(')')[0]);
        // 取消组合
        if (hasClass(ele.classes(), 'grouparent')) {
            ele.ungroup(svg)
        }

        // 被组合的元素添加响应事件
        for (let i = 0; i < children.length; i++) {
            var child = children[i];
            child.removeClass('groupEle')
                .addClass('ele')
                .draggable();

            // 取消组合后， 元素位置移动到当前位置
            child.attr('transform', null);
            child.move(child.x() + dx,child.y() + dy);
        }
        // 删除组合父元素
        ele.remove();
    }
}

function getPointName(ele) {

    var point = null;
    var clas = ele.classes();

    for (var i = 0; i < clas.length; i++) {
        var cla = clas[i];
        if (cla.indexOf('bindPoint') > -1) {
            var index = cla.indexOf('_');
            point = cla.substr(index + 1);
            break;
        }
    }

    return point;
}

//实时趋势
function realTimeTrend() {

    var ele = SVG.select('.selected');

    // 只能选中一个
    if (ele.length() === 1) {
        ele = ele.get(0);
        var point = getPointName(ele);

        // 打开实时趋势选项卡
        if (point !== null && point !== '') {
            window.open('http://172.21.18.212/realTimeTrend.html?key=' + point + '&');
        } else {
            alert('图形未绑定测点！');
        }
    }
}

// 保存组件
function saveGroup() {
    if (svg !== null) {
        var selected = SVG.select('.selected');
        if (selected.length() === 1) {
            // 只有一个组合元素被选中
            var group = selected.get(0);
            if ('g' !== group.type) {
                alert('单个元素无需保存！');
            } else {
                $('#myModalLabel')[0].innerHTML = '组件名称';
                id = 'newComponent';
                $('#myModal').modal('show');
            }
        } else if (selected.length() === 0) {
            alert('请选择需要导出的组件！');
        } else {
            alert('请选择一个需要导出的组件！');
        }
    }
}

// 置上一层
function layUpper() {

    // 只有一个图形被选中才能够置向上一层
    var eles = SVG.select('.selected');
    if (eles.length() === 1) {

        // 清除选中状态
        clearAllSelected();
        eles.get(0).forward();
    }
}

// 置下一层
function layLower() {

    // 只有一个图形被选中才能够置向下一层
    var eles = SVG.select('.selected');
    if (eles.length() === 1) {

        // 清除选中状态
        clearAllSelected();
        eles.get(0).backward();
    }
}

// 测点类型
var pointType = null;

// 测点名
var pointName = null;

// 测点描述
var pointDesc = null;

// 图形详情
function eleDetail(){

    var ele = SVG.select('.selected');

    // 只能选中一个
    if (ele.length() === 1) {
        ele = ele.get(0);
        pointName = getPointName(ele);

        if (pointName !== null && pointName !== '') {

            var descs = ele.data('desc').split(' ');
            pointType = descs[1];
            pointDesc = descs[0];
            // 打开绑定测点模态框
            $('#myBindedPointModal').modal('show');

        } else {
            alert('图形未绑定测点！');
        }
    }
}

var cw = -1;

function svgZoom() {
    var cwn = $('#svgContainer')[0].clientWidth;
    var ratio = 1;
    if (cw !== -1) {
        ratio = cwn / cw;
    }
    return ratio;
}