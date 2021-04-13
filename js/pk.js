let daysAWeek = 5; //一周几天
let periodADay = 8; //一天几节
let morningReading = true; //标志是否存在晨读
let numToWeek = ['一', '二', '三', '四', '五', '六', '日'];
let numToDX = ['一', '二', '三', '四', '五', '六', '七','八','九','十','十一','十二','十三','十四','十五'];

//下拉选择
$(".select .btn").on("click",function(){
	$(this).parent().toggleClass("active");
})

$(".select").on("click","li",function(){
	let par = $(this).parents(".select");
	par.removeClass("active");
	par.find(".btn span").text($(this).text());
	$(this).addClass("active").siblings().removeClass("active");
})

/* 
	提示信息
	msg:显示的信息内容
	flag: 值为true时显示成功提示,值为false时显示失败提示
 */
function showTip(msg,flag){
	let tip = $(".tip");
	if(flag){
		$(".tip img").prop("src","../images/tip-suc.png")
	}else{
		$(".tip img").prop("src","../images/tip-err.png")
	}
	$(".tip span").text(msg)
	tip.show().animate({"top": "32px"},function(){
		let timer = setTimeout(function(){
			tip.animate({"top": "64px"},function(){
				tip.hide();
				clearTimeout(timer);
			})
		},2000)
	});
	
}

//模拟效果用的,实际开发删除此处代码
$(".assist-table td.has").hide();

//主课表,点击课程
$(".main-table tbody").on("click", "td", function() {
	if($(this).hasClass("select")){//取消选择
		$(this).removeClass("select");
		$(".assist-table td.select").removeClass("select");
		//置空右侧表格
		/* $(".assist-table td.has p").text("");
		$(".assist-table td.has").removeClass("has"); */
		//置空右侧表格模拟效果,实际开发用上边代码
		$(".assist-table td.has").hide();
		
	}else{
		if($(".main-table td.select").length){//交换课程
			//...
			
		}else{//选择
			let week = $(this).attr("week"),
				num = $(this).attr("num");
			$([this,$(".assist-table td[week="+ week +"][num="+ num +"]")[0]]).addClass("select");
			
			//右侧表格显示数据,实际开发应从接口获取数据渲染,此处模拟效果用的,实际开发删除此处代码
			$(".assist-table td.has").show();
			
			//暂存区显示添加按钮
			$(".temp .add-btn").show();
		}
	}
})


//主表,td鼠标滑过
function tdHover(){
	let tbody = $(".main-table tbody"),
		td = null;
		
	tbody.on("mouseenter","td.has",function() {
		let week = $(this).attr("week"),
			num = $(this).attr("num");
			
		td = $(".assist-table td[week="+ week +"][num="+ num +"]");
		td.addClass("hover");
	})
	tbody.on("mouseleave","td.has",function() {
		td.removeClass("hover");
	})
}

tdHover();

//暂存区添加
$(".temp .add-btn").on("click", function() {
	$(".temp .no-data").hide();
	$(".temp .list").show();
})
