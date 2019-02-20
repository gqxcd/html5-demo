/**
 * 
 * 选项排列方式的实现
 */


$.afui.ready(function(){ 
	//找到问卷对应的div，class为main
    var $qnaire = $("div.main");
	
    //获取所有的问题
    var $questions = $qnaire.find("div.Questions").find("div.Question");

    $.each($questions, function(i, question){
    	if($(question).hasClass("Q_type01")||$(question).hasClass("Q_type02")
    			||$(question).hasClass("Q_type12")||$(question).hasClass("Q_type13")
    			||$(question).hasClass("Q_type15")||$(question).hasClass("Q_type14")){
    	var q = new ques($(question).attr("arrangeWay"),$(question).attr("remark"));
    	$(question).bind("resize",function(){
    		if($(this).attr("arrangeWay")==2){
    		var $options = $(this).find("div.Option");
    		
    		var options_array = $options.toArray();
    		
    		//获取屏幕宽度
    		var width = $options.parent().width() - 50;
    		
    		var columnNumber = $(this).attr("remark") >3?3:$(this).attr("remark");
//    		var columnNumber = 2;
    		//设置每个选项的宽度 并按列排列
    		 for (var i = 0; i < options_array.length; i++) {
    		      $(options_array[i]).width(Math.floor(width / parseInt(columnNumber)));
    		      $(options_array[i]).css('display', 'inline-block');
    		    }
    		}
    	});
//    	var q = new ques(0,2);

    	q.arrange(question);
    	}

    });//end of each
                    // 改变题目
                    function getUrlParam (urlParams, searchParam) {
                        var reg = new RegExp("(^|&)" + searchParam + "=([^&]*)(&|$)","i");
                        var arr = urlParams.substr(1).match(reg);
                        if (arr !== null) {
                            var paramStr = arr[2];
                            var decodeParamStr = decodeURI(paramStr);
                            return decodeParamStr;
                        } else {
                            return false;
                        }
                    }
                    var urlParam = location.search;
                    var titleName = getUrlParam(urlParam, 'name');
                    if (titleName !== false) {
                        var $titlePart = $('#pageHeader h1');
                        if ($titlePart.length === 0) {
                            $titlePart = $('.qnaireHeader h1');
                            var addNameTag = '<span class="nameTag">' + titleName + '及其亲友的调研问卷' + '</span>';
                            $titlePart.before(addNameTag);
                        } else {
                            var addNameTag = '<span class="nameTag allQuesTag">' + titleName + '及其亲友的调研问卷' + '</span>';
                            $titlePart.before(addNameTag);
                        }   
                    }
});
    
  

function ques(Ques_OptArrangeWay,columnNumber){
	this.Ques_OptArrangeWay = Ques_OptArrangeWay;
	//限定每行最大列数
	if(columnNumber<=3){
		this.columnNumber = columnNumber;
	}else{
		this.columnNumber = 3;
	}
}

ques.prototype.arrange= function(question){
	var $question = $(question);
	//对问题进行遍历
    
    	var columnNumber = this.columnNumber;
    	if(this.Ques_OptArrangeWay == 1){
    		//竖排
    		var options = $question.find("div.Option");
    	
    		
    			//修改成竖排显示
    		  for (var i = 0; i < options.length; i++) {
    		      $(options[i]).css('display', 'block');
    		      
    		    }

    		
    		
    	
    	
    	}else if(this.Ques_OptArrangeWay ==0){
    		//横排
    		var $options = $question.find("div.Option");
    		//修改成横排显示
    		$.each($options,function(i,option){
    			$(option).css('display', 'inline-block');
    			
    		});
    	}else if(this.Ques_OptArrangeWay==2){
    		//按列
    		var $options = $question.find("div.Option");
    		
    		
    		
    		//获取屏幕宽度
    		var width = $options.parent().width() - 10;
    		
    		//设置每个选项的宽度 并按列排列
    		$.each($options,function(i,option){
	    		$(option).css('margin','auto');
	    		$(option).css('width','auto');
    			var test = width/parseInt(columnNumber);
    		      $(option).width(Math.floor(width / parseInt(columnNumber)));
    		      $(option).css('display', 'inline-block');
    		    });
    	}else if(this.Ques_OptArrangeWay==3){
    		//下拉
    		$(question).addClass("selectArrange");
    		var $options = $question.find("div.Option");
    		
    		
    		
    		//把原先的选项隐藏
    		$options.css('display','none');
    		
    		
    		var select = "<select class=\"select-set\" onchange=\"addFillBlank(this)\">";
    		select += "<option value=\"option0\">请选择</option>"
    		$.each($options,function(i,option){
    			//添加下拉框
	    		
	    		
    			select += "<option id="+$(option).find("input").attr("id")+">"+$(option).find("label").text()+"</option>";
	    			
	    			
	    		
    		});
    		select += "</select>";
    		
    		
    		select += "<textarea  name=\"inputtext\" class=\"option OptionFillBlank  option-fiLL-Reason\" rows=1 style=\"display:none;margin-left:1%\"></textarea><div class=\"error_description\"></div>"
    		
    		
    		
    		$options.parent().append(select).trigger('create');
    		
    		
    	}
    	
   
};


function addFillBlank(val){
	
	var $select = $(val);
	var $options = $select.parent().parent().parent().find("div.Option");
	var selected = $select.find("option:selected");
	var s_id = $(selected).attr("id");
	var test = $options.find("input[id="+s_id+"]").parent().next();
	if(test.length != 0){
		$select.parent().parent().next().show();
		$select.parent().parent().next().attr("ifRequired",$(test).attr("ifRequired"));
		$select.parent().parent().next().attr("iType",$(test).attr("iType"));
		$select.parent().parent().next().attr("maxWN",$(test).attr("maxWN"));
		$select.parent().parent().next().attr("minWN",$(test).attr("minWN"));
	}else{
		$select.parent().parent().next().val("").hide().next().text("");
		
	}
}