// polyfil cutnpasted from MDN
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(valueToFind, fromIndex) {

      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(valueToFind, elementK) is true, return true.
        if (sameValueZero(o[k], valueToFind)) {
          return true;
        }
        // c. Increase k by 1. 
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}



/**
 * Creates a breakdown of instant runoff voting wherein 
 *
 * @param {array} allVotes the selection of all cells that contain votes
 * @param {array} asPercent false by default, returns results as percentages of total 
 * @return The grid of vote breakdown
 * @customfunction
 */
function instantRunoff(allVotes,asPercent) {
  var pass = 0;
  var runPlease = true;
  var choices = allVotes[0].slice();
  var output = [];
  
  var voteCount = Array(choices.length);
    
  var losers = [];
  var loserSearchVotes = 500000000;
  var loserSearchIndex = -12;
  
  var winner = "";
  var totes = 0;
  var asPercent = (typeof asPercent !== 'undefined') ? asPercent : false;
  
  while(runPlease){
    // reset the vote count etc for this pass
    voteCount = Array.apply(null, Array(choices.length)).map(function(){return 0});
    loserSearchVotes = 500000000;
    loserSearchIndex = -12;
    totes = 0;
    
    // loop through all votes 
    for (i = 0; i < allVotes.length; i++) {
      
      // while current row's vote is in the losers array, drop the vote and shift all the choices over to count last good one
      while(losers.includes( allVotes[i][0] )){
        allVotes[i].shift();
      }
      
      // loop through choices per row, adding up leftmost totals
      for (j = 0; j < choices.length; j++) {
        if (choices[j] == allVotes[i][0]) {
          voteCount[j]++;
          totes++;
        }
      }
    }
    
    // figure out the loser
    for (k = 0; k < voteCount.length; k++) {
      if (voteCount[k] < loserSearchVotes && !losers.includes( choices[k] )) {
        loserSearchVotes = voteCount[k];
        loserSearchIndex = k;
      }
    }
    
    // add loser to loser list
    losers.push(choices[loserSearchIndex]);
    
    // format pass results for output
    if(asPercent){
        for (m = 0; m < voteCount.length; m++) {
          voteCount[m] = voteCount[m]/totes;
        }
    }
    voteCount.unshift("Round "+(pass+1));
    voteCount.push(pass == choices.length - 1 ? "–" : choices[loserSearchIndex]);
    output.push(voteCount.slice());
    
    pass++;
    
    // keep running until everyone loses
    if (losers.length == choices.length) runPlease = false;
  }

  // which one won?
  for (l = 0; l < choices.length; l++) {
    if(!losers.includes(choices[l])) winner = choices[l];
  }
  // format for output
  output.unshift( choices.slice() );
  if(asPercent) output[0].unshift("INSTA RUNOFFT %");
  else output[0].unshift("INSTA RUNOFFT #");
  output[0].push("OUT");

//  losers.pop();
// losers.reverse().unshift("Runners up \nin order of preference:");
  
  output.push("",["WINNAR:", choices[loserSearchIndex].toUpperCase()] //,"", losers
             );
                    
  return output;
}

