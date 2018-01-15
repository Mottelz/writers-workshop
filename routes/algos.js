const bcrypt = require('bcrypt');

exports.calculatePoints = function (rows, callback) {
    let points = 0;
    let storyMulti = {tinyfict: 1, shorfict: 3, longfict: 5, shornfic: 2, longnfic: 5, shorpoem: 2, epicpoem: 4};
    let reviewMulti = {tinyfict: 1, shorfict: 2, longfict: 3, shornfic: 1, longnfic: 3, shorpoem: 1, epicpoem: 3};

    //if reviews calculate
    if(rows.reviews!=null){
        for(let i = 0; i < rows.reviews.length; i++) {
            points += (reviewMulti[rows.reviews[i].revCat] * rows.reviews[i].revNum);
        }
    }

    //if stories calculate
    if(rows.stories!= null){
        for(let i = 0; i < rows.stories.length; i++) {
            points -= (storyMulti[rows.stories[i].stoCat] * rows.stories[i].stoNum);
        }
    }

    //callback with result
    if(callback){
        callback({points: points});
    }
};

exports.encryptPassword = function(password, callback) {
    bcrypt.hash(password, 50, function (err, hash) {
        if(err){
            console.log(err);
            if(callback){
                callback(err);
            }
        } else if(callback){
            callback(hash);
        } else {
            console.log(hash);
        }
    });
};

exports.verifyPassword = function (raw, encrypted, callback) {
    bcrypt.compare(raw, encrypted, function (err, res) {
        if(err){
            console.log(err);
            if(callback){
                callback(err);
            }
        } else if(callback){
            callback(res);
        } else {
            console.log(res);
        }
    });
};