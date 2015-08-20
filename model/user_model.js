/**
 * Created by jin on 27/05/15.
 */
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for the user model

var userSchema = mongoose.Schema({
    facebook: {
        id: String,
        token: String,
        name: String,
        age: Number,
        ageLevel: Number,
        ageText:String,
        gender: String,
        posts: [],
        permissions:String,
        languages:String,
        allPost: String,
        ibmPersonality: String,
        timeStamp: {type: Date, default: Date.now()},
        taste: [],
        tasteLog: [],
        big5: {
            openness:Number,
        // {
        //        Adventurousness: Number,
        //        Artistic_interests: Number,
        //        Emotionality: Number,
        //        Imagination: Number,
        //        Intellect: Number,
        //        Authority_challenging:Number
        //    },
            conscientiousness:Number,
        //{
        //        Achievement_striving:Number,
        //        Cautiousness:Number,
        //        Dutifulness:Number,
        //        Orderliness:Number,
        //        Self_discipline:Number,
        //        Self_efficacy:Number
        //    },
            extraversion:Number,
        //{
        //        Activity_level:Number,
        //        Assertiveness:Number,
        //        Cheerfulness:Number,
        //        Excitement_seeking:Number,
        //        Outgoing:Number,
        //        Gregariousness:Number
        //    },
            agreeableness:Number,
        //{
        //        Altruism:Number,
        //        Cooperation:Number,
        //        Modesty:Number,
        //        Uncompromising:Number,
        //        Sympathy:Number,
        //        Trust:Number
        //    },
            emotion_range:Number
        //{
        //        Fiery:Number,
        //        Prone_to_worry:Number,
        //        Melancholy:Number,
        //        Immoderation:Number,
        //        Self_consciousness:Number,
        //        Susceptible_to_stress:Number
        //    }
        },
        big5Level:{
            emoLevel: Number,
            conLevel: Number,
            opeLevel: Number,
            agrLevel: Number,
            extLevel: Number
        }
    }
});

//generating a hash
userSchema.methods.generateHash = function () {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};

//check if the password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
