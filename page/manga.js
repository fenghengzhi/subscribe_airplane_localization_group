$(function(){
	if(localStorage.mangaupdate==undefined)
		localStorage.mangaupdate='{}';
	var mangaupdate=JSON.parse(localStorage.mangaupdate);
	var mangadata= new Array(); 

	
		//显示漫画
	var showmanga;
	(function(){

        var updatednum = 0;
		var progressbar=$('<a/>');
		var mangalink=$('<button/>');
		progressbar.appendTo('body');
        showmanga = function(){
            updatednum++;
			if(updatednum<mangadata.length){//进度条
				progressbar.text(updatednum/mangadata.length*100+'%');
			}
			else{//显示漫画
				progressbar.remove();
				for(i=0;i<mangadata.length;i++){
						mangadata[i].time=mangaupdate[mangadata[i].url].time;
						mangadata[i].date=mangaupdate[mangadata[i].url].date;
				}
				function sortby(desc) {
					return function(a,b){
						return desc ? a.time-b.time : b.time-a.time;
					}
				}
				mangadata.sort(sortby(false));
				for(i=0;i<mangadata.length;i++){
					var mangalinkclone=mangalink.clone();
					mangalinkclone.attr('url',mangadata[i].url).html(mangadata[i].name+'<br/>检测到更新于<br/>'+mangadata[i].date+'<br/>').css("cursor","pointer").appendTo('body');
					mangalinkclone.click(function(){
						window.open($(this).attr('url'));
					});
					mangalinkclone.after('<br/>');
				}
			
			}
        }
    })();
	

	//获取漫画列表
	$.get("mangalist.txt", function(data, textStatus){ 
		var mangalist=data.trim().split('\n');
		var manganum=mangalist.length;
		console.debug(mangalist);
		for(i=0;i<manganum;i++){
			mangadata[i]={};
			mangadata[i].url=mangalist[i].split(',')[0];
			mangadata[i].name=mangalist[i].split(',')[1];
		}
		checkupdate();
	});
	//检查更新
	function checkupdate(){
		for(i=0;i<mangadata.length;i++){
			update(mangadata[i].url);
		}
	}
	function update(url){
		$.get("../proxy?url="+encodeURIComponent(url), function(data, textStatus){ 
			if(textStatus=='success'){
				manga=$(data.replace(/src=/g,'_src='));
				var newest=manga.find("a:contains('最新章节')").attr('href');//最新章节
				if(mangaupdate[url]==undefined||mangaupdate[url].newest!=newest){
					mangaupdate[url]={'newest':newest,'date':Date()};
					//manga.find("a:contains('最新章节')[class='am-btn am-btn-primary am-radius");
					localStorage.mangaupdate=JSON.stringify(mangaupdate);
				}
				mangaupdate[url].time=Date.parse(mangaupdate[url].date);
			}
			showmanga();
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


});
