/**
 * function:该脚本用来在移动端收集问卷中所有的问题的答案，进行打包之后发送到后台
 * author:  hww
 * date:  2015/4/8
 */

$.afui.ready(function(){
	
	//用来判断是否所有的必答题都已经回答
	var if_required_answered_flag = new Array();
	
	var ifSubmit_flag = false;
	
    //答案收集的API地址
	var remote_url = '/Questionaire/SaveAnswers/SaveQnaire';
	
	//答卷开始时间
	Date.prototype.Format = function (fmt) { //author: meizz 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	//答卷开始时间
	var ansSheetStartTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
	
	
	//终端类型
	var termType = 0;//其他
	if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/))) { 
			    termType = 1;//移动终端
			}else{ 
				termType = 2;//电脑
			} 
	  
	//给提交按钮添加click方法
	$("div.qnaireSubmit").click(function(){
		
		//如果该答卷中包含用户的邮箱，则将用户的邮箱取出来
		var userEmail = null;
		var input_email = $("input.AnswerUserEmail");
		
		//答卷来源
		var ansSheetWay = 0;//通过公开链接填写
		
		if(input_email.size()!=0){
			
			userEmail = input_email.val();
			ansSheetWay = 1;//通过邮箱推送填写
		}
		
		//获取shorturl
		var shortUrl = window.location.toString().match(/\?.{10}/);
		
		shortUrl = shortUrl.toString();
		var Request = {
				QueryString : function(item) {
					var svalue = location.search
							.match(new RegExp("[\?\&]" + item
									+ "=([^\&]*)(\&?)", "i"));
					return svalue ? svalue[1] : svalue;
				}
			}
		var parms = Request.QueryString("parms");
		var userId = Request.QueryString("userId");
	    //找到问卷对应的div，class为main
	    var $qnaire = $("div.main");
	
        //从main div 中提取问卷的id
	    var $qnaireId = $qnaire.attr("id");
	
	    //从main div中获取所有问题对应的 div，class为Question
	    var $questions = $qnaire.find("div.Question");
	
	    //用来存放每一道题的答案
	    var answers = new Array();
	
	    //对问题进行遍历
	    $.each($questions, function(i, question){
		
		    //对每一道题的答案进行收集
		    var answer = processQuestion(question)
		
		    //如果该问题返回的answer不为空，将该题的答案存放如答案数组中
		    if(answer!=null){
		    	
		    answers.push(answer);
		    
		    }});
	
	    //所有的问题答案收集完毕之后，将答案数组转化为json数组
	    answers = JSON.stringify(answers);	
	    
	    var submitIdCode=$(".submitIdCode").val();
	    
	    //打包所有的参数：问卷id 答卷是否有效 所有问题的答案
	    //打包所有的参数：问卷id 答卷是否有效 所有问题的答案
	    var parameters = new answerSheet_constructor($qnaireId,1,answers,userEmail,shortUrl,ansSheetWay,ansSheetStartTime,1,termType,submitIdCode,parms,userId);	
	
        var flag = true;
	    
        if(if_required_answered_flag.length!=0){
	    	
	    	var x = 0;
	    	while(x<if_required_answered_flag.length){
	    		var temp = if_required_answered_flag[x];
	    		if(temp==false){
	    			flag=false;
	    			break;
	    		}
	    		x++;
	    	}}
        
        var error_description = $qnaire.find("div.error_description");
	    
	    for(var i = 0;i<error_description.length;i++){
	    	var text = $(error_description[i]).text();
	    	if(text!=""&&text!=null){
	    		flag=false;
	    		break;
	    	}
	    }
	    
	    //将数组清空
	    if_required_answered_flag = new Array();
	    
	    
	    if(flag==true){
	    	
	    	if(ifSubmit_flag==false){
	    		ifSubmit_flag=true;
	    		ajaxAbstract_1("post",remote_url,parameters,callback);
	    		
	    	}
	    	
	    }else{
	    	
	    	//提示回答者有必答题没有回答
	    	alert("有必答题没有回答，请回答后再提交！");
	    	
	    	$("div.page").show();
	    	
	    	var ques_not_answer = $questions.has("span.ques_required_promote:visible").first();
	    	
	    	if(ques_not_answer.size()==0){
	    		var ques_not_answer = $questions.has("div.error_description:visible").first();
	    	}
	    	
	    	$("div.page").hide();
	    	
	    	$(ques_not_answer).parents("div.page").show();
	    	
	    	scrollOffset(ques_not_answer.offset());
	    	
	    }
	
	});
	
	
//对每一个问题，根据其题型的不同，采用不同的方式将其答案取出来
function processQuestion(question){
	
	//获取问题id
	var $quesId = $(question).attr("id");
	
	//获取该问题是否必答属性
	var $ifQuesRequired = $(question).attr("ifquesrequired");
	
	/**********如果该问题的题型为：单选题、多选题、评分单选题、评分多选题、考试单选题、考试多选题、投票单选题、投票多选题**********/
	
	if($(question).hasClass("Q_type01")||$(question).hasClass("Q_type02")||$(question).hasClass("Q_type12")||
			$(question).hasClass("Q_type13")||$(question).hasClass("Q_type14")||$(question).hasClass("Q_type15")||
			$(question).hasClass("Q_type18")||$(question).hasClass("Q_type19")){
	
		if($(question).hasClass("selectArrange")){
			var $select = $(question).find("select");
			//答案值数组，用来存放该问题的所有答案值
			var answervalue_array = new Array();
			
			var optionId = $select.find("option:selected").attr("id");
			
			var fillBlank = $select.parent().parent().next();
			
			 var fillBlankValue = "未填写";
			    
			    //判断填空框是否存在
			    if(fillBlank.css("display")!="none"){
			    	check(fillBlank);
			        //获取填空框的值
			    	fillBlankValue = fillBlank.val();
			    	
			    };
			    
			if(optionId==null){
				
			}else{
				 //创建答案值对象
			    var answervalue = new answerValue_constructor(optionId,-1,-1,fillBlankValue);
			
			    //将答案值保存到数组中
			    answervalue_array.push(answervalue);
			}
		}else{
			//获取问题的checked选项
			var $checkedOptions = $(question).find("div.QuestionContent").find("input.OptionButton:checked");
			
			//答案值数组，用来存放该问题的所有答案值
			var answervalue_array = new Array();
			
			//遍历所有的checkedOption
			$.each($checkedOptions, function(j, option){
			
			    //获取checked选项的id
			    var optionId = $(option).attr("id");
			    
			    //获取选项后面的填空框
			    var fillBlank = $(option).parents("div.Option").find("textarea.OptionFillBlank");
			   
			    var fillBlankValue = "未填写";
			    
			    //判断填空框是否存在
			    if(fillBlank.size()!=0){
			    	check(fillBlank);
			        //获取填空框的值
			    	fillBlankValue = fillBlank.val();
			    	
			    };
			
			    //创建答案值对象
			    var answervalue = new answerValue_constructor(optionId,-1,-1,fillBlankValue);
			
			    //将答案值保存到数组中
			    answervalue_array.push(answervalue);
			});
		}
	
	
	//判断该题的状态是否为显示
	if($(question).css("display")!="none"){
	
	//判断该题是否必答和是否有答案
	if($ifQuesRequired==0&&answervalue_array.length==0){
		
		if_required_answered_flag.push(false);
		
		//将隐藏的未答提示显示出来
		$(question).find("span.ques_required_promote").css({"display":'block'});
		
		return null;
		
	}else if(answervalue_array.length!=0){
		
		if_required_answered_flag.push(true);
	    
		//将显示的未答提示隐藏起来
		$(question).find("span.ques_required_promote").css({"display":'none'});
		
		//答案对象，用来存放该题的题号和答案值
		var answer = new answer_constructor($quesId,answervalue_array);	
		
		//返回该问题的答案
		return answer;
	}	
	}
		
	/***********如果该问题的题型为：单项填空 多项填空题 考试单项填空题 考试多项填空题**************************************/
	
	}else if($(question).hasClass("Q_type03")||$(question).hasClass("Q_type04")
			||$(question).hasClass("Q_type16")||$(question).hasClass("Q_type17")){
		
		//获取填空题的所有的输入框
		var $textInputs = $(question).find("div.QuestionContent").find("textarea.inputBox");
		
		//答案值数组，用来存放该问题的所有答案值
		var answervalue_array = new Array();
		
		//遍历所有的输入框
		$.each($textInputs, function(j, inputtext){
			
			//获取输入框的id
			var optionId = $(inputtext).attr("id");
			
		    //获取输入框的值
		    var inputvalue = $(inputtext).val();
		
		    //如果输入框的值不为空
		    if(inputvalue!=null&&inputvalue.length!=0){
		    	
		    //创建答案值对象
		    var answervalue = new answerValue_constructor(optionId,-1,-1,inputvalue);
		
		    //将答案值保存到数组中
		    answervalue_array.push(answervalue);
		 
		    }});
		
		//判断该题的状态是否为显示
		if($(question).css("display")!="none"){
			$.each($textInputs, function(j, inputtext){
				check(inputtext);
			});
		
		//判断该题是否必答和是否有答案
		if($ifQuesRequired==0&&answervalue_array.length==0){
			
			if_required_answered_flag.push(false);
			
			//将隐藏的未答提示显示出来
			$(question).find("span.ques_required_promote").css({"display":'block'});
			
			return null;
			
		}else if(answervalue_array.length!=0){
			
			if_required_answered_flag.push(true);
			
			//将显示的未答提示隐藏起来
			$(question).find("span.ques_required_promote").css({"display":'none'});
		    
			//答案对象，用来存放该题的题号和答案值
			var answer = new answer_constructor($quesId,answervalue_array);	
		    
			//返回该问题的答案
			return answer;
		}	
		
		}
	
	/******************如果该问题的题型为：矩阵单选题、矩阵多选题**************************************************/
	
	}else if($(question).hasClass("Q_type06")||$(question).hasClass("Q_type07")||$(question).hasClass("Q_type24")){
	
		//获取问题的checked选项
		var $checkedOptions = $(question).find("div.QuestionContent").find("input.OptionButton:checked");
	
		//答案值数组，用来存放该问题的所有答案值
		var answervalue_array = new Array();
	
		//遍历所有的checkedOption
		$.each($checkedOptions, function(j, option){
	    
			//获取checked选项的id
			var optionId = $(option).attr("id");

			//对optionId进行解析，提取出行id和列id
			var ids = optionId.split('-');
			var rowId = ids[0];
			var colId = ids[1];
			
			//获取选项后面的填空框
			 var idOption= $(option).parents('td').data('id')
			 var fillBlank = $("#"+idOption).find("textarea.option-fiLL-Reason");
		   
		   
		    var fillBlankValue = "未填写";
		    
		    //判断填空框是否存在
		    if(fillBlank.size()!=0){
		    	check(fillBlank);
		        //获取填空框的值
		    	fillBlankValue = fillBlank.val();
		    	
		    };
			
			//创建答案值对象
			var answervalue = new answerValue_constructor(rowId,colId,-1,fillBlankValue);
	  
			//将答案值保存到数组中
			answervalue_array.push(answervalue);
		});
		
		//判断该题的状态是否为显示
		if($(question).css("display")!="none"){
		
		//判断该题是否必答和是否有答案
		if($ifQuesRequired==0&&answervalue_array.length==0){
			
			if_required_answered_flag.push(false);
			
			//将隐藏的未答提示显示出来
			$(question).find(".ques_required_promote").css({"display":'block'});
			
			return null;
			
		}else if(answervalue_array.length!=0){
			
			if_required_answered_flag.push(true);
	
			//将显示的未答提示隐藏起来
			$(question).find(".ques_required_promote").css({"display":'none'});
			
			//答案对象，用来存放该题的题号和答案值
			var answer = new answer_constructor($quesId,answervalue_array);	
		    
			//返回该问题的答案
			return answer;	
		}	
		
		}
		
/******************如果该问题的题型为：矩阵下拉题**************************************************/
	
	}else if($(question).hasClass("Q_type08")){

	    //获取问题的selected选项
		var $selectedOptions = $(question).find("div.QuestionContent").find("option:selected");

	    //答案值数组，用来存放该问题的所有答案值
	    var answervalue_array = new Array();

	    //遍历所有的checkedOption
	    $.each($selectedOptions, function(j, option){
    
		//获取checked选项的id
		var optionId = $(option).attr("id");

		//选中了请选择
		if(optionId==null){
			
		}else{

		//对optionId进行解析，提取出行id、列id和下拉id
		var ids = optionId.split('-');
		var rowId = ids[0];
		var colId = ids[1];
		var listId = ids[2];
		
		//创建答案值对象
		var answervalue = new answerValue_constructor(rowId,colId,listId,null);
  
		//将答案值保存到数组中
		answervalue_array.push(answervalue);
		}
});
	
	  //判断该题的状态是否为显示
		if($(question).css("display")!="none"){
	    
	    //判断该题是否必答和是否有答案
		if($ifQuesRequired==0&&answervalue_array.length==0){
			
			if_required_answered_flag.push(false);
			
			//将隐藏的未答提示显示出来
			$(question).find(".ques_required_promote").css({"display":'block'});
			
			return null;
			
		}else if(answervalue_array.length!=0){
			
			if_required_answered_flag.push(true);

			//将显示的未答提示隐藏起来
			$(question).find(".ques_required_promote").css({"display":'none'});
			
			//答案对象，用来存放该题的题号和答案值
			var answer = new answer_constructor($quesId,answervalue_array);	
		
			//返回该问题的答案
			return answer;	
	}	
		}

/******************如果该问题的题型为：矩阵填空题**************************************************/

	}else if($(question).hasClass("Q_type09")){
	
		//获取填空题的所有的输入框
		var $textInputs = $(question).find("div.QuestionContent").find("div.rowOption").find("textarea.inputBox");
		
		//答案值数组，用来存放该问题的所有答案值
		var answervalue_array = new Array();
		
		//遍历所有的输入框
		$.each($textInputs, function(j, inputtext){
			
			//获取输入框的id
			var optionId = $(inputtext).attr("id");
	
			//对optionId进行解析，提取出行id、列id和下拉id
			var ids = optionId.split('-');
			var rowId = ids[0];
			var colId = ids[1];
			
		    //获取输入框的值
		    var inputvalue = $(inputtext).val();
		
		    //如果输入框的值不为空
		    if(inputvalue!=null&&inputvalue!=""){
		    
		    //创建答案值对象
		    var answervalue = new answerValue_constructor(rowId,colId,-1,inputvalue);
		
		    //将答案值保存到数组中
		    answervalue_array.push(answervalue);
		  
		    }
		});
		
		//判断该题的状态是否为显示
		if($(question).css("display")!="none"){
			$.each($textInputs, function(j, inputtext){
				check(inputtext);
			});
		//判断该题是否必答和是否有答案
		if($ifQuesRequired==0&&answervalue_array.length==0){
			
			if_required_answered_flag.push(false);
			
			//将隐藏的未答提示显示出来
			$(question).find(".ques_required_promote").css({"display":'block'});
			
			return null;
			
		}else if(answervalue_array.length!=0){
			
			if_required_answered_flag.push(true);
			
			//将显示的未答提示隐藏起来
			$(question).find(".ques_required_promote").css({"display":'none'});
		    
			//答案对象，用来存放该题的题号和答案值
			var answer = new answer_constructor($quesId,answervalue_array);	
		    
			//返回该问题的答案
			return answer;		
	}

		}
	/**********如果该问题的题型为：矩阵滑动条题**********/
	
	}else if($(question).hasClass("Q_type05")){
	
		//查找出所有的滑动条题的滑动条区域
		var $slider_areas = $(question).find("div.QuestionContent").find("div.sliderArea");
		
		//答案值数组，用来存放该问题的所有答案值
    	var answervalue_array = new Array();
		
		//对该题的每个滑动条区域进行遍历
		$.each($slider_areas,function(i,slider_area){
			
			//找到滑动条本身元素
			var slider_it = $(slider_area).find("input.slider");
			
			//提取选项id
			var optionId = $(slider_it).attr("id");
			
			//提取每个滑动条当前值
			var optionValue = $(slider_it).val();
	 
			//提取滑动条的answered属性，判断该滑动条是否被用户拖动过
			var answered = (optionValue != "0"?"true":"false");
			
		    if(answered=="true"){
		
			    //创建答案值对象
			    var answervalue = new answerValue_constructor(optionId,-1,-1,optionValue);
	
	            //将答案值保存到数组中
	            answervalue_array.push(answervalue);
		    }});
	
	
		//判断该题的状态是否为显示
		if($(question).css("display")!="none"){
		
		//判断该题是否必答和是否有答案
		if($ifQuesRequired==0&&answervalue_array.length==0){
			
			if_required_answered_flag.push(false);
			
			//将隐藏的未答提示显示出来
			$(question).find(".ques_required_promote").css({"display":'block'});
			
			return null;
			
		}else if(answervalue_array.length!=0){
			
			if_required_answered_flag.push(true);
			
			//将显示的未答提示隐藏起来
			$(question).find(".ques_required_promote").css({"display":'none'});
	    
			//答案对象，用来存放该题的题号和答案值
			var answer = new answer_constructor($quesId,answervalue_array);	
		
			//返回该问题的答案
			return answer;
	}	
		}

		
    /**********如果该问题的题型为：量表题 或矩阵量表题**********/

	}else if($(question).hasClass("Q_type11")){
		
	
		var Option = $(question).find("div.QuestionContent").find("div.Option");
		if($(question).attr("scaleStyleType")!=3){
		//查找出量表题被选中的选项
			var score = $(Option).raty('getScore');
			Option = $(Option).find("img:eq("+(score-1)+")");
		}
	
		//答案值数组，用来存放该问题的所有答案值
		var answervalue_array = new Array();
		
			//提取列选项的id（量表题没有行）
			var optionId = $(Option).attr("id");
			
			
	 
			if(optionId==null||optionId==""){
				
			}else{
			
			    //创建答案值对象
			    var answervalue = new answerValue_constructor(-1,optionId,-1,null);
	
	            //将答案值保存到数组中
	            answervalue_array.push(answervalue);
	
			}
		
		//判断该题的状态是否为显示
		if($(question).css("display")!="none"){
		
		//判断该题是否必答和是否有答案
		if($ifQuesRequired==0&&answervalue_array.length==0){
			
			if_required_answered_flag.push(false);
			
			//将隐藏的未答提示显示出来
			$(question).find(".ques_required_promote").css({"display":'block'});
			
			return null;
			
		}else if(answervalue_array.length!=0){
			
			if_required_answered_flag.push(true);
			
			//将显示的未答提示隐藏起来
			$(question).find(".ques_required_promote").css({"display":'none'});
    
		    //答案对象，用来存放该题的题号和答案值
		    var answer = new answer_constructor($quesId,answervalue_array);	
	
		    //返回该问题的答案
		    return answer;
    	}	
		}
	
	/************如果问题的类型为：滑动题**************/
}else if($(question).hasClass("Q_type25")){
	
	//查找出所有的滑动条题的滑动条区域
	var $slider_area = $(question).find("div.QuestionContent").find("div.sliderArea");
	
	//答案值数组，用来存放该问题的所有答案值
	var answervalue_array = new Array();
	
		
		//找到滑动条本身元素
		var slider_it = $slider_area.find("input.slider");
		
		//提取选项id
		var optionId = $(slider_it).attr("id");
		
		//提取每个滑动条当前值
		var optionValue = $(slider_it).val();
 
		//提取滑动条的answered属性，判断该滑动条是否被用户拖动过
		var answered = (optionValue != "0"?"true":"false");
		
	    if(answered=="true"){
	
		    //创建答案值对象
		    var answervalue = new answerValue_constructor(optionId,-1,-1,optionValue);

            //将答案值保存到数组中
            answervalue_array.push(answervalue);
	    }


	//判断该题的状态是否为显示
	if($(question).css("display")!="none"){
	
	//判断该题是否必答和是否有答案
	if($ifQuesRequired==0&&answervalue_array.length==0){
		
		if_required_answered_flag.push(false);
		
		//将隐藏的未答提示显示出来
		$(question).find(".ques_required_promote").css({"display":'block'});
		
		return null;
		
	}else if(answervalue_array.length!=0){
		
		if_required_answered_flag.push(true);
		
		//将显示的未答提示隐藏起来
		$(question).find(".ques_required_promote").css({"display":'none'});
    
		//答案对象，用来存放该题的题号和答案值
		var answer = new answer_constructor($quesId,answervalue_array);	
	
		//返回该问题的答案
		return answer;
	}	
	}
	/**************如果问题类型为：排序题******************/
}else if($(question).hasClass("Q_type22")){
	//获取排序题的所有选项
	var $sortOptions = $(question).find("div.QuestionContent").find("ul>li");
	
	//答案值数组，用来存放该问题的所有答案值
	var answervalue_array = new Array();
	
	//对排序题的所有选项进行遍历
	$.each($sortOptions,function(i,sortOption){
		//提取选项id
		var optionId = $(sortOption).attr("id");
		//获取选项的序号
		var optionValue = $(sortOption).find("div.mun").text();
		
		if(optionValue!=null&&optionValue!=""&&!isNaN(optionValue)){
			//创建答案值对象
		    var answervalue = new answerValue_constructor(optionId,-1,-1,optionValue);

            //将答案值保存到数组中
            answervalue_array.push(answervalue);
		}
	});
	
	
	//判断该题的状态是否为显示
	if($(question).css("display")!="none"){
	
	//判断该题是否必答和是否有答案
	if($ifQuesRequired==0&&answervalue_array.length==0){
		
		if_required_answered_flag.push(false);
		
		//将隐藏的未答提示显示出来
		$(question).find(".ques_required_promote").css({"display":'block'});
		
		return null;
		
	}else if(answervalue_array.length!=0){
		
		if_required_answered_flag.push(true);
		
		//将显示的未答提示隐藏起来
		$(question).find(".ques_required_promote").css({"display":'none'});
    
		//答案对象，用来存放该题的题号和答案值
		var answer = new answer_constructor($quesId,answervalue_array);	
	
		//返回该问题的答案
		return answer;
	}	
	}
}
	
	
}//这是processQuestion function的结束符

//利用ajax访问后台API的通用函数
function ajaxAbstract_1(method,remote_url,send_data,callback){
	$.ajax({
		type:method,
		url:remote_url,
		data:send_data,
		dataType: 'json',
		success: function(result) {
			if (result == "" || result == null) {
				NotifyEmptyResult();
			} else {
				callback(result);
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			ifSubmit_flag=false;
			NotifyTryAgain();
		}});}


//回调函数
function callback(result){
	if((result.code==0)&&(result.msg=="exception")){
		ifSubmit_flag = false;
		alert("提交失败，请重新提交");
	}else if((result.code==0)&&(result.msg=="AlreadyAnswered")){
		
		location.href="/Questionaire/web/Qdisplay/error_already_answered.html";
		return ;
	}
if(result.msg=="wrong_submitIdCode"){
		ifSubmit_flag=false;
		$("div.wrongCode").show();
	}else{
		var thanksInfo=result.thanksInfo;
		if(thanksInfo!="none"&&thanksInfo!=null){
			location.replace("/Questionaire/web/Qdisplay/thanks.jsp?thanksInfo="+encodeURI(encodeURI(thanksInfo)));
			window.event.returnValue = false;
		}else{
			alert("感谢填写，答卷已经保存！");
			locaiton.replace("/Questionaire/web/Qdisplay/thanks.html");
			window.event.returnValue = false;
		}
	}
}

//答案值类，该类对应answerValue表中的一条记录
function answerValue_constructor(rowId,colId,listId,value){
	
	this.rowId  = rowId;    //行选项id
	this.colId  = colId;    //列选项id
	this.listId = listId;   //下拉选项id
	this.value  = value;    //选项值
}

//答案类，该类对应answer表中的一条记录
function answer_constructor(quesId,optionsArray){
	
	this.quesId       = quesId;             //问题id
	this.optionsArray = optionsArray;       //该数组包含此答案涉及的所有选项	
}

//答卷类，该类对应answerSheet表中的一条记录
function answerSheet_constructor(qnaireId,ifAnsSheetValid,answers,userEmail,shortUrl,ansSheetWay,ansSheetStartTime,browserType,ansSheetremark,submitIdCode,parms,userId){
	
	this.qnaireId          = qnaireId;                //该答卷对应的问卷id
	this.ifAnsSheetValid   = ifAnsSheetValid;         //答卷是否有效
	this.answers           = answers;                 //该答卷的所有答案
	this.userEmail         = userEmail;               //该答卷的回答者Email
	this.shortUrl          = shortUrl;                
	this.ansSheetWay       = ansSheetWay;             //答卷来源
	this.ansSheetStartTime = ansSheetStartTime;       //答卷开始时间
	this.browserType       = browserType;             //浏览器类型
	this.ansSheetRemark    = ansSheetremark;          //终端类型
	this.submitIdCode      = submitIdCode;
	this.parms = parms; //自定义参数
	this.userId = userId;//用户id
}

function scrollOffset(scroll_offset) {
    $("body,html").animate({scrollTop: scroll_offset.top-100}, 0);
  }

function NotifyTryAgain() {
	ifSubmit_flag = false;
	alert("网络出错，请稍后再试！");
}


});