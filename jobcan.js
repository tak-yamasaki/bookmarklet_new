'use strict';
{
  const URL = 'https://ssl.jobcan.jp/employee';
  try {
    if (location.href === URL) {
      const OFFICE_IP = ["143.189.211.55", "121.1.250.102"];

      // VercelのAPIを呼び出す
      fetch("https://million-yamasaki-youtube-api.vercel.app/api/getIpInfo")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`APIサーバーからの応答エラー: ${response.statusText}`);
          }
          return response.json();
        })
        .then((jsonResponse) => {
          let target = document.getElementById('notice_value');
          let yourIp = jsonResponse.ip;
          let status;

          if (OFFICE_IP.indexOf(yourIp) == '-1') {
            status = '在宅';
          } else {
            status = '出社';
          }

          // 備考欄にステータスをセット
          target.value = status;
          console.log(`本日は${status}です。打刻を実行します。`);
          // alert(`本日は${status}です。\n今日も1日宜しくお願い致します。`);
          const buttonIdToClick = 'adit-button-push';

          const buttonToClick = document.getElementById(buttonIdToClick);

          if (buttonToClick) {
            // ボタンが存在すればクリック
            buttonToClick.click();
          } else {
            // ボタンが見つからない場合のエラー処理
            console.error(`打刻ボタン（ID: ${buttonIdToClick}）が見つかりません。`);
            alert(`ステータス「${status}」をセットしましたが、打刻ボタン（ID: ${buttonIdToClick}）が見つかりませんでした。`);
          }
        })
        .catch((error) => {
          console.error('IP情報の取得または打刻処理に失敗しました:', error);
          alert('IP情報の取得または打刻処理に失敗しました。\nネットワーク接続を確認するか、管理者に連絡してください。');
        });

    } else {
      throw new Error('打刻ページで実行してください');
    }
  } catch (e) {
    alert(e);
  }
}