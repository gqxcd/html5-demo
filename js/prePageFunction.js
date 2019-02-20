/**
 * author : hww
 * date : 2015/1/8
 * function : 实现点击上一页按钮，切换页面的效果
 */
/**修改
 * author : lt
 * date : 2016/5/2
 * function : 实现点击上一页按钮，切换页面的效果
 */
$.afui.ready(function(e) {
    
	//找到所有的上一页按钮
	var $prePageButtons = $("div.prePageButton");
	
	//对所有的上一页按钮进行遍历
	for(var i = 0 ; i < $prePageButtons.length ; i++){
		
		//为每一个上一页按钮添加click方法
		$($prePageButtons[i]).click(function(){
			
        var pageNum=$(this).parents("div.page").data('id');
			
			$('#page'+[pageNum]).hide();
			pageNum--;
			$('#page'+[pageNum]).show();
	
		});}	
	});