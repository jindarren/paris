/**
 * Created by jin on 23/07/15.
 */

google.load("visualization", "1.1", {packages: ["corechart","bar"]});
google.setOnLoadCallback(drawChart);

function drawChart() {
    var all_condition            = {};
    var user_id  = $('#user_id').text();
    all_condition['mov_type']    = $('#movie_genre').text().replace(/,/g, '|');
    all_condition['age']         = parseInt($('#age').text());
    all_condition['gender']      = $('#gender').text() + '|Unisex';
    all_condition['lang']        = $('#lang').text().replace(/,/g, '|');
    all_condition['personality'] =
        $('#emotion_range').text() + ','
        + $('#agreeableness').text() + ','
        + $('#extraversion').text() + ','
        + $('#conscientiousness').text() + ','
        + $('#openness').text();

    /*
     * ----------------------------------------Different charts drawing (Ad Category)----------------------------------------
     * */

    //draw pie chart for retrieved ads' category
    drawAll(all_condition);
    function drawAll(condition) {

        console.log(condition)

        var all_data  = new google.visualization.DataTable();
        var all_Array = [];
        $.get('http://localhost:3000/api/ads/', condition, function (data) {
            var categoryArray = {};
            if(data.length>0){
                for (var ad in data) {
                    if (categoryArray.hasOwnProperty(data[ad].ad_category)) {
                        categoryArray[data[ad].ad_category] += 1
                    }
                    else {
                        categoryArray[data[ad].ad_category] = 1
                    }
                }

                for (var property in categoryArray) {
                    if (categoryArray.hasOwnProperty(property)) {
                        all_Array.push([property, categoryArray[property]])
                    }
                }
                console.log(all_Array)
                $('#ads-num').text('found ' + data.length+ ' ad(s) ('+parseInt(data.length*100/43)+ '%) in ads repository.');

                all_data.addColumn('string', 'Category');
                all_data.addColumn('number', 'Ad');

                all_data.addRows(
                    all_Array
                );
                var options = {
                    title: 'Category Based Chart',
                    bar: {groupWidth: "80%"},
                    width:$('.user-model').width()-4,
                    legend:'none',
                    hAxis: {
                        title: 'Amount of Ads',
                    },
                    vAxis: {
                        textPosition: 'in'
                    }
                };

                var chart  = new google.visualization.BarChart(document.getElementById('all_chart-2'));
                chart.draw(all_data, options);

                google.visualization.events.addListener(chart, 'select', function () {
                    if (chart.getSelection()[0]) {
                        console.log(chart.getSelection())
                        var selected_category = all_Array[chart.getSelection()[0].row][0];
                        console.log(selected_category)
                        var adShowList        = [];

                        for (var ad in data) {
                            if (data[ad]['ad_category'].indexOf(selected_category) > -1)
                                adShowList.push(ad)
                        }
                        console.log(data)
                        var adShow = data[adShowList[Math.floor(Math.random() * adShowList.length)]]
                        $(".ad-show").attr("src", adShow.ad_url);
                        genRandomPer(80,"movie-percent");
                        genRandomPer(85,"age-percent");
                        genRandomPer(70,"gender-percent");
                        genRandomPer(90,"lang-percent");
                        genRandomPer(73,"person-percent");
                    }
                });
                console.log(data)
                var adShow = data[Math.floor(Math.random() * data.length)]
                for (var allEle in all_Array) {
                    if (all_Array[allEle][0].indexOf(adShow.ad_category) > -1) {
                        chart.setSelection([{row: allEle, column: null}]);
                    }
                }
                if(adShow){
                    $(".ad-show").attr("src", adShow.ad_url);
                    genRandomPer(80,"movie-percent");
                    genRandomPer(85,"age-percent");
                    genRandomPer(70,"gender-percent");
                    genRandomPer(90,"lang-percent");
                    genRandomPer(73,"person-percent");
                    $(".ad-explanation").show();
                }
            }
        });
    }

    /*
     ****************************************************************************ad listeners to UI widgets****************************************************************************
     */

        /*********************************************Gender widget*********************************************/

        $('input#'+$('#gender').text().toLowerCase()).prop('checked', true);
        $('input.gender-box').on('change', function() {
            $('input.gender-box').not(this).prop('checked', false);
            if($(this).is(':checked')){
                var rawGender = $("label[for="+$(this).attr('id')+"]").text();
                var gender = rawGender.substr(1,rawGender.length-3)
                $('#gender').text(gender);
                $('span#gender-value').each(function(){$(this).text(gender)});
                all_condition['gender']      = gender + '|Unisex';
                drawAll(all_condition);
                /*
                 * update the gender data in db
                 * */
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "http://localhost:3000/api/user?id=" + user_id,
                    "method": "PUT",
                    "headers": {},
                    "data": {
                        'gender':gender
                    }
                }
                $.ajax(settings).done(function (response) {
                    console.log(response);
                });
            }else if(!$(this).is(':checked')){
                all_condition['gender']      = '';
                drawAll(all_condition);
            }
        });

        /*********************************************Language widget*********************************************/

        for(var langItem in $('#lang').text().toLowerCase().split(',')){
            $('input#'+$('#lang').text().toLowerCase().split(',')[langItem]).prop('checked', true);
        }
        var allLang =$('#lang').text();
        $('input.lang-box').on('change', function() {
            if($(this).is(':checked')){
                var rawLang = $("label[for="+$(this).attr('id')+"]").text();
                var lang = rawLang.substr(1,rawLang.length-3)
                console.log('add'+lang)
                if (allLang)
                    allLang += ','+lang;
                else
                    allLang += lang;
                $('#lang').text(allLang);
                $('span#lang-value').each(function(){$(this).text(allLang)});
                all_condition['lang']        = allLang.replace(/,/g, '|');
                drawAll(all_condition);

                /*
                 * update the language data in db
                 * */
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "http://localhost:3000/api/user?id=" + user_id,
                    "method": "PUT",
                    "headers": {},
                    "data": {
                        'languages':allLang
                    }
                }
                $.ajax(settings).done(function (response) {
                    console.log(response);
                });

            }else if(!$(this).is(':checked')){
                var rawDelLang = $("label[for="+$(this).attr('id')+"]").text();
                var delLang = rawDelLang.substr(1,rawDelLang.length-3)
                console.log('delete'+delLang)
                if(allLang.indexOf(','+delLang)>-1)
                    allLang = allLang.replace(','+delLang,'');
                else{
                    if(allLang.indexOf(delLang+',')>-1)
                        allLang = allLang.replace(delLang+',','');
                    else
                        allLang = allLang.replace(delLang,'');
                }

                $('#lang').text(allLang);
                $('span#lang-value').each(function(){$(this).text(allLang)});
                all_condition['lang']        = allLang.replace(/,/g, '|');
                drawAll(all_condition);

                /*
                 * update the language data in db
                 * */
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "http://localhost:3000/api/user?id=" + user_id,
                    "method": "PUT",
                    "headers": {},
                    "data": {
                        'languages':allLang
                    }
                }
                $.ajax(settings).done(function (response) {
                    console.log(response);
                });

                console.log(allLang);
            }
        });
    $.get('http://localhost:3000/api/ads/', {mov_type: all_condition["mov_type"]}, function (data){
        /*********************************************Age widget*********************************************/
        var slider_width = $(".user-model").width()-4;

        var minAge = 12;
        var maxAge = 66;
        var ageArray =[];
        for (var age = minAge; age <= maxAge; age += 3) {
            getAdNumByAge(age);
        }

        function getAdNumByAge(age) {
            var ageNum = 0;
            for (var dataItem in data) {
                if (data[dataItem].ad_target_user.age_range.max_age >= age + 5
                    && data[dataItem].ad_target_user.age_range.min_age <= age) {
                    ageNum++;
                }
            }
            ageArray.push([age, ageNum])
        }

        //draw color canvas for age and ads
        var age_canvas = $("#age-canvas")[0];
        var ctx = age_canvas.getContext("2d");
        for(var i=0;i<ageArray.length;i++) {
            var color = 200-parseInt((ageArray[i][1]/data.length)*200);
            console.log("color: "+color);
            ctx.fillStyle = "rgb(" + color + "," + color + ","+ color +")";
            ctx.fillRect(parseInt(slider_width*i/ageArray.length), 0, parseInt(slider_width*(i+1)/ageArray.length), 20);
            console.log("xAxis: "+parseInt(slider_width*(i+1)/ageArray.length))
        }
        $('#age-slider').css({'background-image':"url(" + age_canvas.toDataURL("image/png")+ ")"});


        $("#age-slider").slider({
            value: $('#age').text(),
            min: minAge,
            max: maxAge,
            step: 3,
            slide: function (event, ui) {
                $("#age").text(ui.value);
                $('span#age-value').each(function(){$(this).text(ui.value)});

                all_condition['age']=$('#age').text();
                drawAll(all_condition);
                /*
                 * update the age data in db
                 * */
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "http://localhost:3000/api/user?id=" + user_id,
                    "method": "PUT",
                    "headers": {},
                    "data": {
                        'age': ui.value
                    }

                }
                $.ajax(settings).done(function (response) {
                    console.log(response);
                });
            }
        });

        $('input#age-check').on('change', function() {
            if ($(this).is(':checked')) {
                all_condition['age']=$('#age').text();
                drawAll(all_condition);
                $("#age-slider").slider("enable");
            } else{
                $("#age-slider").slider("disable");
                all_condition['age']='';
                drawAll(all_condition);
            }
        });


        /*********************************************Personality widget*********************************************/


        var per_Ope_Array = [];
        var per_Con_Array = [];
        var per_Ext_Array = [];
        var per_Agr_Array = [];
        var per_Emo_Array = [];

        //create personality data
        for (var per = 0; per < 101; per++) {
            getAdNumByPerson('openness', per, per_Ope_Array)
            getAdNumByPerson('conscientiousness', per, per_Con_Array)
            getAdNumByPerson('extraversion', per, per_Ext_Array)
            getAdNumByPerson('agreeableness', per, per_Agr_Array)
            getAdNumByPerson('emotion_range', per, per_Emo_Array)
        }

        //draw chart for age and ads
        function getAdNumByPerson(per_str, per, perArray) {
            var personNum = 0;
            for (var dataItem in data) {
                var per_min_val = parseFloat(data[dataItem].ad_target_user.personality[per_str].min_val).toFixed(2);
                var per_max_val = parseFloat(data[dataItem].ad_target_user.personality[per_str].max_val).toFixed(2);
                var per_val     = (per / 100).toFixed(2);
                if (per_val >= per_min_val && per_val <= per_max_val) {
                    personNum++;
                }
            }
            perArray.push([per, personNum]);
            drawSliderBackground(per_str,perArray);
        }

        function drawSliderBackground(personality,perArray){
            var canvas = $("#"+personality+"-canvas")[0];
            var ctx = canvas.getContext("2d");
            for(var i=0;i<perArray.length;i++) {
                var color = 200-parseInt((perArray[i][1]/data.length)*200);
                console.log("color: "+color);
                ctx.fillStyle = "rgb(" + color + "," + color + ","+ color +")";
                ctx.fillRect(parseInt(slider_width*i/perArray.length), 0, parseInt(slider_width*(i+1)/perArray.length), 20);
                console.log("xAxis: "+parseInt(slider_width*(i+1)/perArray.length))
            }
            $("#"+personality+"-slider").css({'background-image':"url(" + canvas.toDataURL("image/png")+ ")"});
        }


        setPersonSlider("openness-slider","openness");
        setPersonSlider("agreeableness-slider","agreeableness");
        setPersonSlider("conscientiousness-slider","conscientiousness");
        setPersonSlider("extraversion-slider","extraversion");
        setPersonSlider("emotion_range-slider","emotion_range");

        function setPersonSlider(slider,person){
            $('#'+slider).slider({
                value: $('#'+person).text(),
                min: 0.00,
                max: 1.00,
                step: 0.01,
                slide: function(event, ui) {
                    $("#"+person).text(ui.value);
                    all_condition['personality'] =
                        $('#emotion_range').text() + ','
                        + $('#agreeableness').text() + ','
                        + $('#extraversion').text() + ','
                        + $('#conscientiousness').text() + ','
                        + $('#openness').text();
                    drawAll(all_condition);
                    /*
                     * update the personality data in db
                     * */
                    var dataObj                    = {};
                    dataObj[person] = ui.value;
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "http://localhost:3000/api/user?id=" + user_id,
                        "method": "PUT",
                        "headers": {},
                        "data": dataObj

                    }
                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });
                }
            });
        }

    });

    $('input#person-check').on('change', function() {
        if ($(this).is(':checked')) {
            all_condition['personality'] =
                $('#emotion_range').text() + ','
                + $('#agreeableness').text() + ','
                + $('#extraversion').text() + ','
                + $('#conscientiousness').text() + ','
                + $('#openness').text();
            drawAll(all_condition);
            $(".per-slider").slider("enable");
        } else{
            $(".per-slider").slider("disable");
            all_condition['personality']=''
            drawAll(all_condition);
        }
    });
}

$('#expandbtn').click(function(){
    if($('.side-container').is(':hidden')){
        $('div.col-md-10').attr('class','col-md-8');
        $('.side-container').show(500,function(){
        });

    }else{
        $('.side-container').hide(500,function(){
            $('div.col-md-8').attr('class','col-md-10');
        });
    }
});

$('.row .btn-default').on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    var $collapse = $this.closest('.collapse-group').find('.collapse');
    $collapse.collapse('toggle');
});

//$(document).mousemove(function (e) {
//    $("#user-bio").dialog("option", { position: [e.pageX+10, e.pageY+10] });
//});
//
//$("#user-bio").dialog({
//    autoOpen: false,
//    show: "blind",
//    hide: "blind"
//});
//$("#name").bind("mouseover", function () {
//    $("#user-bio").dialog('open'); // open
//});
//$("#name").bind("mouseleave", function () {
//    $("#user-bio").dialog('close'); // open
//});

genRandomPer(80,"movie-percent");
genRandomPer(85,"age-percent");
genRandomPer(70,"gender-percent");
genRandomPer(90,"lang-percent");
genRandomPer(73,"person-percent");

function genRandomPer(lowestNum,textBlock){
    var percentage = parseInt(Math.random()*(100-lowestNum)+lowestNum);
    $("#"+textBlock).text(percentage+'%');
}




