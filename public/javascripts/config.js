$("#b").on("click", function () {
    var data = {
        id : 1
    };
    $.ajax({
        url: "/c1/user",
        contentType : "application/json",
        data : JSON.stringify(data),
        timeout : 30 * 1000,
        type : "post",
        success : function (res) {
            alert(res);
            document.getElementById("myDiv").innerHTML=res;
        }
        });
});