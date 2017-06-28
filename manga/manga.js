//alert('mangastart');
(function(){//自执行匿名函数
	//var mangadata=JSON.parse(localStorage.mangadata);
	//显示漫画
	window.mangadata={};
	function showmanga(){
		$('.mangabox').remove();//移除所有漫画
		$('#chapterbox').hide();
		var mangaboxtamplate=$('.mangaboxtamplate');
		for(var mangaurl in mangadata){
			var mangabox=mangaboxtamplate.clone(true).addClass('mangabox');
			try{
				//console.log('start');
				mangabox.show();
				mangabox.appendTo(mangalistbox);
				mangabox[0].mangaurl=mangaurl;
				mangabox[0].time=mangadata[mangaurl].time;
				mangabox[0].name=mangadata[mangaurl].name;
				//mangabox.find('.shwochapterbutton')[0].chapterdata=mangadata[url].chapterdata;
				mangabox.find('.manganame').text(mangadata[mangaurl].name||mangaurl);
				mangabox.find('.mangacover')[0].coverurl=mangadata[mangaurl].coverurl;
				var lastview=mangabox.find('.lastview')[0];
				lastview.url=(mangadata[mangaurl].chapterdata.chapters[(mangadata[mangaurl].lastview||0)]).url;
				lastview.mangaurl=mangaurl;
				lastview.chapternum=mangadata[mangaurl].lastview;
				mangabox.find('.lastviewtitle').text('看到：'+(mangadata[mangaurl].chapterdata.chapters[(mangadata[mangaurl].lastview)]||{title:"未观看"}).title);
				var newest=mangabox.find('.newest')[0];
				newest.url=mangadata[mangaurl].chapterdata.chapters[mangadata[mangaurl].chapterdata.chapters.length-1].url;
				newest.mangaurl=mangaurl;
				newest.chapternum=mangadata[mangaurl].chapterdata.chapters.length-1;
				mangabox.find('.newesttitle').text('最新：'+(mangadata[mangaurl].chapterdata.chapters[mangadata[mangaurl].chapterdata.chapters.length-1]||{title:"未更新"}).title);
				//console.log('end');
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
	//alert();
	$.get("mangalist.txt", function(data, textStatus){ 
		var mangadatastore=JSON.parse(window.localStorage.mangadata||'{}');
		var mangalist=data.trim().replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
		//console.log(mangalist);
		var mangacount=mangalist.length;
		waitupdate.mangacount=mangacount;
		//console.log(mangadatastore);
		mangalist.forEach(function(mangaurl){
			//console.log(url,mangadatastore[url]);
			mangadata[mangaurl]=mangadatastore[mangaurl]||{
				chapterdata:{
					author:undefined,
					brief:undefined,
					mangaurl:mangaurl,
					chapters:[]
				},
				coverurl:undefined,
				lastview:undefined,
				name:undefined,
				time:undefined
			};
		});
		showmanga();
	});
	//检查更新
	function checkupdate(event){
		//console.log('updatenum in checkupdate',waitupdate.updatecount);
		waitupdate.updatecount=0;
		//console.log('updatenum in checkupdate',waitupdate.updatecount);
		for(var mangaurl in mangadata){
			(function(mangaurl){
				$.get("/proxy?url="+encodeURIComponent(mangaurl), function(data, textStatus){ 
					if(textStatus==='success'){
						var manga=$(data.replace(/src=/g,'_src='));
						//manga.find("a:contains('最新章节')[class='am-btn am-btn-primary am-radius']");
						mangadata[mangaurl].coverurl=manga.find('.am-img-thumbnail').attr('_src');
						mangadata[mangaurl].name=manga.filter('title').text();
						mangadata[mangaurl].chapterdata=mangadata[mangaurl].chapterdata||{};
						mangadata[mangaurl].chapterdata.author=manga.find('div.am-u-sm-8 > abbr:nth-child(3)').text();
						mangadata[mangaurl].chapterdata.brief=manga.find('div.am-u-sm-8 > div').text();
						mangadata[mangaurl].chapterdata.mangaurl=mangaurl;
						var chapters=manga.find('a.am-btn-secondary');
						if(mangadata[mangaurl].chapterdata.chapters.length!==chapters.length){
							mangadata[mangaurl].time=(new Date()).valueOf();//时间戳精确到毫秒
							var chapters=manga.find('a.am-btn-secondary');
							mangadata[mangaurl].chapterdata.chapters=new Array(chapters.length);//集数信息
							//mangadata[url].chapters.forEach()
							for(var i=0;i<chapters.length;++i){
								mangadata[mangaurl].chapterdata.chapters[i]={
									url:chapters[i].href,
									title:chapters[i].text
								};
							}
						}
						localStorage.mangadata=JSON.stringify(mangadata);
					}
					waitupdate();
				});
			})(mangaurl);
		}
		event.stopPropagation();
		event.preventDefault();
	}
	$("#updatebutton").one('click',checkupdate);

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
//alert('mangaend');

