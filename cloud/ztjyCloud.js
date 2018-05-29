

function runOneCheckIn(userName,password) {
    /*  登录 */
  
    /* 获取baby列表 */
  
  }
  
  function login(userName,password,babyID) {
    
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