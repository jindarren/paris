/**
 * Created by jin on 08/07/15.
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for the user model

var adSchema = mongoose.Schema({
        ad_id: String,
        ad_url: String,
        ad_target: String,
        ad_category: String,
        ad_brand: String,
        promotion_device: Boolean,
        ad_color:String,
        ad_target_user:{
            gender:String,
            age_range:{
                min_age:Number,
                max_age:Number
            },
            language:String,
            personality:{
                "emotion_range": {
                    "min_val":Number,
                    "max_val":Number
                },
                "agreeableness": {
                    "min_val":Number,
                    "max_val":Number
                },
                "extraversion": {
                    "min_val":Number,
                    "max_val":Number
                },
                "conscientiousness": {
                    "min_val":Number,
                    "max_val":Number
                },
                "openness": {
                    "min_val":Number,
                    "max_val":Number
                }
            }
        },
        ad_target_movie:{
            type:String,
            keyword:String
        }
});

//generating a hash
adSchema.methods.generateHash = function () {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};

//check if the password is valid
adSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('ad', adSchema);