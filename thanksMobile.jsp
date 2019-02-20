<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!doctype html>

<html>

<head>

<meta charset="utf-8">

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

<!--引入jQuery 和 jQuery mobile 相关的文件，注意文件顺序-->
<link rel=stylesheet href=css/jquery.mobile-1.4.5.css>

<script src=js/jquery-1.8.3.min.js></script>
<script src=js/jquery.mobile-1.4.5.js></script>

<title>感谢信息</title>

</head>

<body>

<div data-role="page">


  <div data-role="header">

    <h1>感谢信息</h1>

  </div>

  <div data-role="content">
    <center><p style="font-size:20px;"><%=request.getParameter("thanksInfo") %></p></center>
  </div>

  <div data-role="footer" data-position="fixed">
    <h1>大数据调研平台 技术支持 </h1>
  </div>

</div>


</body>
</html>