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
        isShowDuration();
        stopBubble(e);
    });

    function isShowDuration() {
        var amVal = $("#amPeriod").val();
        var pmVal = $("#pmPeriod").val();
        if (amVal != "" && pmVal != "") {
            $(".pu-con-duration").show();
        }
    }

    // 点击新建
    $(".z-create-btn").click(function () {
        $(".marker,.pu-create").show();
    });

    var courseData = {};
    var classLen="";
    // 弹窗点击确定
    $(".pu-create .pu-btn .btn-confirm").click(function () {
        if ($('#classLen').val() == "" || Math.abs($('#classLen').val()) > 60) {
            alert('请选择课节时长或输入正确的时长');
            return false;
        }
        if ($('#breakLen').val() == "" || Math.abs($('#breakLen').val()) > 60) {
            alert('请选择课间时长或输入正确的时长');
            return false;
        }
        if (/^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/.test($("#amStart").val()) || $("#amStart").val() == "") {
            alert('请选择上午开始时间或输入正确的时间');
            return false;
        }
        if (/^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/.test($("#pmStart").val()) || $("#pmStart").val() == "") {
            alert('请选择下午开始时间或输入正确的时间');
            return false;
        }
        if ($("#evPeriod").val() != "") {
            if ($(".select-self-study ul li:last-child").hasClass("active")) {
                if (/^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/.test($("#nitStart").val()) || $("#nitStart").val() == "") {
                    alert('请选择晚自习开始时间或输入正确的时间');
                    return false;
                }
            }
        }

        if ($("#morPeriod").val() != "") {
            if ($(".select-self-study ul li:last-child").hasClass("active")) {
                if (/^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/.test($("#morStart").val()) || $("#morStart").val() == "") {
                    alert('请选择晨读开始时间或输入正确的时间');
                    return false;
                }
            }
        }

        courseData = {
            classLen: $('#classLen').val(),
            breakLen: $("#breakLen").val(),
            amStart: $('#amStart').val(),
            pmStart: $('#pmStart').val(),
            morStart: $("#morStart").val(),
            nitStart: $("#nitStart").val(),
            dayPeriod: $("#dayPeriod").val(),
            amPeriod: $("#amPeriod").val(),
            pmPeriod: $("#pmPeriod").val(),
            morPeriod: $("#morPeriod").val(),
            nitPeriod: $("#nitPeriod").val()
        };
        console.log(courseData);
        // 计算每节课的开始和结束时间
        var courseTime = [];
        var classLen = "00" + ":" + courseData.classLen; //课节时长
        classLen = countDown(classLen);
        var breakLen = "00" + ":" + courseData.breakLen;// 课间时长
        breakLen = countDown(breakLen);
        var courseCount = 0;

        // 晨读
        if (courseData.morPeriod != "") {
            var morDate = countDown(courseData.morStart); //开始时间
            for (var i = 0; i < courseData.morPeriod; i++) {
                courseCount++;
                var calDate1 = morDate + classLen;
                courseTime.push({
                    begin: timeChangeSelect(morDate),
                    end: timeChangeSelect(calDate1),
                    curriNum: courseCount,
                    classLen: classLen,
                    breakLen: breakLen
                });
                morDate = calDate1 + breakLen;
            }
        }
        // 上午
        var amDate = countDown(courseData.amStart); //开始时间
        for (var i = 0; i < courseData.amPeriod; i++) {
            courseCount++;
            var calDate1 = amDate + classLen;
            courseTime.push({
                begin: timeChangeSelect(amDate),
                end: timeChangeSelect(calDate1),
                curriNum: courseCount,
                classLen: classLen,
                breakLen: breakLen
            });
            amDate = calDate1 + breakLen;
        }

        // 下午
        var pmDate = countDown(courseData.pmStart); //开始时间
        for (var i = 0; i < courseData.pmPeriod; i++) {
            courseCount++;
            var calDate1 = pmDate + classLen;
            courseTime.push({
                begin: timeChangeSelect(pmDate),
                end: timeChangeSelect(calDate1),
                curriNum: courseCount,
                classLen: classLen,
                breakLen: breakLen
            });
            pmDate = calDate1 + breakLen;
        }
        // 晚自习
        if (courseData.nitPeriod != "") {
            var nitDate = countDown(courseData.nitStart); //开始时间
            for (var i = 0; i < courseData.nitPeriod; i++) {
                courseCount++;
                var calDate1 = nitDate + classLen;
                courseTime.push({
                    begin: timeChangeSelect(nitDate),
                    end: timeChangeSelect(calDate1),
                    curriNum: courseCount,
                    classLen: classLen,
                    breakLen: breakLen
                });
                nitDate = calDate1 + breakLen;
            }
        }

        console.log(courseTime);
        var dayLen = parseInt(courseData.dayPeriod) + 1;
        var theadStr = "", tbodyStr = "";
        var weekDay = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        var section = ['第一节', '第二节', '第三节', '第四节', '第五节', '第六节', '第七节', '第八节', '第九节', '第十节', '第十一节', '第十二节', '第十三节', '第十四节', '第十五节'];
        for (var j = 0; j < dayLen; j++) {
            theadStr += '<th>' + weekDay[j] + '</th>'
        }
        $(".z-table-wrap table thead tr").html(theadStr);
        courseTime.forEach(function (t, i) {
            tbodyStr += '<tr>';
            for (var j = 0; j < dayLen; j++) {
                if (j == 0) {
                    if (courseData.morPeriod != "" && i < parseInt(courseData.morPeriod)) {
                        tbodyStr += '<td>' +
                            '<div class="z-date-con"> ' +
                            '<h6>晨读' +(i+1)+ '</h6> ' +
                            '<div class="z-date " data-title="晨读' + (i+1) + '"> ' +
                            '<input type="text" class="z-date-input z-date1" value="' + t.begin + '"> <i>-</i> ' +
                            '<input type="text" class="z-date-input z-date2" value="' + t.end + '"> ' +
                            '</div> ' +
                            '</div>' +
                            '</td>'
                    } else {
                        var sectionIndex=i-courseData.morPeriod;
                        tbodyStr += '<td>' +
                            '<div class="z-date-con"> ' +
                            '<h6>' + section[sectionIndex] + '</h6> ' +
                            '<div class="z-date " data-title="' + section[sectionIndex] + '"> ' +
                            '<input type="text" class="z-date-input z-date1" value="' + t.begin + '"> <i>-</i> ' +
                            '<input type="text" class="z-date-input z-date2" value="' + t.end + '"> ' +
                            '</div> ' +
                            '</div>' +
                            '</td>'
                    }

                } else {
                    tbodyStr += '<td></td>'
                }

            }
            tbodyStr += '</tr>'
        });
        $(".z-table-wrap table tbody").html(tbodyStr);
        var lineIdx1=courseData.morPeriod-1;
        var lineIdx2=lineIdx1+parseInt(courseData.amPeriod);
        var lineIdx3=lineIdx2+parseInt(courseData.pmPeriod);
        $(".z-table-wrap table tbody tr").eq(lineIdx1).addClass('z-line');
        $(".z-table-wrap table tbody tr").eq(lineIdx2).addClass('z-line');
        $(".z-table-wrap table tbody tr").eq(lineIdx3).addClass('z-line');
        $(".marker,.pu-create").hide();
        $(".z-no-data").hide();
        $(".z-table").show();
    });

    //  编辑时间
    $(".z-table-wrap").on('click','tbody tr .z-date-con',function (e) {
        e.stopPropagation();
       $(this).addClass('clicked')
    });
    $(".z-table-wrap").on('click','tbody tr .z-date-input',function () {
        $(this).addClass('active').siblings().removeClass('active');
        var thisP=$(this).parent().parent();
       var isHasList=thisP.find('.select-dropdown').length;
       if(isHasList==0){
           thisP.append($("#editDate").html());
           thisP.find('.select-dropdown').mCustomScrollbar();
       }
    });

    $(".z-table-wrap").on('click','tbody tr .select-dropdown ul li',function (e) {
        e.stopPropagation();
        var classLen = "00" + ":" + courseData.classLen; //课节时长
        classLen = countDown(classLen);
        var breakLen = "00" + ":" + courseData.breakLen;// 课间时长
        breakLen = countDown(breakLen);
       var txt=$(this).text();
       var thisP=$(this).parents('.z-date-con');
       var isDate1=thisP.find('input.active').hasClass('z-date1');
        thisP.find('input.active').val(txt).removeClass('active');
        thisP.removeClass('clicked').addClass('active');
        var editCourse=$(this).parents('tr').index()+1;
        // 时间改变后面的跟着改变
        if(isDate1){
            var endTime=countDown(txt)+classLen;
            thisP.find(".z-date2").val(timeChangeSelect(endTime));
            var timeLevel0=parseInt(courseData.morPeriod)?parseInt(courseData.morPeriod):0;
            var timeLevel1=timeLevel0+parseInt(courseData.amPeriod);
            var timeLevel2=timeLevel1+parseInt(courseData.pmPeriod);
            var timeLevel3=timeLevel2+parseInt(courseData.nitPeriod);
            var startTime=endTime+breakLen;
            function editDate(editCourse,tiemLevel) {
                for(var c=editCourse;c<tiemLevel;c++){
                    var endTime=startTime+classLen;
                    var timeStr1=timeChangeSelect(startTime);
                    var timeStr2=timeChangeSelect(endTime);
                    $(".z-table-wrap tbody tr").eq(c).find(".z-date1").val(timeStr1);
                    $(".z-table-wrap tbody tr").eq(c).find(".z-date2").val(timeStr2);
                    startTime=endTime+breakLen;
                }
            }
            if(editCourse<timeLevel0){
                editDate(editCourse,timeLevel0);
            }else if(editCourse<timeLevel1){
                editDate(editCourse,timeLevel1);
            }else if(editCourse<timeLevel2){
                editDate(editCourse,timeLevel2);
            }else if(editCourse<timeLevel3){
                editDate(editCourse,timeLevel3);
            }
        }
    });

    /********************** 公用方法 *************************/

    // 点击其他地方弹窗消失
    $(document).on("click", function (event) {
        var _con = $('.select-input'); // 设置目标区域
        if (!_con.is(event.target) && _con.has(event.target).length === 0) { // Mark 1
            $(".select-input").removeClass("clicked");
            $(".z-date-con").removeClass("clicked");
            $(".z-date-input").removeClass('active');
        }
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

    //时分秒转为时间戳
    function countDown(time) {
        var s = 0;
        var hour = time.split(':')[0];
        var min = time.split(':')[1];
        s = Number(hour * 3600) + Number(min * 60);
        return s;
    }

    function timeChangeSelect(time) {
        var hours = parseInt((time / (60 * 60)));
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = parseInt((time % (60 * 60)) / 60);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        return hours + ":" + minutes
    }

    //滚动条
    $(".select-dropdown").mCustomScrollbar({
        axis: "y"
    });
})