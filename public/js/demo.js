/**
* Copyright 2014 IBM Corp. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

var ad_category='';

$('.row .btn-default').on('click', function(e) {
  e.preventDefault();
  var $this = $(this);
  var $collapse = $this.closest('.collapse-group').find('.collapse');
  $collapse.collapse('toggle');
});

function haveJsonSelector(selectObj,modelAttr){
  var attrArray = modelAttr.split('.');
    //console.log(attrArray.length)
    var attrVal={};
    switch (attrArray.length){
        case 1:
            attrVal= (JSON.parse(JSON.stringify(selectObj[attrArray[0]])));
            break;
        case 2:
            attrVal= (JSON.parse(JSON.stringify(selectObj[attrArray[0]][attrArray[1]])));
            break;
        case 3:
            attrVal= (JSON.parse(JSON.stringify(selectObj[attrArray[0]][attrArray[1]][attrArray[2]])));
            break;
        case 4:
            attrVal= (JSON.parse(JSON.stringify(selectObj[attrArray[0]][attrArray[1]][attrArray[2]][attrArray[3]])));
            break;
        case 5:
            attrVal= (JSON.parse(JSON.stringify(selectObj[attrArray[0]][attrArray[1]][attrArray[2]][attrArray[3]][attrArray[4]])));
            break;
    }
    //console.log(attrVal)
    return attrVal
}

function loadAd(adIndex) {
  $.getJSON("json/ad_res.json", function (data) {
      $(".ad-show").attr("src", data.ad_repository[adIndex].ad_url);
      console.log(data.ad_repository[adIndex].ad_url)
    })
}

function loadAdFromMovie(){
    $.getJSON("json/ad_res.json", function (data) {
        var ads=[];
        var keywords=[];
        keywords=$('#movie_genre').text().split(',');
        for(var ad in data.ad_repository){
                for(var word in keywords){
                    if (haveJsonSelector(data.ad_repository[ad],"ad_target_movie.keyword").indexOf(keywords[word])>-1){
                        console.log(haveJsonSelector(data.ad_repository[ad],"ad_target_movie.keyword").indexOf(keywords[word]));
                        console.log("ad repository ++++++++"+ad+" "+haveJsonSelector(data.ad_repository[ad],"ad_target_movie.keyword"));
                        console.log("movie repository ++++++++"+ad+ " "+ keywords);
                        console.log(keywords[word]);
                        if(ads.indexOf(ad)==-1){
                            ads.push(ad)
                        }
                    }
                }
        }
        console.log(ads);
        //choose a random ad from ad
        var index = ads[Math.floor(Math.random()*ads.length)];
        console.log(index);
        $(".ad-show").attr("src", data.ad_repository[index].ad_url);
        ad_category = data.ad_repository[index].ad_category;
    })
}

function loadAdFromUserModel(modelAttr, modelAttrValue) {
  $.getJSON("json/ad_res.json", function (data) {
      var ads_rel=[];
      var ads_new=[];
      var index=0;
      for(var ad in data.ad_repository){
      if(haveJsonSelector(data.ad_repository[ad],modelAttr)==modelAttrValue
          || parseInt(modelAttrValue) >= parseInt(haveJsonSelector(data.ad_repository[ad],modelAttr).split(',')[0])
          && parseInt(modelAttrValue)<=parseInt(haveJsonSelector(data.ad_repository[ad],modelAttr).split(',')[1])){
            if(data.ad_repository[ad].ad_category==ad_category)
                ads_rel.push(ad);
            else{
                ads_new.push(ad)
            }
          console.log(parseInt(haveJsonSelector(data.ad_repository[ad],modelAttr).split(',')[1]))
      }
    }
      console.log(ads_rel);
      console.log(ads_new);
      //choose a random ad from ad
      if(ads_rel.length>0){
          index = ads_rel[Math.floor(Math.random()*ads_rel.length)];
          console.log(index);
          $(".ad-show").attr("src", data.ad_repository[index].ad_url);
          ad_category = data.ad_repository[index].ad_category;
      }else{
          index = ads_new[Math.floor(Math.random()*ads_new.length)];
          console.log(index);
          $(".ad-show").attr("src", data.ad_repository[index].ad_url);
          ad_category = data.ad_repository[index].ad_category;
      }
  })
}

$(document).ready(function() {

  var widgetId = 'vizcontainer', // Must match the ID in index.jade
    widgetWidth = 800, widgetHeight = 800, // Default width and height
    personImageUrl = 'images/app.png'; // Can be blank

  // Jquery variables
  var $loading = $('.loading'),
    $error = $('.error'),
    $errorMsg = $('.errorMsg'),
    $traits = $('.traits'),
    $results = $('.results');

/**
* 1. Create the request
* 2. Call the API
* 3. Call the methods to display the results
*/
$(function callService(){
    $loading.show();
    $error.hide();
    $traits.hide();
    $results.hide();

    $.ajax({
      type: 'POST',
      data: {
        text: $('#post-data').text()
      },
      url: '/',
      dataType: 'json',
      success: function(response) {
        $loading.hide();

        if (response.error) {
          showError(response.error);
        } else {
          $results.show();
          console.log(response);
          showTraits(response);
          showTextSummary(response);
          showVizualization(response);
        }

      },
      error: function(xhr) {
        $loading.hide();
        var error;
        try {
          error = JSON.parse(xhr.responseText);
        } catch(e) {}
        showError(error.error || error);
      }
    });
 });

  /**
   * Display an error or a default message
   * @param  {String} error The error
   */
  function showError(error) {
    var defaultErrorMsg = 'Error processing the request, please try again later.';
    $error.show();
    $errorMsg.text(error || defaultErrorMsg);
  }

  /**
   * Displays the traits received from the
   * Personality Insights API in a table,
   * just trait names and values.
   */
  function showTraits(data) {
    console.log('showTraits()');
    $traits.show();

    var traitList = flatten(data.tree),
      table = $traits;

    table.empty();

    // Header
    $('#header-template').clone().appendTo(table);

    // For each trait
    for (var i = 0; i < traitList.length; i++) {
      var elem = traitList[i];

      var Klass = 'row';
      Klass += (elem.title) ? ' model_title' : ' model_trait';
      Klass += (elem.value === '') ? ' model_name' : '';

      if (elem.value !== '') { // Trait child name
        $('#trait-template').clone()
          .attr('class', Klass)
          .find('.tname')
          .find('span').html(elem.id).end()
          .end()
          .find('.tvalue')
            .find('span').html(elem.value === '' ?  '' : (elem.value + ' (± '+ elem.sampling_error+')'))
            .end()
          .end()
          .appendTo(table);
      } else {
        // Model name
        $('#model-template').clone()
          .attr('class', Klass)
          .find('.col-lg-12')
          .find('span').html(elem.id).end()
          .end()
          .appendTo(table);
      }
    }
  }

  /**
   * Construct a text representation for big5 traits crossing, facets and
   * values.
   */
  function showTextSummary(data) {
    console.log('showTextSummary()');
    var paragraphs = [
      assembleTraits(data.tree.children[0]),
      assembleFacets(data.tree.children[0]),
      assembleNeeds(data.tree.children[1]),
      assembleValues(data.tree.children[2])
    ];
    var div = $('.summary-div');
    div.empty();
    paragraphs.forEach(function(sentences) {
      $('<p></p>').text(sentences.join(' ')).appendTo(div);
    });
  }

/**
 * Renders the sunburst visualization. The parameter is the tree as returned
 * from the Personality Insights JSON API.
 * It uses the arguments widgetId, widgetWidth, widgetHeight and personImageUrl
 * declared on top of this script.
 */
function showVizualization(theProfile) {
  $('#' + widgetId).empty();
  var d3vis = d3.select('#' + widgetId).append('svg:svg');
  var widget = {
    d3vis: d3vis,
    data: theProfile,
    loadingDiv: 'dummy',
    switchState: function() {
      console.log('[switchState]');
    },
    _layout: function() {
      console.log('[_layout]');
    },
    showTooltip: function() {
      console.log('[showTooltip]');
    },
    id: 'SystemUWidget',
    COLOR_PALLETTE: ['#1b6ba2', '#488436', '#d52829', '#F53B0C', '#972a6b', '#8c564b', '#dddddd'],
    expandAll: function() {
      this.vis.selectAll('g').each(function() {
        var g = d3.select(this);
        if (g.datum().parent && // Isn't the root g object.
          g.datum().parent.parent && // Isn't the feature trait.
          g.datum().parent.parent.parent) { // Isn't the feature dominant trait.
          g.attr('visibility', 'visible');
        }
      });
    },
    collapseAll: function() {
      this.vis.selectAll('g').each(function() {
        var g = d3.select(this);
        if (g.datum().parent && // Isn't the root g object.
          g.datum().parent.parent && // Isn't the feature trait.
          g.datum().parent.parent.parent) { // Isn't the feature dominant trait.
          g.attr('visibility', 'hidden');
        }
      });
    },
    addPersonImage: function(url) {
      if (!this.vis || !url) {
        return;
      }
      var icon_defs = this.vis.append('defs');
      var width = this.dimW,
        height = this.dimH;

      // The flower had a radius of 640 / 1.9 = 336.84 in the original, now is 3.2.
      var radius = Math.min(width, height) / 16.58; // For 640 / 1.9 -> r = 65
      var scaled_w = radius * 2.46; // r = 65 -> w = 160

      var id = 'user_icon_' + this.id;
      icon_defs.append('pattern')
        .attr('id', id)
        .attr('height', 1)
        .attr('width', 1)
        .attr('patternUnits', 'objectBoundingBox')
        .append('image')
        .attr('width', scaled_w)
        .attr('height', scaled_w)
        .attr('x', radius - scaled_w / 2) // r = 65 -> x = -25
        .attr('y', radius - scaled_w / 2)
        .attr('xlink:href', url)
        .attr('opacity', 1.0)
        .on('dblclick.zoom', null);
      this.vis.append('circle')
        .attr('r', radius)
        .attr('stroke-width', 0)
        .attr('fill', 'url(#' + id + ')');
    }
  };

  widget.dimH = widgetHeight;
  widget.dimW = widgetWidth;
  widget.d3vis.attr('width', widget.dimW).attr('height', widget.dimH);
  widget.d3vis.attr('viewBox', "0 0 " + widget.dimW + ", " + widget.dimH);
  renderChart.call(widget);
  widget.collapseAll.call(widget);
  if (personImageUrl)
    widget.addPersonImage.call(widget, personImageUrl);
}

  /**
   * Returns a 'flattened' version of the traits tree, to display it as a list
   * @return array of {id:string, title:boolean, value:string} objects
   */
  function flatten( /*object*/ tree) {
    var arr = [],
      f = function(t, level) {
        if (!t) return;
        if (level > 0 && (!t.children || level !== 2)) {
          arr.push({
            'id': t.name,
            'title': t.children ? true : false,
            'value': (typeof (t.percentage) !== 'undefined') ? Math.floor(t.percentage * 100) + '%' : '',
            'sampling_error': (typeof (t.sampling_error) !== 'undefined') ? Math.floor(t.sampling_error * 100) + '%' : ''
          });
        }
        if (t.children && t.id !== 'sbh') {
          for (var i = 0; i < t.children.length; i++) {
            f(t.children[i], level + 1);
          }
        }
      };
    f(tree, 0);
    return arr;
  }

    /**
     * Show ads to the target users
     */
//    loadAdFromUserModel('ad_target_movie.type',localStorage.getItem("videoType").split(','));
    $(function loadAds(){
        loadAdFromMovie()
    });
});

//edit age
$('#age-opt').hide();
$('#age-val').click(function(){
    $('#age-val').empty();
    $('#age-opt').show()
});
$('#age-opt').on('change', function() {
    var age = $(this).val();
    if(age != "--select age range--"){
        $('#age-val').text(age);
        loadAdFromUserModel('ad_target_user.age_range',age);
        $('#ad-title').attr('title',"We show this ad according to your age.");
        $('#age-opt').hide()
    }
});

//edit gender
$('#gender-opt').hide();
$('#gender-val').click(function(){
    $('#gender-val').empty();
    $('#gender-opt').show()
});
$('#gender-opt').on('change', function() {
    var gender=$(this).val();
    if (gender != "--select language--"){
        $('#gender-val').text(gender);
        loadAdFromUserModel('ad_target_user.gender',gender);
        $('#ad-title').attr('title',"We show this ad according to your gender.");
        $('#gender-opt').hide()
    }
});

//edit language
$('#language-opt').hide();
$('#language-val').click(function(){
    $('#language-val').empty();
    $('#language-opt').show()
});
$('#language-opt').on('change', function() {
    var language = $(this).val();
    if (language != "--select language--"){
        $('#language-val').text(language);
        loadAdFromUserModel('ad_target_user.language',language);
        $('#ad-title').attr('title',"We show this ad according to your language.");
        $('#language-opt').hide()
    }
});

//show ad explanation
$(function() {
    $( "#ad-title" ).tooltip({
        show: {
            effect: "fade",
            delay: 250
        }
    });
});


// for change the value on visualization

$('#slider').hide();
