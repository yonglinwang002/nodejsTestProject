var AV = require('leanengine');
var ztjyCloud = require('./cloud/ztjyCloud.js');
var meituan = require('./cloud/meituansign.js');


/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('meituanSign', function(request) {
  var reseult = meituan.meituanSignInAttendance();
  return reseult['data'];
});

/**
 * 
 */
AV.Cloud.define('vote', function (request) {
  var query = new AV.Query('VoteRecord');
  return query.find().then(function(results) {
    var currentRecordID = results[0].get('currentRecordID');
    
    for (let index = 0; index < 10; index++) {
      var voteUserID  = currentRecordID + index;
      
      //* getOpenID */
      var openID = getOpenID(voteUserID);
      console.log('openID: ' + openID);
      /*Vote */
      var msg = vote(openID);
      console.log('msg: ' + msg["vote_count"]);

      results[0].set('currentRecordID',voteUserID);
      results[0].save();
    }
  });
});

function getOpenID(voiceCodeID) {
  var url = "https://qr.mingsi.org/weixinmp/me.php?voicecode=" + voiceCodeID;
  var reseult = ztjyCloud.baseRequest(url);
  return reseult['openid'];
}

function vote(voiceCodeID) {
  var url = "https://qr.mingsi.org/weixinmp/vote.php?openid=" + voiceCodeID + "&voicecode=1159298";
  var reseult = ztjyCloud.baseRequest(url);
  return reseult['msg'];
}


/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello2', function (request) {
  var query = new AV.Query('_user');
  return query.find().then(function(results) {
    var sum = '';
    for (var i = 0; i < results.length; i++ ) {
      // sum  = sum+':'+ results[i].get('username');
    }
    return sum;
  });

});

AV.Cloud.define('httpTest', function (request) {
  // return ztjyCloud.runOneCheckInquest('12000000008','b66260fb41984349efa0dd718e72a9be');
  return "";
});

