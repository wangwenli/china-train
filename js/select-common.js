$(document).ready(function () {
    //下拉点击
    $(".select-input .name").click(function (e) {
        $(".select-input").removeClass("clicked");
        $(this).parent().addClass("clicked");
        stopBubble(e);
    });

    $(".select-dropdown").on("click", ".dropdown-list li", function (e) {
        $(this).addClass("cur").siblings().removeClass("cur");
        $(this).parents(".select-input");
        $(this).parents(".select-input").removeClass("clicked").addClass('active');
        let kol = $(this).text();
        $(this).parents(".select-input").find(".name").val(kol);
        stopBubble(e);
    });


    $(document).on("click", function (event) {
        var _con = $('.select-input'); // 设置目标区域
        if (!_con.is(event.target) && _con.has(event.target).length === 0) { // Mark 1
            $(".select-input").removeClass("clicked");
        }
        $(".teab-list .more .drop-down").hide();
    });

    function stopBubble(e) {
        //如果提供了事件对象，则这是一个非IE浏览器
        if (e && e.stopPropagation)
        //因此它支持W3C的stopPropagation()方法
            e.stopPropagation();
        else
        //否则，我们需要使用IE的方式来取消事件冒泡
            window.event.cancelBubble = true;
    }
    //滚动条
    $(".select-dropdown").mCustomScrollbar({
        axis: "y"
    });
})