// Apps Scriptとの通信。
// POSTは Content-Type: text/plain で送る（Apps Script側のCORS制限を避けるための定番手法）。

async function callApi(action, payload) {
  var url = window.WB_CONFIG.APPS_SCRIPT_URL;
  var body = Object.assign({ action: action }, payload);
  var res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function getKioskToken(adminKey) {
  var base = window.WB_CONFIG.APPS_SCRIPT_URL;
  var res = await fetch(base + '?action=kioskToken&key=' + encodeURIComponent(adminKey));
  return res.json();
}
