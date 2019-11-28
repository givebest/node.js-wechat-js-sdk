var express = require('express');
var router = express.Router();
var path = require('path');
const axios = require('axios');
const jsonfile = require('jsonfile');
const sign = require('../../libs/wechat-sign.js')



/* let token = '22_TEissQnQi4G1tbiKXT8r1FNnNS6xSPs1Hz8x1Sp2BsTAAcK4hsPaZ0AUpyr-sSs0PAGr69wYSdRLsGGLrsayyiWHlN_jVx-RCZ7-5el_xz09djrqfRibWUn9TZdHurPyWv0zf6L95yUJbR3jHIBbAJAQRK'

let ticket = 'sM4AOVdWfPE4DxkXGEs8VNP-U4K55fbRJ280WPVKdS7k-szNhwioRPgeVsYA-gRB0x-odQgtxldJ-DJyqiaFXg' */

// console.log('getToken', getToken)

const wechatConfig = require('../../config/wechat');
const cacheConfig = require('../../config/cache');
const cacheConfigFile = path.join(__dirname, '../../config/cache.json')

let cacheJSON = {
  time:"",
  token:"",
  ticket: ""
}

let expiresIn = (wechatConfig.expiresIn || 7200) * 1000;
let tokenTime = cacheConfig.time || 0;
let nowTime = Date.now();

cacheJSON.time = nowTime;

if ((nowTime - tokenTime) >= expiresIn) {

  // 1. 获取 access token
  axios({
    method: 'GET',
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    params: {
      'grant_type': 'client_credential',
      appid: wechatConfig.appid,
      secret: wechatConfig.secret
    }
  }).then(resToken => {
    let tokenData = resToken.data || {}
    let accessToken = tokenData.access_token
    cacheJSON.token = accessToken

  // 2. 获取 ticket
    axios({
      method: 'GET',
      url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
      params: {
        access_token: accessToken,
        type: 'jsapi'
      }
    }).then(resTicket => {
      let ticketData = resTicket.data || {}
      let ticket = ticketData.ticket
      cacheJSON.ticket = ticket

      // 缓存数据
      jsonfile.writeFile(cacheConfigFile, cacheJSON, function (err) {
        if (err) console.error(err)
      });

  // 3. 签名
      router.get('/', function(req, res, next) {
        let url = req.query.url
        let signature = sign(ticket, url);
        signature.appId = wechatConfig.appid
        res.json(signature)
      });

    });

  }).catch(err => {
    console.log(err)
  });
} else {
  // 缓存读取
  router.get('/', function(req, res, next) {
    let url = req.query.url || 'http://fu8ibf.natappfree.cc/'
    let signature = sign(cacheConfig.ticket, url);
    signature.appId = wechatConfig.appid
    res.json(signature)
  });

}

module.exports = router;
