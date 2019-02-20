/**
 * 判断量表题的显示方式 0 1代表五角星 2代表爱心 3代表按钮
 */

$.afui.ready(function(){
	var $questions = $("div.main").find("div.Question");
	
	$.each($questions,function(i,question){
		//判断题目类型 假如是量表题或者是矩阵量表题
		if($(question).hasClass("Q_type11")||$(question).hasClass("Q_type24")){
			$(this).height("auto");
			//获取量表选择的级数
			var step = $(question).attr("step");

			//获取量表题显示的方式
			var sSType = $(question).attr("scaleStyleType");
			

			//存放量表题的div
			var $holders = $(question).find("div.Option");
			if(step>5){
				var width = Math.floor(($holders.parent().width()-20)/5);
			}else{
				var width = Math.floor(($holders.parent().width()-20)/step);
			}
			if($(question).hasClass("Q_type11")){
				var colIds = $holders.attr("colId");
				colIds = colIds.split(",");
			}
			//判断量表题的宽度
			$.each($holders,function(j,holder){
				
				if(sSType==3){
					/**假如是矩阵量表题**/
					if($(question).hasClass("Q_type24")){
						/**假如显示方式是按钮**/
							$(holder).width(width);
							$(holder).css("display","inline-block");
						
					}else if($(question).hasClass("Q_type11")){
						var content = "";
						
						
						for(var k = 0;k<step;k++){
							content +="<label><input type=\"radio\" id=\""+ colIds[k]+"\" name=\""+$(question).attr("id")+"\" class=\"OptionButton\">"+(k+1)+"</label>";
						}
						
						$(holder).append(content).trigger("create");
						
						var labels = $(holder).find("label");
						for(var i = 0;i<labels.length;i++){
							$(labels[i]).parent().width(width);
							$(labels[i]).parent().css("display","inline-block");
						}
					}
				}else if(sSType==1||sSType==0){
					/**假如显示方式是五角星**/
					$(holder).raty({
						cancel      : false,                                          // Creates a cancel button to cancel the rating.
						cancelClass : 'raty-cancel',                                  // Name of cancel's class.
						cancelHint  : 'Cancel this rating!',                          // The cancel's button hint.
						cancelOff   : '/Questionaire/web/Qdesign/demo/img/cancel-off-big.png',                               // Icon used on active cancel.
						cancelOn    : '/Questionaire/web/Qdesign/demo/img/cancel-on-big.png',                                // Icon used inactive cancel.
						cancelPlace : 'left',                                         // Cancel's button position.
						click       : undefined,                                      // Callback executed on rating click.
						half        : false ,                                         // Enables half star selection.
						halfShow    : true ,                                          // Enables half star display.
						hints       : ['bad', 'poor', 'regular', 'good', 'gorgeous'], // Hints used on each star.
						iconRange   : undefined,                                      // Object list with position and icon on and off to do a mixed icons.
						mouseout    : undefined,                                      // Callback executed on mouseout.
						mouseover   : undefined,                                      // Callback executed on mouseover.
						noRatedMsg  : 'Not rated yet!',                               // Hint for no rated elements when it's readOnly.
						number      : step,                                              // Number of stars that will be presented.
						numberMax   : 20,                                             // Max of star the option number can creates.
						path        : undefined,                                      // A global locate where the icon will be looked.
						precision   : false,                                          // Enables the selection of a precision score.
						readOnly    : false,                                          // Turns the rating read-only.
						round       : { down: .25, full: .6, up: .76 },               // Included values attributes to do the score round math.
						score       : undefined,                                      // Initial rating.
						scoreName   : 'score',                                        // Name of the hidden field that holds the score value.
						single      : false,                                          // Enables just a single star selection.
						space       : true,                                           // Puts space between the icons.
						starHalf    : '/Questionaire/web/Qdesign/demo/img/star-half-big.png',                                // The name of the half star image.
						starOff     : '/Questionaire/web/Qdesign/demo/img/star-off-big.png',                                 // Name of the star image off.
						starOn      : '/Questionaire/web/Qdesign/demo/img/star-on-big.png',                                  // Name of the star image on.
						target      : undefined,                                      // Element selector where the score will be displayed.
						targetFormat: '{score}',                                      // Template to interpolate the score in.
						targetKeep  : false,                                          // If the last rating value will be keeped after mouseout.
						targetScore : undefined,                                      // Element selector where the score will be filled, instead of creating a new hidden field (scoreName option).
						targetText  : '',                                             // Default text setted on target.
						targetType  : 'hint',                                         // Option to choose if target will receive hint o 'score' type.
						starType    : 'img',                                          // Element used to represent a star.
						width		: 'auto',
						
					});
					$(holder).parent().parent().attr("style","");
					var imgs = $(holder).find("img");
					for(var i=0;i<imgs.length;i++){
						$(imgs[i]).attr("id",colIds[i]);
					}

				}else if(sSType==2){
					/**假如显示方式是桃心**/
					$(holder).raty({
						cancel      : false,                                          // Creates a cancel button to cancel the rating.
						cancelClass : 'raty-cancel',                                  // Name of cancel's class.
						cancelHint  : 'Cancel this rating!',                          // The cancel's button hint.
						cancelOff   : '/Questionaire/web/Qdesign/demo/img/cancel-off-big.png',                               // Icon used on active cancel.
						cancelOn    : '/Questionaire/web/Qdesign/demo/img/cancel-on-big.png',                                // Icon used inactive cancel.
						cancelPlace : 'left',                                         // Cancel's button position.
						click       : undefined,                                      // Callback executed on rating click.
						half        : false,                                          // Enables half star selection.
						halfShow    : true,                                           // Enables half star display.
						hints       : ['bad', 'poor', 'regular', 'good', 'gorgeous'], // Hints used on each star.
						iconRange   : undefined,                                      // Object list with position and icon on and off to do a mixed icons.
						mouseout    : undefined,                                      // Callback executed on mouseout.
						mouseover   : undefined,                                      // Callback executed on mouseover.
						noRatedMsg  : 'Not rated yet!',                               // Hint for no rated elements when it's readOnly.
						number      : step,                                              // Number of stars that will be presented.
						numberMax   : 20,                                             // Max of star the option number can creates.
						path        : undefined,                                      // A global locate where the icon will be looked.
						precision   : false,                                          // Enables the selection of a precision score.
						readOnly    : false,                                          // Turns the rating read-only.
						round       : { down: .25, full: .6, up: .76 },               // Included values attributes to do the score round math.
						score       : undefined,                                      // Initial rating.
						scoreName   : 'score',                                        // Name of the hidden field that holds the score value.
						single      : false,                                          // Enables just a single star selection.
						space       : true,                                          // Puts space between the icons.
						starHalf    : '/Questionaire/web/Qdesign/demo/img/rating.png',                                // The name of the half star image.
						starOff     : '/Questionaire/web/Qdesign/demo/img/rating2.png',                                 // Name of the star image off.
						starOn      : '/Questionaire/web/Qdesign/demo/img/ratin5g.png',                                  // Name of the star image on.
						target      : undefined,                                      // Element selector where the score will be displayed.
						targetFormat: '{score}',                                      // Template to interpolate the score in.
						targetKeep  : false,                                          // If the last rating value will be keeped after mouseout.
						targetScore : undefined,                                      // Element selector where the score will be filled, instead of creating a new hidden field (scoreName option).
						targetText  : '',                                             // Default text setted on target.
						targetType  : 'hint',                                         // Option to choose if target will receive hint o 'score' type.
						starType    : 'img',                                         // Element used to represent a star.
						width		: 'auto'
					});
					$(holder).parent().parent().attr("style","");
					var imgs = $(holder).find("img");
					for(var i=0;i<imgs.length;i++){
						$(imgs[i]).attr("id",colIds[i]);
					}
				}
			
			});
			
			$(question).bind("resize",function(){
				$(this).height("auto");
				var step = $(this).attr("step");
//				var step = 5;
				//获取量表题显示的方式
				var sSType = $(this).attr("scaleStyleType");
				
//				var sSType = 2;
				//存放量表题的div
				var $holders = $(this).find("div.Option");
				if(step>5){
					var width = Math.floor(($holders.parent().width()-20)/5);
				}else{
					var width = Math.floor(($holders.parent().width()-20)/step);
				}
				if(sSType==3){
					$.each($holders,function(j,holder){
						/**假如是矩阵量表题**/
						if($(question).hasClass("Q_type24")){
							
								
								$(holder).width(width);
								$(holder).css("display","inline-block");
						}else if($(question).hasClass("Q_type11")){
							var labels = $(holder).find("label");
							for(var i = 0;i<labels.length;i++){
								$(labels[i]).parent().width(width);
								$(labels[i]).parent().css("display","inline-block");
							}
						}
								
						
						
					});
				}
			});
			}
	});
});