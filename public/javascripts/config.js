
function empty(){
    $('input').val('');
}

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
                    location = res["data"];
                }
            }, function (err) {

            });
    }
    return false;
}

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
                    location = JSON.parse(res['data'])['location'];
                } else {
                    alert(res['data']);
                }
            });
    }
    return false;
}