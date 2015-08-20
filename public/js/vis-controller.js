/**
 * Created by jin on 22/07/15.
 */

google.load("visualization", "1.1", {packages: ["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart() {

    var all_condition            = {};
    var user_id                    = $('#user_id').text();

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

    switcher('#age_check', 'age', 'div#age_overlay');
    switcher('#gender_check', 'gender', '#gender_overlay');
    switcher('#lang_check', 'lang', '#lang_overlay');
    switcher('#person_check', 'personality', '#openness_overlay, #agreeableness_overlay, ' +
        '#conscientiousness_overlay, #extraversion_overlay, #emotion_range_overlay');

    function switcher(toggle, condition_prop, overlay) {
        var old_condition_prop = '';
        $(toggle).change(function () {
            if ($(this).prop('checked')) {
                $(overlay).find('.overlay').remove();
                all_condition[condition_prop] = old_condition_prop;
                drawAll(all_condition);
            } else {
                $(overlay).append('<div class="overlay"></div>');
                old_condition_prop            = all_condition[condition_prop];
                all_condition[condition_prop] = '';
                drawAll(all_condition);
            }
        })
    }

    $.get('http://localhost:3000/api/ads/', {mov_type: all_condition["mov_type"]}, function (data) {
        /*
         * ----------------------------------------Different charts drawing (Age)----------------------------------------
         * */
        var age_data = new google.visualization.DataTable();
        var ageArray = [];

        age_data.addColumn('number', 'Age');
        age_data.addColumn('number', 'Ad');

        //create age data
        for (var age = 12; age <= 66; age += 3) {
            getAdNumByAge(age);
        }

        drawAge(age_data, ageArray);

        //draw chart for age and ads
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

        function drawAge(age_data, ageArray) {
            console.log(String(ageArray))
            age_data.addRows(
                ageArray
            );
            var options = {
                legend: 'none',
                title: 'Age Based Chart',
                hAxis: {title: 'Age',minValue: 12, maxValue: 66},
                vAxis: {title: 'Number of Ads'},
                //curveType: 'function',
                pointSize: 5,
                crosshair: {trigger: 'both', orientation: 'vertical'},
            };

            var chart = new google.visualization.AreaChart(document.getElementById('age_chart'));
            chart.draw(age_data, options);

            var selectedAge = parseInt($('#age').text());
            for (var ageEle in ageArray) {
                if (ageArray[ageEle][0] == selectedAge)
                    chart.setSelection([{row: ageEle, column: null}]);
            }

            // Add select listener for age chart
            google.visualization.events.addListener(chart, 'select', function () {
                if (chart.getSelection()[0]) {
                    console.log(chart.getSelection())
                    var selected_age     = ageArray[chart.getSelection()[0].row][0];
                    console.log(selected_age)
                    $('#age').text(selected_age)
                    all_condition['age']         = parseInt(selected_age);
                    drawAll(all_condition);

                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "http://localhost:3000/api/user?id=" + user_id,
                        "method": "PUT",
                        "headers": {},
                        "data": {
                            "age": selected_age
                        }
                    }

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });

                }
            });
        }

        /*
         * ----------------------------------------Different charts drawing (Gender)----------------------------------------
         * */

        //create gender data
        var gender_data = new google.visualization.DataTable();
        var genderArray = [];

        gender_data.addColumn('string', 'Gender');
        gender_data.addColumn('number', 'Ad');
        gender_data.addColumn({type: 'string', role: 'style'});

        getAdNumByGender('Male', '#1977E3');
        getAdNumByGender('Female', '#EB54B4');
        getAdNumByGender('Unisex', '#8378EB');

        drawGender(gender_data, genderArray);

        function getAdNumByGender(genderString, color) {
            var genderNum = 0;
            for (var dataItem in data) {
                console.log("result++++++++++++++++" + data[dataItem].ad_target_user.gender.match('/\b' + genderString + '/'));
                if (data[dataItem].ad_target_user.gender.match(new RegExp('\\b' + genderString + '|Unisex'))) {
                    genderNum++;
                }
            }
            genderArray.push([genderString, genderNum, color])
            console.log(String(genderArray))
        }

        function drawGender(gender_data, genderArray) {
            console.log(String(genderArray))
            gender_data.addRows(
                genderArray
            );

            var options = {
                title: "Gender Based Chart",
                bar: {groupWidth: "80%"},
                legend: {position: "none"},
                vAxis: {title: 'Number of Ads'}
            };
            var chart   = new google.visualization.ColumnChart(document.getElementById("gender_chart"));
            chart.draw(gender_data, options);

            var selectedGender = $('#gender').text();

            for (var genderEle in genderArray) {
                if (genderArray[genderEle][0].indexOf(selectedGender) > -1) {
                    chart.setSelection([{row: genderEle, column: null}]);
                }
            }

            // Add select listener for gender chart
            google.visualization.events.addListener(chart, 'select', function () {
                if (chart.getSelection()[0]) {
                    console.log(chart.getSelection())
                    var selected_gender     = genderArray[chart.getSelection()[0].row][0];
                    console.log(selected_gender);
                    $('#gender').text(selected_gender);
                    all_condition['gender']      = selected_gender + '|Unisex';
                    drawAll(all_condition);

                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "http://localhost:3000/api/user?id=" + user_id,
                        "method": "PUT",
                        "headers": {},
                        "data": {
                            "gender": selected_gender
                        }
                    }

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });

                }

            });
        }

        /*
         * ----------------------------------------Different charts drawing (Language)----------------------------------------
         * */

        //create language data
        var lang_data = new google.visualization.DataTable();
        var langArray = [];

        lang_data.addColumn('string', 'Language');
        lang_data.addColumn('number', 'Ad');
        //lang_data.addColumn({type: 'string', role: 'style'});


        getAdNumByLang('Dutch');
        getAdNumByLang('French');
        getAdNumByLang('German');
        getAdNumByLang('English');
        getAdNumByLang('Mandarin Chinese');

        drawLang(lang_data, langArray);

        function getAdNumByLang(lang) {
            var langNum = 0;
            for (var dataItem in data) {
                if (data[dataItem].ad_target_user.language.match(new RegExp('\\b' + lang))) {
                    langNum++;
                }
            }
            langArray.push([lang, langNum])
        }

        function drawLang(lang_data, langArray) {
            lang_data.addRows(
                langArray
            );

            var options = {
                title: "Language Based Chart",
                //width: 600,
                //height: 400,
                bar: {groupWidth: "95%"},
                legend: {position: "none"},
                vAxis: {title: 'Number of Ads'}
            };
            var chart   = new google.visualization.ColumnChart(document.getElementById("lang_chart"));
            chart.draw(lang_data, options);

            var selectedLang = $('#lang').text().split(',');
            var setArray     = [];
            for (lang in selectedLang) {
                for (var langEle in langArray) {
                    if (langArray[langEle][0].indexOf(selectedLang[lang]) > -1)
                        setArray.push({row: langEle, column: null});
                }
            }
            chart.setSelection(setArray);

            // Add select listener for language chart
            google.visualization.events.addListener(chart, 'select', function () {
                if (chart.getSelection()[0]) {
                    console.log(chart.getSelection())
                    var selected_lang     = langArray[chart.getSelection()[0].row][0];
                    console.log(selected_lang)
                    $('#lang').text(selected_lang)
                    all_condition['lang']        = selected_lang.replace(/,/g, '|');
                    drawAll(all_condition);

                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "http://localhost:3000/api/user?id=" + user_id,
                        "method": "PUT",
                        "headers": {},
                        "data": {
                            "languages": selected_lang
                        }
                    }

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });

                }

            });
        }

        /*
         * ----------------------------------------Different charts drawing (Personality)----------------------------------------
         * */

        var per_Ope_Array = [];
        var per_Con_Array = [];
        var per_Ext_Array = [];
        var per_Agr_Array = [];
        var per_Emo_Array = [];

        //create personality data
        for (var per = 0; per < 101; per++) {
            getAdNumByPerson('Openness', per, per_Ope_Array)
            getAdNumByPerson('Conscientiousness', per, per_Con_Array)
            getAdNumByPerson('Extraversion', per, per_Ext_Array)
            getAdNumByPerson('Agreeableness', per, per_Agr_Array)
            getAdNumByPerson('Emotion_range', per, per_Emo_Array)
        }

        drawPerson('Openness', per_Ope_Array)
        drawPerson('Conscientiousness', per_Con_Array)
        drawPerson('Extraversion', per_Ext_Array)
        drawPerson('Agreeableness', per_Agr_Array)
        drawPerson('Emotion_range', per_Emo_Array)

        //draw chart for age and ads
        function getAdNumByPerson(per_str, per, perArray) {
            var personNum = 0;
            for (var dataItem in data) {
                var per_min_val = parseFloat(data[dataItem].ad_target_user.personality[per_str.toLowerCase()].min_val).toFixed(2);
                var per_max_val = parseFloat(data[dataItem].ad_target_user.personality[per_str.toLowerCase()].max_val).toFixed(2);
                var per_val     = (per / 100).toFixed(2);
                if (per_val >= per_min_val && per_val <= per_max_val) {
                    personNum++;
                }
            }
            perArray.push([per, personNum])
        }

        function drawPerson(per_str, perArray) {
            var per_data = new google.visualization.DataTable();
            console.log(String(perArray))
            per_data.addColumn('number', 'Personality');
            per_data.addColumn('number', 'Ad');

            per_data.addRows(
                perArray
            );
            console.log(perArray)
            var options  = {
                legend: 'none',
                title: per_str + ' Based Chart',
                hAxis: {minValue: 0, maxValue: 100},
                curveType: 'function',
                pointSize: 5,
                crosshair: {trigger: 'both', orientation: 'vertical'},
                hAxis: {title: per_str +' Score',minValue: 0, maxValue: 100},
                vAxis: {title: 'Number of Ads'}
            };

            var chart = new google.visualization.AreaChart(document.getElementById(per_str.toLowerCase() + '_chart'));
            console.log(per_data)
            chart.draw(per_data, options);

            var selectedPer = parseFloat($('#' + per_str.toLowerCase()).text());
            for (var perEle in perArray) {
                if (perArray[perEle][0] == parseInt(selectedPer * 100)) {
                    chart.setSelection([{row: perEle, column: null}]);
                    console.log("selected " + perEle)
                }

            }

            // Add select listener for personality chart
            google.visualization.events.addListener(chart, 'select', function () {
                if (chart.getSelection()[0]) {
                    console.log(chart.getSelection())
                    console.log(per_data)
                    var selected_person          = parseFloat(perArray[chart.getSelection()[0].row][0] / 100).toFixed(2);
                    console.log(chart.getSelection()[0].row)
                    $('#' + per_str.toLowerCase()).text(selected_person)
                    all_condition['personality'] =
                        $('#emotion_range').text() + ','
                        + $('#agreeableness').text() + ','
                        + $('#extraversion').text() + ','
                        + $('#conscientiousness').text() + ','
                        + $('#openness').text();
                    drawAll(all_condition);

                    var dataObj                    = {};
                    dataObj[per_str.toLowerCase()] = selected_person;
                    var settings                   = {
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
                //pieHole: 0.3,
            };

            var chart  = new google.visualization.PieChart(document.getElementById('all_chart'));
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
                }
            });
            console.log(data)
            var adShow = data[Math.floor(Math.random() * data.length)]
            for (var allEle in all_Array) {
                if (all_Array[allEle][0].indexOf(adShow.ad_category) > -1) {
                    chart.setSelection([{row: allEle, column: null}]);
                }

            }
            if (adShow)
                $(".ad-show").attr("src", adShow.ad_url);

        })
    }

}

