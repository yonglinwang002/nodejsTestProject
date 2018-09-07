
var AV = require('leanengine');

let baseURL = 'http://zths.szy.cn:4080/';
let baseNewHTTPSURL = 'https://zths.szy.cn:443/'

function runAllCheckIn() {
  /* 逐一登录 */
  var query = new AV.Query('Account');
  return query.find().then(function(results) {
    for (var i = 0; i < results.length; i++ ) {
      let userid = results[i].get('mobile');
      let babyID = results[i].get('babyid');

      let result = runOneCheckIn(userid,"",babyID);
      console.log('result:'+result);
    }
    return "OK";
  });
}

function runOneCheckIn(mobile,password,babyid) {
    /*  登录 */
    let checkCode = checkphoneaccount(mobile);
    let loginInfo = login(checkCode);

    let sessionid = loginInfo.sessionid;
    let ztUserid = loginInfo.userid;
    //每日登录（未实现）
    // logineverydayonetimes(sessionid);
    // let growthid=addGrowup(sessionid,babyid);
    shareMessage(sessionid);
    //阅读文章
    for (let index = 0; index < 5; index++) {
      sendTask(sessionid,ztUserid,11,"jzrw000026");
    }
    sendTask(sessionid,ztUserid,12,"jzrw000027") //分享文章
    sendTask(sessionid,ztUserid,13,"jzrw000028");//收听课程
    sendTask(sessionid,ztUserid,10,"jzrw000025");//与亲友群聊互动
    return "OK";


    var returnCode = deleteGrowup(sessionid,growthid);
    var deleteTimes = 1;
    while (returnCode != 10000 && deleteTimes<3) {
      returnCode = deleteGrowup(sessionid,growthid);
      deleteTimes += 1;
    }
    return "OK";
  }
  
  function checkphoneaccount(mobile) {
    let para  ={
      "appType":"APP_TYPE_PARENT",
      "deviceId":"d2279baecaf3c757c5306aee1346df3708bd917e",
      "password":"e10adc3949ba59abbe56e057f20f883e",
      "account":mobile
    };
    let returncode = ztNewBaseRequest("userserver/info/checkphoneaccount/v1.0",para,"").body.code;
    console.log(returncode);
    return returncode;
  }

  function login(checkphoneCode) {
    let parameters = {
      "pushKey":"",
      "release":"1",
      "appType":"APP_TYPE_PARENT",
      "devKey":"d2279baecaf3c757c5306aee1346df3708bd917e",
      "code":checkphoneCode,
      "loginType":"NORMAL",
      "devType":"Iphone"
    };

    let body = ztNewBaseRequest("parent/app/login/v1.0",parameters,"").body;
    console.log('sessionid:'+body.sessionId);
    let loginInfo = {
      sessionid : body.sessionId,
      userid : body.userId
    };
    return loginInfo;
  }

  // function read(sessionid,userid)
  // {
  //   return sendTask(sessionid,userid,11,"jzrw000026");
  // }

  // function shareClass(sessionid,userid) {
  //   return sendTask(sessionid,userid,12,"jzrw000027");
  // }

  // function listenClass(sessionid,userid) {
  //   return sendTask(sessionid,userid,13,"jzrw000028");
  // }

  function sendTask(sessionid,userid,actionType,taskNumber) {
    let parameters = {
      "userId":userid,
      "schoolId":"UY3wkwAWe6NFmwsku06",
      "childId":"e8d334c939972a390125",
      "actionType":actionType,
      "studentId":"e8d334c939972a390125",
      "taskNumber":taskNumber,
      "appType":"parent",
      "classId":"qbp57CODk3ocHuf2G12"
    };

    let code = ztNewBaseRequestWithURL("http://api.szy.cn/","score/task/sendTask/v1.0",parameters,sessionid).code;
    console.log('code:'+code);
  }

  function logineverydayonetimes(sessionid) {
    let returncode =  ztBaseRequest("ZTHServer/app/logineverydayonetimes",null,"1236",sessionid).returncode;
    return returncode;
  }

  function addGrowup(sessionid,babyid) {
    console.log("start addGrowup");
    let parameters = 
      {
        "archivestype" : "2",
        "sendtype" : "0",
        "childid" : babyid,
        "studentid" : babyid,
        "textcontent" : "6592"
      };
    let growthid =  ztBaseRequest("ZTHServer/growup/add",parameters,"1119",sessionid).body.growthid;
    return growthid;
  }

  function deleteGrowup(sessionid,growthid) {
    console.log("start deleteGrowup");
    let parameters = 
      {
        "growthid" : growthid
      };
    let returncode =  ztBaseRequest("ZTHServer/growup/delgrowth",parameters,"1139",sessionid).returncode;
    return returncode;
  }

  //分享
  function shareMessage(sessionid) {
    console.log("start shareMessage");
    let parameters = "%7B%0A%20%20%22shareurl%22%20%3A%20%22https%3A%5C/%5C/ztjywx.szy.cn%5C/H5Server%5C/growth%5C/shareGrowthToWeiXin?id%3D157102391%26growthId%3D157102391%26shareUserId%3D09af031ed34ea2b4569e%26shareStudentId%3De8d334c939972a390125%26schoolId%3DUY3wkwAWe6NFmwsku06%26key%3D7471631c0ca69a812df465f91bfe519c%22%2C%0A%20%20%22shareto%22%20%3A%202%2C%0A%20%20%22sharetype%22%20%3A%201%0A%7D";
    let returncode =  ztBaseRequest("ZTHServer/sharemessage/shareMessage",parameters,"1229",sessionid).returncode;
    return returncode;
  }

  
  function ztBaseRequest(path,bodyDicString,reqcode,sessionid) {
    var request = require('sync-request');
    var url =  baseNewHTTPSURL + path;
    var cookie = "ClientVersion=6.1.6;";
    var bodyString = "reqcode="+reqcode+"&reqcodeversion=6.1";
    if (bodyDicString) {
      bodyString = "body="+bodyDicString+"&"+bodyString;
    }
    if (sessionid.length>0) {
      cookie = cookie + "JSESSIONID="+sessionid;
    } 
    console.log("url:"+url);
    console.log("cookie:"+cookie);
    console.log("bodyString:"+bodyString);
    var res = request('POST', url, {
      headers: {
        'user-agent': 'iOS',
        'Cookie':cookie,
        "Content-Type":"application/x-www-form-urlencoded; charset=utf-8"
      },
      body:bodyString,
    });
    console.log('res '+ res.getBody());
    var responseData = JSON.parse(res.getBody(''));
    return responseData;
  }

  // HTTPS方法
  function ztNewBaseRequest(method,bodyDic,sessionid)
  {
    return ztNewBaseRequestWithURL(baseNewHTTPSURL,method,bodyDic,sessionid);
  }

  function ztNewBaseRequestWithURL(url,method,bodyDic,sessionid) {
    var request = require('sync-request');
    var url =  url + method;
    var cookie = "ClientVersion=6.1.6;";
    var bodyString = "";
    // if (bodyDic) {
    //   bodyString = "body="+JSON.stringify(bodyDic)+"&"+bodyString;
    // }
    if (sessionid.length>0) {
      cookie = cookie + "JSESSIONID="+sessionid;
    } 
    var res = request('POST', url, {
      headers: {
        'user-agent': 'zhang tong jia yuan/6.1.6 (iPhone; iOS 11.4.1; Scale/2.00)',
        'Cookie':cookie,
        "Content-Type":"application/json"
      },
      json:bodyDic,
    });
    console.log('res '+ res.getBody());
    var responseData = JSON.parse(res.getBody(''));
    return responseData;
  }


  function baseRequest(url) {
    var request = require('sync-request');
    console.log('url '+ url);
    var res = request('GET', url, {
      headers: {
        'user-agent': 'example-user-agent',
      },
    });
    var user = JSON.parse(res.getBody('utf8'));
    return user;
  }

  exports.baseRequest = baseRequest;
  exports.runOneCheckIn = runOneCheckIn;
  exports.runAllCheckIn = runAllCheckIn;
  exports.checkphoneaccount = checkphoneaccount;