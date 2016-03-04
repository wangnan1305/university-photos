/**
 * Created by Administrator on 2015/10/7.
 */

;(function($){
    var LightBox=function(settings){
        var _self=this;
        //默认参数

        this.settings={
            picScale:1,
            speed:500
        };
        $.extend(this.settings,settings||{});
        //创建遮罩和弹出框
        this.popupMask=$('<div id="G-lightbox-mask"></div>');
        this.popupWin=$('<div id="G-lightbox-popup"></div>');

        this.bodyNode=$(document.body);

        //渲染剩余dom并且插入到booy
        this.renderDOM();

        this.picViewArea=this.popupWin.find("div.lightbox-pic-view");   //整个图片展示窗口
        this.popupPic=this.popupWin.find("img.lightbox-image");   //图片区域
        this.picCaptionArea=this.popupWin.find("div.lightbox-pic-caption");  //图片描述信息
        this.nextBtn=this.popupWin.find("span.lightbox-next-btn");
        this.preBtn=this.popupWin.find("span.lightbox-prev-btn");

        this.captionText=this.popupWin.find("p.lightbox-pic-des"); //图片描述
        this.currentIndex=this.popupWin.find("span.lightbox-of-index");  //图片索引
        this.closeBtn=this.popupWin.find("a.lightbox-close");


        //事件委托
        //console.log(this)
        this.groupName=null;
        this.groupData=[];  //放置同一组的数据
        this.bodyNode.delegate("js-lightbox,*[data-role=lightbox]","click",function(e){
            //阻止事件冒泡
            e.stopPropagation();

            var currentGroupName=$(this).attr("data-group");
            if(currentGroupName!=_self.groupName){
                _self.groupName=currentGroupName;

                //根据同一组名获取数据

                _self.getGroup();
            };

            //初始化弹窗
            _self.initPopup($(this));

        });
        //关闭按钮
        this.popupMask.click(function(){
            $(this).fadeOut();
            _self.popupWin.fadeOut();
            _self.clear=false;
        });
        this.closeBtn.click(function(){
            _self.popupMask.fadeOut();
            _self.popupWin.fadeOut();
            _self.clear=false;
        });
        //绑定上下切换按钮
        this.flag=true;
        this.nextBtn.hover(/*移动进去执行*/function(){

            if(!$(this).hasClass("disabled")&&_self.groupData.length>1){
                $(this).addClass("lightbox-next-show");
            }

        },/*移出执行*/function(){
            if(!$(this).hasClass("disabled")&&_self.groupData.length>1){
                $(this).removeClass("lightbox-next-show");
            }
        }).click(function(e){
            if(!$(this).hasClass("disabled")&&_self.flag){
                _self.flag=false;
                e.stopPropagation();
               _self.goto("next");
            }
        });
        this.preBtn.hover(function(){
            if(!$(this).hasClass("disabled")&&_self.groupData.length>1){
                $(this).addClass("lightbox-prev-show");
            }
        },function(){
            if(!$(this).hasClass("disabled")&&_self.groupData.length>1){
                $(this).removeClass("lightbox-prev-show");
            }
        }).click(function(e){
            if(!$(this).hasClass("disabled")&&_self.flag){
                _self.flag=false;
                e.stopPropagation();
                _self.goto("prev");
            }
        });

        //判断是不是IE6
        this.isIE6=/MSIE 6.0/gi.test(window.navigator.userAgent);
        //alert(this.isIE6);


        //改变窗口大小实时改变图片大小
        var timer=null;
        this.clear=false;
        $(window).resize(function(){
            //console.log(_self.clear)
            if(_self.clear){
                window.clearTimeout(timer);
                timer=window.setTimeout(function(){
                    _self.loadPicSize(_self.groupData[_self.index].src)
                },500);

                /*IE6bug解决*/
                if(_self.isIE6){
                    this.popupMask.css({
                        width:$(window).width(),
                        height:$(window).height()
                    })
                };
            };
        }).keyup(function(e){

            var keyValue= e.keyCode;
            if(_self.clear) {
                if (keyValue == 38 || keyValue == 37) {
                    _self.preBtn.click();

                } else if (keyValue == 40 || keyValue == 39) {
                    _self.nextBtn.click();
                }
            }
        });

        if(this.isIE6){
            $(window).scroll(function(){
                _self.popupMask.css({
                    top:$(window).scrollTop()
                });
            })
        }


    };
    LightBox.prototype={

        goto:function(str){
            var _self=this;
            if(str==='next'){
                //alert('next')
                this.index++;
                if(this.index>=this.groupData.length-1){
                    this.nextBtn.addClass("disabled").removeClass("lightbox-next-show");
                };
                if(this.index!=0){
                    this.preBtn.removeClass("disabled");
                };

                var src=this.groupData[this.index].src;
                this.loadPicSize(src);
            }else if(str==='prev'){
               // alert('prev')
                this.index--;
                if(this.index<=0){
                    this.preBtn.addClass("disabled").removeClass("lightbox-prev-show");
                };
                if(this.index!=this.groupData.length-1){
                    this.nextBtn.removeClass("disabled");
                };

                var src=this.groupData[this.index].src;
                this.loadPicSize(src);
            };
        },
        loadPicSize:function(currentSrc){
            //console.log(currentSrc);
            var _self=this;
            _self.popupPic.css({
                width:"auto",
                height:"auto"
            }).hide();
            this.picCaptionArea.hide();
            this.preLoadImg(currentSrc,function(){
                //alert('ok')
                _self.popupPic.attr("src",currentSrc);

                var picWidth=_self.popupPic.width(),
                    picHeight=_self.popupPic.height();

                _self.changePic(picWidth,picHeight);

            });

        },
        changePic:function(picWidth,picHeight){

            var _self=this,
                winWidth=$(window).width(),
                winHeight=$(window).height();

            //如果图片的宽高大于浏览器适口的宽高比例，我就看下是否溢出

            var scale=Math.min(winWidth/(picWidth+10),winHeight/(picHeight+10),1);
            picWidth=picWidth*scale*_self.settings.picScale;
            picHeight=picHeight*scale*_self.settings.picScale;

            this.picViewArea.animate({
                width: picWidth - 10,
                height: picHeight - 10
            }, _self.settings.speed);
            var oldTop = (winHeight - picHeight) / 2;
            if (this.isIE6) {

                oldTop += $(window).scrollTop();
            }
            this.popupWin.animate({
                width:picWidth,
                height:picHeight,
                marginLeft:-(picWidth/2),
                top:oldTop
            },_self.settings.speed,function(){
                _self.popupPic.css({
                    width:picWidth-10,
                    height:picHeight-10
                }).fadeIn();
                _self.picCaptionArea.fadeIn();
                _self.flag=true;
                _self.clear=true;
            })
            //console.log(this.index)
            //设置描述文字和索引
            this.captionText.text(this.groupData[this.index].caption);
            this.currentIndex.text("当前索引： "+(this.index+1)+" of "+this.groupData.length);

        },
        //监控图片是否完成
        preLoadImg:function(src,callback){

            var img=new Image();

            if(!!window.ActiveXObject){
                img.onreadystatechange=function(){

                    if(this.readyState=="complete"){
                        callback();
                    };
                };
            }else{
                img.onload=function(){
                    callback();
                };
            };
            img.src=src;

        },
        showMaskAndPopup:function(currentSrc,currentId){
            var _self=this;
            var winWidth=$(window).width(),
                winHeight=$(window).height();
            this.popupPic.hide();
            this.picCaptionArea.hide();

            /*调整在IE6下的遮罩的宽和高*/
            if(this.isIE6){
                var scrollTop=$(window).scrollTop();
                this.popupMask.css({
                    width:winWidth,
                    height:winHeight,
                    top:scrollTop
                });
            }
            //遮罩渐显渐隐
            this.popupMask.fadeIn();

            this.picViewArea.css({
                width:winWidth/2,
                height:winHeight/2
            });
            //弹出框渐显渐隐
            this.popupWin.fadeIn();
            //设置弹出框位置
            var viewHeight=winHeight/2+10;
            var oldtopAnimate=(winHeight-viewHeight)/2;
            this.popupWin.css({
                width:winWidth/2+10,
                height:winHeight/2+10,
                marginLeft:-(winWidth/2+10)/2,
                top:(this.isIE6?-(scrollTop+viewHeight):-viewHeight)
            }).animate({
                top:(this.isIE6?(oldtopAnimate+scrollTop):oldtopAnimate)
            },_self.settings.speed,function(){

                //加载图片
                _self.loadPicSize(currentSrc);

            });
            //根据当前点击的元素ID获取在当前组别里面的索引
            this.index=this.getIndexOf(currentId);
            //console.log(this.index);
            var groupDataLength=this.groupData.length;
            if(groupDataLength>=1){

                if(this.index===0){
                    this.preBtn.addClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }else if(this.index===groupDataLength-1){
                    this.nextBtn.addClass("disabled");
                    this.preBtn.removeClass("disabled");
                }else{
                    this.nextBtn.removeClass("disabled");
                    this.preBtn.removeClass("disabled");
                };

            }
        },
        getIndexOf:function(currentId){
            var index=0;

            $(this.groupData).each(function(i){
                //console.log(this)
                index=i;
                if(this.id===currentId){
                    return false;
                };
            });

            return index;
        },
        initPopup:function(currentObj){
            var _self=this,
                currentSrc=currentObj.attr("data-source"),
                currentId=currentObj.attr("data-id");

            this.showMaskAndPopup(currentSrc,currentId);
        },
        getGroup:function(){
            var _self=this;
            //console.log(this.groupName)
            //根据当前组别获取页面中所有相同组别的对象

            var groupList=this.bodyNode.find("[data-group="+this.groupName+"]");
            //console.log(groupList.size())

            //清空数组数据
            _self.groupData.length=0;

            groupList.each(function(){
                _self.groupData.push({
                    src:$(this).attr("data-source"),
                    id:$(this).attr("data-id"),
                    caption:$(this).attr("data-caption")
                });
            })
            //console.log(_self.groupData);

        },
        renderDOM:function(){
            var strDom='<div class="lightbox-pic-view">'+
            '<span class="lightbox-btn lightbox-prev-btn" ></span>'+
            '<img class="lightbox-image" src="" />'+
            '<span class="lightbox-btn lightbox-next-btn"></span>'+
            '</div>'+
            '<div class="lightbox-pic-caption">'+
            '<div class="lightbox-caption-area">'+
            '<p class="lightbox-pic-des"></p>'+
            '<span class="lightbox-of-index">当前索引：0 of 0</span>'+
            '</div>'+
            '<a href="javascript:;" class="lightbox-close"></a>'+
            '</div>';
            //插入到this.popupWin
            this.popupWin.html(strDom);
            this.bodyNode.append(this.popupMask);
            this.bodyNode.append(this.popupWin);
        }
    };
    window["LightBox"]=LightBox;
})(jQuery);