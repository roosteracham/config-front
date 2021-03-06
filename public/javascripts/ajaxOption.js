// 数据 data 为字符串
function ajaxOption(url, type, data, sucallback, errcallback, setHeader) {
    $.ajax({
       url : url, // 规定发送请求的 URL。默认是当前页面
       async : true, // 布尔值，表示请求是否异步处理。默认是 true
       type : type, // 规定请求的类型（GET 或 POST）
       data : data, // 规定要发送到服务器的数据
       //scriptCharset : 'UTF-8', // 规定请求的字符集
       contentType : 'application/json; charset=utf-8', //发送数据到服务器时所使用的内容类型
       success : sucallback,
       error : errcallback,
       beforeSend : setHeader,
       timeout : 30 * 1000 // 设置本地的请求超时时间（以毫秒计）
    });
}

// 后端主机名
//var host = 'http://172.17.161.136/zutai/dev';
var host = 'http://192.168.191.1/zutai/dev';

var urls = {
    // 保存图形
    exportProject : '/project/save',
    // 导入图形
    importProject : '/project/import',
    // 导出组合元素
    saveGroupedEle : '/project/saveGroup',
    // 导出组合元素
    getGroupedEle : '/project/getGroup',
    // 可以获得工程集合
    getProjects : '/project/getProjectsCollection',
    // 可添加元素集合
    addProject : '/project/addProjectToCollection',
    // 删除画面
    deleteSvg : '/project/deleteSvg',
    // 注册用户
    register : '/user/register',
    // 登陆
    login : '/user/login',
    // runConfig
    runConfig : '/project/configChose',
    //quanxian
    userManager : '/c1/a'
};