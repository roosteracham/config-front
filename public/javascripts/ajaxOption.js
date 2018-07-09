function ajaxOption(url, type, data) {
    $.ajax({
       url : url, // 规定发送请求的 URL。默认是当前页面
       async : true, // 布尔值，表示请求是否异步处理。默认是 true
       type : type, // 规定请求的类型（GET 或 POST）
       data : JSON.stringify(data), // 规定要发送到服务器的数据
       //scriptCharset : 'UTF-8', // 规定请求的字符集
       contentType : 'application/json; charset=utf-8', //发送数据到服务器时所使用的内容类型
       success : successCallback,
       error : errorCallback,
        timeout : 10 * 1000 // 设置本地的请求超时时间（以毫秒计）
    });
}

// post 请求
function ajaxPost(url, data) {
    $.ajaxSetup({contentType : 'application/json; charset=utf-8'});
    $.post(url, JSON.stringify(data), function () {

        console.log('success' );
    });
}

// 当请求成功时运行的函数
function successCallback(res) {
    console.log('success' + res['success']);
}

// 如果请求失败要运行的函数
function errorCallback() {
    console.log('error');
}

// 后端主机名
var host = 'http://localhost:8888';

var urls = {
    exportProject : '/project/save',
    importProject : '/project/import'
}