/**
 * Created by jin on 23/07/15.
 */

$(".alert-success").hide();
$(".alert-danger").hide();

google.load("visualization", "1.1", {packages: ["corechart", "bar"]});
google.setOnLoadCallback(drawChart);

function drawChart() {
    var all_condition         = {};
    var user_id               = $('#user_id').text();
    all_condition['mov_name'] = $('#movie_name').text();
    all_condition['ageLevel'] = $('#age_level').text();
    all_condition['gender']   = $('#gender').text();
    all_condition['emoLevel'] = $('#emotion_range').text();
    all_condition['agrLevel'] = $('#agreeableness').text();
    all_condition['extLevel'] = $('#extraversion').text();
    all_condition['conLevel'] = $('#conscientiousness').text();
    all_condition['opeLevel'] = $('#openness').text();
    var all_categories        = '';

    //load gender picture
    function loadGenderPic(){
        if($('#gender').text()=="female"){
            $("img.gender-pic").attr('src',"images/women.png");
        }else if(($('#gender').text()=="male")){
            $("img.gender-pic").attr('src',"images/men.png");
        }
    }


    /*
     * ----------------------------------------Draw ad explain canvas--------------------------------------------------------
     * */

    $("#explain-canvas").attr('width', $('.ad-explanation').width());
    $("#explain-canvas").attr('height', 230);

    var canvas  = $("#explain-canvas")[0];
    var context = canvas.getContext("2d");

    function Rect(x1, y1, w, h, text) {
        this.x1   = x1;
        this.y1   = y1;
        this.w    = w;
        this.h    = h;
        this.text = text;
    }

    Rect.prototype.drawWithText = function (ctx) {

        ctx.strokeStyle = "#699BE6";
        ctx.fillStyle   = "#699BE6";
        ctx.lineWidth   = 1;
        ctx.font        = "13px Arial";

        ctx.beginPath();
        ctx.rect(this.x1, this.y1, this.w, this.h);
        ctx.stroke();
        ctx.fillText(this.text, this.x1 + 10, this.y1 + this.h / 1.5);
    }

    function Line(x1, y1, x2, y2, text) {
        this.x1   = x1;
        this.y1   = y1;
        this.x2   = x2;
        this.y2   = y2;
        this.text = text;
    }

    Line.prototype.drawWithArrowheads = function (ctx) {

        // arbitrary styling
        ctx.strokeStyle = "gray";
        ctx.fillStyle   = "black";
        ctx.lineWidth   = 1;
        ctx.font        = "12px Arial";

        // draw the line
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.fillText(this.text, this.x1 + 10, this.y1 + 15);


        // draw the ending arrowhead
        var endRadians = Math.atan((this.y2 - this.y1) / (this.x2 - this.x1));
        endRadians += ((this.x2 > this.x1) ? 90 : -90) * Math.PI / 180;
        this.drawArrowhead(ctx, this.x2, this.y2, endRadians);

    }
    Line.prototype.drawArrowhead      = function (ctx, x, y, radians) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(radians);
        ctx.moveTo(0, 0);
        ctx.lineTo(5, 20);
        ctx.lineTo(-5, 20);
        ctx.closePath();
        ctx.restore();
        ctx.fill();
    }

    function drawExplaination(x, y, w, h, movie, category, age, gender, brand, ad) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var rect = new Rect(x, y, w, h, "Ad Repository");
        rect.drawWithText(context);
        // create a new line object
        var line = new Line(x + w / 8, y + h, (x + w / 8) + 0.1, (y + 2 * h) + 5, movie+" (movie)");
        // draw the line
        line.drawWithArrowheads(context);
        var rect = new Rect(x, (y + 2 * h) + 5, w, h, category);
        rect.drawWithText(context);
        var line = new Line(x + w / 8, (y + 3 * h) + 5, (x + w / 8) + 0.1, (y + 4 * h) + 5, age + ', ' + gender);
        line.drawWithArrowheads(context);

        var rect = new Rect(x, (y + 4 * h) + 5, w, h, brand);
        rect.drawWithText(context);
        var line = new Line(x + w / 8, (y + 5 * h) + 5, (x + w / 8) + 0.1, (y + 6 * h) + 5, "Personality");
        line.drawWithArrowheads(context);
        var rect = new Rect(x, (y + 6 * h) + 5, w, h, ad);
        rect.drawWithText(context);
    }

    /**Draw bar chart for retrieved ads' category for this movie**/


    $.get('http://localhost:3000/api/ads/', {mov_name: all_condition["mov_name"]}, function (data) {
        for (var ad in data) {
            if (all_categories.indexOf(data[ad].ad_category) == -1) {
                all_categories += data[ad].ad_category + ",";
            }
        }
    });


    /**Update the ad explanation and user model chart**/

    drawAll(all_condition)

    function drawAll(condition) {

        console.log(condition)

        var all_Array = [];
        var all_data  = new google.visualization.DataTable();

        $.get('http://localhost:3000/api/ads/', condition, function (data) {
            console.log(data);
            var categoryArray = {};
            var adShow        = [];

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
            //$('#ads-num').text('found ' + data.length + ' ad(s) (' + parseInt(data.length * 100 / 43) + '%) in ads repository.');

            all_data.addColumn('string', 'Category');
            all_data.addColumn('number', 'Ad');

            all_data.addRows(
                all_Array
            );
            var options = {
                bar: {groupWidth: "80%"},
                width: $('.side-container').width() - 10,
                legend: 'none',
                hAxis: {
                    title: 'Amount of Ads',
                },
                vAxis: {
                    textPosition: 'in',
                    textStyle:{
                        fontSize:18
                    }
                }
            };

            var chart = new google.visualization.BarChart(document.getElementById('all_chart-2'));
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
                    adShow = data[adShowList[Math.floor(Math.random() * adShowList.length)]]
                    drawExplaination(10, 10, $('.ad-explanation').width() - 20, 30, $('#movie_name').text(), all_categories.substr(0,all_categories.length-1), $(".age-value").text(), $('#gender').text(), adShow.ad_brand+' ('+adShow.ad_category+')',adShow.ad_color+' '+adShow.ad_brand);
                    for (var allEle in all_Array) {
                        if (all_Array[allEle][0].indexOf(adShow.ad_category) > -1) {
                            chart.setSelection([{row: allEle, column: null}]);
                        };
                    };
                    $(".ad-show").attr("src", adShow.ad_url);
                    $(".ad-category").text(adShow.ad_category);
                    $(".ad-brand").text(adShow.ad_brand);
                    $(".ad-color").text(adShow.ad_color);
                }
            });

            if (data.length > 0) {
                adShow = data[Math.floor(Math.random() * data.length)];
                for (var allEle in all_Array) {
                    if (all_Array[allEle][0].indexOf(adShow.ad_category) > -1) {
                        chart.setSelection([{row: allEle, column: null}]);
                    }
                }
                if (adShow) {
                    $(".ad-show").attr("src", adShow.ad_url);
                    $(".ad-category").text(adShow.ad_category);
                    $(".ad-brand").text(adShow.ad_brand);
                    $(".ad-color").text(adShow.ad_color);
                    $(".general-ad").hide();
                    $(".personalized-ad").show();
                }
            } else {
                console.log("No ads are found for you!");
                $(".ad-category").text("Drink");
                $(".ad-show").attr("src", "images/coca-cola2.jpg");
                $(".personalized-ad").hide();
                $(".general-ad").show();
            }
            loadGenderPic();
            drawExplaination(10, 10, $('.ad-explanation').width() - 20, 30, $('#movie_name').text(), all_categories.substr(0,all_categories.length-1), $(".age-value").text(), $('#gender').text(), adShow.ad_brand+' ('+adShow.ad_category+')',adShow.ad_color+' '+adShow.ad_brand);
        });
    };

    /*
     ****************************************************************************ad listeners to UI widgets****************************************************************************
     */

    /*********************************************Gender widget*********************************************/
        //initialize the value
    $('input#' + $('#gender').text().toLowerCase()).prop('checked', true);
    $('input.gender-box').on('change', function () {
        if ($(this).is(':checked')) {
            if($(this).attr('value')){
                var gender              = $(this).attr('value');
                $(".gender-value").text(gender);
                $('#gender').text(gender);
                all_condition['gender'] = gender;
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
                        'gender': gender
                    }
                }
                $.ajax(settings).done(function (response) {
                    console.log(response);
                });
            }
        }
    });


    var personText = {};
    /*********************************************Age widget*********************************************/
        //initialize the value
    $('select option[value=' + $('#age_level').text() + ']').prop('selected', true);
    $("#age-selector").on('change', function () {
        $("select option:selected").each(function () {
            $(".age-value").text($(this).text());
            all_condition['ageLevel'] = $(this).attr('value');
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
                    'ageLevel': $(this).attr('value')
                }
            }
            $.ajax(settings).done(function (response) {
                console.log(response);
            });

        });
    });

    /*********************************************Personality widget*********************************************/

    setPersonCheck("opeLevel", "openness");
    setPersonCheck("agrLevel", "agreeableness");
    setPersonCheck("conLevel", "conscientiousness");
    setPersonCheck("extLevel", "extraversion");
    setPersonCheck("emoLevel", "emotion_range");

    function setPersonCheck(personSelect, person) {
        $('input[value=' + $('#' + person).text() + '].' + person + '-box').prop('checked', true);
        getPersonText(person);
        $('input.' + person + '-box').on('change', function () {
            if ($(this).is(':checked')) {
                var value                   = $(this).attr('value');
                $('#' + person).text(value);
                getPersonText(person);
                all_condition[personSelect] = value;
                drawAll(all_condition);
                /*
                 * update the gender data in db
                 * */
                var dataObj           = {};
                dataObj[personSelect] = value;
                var settings          = {
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

    function getPersonText(person) {
        var personSum = '';
        switch (person) {
            case 'emotion_range':
                switch ($('#' + person).text()) {
                    case '0':
                        personText.emo = 'very secure/confident,';
                        break;
                    case '1':
                        personText.emo = 'secure/confident,';
                        break;
                    case '2':
                        personText.emo = '';
                        break;
                    case '3':
                        personText.emo = 'sensitive/nervous,';
                        break;
                    case '4':
                        personText.emo = 'very sensitive/nervous,';
                        break;
                }
                ;
                break;
            case 'agreeableness':
                switch ($('#' + person).text()) {
                    case '0':
                        personText.agr = 'very analytical/detached,';
                        break;
                    case '1':
                        personText.agr = 'analytical/detached,';
                        break;
                    case '2':
                        personText.agr = '';
                        break;
                    case '3':
                        personText.agr = 'friendly/compassionate,';
                        break;
                    case '4':
                        personText.agr = 'very friendly/compassionate,';
                        break;
                }
                ;
                break;
            case 'conscientiousness':
                switch ($('#' + person).text()) {
                    case '0':
                        personText.con = 'very easy-going/careless,';
                        break;
                    case '1':
                        personText.con = 'easy-going/careless,';
                        break;
                    case '2':
                        personText.con = '';
                        break;
                    case '3':
                        personText.con = 'efficient/organized,';
                        break;
                    case '4':
                        personText.con = 'very efficient/organized,';
                        break;
                }
                ;
                break;
            case 'extraversion':
                switch ($('#' + person).text()) {
                    case '0':
                        personText.ext = 'very solitary/reserved,';
                        break;
                    case '1':
                        personText.ext = 'solitary/reserved,';
                        break;
                    case '2':
                        personText.ext = '';
                        break;
                    case '3':
                        personText.ext = 'outgoing/energetic,';
                        break;
                    case '4':
                        personText.ext = 'very outgoing/energetic,';
                        break;
                }
                ;
                break;
            case 'openness':
                switch ($('#' + person).text()) {
                    case '0':
                        personText.ope = 'very consistent/cautious,';
                        break;
                    case '1':
                        personText.ope = 'consistent/cautious,';
                        break;
                    case '2':
                        personText.ope = '';
                        break;
                    case '3':
                        personText.ope = 'inventive/curious,';
                        break;
                    case '4':
                        personText.ope = 'very inventive/curious,';
                        break;
                }
                ;
                break;
        }

        if (personText.emo)
            personSum += personText.emo;
        if (personText.agr)
            personSum += personText.agr;
        if (personText.ext)
            personSum += personText.ext;
        if (personText.con)
            personSum += personText.con;
        if (personText.ope)
            personSum += personText.ope;
        if (!personSum)
            personSum = "neutral in all personality traits."
        $(".person-value").text(personSum);
    }
}

$('#expandbtn').click(function () {
    if ($('.side-container').is(':hidden')) {
        $('div.col-md-10').attr('class', 'col-md-7');
        $('.side-container').show(500, function () {
        });

    } else {
        $('.side-container').hide(500, function () {
            $('div.col-md-7').attr('class', 'col-md-10');
        });
    }
});

$('.row .btn-default').on('click', function (e) {
    e.preventDefault();
    var $this     = $(this);
    var $collapse = $this.closest('.collapse-group').find('.collapse');
    $collapse.collapse('toggle');
});

$('button#dislike').on("click", function () {
    $("a#expandbtn").effect("shake");
    //$(".alert-success").hide();
    $(".alert-danger").show();
    $(".alert-danger").fadeOut(8000, function () {
        // Animation complete.
        $(this).hide();
    });


});

$('button#like').on("click", function () {
    var tasteLog = $(this).text() + ' the ad shown in ' + $('#movie_name').text();
    var taste    = $(".ad-category").text();
    sendTaste(tasteLog, taste);
    //$(".alert-danger").hide();
    $(".alert-success").show();
    $(".alert-success").fadeOut(5000, function () {
        // Animation complete.
        $(this).hide();
    });
});

function sendTaste(tasteLog, taste) {
    console.log(tasteLog + " " + taste);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:3000/api/user?id=" + $('#user_id').text(),
        "method": "PUT",
        "headers": {},
        "data": {
            tasteLog: tasteLog,
            taste: taste
        }
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}
