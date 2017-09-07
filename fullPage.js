(function ($) {
    var privateFun = function(){
        //私有方法
    }
    var pageSwitch =(function(){
        function pageSwitch(element,options){
            this.settings = $.extend(true,$.fn.pageSwitch.default,options||{});
            this.element = element;
            this.init();
        }
        pageSwitch.prototype = {
            init: function(){
                // 公有方法
                var me = this;//pageSwitch

                me.selectors = me.settings.selector;
                me.sections = me.selectors.sections;
                me.section= me.selectors.section;
                me.direction = me.settings.direction=="vertical"?true:false;
                me.pagesCount= me.pagesCount();
                me.index = (me.settings.index>=0 && me.settings.index<me.pagesCount)?me.settings.index:0;
                if(me.settings.pagination){
                    me._initPaging();
                }
                me._initEvent();
            },
            pagesCount: function(){
                // var this.section.length = "4";
                return "4";
            },
            prev:function(){
                var me = this;
                if(me.index > 0){
                    me.index --;
                }else if(me.settings.loop){
                    me.index = me.pagesCount-1;
                }
                me._scrollPage();
            },
            next:function(){
                var me = this;
                if(me.index<me.pagesCount){
                    me.index ++;
                }
                else if(me.settings.loop){
                    me.index = 0;
                }
                me._scrollPage();
            },
            //获取宽高
            switchLength: function(){
                return this.direction?this.element.height():this.element.width();
            },
            _scrollPage : function(init){
				var me = this;
				var dest = me.section.eq(me.index).position();
				if(!dest) return;

				me.canscroll = false;
				if(_prefix){
					var translate = me.direction ? "translateY(-"+dest.top+"px)" : "translateX(-"+dest.left+"px)";
					me.sections.css(_prefix+"transition", "all " + me.settings.duration + "ms " + me.settings.easing);
					me.sections.css(_prefix+"transform" , translate);
				}else{
					var animateCss = me.direction ? {top : -dest.top} : {left : -dest.left};
					me.sections.animate(animateCss, me.settings.duration, function(){
						me.canscroll = true;
						if(me.settings.callback){
							me.settings.callback();
						}
					});
				}
				if(me.settings.pagination && !init){
					me.pageItem.eq(me.index).addClass(me.activeClass).siblings("li").removeClass(me.activeClass);
				}
			},
            _initPaging:function(){
                var me = this;
                var pagesClass = me.selectors.page.substring(1);
                var activeClass = me.selectors.active.substring(1);
                var pageHtml = "<ul class="+pagesClass+">";
                for(var i=0;i<me.pagesCount;i++){
                    pageHtml += "<li></li>";
                }
                me.element.append(pageHtml);
                var pages = me.element.find(me.selectors.page);
                me.pageItem = pages.find("li");
                me.pageItem.eq(me.index).addClass(me.activeClass);
            },
            _initLayout:function(){

            },
            //绑定点击 鼠标 键盘事件，还有调整窗口大小事件
            _initEvent:function(){
                var me = this;
                // me.element.on("click",me.selectors.pages+" li",function(){
                //     me.index = $(this).index();
                //     me._scrollPage();
                // });
                // me.element.on("mousewheel DOMMouseScroll",function(e){
                //     //使得两种都是负数
                //     var delta = e.originalEvent.wheelDalta || -e.originalEvent.detail;
                //     if(delta>0&&!me.settings.loop||me.settings.loop){
                //         me.prev();
                //     }
                //     else if(delta<0&&(me.index<(me.pagesCount-1)&&!me.settings.loop||me.settings.loop)){
                //         me.next();
                //     }
                // })
                me.element.on("mousewheel DOMMouseScroll", function(e){
					e.preventDefault();
					var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
					if(me.canscroll){
						if(delta > 0 && (me.index && !me.settings.loop || me.settings.loop)){
							me.prve();
						}else if(delta < 0 && (me.index < (me.pagesCount-1) && !me.settings.loop || me.settings.loop)){
							me.next();
						}
					}
				});
            }
        }
        return pageSwitch;
    })();
    $.fn.pageSwitch = function (options) {
        return this.each(function(){
            var me = $(this),
            instance= me.data("pageSwitch");
            if(!instance){
                instance = new pageSwitch(me,options);
                me.data("pageSwitch",instance);
            }
            if($.type(options) === "string") return instance[options]();
            $("div").pageSwitch("init");
        });
    }
    $.fn.pageSwitch.default = {
        selector: {
            //最外层的盒子
            sections: ".sections",
            //每个div
            section: ".section",
            //分页
            page: ".pages",
            //被选中时的class
            active: ".active"
        },
        //从哪页开始
        index: 0,
        easing: "ease",
        duration: 500,
        //是否循环
        loop: false,
        //是否进行分页处理
        pagination:true,
        //是否支持鼠标事件
        keyboard: true,
        direction: "vertical",
        callback: ""
    }
})(jQuery);