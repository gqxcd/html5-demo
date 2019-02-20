/**
 * 按顺序答题时的下一题
 */

$.afui.ready(function(){
	var page = $("div.main").find("#page0");
	
	
	//$( ":mobile-pagecontainer" ).pagecontainer("change",$(page),{transition:"none"});
	
	var questions = $("div.Question");
	/*for(var k=0;k<questions.length;k++){
		//var $question = $(questions[k]);
		//给矩阵题的选择绑定事件，当选择之后才出现下一列选项集
			//if($question.hasClass("Q_type06")||$question.hasClass("Q_type07")
					||$question.hasClass("Q_type09")||$question.hasClass("Q_type08")||$question.hasClass("Q_type24")){
				matrix($question);
				if($question.hasClass("Q_type06")||$question.hasClass("Q_type07")||$question.hasClass("Q_type24")){
					var OptionButtons = $question.find("input.OptionButton");
					for(var i=0;i<OptionButtons.length;i++){
						$(OptionButtons[i]).bind("click",function(){
							var nextQuestion = $(this).parent().parent().parent().next("div.rowOption");
							$(nextQuestion).show();//"normal",function(){
								//if(nextQuestion.length > 0){
								//var scrollHeight = $(nextQuestion).offset().top;
	    						//$("body").animate({scrollTop:scrollHeight}, 'normal');
							//}
								//});
							
    																										
						})
					}
				}else{
					$question.on("change","select,textarea",function(){
						$(this).parents("div.rowOption")
						.next("div.rowOption").slideDown("normal");
					});
				}
				
				
				
			}
		}
		
		*/
	//一开始把所有问题都隐藏起来
	$('.Questions').hide();
	
	//点开始答题的按钮  显示第一题
	$("div#startButton").click(function(){
		
		$(page).hide();
		$('.Questions').show();
		
		var pages=$("div.Questions").find(".page");
		   for(var p=1;p<pages.length;p++){
			    $(pages[p]).hide();
		   }
		
		//$( ":mobile-pagecontainer" ).pagecontainer("change",$(page),{transition:"none"});
		//getLogic(ques);
		
		
	});
	
	//$(document).on("pagechange",function(){
		
	     
	    //$(this).find("div.Question").trigger("resize");
	//});
	
	$("div.main").on("click","div.nextQues",function(){
	var question = $("div.Question:visible");
	var ifquesrequired = $(question).attr("ifquesrequired");
	//假如是必答然而又没回答
	if(ifquesrequired==0&&!ifAnswered(question)){
		//将隐藏的未答提示显示出来
		$(question).find(".ques_required_promote").css({"display":'block'});
		
		return false;
	}else{
		var pageNum=$(this).parents("div.page").data('id');
		
		$('.page'+[pageNum]).hide();
		pageNum++;
		$('.page'+[pageNum]).show();
	}
	
	
	
	});
	
	
	

})


/*矩阵题一题一题显示*/
function matrix(ques){
	var $question = $(ques);
	
		
		var rowOptions = $question.find("div.rowOption");
		$(rowOptions).hide();
		$(rowOptions[0]).show();
	
}

/**判断必答题是否已经回答**/
function ifAnswered(question){
	//判断选择题是否回答了
	if($(question).hasClass("Q_type01")||$(question).hasClass("Q_type02")||$(question).hasClass("Q_type12")||
			$(question).hasClass("Q_type13")||$(question).hasClass("Q_type14")||$(question).hasClass("Q_type15")||
			$(question).hasClass("Q_type18")||$(question).hasClass("Q_type19")){
		//假如变成了下拉布局
		if($(question).hasClass("selectArrange")){
			var select = $(question).find("select");
			var optionId = $(select).find("option:selected").attr("id");
			if(optionId==null){
				return false;
			}
		}else{
			//正常布局
			var options = $(question).find("input.OptionButton:checked");
			if(options.length == 0){
				return false;
			}
		}
		
		// 判断选项填空是否已经填写
		var optionFillBlank = $(question).find("textarea.OptionFillBlank:visible");
		for(var i = 0;i<optionFillBlank.length;i++){
			//check(optionFillBlank[i]);
			var input = $(optionFillBlank[i]).parent().find("input");
         	if($(input).prop("checked")==true||$(question).hasClass("selectArrange")){
         		check(optionFillBlank[i]);
         	}
			var text = $(optionFillBlank[i]).next("div.error_description").text();
			if(text!=""&&text!=null){
				return false;
			}
		}
		return true;
	
	//判断填空题是否回答了
	}else if($(question).hasClass("Q_type03")||$(question).hasClass("Q_type04")
			||$(question).hasClass("Q_type16")||$(question).hasClass("Q_type17")
			||$(question).hasClass("Q_type09")){
		var inputBox = $(question).find("textarea.inputBox");
		for(var i = 0;i<inputBox.length;i++){
			
			check(inputBox[i]);
			var text = $(inputBox[i]).next("div.error_description").text();
			if(text!=""&&text!=null){
				return false;
			}
		}
		
		
		return true;
		
	
	//判断矩阵选择题 是否已经回答了	
	}else if($(question).hasClass("Q_type06")||$(question).hasClass("Q_type07")){
		var rowOptions = $(question).find("tr.rowOption");
		for(var i = 0;i<rowOptions.length;i++){
			var cOption = $(rowOptions[i]).find("input.OptionButton:checked");
			if(cOption.length==0){
				return false;
			}
		}
		//检查矩阵单选和多选问题文本框
		var rowOptionReason= $(question).find("textarea.option-fiLL-Reason:visible");
		for(var i = 0;i<rowOptionReason.length;i++){
			//check(rowOptionReason[i]);
         		check(rowOptionReason[i]);
			var text = $(rowOptionReason[i]).next("div.error_description").text();
			if(text!=""&&text!=null){
				return false;
			}
		}
		
		return true;
	
	//判断矩阵下拉题是否已经回答
	}else if($(question).hasClass("Q_type08")){
		var selects = $(question).find("select.selectOption");
		for(var i = 0;i<selects.length;i++){
			var sOption = $(selects[i]).find("option:selected");
			if($(sOption).attr("id")==null){
				return false;
			}
		}
		
		return true;
		
	//判断滑动条题是否已经回答
	}else if($(question).hasClass("Q_type05")||$(question).hasClass("Q_type25")){
		//查找出所有的滑动条题的滑动条区域
		var slider_areas = $(question).find("div.QuestionContent").find("div.sliderArea");
		
		for(var i = 0;i<slider_areas.length;i++){
			//找到滑动条本身元素
			var slider_it = $(slider_areas[i]).find("input.slider");
			
			//提取每个滑动条当前值
			var optionValue = $(slider_it).val();
	 
			//提取滑动条的answered属性，判断该滑动条是否被用户拖动过
			var answered = (optionValue != "0"?true:false);
			
			if(!answered)
				return false;
		}
		
		return true;
	//判断矩阵量表题是否已经回答
	}else if($(question).hasClass("Q_type24")){
		var Option = $(question).find("div.rowOption");
		
		for(var i = 0;i<Option.length;i++){
			
			
				var optionValue = $(Option[i]).find("input.OptionButton:checked"); 
		
	 
			if(optionValue.length==0){
				return false;
			}
		}
		
		return true;
	
	}else if($(question).hasClass("Q_type11")){
		if($(question).find("img").length!=0){
			var optionValue = $(question).find("div.Option").raty("getScore");
			if(optionValue==null||optionValue==""){
				return false;
			}
		}else{
			var optionValue = $(question).find("input:checked");
			if(optionValue.length==0){
				return false;
			}
		}
		
		return true;
		
	
	//判断排序题是否已经回答
	}else if($(question).hasClass("Q_type22")){
		var max = $(question).find("ul").attr("maxOptionNum");
		
		var sortOptions = $(question).find("div.QuestionContent").find("ul>li");
		
		var optionNum = 0;
		
		for(var i = 0;i<sortOptions.length;i++){
			//获取选项的序号
			var optionValue = $(sortOptions[i]).find("div.mun").text();
			if(optionValue!=null&&optionValue!=""&&!isNaN(optionValue)){
				optionNum++;
			}
		}
		
		if(optionNum == max){
			return true;
		}else{
			return false;
		}
		
	}
}


