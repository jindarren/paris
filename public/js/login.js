/**
 * Created by jin on 01/06/15.
 */

/**
 * flow cover effect
 */

$(function createCoverFlow() {
    if ($.fn.reflect) {
        $('#poster-player .cover').reflect();// only possible in very specific situations
    }


    //$.ajax({
    //    type:'get',
    //    url:'http://api.themoviedb.org/3/movie/popular',
    //    data:'api_key=1ee6d705452d58e373b8ea7cddbc9610',
    //    dataType:'json',
    //    success:function(response){
    //        if(response.error){
    //            console.log("error", response.error);
    //        }
    //        else{
    //            console.log("success", response);
    //            var movies = response.results;
    //            for(var num=0; num < movies.length; num++){
    //                $('<img class="cover">').attr("src", "https://image.tmdb.org/t/p/original/"+movies[num].poster_path).appendTo(".poster-player");
    //            }
    //            $('.poster-player').coverflow({
    //                density:3,
    //                index:parseInt(movies.length/2),
    //                innerOffset:	50,
    //                innerScale:		.7,
    //                select:function(event,cover,index){
    //                    $('.movieName').html(response.results[index].original_title);
    //                    var movieID = response.results[index].id;
    //                    $.ajax({
    //                        type:'get',
    //                        url:'https://api.themoviedb.org/3/movie/'+movieID,
    //                        data:'api_key=1ee6d705452d58e373b8ea7cddbc9610&append_to_response=trailers,keywords',
    //                        dataType:'json',
    //                        success:function(response){
    //                            if(response.error){
    //                                console.log("error", response.error);
    //                            }
    //                            else{
    //                                console.log("success", response);
    //                                //get genres
    //                                var genres = response.genres;
    //                                var genresVal='';
    //                                for(var genre in genres){
    //                                    genresVal += genres[genre].name +",";
    //                                }
    //                                //get keywords
    //                                var keywords = response.keywords.keywords;
    //                                var keywordsVal = '';
    //                                for(var keyword in keywords){
    //                                    keywordsVal += keywords[keyword].name + ",";
    //                                }
    //                                console.log(keywordsVal.substring(0,genresVal.length-1));
    //                                $('.movieName').html(response.original_title);
    //                                $('.movieGenre').html(genresVal.substring(0,genresVal.length-1));
    //                                $('.movieTag').html(keywordsVal.substring(0,genresVal.length-1));
    //                                $('.movieDes').html(response.overview);
    //                                $('.releaseDate').html(response.release_date);
    //                                var movieSrc = response.trailers.youtube[0].source;
    //
    //                                //$('.watch').attr('href','/video_show_general?movieID='+movieSrc);
    //                                //$('.logged-watch').attr('href','/video_show?movieID='+movieSrc);
    //                                //$('.logged-watch-2').attr('href','/new-vis-2?movieID='+movieSrc+'&movieGenre='+genresVal.substring(0,genresVal.length-1))
    //                                //$('.logged-watch-3').attr('href','/new-vis?movieID='+movieSrc+'&movieGenre='+genresVal.substring(0,genresVal.length-1))
    //                                $('.logged-watch-3').attr('href','/new-vis-3?movieID='+movieSrc+'&movieGenre='+genresVal.substring(0,genresVal.length-1))
    //
    //                            }
    //                        },
    //                        error:function(xhr){
    //                            try{
    //                                var error = JSON.parse(xhr.responseText)
    //                            }catch(e){
    //                                console.log("error", e);
    //                            }
    //                        }
    //
    //                    });
    //
    //                },
    //                animateStep:function(event, cover, offset, isVisible, isMiddle, sin, cos) {
    //                    if (isVisible) {
    //                        if (isMiddle) {
    //                            $(cover).css({
    //                                'filter':'none',
    //                                '-webkit-filter':'none'
    //                            });
    //                        } else {
    //                            var brightness= 1 + Math.abs(sin),
    //                                contrast= 1 - Math.abs(sin),
    //                                filter= 'contrast('+contrast+') brightness('+brightness+')';
    //                            $(cover).css({
    //                                'filter':filter,
    //                                '-webkit-filter':filter
    //                            });
    //                        }
    //                    }
    //                }
    //            });
    //        }
    //    },
    //    error:function(xhr){
    //        try{
    //            var error = JSON.parse(xhr.responseText)
    //        }catch(e){
    //            console.log("error", e);
    //        }
    //    }
    //});

    var version = [];
    getLatinSquare(parseInt(Math.random()*3));
    function getLatinSquare(option){
        switch(option){
            case 0:
                version [0] = '';
                version [1] = '-v2';
                version [2] = '-v3';
                break;
            case 1:
                version [1] = '';
                version [2] = '-v2';
                version [0] = '-v3';
                break;
            case 2:
                version [2] = '';
                version [0] = '-v2';
                version [1] = '-v3';
                break;
        }
    };

    $.getJSON("json/movie_res.json",function(response){
        if(response.error){
            console.log("error", response.error);
        }
        else{
            console.log("success", response);
            var movies = response.results;
            for(var num=0; num < movies.length; num++){
                $('<img class="cover">').attr("src", "https://image.tmdb.org/t/p/original/"+movies[num].poster_path).appendTo(".poster-player");
            }
            $('.poster-player').coverflow({
                density:3,
                index:parseInt(movies.length/2),
                innerOffset:	50,
                innerScale:		.7,
                select:function(event,cover,index){
                    $('.movieName').html(response.results[index].original_title);
                    var movieID = response.results[index].id;
                    $.ajax({
                        type:'get',
                        url:'https://api.themoviedb.org/3/movie/'+movieID,
                        data:'api_key=1ee6d705452d58e373b8ea7cddbc9610&append_to_response=trailers,keywords',
                        dataType:'json',
                        success:function(response){
                            if(response.error){
                                console.log("error", response.error);
                            }
                            else{
                                console.log("success", response);
                                //get genres
                                var genres = response.genres;
                                var genresVal='';
                                for(var genre in genres){
                                    genresVal += genres[genre].name +",";
                                }
                                //get keywords
                                var keywords = response.keywords.keywords;
                                var keywordsVal = '';
                                for(var keyword in keywords){
                                    keywordsVal += keywords[keyword].name + ",";
                                }
                                console.log(keywordsVal.substring(0,genresVal.length-1));
                                $('.movieName').html(response.original_title);
                                $('.movieGenre').html(genresVal.substring(0,genresVal.length-1));
                                $('.movieTag').html(keywordsVal.substring(0,genresVal.length-1));
                                $('.movieDes').html(response.overview);
                                $('.releaseDate').html(response.release_date);
                                var movieSrc = response.trailers.youtube[0].source;


                                //$('.logged-watch-3').attr('href','/new-vis-3?movieID='+movieSrc+'&movieGenre='+genresVal.substring(0,genresVal.length-1));

                                //$('.logged-watch-3').attr('href','/new-vis-3?movieID='+movieSrc+'&movieName='+response.original_title);
                                $('.logged-watch-3').attr('href','/new-vis-3'+version[0]+'?movieID='+movieSrc+'&movieName='+response.original_title);
                                $('.logged-watch-3-v2').attr('href','/new-vis-3'+version[1]+'?movieID='+movieSrc+'&movieName='+response.original_title);
                                $('.logged-watch-3-v3').attr('href','/new-vis-3'+version[2]+'?movieID='+movieSrc+'&movieName='+response.original_title);

                            }
                        },
                        error:function(xhr){
                            try{
                                var error = JSON.parse(xhr.responseText)
                            }catch(e){
                                console.log("error", e);
                            }
                        }

                    });

                },
                animateStep:function(event, cover, offset, isVisible, isMiddle, sin, cos) {
                    if (isVisible) {
                        if (isMiddle) {
                            $(cover).css({
                                'filter':'none',
                                '-webkit-filter':'none'
                            });
                        } else {
                            var brightness= 1 + Math.abs(sin),
                                contrast= 1 - Math.abs(sin),
                                filter= 'contrast('+contrast+') brightness('+brightness+')';
                            $(cover).css({
                                'filter':filter,
                                '-webkit-filter':filter
                            });
                        }
                    }
                }
            });
        }

    });
});
