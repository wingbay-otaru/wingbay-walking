// 端末識別用のランダムID（ブラウザのlocalStorageに保存）
// 開始QRを読んだときとゴールQRを読んだときに「同じ端末か」を判定するために使う。

function wbGenerateUuid_() {
  if (window.crypto && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // 古いブラウザ向けフォールバック
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getOrCreateDeviceId() {
  try {
    var id = localStorage.getItem('wb_device_id');
    if (!id) {
      id = wbGenerateUuid_();
      localStorage.setItem('wb_device_id', id);
    }
    return id;
  } catch (e) {
    // localStorageが使えない場合（プライベートブラウズ等）は毎回使い捨てIDになる。
    // この場合、開始とゴールの端末一致判定ができないため「not_started」として扱われる。
    return wbGenerateUuid_();
  }
}
