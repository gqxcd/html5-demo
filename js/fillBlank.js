/**
 * hww
 * 2015/03/18
 * function:如果选项可填空，那么只有在用户点击了某个选项之后才会显示填空框
 */
$.afui.ready(function(){
	
	
	//找到问卷对应的div，class为main
    var $qnaire = $("div.main");
	
    //获取所有的问题
    var $questions = $qnaire.find("div.Questions").find("div.Question");

    //对问题进行遍历
    $.each($questions, function(i, question){
    	
    	var $question = $(question); 
    	
    	/*******如果该题是单选题 评分单选题 投票单选题************************************/
    	if($question.hasClass("Q_type01")||$question.hasClass("Q_type12")||$question.hasClass("Q_type18")){
    		
    		$(question).on("change","input.OptionButton",function(){
    			var ifFillBlank = $(this).parents("div.Option").attr("ifFillBlank");
    			$(this).parents("div.Question").find("textarea.OptionFillBlank").css("display","none");
    			if(ifFillBlank==1){
    				$(this).parents("div.Option").find("textarea.OptionFillBlank").css("display","block");
    			}
    		});
    	
    	}//for if
    	
    	/******如果该题是多选题 评分多选题 投票多选题********************************/
    	else if($question.hasClass("Q_type02")||$question.hasClass("Q_type13")||$question.hasClass("Q_type19")){
    		
    		$(question).on("change","input.OptionButton",function(){
    			var options = $(this).parents("div.Question").find("div.Option");
    			for(var i = 0;i<options.length;i++){
    				var ifFillBlank = $(options[i]).attr("ifFillBlank");
    				var optionButton = $(options[i]).find("input.OptionButton");
    			
    				if(ifFillBlank==1){
    					if($(optionButton).prop("checked")){
    						$(options[i]).find("textarea.OptionFillBlank").css("display","block");
    					}else{
    						$(options[i]).find("textarea.OptionFillBlank").css("display","none");
    					}
    				}
    			}
    		});
    		
        	
    	}
    	
    	/******如果该题是矩阵单选题********************************/
    	else if($question.hasClass("Q_type06")){
    		
    		$(question).on("change","input.OptionButton",function(){
    			
    			if($(this).prop("checked")){
    				$(this).parents("tr").find("textarea.OptionFillBlank").hide();
    				$(this).parents("td").find("textarea.OptionFillBlank").css("display","block");
    				
    			}
    			
    		});
    		
//    		//找到所有的行选项
//    	  	var rows = $(question).find("div.rowOption"); 
//        	
//    	  	//对行选项进行遍历
//        	$.each(rows,function(j,row){
//        		
//        		var $row = $(row);
//        		
//            	//获取该行选项对应所有列选项
//            	var options = $row.find("div.colOption");
//        		
//        		//对每个列选项进行遍历
//            	$.each(options, function(k, option){
//            		
//            		var $option = $(option);
//            		
//            		//获取是否可填空属性
//            		var ifFillBlank = $option.attr("ifFillBlank");
//            			
//        			//找到按钮
//        			var optionButton = $option.find("input.OptionButton");
//        			
//        			//给按钮绑定click方法
//        			optionButton.click(function(){
//        				
//        				//将该题的所有选项的可填空框全部隐藏起来	
//        				$row.find("textarea.OptionFillBlank").css("display","none");
//        				
//        				if(ifFillBlank==1){
//            				
//        					//将该选项的的填空框显示出来
//        					$option.find("textarea.OptionFillBlank").css("display","block");
//        				}
//    				});
//            	});
//        		
//        	}); 
    		
    		
    	}
    	
    	/******如果该题是矩阵多选题********************************/
    	else if($question.hasClass("Q_type07")){
    		
    		$(question).on("change","input.OptionButton",function(){
    			var options = $(this).parents("div.Question").find("input.OptionButton");
    			for(var i = 0;i<options.length;i++){
    				
    				var optionButton = $(options[i]);
    			
    				
    					if($(optionButton).prop("checked")){
    						$(optionButton).parent().find("textarea.OptionFillBlank").css("display","block");
    					}else{
    						$(options[i]).parent().find("textarea.OptionFillBlank").css("display","none");
    					}
    				
    			}
    		});
//    		//找到所有的行选项
//    	  	var rows = $(question).find("div.rowOption"); 
//        	
//    	  	//对行选项进行遍历
//        	$.each(rows,function(j,row){
//        		
//        		var $row = $(row);
//        		
//            	//获取该行选项对应所有列选项
//            	var options = $row.find("div.colOption");
//        		
//        		//对每个列选项进行遍历
//            	$.each(options, function(k, option){
//            		
//            		var $option = $(option);
//            		
//            		//获取是否可填空属性
//            		var ifFillBlank = $option.attr("ifFillBlank");
//            			
//        			//找到按钮
//        			var optionButton = $option.find("input.OptionButton");
//        			
//        			//给按钮绑定click方法
//        			optionButton.click(function(){
//        				
//        				//如果该选项可填空
//        				if(ifFillBlank==1){
//            				
//        					//如果该选项被选中
//        					if(optionButton.prop("checked")){
//        					
//        						//将该选项的的填空框显示出来
//        					
//        						$option.find("textarea.OptionFillBlank").css("display","block");
//        	    		
//        					}else{
//        						
//        						//将该选项的的填空框隐藏起来
//            					$option.find("textarea.OptionFillBlank").css("display","none");
//        						
//        					}
//        				}
//    				});});});
        	
    	}
    	/******如果该题是矩阵多选题  结束********************************/
    	
    });
    
});