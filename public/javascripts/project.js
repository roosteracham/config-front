/*
*  操作工程
* */

// 模态框怎么响应，对应不同按钮的id
var eventTarget = {
    newProject : 'newProject',
    newSvg : 'newSvg',
    bindPoint : 'bindPoint',
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
                val = '工程画面';
                break;
            case eventTarget.modifyText : // 新建画面
                val = SVG.select('.selected').get(0).node.firstChild.innerHTML;
                break;
        }

        // 重新添加输入框
        var child = $("<input>", {
            type:'text',
            val : val,
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
            var name = $('#newInput').val(); //this.childNodes[1].childNodes[1].childNodes[3].childNodes[0].value;
            if (id === 'newProject') {  // 新建工程
                projectName = name;
                clearAllSelected();
                svg = null;
            } else if (id === 'newSvg') { // 新建画面
                    svgName = name;
                    newSVG();
            } else if (id === 'modifyText') {
                SVG.select('.selected').get(0).node.firstChild.innerHTML = name;
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
        var type = $('#pointType').val();
        var pointName = $('#pointName').val();
        var desc = $('#pointDesc').val();

        if (type !== null && pointName !== null && desc !== null &&
            type !== '' && pointName !== '' && desc !== '') {

            /*var point = {
                pointName : pointName,
                type : type,
                value : -1
            };*/

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

// 画面名称
var svgName = null;

// 判断时新建工程还是新建画面
var id = null;

// 新建工程
$("#newProject").on("click", function (e) {

    // id 被点击按钮的id
    id = e.target.id;

    // 模态框标题栏
    $('#myModalLabel')[0].innerText = '输入工程名称';

    // 显示模态框
    $('#myModal').modal('show');
});

// 新建画面
$("#newSvg").on("click", function (e) {

    // id 被点击按钮的id
    id = e.target.id;

    // 模态框标题栏
    $('#myModalLabel')[0].innerText = '输入画面名称';

    if (projectName === null) {
        alert('未创建工程，无法新建画面');
        return;
    } else {
        $('#myModal').modal('show');
    }
});

// 清除工程
$("#deletesvg").on("click", function () {
    svg.clear();
    svg = null;
    $("#svgContainer svg").remove();
    svgName = null;
    bindPoints = {};
});

// 保存工程 提交给服务器
$('#exportProject').on('click', function () {
    if (svgName === null || projectName === null) {
        return;
    }
    // 导出之前清除选中状态
    clearAllSelected();

    var eles = SVG.select('.ele');
    /*SVGToJson(eles);*/
    // 需要导出的数据都在 data 里面
    var data = {
        "projectName" : projectName,
        "svgName" : svgName,
        "svg" : JSON.stringify(SVGToJson(eles))
    };

    // 上传到服务器
    ajaxOption(host + urls.exportProject, 'post', JSON.stringify(data));
});

// 将svg字符串转为json
function SVGToJson(eles) {
    var json = {};
    for (let i = 0; i < eles.length(); i++) {
        let ele = eles.get(i);
        let attrs = ele.attr();
        let eleName = ele.node.nodeName.toLocaleLowerCase();
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

// 将json 解析为svg
function jsonToSVGAsString(json) {
    let svgString = '';
    for (let key in json) {
        let type = key.split('#')[0];
        svgString += '<' + type + ' ';
        var value = json[key];
        let hasTextAttr = false;
        for (let attr in value) {
            if ('text' === attr) {
                hasTextAttr = true;
                continue;
            } else if ('children' === attr)
                continue;
            svgString += attr + '=' + '\"' + value[attr] + '\" ';
        }
        svgString += '>'
        if (hasTextAttr)
            svgString += value['text'];
        else if ('g' === type) {
            svgString += jsonToSVGAsString(json[key]['children']);
        }
        svgString += '</' + type + '>'
        hasTextAttr = false;
    }
    //console.log(svgString);
    return svgString;
}

// 将组合中的元素解析成json
function groupedChildrenToJson(eles) {
    var json = {};
    for (let i = 0; i < eles.length; i++) {
        let ele = eles[i];
        let attrs = ele.attr();
        let eleName = ele.node.nodeName.toLocaleLowerCase();
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
function getAllEles() {
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
        $.post(host + urls.importProject, JSON.stringify(data), function (res) {

            if (svg === null) {
                newSVG();
                svgName = 'default';
            }
            svg.svg(jsonToSVGAsString(JSON.parse(res['data'])));

            // 将导入的测点加入测点集合
            addToBindPoints();
        });
    } else {
        alert('工程未建立，无法导入');
    }
});

// 将导入的测点加入测点集合
function addToBindPoints() {
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

        // 放到localstorage 里面
        //loc
}