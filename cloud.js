var AV = require('leanengine');
var ztjyCloud = require('./cloud/ztjyCloud.js');
var meituan = require('./cloud/meituansign.js');
var sendmail = require('./cloud/sendMail.js');
var xiaomisprot =  require('./cloud/xiaomisport.js');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('meituanSign', function(request) {
  var reseult = meituan.meituanSignInAttendance();
  return reseult['data'];
});

AV.Cloud.define('xiaomisport', function(request) {

  Math.random()*7000
  var num = Math.random()*7000 + 13000;
  num = parseInt(num, 10);

  var step = num;
  if (request.params.step) {
    step = request.params.step;
  } 
  console.log('step:'+step);
  var reseult = xiaomisprot.run(step);
  return reseult;
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

AV.Cloud.define('sendMailTest', function (request) {
  sendmail.testSend();
  return "ok";
});

AV.Cloud.define('ztjyCheckIn', function (request) {
  let result = ztjyCloud.runAllCheckIn();
  return result;
});

AV.Cloud.define('ztjyNewCheckIn', function (request) {
  let result = ztjyCloud.runOneCheckIn("18918243082","","");
  return result;
});
