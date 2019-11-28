/**
 * 初始化
 * @param {Function} callback
 */
function init (callback) {
  let url = window.location.href.split("#")[0]

  console.log("wx init", url);

  getSignature({
    url
  }).then(res => {
    res = res || {};
    let data = res.data || {};

    config(data);

    wx.ready(() => {
      callback && callback(actions);
    })

    wx.error(() => {
      callback && callback('error')
    })

  })
}

/**
 * 通过config接口注入权限验证配置
 * @param {Object} params
 */
function config (params = {}) {
  wx.config({
      debug: params.debug || true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: params.appId || '', // 必填，公众号的唯一标识
      timestamp: params.timestamp || '', // 必填，生成签名的时间戳
      nonceStr: params.nonceStr || '', // 必填，生成签名的随机串
      signature: params.signature || '',// 必填，签名
      jsApiList: [
        // 'updateAppMessageShareData',
        // 'onMenuShareTimeLine',
        'onMenuShareAppMessage',
        // 'onMenuShareQQ',
        // 'chooseWXPay',
        'scanQRCode'
      ] // 必填，需要使用的JS接口列表
  })
}

/**
 * 获取签名
 * @param {Object} params
 */
async function getSignature(params = {}) {
  return await axios({
    method: "GET",
    url: "/wechat/signature",
    params,
    headers: {
      'Cache-Control': 'no-cache'
    }
  })
}

/**
 * 微信接口
 * @param {Object} params
 */
const actions = {
  // 自定义分享
  share: function(params = {}) {
    let data = {
      title: params.title, // 标题
      desc: params.desc, // 描述
      link: params.link, // 链接
      imgUrl: params.imgUrl, // 图片
      success: res => {
        // 设置成功 / 用户点击了分享后执行的回调函数
        params.success && params.success(res);
      },
      fail: res => {
        // 接口调用失败时执行的回调函数
        params.fail && params.fail(res);
      }
    };

    console.log("actions share");

    // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
    // wx.updateAppMessageShareData(data);

    // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
    // wx.updateTimelineShareData(data);

    // 分享到朋友圈/微信朋友/QQ（即将废弃）
    // wx.onMenuShareTimeline(data);
    wx.onMenuShareAppMessage(data);
    // wx.onMenuShareQQ(data);
  },
  // 支付
  pay: function(params = {}) {
    wx.chooseWXPay({
      timestamp: params.timestamp,
      nonceStr: params.nonceStr,
      package: params.package,
      signType: params.signType,
      success: function(res) {
        params.success && params.success(res);
      },
      fail: res => {
        params.fail && params.fail(res);
      }
    });
  },
  // 扫一扫
  scanQRCode: (params = {}) => {
    wx.scanQRCode({
      needResult: 1,
      success: (res = {}) => {
        // console.log(JSON.stringify(res))
        params.success && params.success(res.resultStr);
      },
      complete: res => {
        // console.log('complete', JSON.stringify(res))
        alert('complete: ' + JSON.stringify(res))
        params.complete && params.complete(res)
      }
    })
  }
};
