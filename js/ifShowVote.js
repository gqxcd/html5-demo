/**
 * 判断投票题是否显示百分比以及投票数 ajax动态更新投票题的数据
 */

var remote_url = "/Questionaire/UpdateVoteNum/UpdateVote";

	
	
$.afui.ready(function(){
	var voteId = new Array();
	var $questions = $("div.main").find("div.Question");
	var ifProcess = false;
	$.each($questions,function(i,question){
		//假如是投票单选题和投票多选题
		if($(question).hasClass("Q_type18")||
			$(question).hasClass("Q_type19")){
			voteId.push($(question).attr("id"));
			ifProcess = true;
			if($(question).attr("ifShowVoteNum")==1){
				
				$(question).find("span.vote").show();
			}
			if($(question).attr("ifShowPercentage")==1){
				$(question).find("span.percent").show();
			}
			
		}
	});
	if(ifProcess){
	voteId = JSON.stringify(voteId);
	var parameters = new votePara(voteId);
	$.ajax({
		url:remote_url,
		type:'post',
		data:parameters,
		dataType:'json',
		success:function(result){
			var quesId = (result.vote).split("||");
			for(var i=0;i<quesId.length;i++){
				var options = quesId[i].split("|");
				var id = options[0];
				$("input[id='" + id+"']").prev("label").find("span.vote").text("（当前票数："+options[1]+"票）")
				.next("span.percent").text(options[2]+"%");
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			NotifyTryAgain();
		}
		
	})
	}

});




function votePara(quesId){
	this.quesId = quesId;
}



