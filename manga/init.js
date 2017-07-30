//alert('initstart');
//$(mangalistbox).css('top',$('#header').height()+1);
$('.mangacover').one('click',function(event){
	var coverbox=$(this);
	//coverbox.css('background-image','url('+coverbox.attr('coverurl')+');');
	coverbox.text('');
	var coverimg=$("<img/>").addClass('coverimg').appendTo(coverbox);
	coverimg.attr('src',$(this)[0].coverurl);
	event.stopPropagation();
	event.preventDefault();
});//显示封面
$('.mangaboxtamplate').click(function(event){
	window.open(this.mangaurl);
	event.stopPropagation();
	event.preventDefault();
	//console.log('mangabox');
});
$(searchbox).on('input',function(event){
	event.stopPropagation();
	event.preventDefault();
	if(this.value===""){
		$(mangafilter).change();
		return;
	}
	var searchtext=this.value.toLowerCase();
	$('.mangabox').each(function(){
		var _this=$(this);
		var manganame=$(this).find('.manganame').text().toLowerCase();
		if(manganame.search(searchtext)>=0)_this.show();
		else _this.hide();
	})
});//搜索功能
$(searchbox).focus(function(event){
   if(this.value === "搜索"){
        this.style.color='';
        this.value="";
		event.stopPropagation();
		event.preventDefault();
    }  
}).blur(function(event){
    if(this.value === ""){
        this.style.color='gray';
        this.value='搜索';
		event.stopPropagation();
		event.preventDefault();
    }
});
$(mangafilter).change(function(event){
	switch(this.value){
		case 'all'://全部
			$('.mangabox').show();break;
		case 'read'://已读
			$('.mangabox').each(function(){
				var mangabox=$(this);
				if(mangabox.find('.lastview')[0].chapternum===mangabox.find('.newest')[0].chapternum)
					mangabox.show();
				else
					mangabox.hide();
			});
			break;
		case 'new'://有更新
			$('.mangabox').each(function(){
				var mangabox=$(this);
				if(mangabox.find('.lastview')[0].chapternum!==mangabox.find('.newest')[0].chapternum)
					mangabox.show();
				else
					mangabox.hide();
			});
			break;
		default:break;
	}
	event.stopPropagation();
	event.preventDefault();
});
$('.openurl').click(function(event){
	var _this=$(this);
	var mangabox=_this.parents('.mangabox');
	window.open(this.url);
	var mangaurl=this.mangaurl;
	mangadata[mangaurl].lastview=this.chapternum*1;
	localStorage.mangadata=JSON.stringify(mangadata);
	event.stopPropagation();
	event.preventDefault();
});//绑定打开事件
$(newfirst).click(function(event){
	$('.chapterbutton').each(function(i,chapterbutton){
		chapterbutton.style.order=chapterbutton.chapternum*(-1);
	})
	$(".chaptersort").css("color","black");
	this.style.color="blue";
	event.stopPropagation();
	event.preventDefault();

});
$(oldfirst).click(function(event){
	$('.chapterbutton').each(function(i,chapterbutton){
		chapterbutton.style.order=chapterbutton.chapternum*1;
	})
	$(".chaptersort").css("color","black");
	this.style.color="blue";
	event.stopPropagation();
	event.preventDefault();
});

$('.shwochapterbutton').click(function(event){
	var chapterbox=$('#chapterbox');
	var _this=$(this);
	var mangabox=_this.parents('.mangabox');
	var mangaurl=mangabox[0].mangaurl;
	var chapterdata=mangadata[mangaurl].chapterdata;
	if(chapterbox.is(':hidden')){
		chapterbox.find('.chapterbutton').remove();
		chapterbox.find('.author').text(chapterdata.author);
		chapterbox.find('.brief').text(chapterdata.brief);
		var chapterbuttontamplate=$('.chapterbuttontamplate');
		chapterdata.chapters.forEach(function(chapter,i){
			var chapterbutton=chapterbuttontamplate.clone(true).addClass('chapterbutton');
			chapterbutton[0].url=chapter.url;
			chapterbutton[0].mangaurl=mangaurl;
			chapterbutton[0].chapternum=i;
			chapterbutton.text(chapter.title);
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
		$(newfirst).click();
		chapterbox.css('order',mangabox.css('order')*1+1);
		chapterbox.show("normal");
	}else{
		chapterbox.hide("normal");
	}
	event.stopPropagation();
	event.preventDefault();
	// console.log('test');
});//显示章节
$(mangasort).change(function(event){
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
	switch(this.value){
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
		default:break;
	}
	mangaarray.each(function(i,mangabox){mangabox.style.order=2*i;});
	event.stopPropagation();
	event.preventDefault();
});


//更多菜单
$(importdata).click(function(event){
	event.stopPropagation();
	event.preventDefault();
	var mangadata=prompt('导入');
	if(mangadata!=null)window.localStorage.mangadata=mamgadata;
});
$(exportdata).click(function(event){
	event.stopPropagation();
	event.preventDefault();
	prompt('导出',window.localStorage.mangadata);
});
$(empty).click(function(event){
//alert();
	if(confirm('确认要清空数据吗？')){
	//window.localStorage.mangadata='{}';
	delete window.localStorage.mangadata;
	}
	event.stopPropagation();
	event.preventDefault();
});
$(closeserver).click(function(event){
	fetch("/__exit");
	event.stopPropagation();
	event.preventDefault();
});
//alert('initend');
