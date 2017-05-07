(function(){//自执行匿名函数
	//var mangadata=JSON.parse(localStorage.mangadata);
	//显示漫画
	mangadata={};
	function showmanga(){
		$('.mangabox').remove();//移除所有漫画
		$('#chapterbox').hide();
		var mangaboxtamplate=$('.mangaboxtamplate');
		for(let url in mangadata){
			let mangabox=mangaboxtamplate.clone(true).addClass('mangabox');
			try{
				console.log('start');
				mangabox.show();
				mangabox.appendTo(mangalistbox);
				mangabox.attr('mangaurl',url);
				mangabox.attr('time',mangadata[url].time);
				mangabox.attr('name',mangadata[url].name);
				mangabox[0].time=mangadata[url].time;
				mangabox[0].name=mangadata[url].name;
				//mangabox.find('.shwochapterbutton')[0].chapterdata=mangadata[url].chapterdata;
				mangabox.find('.manganame').text(mangadata[url].name||url);
				mangabox.find('.mangacover').attr('coverurl',mangadata[url].coverurl);
				mangabox.find('.lastview').attr('url',url);
				mangabox.find('.lastview').attr('mangaurl',url);
				mangabox.find('.lastview').attr('chapternum',mangadata[url].lastview);
				mangabox.find('.newest').attr('url',mangadata[url].newest);
				mangabox.find('.newest').attr('mangaurl',url);
				mangabox.find('.newest').attr('chapternum',mangadata[url].chapterdata.chapters.length-1);
				mangabox.find('.lastviewtitle').text('看到：'+(mangadata[url].chapterdata.chapters[(mangadata[url].lastview)]||{title: "未观看"}).title);
				mangabox.find('.newesttitle').text('最新：'+(mangadata[url].chapterdata.chapters[mangadata[url].chapterdata.chapters.length-1]||{title: "未更新"}).title);
				console.log('end');
			}finally{continue;}
		}
		$(mangasort).change();//触发排序事件
	}
	function waitupdate(){
		function updateprocess(process){//process为0~1之间的小数
			var percent=process*100+'%';
			$('#updatebutton').css('background-image','linear-gradient(to right, #00FF00 '+percent+', #FFFFFF '+percent+')');
		}
		waitupdate.updatecount = ++waitupdate.updatecount;		
		if(waitupdate.updatecount<waitupdate.mangacount){//进度条
			updateprocess(waitupdate.updatecount/waitupdate.mangacount);
			//console.log(waitupdate.updatecount/mangaarray.length*100+'%');
		}
		else{//显示漫画
			updateprocess(0);
			showmanga();
			$("#updatebutton").one('click',checkupdate);
		}
	}

	//获取漫画列表
	$.get("mangalist.txt", function(data, textStatus){ 
		var mangadatastore=JSON.parse(window.localStorage.mangadata||'{}');
		var mangalist=data.trim().split('\n');
		var mangacount=mangalist.length;
		waitupdate.mangacount=mangacount;
		mangalist.forEach(function(currentValue){
			let url=currentValue.split(',')[0];
			//let name=currentValue.split(',')[1];
			mangadata[url]=mangadatastore[url]||{};;
		})
		showmanga();
	});
	//检查更新
	function checkupdate(){
		//console.log('updatenum in checkupdate',waitupdate.updatecount);
		waitupdate.updatecount=0;
		//console.log('updatenum in checkupdate',waitupdate.updatecount);
		for(let url in mangadata){
			update(url);
		}
	}
	$("#updatebutton").one('click',checkupdate);
	function update(url){
		$.get("/proxy?url="+encodeURIComponent(url), function(data, textStatus){ 
			if(textStatus=='success'){
				manga=$(data.replace(/src=/g,'_src='));
				let newest=manga.find("a:contains('最新章节')").attr('href');//最新章节
				//manga.find("a:contains('最新章节')[class='am-btn am-btn-primary am-radius']");
				mangadata[url].coverurl=manga.find('.am-img-thumbnail').attr('_src');
				mangadata[url].name=manga.filter('title').text();
				mangadata[url].chapterdata=mangadata[url].chapterdata||{};
				mangadata[url].chapterdata.author=manga.find('div.am-u-sm-8 > abbr:nth-child(3)').text();
				mangadata[url].chapterdata.brief=manga.find('div.am-u-sm-8 > div').text();
				if(mangadata[url].newest!=newest){
					mangadata[url].newest=newest;//最新一话url
					mangadata[url].time=(new Date()).valueOf();//时间戳精确到毫秒
					let chapters=manga.find('a.am-btn-secondary');
					mangadata[url].chapterdata.chapters=new Array(chapters.length);//集数信息
					//mangadata[url].chapters.forEach()
					for(let i=0;i<chapters.length;++i){
						mangadata[url].chapterdata.chapters[i]={
							url:chapters[i].href,
							title:chapters[i].text
						};
					}
				}
				localStorage.mangadata=JSON.stringify(mangadata);
			}
			waitupdate();
		});
	}
// $('body').append('<button>测试按钮</button>').click(function(){
// window.open("http://smp.yoedge.com/view/omnibus/1001178");
// });

// var mangabutton=$('<button>测试按钮1</button>').click(function(){
// window.open("http://smp.yoedge.com/view/omnibus/1001178");
// });

// mangabutton.appendTo('body');
// mangabutton.appendTo('body');
// mangabutton.clone().appendTo('body');

// $.get("../proxy?url=http%3a%2f%2fsmp.yoedge.com%2fview%2fomnibus%2f1001178", function(data, textStatus){ 
// var manga=$(data);
// manga.find('.am-btn&.am-btn-secondary&.am-radius&.am-btn-sm').length
// });
/* mangadata数据详解
mangadata[url]={
	chapterdata={
		author:
		brief:
		chapters:[{title:,url:,},...]
	}
	coverurl:
	lastview:
	name:
	newest:
	time:
} */
})();
