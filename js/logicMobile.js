
/**
 * @author HWW
 * @date 2015-5-7
 * @function 移动端的逻辑控制
 * */

$(function() {
	
	//获取问卷中所有题目的逻辑标签
	var input_logics=$('input.logics.haslogic');
	
	//对每个逻辑标签进行遍历
	$.each(input_logics,function(i,input_logic){
		
		//获取每道题的所有逻辑
		var logics = $(input_logic).val();

		//对logics进行分割，获取每一条单独的逻辑以及每一条逻辑的参数
		var logicValueList = logics.split(";");
		
		//一题内的跳题逻辑个数
    	var jump = 0;
    	//一题内的关联逻辑个数
    	var relate = 0;
    	//一题内的甄别逻辑个数
    	var end = 0

		//对每一条单独的逻辑进行遍历，对其代表的逻辑含义进行实现
		$.each(logicValueList, function(j, logicValue) {

			if(logicValue!=null&&logicValue!=""){
				
				 //对每一条逻辑值进行分割，获取该条逻辑的所有参数
	        	 var parameters = logicValue.split(".");
	        	 
	        	 //逻辑参数构成的对象
	        	 var logicParameters = new logicParameter(parameters);
	        	 
	        	 
	        	 //此处将input_logic作为参数传给processLogic这个函数，是为了通过该对象找到其所在的题目，方便后续操作
	        	 if(parameters[0]==2||parameters[0]==3){
	        		 logicParameters.processLogic(input_logic,logicValueList,jump);
	        		 jump++;
	        	 }else if(parameters[0]==4||parameters[0]==5){
	        		 logicParameters.processLogic(input_logic,logicValueList,relate);
	        		 relate++;
	        	 }else if(parameters[0]==8||parameters[0]==9){
	        		 logicParameters.processLogic(input_logic,logicValueList,end);
	        		 end++;
	        	 }else{
	        		 logicParameters.processLogic(input_logic,logicValueList);
	        	 }
	        		 
			}//for if
        	 
		});//for each函数
		
	});//for each函数
	
	
	
	
	
	
	
});//最外层的ready函数结束

/************************************实现各种不同类型逻辑的方法***********************************************************/


function logicParameter(parameters){
	 this.logictype = parameters[0];
  	 this.optionId  = parameters[1];
  	 this.LogicValue1 = parameters[2];
  	 this.LogicValue2 = parameters[3];
  	
	}
	logicParameter.prototype.processLogic = function(input_logic,logicValues,lNum){
			var cQues = $(input_logic).parents("div.Question");
			var value1 = this.LogicValue1;
			var value2 = this.LogicValue2;
			var optionId = this.optionId;
		/**任意跳题**/
		if(this.logictype==1){
			var cQues = $(input_logic).parents("div.Question");
			$(cQues).on("change","input.OptionButton,select",function(){
				if($(cQues).hasClass("selectArrange")){
	                var options = $(cQues).find("option:selected");

	            }else{
	            	var options = $(cQues).find("input:checked");
	            }
				
				if(options.size()!=0){
					var ques = $(cQues).parents("div.page").find("div.Question[id="+value1+"]");
                    //假如在当页找不到需要跳到的题
                    if(ques.size()==0){
                        $(cQues).nextAll("div.Question").not(".Q_type20").hide();
                        var pages = $(cQues).parents("div.page").nextAll("div.page");
                        for(var i = 0;i<pages.length;i++){
                            ques =  $(pages[i]).find("div.Question[id="+value1+"]");
                            //假如在之后的某一页仍然找不到要跳到的题 则把那一页的所有题目隐藏 并把那一页设为不显示
                            if(ques.size()==0){
                                $(pages[i]).attr("ifDisplay",0);
                                var allQues = $(pages[i]).find("div.Question");
                                $(allQues).hide();
                            }else{
                            //假如在后面的某一页找到了要跳到的题目
                                $(ques).prevAll("div.Question").hide();
                                break;
                            }
                        }
                    }else{
                        $(cQues).nextUntil("div.Question[id="+value1+"]").not(".Q_type20").hide(); 
                    }
				}else{
					var ques = $(cQues).parents("div.page").find("div.Question[id="+value1+"]");
                    //假如在当页找不到需要跳到的题
                    //hide=1表示是被关联逻辑隐藏的题目 不应该被显示出来
                    if(ques.size()==0){
                        $(cQues).nextAll("div.Question").not("div.Question[hide=1]").show();
                        var pages = $(cQues).parents("div.page").nextAll("div.page");
                        for(var i = 0;i<pages.length;i++){
                            ques =  $(pages[i]).find("div.Question[id="+value1+"]");
                            //假如在之后的某一页仍然找不到要跳到的题 则把那一页的所有题目显示 并把那一页设为显示
                            if(ques.size()==0){
                                $(pages[i]).attr("ifDisplay",1);
                                var allQues = $(pages[i]).find("div.Question");
                                $(allQues).not("div.Question[hide=1]").show();
                            }else{
                            //假如在后面的某一页找到了要跳到的题目
                                $(ques).prevAll("div.Question").not("div.Question[hide=1]").show();
                                break;
                            }
                        }
                    }else{
                        $(cQues).nextUntil("div.Question[id="+value1+"]").not("div.Question[hide=1]").show(); 
                    }
				}
				window.event.returnValue=false;
			});
		}else if(this.logictype==2&&lNum==0){
				var cQues = $(input_logic).parents("div.Question");
				$(cQues).on("change","input.OptionButton,select",function(){
					if($(cQues).hasClass("selectArrange")){
		                var id = $(cQues).find("option:selected").attr("id");

		            }else{
		                var id = $(this).attr("id");
		            }
					//因为要一次过绑定该题的所有跳题逻辑 假如选中了要隐藏 没选中要显示
			           //对所有跳题逻辑都进行判断
			            
			            for(var k=0;k<logicValues.length;k++){
			                if(logicValues[k]!=null&&logicValues[k]!=""){
			                    var paras = logicValues[k].split(".");
			                    if(paras[0]==2){
			                        var value1 = paras[2];
			                        if(id!=paras[1]){
			                        	var ques = $(cQues).parents("div.page").find("div.Question[id="+value1+"]");
			                            //假如在当页找不到需要跳到的题
			                            //hide=1表示是被关联逻辑隐藏的题目 不应该被显示出来
			                            if(ques.size()==0){
			                                $(cQues).nextAll("div.Question").not("div.Question[hide=1]").show();
			                                var pages = $(cQues).parents("div.page").nextAll("div.page");
			                                for(var i = 0;i<pages.length;i++){
			                                    ques =  $(pages[i]).find("div.Question[id="+value1+"]");
			                                    //假如在之后的某一页仍然找不到要跳到的题 则把那一页的所有题目显示 并把那一页设为显示
			                                    if(ques.size()==0){
			                                        $(pages[i]).attr("ifDisplay",1);
			                                        var allQues = $(pages[i]).find("div.Question");
			                                        $(allQues).not("div.Question[hide=1]").show();
			                                    }else{
			                                    //假如在后面的某一页找到了要跳到的题目
			                                        $(ques).prevAll("div.Question").not("div.Question[hide=1]").show();
			                                        break;
			                                    }
			                                }
			                            }else{
			                                $(cQues).nextUntil("div.Question[id="+value1+"]").not("div.Question[hide=1]").show(); 
			                            }
			                        }
			                      }
			                    }   
			                }
			            
			            
			            for(var k=0;k<logicValues.length;k++){
			                if(logicValues[k]!=null&&logicValues[k]!=""){
			                    var paras = logicValues[k].split(".");

			                    if(paras[0]==2){
			                        var value1 = paras[2];
			                        if(id==paras[1]){
			                        	 var ques = $(cQues).parents("div.page").find("div.Question[id="+value1+"]");
			                             //假如在当页找不到需要跳到的题
			                             if(ques.size()==0){
			                                 $(cQues).nextAll("div.Question").not(".Q_type20").hide();
			                                 var pages = $(cQues).parents("div.page").nextAll("div.page");
			                                 for(var i = 0;i<pages.length;i++){
			                                     ques =  $(pages[i]).find("div.Question[id="+value1+"]");
			                                     //假如在之后的某一页仍然找不到要跳到的题 则把那一页的所有题目隐藏 并把那一页设为不显示
			                                     if(ques.size()==0){
			                                         $(pages[i]).attr("ifDisplay",0);
			                                         var allQues = $(pages[i]).find("div.Question");
			                                         $(allQues).hide();
			                                     }else{
			                                     //假如在后面的某一页找到了要跳到的题目
			                                         $(ques).prevAll("div.Question").hide();
			                                         break;
			                                     }
			                                 }
			                             }else{
			                                 $(cQues).nextUntil("div.Question[id="+value1+"]").not(".Q_type20").hide(); 
			                             }
			                        }
			                    }
			                }
			            }

				});
				/**组合跳题**/
			}else if(this.logictype==3&&lNum==0){
				var cQues = $(input_logic).parents("div.Question");
				
				$(cQues).on("change","input.OptionButton",function(){
		        	//找出选中了的选项
		            var options = $(cQues).find("input:checked");

		            var ids = new Array();
		            
		            for(var i = 0;i<options.length;i++){
		               ids.push($(options[i]).attr("id")); 
		            }
		            
		            //因为要一次过绑定该题的所有跳题逻辑 假如选中了要隐藏 没选中要显示
		            //对所有跳题逻辑都进行判断
		            for(var k=0;k<logicValues.length;k++){
		                if(logicValues[k]!=null&&logicValues[k]!=""){
		                    var paras = logicValues[k].split(".");
		                    var optionIds = paras[3].split(",");
		                    if(paras[0]==3){
		                        var value1 = paras[2];
		                        if(!isContain(optionIds,ids)){
		                        	var ques = $(cQues).parents("div.page").find("div.Question[id="+value1+"]");
		                            //假如在当页找不到需要跳到的题
		                            if(ques.size()==0){
		                                $(cQues).nextAll("div.Question").not("div.Question[hide=1]").show();
		                                var pages = $(cQues).parents("div.page").nextAll("div.page");
		                                for(var i = 0;i<pages.length;i++){
		                                    ques =  $(pages[i]).find("div.Question[id="+value1+"]");
		                                    //假如在之后的某一页仍然找不到要跳到的题 则把那一页的所有题目隐藏 并把那一页设为不显示
		                                    if(ques.size()==0){
		                                        $(pages[i]).attr("ifDisplay",1);
		                                        var allQues = $(pages[i]).find("div.Question");
		                                        $(allQues).not("div.Question[hide=1]").show();
		                                    }else{
		                                    //假如在后面的某一页找到了要跳到的题目
		                                        $(ques).prevAll("div.Question").not("div.Question[hide=1]").show();
		                                        break;
		                                    }
		                                }
		                            }else{
		                            	$(cQues).nextUntil("div.Question[id="+value1+"]").not("div.Question[hide=1]").show();
		                            }
		                        }
		                    }   
		                }
		            }
		            
		            for(var k=0;k<logicValues.length;k++){
		                if(logicValues[k]!=null&&logicValues[k]!=""){
		                    var paras = logicValues[k].split(".");
		                    var optionIds = paras[3].split(",");
		                    if(paras[0]==3){
		                        var value1 = paras[2];
		                        if(isContain(optionIds,ids)){
		                        	var ques = $(cQues).parents("div.page").find("div.Question[id="+value1+"]");
		                            //假如在当页找不到需要跳到的题
		                            if(ques.size()==0){
		                                $(cQues).nextAll("div.Question").not(".Q_type20").hide();
		                                var pages = $(cQues).parents("div.page").nextAll("div.page");
		                                for(var i = 0;i<pages.length;i++){
		                                    ques =  $(pages[i]).find("div.Question[id="+value1+"]");
		                                    //假如在之后的某一页仍然找不到要跳到的题 则把那一页的所有题目隐藏 并把那一页设为不显示
		                                    if(ques.size()==0){
		                                        $(pages[i]).attr("ifDisplay",0);
		                                        var allQues = $(pages[i]).find("div.Question");
		                                        $(allQues).hide();
		                                    }else{
		                                    //假如在后面的某一页找到了要跳到的题目
		                                        $(ques).prevAll("div.Question").hide();
		                                        break;
		                                    }
		                                }
		                            }else{
		                            	$(cQues).nextUntil("div.Question[id="+value1+"]").not(".Q_type20").hide(); 
		                            }
		                        }
		                    }
		                }
		            }
		            ids.length=0;
				});
			}else if(this.logictype==15){
				var cQues = $(input_logic).parents("div.Question");
				
				//一开始先把所有关联的题目隐藏
		        var rQues = this.LogicValue1.split(",");
		        for(var i=0;i<rQues.length;i++){
		            if(rQues[i]!=null&&rQues[i]!=""){
		                $(cQues).parents("div.main").find("div.Question[id="+rQues[i]+"]").hide().
		                attr("hide","1");
		            }
		        }
		        
		        $(cQues).on("change","input.OptionButton,select",function(){
		        	if($(cQues).hasClass("selectArrange")){
		                var options = $(cQues).find("option:selected");

		            }else{
		            	var options = $(cQues).find("input:checked");
		            }
		        	
		        	if(options.size()!=0){
		        		for(var i=0;i<rQues.length;i++){
				            if(rQues[i]!=null&&rQues[i]!=""){
				                $(cQues).parents("div.main").find("div.Question[id="+rQues[i]+"]").show().
				                attr("hide","0");
				            }
				        }
		        	}else{
		        		for(var i=0;i<rQues.length;i++){
				            if(rQues[i]!=null&&rQues[i]!=""){
				                $(cQues).parents("div.main").find("div.Question[id="+rQues[i]+"]").hide().
				                attr("hide","1");
				            }
				        }
		        	}
		        	
		        });
				/**任意关联**/
			}else if(this.logictype==4){
				var cQues = $(input_logic).parents("div.Question");
				
				//一开始先把所有关联的题目隐藏
		        var rQues = this.LogicValue1.split(",");
		        for(var i=0;i<rQues.length;i++){
		            if(rQues[i]!=null&&rQues[i]!=""){
		                $(cQues).parents("div.main").find("div.Question[id="+rQues[i]+"]").hide().
		                attr("hide","1");
		            }
		        }
		        
		        if(lNum==0){
		        	$(cQues).on("change","input.OptionButton,select",function(){
						if($(cQues).hasClass("selectArrange")){
							var id = $(cQues).find("option:selected").attr("id");
						}else{
							var id = $(cQues).find("input:checked").attr("id");
						}
						
							
							
							
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
													$(cQues).parents("div.main").find("div.Question[id="+relatedQues[i]+"]").hide()
													.attr("hide","1");
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
													$(cQues).parents("div.main").find("div.Question[id="+relatedQues[i]+"]").show()
													.attr("hide","0");
			                                    }
											}
										}
									}
								}
							}
						
					});
		        }
		        /**组合关联**/
			}else if(this.logictype==5){
				var cQues = $(input_logic).parents("div.Question"); 
				var rQues = this.LogicValue1.split(",");
		        for(var i=0;i<rQues.length;i++){
		            if(rQues[i]!=null&&rQues[i]!=""){
		                $(cQues).parents("div.main").find("div.Question[id="+rQues[i]+"]").hide()
		                .attr("hide","1");
		            }
		        }
		        
		        if(lNum==0){
		        	$(cQues).on("change","input.OptionButton",function(){
						var options = $(cQues).find("input:checked");
						
						var ids = new Array();
						
						for(var i = 0;i<options.length;i++){
							ids.push($(options[i]).attr("id"));
						}
							
							
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
												    $(cQues).parents("div.main").find("div.Question[id="+relatedQues[i]+"]").hide()
												    .attr("hide","1");
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
			                                        $(cQues).parents("div.main").find("div.Question[id="+relatedQues[i]+"]").show()
			                                        .attr("hide","0");
												}
											}
										}
									}
								}
							}
							
							ids.length = 0;
							//找到下一个display不为none的Question显示出来
						
					});
		        }
			/**题干引用**/
			}else if(this.logictype==6){
			var cQues = $(input_logic).parents("div.Question");
			var pQues = $(cQues).prevAll("div.Question[id="+this.LogicValue1+"]");
			
			var titleText = $(cQues).find("div.QuestionTitle");
			
			var titleT = $(titleText).text();
			
			//判断当前题目的题型,假如选项是选择的类型
			if($(pQues).hasClass("Q_type01")||$(pQues).hasClass("Q_type02")||$(pQues).hasClass("Q_type12")||
					$(pQues).hasClass("Q_type13")||$(pQues).hasClass("Q_type14")||$(pQues).hasClass("Q_type15")||
					$(pQues).hasClass("Q_type18")||$(pQues).hasClass("Q_type19")){
				
				$(pQues).on("change","input.OptionButton,select",function(event){
					if($(pQues).hasClass("selectArrange")){
						//假如是下拉排序方式
						var options = $(pQues).find("option:selected");
						var text = $(options).text().trim();
					}
					else{
						var options = $(pQues).find("input:checked");
						var text = "";
						for(var i=0;i<options.length;i++){
							text += $(options[i]).parent().find("label.OptionTitle").text().trim();
							
						}
					}
					
					var textValue = createzhengze(titleT,text,$(pQues).attr("id"));
					$(titleText).text(textValue);
				});
				
				
				
			//判断当前题目的题型，假如选项是填空的类型
			}else if($(pQues).hasClass("Q_type03") || $(pQues).hasClass("Q_type04") 
					|| $(pQues).hasClass("Q_type16") || $(pQues).hasClass("Q_type17")
					||$(pQues).hasClass("Q_type09")){
				$(pQues).on("change","textarea.inputBox",function(){
					var options = $(pQues).find("textarea.inputBox");
					var text = "";
					for(var i=0;i<options.length;i++){
						text += $(options[i]).val();
					}
					
					var textValue = createzhengze(titleT,text,$(pQues).attr("id"));
					$(titleText).text(textValue);
					
				});
				
			}
			/**选项引用**/
		}else if(this.logictype==7){
			var cQues = $(input_logic).parents("div.Question");
			var pQues = $(cQues).prevAll("div.Question[id="+this.LogicValue1+"]");
			
			if($(cQues).hasClass("selectArrange")){
				var Options = $(cQues).find("option");
			}else{
				var Options = $(cQues).find("div.Option");
			}
			
			for(var i = 0;i<Options.length;i++){
				$(Options[i]).hide();
			}
			var value2 = this.LogicValue2;
			$(pQues).on("change","input.OptionButton,select",function(){
				var inputs = $(pQues).find("input:checked");
				if($(pQues).hasClass("selectArrange")){
					inputs = $(pQues).find("option:selected");
				}
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
				
				
				for(var i = 0;i<Options.length;i++){
					$(Options[i]).hide();
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
			});
			/**选项甄别任意 计入答案**/
		}else if(this.logictype==8&&lNum==0){
			var cQues = $(input_logic).parents("div.Question");
			$(cQues).on("change","input.OptionButton,select",function(event){
				if($(cQues).hasClass("selectArrange")){
					var id = $(cQues).find("option:selected").attr("id");
				}else{
					var id = $(cQues).find("input:checked").attr("id");
				}
				
				 for(var j=0;j<logicValues.length;j++){
		                if(logicValues[j]!=null&&logicValues[j]!=""){
		                    var paras = logicValues[j].split(".");
		                    var optionIds = paras[3].split(",");
		                    var optionId = paras[1];
		                    if(paras[0]==8){
				
								if(id == optionId||optionId=="null"){
									var questions = $(cQues).nextAll("div.Question").not(".Q_type20");
					                $(questions).hide();
					                var pages = $(cQues).parents("div.page").nextAll("div.page");
									for(var i = 0;i<pages.length;i++){
									    $(pages[i]).find("div.Question").hide();
					                    //把不到最后一页中间的分页全部隐藏
					                    if(i!=pages.length-1){
					                        $(pages[i]).attr("ifDisplay",0);
					                    }
					                }
									
									event.stopImmediatePropagation();
									return false;
									
									
								}else{
									var questions = $(cQues).nextAll("div.Question").not(".Q_type20").not(".Question[hide=1]");
					                $(questions).show();
					                var pages = $(cQues).parents("div.page").nextAll("div.page");
									for(var i = 0;i<pages.length;i++){
									    $(pages[i]).find("div.Question").not(".Question[hide=1]").show();
					                    //把不到最后一页中间的分页全部显示
					                    if(i!=pages.length-1){
					                        $(pages[i]).attr("ifDisplay",1);
					                    }
					                }
									
									 
					
							            for(var k=0;k<logicValues.length;k++){
							                if(logicValues[k]!=null&&logicValues[k]!=""){
							                    var paras = logicValues[k].split(".");
							                    var optionIds = paras[3].split(",");
							                    if(paras[0]==2){
							                    	var value1 = paras[2];
							                        if(id==paras[1]){
							                        	var ques = $(cQues).parents("div.page").find("div.Question[id="+value1+"]");
							                            //假如在当页找不到需要跳到的题
							                            if(ques.size()==0){
							                                $(cQues).nextAll("div.Question").not(".Q_type20").hide();
							                                var pages = $(cQues).parents("div.page").nextAll("div.page");
							                                for(var i = 0;i<pages.length;i++){
							                                    ques =  $(pages[i]).find("div.Question[id="+value1+"]");
							                                    //假如在之后的某一页仍然找不到要跳到的题 则把那一页的所有题目隐藏 并把那一页设为不显示
							                                    if(ques.size()==0){
							                                        $(pages[i]).attr("ifDisplay",0);
							                                        var allQues = $(pages[i]).find("div.Question");
							                                        $(allQues).hide();
							                                    }else{
							                                    //假如在后面的某一页找到了要跳到的题目
							                                        $(ques).prevAll("div.Question").hide();
							                                        break;
							                                    }
							                                }
							                            }else{
							                            	$(cQues).nextUntil("div.Question[id="+value1+"]").not(".Q_type20").hide(); 
							                            }
							                        }
							                    }else if(paras[0]==4){
							                    	var relatedQues = paras[2].split(",");
													if(id==paras[1]){
														//把与该选项关联的题目设置为显示
														for(var i=0;i<relatedQues.length;i++){
															//因为最后一个可能是空
															if(relatedQues[i]!=null&&relatedQues[i]!=""){
																$(cQues).parents("div.main").find("div.Question[id="+relatedQues[i]+"]").show()
																.attr("hide","0");
						                                    }
														}
													}
							                    }
							                }
							            }
							                    
							                    
							        
									
								}
		                    }
		                }
				 }
				 event.stopImmediatePropagation();
			});
			/**选项甄别组合 计入答案**/
		}else if(this.logictype==9&&lNum==0){
			var cQues = $(input_logic).parents("div.Question");
			$(cQues).on("change","input.OptionButton",function(event){
				var options = $(cQues).find("input:checked");
				
				var ids = new Array();
				
				for(var i = 0;i<options.length;i++){
					ids.push($(options[i]).attr("id"));
				}
				

	            for(var j=0;j<logicValues.length;j++){
	                if(logicValues[j]!=null&&logicValues[j]!=""){
	                    var paras = logicValues[j].split(".");
	                    var optionIds = paras[3].split(",");
	                    if(paras[0]==9){
				
							if(isContain(optionIds,ids)||optionIds[0]=="undefined"){
								//假如甄别的选项集合是当前选项集的子集
								//显示提示信息
								
								
								var questions = $(cQues).nextAll("div.Question").not(".Q_type20");
				                $(questions).hide();
				                var pages = $(cQues).parents("div.page").nextAll("div.page");
								for(var i = 0;i<pages.length;i++){
				                    $(pages[i]).find("div.Question").hide();
				                    if(i!=pages.length-1){
				                        $(pages[i]).attr("ifDisplay",0);
				                    }
								}
								
								ids.length = 0;
								
								event.stopImmediatePropagation();
								return false;
							}else{
								var questions = $(cQues).nextAll("div.Question").not(".Q_type20").not(".Question[hide=1]");
				                $(questions).show();
				                var pages = $(cQues).parents("div.page").nextAll("div.page");
								for(var i = 0;i<pages.length;i++){
								    $(pages[i]).find("div.Question").show();
				                    //把不到最后一页中间的分页全部显示
				                    if(i!=pages.length-1){
				                        $(pages[i]).attr("ifDisplay",1);
				                    }
				                }
								
								
				
						            for(var k=0;k<logicValues.length;k++){
						                if(logicValues[k]!=null&&logicValues[k]!=""){
						                    var paras = logicValues[k].split(".");
						                    var optionIds = paras[3].split(",");
						                    if(paras[0]==3){
						                    	var value1 = paras[2];
						                        if(isContain(optionIds,ids)){
						                        	var ques = $(cQues).parents("div.page").find("div.Question[id="+value1+"]");
						                            //假如在当页找不到需要跳到的题
						                            if(ques.size()==0){
						                                $(cQues).nextAll("div.Question").not(".Q_type20").hide();
						                                var pages = $(cQues).parents("div.page").nextAll("div.page");
						                                for(var i = 0;i<pages.length;i++){
						                                    ques =  $(pages[i]).find("div.Question[id="+value1+"]");
						                                    //假如在之后的某一页仍然找不到要跳到的题 则把那一页的所有题目隐藏 并把那一页设为不显示
						                                    if(ques.size()==0){
						                                        $(pages[i]).attr("ifDisplay",0);
						                                        var allQues = $(pages[i]).find("div.Question");
						                                        $(allQues).hide();
						                                    }else{
						                                    //假如在后面的某一页找到了要跳到的题目
						                                        $(ques).prevAll("div.Question").hide();
						                                        break;
						                                    }
						                                }
						                            }else{
						                            	$(cQues).nextUntil("div.Question[id="+value1+"]").not(".Q_type20").hide(); 
						                            }
						                        }
						                    }else if(paras[0]==5){
						                    	var relatedQues = paras[2].split(",");
												if(isContain(optionIds,ids)){
													//把与该选项关联的题目设置为显示
													for(var i=0;i<relatedQues.length;i++){
														//因为最后一个可能是空
														if(relatedQues[i]!=null&&relatedQues[i]!=""){
															$(cQues).parents("div.main").find("div.Question[id="+relatedQues[i]+"]").show()
															.attr("hide","0");
					                                    }
													}
												}
						                    }
						                }
						            }
								
							}
	                    }
	                    }
	                }
	            ids.length = 0;
				
				event.stopImmediatePropagation();
			});
			/**选项配额 任意**/
		}else if(this.logictype==10){
			var cQues = $(input_logic).parents("div.Question");
			var optionId = this.optionId;
			var value1 = this.LogicValue1;
			$(cQues).on("change","input.OptionButton,select",function(){
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
			/**选项甄别任意 不计入答案**/
		}else if(this.logictype==11){
			var cQues = $(input_logic).parents("div.Question");
			var optionId = this.optionId;
			$(cQues).on("change","input,select",function(){
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
			/**选项配额组合**/
		}else if(this.logictype==12){
			var cQues = $(input_logic).parents("div.Question");
			var optionIds = this.LogicValue2.split(",");
			var value1 = this.LogicValue1;
			var value2 = this.LogicValue2;
			$(cQues).on("change","input.OptionButton",function(){
				var options = $(cQues).find("input:checked");
				
				var ids = new Array();
				
				for(var i = 0;i<options.length;i++){
					ids.push($(options[i]).attr("id"));
				}
				
				
				if(isContain(optionIds,ids)||optionIds[0]=="undefined"){
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
			/**选项甄别组合 不计入答案**/
		}else if(this.logictype==13){
			var cQues = $(input_logic).parents("div.Question");
			var optionIds = value2.split(",");
			$(cQues).on("change","input.OptionButton",function(){
				var options = $(cQues).find("input:checked");
				
				var ids = new Array();
				
				//把所有选中的选项id都放入数组
				for(var i = 0;i<options.length;i++){
					ids.push($(options[i]).attr("id"));
				}
				
				
				if(isContain(optionIds,ids)){
					//假如甄别的选项集合是当前选项集的子集
					//显示提示信息
					ids.length=0;
					alert("感谢您填写问卷,由于您不符合我们的调研条件，答题被迫停止！");
				       	
					window.location.href = "/Questionaire/web/Qdisplay/thanks.html";
					window.event.returnValue = false;
				}
				
				ids.length = 0;
			});
		}else if(this.logictype==14){
			var optionIds = this.LogicValue2.split(",");
			var cQues = $(input_logic).parents("div.Question");
			$(cQues).on("change","input.OptionButton",function(event){
				var id = $(event.target).attr("id");
				var options = $(cQues).find("input.OptionButton");
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
		
			
	}
	/************************************实现各种不同类型逻辑的方法 结束***********************************************************/

	//判断某个数组中的数据是否全部为true
	function judgeTrue(array){
		
		
		for(var i=0;i<array.length;i++){
			
			if(array[i]==false){
				
				return false;
			}
		}
		
		return true;
		
	}
	
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