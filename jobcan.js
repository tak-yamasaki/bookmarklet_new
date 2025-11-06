'use strict';
{
  const URL = 'https://ssl.jobcan.jp/employee';
  try {
    if (location.href === URL) {
      const OFFICE_IP = ["143.189.211.55", "121.1.250.102"];

      // ▼▼▼ ここを修正 ▼▼▼
      // ipinfo.io ではなく、作成したVercelのAPIを呼び出す
      fetch("https://million-yamasaki-youtube-api.vercel.app/api/getIpInfo")
        .then((response) => {
          // fetchが成功したかチェック（CORSエラーや404などもここで検知）
          if (!response.ok) {
            throw new Error(`APIサーバーからの応答エラー: ${response.statusText}`);
          }
          return response.json();
        })
        .then((jsonResponse) => {
          // ▼▼▼ ここから下は元のコードと同じ ▼▼▼
          let target = document.getElementById('notice_value');
          let yourIp = jsonResponse.ip; // Vercel経由でも同じ形式でIPが返る
          let status;

          if (OFFICE_IP.indexOf(yourIp) == '-1') {
            status = '在宅';
          } else {
            status = '出社';
          }
          alert(`本日は${status}です。\n今日も1日宜しくお願い致します。`);
          target.value = status;
        })
        .catch((error) => {
          // fetchが失敗した場合のエラー処理（ネットワークエラーや、↑で投げたエラー）
          console.error('IP情報の取得に失敗しました:', error);
          alert('IP情報の取得に失敗しました。\nネットワーク接続を確認するか、管理者に連絡してください。');
        });
      // ▲▲▲ ここまで修正 ▲▲▲

    } else {
      throw new Error('打刻ページで実行してください');
    }
  } catch (e) {
    alert(e);
  }
}