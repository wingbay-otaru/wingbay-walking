// 画面に表示する文言の辞書。
// 言語を追加・修正したいときは、このファイルだけを編集してください。
//
// 注意：th（タイ語）・zh（中国語）は、まだ正式な翻訳が入っていません（日本語のコピーです）。
// 実際の運用前に、正しい翻訳に差し替えることをおすすめします。

window.WB_DICT = {
  ja: {
    camera_tip: '※ LINEアプリの中のカメラではなく、スマートフォン本体の「カメラ」アプリで読み取ってください。',
    start_checking: '確認しています…',
    start_new: '開始しました！（{time}）\n好きなコースを歩いて、ゴール地点のQRコードを読み取ってください。',
    start_already: '本日はすでに {time} に開始済みです。\n好きなコースを歩いて、ゴール地点のQRコードを読み取ってください。',
    start_token_expired: 'QRコードの有効期限が切れました。インフォメーションのQRコードをもう一度読み取ってください。',
    start_disabled: '本日はウォーキングの受付を休止しています。インフォメーションにお尋ねください。',
    start_error: '通信に失敗しました。電波の良い場所でもう一度お試しください。',
    goal_checking: '確認しています…',
    goal_success: '{course} 達成しました！おめでとうございます🎉\n下のボタンからポイントを受け取ってください。',
    goal_button: 'ポイントを受け取る',
    goal_not_started: '先にインフォメーションの開始QRコードを読み取ってから、コースを歩いてください。\n（別のアプリ・ブラウザで読み取った場合もこの表示になります）',
    goal_too_fast: '{course}の最短所要時間は{min}分です。あと{remain}分ほど歩いてから、もう一度QRコードを読み取ってください。',
    goal_too_slow: '開始から時間が経ちすぎています。インフォメーションで開始QRコードを読み取り直してください。',
    goal_already_done: '本日はすでに達成済みです。また明日お越しください！',
    goal_disabled: '本日はウォーキングの受付を休止しています。インフォメーションにお尋ねください。',
    goal_error: '通信に失敗しました。電波の良い場所でもう一度お試しください。',
    kiosk_reconnecting: '再接続中…',
    lang_label: '言語'
  },
  en: {
    camera_tip: "Please scan with your phone's standard Camera app, not the camera inside the LINE app.",
    start_checking: 'Checking...',
    start_new: 'Started! ({time})\nPlease walk your chosen course and scan the QR code at the goal.',
    start_already: 'You already started today at {time}.\nPlease walk your chosen course and scan the QR code at the goal.',
    start_token_expired: 'This QR code has expired. Please scan the QR code at the information counter again.',
    start_disabled: 'Walking check-in is currently paused. Please ask at the information counter.',
    start_error: 'Connection failed. Please try again where the signal is stronger.',
    goal_checking: 'Checking...',
    goal_success: 'Course {course} complete! Congratulations🎉\nTap the button below to receive your point.',
    goal_button: 'Get my point',
    goal_not_started: 'Please scan the start QR code at the information counter first, then walk the course.\n(This also appears if you scanned with a different app/browser.)',
    goal_too_fast: 'The minimum time for {course} is {min} minutes. Please keep walking for about {remain} more minutes, then scan again.',
    goal_too_slow: 'Too much time has passed since you started. Please scan the start QR code again at the information counter.',
    goal_already_done: "You have already completed today's walk. Please come again tomorrow!",
    goal_disabled: 'Walking check-in is currently paused. Please ask at the information counter.',
    goal_error: 'Connection failed. Please try again where the signal is stronger.',
    kiosk_reconnecting: 'Reconnecting...',
    lang_label: 'Language'
  }
};

// タイ語・中国語は未翻訳のため、暫定的に日本語をコピーしておく（画面が空白にならないようにするため）
window.WB_DICT.th = window.WB_DICT.th || window.WB_DICT.ja;
window.WB_DICT.zh = window.WB_DICT.zh || window.WB_DICT.ja;

function t(key, vars) {
  var lang = 'ja';
  try { lang = localStorage.getItem('wb_lang') || 'ja'; } catch (e) {}
  var dict = window.WB_DICT[lang] || window.WB_DICT.ja;
  var str = dict[key] || window.WB_DICT.ja[key] || key;
  if (vars) {
    Object.keys(vars).forEach(function (k) {
      str = str.split('{' + k + '}').join(vars[k]);
    });
  }
  return str;
}

// サーバーの応答（reasonコード）を、選択中の言語の文言に変換する。
// サーバーが返す message はログ用の日本語そのままなので、画面表示には使わない。

function renderStartMessage(json) {
  if (json.ok) {
    return json.alreadyStarted
      ? t('start_already', { time: json.startedAt })
      : t('start_new', { time: json.startedAt });
  }
  switch (json.reason) {
    case 'disabled': return t('start_disabled');
    case 'token_expired': return t('start_token_expired');
    default: return t('start_error');
  }
}

function renderGoalMessage(json) {
  if (json.ok) {
    return t('goal_success', { course: json.courseName });
  }
  switch (json.reason) {
    case 'disabled': return t('goal_disabled');
    case 'not_started': return t('goal_not_started');
    case 'already_completed': return t('goal_already_done');
    case 'too_fast': return t('goal_too_fast', {
      course: json.courseName, min: json.minMinutes, remain: json.remainMinutes
    });
    case 'too_slow': return t('goal_too_slow');
    default: return t('goal_error');
  }
}
