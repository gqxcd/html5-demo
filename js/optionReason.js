/**
 * author：lt
 * 矩阵单选题问题填空
 * 矩阵多选题问题填空
 * 滑动条题控制value
 */

$.afui.ready(function(){
	
	/**矩阵单选题问题填空*/
	$("input.Option-button-reason").on("change",function(){
		  var id= $(this).parents('td').data('id');
		  var id1= $(this).data('id');//标记同行input
		  $('.'+id1).hide();
		  $('#'+ id).css("display","table-row");
		  }); 
	
	/**矩阵多选题问题填空*/
	$("input.Options-button-reason").on("click",function(){
		var id= $(this).parents('td').data('id');
		if($(this).prop("checked")){
			$('#'+ id).css("display","table-row");
		}else{
			$('#'+ id).css("display","none");
		}	
	});
});	
	



$.afui.ready(function(){	
	//找到问卷对应的div，class为main
    var $qnaire = $("div.main");
	
    //获取所有的滑动条题问题
	var $sliderQuestions=$qnaire.find("div.sliderQuestion");
	//对每道滑动条题初始化
	for(var i=0;i<$sliderQuestions.length;i++){
		//找到该问题下的所有滑动条
    		var $sliders=$($sliderQuestions[i]).find('input.single-slider');
    		//获取范围
    		var maxValue=$($sliders[0]).attr('max');
    		var minValue=$($sliders[0]).attr('min');
    		for(var j=0;j<$sliders.length;j++){
    		$($sliders[j]).jRange({
    		    from: minValue,
    		    to: maxValue,
    		    step: 1,
    		    format: '%s',
    		    width: 200,
    		    showLabels: true,
    		    snap: true
      		});	
	        }
    }
	
	
});