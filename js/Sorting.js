/**
 * 排序题实现
 */

$.afui.ready(function(){ 
	
		//找到问卷对应的div，class为main
	    var $qnaire = $("div.main");
		
	    //获取所有的问题
	    var $questions = $qnaire.find("div.Questions").find("div.Question");

	    //对问题进行遍历
	    $.each($questions, function(i, question){
	    	if($(question).hasClass("Q_type24")){
	    		//调整矩阵量表题div的高度
	    		var num = $(question).find("tr").length;
	    		$(question).css("height",num*100);
	    	} 
	    });
	
});


$.afui.ready(function(){
	//第一次排序
	$("li.unsort").on("tap",function(){
			
			var $ul = $(this).parent();
			var num = $ul.attr("maxOptionNum");
			//获取已经排序的选项
			var $sorted = $ul.find("li.Slist");
			var size = $sorted.length;
			var munNumber=$ul.find('div.mun');//获取当前题目所有排好的选项排名
			var munNumberText=new Array(num);//声明数组存取排好的排名数字
			var firstMunNumber=1;       //声明当前未排的最小名次
			//取出已排好的名次存进munNumber[]
			if(munNumber.length>0){    
				for(var j=0;j<num;j++){
					munNumberText[j]=parseInt($(munNumber[j]).text());
				}
				munNumberText.sort(compare);
			}
			
			//获取当前未排的最小名次
			for(var i=0;i<munNumberText.length;i++){
				if(firstMunNumber!=munNumberText[i]){
					break;
				}else{
					firstMunNumber++;
				}
			}
			
			if(size!=num){
				
				//添加第二次排序时的下拉选项以及此时的顺序排序的标识
				var html = '<div class="mun">'+(firstMunNumber)+"</div>";
			}else{
				var html = '<div class="mun" style="display:none;">'+"</div>";
			}
				
		    
				html += '<select class="S_select" style="display:inline-block" onchange="switchOption(this)">';
				html += '<option>请选择</option>';
				for(var i=0;i<num;i++){
					html += '<option mum="'+(i+1)+'">移动到第'+(i+1)+'位</option>';
				}
				html += "</select>";
				$(this).append(html);
				if(size!=num){
					$(this).attr("class","Slist Option");
				}else{
					$(this).addClass("Slist");
				}
				
			
			
			//按排序的顺序显示选项
			$(this).remove();
			if($sorted.length!=0){
				$(this).insertAfter($sorted.last());
			}else{
				$(this).insertBefore($ul.find("li").first());
			}
			
			
			
		
	});
	

	
	
});

function switchOption(val){
	//当第一次排序完成之后通过下拉列表对选项进行第二次排序
	
	//要换的li
	var $li = $(val).parent();
	//获取当前选项的位置
	var index1 = parseInt($(val).parent().find("div.mun").text());
	var $ul = $li.parent();
	//获取选项个数
	var length = $ul.find("li").length;
	//获取要换的选项的位置
	var $temp2 = $(val).find("option:selected");
	var index2 = parseInt($temp2.attr("mum"));
	
	//假如选中的是请选择 则不更新排序
	if(isNaN(index2)){
		return false;
	}
	

	
	//被换的li
	var $li2 = $ul.find("div.mun:contains("+index2+")").parent();

	//找出 unsort的
	if(isNaN(index1)){
		$li.toggleClass("unsort");
		$li2.toggleClass("unsort");
		$li.find("div.mun").show();
		$li2.find("div.mun").hide();
	}
	
	//更新位置标识
	$li.find("div.mun").text(index2);
	$li2.find("div.mun").text(index1);
	

	//对所有选项重新排序显示
	var $sorted = $ul.find("li.Slist");
	var $unsorted = $ul.find("li.unsort");
	$ul.find("li").detach();
	for(var i = 1;i<=length;i++){
		var $temp = $sorted.find("div:contains("+i+")").parent();
		if($temp.length!=0){
			$ul.append($temp);
		}
		
	}
	
	$.each($unsorted,function(i,uli){
		$ul.append($(uli));
	});
	

}

function compare(value1,value2){
	if(value1<value2){
		return -1;
	}else if(value1>value2){
		return 1;
	}else{
		return 0;
	}
}

