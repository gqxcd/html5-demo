<%@ page contentType="text/html;charset=utf-8" language="java" import="java.util.*" pageEncoding="utf-8"%>

<!doctype html>
<html>
<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">


<!--引入jQuery 和 jQuery mobile 相关的文件，注意文件顺序-->
<link rel=stylesheet href=css/jquery.mobile-1.4.5.css>
<script src=js/jquery-1.8.3.min.js></script>
<script src=js/jquery.mobile-1.4.5.js></script>

<title>123</title>

</head>

<body>
    

  <div data-role="page" id="page<%=i%>">
            
    <!------------------------ 页头，展示问卷的一些基本信息，比如问卷标题等 --------------------------------->
    <div data-role="header" id="pageHeader<%=i%>" data-position="fixed" style="background-color:#8FBC8F;height:60px;line-height:60px;">
   
        <div style="text-align:center;font-size:26px;color:white;">移动端答题测试！！</div>
  
    </div><!-- for div.header -->
    <!------------------------页头，结束-------------------------------------------------------->


     <!------------------------页面体，展示问卷的内容 --------------------------------->
    <div data-role="content" id="pageContent<%=i%>"> 
        
        <!-- 问题的所有内容 -->
        <div class="Question">
        
            <!-- 问题头部信息 -->
            <div class="QuestionHeader">
                
                <h1>单选题<%=i%></h1>
            </div>
        
            <!-- 问题的选项 -->
            <div class="QuestionContent">
        
                <!-- 选项标题 -->
                <label for="option<%=i%>" class="OptionTitle">选项1</label>
                
                <!-- 选项按钮 -->
                <input type="radio"  name="<%=i%>"  id="option<%=i%>"/> 
        
            </div>
        
        </div><!-- for div.Question -->
        
        <!-- 下一题按钮 -->
        <a href="#page<%=i+1%>" data-role="button" data-transition="slide">Go<%=i+1%></a>

    </div><!-- for div.content -->

    
    <div data-role="footer" id="pageFooter<%=i%>" data-position="fixed">

        <h1>大数据调研平台提供技术支持</h1>
        
    </div>
    

  </div><!-- for div.page -->

  
</body>
</html>
