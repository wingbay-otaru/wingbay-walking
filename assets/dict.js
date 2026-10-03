// 画面に表示する文言の辞書。
// 言語を追加・修正したいときは、このファイルだけを編集してください。
//
// 対応言語は日本語(ja)と英語(en)のみ。言語を増やすときは、ここに辞書を追加したうえで、
// start.html と goal.html の言語選択（select）にも選択肢を足してください。

window.WB_DICT = {
  ja: {
    camera_tip: '※ LINEアプリの中のカメラではなく、スマートフォン本体の「カメラ」アプリで読み取ってください。',
    start_checking: '確認しています…',
    start_new: '開始しました！（{time}）\n好きなコースを歩いて、コース地点のQRコードを読み取ってください。',
    start_already: '本日はすでに {time} に開始済みです。\n好きなコースを歩いて、コース地点のQRコードを読み取ってください。',
    start_token_expired: 'QRコードの有効期限が切れました。インフォメーションのQRコードをもう一度読み取ってください。',
    start_disabled: '本日はウォーキングの受付を休止しています。インフォメーションにお尋ねください。',
    start_error: '通信に失敗しました。電波の良い場所でもう一度お試しください。',
    finish_success: '{course} 達成しました！おめでとうございます🎉\n下のボタンからポイントを受け取ってください。',
    finish_button: 'ポイントを受け取る',
    finish_already_completed: '本日はすでに達成済みです。また明日お越しください！',
    finish_too_fast: '{course}の最短所要時間は{min}分です。あと{remain}分ほど歩いてから、インフォメーションのQRコードをもう一度読み取ってください。',
    finish_too_slow: '開始から時間が経ちすぎています。インフォメーションで開始QRコードを読み取り直してください。',
    goal_checking: '確認しています…',
    turn_success: '{course}のコース地点を通過しました！\nインフォメーションに戻って、最初と同じQRコードをもう一度読み取ってください。',
    turn_already_turned: 'すでに{course}のコース地点を通過済みです。\nインフォメーションに戻って、最初と同じQRコードを読み取ってください。',
    turn_not_started: '先にインフォメーションの開始QRコードを読み取ってから、コースを歩いてください。\n（別のアプリ・ブラウザで読み取った場合もこの表示になります）',
    turn_already_done: '本日はすでに達成済みです。また明日お越しください！',
    turn_bad_course: 'コースの情報が正しく読み取れませんでした。QRコードを読み取り直してください。',
    turn_disabled: '本日はウォーキングの受付を休止しています。インフォメーションにお尋ねください。',
    turn_error: '通信に失敗しました。電波の良い場所でもう一度お試しください。',
    kiosk_reconnecting: '再接続中…',
    lang_label: '言語'
  },
  en: {
    camera_tip: "Please scan with your phone's standard Camera app, not the camera inside the LINE app.",
    start_checking: 'Checking...',
    start_new: 'Started! ({time})\nPlease walk your chosen course and scan the QR code at the turnaround point.',
    start_already: 'You already started today at {time}.\nPlease walk your chosen course and scan the QR code at the turnaround point.',
    start_token_expired: 'This QR code has expired. Please scan the QR code at the information counter again.',
    start_disabled: 'Walking check-in is currently paused. Please ask at the information counter.',
    start_error: 'Connection failed. Please try again where the signal is stronger.',
    finish_success: 'Course {course} complete! Congratulations🎉\nTap the button below to receive your point.',
    finish_button: 'Get my point',
    finish_already_completed: "You have already completed today's walk. Please come again tomorrow!",
    finish_too_fast: 'The minimum time for {course} is {min} minutes. Please keep walking for about {remain} more minutes, then scan the information QR code again.',
    finish_too_slow: 'Too much time has passed since you started. Please scan the start QR code again at the information counter.',
    goal_checking: 'Checking...',
    turn_success: 'You passed the turnaround point for course {course}!\nPlease go back to the information counter and scan the same QR code again.',
    turn_already_turned: 'You already passed the turnaround point for course {course}.\nPlease go back to the information counter and scan the same QR code again.',
    turn_not_started: 'Please scan the start QR code at the information counter first, then walk the course.\n(This also appears if you scanned with a different app/browser.)',
    turn_already_done: "You have already completed today's walk. Please come again tomorrow!",
    turn_bad_course: 'The course information could not be read. Please scan the QR code again.',
    turn_disabled: 'Walking check-in is currently paused. Please ask at the information counter.',
    turn_error: 'Connection failed. Please try again where the signal is stronger.',
    kiosk_reconnecting: 'Reconnecting...',
    lang_label: 'Language'
  }
};

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

// インフォメーションのQR（start.html）は、1回目は「開始」、2回目（折り返し済みの場合）は
// 「ゴール判定」として扱う。json.phase が 'finish' のときはゴール判定の結果。
function renderStartMessage(json) {
  if (json.ok) {
    if (json.phase === 'finish') {
      return t('finish_success', { course: json.courseName });
    }
    return json.alreadyStarted
      ? t('start_already', { time: json.startedAt })
      : t('start_new', { time: json.startedAt });
  }
  switch (json.reason) {
    case 'disabled': return t('start_disabled');
    case 'token_expired': return t('start_token_expired');
    case 'already_completed': return t('finish_already_completed');
    case 'too_fast': return t('finish_too_fast', {
      course: json.courseName, min: json.minMinutes, remain: json.remainMinutes
    });
    case 'too_slow': return t('finish_too_slow');
    default: return t('start_error');
  }
}

// 折り返し地点の固定QR（goal.html）を読んだときの表示。
// ここではポイントは出ず、折り返し通過の確認とインフォメーションへの案内のみ。
function renderGoalMessage(json) {
  if (json.ok) {
    return json.alreadyTurned
      ? t('turn_already_turned', { course: json.courseName })
      : t('turn_success', { course: json.courseName });
  }
  switch (json.reason) {
    case 'disabled': return t('turn_disabled');
    case 'not_started': return t('turn_not_started');
    case 'already_completed': return t('turn_already_done');
    case 'bad_course': return t('turn_bad_course');
    default: return t('turn_error');
  }
}
