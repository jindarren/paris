/**
 * Created by jin on 08/07/15.
 */

$(document).ready(
    loadRandomAd()
);

function generateRandomAd(adNum){
    var adIndex = 0;
    var randomNumArray =[];

    for(;adIndex<adNum;){
        var randomNum = Math.floor((Math.random()*20)+1);
        if(jQuery.inArray(randomNum,randomNumArray)==-1){
            randomNumArray[adIndex]=randomNum;
            adIndex++;
        }else{
        }
    }
    console.log(randomNumArray);
    return randomNumArray;
}

/**
 * it get the url of ads by other attributes of ads
 * @param attr the attribute selected for querying ads
 * @param attrValue the value of selected value
 * @param jsonFile the file storing the ads

 function getAdByAttr(attr,attrValue,jsonFile){
    $.getJSON(jsonFile, function(data){
        for(var ad in data.ad_repository){
            if(typeof attrValue == 'number'){
                if(data.ad_repository[ad][attr]=='ad_'+getPaddedZero(attrValue,3))
                {
                    console.log(data.ad_repository[ad].ad_url);
                    return data.ad_repository[ad].ad_url
                }
                else
                    console.log("the fetched num does not exist!")
            }
            else{
                if(data.ad_repository[ad][attr]==attrValue)
                    return data.ad_repository[ad].ad_url
                    //console.log(data.ad_repository[ad].ad_url)
                else
                    console.log("the fetched attr does not exist!")
            }
        }
    })
}
 */

/**
 * it load random ads
 */
function loadRandomAd() {
    $.getJSON("json/ad_res.json", function (data) {
        var adNum = generateRandomAd(8);
        for (var adIndex = 1; adIndex <= adNum.length; adIndex++) {
            $("#ad-" + adIndex).attr("src", data.ad_repository[adNum[adIndex-1]-1].ad_url);
            console.log(data.ad_repository[adNum[adIndex-1]-1].ad_url)
        }
    })
}

$('.watchbtn').click(function(){
        $.ajax({

        })
    }
);
/**
 * it convert the normal number to be padded number
 * @param num the input number
 * @param countPadded the bits of padded number e.g. 001 means countPadded should be 3
 */
//function getPaddedZero(num,countPadded){
//    var numString = num + '';
//    while(numString.length<countPadded)
//    {
//        numString = '0' + numString;
//    }
//    return numString
//}
