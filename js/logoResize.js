/**
 * 让图片在固定范围内缩放
 */

window.onload=function(){
			var ImgD = $("div#icon").find("img.logo");
			if(ImgD.length!=0){
				resize(ImgD,0.15);
				$(ImgD).css("float","left");
			}
			
			var ImgE = $("div.QnaireTip").find("img.picture");
			if(ImgE.length!=0){
				resize(ImgE,0.8);
				$(ImgE).parent().css("width","70%");
			}

		}



function refresh(){
	
	//$( ":mobile-pagecontainer" ).pagecontainer("change",$("#page0"),{transition:"fade"});
	$("div.ui-loader").hide();
	//$.mobile.loading( "hide" );
	location.reload(); 

}

function resize(ImgD,percent){
	var iwidth = $(ImgD).parent().parent().width()*percent;
	var iheight = $(ImgD).parent().parent().height()*percent;
	ImgD = $(ImgD)[0];
	var image = new Image();
	image.src = ImgD.src;
	if (image.width > 0 && image.height > 0) {
		if (image.width / image.height >= iwidth / iheight) {
			if (image.width > iwidth) {
				ImgD.width = iwidth;
				ImgD.height = (image.height * iwidth) / image.width;
			} else {
				ImgD.width = image.width;
				ImgD.height = image.height;
			}
		} else {
			if (image.height > iheight) {
				ImgD.height = iheight;
				ImgD.width = (image.width * iheight) / image.height;
			} else {
				ImgD.width = image.width;
				ImgD.height = image.height;
			}
		}
	}
}
