/**
 * author : hww
 * date : 2015/1/6
 * function : 实现点击下一页按钮，切换页面的效果
 */

$.afui.ready(function(e) {
	   var pages=$("div.panel").find(".page");
	   for(var p=1;p<pages.length;p++){
		    $(pages[p]).hide();
	   }
	
	
	
	
	
	
	
	
	
	
	
	
	
	//$(document).on("pagechange",function(){
		//隐藏加载器  
	 //   $.mobile.loading('hide'); 
	  //  $(this).find("div.Question").trigger("resize");
	//});
    
	//找到所有的下一页按钮
	var $nextPageButtons = $("div.submit.nextPageButton");
	
	//对所有的下一页按钮进行遍历
	for(var i = 0 ; i < $nextPageButtons.length ; i++){
		
		//为每一个下一页按钮添加click方法
		$($nextPageButtons[i]).click(function(){
			
			var pageNum=$(this).parents("div.page").data('id');
			
			$('#page'+[pageNum]).hide();
			pageNum++;
			$('#page'+[pageNum]).show();
			//首先找打当前分页对应的div，对当前页进行隐藏
			//var pages = $(this).parents("div.page").nextAll("div.page[ifDisplay=1]");
			
			//for(var k = 0;k<pages.length;k++){
				
				//if($(pages[k]).find("div.Question[hide!=1]").not(".Q_type20").size()!=0){
				//	var nextPage = $(pages[k]);
				//	break;
				//}
					
					
				
			//}
			
			//$( ":mobile-pagecontainer" ).pagecontainer("change",$(nextPage),{transition:"slide"});
			
//			$.mobile.changePage($(nextPage),{transition:"slide"});
			
			//将页面会滚到顶端
//			$('html,body').animate({scrollTop:0}, 'fast');
		
		});}	
	});