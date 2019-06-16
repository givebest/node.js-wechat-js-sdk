# Node.js Wechat JS-SDK

使用 Node.js + Express.js 获取微信签名，使用 Ngrok 内网穿透，完成 JS-SDK 配置，实现微信自定义分享等功能。

----

## 使用

### 1. 完善微信配置文件。

> 路径：./config/wechat.js

```js
const wechatConfig = {
  domain: 'http://wwww.natappfree.cc/',
  expiresIn: 7200,
  appid: '',
  secret: ''
}

module.exports = wechatConfig
```

### 2. 安装

```bash
npm install
```

### 3. 运行

```bash
npm start
```

## 后端

### 1. 使用 Ngrok 内网穿透，获得临时域名。

* ngrok.com，国外服务，推荐，只要注册就可以使用。
* natapp.cn，国内服务，必须实名认证才能使用。

### 2. 申请微信公众号测试号。

> https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index

### 3. 设置 JS 接口安全域名

> 先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。

### 4. 获取 access_token

#### 官方资料

* 文档：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
* 官方在线测试：https://mp.weixin.qq.com/debug/

#### 接口调用请求

```
https请求方式: GET

https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
```

#### 响应

```json
{"access_token":"ACCESS_TOKEN","expires_in":7200}
```


### 5. 获取 jsapi_ticket

#### 官方资料

* 文档：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115


#### 请求

```
https请求方式: GET

https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=&type=jsapi
```


#### 响应

```json
{
"errcode":0,
"errmsg":"ok",
"ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
"expires_in":7200
}
```


### 6. 签名算法

* 文档：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
* 微信 JS 接口签名校验工具：https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign


```json
// 步骤1
sha1(jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=http://mp.weixin.qq.com?params=value)

// 签名结果
0f9de62fce790f9a083d5c99e95740ceb90c27ed
```

## 前端

* 文档：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115


### 1. 引入 JS

> http://res.wx.qq.com/open/js/jweixin-1.4.0.js

### 2. 通过config接口注入权限验证配置

```js
wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名
    jsApiList: [] // 必填，需要使用的JS接口列表
})
```

### 3. 通过ready接口处理成功验证

```js
wx.ready(function(){
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
});
```

### 4. 通过error接口处理失败验证

```js
wx.error(function(res){
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
});
```

## License

[MIT](./LICENSE) © 2019 [givebest](https://github.com/givebest)






