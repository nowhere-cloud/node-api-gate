// http://stackoverflow.com/questions/28231628/convert-mongoose-stream-to-array/34485539#answer-28267651

"use strict";

/**
 * Transform Mongoose Streamed Array into proper JSON Object String
 * @return String Stringified JSON
 */
transformer = () => {
    let first = true;
    return function(data) {
        if (first) {
            first = false;
            return JSON.stringify(data);
        }
        return "," + JSON.stringify(data);
    };
};

module.exports = { "transform": transformer };
