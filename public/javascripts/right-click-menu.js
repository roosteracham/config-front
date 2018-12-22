$.fn.rightClickMenu  = function(option, childSelector) {

    var selfObj = $(this);

    var rightClickMenu = {
        titleColor:'#000000',
        tipsColor:'#aaaaaa',
        bgColor:'#ffffff',
        disableColor:'#aaaaaa',
        items:[],

        clickPosX:0,
        clickPosY:0,
        init:function(baseObj, option){

            for(var i in option){
                if(rightClickMenu.hasOwnProperty(i)){
                    rightClickMenu[i] = option[i];
                }
            }

            baseObj.on('contextmenu', childSelector, function(e){
                rightClickMenu.obj = $(this);
                rightClickMenu.clickPosX = e.clientX;
                rightClickMenu.clickPosY = e.clientY;
                rightClickMenu.loadMenu($(this), rightClickMenu.items);
                return false;
            });

        },
        loadMenu:function(obj, items){

            var menuHtml = '<div class="right-click-menu-wrap" style="left:'+rightClickMenu.clickPosX+'px;top:'+rightClickMenu.clickPosY+'px;background-color:'+this.bgColor+';"></div>';
            $('body').append(menuHtml);
            $('.right-click-menu-wrap').on('contextmenu', function(){
                return false;
            });
            for (var i = 0; i < items.length; i++){
                this.loadMenuItem(items[i]);
            }
            this.loadMask();
        },
        loadMenuItem:function(item){

            var itemHtml = '';
            switch (item.type){
                case 'hr':
                    itemHtml = this.getloadHrItem(item);
                    break;
                default:
                    itemHtml = this.getDefaultItem(item);
            }
            $('.right-click-menu-wrap').append(itemHtml);
            if(item.hasOwnProperty('action')){
                $('.right-click-menu-wrap .right-click-menu-item').last().click(function() {
                    rightClickMenu.destroy();

                    item.action(rightClickMenu.obj);
                });
            };

        },
        loadMask:function () {
            $('body').append('<div class="right-click-menu-mask"></div>');
            $('.right-click-menu-mask').click(function(){rightClickMenu.destroy();})
            $('.right-click-menu-mask').on('contextmenu',function(){

                rightClickMenu.destroy();
                return false;
            });
        },
        destroy:function(){
            $('.right-click-menu-wrap').remove();
            $('.right-click-menu-mask').remove();
        },
        getDefaultItem:function(item){

            var titleColor = this.titleColor;
            var enable = 'enable';
            if(!item.hasOwnProperty('action')){
                enable = 'disable';
                titleColor = this.disableColor;
            }

            if(item.hasOwnProperty('titleColor')){
                titleColor = item.titleColor;
            }

            if(item.hasOwnProperty('titleColor')){
                bgColor = item.bgColor;
            }

            var tipsColor = this.tipsColor;
            if(item.hasOwnProperty('tipsColor')){
                tipsColor = item.tipsColor;
            }

            var title = '';
            if(item.hasOwnProperty('title')){
                title = item.title;
            }
            var tips = '';
            if(item.hasOwnProperty('tips')){
                tips = item.tips;
            }

            var titleHtml = '<div class="right-click-menu-item-title" style="color:'+titleColor+'">' + title + '</div>';
            var tipsHtml = '<div class="right-click-menu-item-tips" style="color:'+tipsColor+'">' + tips + '</div>';
            var itemHTml = '<div class="right-click-menu-item '+enable+'">'
                                +titleHtml + tipsHtml +
                            '</div>';
            return itemHTml;
        },
        getloadHrItem:function(item){
            return '<div class="right-click-menu-item hr"></div>';
        },
        getSelecterObj:function(selector){

            var selectorObj = null;
            if(selector){
                if(selector instanceof jQuery){
                    selectorObj = selector;
                }else if(this.isDom(selector) || typeof(selector) === 'string'){
                    selectorObj = $(selectorObj);
                }
            }
            return selectorObj;
        },
        isDom:function(obj){
            return ( typeof HTMLElement === 'object' ) ?
            function(obj){
                return obj instanceof HTMLElement;
            } :
            function(obj){
                return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
            }
        }
    };

    rightClickMenu.init(selfObj, option);
    return rightClickMenu;
};


