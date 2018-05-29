
 function meituanSignInAttendance(userName,password,babyID) {
    var request = require('sync-request');
    let url = "https://signin-qianbao.meituan.com/si/signIn/attendance";
    var res = request('POST', url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E216 TitansX/11.4.7 KNB/1.2.0 iOS/11.3 meituangroup/com.meituan.imeituan/9.0.0 meituangroup/9.0.0',
        'cookie':'token=7FTRil4lqHZEu8QYt42Fq9rX7QwAAAAA8AUAAKVuk1i29Z1NPaFLPQ2VJjkQyLEFskxR_k1knkI5VlufB5Shvzhq1aw_M3DKl7rB2Q; uuid=B7639C66FAFD62E753858490426B16768634B648D77BD36750D2D0D29EACE813;'
      },
      body:
        'token=7FTRil4lqHZEu8QYt42Fq9rX7QwAAAAA8AUAAKVuk1i29Z1NPaFLPQ2VJjkQyLEFskxR_k1knkI5VlufB5Shvzhq1aw_M3DKl7rB2Q'
    });
    // console.log(res.headers);
    var user = JSON.parse(res.getBody('utf8'));
    // console.log(res.getBody('utf8'));
    return user;


}

  exports.meituanSignInAttendance = meituanSignInAttendance;