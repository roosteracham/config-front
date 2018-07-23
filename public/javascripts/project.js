/*
*  操作工程
* */

// 模态框怎么响应，对应不同按钮的id
var eventTarget = {
    newProject : 'newProject',
    newSvg : 'newSvg',
    newComponent : 'newComponent',
    modifyText : 'modifyText'
};

$(function () {

    $('#myModal #myBindPointModal').modal({
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

    // 判定是否是点击的模态框的确定按钮
    var isConfirmNew = false;

    // 模态框显示前执行
    $('#myBindPointModal').on('show.bs.modal', function () {

        // 清空
        $('#pointName').val('');
        $('#pointDesc').val('');
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
                let json = SVGToJson(selected);

                // 传入服务器
                saveGroupedEle(JSON.stringify(json), name);

                // 更新组件列表
                if (!isComponentExists(name))
                    vm.components.push(name);
            }
        }
        isConfirmNew = false;
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
    for (let i = 0; i < projects.length; i++) {
        if (project === projects[i]['projectName'])
            return projects[i]['index'];
    }
    return -1;
}

// 画面是否存在
function isSvgExistsInCollection(name, pName) {
    var svgs = vm.svgs;
    for (let i = 0; i < svgs.length; i++) {
        if (name === svgs[i]['name'] && pName === svgs[i]['projectName']) {
            return true;
        }
    }

    return false;
}

// 组件是都存在
function isComponentExists(name) {
    var components = vm.components;
    for (let i = 0; i < components.length; i++) {
        if (name === components[i])
            return true;
    }
    return false;
}
// 新建工程
$("#newProject").on("click", function (e) {

    // 去除所有选中效果
    clearAllSelected();

    // id 被点击按钮的id
    id = e.target.id;

    // 模态框标题栏
    $('#myModalLabel')[0].innerText = '输入工程名称';

    // 显示模态框
    $('#myModal').modal('show');

    // 在画面元素添加此工程

});

// 新建画面
$("#newSvg").on("click", function (e) {

    // id 被点击按钮的id
    id = e.target.id;

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

    ajaxOption(host + urls.addProject,
        'post',
        JSON.stringify(data),
        function (res) {
            if (res['success']) {
                // 更新本地
                /*if (!containsObject(vm.projects, projectName))
                    vm.projects.push(projectName);
                vm.svgs.push(data);*/
                console.log(res['success']);
            }
        }, function (err) {
            console.log(err);
        }
        );
}

// 数组中是否包含某元素
function containsObject(array, o) {
    for (let i = 0; i < array.length; i++) {
        if (o === array[i]['projectName'])
            return true;
    }
    return false;
}

// 保存工程 提交给服务器
$('#exportProject').on('click', function () {
    if (svgName === null || projectName === null) {
        return;
    }

    // 更新工程列表和画面列表
    updateColletion();

    // 导出之前清除选中状态
    clearAllSelected();

    var eles = SVG.select('.ele');
    /*SVGToJson(eles);*/

    var svgString = JSON.stringify(SVGToJson(eles));
    // 需要导出的数据都在 data 里面，存入redis里面的数据格式为： projectName_svgName : svg
    var data = {
        projectName : projectName,
        svgName : svgName,
        index : svgIndex,
        svg : svgString
    };

    // 上传到服务器
    ajaxOption(host + urls.exportProject, 
        'post', 
        JSON.stringify(data),
        function (res) {
        sessionStorage.setItem('svg-' + projectName + '-' +
        svgName + '-' + svgIndex,
            svgString);
            console.log(res['success']);
        }, function (res) {
            console.log(res['success']);
        });
});

// 将svg字符串转为json对象
function SVGToJson(eles) {
    var json = {};
    for (let i = 0; i < eles.length(); i++) {
        let ele = eles.get(i);
        let attrs = ele.attr();
        let eleName = ele.node.nodeName.toLocaleLowerCase();
        attrs['id'] = 'Svgjs' + eleName + uuid();
        var id = eleName + '#' + attrs['id'];
        let data = {};
        for (let key in attrs) {
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
    let svgString = '';

    // 遍历json对象
    for (let key in json) {
        let type = key.split('#')[0];
        svgString += '<' + type + ' ';
        var value = json[key];

        // 是否是文本元素， true的话添加元素的innerHTML为text对应的值
        let hasTextAttr = false;
        for (let attr in value) {
            if ('text' === attr) {

                // text 不是属性， 标识文本元素
                hasTextAttr = true;
                continue;
            } else if ('children' === attr)

                // children不是属性，标识组合元素
                continue;
            else if ('fill' === attr) {
                let fill = value[attr];

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
    for (let i = 0; i < eles.length; i++) {
        let ele = eles[i];
        let attrs = ele.attr();
        let eleName = ele.node.nodeName.toLocaleLowerCase();
        attrs['id'] = 'Svgjs' + eleName + uuid();
        var id = eleName + '#' + attrs['id'];
        let data = {};
        for (let key in attrs) {
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
        $.ajaxSetup({contentType : 'application/json; charset=utf-8'});
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
    let eles = getAllEles();
    for (let i = 0; i < eles.length(); i++) {
        let ele = eles.get(i);
        mousedownOnEle(ele);
    }
}

// 生成svg
function generateSVG(data) {

    svg.clear();
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
    for (let i = 0; i < gradientId.length; i++) {
        var id = gradientId[i];
        var ele = SVG.select('#' + id);
        if (ele.length() === 1) {
            ele.get(0).fill(getGradient());
        }
    }
    gradientId = [];

    // 为各元素添加鼠标按下事件， 鼠标按下事件不能通过svg来添加
    addMouseDownEventOnEle();
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
        svg = SVG("svgContainer").size("100%", "100%");
        // 为svg添加点击事件， 点击非图形元素时取消选中效果
        svg.click(clickNonEleToClear);

        //svg 添加鼠标按下事件
        svg.mousedown(mousedownOnNonEle);

        //svg 添加鼠标弹起事件
        svg.mouseup(mouseupOnSVG);

        //svg 添加鼠标移动事件
        svg.mousemove(mouseoverOnSVG);

        // 放到sessionStorage 里面
        //loc
    return svg;
}