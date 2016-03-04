/**
 * Created by Administrator on 2015/7/30.
 */
//返回顶部

//滚动事件
$(document).ready(function(){
    var btntop = document.getElementById("btn_top");
    var timer = null;
    var lineHeight = (document.documentElement.clientHeight) / 3;

    $(window).scroll(function(){
        var backtop = document.body.scrollTop || document.documentElement.scrollTop;
        if (backtop >= lineHeight) {
            btntop.style.display = "block";
        }
        else {
            btntop.style.display = "none";
        }
    });
    btntop.onclick = function () {
        timer = setInterval(function () {
            var backtop = document.body.scrollTop;
            var speed = backtop / 5;
            document.body.scrollTop = backtop - speed;
            if (backtop == 0) {
                clearInterval(timer);
            }
        }, 30)
    }
})

//cookie简单浏览量统计（浏览器缓存）
function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return "";
}

function setCookie(c_name,value,expiredays)
{
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays)
    document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

function checkCookie()
{
    var oCount=document.getElementsByClassName("d")[0];
    count=getCookie('count')||1;
    if (count!=null && count!="") {
        //alert('count= ' + count + '!')
        oCount.innerHTML=count;
        setCookie('count', parseInt(count) + 1, 365)
    }
}
//tab切换
function changeTab(){
    this.oh3=null;
    this.tabCon=null;
}
changeTab.prototype={
    init:function(id,name1,name2,str){
        this.oh3=document.getElementById(id).getElementsByTagName(name1);
        if(isIE68()){
            this.tabCon = $('.'+name2);
        }else{
            this.tabCon = document.getElementById(id).getElementsByClassName(name2);
        }
        var _this=this;
        for(var i=0;i<this.oh3.length;i++){
            this.oh3[i].index=i;
            if(str=='click'){
                this.oh3[i].onclick=function(){
                    for(var i=0;i<_this.oh3.length;i++){
                        _this.oh3[i].className="";
                        _this.tabCon[i].style.display="none";
                    }
                    _this.tabCon[this.index].style.display="block";
                    this.className="active";
                    //点击切换的时候并且执行懒加载
                    showImg();
                };
            }else{
                this.oh3[i].onmouseover = function () {
                    for (var i = 0; i < _this.oh3.length; i++) {
                        _this.oh3[i].className = "";
                        _this.tabCon[i].style.display = "none";
                    }
                    _this.tabCon[this.index].style.display = "block";
                    this.className = "active";
                };
            }
        }
    }
};
//获取元素到页面顶端的绝对高度
function getTop(obj){
    var iTop=0;
    while(obj){
        iTop+=obj.offsetTop;
        obj=obj.offsetParent;
    }
    return iTop;
}
//懒加载
var aImg = $("li>img");
var aH3 = $(".nav h3");

showImg();
$(document).ready(function(){
    $(window).scroll(function(){
        showImg()
    });
})
//window.onscroll = showImg;
window.onresize = showImg;
function showImg() {
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;

    for (var i = 0; i < aImg.length; i++) {

        if (aImg.eq(i).parent().parent().parent().css("display") == "block")
        //首先判断父元素是不是block，是block执行
        {
            if (!aImg[i].isLoad && getTop(aImg[i]) < (scroll + document.documentElement.clientHeight)) {
                aImg[i].src = aImg[i].getAttribute("data-source");
                aImg[i].isLoad = true;
                //console.log('执行了懒加载' + i)
            }
        }
    }
};
//判断IE6-8
function isIE68(){
    var isIE8=/MSIE 8.0/gi.test(window.navigator.userAgent)
    ,isIE7=/MSIE 7.0/gi.test(window.navigator.userAgent)
    ,isIE6=/MSIE 6.0/gi.test(window.navigator.userAgent);
    if(isIE7||isIE8||isIE6){
        return true;
    }else{
        return false;
    }
}



