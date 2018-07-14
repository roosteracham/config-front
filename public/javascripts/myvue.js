var projectOption = {
    projects : 0,
    svgs : 1,
    elementType : 2,
    elements : 3
}

// 页面加载完成， 向服务器请求数据生成左侧导航
$(function () {
   // 请求工程
    ajaxOption(host + urls.getProjects, 'post', '',
        function (res) {
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
                    case projectOption.elementType :
                        for (let i = 0; i < projects[key].length; i++) {
                            vm.elementType.push(projects[key][i]);
                        }
                        break;
                    case projectOption.elements :
                        for (let i = 0; i < projects[key].length; i++) {
                            vm.elements.push(projects[key][i]);
                        }
                        break;
                }
            }
            getSvg(urls.importProject);
            console.log('suc', res['data']);
        },
        function () {
            console.log('error');
        }
        );
});

function getSvg(uri) {
    var data = {
        projectName: projectName,
        svgName: svgName,
        svg: "",
        index: svgIndex
    };
    if (svg !== null) {
        svg.clear();
    }
    ajaxOption(host + uri, 'post',
        JSON.stringify(data), function (res) {
            if (res['success']) {
                generateSVG(res);
            } else {
                console.log('请求成功，返回错误')
            }
        }, function () {
            console.log('error')
        });
}

var vm = new Vue({
    el : '#app',
    data : {
        projects : [/*
            {index : 0, projectName : '工程1'}*/
        ],
        svgs : [
            /*{projectName : '工程1', name : '画面1', id : 'id1', index : 0},
            {projectName : '工程1', name : '画面2', id : 'id2'},
            {projectName : '工程2', name : '画面3', id : 'generated_id3'},*/
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
        ]
    },
    methods : {
        c1 : function (e) {
            var id = e.target.id;
            if (id.indexOf('svg') > -1 || id.indexOf('group') > -1) {
                console.log('c1 in methods');
                var attrs = id.split('-');
                var uri;
                if ('svg' === attrs[0] && svgIndex !== attrs[3]) {
                    uri = urls.importProject;
                    projectName = attrs[1];
                    svgName = attrs[2];
                    svgIndex = attrs[3];
                    getSvg(uri);
                } else
                    // 获取组件的接口
                    uri = urls.importProject;
                // 从服务器请求数据或者本地寻找数据
                e.stopPropagation()
            }
        },
        c2 : function (e) {
            clickToggle($(e.target));
        }
    }
});

