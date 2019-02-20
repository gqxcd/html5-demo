$.afui.ready(function(){
    var questions = $("div.Question");
    for(var i=0;i<questions.length;i++){
    	
    		/************ 当输入框失去焦点时，检查输入是否合法（仅当是填空题或者选项已经选中的情况 ************/
            $(questions[i]).on("blur","textarea",function(){
            	var input = $(this).parent().find("input");
                if(input.length==0||$(this).parents("div.Question").hasClass("selectArrange")){
             	   check(this);
                }else{
             	   if($(input).prop("checked")==true){
             		   check(this);
             	   }
                }                                                                                                                                             
             });
            
            
            /************ 当选项改变时，清除提示信息 ************/
            $(questions[i]).on("change","input",function(){
            	var notC = $(this).parents("div.Question").find("input.OptionButton").not("input:checked");
            	$(notC).parents("div.Option").find("div.error_description").text("");
            });
            
            
            /************ 点击输入框时，提示信息失效 ************/
            var textAreas = $(questions[i]).find("textarea");
	            $.each($(textAreas),function(index,textArea){
		             $(textArea).click(function(event){
		                $(this).next("div.error_description").text("");
		                event.stopPropagation();
	                
	             });
            });
             
	        



         }
     });

function check(textarea){
	 var ifRequired =$(textarea).attr("ifRequired");
     var iType = $(textarea).attr("iType");
     var minWN = $(textarea).attr("minWN");
     var maxWN = $(textarea).attr("maxWN");
     var message = "";
     if($(textarea).val()==""&&ifRequired==0){
    	 message += "该空必答，请填空";     
     }else{
    	 
    	 if($(textarea).val()!=""){
	    	 if(iType!="undefined"&&iType!="null")
	    		 message += $(textarea).jValidate(iType,$(textarea).val());
	    	 if(minWN!=0||maxWN!=0){
		    	 if(minWN != "null")
		    		 message += $(textarea).jValidate("maxlength",$(textarea).val(),maxWN);
		    	 if(maxWN != "null")
		    		 message += $(textarea).jValidate("minlength",$(textarea).val(),minWN);
	    	 }
    	 }
     }
     
     $(textarea).next("div.error_description").text(message);
}