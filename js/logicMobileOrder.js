/**
 * 一题一题按顺序答题的逻辑处理
 */
//$(document).ready(function(){
//	getLogic();
//});
//先从逻辑标签获取每一题的逻辑
function getLogic(currentQues){
	//获取问卷中所有题目的逻辑标签
	var input_logics=$(currentQues).find('input.logics.haslogic');
	/**paras的形式是type，option，value1，value2*/
	for(var i=0;i<input_logics.length;i++){

		//获取每道题的所有逻辑
		$("div.main").off("click","div.nextQues");
		var logics = $(input_logics[i]).val();
		
		var logicValues = logics.split(";");
		for(var k=0;k<logicValues.length;k++){
			if(logicValues[k]!=null&&logicValues[k]!=""){
				var paras = logicValues[k].split(".");
				var qlogic = new questionLogic(currentQues,paras[0],paras[2],paras[3],paras[1]);
				qlogic.processLogic(logics);
			}
		}
		
		$("div.main").on("click","div.nextQues",function(){
			
			var question = $("div.Question:visible");
			var ifquesrequired = $(question).attr("ifquesrequired");
			//假如是必答然而又没回答
			if(ifquesrequired==0&&!ifAnswered(question)){
				//将隐藏的未答提示显示出来
				$(question).find(".ques_required_promote").css({"display":'block'});
				
				return false;
			}
			
			//找出下一题需要回答的题目
			var page = $("div.Question:visible").parents("div.page").nextAll("div.page[ifAnswered=1]").first();
			
			
			
			$( ":mobile-pagecontainer" ).pagecontainer("change",$(page),{transition:"none"});
			
			
			//给按钮绑定逻辑
			getLogic($(page).find("div.Question"));
		});
	}
}
//问题的逻辑
function questionLogic(ques,type,value1,value2,option){
	this.ques = ques;  //当前的问题
	this.type = type;  //逻辑的类型
	this.value1 = value1;
	this.value2 = value2;
	this.option = option;
}

questionLogic.prototype.processLogic = function(logics){
	var optionId = this.option;
	var cQues = this.ques;
	var value1 = this.value1;
	var value2 = this.value2;
	 if(this.type==1){
		 $("div.main").on("click","div.nextQues",function(){
			 if($(cQues).hasClass("selectArrange")){
					var options = $(cQues).find("option:selected");
				}else{
					var options = $(cQues).find("input:checked");
				}
			 
			 if(options.size()!=0){
				 var test = $(cQues).parents("div.page").nextUntil("div.page[id=p"+value1+"]");
					for(var i = 0;i<test.length;i++){
						$(test[i]).attr("ifAnswered","0");
					}
			 }
		 });
	/**如果逻辑类型是有条件跳题（任意）***/
	//把跳过的题的ifAnswered属性设为0，在答案收集的时候跳过
	 }else if(this.type==2){
		$("div.main").on("click","div.nextQues",function(){
			if($(cQues).hasClass("selectArrange")){
				var id = $(cQues).find("option:selected").attr("id");
			}else{
				var id = $(cQues).find("input:checked").attr("id");
			}
			if(id==optionId){
				var test = $(cQues).parents("div.page").nextUntil("div.page[id=p"+value1+"]");
				for(var i = 0;i<test.length;i++){
					$(test[i]).attr("ifAnswered","0");
				}

			}
			
		});
	
	/***如果逻辑类型是有条件跳题（组合）***/
	}else if(this.type==3){
		var optionIds = value2.split(",");
		$("div.main").on("click","div.nextQues",function(){
			var options = $(cQues).find("input:checked");
			
			var ids = new Array();
			
			for(var i = 0;i<options.length;i++){
				ids.push($(options[i]).attr("id"));
			}
			if(isContain(optionIds,ids)){
				
				var test = $(cQues).parents("div.page").nextUntil("div.page[id=p"+value1+"]");
				for(var i = 0;i<test.length;i++){
					$(test[i]).attr("ifAnswered","0");
				}
				ids.length = 0;
			}
			
			ids.length = 0;
		});
	}else if(this.type==15){
		
		$("div.main").on("click","div.nextQues",function(){
			var relatedQues = value1.split(",");
			if($(cQues).hasClass("selectArrange")){
				var options = $(cQues).find("option:selected");
			}else{
				var options = $(cQues).find("input:checked");
			}
			
			if(options.size()!=0){
				for(var i=0;i<relatedQues.length;i++){
					//因为最后一个可能是空
					if(relatedQues[i]!=null&&relatedQues[i]!=""){
						$(cQues).parents("div.page").nextAll("div.page[id=p"+relatedQues[i]+"]")
						.attr("ifAnswered","1");
					}
				}
			}else{
				for(var i=0;i<relatedQues.length;i++){
					//因为最后一个可能是空
					if(relatedQues[i]!=null&&relatedQues[i]!=""){
						$(cQues).parents("div.page").nextAll("div.page[id=p"+relatedQues[i]+"]")
						.attr("ifAnswered","0");
					}
				}
			}
		});
		
	/***如果逻辑类型是选项关联（任意）***/
	}else if(this.type==4){
		
		$("div.main").on("click","div.nextQues",function(){
			if($(cQues).hasClass("selectArrange")){
				var id = $(cQues).find("option:selected").attr("id");
			}else{
				var id = $(cQues).find("input:checked").attr("id");
			}
			
				
				
				var logicValues = logics.split(";");
				for(var k=0;k<logicValues.length;k++){
					if(logicValues[k]!=null&&logicValues[k]!=""){
						var paras = logicValues[k].split(".");
						if(paras[0]==4){
							var relatedQues = paras[2].split(",");
							if(id!=paras[1]){
								//把与其他选项关联的题目设置为隐藏
								for(var i=0;i<relatedQues.length;i++){
									//因为最后一个可能是空
									if(relatedQues[i]!=null&&relatedQues[i]!=""){
										$(cQues).parents("div.page").nextAll("div.page[id=p"+relatedQues[i]+"]")
										.attr("ifAnswered","0");
									}
								}
							}
						}
						
					}
				}
				
				for(var k=0;k<logicValues.length;k++){
					if(logicValues[k]!=null&&logicValues[k]!=""){
						var paras = logicValues[k].split(".");
						if(paras[0]==4){
							var relatedQues = paras[2].split(",");
							if(id==paras[1]){
								//把与该选项关联的题目设置为显示
								for(var i=0;i<relatedQues.length;i++){
									//因为最后一个可能是空
									if(relatedQues[i]!=null&&relatedQues[i]!=""){
										$(cQues).parents("div.page").nextAll("div.page[id=p"+relatedQues[i]+"]")
										.attr("ifAnswered","1");
									}
								}
							}
						}
					}
				}
				
				//找到下一个display不为none的Question显示出来
			
		});
		
	/**如果逻辑类型是选项关联（组合）***/	
	}else if(this.type==5){
		
		$("div.main").on("click","div.nextQues",function(){
			var options = $(cQues).find("input:checked");
			
			var ids = new Array();
			
			for(var i = 0;i<options.length;i++){
				ids.push($(options[i]).attr("id"));
			}
				
				//把与其他选项关联的题目设置为隐藏
				var logicValues = logics.split(";");
				for(var k=0;k<logicValues.length;k++){
					if(logicValues[k]!=null&&logicValues[k]!=""){
						var paras = logicValues[k].split(".");
						if(paras[0]==5){
							var relatedQues = paras[2].split(",");
							var optionIds = paras[3].split(",");
							if(!isContain(optionIds,ids)){
								//把与其他选项关联的题目设置为隐藏
								for(var i=0;i<relatedQues.length;i++){
									//因为最后一个可能是空
									if(relatedQues[i]!=null&&relatedQues[i]!=""){
										$(cQues).parents("div.page").nextAll("div.page[id=p"+relatedQues[i]+"]")
										.attr("ifAnswered","0");
									}
								}
							}
						}
						
					}
				}
				for(var k=0;k<logicValues.length;k++){
					if(logicValues[k]!=null&&logicValues[k]!=""){
						var paras = logicValues[k].split(".");
						if(paras[0]==5){
							var relatedQues = paras[2].split(",");
							var optionIds = paras[3].split(",");
							if(isContain(optionIds,ids)){
								//把与该选项关联的题目设置为显示
								for(var i=0;i<relatedQues.length;i++){
									//因为最后一个可能是空
									if(relatedQues[i]!=null&&relatedQues[i]!=""){
										$(cQues).parents("div.page").nextAll("div.page[id=p"+relatedQues[i]+"]")
										.attr("ifAnswered","1");
									}
								}
							}
						}
					}
				}
				
				ids.length = 0;
				//找到下一个display不为none的Question显示出来
			
		});
	
	/**如果了逻辑类型是题干引用***/
	}else if(this.type==6){
		
			var pQues = $(cQues).parents("div.page").prevAll("div.page[id=p"+value1+"]").find("div.Question");
			
			var titleText = $(cQues).find("div.QuestionTitle");
			
			//判断当前题目的题型,假如选项是选择的类型
			if($(pQues).hasClass("Q_type01")||$(pQues).hasClass("Q_type02")||$(pQues).hasClass("Q_type12")||
					$(pQues).hasClass("Q_type13")||$(pQues).hasClass("Q_type14")||$(pQues).hasClass("Q_type15")||
					$(pQues).hasClass("Q_type18")||$(pQues).hasClass("Q_type19")){
				if($(pQues).hasClass("selectArrange")){
					
					//假如是下拉排序方式
					var options = $(pQues).find("option:selected");
					var text = $(options).text().trim();
					
				}else{
					var options = $(pQues).find("input:checked");
					var text = "";
					for(var i=0;i<options.length;i++){
						text += $(options[i]).parent().find("label.OptionTitle").text().trim();
						
					}
				}
				
				var textValue = createzhengze($(titleText).text(),text,$(pQues).attr("id"));
				$(titleText).text(textValue);
				
				
			//判断当前题目的题型，假如选项是填空的类型
			}else if($(pQues).hasClass("Q_type03") || $(pQues).hasClass("Q_type04") 
					|| $(pQues).hasClass("Q_type16") || $(pQues).hasClass("Q_type17")
					||$(pQues).hasClass("Q_type09")){
				var options = $(pQues).find("textarea.inputBox");
				var text = "";
				for(var i=0;i<options.length;i++){
					text += $(options[i]).val();
				}
				
				var textValue = createzhengze($(titleText).text(),text,$(pQues).attr("id"));
				$(titleText).text(textValue);
				
			}
		
		
	/***如果逻辑类型是选项引用***/
	}else if(this.type==7){
		var pQues = $(cQues).parents("div.page").prevAll("div.page[id=p"+value1+"]").find("div.Question");
		
		if($(cQues).hasClass("selectArrange")){
			var Options = $(cQues).find("option");
		}else{
			var Options = $(cQues).find("div.Option");
		}
		
		for(var i = 0;i<Options.length;i++){
			$(Options[i]).hide();
		}
		
		
		var inputs = $(pQues).find("input:checked");
		var idsChecked = new Array();
		var idsCombined = value2.split(",");
		
		//假如前一个问题是矩阵题
		if($(pQues).hasClass("Q_type06")||$(pQues).hasClass("Q_type07")
				||$(pQues).hasClass("Q_type08")||$(pQues).hasClass("Q_type09")
				||$(pQues).hasClass("Q_type24")){
			
			for(var i = 0;i<inputs.length;i++){
				var idChecked = $(inputs[i]).attr("id").split("-")[1];
				for(var j = 0;j<idsCombined.length;j++){
					var idCObj = (idsCombined[j]).split("&");
					if(idCObj[0] == idChecked){
						idsChecked.push(idCObj[1]);
					}
				}
			}
		}else{
			if($(pQues).hasClass("selectArrange")){
				inputs = $(pQues).find("option:selected");
			}
			//普通选择题
			for(var i = 0;i<inputs.length;i++){
				var idChecked = $(inputs[i]).attr("id");
				for(var j = 0;j<idsCombined.length;j++){
					var idCObj = (idsCombined[j]).split("&");
					if(idCObj[0] == idChecked){
						idsChecked.push(idCObj[1]);
					}
				}
				
			}
		}
		
		//假如后一道题是矩阵选择题
		if($(cQues).hasClass("Q_type06")||$(cQues).hasClass("Q_type07")
				||$(cQues).hasClass("Q_type08")||$(cQues).hasClass("Q_type09")
				||$(cQues).hasClass("Q_type24")){
			var cInputs = $(cQues).find("input.OptionButton");
			for(var i = 0;i< idsChecked.length;i++){
				for(var j = 0;j<cInputs.length;j++){
					if($(cInputs[j]).attr("id").split("-")[1] == idsChecked[i]){
						$(cInputs[j]).parents("div.Option").show();
					}
				}
			}
		}else{
			//假如是普通选择题
			if($(cQues).hasClass("selectArrange")){
				var cInputs = $(cQues).find("option");
				for(var i = 0;i < idsChecked.length;i++){
					for(var j = 0;j < cInputs.length;j++){
						if($(cInputs[j]).attr("id")==idsChecked[i]){
							$(cInputs[j]).show();
							
						}
					}
				}
			}else{
				var cInputs = $(cQues).find("input.OptionButton");
				for(var i = 0;i < idsChecked.length;i++){
					for(var j = 0;j < cInputs.length;j++){
						if($(cInputs[j]).attr("id")==idsChecked[i]){
							$(cInputs[j]).parents("div.Option").show();
						}
					}
				}
			}
			
			
		}
		//数组释放
		idsChecked.length = 0;
	/***如果逻辑类型是选项甄别（任意），记入结果***/	
	}else if(this.type==8){
		$("div.main").on("click","div.nextQues",function(){
			
			if($(cQues).hasClass("selectArrange")){
				var id = $(cQues).find("option:selected").attr("id");
			}else{
				var id = $(cQues).find("input:checked").attr("id");
			}
			if(id == optionId||optionId=="null"){
				var questions = $(cQues).parents("div.page").nextAll("div.pageQ");
				//假如选中了甄别的选项，把后面的题目都设为不需回答，收集答案的时候跳过
				for(var i = 0;i<questions.length;i++){
					$(questions[i]).attr("ifAnswered","0");
				}
				
				
				
				
			}
		});
	
	/***如果逻辑类型是选项甄别（组合），记入结果***/
	}else if(this.type==9){
		var optionIds = value2.split(",");
		
		$("div.main").on("click","div.nextQues",function(){
			var options = $(cQues).find("input:checked");
			
			var ids = new Array();
			
			for(var i = 0;i<options.length;i++){
				ids.push($(options[i]).attr("id"));
			}
			
			
			
			if(isContain(optionIds,ids)||optionIds[0]=="undefined"){
				//假如甄别的选项集合是当前选项集的子集
				//显示提示信息
				
				
				var questions = $(cQues).parents("div.page").nextAll("div.pageQ");
				//假如选中了甄别的选项，把后面的题目都设为不需回答，收集答案的时候跳过
				for(var i = 0;i<questions.length;i++){
					$(questions[i]).attr("ifAnswered","0");
				}
				
				
				ids.length = 0;
				
				return false;
			}
			ids.length = 0;
		});
	
	/***如果逻辑类型是选项配额任意***/
	}else if(this.type==10){
		$("div.main").on("click",find("div.nextQues"),function(){
			if($(cQues).hasClass("selectArrange")){
				var id = $(cQues).find("option:selected").attr("id");
			}else{
				var id = $(cQues).find("input:checked").attr("id");
			}
			if(id==optionId||optionId=="null"){
				var optionList = "[" + optionId + "]";
				var data = {
						quesId:$(cQues).attr("id"),
						optList:optionList
				};
				ajaxAbstract_1("post", "/Questionaire/SimpleAnalyze/countOptComposed", data, optionquotacallback, value1,cQues);
			}
		});
	/***如果逻辑类型是选项甄别（任意），不记入结果***/
	}else if(this.type==11){
		
		$("div.main").on("click","div.nextQues",function(){
			
			if($(cQues).hasClass("selectArrange")){
				var id = $(cQues).find("option:selected").attr("id");
			}else{
				var id = $(cQues).find("input:checked").attr("id");
			}
			if(id == optionId||optionId=="null"){
				//显示提示信息
				alert("感谢您填写问卷,由于您不符合我们的调研条件，答题被迫停止！");
		       	
				window.location.href = "/Questionaire/web/Qdisplay/thanks.html";
				window.event.returnValue = false;
			}
		});
		
		
		
		
	
	/***如果逻辑类型是选项配额组合***/
	}else if(this.type==12){
		var optionIds = value2.split(",");
		$("div.main").on("click","div.nextQues",function(){
			var options = $(cQues).find("input:checked");
			
			var ids = new Array();
			
			for(var i = 0;i<options.length;i++){
				ids.push($(options[i]).attr("id"));
			}
			
			
			if(isContain(optionIds,ids)){
				ids.length = 0;
				var optionList = "[" + value2 + "]";
				var data = {
						quesId:$(cQues).attr("id"),
						optList:optionList
				}
				ajaxAbstract_1("post", "/Questionaire/SimpleAnalyze/countOptComposed", data, optionquotacallback, value1,cQues);
			}
			
			ids.length = 0;
		});
		
	/***如果逻辑类型是选项甄别（组合），不计入结果***/
	// value2 存的是选项组合
	}else if(this.type==13){
		var optionIds = value2.split(",");
		
		$("div.main").on("click","div.nextQues",function(){
			var options = $(cQues).find("input:checked");
			
			var ids = new Array();
			
			//把所有选中的选项id都放入数组
			for(var i = 0;i<options.length;i++){
				ids.push($(options[i]).attr("id"));
			}
			
			
			if(isContain(optionIds,ids)||optionIds[0]=="undefined"){
				//假如甄别的选项集合是当前选项集的子集
				//显示提示信息
				ids.length=0;
				alert("感谢您填写问卷,由于您不符合我们的调研条件，答题被迫停止！");
			       	
				window.location.href = "/Questionaire/web/Qdisplay/thanks.html";
				window.event.returnValue = false;
			}
			
			ids.length = 0;
		});
	
	/**假如逻辑类型是选项互斥**/
	}else if(this.type==14){
		var optionIds = value2.split(",");
		$(cQues).on("change","input",function(event){
			var id = $(event.target).attr("id");
			var options = $(cQues).find("input");
			for(var j=0;j<optionIds.length;j++){
				if(id==optionIds[j]){
					for(var i=0;i<options.length;i++){
						if($(options[i]).attr("id")!=id){
							$(options[i]).attr("checked",false).attr("data-cacheval",true)
							.prev("label").removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
							
						}
					}
					break;
				}else{
					//数组最后一个值可能为空
					if(optionIds[j]!=""){
						$("input#"+optionIds[j]).attr("checked",false).checkboxradio( "refresh" );
					}
				}
			}
			
		});
	}
};


//options是逻辑选项的组合，inputs是实际用户选的选项组合
function isContain(options,inputs){
	for(var i=0;i<options.length;i++){
		//因为最后一个可能是空
		if(options[i]!=null&&options[i]!=""){
			if(!hasElement(inputs,options[i])){
				return false;
			}
		}
	}
	return true;
	
}

function hasElement(inputs,option){
	for(var k=0;k<inputs.length;k++){
		if(inputs[k]==option){
			return true;
		}
	}
	
	return false;
}

function optionquotacallback(str, limitnum,cQues) {
	if (str.code == 0) {
		alert("判断失败");
	} else {

		if (str.sum + 1 > limitnum) {
			alert("感谢您填写问卷,该选项有人数限制");
			window.location.href = "/Questionaire/web/Qdisplay/error_notfit.html";
			window.event.returnValue = false;
		}
	}
}

function ajaxAbstract_1(method, remote_url, send_data, callback, limitnum,cQues) {
	$.ajax({
		type: method,
		url: remote_url,
		data: send_data,
		dataType: 'json',
		success: function(result) {
			if (result == "" || result == null) {
				NotifyEmptyResult();
			} else {
				callback(result, limitnum,cQues);
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			NotifyTryAgain();
		}
	});
}

function NotifyTryAgain() {
	alert("网络出错，请稍后再试！");
}

//用来取得题干引用中需要替代的部分     正则表达式
function createzhengze(text1, text2, id) {

	var reg = /\[([^\"]*)\]/g;
	var textval = text1;
	var arr = text1.match(reg);
	for (var i = 0; i < arr.length; i++) {
		var signs = arr[i].split(".")[1];
		var aa = id + "]";
		if (signs == aa) {
			textval = textval.replace(arr[i], text2);
		}
	}

	return textval;


}