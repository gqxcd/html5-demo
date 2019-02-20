<%@ page contentType="text/html;charset=utf-8" language="java"
	import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="/WEB-INF/logictag.tld" prefix="logictagoo"%>
<%@ page
	import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@ page import="org.springframework.web.context.WebApplicationContext"%>
<%@ page import="service.QDisplay.*"%>
<%@ page import="DAO.*"%>

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!doctype html>

<html>

<head>

<meta charset="utf-8">

<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">





<!--引入jQuery 和 jQuery mobile 相关的文件，注意文件顺序-->
<link rel=stylesheet href="<%=basePath%>web/Qdisplay/html5/css/jquery.mobile-1.4.5.css">

<!-- 引入自定义问卷样式css -->
<link rel=stylesheet href="<%=basePath%>web/Qdisplay/html5/css/GlobalMobile.css">
<link rel=stylesheet href="<%=basePath%>web/Qdisplay/html5/css/style.css">


<script src="<%=basePath%>web/Qdisplay/html5/js/jquery-1.8.3.min.js"></script>

<!-- 问题选项随机 -->
<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/randomQuestion.js"></script>
<script type="text/javascript">
$( document ).on( "mobileinit", function() {
	$.mobile.buttonMarkup.hoverDelay = "false";
// 	$.mobile.defaultPageTransition   = 'none';
// 	$.mobile.defaultDialogTransition = 'none';
});
</script>
<script src="<%=basePath%>web/Qdisplay/html5/js/jquery.mobile-1.4.5.js"></script>
<!-- 问题的显示方式 -->
<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/columnSet.js"></script>


<!-- 收集问卷答案，将答案发送到后台的js -->
<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/answerCollectionMobile.js"></script>

<!-- 可填空实现方法-->
<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/fillBlank.js"></script>


<!-- 手机端排序题 -->
<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/Sorting.js"></script>



<!-- raty -->

<script type="text/javascript" src="<%=basePath%>web/static/js/jquery.raty.js"></script>
<!-- 量表题不同的显示方式 -->
<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/scaleStyleType.js"></script>

<!-- 格式验证 -->
<script type="text/javascript" src="<%=basePath%>web/static/js/jValidate.js"></script>
<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/validate_use_mobile.js"></script>

<!-- 判断投票题是否显示百分比和投票数 -->
<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/ifShowVote.js"></script>

<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/nextQuestion.js"></script>

<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/logoResize.js"></script>

<script type="text/javascript" src="<%=basePath%>web/Qdisplay/html5/js/logicMobileOrder.js"></script>

<title>回答问卷</title>

</head>

<body>

	<%
		//实例化一个辅助对象，利用该对象可以获取spring中的bean
		WebApplicationContext wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(this.getServletContext());

		//获取问卷展示的service对象的bean
		QueDisplayService service = (QueDisplayService) wac
				.getBean("QueDisplayService");

		//获取问卷的id
		//Integer qnaireId =Integer.valueOf(request.getAttribute("qnaireId").toString());
		Integer qnaireId = Integer
				.valueOf(request.getParameter("qnaireId"));

		String staffEmail = null;
		//获取用户邮箱地址

		if (request.getAttribute("staffEmail") != null) {
			staffEmail = request.getAttribute("staffEmail").toString();
		}

		//调用service中的方法获取问卷对象
		QuestionnaireBasic qnaire = service.getQnaireByQid(qnaireId);
		
		QuestionnaireAppear qAppear = (QuestionnaireAppear)qnaire.getQuestionnaireAppears().iterator().next();

		//获取该问卷的所有问题
		ArrayList<QuestionBasicinfo> questions = service
				.getQuestionByQnaireId(qnaireId);

		//用一个变量对某个分页中的问题进行计数，以便在下一页按钮旁边添加进度条是计算进度的百分比
		int currentQuesNum = 0;
		
		int percent = 0;
		
		int qnaireQuestionTotalNum = qnaire.getQnaireQuesNum();
	
	%>

	<!-- 封装浏览器的整个页面 此处id为问卷id-->
	<div  class="main" id="<%=qnaireId%>" style="min-height:100%;">
		


			
		

			<!------------------------页面体，展示问卷的内容 --------------------------------->
			<div  id="pageContent" class="qnaireContent">
			

				<!-------------------- 答卷收集时需要的一些隐藏信息，在问卷中不会展示给用户 ------------------------->
				<div class="QnaireExtraInfo" style="display:none">

					<!-- 保存用户的邮箱，用来唯一标识该用户  -->
					<%
						if (staffEmail != null) {
					%>
					<input value="<%=staffEmail%>" style="display:none"
						class="AnswerUserEmail" />
					<%
						}
					%>

					<!-- 保存该问卷链接的shortUrl -->
					<input value="<%=request.getAttribute("shortUrl")%>"
						style="display:none" class="shortUrl" />
				</div>

				<!--------------------- 答卷收集时需要的一些隐藏信息，在问卷中不会展示给用户 结束----------------- -->
				
				<!-- --------------------------按照题目顺序答题时显示的第一页------------------------- -->
				
				<div class="page" id="page<%=currentQuesNum%>" data-role="page">
				
				<!------------------------ 页头，展示问卷的一些基本信息，比如问卷标题等 --------------------------------->
			<div data-role="header" class="qnaireHeader" style="background-color:#FFA81B;color:#FFF;">
				<div  id="icon">
					<%if(qnaire.getQnaireLogo()!=null){ %>
					<img src="<%=qnaire.getQnaireLogo()%>"/>
					<%} %>
				</div>
				<h1><%=qnaire.getQnaireTitle()%></h1>
				
			</div>
			<!------------------------页头，结束-------------------------------------------------------->
			
				<div class="pageContent" data-role="content">
				<div class="QnaireTitle"><!-- 问卷首页显示 标题-->
					<span style="font-size:40px;letter-spacing:4vw">问卷调查</span>
					<br/>
					——<%=qnaire.getQnaireTitle()%>
				</div>
				
				<!-- 问卷说明 -->
				<div class="QnaireTip">
					<%
						if (qnaire.getQnaireDescription() != null) {
					%><p><%=qnaire.getQnaireDescription()%></p>
					<%
						}else{
					%>	
						<img class="picture" src="css/img/dc_pic.png"/>
					<% 	
						}
					%>
				</div><!-- for问卷说明 -->
				
				<div class="submit" id="startButton">
					开始答题
				</div>
				</div><!-- for pageContent -->
				<!--------------------------页脚，展示一些提示信息---------------------------------------------->
			
			<div data-role="footer" class="pageFooter" style="background-color:#4F4c4c;color:#FFF" data-position="fixed" data-fullscreen="true" data-tap-toggle="false">
				<h3>大数据调研平台 技术支持<a class="refresh" onclick="refresh()">重答</a></h3>
			</div>
			<!---------------------------页脚结束-------------------------------------------------------->
				
				
				</div><!-- for starPage -->
				<!-- ----------------------------按顺序答题时显示的第一页结束----------------------------- -->
				
			
				

				<!------------------ 问题展示 ------------------------------------------------------->
				<div class="Questions">
				
					
					<%
						//对问题数组进行遍历
						Iterator it = questions.iterator();

						while (it.hasNext()) {

							//取出每个问题
							QuestionBasicinfo question = (QuestionBasicinfo) it.next();

							//获取问题的类型
							Integer QuesType = question.getQuesType();

							//获取问题属性
							QuestionBasicattr qattr = (QuestionBasicattr) question
									.getQuestionBasicattrs().iterator().next();
							
							if(QuesType!=20){
					%>
					<div class="page pageQ" data-role="page" id="p<%=question.getQuesBasicInfoId() %>" ifAnswered="1">
					<!-- 题目页头 -->
					<div data-role="header"  class="qnaireHeader" style="background-color:#FFA81B;color:#FFF;">
				<div  id="icon">
					<%if(qnaire.getQnaireLogo()!=null){ %>
					<img src="<%=qnaire.getQnaireLogo()%>"/>
					<%} %>
				</div>
				<h1><%=qnaire.getQnaireTitle()%></h1>
				
			</div>
					<!-- 题目页头结束 -->
					
					<!-- 题目页内容 -->
					<div class="pageContent" data-role="content">
					<% 
							//根据问题的类型选择相应的HTML代码
							if (QuesType.intValue() == 1) {
								currentQuesNum++;//当页问题数加一
					%>
					
					<!------------------------- 单选题 ------------------------------------------------------------>
					<div class="Question Q_type01" data-role="fieldcontain"
						id="<%=question.getQuesBasicInfoId()%>"
						ifquesrequired="<%=question.getQuesRequired()%>"
						ifRowRan="<%=question.getIfRowRan()%>"
						arrangeWay="<%=question.getQuesOptArrangeWay()%>"
						remark="<%=qattr.getRemark()%>"
						
						>

						<!----------------- 问题头部信息 ------------------------------------------------>
						<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />
							
							<!--问题序号 -->
							<!-- 单选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
										if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

						<!----------------- 问题头部信息 结束 ------------------------------------------------------->

						<!------------------ 问题内容 ------------------------------------------------------------>
						<div class="QuestionContent">

							<%
								//获取并遍历问题的选项
										ArrayList<OptionBasicinfo> options = service
												.getOptions(question.getQuesBasicInfoId());
										Iterator it1 = options.iterator();
										while (it1.hasNext()) {
											//取出每个选项
											OptionBasicinfo option = (OptionBasicinfo) it1.next();
											//获取选项id
											int optionId = option.getOptionBasicInfoId();
							%>

							<div class="Option"
								ifFillBlank="<%=option.getIfFillBlank().intValue()%>">

								<!-- 单选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->
								<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
									<%=option.getOptionTitle()%>

								</label> <input type="radio" name="<%=question.getQuesBasicInfoId()%>"
									id="<%=optionId%>" class="OptionButton" />

								<%
									if (option.getIfFillBlank().intValue() == 1) {
								%>

								<textarea name="inputtext"
									class="OptionFillBlank" placeholder="请说明原因..."
									ifRequired="<%=option.getIfFillBlankRequired() %>" 
                      	 			iType="<%=option.getRemark() %>"
                      	 			minWN="<%=option.getMinWordNum()%>"
                      	 			maxWN="<%=option.getMaxWordNum()%>"></textarea>
                      	 			<div class="error_description"></div>

								<%
									}//if 语句结束
								%>

							</div>
							<!-- for option -->

							<%
								} //option while 循环结束
							%>

						</div>
						<!-- for QuestionContent -->
						<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
					
					</div><!-- 单选题结束  -->
					<!------------------------- 单选题 结束------------------------------------------->
					
					
					
					
					

					<%
						//根据问题的类型选择相应的HTML代码
							} else if (QuesType.intValue() == 2) {
								currentQuesNum++;//当页问题数加一
					%>

					<!------------------------- 多选题 ------------------------------------------------------------>
					<div class="Question Q_type02" data-role="fieldcontain"
						id="<%=question.getQuesBasicInfoId()%>"
						ifquesrequired="<%=question.getQuesRequired()%>"
						ifRowRan="<%=question.getIfRowRan()%>"
						arrangeWay="<%=question.getQuesOptArrangeWay()%>"
						remark="<%=qattr.getRemark()%>"
						>

						<!----------------- 问题头部信息 ------------------------------------------------>
						<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

						<!----------------- 问题头部信息 结束 ------------------------------------------------------->

						<!------------------ 问题内容 ------------------------------------------------------------>
						<div class="QuestionContent">

							<%
								//获取并遍历问题的选项
										ArrayList<OptionBasicinfo> options = service
												.getOptions(question.getQuesBasicInfoId());
										Iterator it1 = options.iterator();
										while (it1.hasNext()) {
											//取出每个选项
											OptionBasicinfo option = (OptionBasicinfo) it1.next();
											//获取选项id
											int optionId = option.getOptionBasicInfoId();
							%>

							<div class="Option"
								ifFillBlank="<%=option.getIfFillBlank().intValue()%>">

								<!-- 复选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->
								<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
									<%=option.getOptionTitle()%>

								</label> <input type="checkbox"
									name="<%=question.getQuesBasicInfoId()%>" id="<%=optionId%>"
									class="OptionButton" />

								<%
									if (option.getIfFillBlank().intValue() == 1) {
								%>

								<textarea name="inputtext" 
									class="OptionFillBlank" placeholder="请说明原因..."
									ifRequired="<%=option.getIfFillBlankRequired() %>" 
                      	 			iType="<%=option.getRemark() %>"
                      	 			minWN="<%=option.getMinWordNum()%>"
                      	 			maxWN="<%=option.getMaxWordNum()%>"></textarea>
                      	 		<div class="error_description"></div>

								<%
									}//if 语句结束
								%>

							</div>
							<!-- for option -->

							<%
								} //option while 循环结束
							%>

						</div>
						<!-- for QuestionContent -->
						<!-------------------- 问题内容结束  ------------------------------------------------------------------>
					
					<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						
						</div>
					<!-- 多选题结束  -->
					
					<!------------------------- 多选题 结束------------------------------------------->

					<%
						//根据问题的类型选择相应的HTML代码
							} else if (QuesType.intValue() == 3) {
								currentQuesNum++;//当页问题数加一
					%>

					<!------------------------- 单项填空题 ------------------------------------------------------------>
					<div class="Question Q_type03" data-role="fieldcontain"
						id="<%=question.getQuesBasicInfoId()%>"
						ifquesrequired="<%=question.getQuesRequired()%>"
						 >

						<!----------------- 问题头部信息 ------------------------------------------------>
						<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>
						</div>
						<!-- for QuestionHeader -->

						<!----------------- 问题头部信息 结束 ------------------------------------------------------->

						<!------------------ 问题内容 ------------------------------------------------------------>
						<div class="QuestionContent">

							<%
								//获取并遍历问题的选项
										ArrayList<OptionBasicinfo> options = service
												.getOptions(question.getQuesBasicInfoId());
										Iterator it1 = options.iterator();
										while (it1.hasNext()) {
											//取出每个选项
											OptionBasicinfo option = (OptionBasicinfo) it1.next();
											//获取选项id
											int optionId = option.getOptionBasicInfoId();
							%>

							<div class="Option">

								<!--填空框-->
								<label for="<%=optionId%>" class="OptionTitle"> </label>

								<!-- textarea两个标签中间不能有空格 -->
								<textarea name="<%=question.getQuesBasicInfoId()%>"
									id="<%=optionId%>" 									
									ifRequired="<%=question.getQuesRequired()%>" 
                      				iType="<%=option.getRemark() %>"
                      				minWN="<%=option.getMinWordNum()%>"
                      				maxWN="<%=option.getMaxWordNum()%>"
									class="inputBox"></textarea>
								<div class="error_description"></div>

							</div>
							<!-- for option -->

							<%
								} //option while 循环结束
							%>

						</div>
						<!-- for QuestionContent -->
						<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
					
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
					</div>
					<!-- 单项填空题结束  -->
					<!------------------------- 单项填空题 结束------------------------------------------->


					<%
						//根据问题的类型选择相应的HTML代码
							} else if (QuesType.intValue() == 4) {
								currentQuesNum++;//当页问题数加一
					%>

					<!------------------------- 多项填空题 ------------------------------------------------------------>
					<div class="Question Q_type04" data-role="fieldcontain"
						id="<%=question.getQuesBasicInfoId()%>"
						ifquesrequired="<%=question.getQuesRequired()%>"
						 >

						<!----------------- 问题头部信息 ------------------------------------------------>
						<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

						<!----------------- 问题头部信息 结束 ------------------------------------------------------->

						<!------------------ 问题内容 ------------------------------------------------------------>
						<div class="QuestionContent">

							<%
								//获取并遍历问题的选项
										ArrayList<OptionBasicinfo> options = service
												.getOptions(question.getQuesBasicInfoId());
										Iterator it1 = options.iterator();
										while (it1.hasNext()) {
											//取出每个选项
											OptionBasicinfo option = (OptionBasicinfo) it1.next();
											//获取选项id
											int optionId = option.getOptionBasicInfoId();
							%>

							<div class="Option ui-grid-a">

								<div class="ui-block-a"
									style="width:20%;padding-top: 20px;padding-bottom: 20px;">
									<!--填空框-->
									<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
										<%=option.getOptionTitle()%>:
									</label>
								</div>
								<div class="ui-block-b" style="width:80%;">
									<!-- textarea两个标签中间不能有空格 -->
									<textarea name="<%=question.getQuesBasicInfoId()%>"
										id="<%=optionId%>" 
										ifRequired="<%=question.getQuesRequired() %>" 
                      	 				iType="<%=option.getRemark() %>"
                      	 				minWN="<%=option.getMinWordNum()%>"
                      	 				maxWN="<%=option.getMaxWordNum()%>"																		
										class="inputBox"></textarea>
										<div class="error_description"></div>
								</div>
								
							</div>
							<!-- for option -->

							<%
								} //option while 循环结束
							%>

						</div>
						<!-- for QuestionContent -->
						<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
					
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
					</div>
					<!-- 多项填空题结束  -->
					<!------------------------- 多项填空题 结束------------------------------------------->
					<%
						//根据问题的类型选择相应的HTML代码
							} else if (QuesType.intValue() == 5) {
								currentQuesNum++;//当页问题数加一
					%>
					<!------------------------- 矩阵滑动条  ------------------------------------------------>
					<div class="Question Q_type05" data-role="fieldcontain"
						id="<%=question.getQuesBasicInfoId()%>"
						ifRowRan="<%=question.getIfRowRan()%>"
						ifquesrequired="<%=question.getQuesRequired()%>"
						 >

						<!----------------- 问题头部信息 ------------------------------------------------>
						<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

						<!----------------- 问题头部信息 结束 ------------------------------------------------------->
						<!-- ---------------问题内容---------------------------------------------------------- -->
						<div class="QuestionContent">

							<%

										//获取并遍历问题的所有选项
										ArrayList<OptionBasicinfo> options = service
												.getOptions(question.getQuesBasicInfoId());
										Iterator it1 = options.iterator();
										while (it1.hasNext()) {

											//取出每个选项
											OptionBasicinfo rowOption = (OptionBasicinfo) it1.next();

											
										

										
							%>

							<div class="sliderArea Option" id="<%=rowOption.getOptionBasicInfoId()%>"
								style="margin-bottom:20px">

								<!-- 行选项标题  -->
								<span class="rowOptionTitle OptionTitle"><%=rowOption.getOptionTitle()%></span>


								<input type="range" name="<%=rowOption.getOptionBasicInfoId()%>"
									id="<%=rowOption.getOptionBasicInfoId()%>" class="slider OptionButton"
									min="<%=qattr.getSliderMinValue()%>"
									max="<%=qattr.getSliderMaxValue()%>" />
								
								

							</div>
							<!-- for Option -->
								<%
									} //while 循环结束
								%>

							

							

						</div>
						<!-- for QuestionContent -->
						<!-- -----------------问题内容结束---------------------------------------------------- -->
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div><!-- 矩阵滑动条结束 -->
						<!------------------------ 矩阵滑动条结束 -------------------------------------------------------->

						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 6) {
									currentQuesNum++;//当页问题数加一
						%>


						<!------------------------- 矩阵单选题 ------------------------------------------------------------>

						<div class="Question Q_type06" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							ifColRan="<%=question.getIfColRan()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//保存问题的列选项
											ArrayList<OptionBasicinfo> colOptions = new ArrayList<OptionBasicinfo>();
											//保存问题的行选项
											ArrayList<OptionBasicinfo> rowOptions = new ArrayList<OptionBasicinfo>();

											//获取并遍历问题的所有选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {

												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();

												//找出列选项
												if (option.getOptionType().intValue() == 1) {

													colOptions.add(option);
												}

												//找出行选项
												if (option.getOptionType().intValue() == 0) {

													rowOptions.add(option);
												}
											}//while 结束

											//对所有的行选项进行遍历
											Iterator it2 = rowOptions.iterator();
											while (it2.hasNext()) {

												OptionBasicinfo rowTemp = (OptionBasicinfo) it2.next();
								%>

								<div class="rowOption" id="<%=rowTemp.getOptionBasicInfoId()%>"
									style="margin-bottom:20px">

									<!-- 行选项标题  -->
									<span class="rowOptionTitle OptionTitle"><%=rowTemp.getOptionTitle()%></span>

									<%
										//对列选项进行遍历
													Iterator it3 = colOptions.iterator();
													while (it3.hasNext()) {

														OptionBasicinfo colTemp = (OptionBasicinfo) it3
																.next();
									%>
									<div class="colOption Option" ifFillBlank="<%=colTemp.getIfFillBlank().intValue()%>">
										<label
											for="<%=rowTemp.getOptionBasicInfoId()%>-<%=colTemp.getOptionBasicInfoId()%>"
											class="colOptionTitle OptionTitle"> <!-- 选项标题 --> <%=colTemp.getOptionTitle()%>

										</label> <input type="radio"
											name="<%=rowTemp.getOptionBasicInfoId()%>"
											id="<%=rowTemp.getOptionBasicInfoId()%>-<%=colTemp.getOptionBasicInfoId()%>"
											class="OptionButton" />
											
										<%
											if (colTemp.getIfFillBlank().intValue() == 1) {
										%>

										<textarea name="inputtext" 
										class="OptionFillBlank" placeholder="请说明原因..."
										ifRequired="<%=colTemp.getIfFillBlankRequired() %>" 
                      	 				iType="<%=colTemp.getRemark() %>"
                      	 				minWN="<%=colTemp.getMinWordNum()%>"
                      	 				maxWN="<%=colTemp.getMaxWordNum()%>"></textarea>
                      	 				<div class="error_description"></div>
										<%
											}//if 语句结束
										%>
									</div>
									<!-- for colOption -->
									<%
										} //colOption while 循环结束
									%>

								</div>
								<!-- for rowOption -->

								<%
									} //rowOption while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
					
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
					
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 矩阵题结束  -->
						<!------------------------- 矩阵单选题 结束------------------------------------------->


						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 7) {
									currentQuesNum++;//当页问题数加一
						%>


						<!------------------------- 矩阵多选题 ------------------------------------------------------------>

						<div class="Question Q_type07" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							ifColRan="<%=question.getIfColRan()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//保存问题的列选项
											ArrayList<OptionBasicinfo> colOptions = new ArrayList<OptionBasicinfo>();
											//保存问题的行选项
											ArrayList<OptionBasicinfo> rowOptions = new ArrayList<OptionBasicinfo>();

											//获取并遍历问题的所有选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {

												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();

												//找出列选项
												if (option.getOptionType().intValue() == 1) {

													colOptions.add(option);
												}

												//找出行选项
												if (option.getOptionType().intValue() == 0) {

													rowOptions.add(option);
												}
											}//while 结束

											//对所有的行选项进行遍历
											Iterator it2 = rowOptions.iterator();
											while (it2.hasNext()) {

												OptionBasicinfo rowTemp = (OptionBasicinfo) it2.next();
								%>

								<div class="rowOption" id="<%=rowTemp.getOptionBasicInfoId()%>"
									style="margin-bottom:20px">

									<!-- 行选项标题  -->
									<span class="rowOptionTitle OptionTitle"><%=rowTemp.getOptionTitle()%></span>

									<%
										//对列选项进行遍历
													Iterator it3 = colOptions.iterator();
													while (it3.hasNext()) {

														OptionBasicinfo colTemp = (OptionBasicinfo) it3
																.next();
									%>
									<div class="colOption Option" ifFillBlank="<%=colTemp.getIfFillBlank().intValue()%>">
										<label
											for="<%=rowTemp.getOptionBasicInfoId()%>-<%=colTemp.getOptionBasicInfoId()%>"
											class="colOptionTitle OptionTitle"> <!-- 选项标题 --> <%=colTemp.getOptionTitle()%>

										</label> <input type="checkbox"
											name="<%=rowTemp.getOptionBasicInfoId()%>"
											id="<%=rowTemp.getOptionBasicInfoId()%>-<%=colTemp.getOptionBasicInfoId()%>"
											class="OptionButton" />
											
										<%
											if (colTemp.getIfFillBlank().intValue() == 1) {
										%>

										<textarea name="inputtext"
										class="OptionFillBlank" placeholder="请说明原因..."
										ifRequired="<%=colTemp.getIfFillBlankRequired() %>" 
                      	 				iType="<%=colTemp.getRemark() %>"
                      	 				minWN="<%=colTemp.getMinWordNum()%>"
                      	 				maxWN="<%=colTemp.getMaxWordNum()%>"></textarea>
										<div class="error_description"></div>
										<%
											}//if 语句结束
										%>
									</div>
									<!-- for colOption -->
									<%
										} //colOption while 循环结束
									%>

								</div>
								<!-- for rowOption -->

								<%
									} //rowOption while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 矩阵题结束  -->
						<!------------------------- 矩阵多选题 结束------------------------------------------->

						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 8) {
									currentQuesNum++;//当页问题数加一
						%>
						<!-- ------------------表格下拉题--------------------------------------------------- -->
						<div class="Question Q_type08" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							ifColRan="<%=question.getIfColRan()%>"
							ifListRan="<%=question.getIfListRan()%>"
							 >
							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!-- ---------------问题内容 ---------------------------------------------------------- -->
							<div class="QuestionContent">
								<%
									//保存问题的列选项
											ArrayList<OptionBasicinfo> colOptions = new ArrayList<OptionBasicinfo>();
											//保存问题的行选项
											ArrayList<OptionBasicinfo> rowOptions = new ArrayList<OptionBasicinfo>();

											//保存问题的下拉选项
											ArrayList<OptionBasicinfo> selectOptions = new ArrayList<OptionBasicinfo>();

											//获取并遍历问题的所有选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {

												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();

												//找出列选项
												if (option.getOptionType().intValue() == 1) {

													colOptions.add(option);
												}

												//找出行选项
												if (option.getOptionType().intValue() == 0) {

													rowOptions.add(option);
												}

												if (option.getOptionType().intValue() == 2) {
													selectOptions.add(option);
												}

											}//while 结束

											//对所有的行选项进行遍历
											Iterator it2 = rowOptions.iterator();
											while (it2.hasNext()) {

												OptionBasicinfo rowTemp = (OptionBasicinfo) it2.next();
								%>
								<div class="rowOption" id="<%=rowTemp.getOptionBasicInfoId()%>"
									style="margin-bottom:20px">

									<!-- 行选项标题  -->
									<span class="rowOptionTitle OptionTitle"><%=rowTemp.getOptionTitle()%></span>

									<%
										//对列选项进行遍历
													Iterator it3 = colOptions.iterator();
													while (it3.hasNext()) {

														OptionBasicinfo colTemp = (OptionBasicinfo) it3
																.next();
									%>
									<div class="colOption Option">
										<label
											for="<%=rowTemp.getOptionBasicInfoId()%>-<%=colTemp.getOptionBasicInfoId()%>"
											class="colOptionTitle OptionTitle"> <!-- 选项标题 --> <%=colTemp.getOptionTitle()%>

										</label> <select name="<%=rowTemp.getOptionBasicInfoId()%>"
											id="<%=rowTemp.getOptionBasicInfoId()%>-<%=colTemp.getOptionBasicInfoId()%>"
											class="selectOption">
											<!-- 第一个选项用来填写提示信息 -->
											<option value="option0">请选择</option>
											<%
												//对选择选项进行便利
																Iterator it4 = selectOptions.iterator();
																while (it4.hasNext()) {
																	OptionBasicinfo selectTemp = (OptionBasicinfo) it4
																			.next();
											%>
											<option
												id="<%=rowTemp.getOptionBasicInfoId()%>-<%=colTemp.getOptionBasicInfoId()%>-<%=selectTemp.getOptionBasicInfoId()%>" class="option"><%=selectTemp.getOptionTitle()%></option>
											<%
												} //selectOption while 循环结束
											%>
										</select>
									</div>
									<!-- for colOption -->
									<%
										} //colOption while 循环结束
									%>

								</div>
								<!-- for rowOption -->

								<%
									} //rowOption while 循环结束
								%>

							</div>
							<!-- end for QuestionContent -->
							<!-- ------------------问题内容结束---------------------------------------- -->
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 表格下拉题结束 -->
						<!-- ---------------------------表格下拉题结束--------------------------------------------- -->
						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 9) {
									currentQuesNum++;//当页问题数加一
						%>


						<!------------------------- 矩阵填空题 ------------------------------------------------------------>

						<div class="Question Q_type09" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							ifColRan="<%=question.getIfColRan()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//保存问题的列选项
											ArrayList<OptionBasicinfo> colOptions = new ArrayList<OptionBasicinfo>();
											//保存问题的行选项
											ArrayList<OptionBasicinfo> rowOptions = new ArrayList<OptionBasicinfo>();

											//获取并遍历问题的所有选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {

												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();

												//找出列选项
												if (option.getOptionType().intValue() == 1) {

													colOptions.add(option);
												}

												//找出行选项
												if (option.getOptionType().intValue() == 0) {

													rowOptions.add(option);
												}
											}//while 结束

											//对所有的行选项进行遍历
											Iterator it2 = rowOptions.iterator();
											while (it2.hasNext()) {

												OptionBasicinfo rowTemp = (OptionBasicinfo) it2.next();
								%>

								<div class="rowOption ui-grid-a"
									id="<%=rowTemp.getOptionBasicInfoId()%>"
									style="margin-bottom:20px">

									<!-- 行选项标题  -->
									<span class="rowOptionTitle OptionTitle"
										style="display:block;text-align:left;"><%=rowTemp.getOptionTitle()%></span><span></span>

									<%
										//对列选项进行遍历
													Iterator it3 = colOptions.iterator();
													while (it3.hasNext()) {

														OptionBasicinfo colTemp = (OptionBasicinfo) it3
																.next();
									%>
									<div class="colOption Option">
										<div class="ui-block-a"
											style="width:25%;padding-top: 20px;padding-bottom: 20px;">

											<label
												for="<%=rowTemp.getOptionBasicInfoId()%>-<%=colTemp.getOptionBasicInfoId()%>"
												class="colOptionTitle OptionTitle"> <!-- 选项标题 --> <%=colTemp.getOptionTitle()%>

											</label>
										</div>

										<div class="ui-block-b" style="width:75%;">
											<textarea name="<%=rowTemp.getOptionBasicInfoId()%>"
												id="<%=rowTemp.getOptionBasicInfoId()%>-<%=colTemp.getOptionBasicInfoId()%>"
												class="inputBox"
												ifRequired="<%=question.getQuesRequired()%>" 
                      	 						iType="<%=qattr.getFormat() %>"
                      	 						minWN="<%=colTemp.getMinWordNum()%>"
                      	 						maxWN="<%=colTemp.getMaxWordNum()%>"></textarea>
                      	 					<div class="error_description"></div>
										</div>
									</div>
									<!-- for colOption -->

									<%
										} //colOption while 循环结束
									%>

								</div>
								<!-- for rowOption -->

								<%
									} //rowOption while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 矩阵题结束  -->
						<!------------------------- 矩阵填空题 结束------------------------------------------->

						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 11) {
									currentQuesNum++;//当页问题数加一
						%>
						<!------------------------- 量表题 ------------------------------------------------------------>
						<div class="Question Q_type11" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							scaleStyleType="<%=qattr.getScaleStyleType()%>"
							step="<%=question.getRemark()%>"
							 
							>

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">
								
											<%
												//获取并遍历问题的选项
														ArrayList<OptionBasicinfo> options = service
																.getOptions(question.getQuesBasicInfoId());
														Iterator it1 = options.iterator();

														//用于对按钮进行表示的变量
														int i = 1;
														String colIds = "";
														//拼接列选项id
														while (it1.hasNext()) {
															//取出每个选项
															OptionBasicinfo option = (OptionBasicinfo) it1.next();
															//找选项
															
															if(option.getOptionType().intValue()==1){
																colIds += option.getOptionBasicInfoId()+",";
															}
														}
														
														Iterator it2 = options.iterator();
														
														while(it2.hasNext()){
															//取出每个选项
															OptionBasicinfo option = (OptionBasicinfo) it2.next();
															if (option.getOptionType().intValue() == 0) {

																//列选项id
																int rowOptionId = option.getOptionBasicInfoId();
											%>
													<div class="Option"  id="<%=rowOptionId%>" colId=<%=colIds%>>


											

											

											<%
												}// if结束
														} //option while 循环结束
											%>
									
								</div><!-- for option -->

								
							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
							
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 单选题结束  -->
						<!------------------------- 量表题 结束------------------------------------------->


						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 12) {
									currentQuesNum++;//当页问题数加一
						%>

						<!------------------------- 评分单选题 ------------------------------------------------------------>
						<div class="Question Q_type12" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							arrangeWay="<%=question.getQuesOptArrangeWay()%>"
							remark="<%=qattr.getRemark()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//获取并遍历问题的选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {
												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();
												//获取选项id
												int optionId = option.getOptionBasicInfoId();
								%>

								<div class="Option"
									ifFillBlank="<%=option.getIfFillBlank().intValue()%>">

									<!-- 单选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->
									<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
										<%=option.getOptionTitle()%>（分值：<%=option.getOptionScore()%>）

									</label> <input type="radio" name="<%=question.getQuesBasicInfoId()%>"
										id="<%=optionId%>" class="OptionButton" />

									<%
										if (option.getIfFillBlank().intValue() == 1) {
									%>

									<textarea name="inputtext"
										class="OptionFillBlank" placeholder="请说明原因..."
										ifRequired="<%=option.getIfFillBlankRequired() %>" 
                      	 				iType="<%=option.getRemark() %>"
                      	 				minWN="<%=option.getMinWordNum()%>"
                      	 				maxWN="<%=option.getMaxWordNum()%>"></textarea>
                      	 				<div class="error_description"></div>
									<%
										}//if 语句结束
									%>

								</div>
								<!-- for option -->

								<%
									} //option while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 单选题结束  -->
						<!------------------------- 评分单选题 结束------------------------------------------->

						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 13) {
									currentQuesNum++;//当页问题数加一
						%>

						<!------------------------- 评分多选题 ------------------------------------------------------------>
						<div class="Question Q_type13" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							arrangeWay="<%=question.getQuesOptArrangeWay()%>"
							remark="<%=qattr.getRemark()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//获取并遍历问题的选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {
												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();
												//获取选项id
												int optionId = option.getOptionBasicInfoId();
								%>

								<div class="Option"
									ifFillBlank="<%=option.getIfFillBlank().intValue()%>">

									<!-- 复选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->
									<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
										<%=option.getOptionTitle()%>（分值：<%=option.getOptionScore()%>）

									</label> <input type="checkbox"
										name="<%=question.getQuesBasicInfoId()%>" id="<%=optionId%>"
										class="OptionButton" />

									<%
										if (option.getIfFillBlank().intValue() == 1) {
									%>

									<textarea name="inputtext"
										class="OptionFillBlank" placeholder="请说明原因..."
										ifRequired="<%=option.getIfFillBlankRequired() %>" 
                      	 				iType="<%=option.getRemark() %>"
                      	 				minWN="<%=option.getMinWordNum()%>"
                      	 				maxWN="<%=option.getMaxWordNum()%>"></textarea>
									<div class="error_description"></div>
									<%
										}//if 语句结束
									%>

								</div>
								<!-- for option -->

								<%
									} //option while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 评分多选题结束  -->
						<!------------------------- 评分多选题 结束------------------------------------------->

						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 14) {
									currentQuesNum++;//当页问题数加一
						%>

						<!------------------------- 考试单选题 ------------------------------------------------------------>
						<div class="Question Q_type14" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							arrangeWay="<%=question.getQuesOptArrangeWay()%>"
							remark="<%=qattr.getRemark()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>(分值：<%=question.getQuesScore()%>)
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">
								<%
									//获取并遍历问题的选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {
												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();
												//获取选项id
												int optionId = option.getOptionBasicInfoId();
								%>
								<div class="Option"
									ifFillBlank="<%=option.getIfFillBlank().intValue()%>">

									<!-- 单选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->
									<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
										<%=option.getOptionTitle()%>

									</label> <input type="radio" name="<%=question.getQuesBasicInfoId()%>"
										id="<%=optionId%>" class="OptionButton" />

									<%
										if (option.getIfFillBlank().intValue() == 1) {
									%>

									<textarea name="inputtext"
										class="OptionFillBlank" placeholder="请说明原因..."
										ifRequired="<%=option.getIfFillBlankRequired() %>" 
                      	 				iType="<%=option.getRemark() %>"
                      	 				minWN="<%=option.getMinWordNum()%>"
                      	 				maxWN="<%=option.getMaxWordNum()%>"></textarea>
                      	 				<div class="error_description"></div>

									<%
										}//if 语句结束
									%>

								</div>
								<!-- for option -->
								<%
									} //option while 循环结束
								%>
							</div>
							<!-- end of question content -->
							<!-- -----------------问题内容结束 -------------------------------------------------------- -->
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
					
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- -----------------考试单选题结束----------------------------------------------------- -->

						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 15) {
									currentQuesNum++;//当页问题数加一
						%>

						<!------------------------- 考试多选题 ------------------------------------------------------------>
						<div class="Question Q_type15" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							arrangeWay="<%=question.getQuesOptArrangeWay()%>"
							remark="<%=qattr.getRemark()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>(分值：<%=question.getQuesScore()%>)
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">
								<%
									//获取并遍历问题的选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {
												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();
												//获取选项id
												int optionId = option.getOptionBasicInfoId();
								%>
								<div class="Option"
									ifFillBlank="<%=option.getIfFillBlank().intValue()%>">

									<!-- 单选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->
									<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
										<%=option.getOptionTitle()%>

									</label> <input type="checkbox"
										name="<%=question.getQuesBasicInfoId()%>" id="<%=optionId%>"
										class="OptionButton" />

									<%
										if (option.getIfFillBlank().intValue() == 1) {
									%>

									<textarea name="inputtext"
										class="OptionFillBlank" placeholder="请说明原因..."
										ifRequired="<%=option.getIfFillBlankRequired() %>" 
                      	 				iType="<%=option.getRemark() %>"
                      	 				minWN="<%=option.getMinWordNum()%>"
                      	 				maxWN="<%=option.getMaxWordNum()%>"></textarea>
										<div class="error_description"></div>
									<%
										}//if 语句结束
									%>

								</div>
								<!-- for option -->
								<%
									} //option while 循环结束
								%>
							</div>
							<!-- end of question content -->
							<!-- -----------------问题内容结束 -------------------------------------------------------- -->
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- -----------------考试多选题结束----------------------------------------------------- -->


						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 16) {
									currentQuesNum++;//当页问题数加一
						%>

						<!------------------------- 考试单项填空题 ------------------------------------------------------------>
						<div class="Question Q_type16" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>(分值：<%=question.getQuesScore()%>)
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//获取并遍历问题的选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {
												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();
												//获取选项id
												int optionId = option.getOptionBasicInfoId();
								%>

								<div class="Option">

									<!--填空框-->
									<label for="<%=optionId%>" class="OptionTitle"> </label>

									<!-- textarea两个标签中间不能有空格 -->
									<textarea name="<%=question.getQuesBasicInfoId()%>"
										id="<%=optionId%>" class="inputBox"
										ifRequired="<%=question.getQuesRequired() %>" 
                      					iType="<%=option.getRemark() %>"
                      					minWN="<%=option.getMinWordNum()%>"
                      					maxWN="<%=option.getMaxWordNum()%>"></textarea>
                      				<div class="error_description"></div>

								</div>
								<!-- for option -->

								<%
									} //option while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						</div>
						<!-- 考试单项填空题结束  -->
						<!------------------------- 考试单项填空题 结束------------------------------------------->

						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 17) {
									currentQuesNum++;//当页问题数加一
						%>

						<!------------------------- 考试多项填空题 ------------------------------------------------------------>
						<div class="Question Q_type17" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>(分值：<%=question.getQuesScore()%>)
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//获取并遍历问题的选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {
												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();
												//获取选项id
												int optionId = option.getOptionBasicInfoId();
								%>

								<div class="Option ui-grid-a">

									<div class="ui-block-a"
										style="width:20%;padding-top: 20px;padding-bottom: 20px;">
										<!--填空框-->
										<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
											<%=option.getOptionTitle()%>:
										</label>
									</div>
									<div class="ui-block-b" style="width:80%;">
										<!-- textarea两个标签中间不能有空格 -->
										<textarea name="<%=question.getQuesBasicInfoId()%>"
											id="<%=optionId%>" class="inputBox"
											id="<%=optionId %>" 
                        					ifRequired="<%=question.getQuesRequired()%>" 
                      	 					iType="<%=option.getRemark() %>"
                      	 					minWN="<%=option.getMinWordNum()%>"
                      	 					maxWN="<%=option.getMaxWordNum()%>"></textarea>
                      	 					<div class="error_description"></div>
									</div>
								</div>
								<!-- for option -->

								<%
									} //option while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
					<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 考试多项填空题结束  -->
						<!------------------------- 考试多项填空题 结束------------------------------------------->

						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 18) {
									currentQuesNum++;//当页问题数加一
						%>

						<!------------------------- 投票单选题 ------------------------------------------------------------>
						<div class="Question Q_type18" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							ifShowVoteNum="<%=qattr.getIfShowVoteNum()%>"
							ifShowPercentage="<%=qattr.getIfShowPercentage()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//获取并遍历问题的选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {
												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();
												//获取选项id
												int optionId = option.getOptionBasicInfoId();
								%>

								<div class="Option"
									ifFillBlank="<%=option.getIfFillBlank().intValue()%>">

									<!-- 单选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->
									<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
										<%=option.getOptionTitle()%>
										<span class="vote" style="display:none">（当前票数：<%=option.getVoteTotalNum()%>）</span>
										<span class="percent" style="display:none"><%=option.getVotePercent() %>%</span>

									</label> <input type="radio" name="<%=question.getQuesBasicInfoId()%>"
										id="<%=optionId%>" class="OptionButton" />

									<%
										if (option.getIfFillBlank().intValue() == 1) {
									%>

									<textarea name="inputtext" 
										class="OptionFillBlank" placeholder="请说明原因..."
										ifRequired="<%=option.getIfFillBlankRequired() %>" 
                      	 				iType="<%=option.getRemark() %>"
                      	 				minWN="<%=option.getMinWordNum()%>"
                      	 				maxWN="<%=option.getMaxWordNum()%>"></textarea>
                      	 				<div class="error_description"></div>

									<%
										}//if 语句结束
									%>

								</div>
								<!-- for option -->

								<%
									} //option while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 单选题结束  -->
						<!------------------------- 投票单选题 结束------------------------------------------->

						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 19) {
									currentQuesNum++;//当页问题数加一
						%>

						<!------------------------- 投票多选题 ------------------------------------------------------------>
						<div class="Question Q_type19" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							ifShowVoteNum="<%=qattr.getIfShowVoteNum()%>"
							ifShowPercentage="<%=qattr.getIfShowPercentage()%>"
							 >

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//获取并遍历问题的选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {
												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();
												//获取选项id
												int optionId = option.getOptionBasicInfoId();
								%>

								<div class="Option"
									ifFillBlank="<%=option.getIfFillBlank().intValue()%>">

									<!-- 复选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->
									<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
										<%=option.getOptionTitle()%>
										<span class="vote" style="display:none">（当前票数：<%=option.getVoteTotalNum()%>）</span>
										<span class="percent" style="display:none"><%=option.getVotePercent() %>%</span>

									</label> <input type="checkbox"
										name="<%=question.getQuesBasicInfoId()%>" id="<%=optionId%>"
										class="OptionButton" />

									<%
										if (option.getIfFillBlank().intValue() == 1) {
									%>

									<textarea name="inputtext"
										class="OptionFillBlank" placeholder="请说明原因..."
										ifRequired="<%=option.getIfFillBlankRequired() %>" 
                      	 				iType="<%=option.getRemark() %>"
                      	 				minWN="<%=option.getMinWordNum()%>"
                      	 				maxWN="<%=option.getMaxWordNum()%>"></textarea>
										<div class="error_description"></div>
									<%
										}//if 语句结束
									%>

								</div>
								<!-- for option -->

								<%
									} //option while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 多选题结束  -->
						<!------------------------- 投票多选题 结束------------------------------------------->


						
						<%
							} else if (QuesType.intValue() == 23) {
									currentQuesNum++;//当页问题数加一
						%>
						<!------------------------- 文件上传题------------------------------------------------------------>
						<div class="Question Q_type23" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							 
							>

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//获取并遍历问题的选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {
												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();
												//获取选项id
												int optionId = option.getOptionBasicInfoId();
								%>

								<div class="Option"
									ifFillBlank="<%=option.getIfFillBlank().intValue()%>">

									<!-- 单选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->
									<label for="<%=optionId%>" class="OptionTitle"> <!-- 选项标题 -->
										<%=option.getOptionTitle()%>

									</label> <input type="file" name="<%=question.getQuesBasicInfoId()%>"
										id="<%=optionId%>" class="OptionButton" /> <span>(5M以内)</span>

								</div>
								<!-- for option -->

								<%
									} //option while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						</div>
						<!-- 上传题结束  -->
						<!------------------------- 文件上传题 结束------------------------------------------->
						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 21) {
						%>

						<!------------------------- 段落说明题 ------------------------------------------------------------>
						<div class="Question Q_type21" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>">

							<!----------------- 问题头部信息 ------------------------------------------------>
								<div class="QuestionHeader">


								<!-- 问题序号 -->
								<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<!-- 段落说明提示 -->
									<p>
										<%=question.getQuesTitle()%>
									</p>
								</div>

								
							</div><!-- for QuestionHeader -->
							<!----------------- 问题头部信息 结束 ------------------------------------------------------->
							<!-- ---------------------段落说明题题目内容------------------------------------- -->
							
								<div class="QuestionContent">
									
								</div>
							<!-- --------------------段落说明题题目内容结束------------------------------------------------- -->


							

							
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- for question -->

						<!-- ------------------段落说明题结束------------------------------------------------ -->


						<%
							} else if (QuesType.intValue() == 22) {
									currentQuesNum++;//当页问题数加一
						%>
						<!------------------------- 排序题------------------------------------------------------------>
						<div class="Question Q_type22" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							 
							>

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">
								<ul class="unstyled M_sorting" maxOptionNum="<%=qattr.getMaxOptionNum()%>">
									<%
										//获取并遍历问题的选项
												ArrayList<OptionBasicinfo> options = service
														.getOptions(question.getQuesBasicInfoId());
												Iterator it1 = options.iterator();
												while (it1.hasNext()) {
													//取出每个选项
													OptionBasicinfo option = (OptionBasicinfo) it1.next();
													//获取选项id
													int optionId = option.getOptionBasicInfoId();
									%>

									<li class="unsort Option" id="<%=optionId%>">
										<!-- 单选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->


										<!-- 选项标题 --> <span class="OptionTitle" style="padding:5%"><%=option.getOptionTitle()%></span>





									</li>
									<!-- for option -->

									<%
										} //option while 循环结束
									%>
								</ul>
							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->

						</div>
						<!-- 排序题结束  -->
						<!------------------------- 排序题 结束------------------------------------------->
						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 24) {
									currentQuesNum++;//当页问题数加一
									int step = 0;
									ArrayList<OptionBasicinfo> rowOptions = new ArrayList<OptionBasicinfo>();
									ArrayList<OptionBasicinfo> colOptions = new ArrayList<OptionBasicinfo>();
						
									ArrayList<OptionBasicinfo> options = service.getOptions(question.getQuesBasicInfoId());
									//对所有的行选项进行遍历
									Iterator it1 = options.iterator();
									while (it1.hasNext()) {
										OptionBasicinfo option = (OptionBasicinfo)it1.next();
										if(option.getOptionType()==0){
											rowOptions.add(option);
										}
										
										if(option.getOptionType()==1){
											colOptions.add(option);
											step++;
										}
										
									}	
									
						%>


						<!------------------------- 矩阵量表题 ------------------------------------------------------------>

						<div class="Question Q_type24" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							ifRowRan="<%=question.getIfRowRan()%>"
							scaleStyleType="3"
							step="<%=step%>"
							>

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<div class="QuestionContent">

								<%
									
											
										
											
											Iterator it2 = rowOptions.iterator();
											while(it2.hasNext()){
												OptionBasicinfo rowTemp = (OptionBasicinfo)it2.next();
								%>

								<div class="rowOption" id="<%=rowTemp.getOptionBasicInfoId()%>"
									>

									<!-- 行选项标题  -->
									<span class="OptionTitle" style="padding-top:18px;display:block"><%=rowTemp.getOptionTitle()%></span>
								<%
												Iterator it3 = colOptions.iterator();
												while(it3.hasNext()){
													OptionBasicinfo colTemp = (OptionBasicinfo)it3.next();	
												
								%>
									<div class="colOption Option">
									<label><input type="radio" class="OptionButton" name="<%=rowTemp.getOptionBasicInfoId()%>" id ="<%=rowTemp.getOptionBasicInfoId()%>-<%=colTemp.getOptionBasicInfoId()%>"><%=colTemp.getOptionTitle() %></label>
									
									</div>
								<%
												}//colOption while循环
								%>
								</div>
								<!-- for rowOption -->

								<%
									} //rowOption while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						<!-- ------------------问题的结尾----------------------------------------- -->
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 矩阵量表题结束  -->
						<!------------------------- 矩阵量表题 结束------------------------------------------->

						<%
							//根据问题的类型选择相应的HTML代码
								} else if (QuesType.intValue() == 25) {
									currentQuesNum++;//当页问题数加一
						%>

						<!------------------------- 滑动题 ------------------------------------------------------------>
						<div class="Question Q_type25" data-role="fieldcontain"
							id="<%=question.getQuesBasicInfoId()%>"
							ifquesrequired="<%=question.getQuesRequired()%>"
							 
							>

							<!----------------- 问题头部信息 ------------------------------------------------>
							<div class="QuestionHeader">

							<!--逻辑标签-->
							<logictagoo:logictag quesid="<%=question.getQuesBasicInfoId()%>" />

							<!--问题序号 -->
							<!-- 多选题问题标题 -->
							<div class="QuestionTitle">
								<%if(qAppear.getIfQnaireTitleSpecialEdit()==null||qAppear.getIfQnaireTitleSpecialEdit()==1){ %>
								<div class="QuestionIndex">
								<%=question.getQuesOrderNum()%>.
								</div>
							<%} %>
								<%=question.getQuesTitle()%>
							</div>

							<%
								//判断该题是否必答
								if (question.getQuesRequired().intValue()==0) {
							%>

							<!-- 是否必答提示符号 -->
							<span class="star">*</span>

							<%
								} //if 语句结束
							%>

							<!-- 未答提示，默认是隐藏的 -->
							<span class="ques_required_promote">(该题是必答题，请作答！)</span>
							
							<!-- 问题说明 -->
							<%if(question.getQuesPrompt()!=null){ %>
							<div class="Ques_prompt">
								<%=question.getQuesPrompt()%>
							</div>
							<%} %>

						</div>
						<!-- for QuestionHeader -->

							<!----------------- 问题头部信息 结束 ------------------------------------------------------->

							<!------------------ 问题内容 ------------------------------------------------------------>
							<div class="QuestionContent">

								<%
									//获取并遍历问题的选项
											ArrayList<OptionBasicinfo> options = service
													.getOptions(question.getQuesBasicInfoId());
											Iterator it1 = options.iterator();
											while (it1.hasNext()) {
												//取出每个选项
												OptionBasicinfo option = (OptionBasicinfo) it1.next();
												//获取选项id
												int optionId = option.getOptionBasicInfoId();
								%>

								<div class="sliderArea Option"
									ifFillBlank="<%=option.getIfFillBlank().intValue()%>">

									<!-- 复选按钮，id是通过选项id来生成的，name通过问题id生成，可以保证每个问题中input的name是一致的，但是各个问题之间name属性不一致-->


									<input type="range" name="<%=question.getQuesBasicInfoId()%>"
										id="<%=optionId%>" class="slider"
										max="<%=qattr.getSliderMaxValue()%>"
										min="<%=qattr.getSliderMinValue()%>" class="OptionButton"/>
									<div class="valueTitle">
										<div class="fl" style="float:left;margin-left:40px;">
											<label class="slide"><%=qattr.getMinValueTitle()%>(<%=qattr.getSliderMinValue()%>)</label>
										</div>
										<div class="fr">
											<label class="slide"><%=qattr.getMaxValueTitle()%>(<%=qattr.getSliderMaxValue()%>)</label>
										</div>
									</div>
									

								</div>
								<!-- for option -->

								<%
									} //option while 循环结束
								%>

							</div>
							<!-- for QuestionContent -->
							<!-------------------- 问题内容结束  ------------------------------------------------------------------>
						<!-- ------------------问题的结尾----------------------------------------- -->
						
						<div class="QuestionFooter">
						<%if(currentQuesNum<qnaireQuestionTotalNum) {%>
					
						
						<%
							percent = (currentQuesNum * 100)
									/ qnaireQuestionTotalNum;
						%>
						<progress class="progress" max="100" min="0"
									value="<%=percent%>"></progress>
						
						
						<%} %>
						<div class="submit nextQues">
						下一题
					</div>
						</div><!-- for QuestionFooter -->
						<!-- ------------------问题的结尾结束--------------------------------------- -->
						
						</div>
						<!-- 滑动题结束  -->
						<!------------------------- 滑动题 结束------------------------------------------->


						<%
							} //if 结束（题型判断）
						%>
						</div><!-- 题目页内容结束 -->
					
					<!--------------------------页脚，展示一些提示信息---------------------------------------------->
			
			<div data-role="footer" class="pageFooter" style="background-color:#4F4c4c;color:#FFF" data-position="fixed" data-fullscreen="true" data-tap-toggle="false">
				<h3>大数据调研平台 技术支持<a class="refresh" onclick="refresh()">重答</a></h3>
			</div>
			<!---------------------------页脚结束-------------------------------------------------------->
					
					</div><!-- for page -->
						<% }//判断不是分页题if结束
							} //while 结束 （问题遍历）
						%>
						<div class="page endPage" data-role="page" id="end" ifAnswered="1">
			<div data-role="header" class="qnaireHeader" style="background-color:#FFA81B;color:#FFF;">
				<div  id="icon">
					<%if(qnaire.getQnaireLogo()!=null){ %>
					<img src="<%=qnaire.getQnaireLogo()%>"/>
					<%} %>
				</div>
				<h1><%=qnaire.getQnaireTitle()%></h1>
				
			</div>
			
			<div class="pageContent" data-role="content">
				<p style="text-align:center">感谢您的填写，请提交答案</p>
			</div>
				
					<div data-role="footer" class="pageFooter" style="background-color:#4F4c4c;color:#FFF" data-position="fixed" data-fullscreen="true" data-tap-toggle="false">
					<h3>大数据调研平台 技术支持<a class="refresh" onclick="refresh()">重答</a></h3>
					</div>						
				</div>
				<!-- for endPage -->
				<!-------------------------结束页结束 ------------------------------------------------------>
						
			
					</div>
				<!-- for questions -->
				<!------------------- 问题展示 结束 -------------------->


				<!-------------------------结束页 ------------------------------------------------------>
				

			</div>
			<!-- for qnaireContent -->
			<!-------------------------页面体结束 ------------------------------------------------------>


			

		</div>
		<!-- for main-->
</body>
</html>
