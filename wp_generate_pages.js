javascript: (function () {
  if (document.getElementById('wp-tools-ui')) return;

  // CSSリセット
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css';
  document.head.appendChild(link);

  // UI作成
  var ui = document.createElement('div');
  ui.id = 'wp-tools-ui';
  ui.style = 'position:fixed;top:10px;right:10px;z-index:99999;background:#fff;padding:10px;border:1px solid #000;max-width:450px;overflow:auto;font-family:sans-serif;';
  ui.innerHTML = `
<h3 style="margin-bottom:1em;">WordPress 固定ページ作成ツール</h3>

<div style="margin-bottom:10px;padding:6px;background:#f9f9f9;border:1px solid #ddd;">
<strong>Excel入力ルール</strong><br>
A列: ページタイトル<span style="color:#f00;font-size:70%;">（必須）</span><br>
B列: スラッグ<br>
C列: 順序<br>
※入力欄で調整可
</div>

<label style="font-size: 90%; display: block; margin-bottom:5px; margin:10px auto;">WordPressユーザー名:</label>
<input type="text" id="wpUsername" placeholder="WordPressのログインユーザー名" style="width:48%;margin-bottom:10px;" />
<input type="text" id="wpAppPassword" placeholder="アプリケーションパスワード" style="width:48%;" /><br><br>

<input type="file" id="excelFile" accept=".xlsx,.xls" /><br><br>

<div id="pageList" style="margin-top:5px;max-height:250px;overflow:auto;"></div>
<button id="createPages">作成</button>
<div id="results" style="margin-top:10px;color:green;"></div>
`;

  document.body.appendChild(ui);

  // XLSX読み込み
  var dataRows = [];

  function loadXLSX(url, callback) {
    var s = document.createElement('script');
    s.src = url;
    s.onload = callback;
    document.head.appendChild(s);
  }

  loadXLSX('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', function () {
    document.getElementById('excelFile').onchange = function (e) {
      var f = e.target.files[0];
      if (!f) {
        alert('ファイルを選択してください');
        return;
      }
      var r = new FileReader();
      r.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var wb = XLSX.read(data, {
          type: 'array'
        });
        var ws = wb.Sheets[wb.SheetNames[0]];
        var json = XLSX.utils.sheet_to_json(ws, {
          header: 1
        });
        dataRows = json.map((r, i) => ({
          title: r[0] || '',
          slug: r[1] || '',
          order: parseInt(r[2] || i + 1)
        }));

        var ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';
        ul.style.margin = '0';
        ul.style.maxHeight = '200px';
        ul.style.overflowY = 'auto';
        ul.style.borderTop = '1px solid #ddd';

        dataRows.forEach((r, i) => {
          var li = document.createElement('li');
          li.style.padding = '6px 0';
          li.style.borderBottom = '1px solid #eee';
          li.innerHTML = `
          <input type="text" class="title-input" value="${r.title}" style="width:45%" placeholder="タイトル" />
          <input type="text" class="slug-input" value="${r.slug}" style="width:35%" placeholder="スラッグ" />
          <input type="number" class="order-input" value="${r.order}" style="width:15%" placeholder="順序" />
        `;
          ul.appendChild(li);
        });

        document.getElementById('pageList').innerHTML = '';
        document.getElementById('pageList').appendChild(ul);
      };
      r.readAsArrayBuffer(f);
    };
  });

  document.getElementById('createPages').onclick = async function () {
    if (!dataRows.length) {
      alert('先にExcelを読み込んでください');
      return;
    }

    // wpサイトURLを取得
    var wpRestUrl;
    if (location.pathname.includes('/wp-admin/')) {
      wpRestUrl = location.origin + location.pathname.split('/wp-admin/')[0];
    } else if (location.pathname.includes('/wp-json/')) {
      wpRestUrl = location.origin + location.pathname.split('/wp-json/')[0];
    } else {
      wpRestUrl = location.origin + location.pathname.split('/')[0] + '/ogoshi-dental.com';
    }
    wpRestUrl = wpRestUrl.replace(/\/$/, '');
    var username = document.getElementById('wpUsername').value.trim();
    var appPassword = document.getElementById('wpAppPassword').value.trim().replace(/\s/g, '');

    if (!wpRestUrl || !username || !appPassword) {
      alert('サイトURL、ユーザー名、アプリパスワードを入力してください');
      return;
    }

    // Excel入力を反映
    var lis = document.querySelectorAll('#pageList li');
    dataRows.forEach((r, i) => {
      r.title = lis[i].querySelector('.title-input').value;
      r.slug = lis[i].querySelector('.slug-input').value;
      r.order = parseInt(lis[i].querySelector('.order-input').value) || (i + 1);
    });

    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '作成中...<br>';

    try {
      let res = await fetch('https://milliondream.sakura.ne.jp/wp-admin-tools/tools.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wp_rest_url: wpRestUrl,
          username: username,
          app_password: appPassword,
          pages: dataRows
        })
      });

      let json = await res.json();

      resultsDiv.innerHTML = '';
      json.result.forEach(r => {
        if (r.status === 'success') {
          resultsDiv.innerHTML += `<span style="color:green">作成: ${r.title} (ID:${r.page_id})</span><br>`;
        }
      });

      const hasError = json.result.some(r => r.status !== 'success');
      if (hasError) {
        resultsDiv.innerHTML += `<span style="color:red;">入力項目に誤りがあります。<br>サイトアドレス(URL)、ユーザー名、パスワードを<br>確認してください。</span>`;
      } else {
        resultsDiv.innerHTML += '<br>完了！';
        setTimeout(() => location.reload(), 2000);
      }

    } catch (e) {
      resultsDiv.innerHTML = `<span style="color:red">通信エラー: ${e.message}</span>`;
      console.error(e);
    }
  };
})();