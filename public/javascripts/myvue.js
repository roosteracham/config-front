var projectOption = {
    projects : 0,
    svgs : 1,
    elementType : 2,
    elements : 3,
    components : 4
}

// 页面加载完成， 向服务器请求数据生成左侧导航
$(function () {
   // 请求工程
    ajaxOption(host + urls.getProjects, 'post', '',
        function (res) {

        if (res['success']) {
            var projects = JSON.parse(res['data']);

            for (let key in projects) {
                switch (parseInt(key)) {
                    case projectOption.projects :
                        for (let i = 0; i < projects[key].length; i++) {
                            if (i === 0) {
                                projectName = projects[key][0]['projectName'];
                            }
                            vm.projects.push(projects[key][i]);
                        }
                        break;
                    case projectOption.svgs :
                        for (let i = 0; i < projects[key].length; i++) {
                            if (i === 0) {
                                svgName = projects[key][0]['name'];
                                svgIndex = projects[key][0]['index'];
                            }
                            vm.svgs.push(projects[key][i]);
                        }
                        break;
                    /*case projectOption.elementType :
                        for (let i = 0; i < projects[key].length; i++) {
                            vm.elementType.push(projects[key][i]);
                        }
                        break;
                    case projectOption.elements :
                        for (let i = 0; i < projects[key].length; i++) {
                            vm.elements.push(projects[key][i]);
                        }
                        break;*/
                    case projectOption.components :
                        for (let i = 0; i < projects[key].length; i++) {
                            vm.components.push(projects[key][i]);
                        }
                        break;
                }
            }
            getSvg(urls.importProject);
            //console.log('suc', res['data']);
        } else {
            if ('login' === JSON.parse(res['data'])['token']) {
                location = JSON.parse(res['data'])['location'];
            }
        }

        },
        function (err) {
            alert('初始化出错');
        },
        function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
        }
        );
});

// 获取组件
function getGroupEle(uri) {

    var data = {
        groupName : componentName
    };

    // ajax请求
    ajaxOption(host + uri, 'post', JSON.stringify(data),
        function (res) {
        if (res['success']) {
            var json = JSON.parse(res['data']);
            sessionStorage.setItem('group-' + componentName, res['data']);
            svg.svg(jsonToSVGAsString(json));
            addMouseDownEventOnEle();
        } else {
            if ('login' === JSON.parse(res['data'])['token']) {
                location = JSON.parse(res['data'])['location'];
            }
        }
        }, null, function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
        });
}

// 获取svg
function getSvg(uri) {
    var data = {
        projectName: projectName,
        svgName: svgName,
        svg: "",
        index: svgIndex
    };

    // ajax请求
    ajaxOption(host + uri, 'post',
        JSON.stringify(data), function (res) {
            if (res['success']) {
                generateSVG(JSON.parse(res['data']));
            } else {
                if ('login' === JSON.parse(res['data'])['token']) {
                    location = JSON.parse(res['data'])['location'];
                    return;
                }
                alert('请求成功，返回错误')
            }
        }, function (err) {
            alert('error')
        },
        function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
        });
}

var vm = new Vue({
    el : '#app',
    data : {
        projects : [/*
            {index : 0, projectName : '工程1'}*/
        ],
        svgs : [
            /*{projectName : '工程2', name : '画面3', id : 'generated_id3'},*/
        ],
        elementType : [
           /* {index : 0, project : '基本图形'},
            {index : 1, project : '工程图形'}*/
            ],
        elements : [
           /* {type : '基本图形', id : 'line', name : '直线', index : 0},
            {type : '基本图形', id : 'text', name : '文本', index : 1},
            {type : '工程图形', id : 'pump', name : '泵', index : 2},
            {type : '工程图形', id : 'pipe', name : '管道', index : 3},*/
        ],
        components : [/*'a', 'b'*/] /*字符数组*/
    },
    methods : {
        dtClick : function (e) {
            clickToggle($(e.target));
        },
        c1 : function (e) {
            var id = e.target.id;
            var attrs = id.split('-');
            if (id.indexOf('svg') > -1) {
                //console.log('c1 in methods');
                projectName = attrs[1];
                svgName = attrs[2];
                var index = attrs[3];
                var uri;
                if ('svg' === attrs[0] && svgIndex !== index) {

                    svgIndex = index;
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
            } else if (id.indexOf('group') > -1) {
                componentName = attrs[1];
                var item = sessionStorage.getItem('group-' + componentName);
                if (typeof item !== "undefined" && item != null && item !== 'null') {
                    svg.svg(jsonToSVGAsString(JSON.parse(item)));
                    addMouseDownEventOnEle();
                }else {
                    // 获取组件的接口
                    uri = urls.getGroupedEle;
                    // 从服务器请求数据或者本地寻找数据
                    getGroupEle(uri);
                }
            }
            e.stopPropagation()
            }
        }
});

