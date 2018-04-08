export function searchAirports(params, cbDone) {
  const url = 'http://127.0.0.1:8080/Flight/data/airports'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

function callService(url, {
  cbDone = function () {},
  cbAlways = function () {},
  cbFail = function () {},
  type = 'post',
  dataType = 'json',
  data = null,
  contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
}) {
  $.ajax({
    type: type,
    url: url,
    dataType: dataType,
    data: data,
    contentType: contentType,
    timeout: 10000
  }).done(function (jsonResult) {
    cbDone(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status === 403) {
      window.alert('您没有相关授权，或者可以退出系统后重新登录，再试一次！(403)')
    } else {
      cbFail()
    }
  }).always(function () {
    // console.log(window)
    cbAlways()
  })
}