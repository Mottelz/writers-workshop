exports.calculatePoints = function (rows, callback) {
    let points = 0;
    
    //callback with result
    if(callback){
        callback({points: points});
    }
};