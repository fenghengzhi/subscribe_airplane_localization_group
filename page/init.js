//$(mangalistbox).css('top',$('#header').height()+1);
$('.mangacover').one('click',function(event){
	event.stopPropagation();
	event.preventDefault();
	var coverbox=$(this);
	//coverbox.css('background-image','url('+coverbox.attr('coverurl')+');');
	coverbox.text('');
	var coverimg=$("<img>").addClass('coverimg');
	coverimg.attr('src',coverbox.attr('coverurl'));
	coverimg.appendTo(coverbox);
});//显示封面
$('.mangaboxtamplate').click(function(){
	window.open($(this).attr('mangaurl'));
	//console.log('mangabox');
});
$(searchbox).on('input',function(){
	var _this=$(this);
	var searchtext=_this.val().toLowerCase();
	$('.mangabox').each(function(){
		var _this=$(this);
		var manganame=_this.find('.manganame').text().toLowerCase();
		if(manganame.search(searchtext)>=0)_this.show();
		else _this.hide();
	})
});//搜索功能
$(searchbox).focus(function(){  
   var v=this.value;  
   if(v == "搜索"){  
        $(this).css('color','');  
        $(this).val("");
    }  
}).blur(function(){  
    var v=this.value;  
    if(v == ""){  
        $(this).css('color','gray');  
        $(this).val('搜索');       
    }  
});
$(mangafilter).change(function(){
	var _this=$(this);
	switch(_this.val()){
		case 'all'://全部
			$('.mangabox').show();break;
		case 'read'://已读
			$('.mangabox').each(function(){
				var _this=$(this);
				if(_this.find('.lastview').attr('chapternum')==_this.find('.newest').attr('chapternum'))
					_this.show();
				else
					_this.hide();
			});
			break;
		case 'new'://有更新
			$('.mangabox').each(function(){
				var _this=$(this);
				if(_this.find('.lastview').attr('chapternum')!=_this.find('.newest').attr('chapternum'))
					_this.show();
				else
					_this.hide();
			});
			break;
	}
});
$('.openurl').click(function(event){
	event.stopPropagation();
	event.preventDefault();
	var _this=$(this)
	var mangabox=_this.parents('.mangabox');
	window.open(_this.attr('url'));
	var url=_this.attr('mangaurl');
	mangadata[url].lastview=parseInt(_this.attr('chapternum'));
	localStorage.mangadata=JSON.stringify(mangadata);
});//绑定打开事件
$('.shwochapterbutton').click(function(event){
	event.stopPropagation();
	event.preventDefault();
	var chapterbox=$('#chapterbox');
	var _this=$(this)
	var mangabox=_this.parents('.mangabox');
	var url=mangabox.attr('mangaurl');
	var chapterdata=mangadata[url].chapterdata;
	if(chapterbox.is(':hidden')){
		chapterbox.find('.chapterbutton').remove();
		chapterbox.find('.author').text(chapterdata.author);
		chapterbox.find('.brief').text(chapterdata.brief);
		var chapterbuttontamplate=$('.chapterbuttontamplate');
		chapterdata.chapters.forEach(function(chapter,i){
			var chapterbutton=chapterbuttontamplate.clone(true).addClass('chapterbutton');
			chapterbutton.attr('url',chapter.url);
			chapterbutton.attr('mangaurl',url);
			chapterbutton.attr('chapternum',i);
			chapterbutton.text(chapter.title);
			chapterbutton.attr('chapternum',i);
			chapterbutton.insertAfter(chapterbuttontamplate);
			chapterbutton.show();
		});
		// for(let i=0;i<mangadata[url].chapters.length;++i){
			// var chapterbutton=chapterbuttontamplate.clone(true).addClass('chapterbutton');
			// chapterbutton.attr('url',mangadata[url].chapters[i].url);
			// chapterbutton.attr('mangaurl',url);
			// chapterbutton.attr('chapternum',i);
			// chapterbutton.text(mangadata[url].chapters[i].title);
			// chapterbutton.attr('chapternum',i);
			// chapterbutton.insertAfter(chapterbuttontamplate);
			// chapterbutton.show();
		// }
		chapterbox.css('order',parseInt(mangabox.css('order'))+1);
		chapterbox.show("normal");
	}else{
		chapterbox.hide("normal");
	}
	// console.log('test');
});//显示章节
$(mangasort).change(function(){
	var _this=$(this);
	function sortbytime(desc) {//desc=false新的在前
		return function(a,b){
			return desc ? a.time-b.time : b.time-a.time;
		}
	}
	function sortbyname(desc) {//desc=true排序为a,b,c,d
		return function(a,b){
			return desc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
		}
	}
	mangaarray=$('.mangabox');
	switch(_this.val()){
		case 'newfirst':
			mangaarray.sort(sortbytime(false));
			break;
		case 'oldfirst':
			mangaarray.sort(sortbytime(true));
			break;
		case 'namepos':
			mangaarray.sort(sortbyname(true));
			break;
		case 'nameneg':
			mangaarray.sort(sortbyname(false));
			break;
	}
	mangaarray.each(function(i,mangabox){mangabox.style.order=2*i;});
});
$(importdata).click(function(){
	
});
$(exportdata).click(function(){
	
});
$(empty).click(function(){
	if(confirm('确认要清空数据吗？'))delete localStorage.mangadata;
});
$(closeserver).click(function(){
	fetch("/__exit");
});
function alertWin(title, msg, w, h) {
        //背景层
        var bgObj = $("<div/>").appendTo('body');
        bgObj.css({
            "position":"absolute",
            "left":"0px",
            "top":"0px",
            "width":"100%",
            "height":"100%",
            "opacity":"0.3",
            "background-color":"#000000",
            "z-index":"1000"
        });

        //创建一个弹出层
        var msgObj=$("<div/>");
        msgObj.attr('id','mul-dialog');
        msgObj.css('z-index','1001');


        msgObj.find('.dialog-drag').mousedown(function (e) {
            var left, top, $this;
            left = e.clientX; top = e.clientY; $this = $(this);
            if(this.setCapture) {
                this.setCapture();
                this.onmousemove = function (ev) { mouseMove(ev || event); };
                this.onmouseup = mouseUp;
            }
            else{
                $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp);
            }
            function mouseMove(e) {
                var target = msgObj;
                var l = e.clientX - left + Number(target.css('margin-left').replace(/px$/, '')) || 0;
                var t = e.clientY - top + Number(target.css('margin-top').replace(/px$/, '')) || 0;
                //l = Math.min(l, $(window).width() - target.width() - target.position().left);
                //t = Math.min(t, $(window).height() - target.height() - target.position().top);
                left = e.clientX;
                top = e.clientY;
                target.css({ 'margin-left': l, 'margin-top': t });
            }
            function mouseUp(e) {
                var el = $this.get(0);
                if(el.releaseCapture) {
                    el.releaseCapture();
                    el.onmousemove = el.onmouseup = null;
                }
                else{
                    $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp);
                }
            }
        });
        msgObj.find('.dialog-control').click(function() {
            bgObj.remove();
            msgObj.remove();
        });


        var dialogbody=msgObj.find('.dialog-body');
        dialogbody.children().remove();
        var table1=$('<table/>').appendTo(dialogbody).width('100%');
        var tr1=$('<tr/>').appendTo(table1);
        var td1=$('<td colspan="2"/>').appendTo(tr1).width('100%').css('padding','10px');
        var mullineinputbox=$("<textarea/>").attr("id","multi_urls").appendTo(td1);
        mullineinputbox.css('width','100%').css('height','100px').css('border-radius','4px').css('border','1px solid rgb(196,196,196)');
        $('head').append("<style>textarea:focus{border:1px solid rgb(192, 217, 255);}</style>");
        dialogbody.css('text-align','center');
        tr1=$('<tr/>').insertAfter(tr1);
        td1=$('<td/>').appendTo(tr1).css('padding-bottom','15px');
        var td2=$('<td/>').insertAfter(td1).css('padding-bottom','15px');
        var button1=$('<button/>');
        button1.attr('class','mul-button');
        button1.css({
            'width':'104px',
            'height':'34px',
            'border-radius':'4px',
            'border-style':'none',
            'font':"normal normal normal normal 13px / 32px 'Microsoft YaHei': SimSun",
            'outline':'none',
            'cursor':'pointer'
        });
        var button2=button1.clone();
        button1.css('background-color',"rgb(59, 140, 255)").css('color','rgb(255,255,255)').text('确定');
        button2.css('border','1px solid rgb(192, 217, 255)').css('background-color',"rgb(255,255,255)").css('color','rgb(59, 140, 255)').text('关闭');
        $('head').append("<style>button.mul-button:hover{opacity:0.7;}</style>");

        td1.append(button1);
        td2.append(button2);
        button1.click(function(){
            urls=$("#multi_urls").val().split("\n");
            button2.click();
            Multi_offline();
            console.debug(urls);
        });
        button2.click(function() {
            bgObj.remove();
            msgObj.remove();
        });
        msgObj.find('.select-text').text(title);
        msgObj.css('width',w);
        msgObj.css({
            'left':bgObj.width()/2-msgObj.width()/2,
            'top':bgObj.height()/2-msgObj.height()/2
        });

    }