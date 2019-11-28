// 根据 ID 获取元素
function $(ele) {
  return document.getElementById(ele)
}


// 分享
init(function(actions) {
  if (actions === "error") {
    // 失败处理
    return;
  }

  console.log("use actions", actions);

  // 分享
  actions.share({
    title: "自定义标题",
    desc: "自定义描述",
    link: window.location.href,
    imgUrl: "http://84iumr.natappfree.cc/images/logo.jpg",
    success: () => {
      console.log("分享成功");
    }
  });

  $('list').addEventListener('click', function (e) {
    let  target = e.target

    // 自定义分享
    if (target.id === 'customizeShare') {
      alert('已经初始化，在微信里打开分享试下。')
      return
    }

    // 扫码
    if (target.id === 'scanQR') {
      actions.scanQRCode({
        success: res => {
          console.log('scan success', res)
          // alert(JSON.stringify(res))
          $('htmlStr').innerHTML = res
        },
        complate: res => {
          console.log('scan complate', res)
          // alert(JSON.stringify(res))
        }
      })

      return
    }

  }, false)

});
