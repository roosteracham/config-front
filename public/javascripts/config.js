// 重置
function empty(){
    $('input').val('');
}

// 注册
function check() {
    var name = $('#name').val().trim();
    var email = $('#emailAddr').val().trim();
    var password = $('#password').val().trim();
    var password2 = $('#password2').val().trim();

    if (password === "" || email === ""|| name === "" || password2 === ""){
        alert("任意信息不能为空，请重新填写！");
    } else if(name.length>20){
        alert("用户名不能超过20个字符，请重新输入！");
    } else if (password !== password2) {
        alert("2次密码输入不一致！");
    } else if (email.indexOf('@') < 0) {
        alert('邮件格式错误！');
    } else{// 注册
        var data = {
            name : name,
            emailAddr: email,
            auth : password
        };
        ajaxOption(host + urls.register,
            "post", JSON.stringify(data),
            function (res) {
                if (!res['success']) {
                    alert(res["data"]);
                } else {
                    sessionStorage.setItem("emailAddr", JSON.parse(res['data'])['index']);
                    location = JSON.parse(res['data'])['location'];
                }
            }, function (err) {

            });
    }
    return false;
}

// 登陆
function login() {
    var name = $('#name').val().trim();
    var password = $('#password').val().trim();
    if (password === "" || name === ""){
        alert("任意信息不能为空，请重新填写！");
    } else if(name.length>20){
        alert("用户名不能超过20个字符，请重新输入！");
    } else{
        var data = {
            name : name,
            auth : password
        };
        ajaxOption(host + urls.login, 'post',
            JSON.stringify(data),
            function (res) {
                if (res['success']) {
                    localStorage.setItem("token", JSON.parse(res['data'])['token']);
                    localStorage.setItem("role", JSON.parse(res['data'])['role']);
                    location = JSON.parse(res['data'])['location'];
                } else {
                    alert(res['data']);
                }
            });
    }
    return false;
}

function mailServer() {
   var index = parseInt(sessionStorage.getItem('emailAddr'));
   var emailServer = null;
   switch (index) {
       case 0 :
           emailServer = 'https://mail.qq.com/';
           break;
       case 1 :
           emailServer = 'https://email.163.com/';
           break;
       case 2 :
           emailServer = 'https://outlook.live.com/';
           break;
   }
   window.open(emailServer);
   return false;
}