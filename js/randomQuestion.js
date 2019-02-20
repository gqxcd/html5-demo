/**
 * wxp
 * 2015/07/07
 * 对问卷题目的顺序进行随机显示
 */

$.afui.ready(
				function() {
					// 找到问卷对应的div，class为main
					var $qnaire = $("div.main");

					// 获取所有的问题
					var $questions = $qnaire.find("div.Questions").find(
							"div.Question");

					$.each($questions, function(i, question) {
						$question = $(question);
						
						var ifRowRan = $question.attr("ifRowRan");
						var ifColRan = $question.attr("ifColRan");
						var ifListRan = $question.attr("ifListRan");
						/**
						 * *****如果该题是单选题 评分单选题 投票单选题 多选题 评分多选题 投票多选题 考试单选
						 * 考试多选********************************
						 */
						if ($question.hasClass("Q_type01")
								|| $question.hasClass("Q_type12")
								|| $question.hasClass("Q_type18")
								|| $question.hasClass("Q_type02")
								|| $question.hasClass("Q_type13")
								|| $question.hasClass("Q_type19")
								|| $question.hasClass("Q_type14")
								|| $question.hasClass("Q_type15")) {
							if(ifRowRan==1){
								var $question_content = $question
										.find("div.QuestionContent")
								// 获取该问题的所有选项
								var options_array = $question.find("div.Option");
								options_array.sort(function() {
									return Math.random() > 0.5 ? -1 : 1;
								});// 把顺序打乱
								//移除原先的选项
								$question_content.remove(".Option");
								for (var j = 0; j < options_array.length; j++) {
									//将打乱后的选项放入页面
									$question_content.append(options_array[j]);
								}
							
							}

							/**
							 * ****如果该题是矩阵单选题 多选题 填空题 下拉题
							 * *******************************
							 */
						} else if ($question.hasClass("Q_type06")
								|| $question.hasClass("Q_type07")
								|| $question.hasClass("Q_type09")
								|| $question.hasClass("Q_type08")) {
								if(ifRowRan==1||ifColRan==1||ifListRan==1){
									//row的父元素
									var $question_content = $question
											.find("div.QuestionContent");
									//获取所有行的选项
									var $rowArray = $question_content.find("div.rowOption");
									
									
										if(ifRowRan==1){
											var options_rowArray = $rowArray.toArray();
											
											//将行的选项顺序打乱
											options_rowArray.sort(function() {
												return Math.random() > 0.5 ? -1 : 1;
											});
											
											//移除已有的行列
											$question_content.remove(".rowOption");
											
											for (var j = 0; j < options_rowArray.length; j++) {
												$question_content.append(options_rowArray[j]);
											}
										}
										
										if(ifColRan==1||ifListRan==1){
											//对于每一行中的列进行打乱操作
											$.each($rowArray,function(i,rowOption){
												var $rowOption = $(rowOption);
												//获取列选项
												var $colOptions = $rowOption.find("div.colOption");
												
												//是否需要下拉打乱
											if($question.hasClass("Q_type08")&&ifListRan==1){
													//获取下拉选项
													$.each($colOptions,function(i,colOption){
													var $select = $(colOption).find("select.selectOption");
													var options_select = $select.find("option.option");
													
													$select.remove("option.option");
													//打乱
													options_select.sort(function(){
														return Math.random() > 0.5 ? -1 : 1;
													});
													for(var j = 0;j<options_select.length;j++){
														$select.append(options_select[j]);
													}});
													
												}
												
											if(ifColRan==1){
												var options_colArray = $colOptions.toArray();
												$rowOption.remove(".colOption")
												options_colArray.sort(function() {
													return Math.random() > 0.5 ? -1 : 1;
												});
												for(var k = 0;k < options_colArray.length; k++){
													$rowOption.append(options_colArray[k]);
												}
											}
											});
										}
										
									}
								
								
							
							
							
							/** ***如果该题是矩阵量表题************************************* */
						} else if ($question.hasClass("Q_type24")&&ifRowRan==1) {
							var $question_content = $question
									.find("div.QuestionContent");
							var options_rowArray = $question
									.find("div.rowOption");
							options_rowArray.sort(function() {
								return Math.random() > 0.5 ? -1 : 1;
							});

							$question_content.remove(".rowOption");
							for (var j = 0; j < options_rowArray.length; j++) {
								$question_content.append(options_rowArray[j]);
							}
						} else if($question.hasClass("Q_type05")&&ifRowRan==1){
							var $question_content = $question
							.find("div.QuestionContent");
							
							var sliders = $question_content.find("div.sliderArea");
							
							sliders.remove();
							
							sliders.sort(function(){
								return Math.random() > 0.5 ? -1 : 1;
							});
							
							for(var i = 0;i<sliders.length;i++){
								$question_content.append(sliders[i]);
							}
						}

					});

				})