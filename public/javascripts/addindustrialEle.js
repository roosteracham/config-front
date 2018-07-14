/**
*  添加元素
* */
// 新增直线
$("#line").on("click", function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    // 创建线条对象
    var line = svg.line(100, 100, 200, 100)
        .stroke({
            width : 2
        });
    // 可拖放,可缩放
    myResize(line);
});

//新增文本
$("#text").on("click", function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var text = svg.plain('text');
    text.font({
        fill : "black",
        family: 'Inconsolata',
        size : 30
    });
    myResize(text);
});

//新增矩形
$("#rect").on("click", function (e) {
    
    if(svgName === null || projectName === null) {
        return;
    }
    var rect = svg.rect(100, 200)
        .attr("fill", "red");
    myResize(rect);
});

//新增圆角矩形
$("#roundRect").on("click", function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var roundRect = svg.rect(100, 200)
        .radius(10)
        .attr("fill", "red");
    myResize(roundRect);
});

// 新增梯形
$('#trapezoid').on('click', function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var path = '130,10 170,10 200,100 100,100',
        fill = 'red';
    var pentagon = polygonGraph(path, fill);
    myResize(pentagon);
});

//新增五边形
$("#pentagon").on("click", function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var path = '100,10 190,80 150,180 50,180 10,80',
        fill = 'red';
    var pentagon = polygonGraph(path, fill);
    myResize(pentagon);
});

//新增五角星
$('#pentagram').on('click', function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var path = '147.6,265.5 177,281 171.4,248.2 195.1,225.1 162.3,220.3 ' +
        '147.6,190.5 132.9,220.3 100,225.1 123.8,248.2 118.2,281',
        fill = 'yellow';
    var pentagram = polygonGraph(path, fill);
    myResize(pentagram);
});

//新增六边形
$("#hexagon").on("click", function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var path = '37.5,129 0,65 37.5,0 112.3,0 150,65 112.3,129',
        fill = 'red';
    var hexagon = polygonGraph(path, fill);
    myResize(hexagon);
});

//新增八边形
$("#octagon").on("click", function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var path = '50,0 120,0 170,50 170,120 120,170 50,170 0,120 0,50',
        fill = 'red';
    var octagon = polygonGraph(path, fill);
    myResize(octagon);
});

//新增圆形
$("#circle").on("click", function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var circle = svg.circle(100, 200)
        .attr("fill", "red");
    myResize(circle);
});

// 新增椭圆
$("#ellipse").on("click", function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var ellipse = svg.ellipse(200, 100)
        .attr("fill", "red");
    myResize(ellipse);
});

//新增三角形
$("#tangle").on("click", function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var path = '30,0 60,50 0,50',
        fill = 'green';
    var polygon = polygonGraph(path, fill);
    myResize(polygon);
});

// svg polygon绘制图形
function polygonGraph(path, fill) {
    return svg.polygon(path)
        .fill(fill)
        .stroke({
            width : 1
        });
}

// 新增工业控制图形
// 新增管道
$('#pipe').on('click', function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var rect = svg.rect(80, 100);
    // 渐变起止区域
    //gradient.from(0,'100%').to('50%', '100%')
    rect.attr({ fill: getGradient() });
    myResize(rect);
});

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

// 新增灯
$('#light').on('click', function (e) { 
    
    if(svgName === null || projectName === null) {
        return;
    }
    var light = svg.path().M({x : 79.4, y : 67.8})
        .c({x : 0, y : -18.4}, {x : -16.9, y : -33.2}, {x : -37.7, y : -33.2})
        .S({x : 4, y : 49.4}, {x : 4, y : 67.8})
        .c({x : 0, y : 7.3}, {x : 2.7, y : 14}, {x : 7.1, y : 19.4})
        .c({x : 0.5, y : 0.7}, {x : 15.5, y : 21.9}, {x : 16.7, y : 30.8})
        //.c({x : 1.3, y : 9.1}, {x : 1.3, y : 11.5}, {x : 1.3, y : 11.5})
        .h(25.2)
        .v(6)
        .h(-25.2)
        .v(6)
        .h(25.2)
        .v(-12)
        //.c({x : 0, y : 0}, {x : 0, y : -2.4}, {x : 1.3, y : -11.5})
        .c({x : 1.3, y : -8.9}, {x : 16.2, y : -30}, {x : 16.7, y : -30.8})
        .C({x : 76.8, y : 81.8}, {x : 79.4, y : 75.1}, {x : 79.4, y : 67})
        .fill('green')
        .stroke({
            color: 'white',
            width: 2,
            linecap: 'round',
            linejoin: 'round'
        });
    myResize(light);
});

$('#pump').on('click', function (e) { 
     
    
   if (svgName === null || projectName === null) {
       return;
   }

   /*var pump = '<g id="SvgjsG12095" class="grouparent ele" x="100" y="100" transform="matrix(1,0,0,1,124,4)"><rect id="SvgjsRect9715" width="47" height="23" fill="#9a98ab" x="244" y="305" class="groupEle"></rect><circle id="SvgjsCircle8799" r="30.25" cx="249.25" cy="335.25" fill="#9a98ab" class="groupEle"></circle><rect id="SvgjsRect10606" width="13" height="32" fill="#9a98ab" x="285" y="301" class="groupEle"></rect></g>';*/
   var pump = {
       "g#SvgjsG6706":{
           "transform":"matrix(1,0,0,1,-172,113)",
           "class":"grouparent ele selected",/*
           "id":"SvgjsG6706",*/
           "children":{
               "rect#SvgjsRect3247":{
                   "class":"groupEle",
                   "y":227,
                   "x":366,
                   "fill":"#847a91",
                   "height":18,
                   "width":49/*,
                   "id":"SvgjsRect3247"*/
               },
               "circle#SvgjsCircle2241":{
                   "class":"groupEle",
                   "fill":"#847a91",
                   "cy":259.5,
                   "cx":370.5,
                   "r":33/*,
                   "id":"SvgjsCircle2241"*/
               },
               "circle#SvgjsCircle1055":{
                   "class":"groupEle",
                   "fill":"red",
                   "cy":258.5,
                   "cx":370.5,
                   "r":20/*,
                   "id":"SvgjsCircle1055"*/
               },
               "rect#SvgjsRect5010":{
                   "class":"groupEle",
                   "y":220,
                   "x":409,
                   "fill":"#867c94",
                   "height":30,
                   "width":14/*,
                   "id":"SvgjsRect5010"*/
               }
           }
       }
   }
    svg.svg(jsonToSVGAsString(pump));
});