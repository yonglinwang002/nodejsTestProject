
var AV = require('leanengine');

let baseURL = 'http://zths.szy.cn:4080/';

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


function runOneCheckIn(userid,password,babyid) {
    /*  登录 */
    let sessionid = login(userid,"");
    logineverydayonetimes(sessionid);
    let growthid=addGrowup(sessionid,babyid);
    shareMessage(sessionid);

    var returnCode = deleteGrowup(sessionid,growthid);
    var deleteTimes = 1;
    while (returnCode != 10000 && deleteTimes<3) {
      returnCode = deleteGrowup(sessionid,growthid);
      deleteTimes += 1;
    }
    return "OK";
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

  function shareMessage(sessionid) {
    console.log("start shareMessage");
    let parameters = {   
      "shareto" : 2,  
     "shareurl" : "http:\/\/ztjywx.szy.cn\/growth\/getWeiXinOpenId.action?id=",  
      "sharetype" : 1 
    };
    let returncode =  ztBaseRequest("ZTHServer/sharemessage/shareMessage",parameters,"1229",sessionid).returncode;
    return returncode;
  }
  // function getBabyList(sessionid) {
  //   console.log("start getBabyList");
  //   let babyarray =  ztBaseRequest("family/baby/list/1343/v1.0",null,sessionid).body.babyinfolist;
  //   if (babyarray.length>0) {
  //     let babyid = babyarray[0].babyuid;
  //     console.log("babyID:"+babyid);
  //     return babyid;
  //   }
  //   else
  //   {
  //     return "";
  //   }
  // }

  function login(userName,password) {
    let parameters = {
      "devkey":"d2279baecaf3c757c5306aee1346df3708bd917e",
                              "devtype":"2",
                              "logintype":"1",
                              "account":userName,
                              "release":"2",
                              "apptype":"1",
                              "pushkey":"",
                              "versionnum":"5.3.3.5",
                              "password":"b66260fb41984349efa0dd718e72a9be",
                              "oemid":"1",
                              "pwd2":"e10adc3949ba59abbe56e057f20f883e"
    };

    let sessionid = ztBaseRequest("ZTHServer/user/login",parameters,"1000","").body.sessionid;
    console.log('sessionid:'+sessionid);
    return sessionid;
  }
  
  function ztBaseRequest(method,bodyDic,reqcode,sessionid) {
    var request = require('sync-request');
    var url =  baseURL + method;
    var cookie = "ClientVersion=5.3.2;";
    var bodyString = "reqcode="+reqcode+"&reqcodeversion=5.3";
    if (bodyDic) {
      bodyString = "body="+JSON.stringify(bodyDic)+"&"+bodyString;
    }
    if (sessionid.length>0) {
      cookie = cookie + "JSESSIONID="+sessionid;
    } 
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