javascript:(function () {
  /* --------------------------------------------------
     設定: WordPress REST APIの準備確認
  -------------------------------------------------- */
  if (typeof wpApiSettings === 'undefined' || !wpApiSettings.nonce) {
    alert('エラー: REST APIのコンテキストが見つかりません。\nWordPress管理画面（ダッシュボードや固定ページ一覧など）で実行してください。');
    return;
  }

  /* --------------------------------------------------
     UIの初期化 (二重起動防止)
  -------------------------------------------------- */
  if (document.getElementById('wp-tools-ui')) return;

  // CSSリセット
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css';
  document.head.appendChild(link);

  // UI作成
  var ui = document.createElement('div');
  ui.id = 'wp-tools-ui';
  ui.style = 'position:fixed;top:10px;right:10px;z-index:99999;background:#fff;padding:10px;border:1px solid #000;max-width:480px;box-shadow:0 4px 10px rgba(0,0,0,0.2);overflow:auto;font-family:sans-serif;font-size:12px;';

  ui.innerHTML = `
    <h3 style="margin-bottom:1em;font-size:14px;font-weight:bold;">WP 固定ページ一括作成 (REST API版) <span id="toolStatus" style="font-size:80%;font-weight:normal;"></span></h3>
    <div style="margin-bottom:10px;padding:6px;background:#f9f9f9;border:1px solid #ddd;">
      <strong>Excel入力ルール</strong><br>
      A列: タイトル<span style="color:#f00;">*</span> | B列: スラッグ | C列: 順序
    </div>
    <input type="file" id="excelFile" accept=".xlsx,.xls" /><br>
    <div style="margin:10px 0;">
      <button id="addPage" style="padding: 5px 10px; cursor: pointer;">＋ 行を追加</button>
    </div>
    <div id="pageList" style="margin-top:5px;max-height:250px;overflow:auto;"></div>
    <div style="margin-top:10px;">
      <button id="createPages" style="padding: 8px 15px; background: #0073aa; color: #fff; border: none; cursor: pointer;">作成実行</button>
      <button id="resetTool" style="margin-left:5px;padding: 8px 15px; background: #6c757d; color: #fff; border: none; cursor: pointer;">リセット</button>
      <button id="closeTool" style="float:right;padding: 8px; background: transparent; border: none; cursor: pointer; color:#999;">✕</button>
    </div>
    <div id="results" style="margin-top:10px;padding-top:10px;border-top:1px solid #eee;font-size:12px;line-height:1.4;"></div>
  `;

  document.body.appendChild(ui);

  /* --------------------------------------------------
     変数・UI操作ロジック
  -------------------------------------------------- */
  var dataRows = [];
  var ulContainer = document.createElement('ul');
  var resultsDiv = document.getElementById('results');

  ulContainer.style.listStyle = 'none';
  ulContainer.style.padding = '0';
  ulContainer.style.margin = '0';
  ulContainer.style.borderTop = '1px solid #ddd';
  document.getElementById('pageList').appendChild(ulContainer);

  // ツール状態表示（API接続確認）
  var statusDiv = document.getElementById('toolStatus');
  statusDiv.innerHTML = '<span style="color:green;font-weight:bold;">● API接続OK</span>';

  // 行生成
  function createListItem(r) {
    var li = document.createElement('li');
    li.style.padding = '6px 0';
    li.style.borderBottom = '1px solid #eee';
    li.style.display = 'flex';
    li.style.gap = '5px';
    li.innerHTML = `
      <input type="text" class="title-input" value="${r.title}" style="flex:2;padding:3px;" placeholder="タイトル" />
      <input type="text" class="slug-input" value="${r.slug}" style="flex:2;padding:3px;" placeholder="スラッグ" />
      <input type="number" class="order-input" value="${r.order}" style="width:50px;padding:3px;" placeholder="順" />
      <button class="delete-row" style="width:40px;background: #f44336; color: white; border: none; cursor: pointer;">削除</button>
    `;
    return li;
  }

  function redrawPageList() {
    ulContainer.innerHTML = '';
    dataRows.forEach(r => {
      ulContainer.appendChild(createListItem(r));
    });
  }

  function updateDataRowsFromDOM() {
    var lis = ulContainer.querySelectorAll('li');
    dataRows = Array.from(lis).map(li => {
      return {
        title: li.querySelector('.title-input').value,
        slug: li.querySelector('.slug-input').value,
        order: parseInt(li.querySelector('.order-input').value) || 0
      };
    }).filter(r => r.title.trim() !== '');
  }

  function addNewPageRow(title = '', slug = '', order) {
    updateDataRowsFromDOM();
    if (order === undefined) {
      const currentOrders = dataRows.map(r => r.order || 0);
      const maxOrder = currentOrders.length > 0 ? Math.max(...currentOrders) : 0;
      order = maxOrder + 1;
    }
    const newRow = {title: title, slug: slug, order: order};
    dataRows.push(newRow);
    ulContainer.appendChild(createListItem(newRow));
    ulContainer.scrollTop = ulContainer.scrollHeight;
  }

  /* --------------------------------------------------
     Excel読み込み処理 (SheetJS)
  -------------------------------------------------- */
  function loadXLSX(url, callback) {
    if (typeof XLSX !== 'undefined') {
      callback();
      return;
    }
    var s = document.createElement('script');
    s.src = url;
    s.onload = callback;
    document.head.appendChild(s);
  }

  loadXLSX('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', function () {
    document.getElementById('excelFile').onchange = function (e) {
      var f = e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var wb = XLSX.read(data, {type: 'array'});
        var ws = wb.Sheets[wb.SheetNames[0]];
        var json = XLSX.utils.sheet_to_json(ws, {header: 1});

        // Excelパース
        dataRows = json
          .filter(row => row[0]) // A列があるものだけ
          .map((r, i) => ({
            title: r[0] || '',
            slug: r[1] || '',
            order: parseInt(r[2]) || (i + 1)
          }));
        redrawPageList();
        resultsDiv.innerHTML = '<span style="color:#666;">ファイルを読み込みました。内容を確認して「作成実行」を押してください。</span>';
      };
      r.readAsArrayBuffer(f);
    };
  });

  /* --------------------------------------------------
     イベントリスナー
  -------------------------------------------------- */
  document.getElementById('addPage').onclick = function () {
    addNewPageRow();
  };

  document.getElementById('pageList').addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-row')) {
      e.target.closest('li').remove();
      updateDataRowsFromDOM();
    }
  });

  document.getElementById('resetTool').onclick = function () {
    if (confirm('入力をリセットしますか？')) {
      dataRows = [];
      ulContainer.innerHTML = '';
      document.getElementById('excelFile').value = '';
      resultsDiv.innerHTML = '';
    }
  };

  document.getElementById('closeTool').onclick = function () {
    document.body.removeChild(ui);
  };

  /* --------------------------------------------------
     メイン処理: REST APIでの作成
  -------------------------------------------------- */
  document.getElementById('createPages').onclick = async function () {
    updateDataRowsFromDOM();

    if (dataRows.length === 0) {
      alert('作成するページデータがありません。');
      return;
    }

    if (!confirm(dataRows.length + ' 件のページを作成しますか？')) return;

    resultsDiv.innerHTML = '<b>処理を開始します...</b><br>';
    var successCount = 0;
    var failCount = 0;

    // REST API ルート
    const apiRoot = wpApiSettings.root + 'wp/v2/pages';

    // 1件ずつ処理
    for (const page of dataRows) {
      // 送信データ構築
      const payload = {
        title: page.title,
        slug: page.slug,
        menu_order: page.order,
        status: 'publish', // 即時公開
        type: 'page'
      };

      try {
        const res = await fetch(apiRoot, {
          method: 'POST',
          headers: {
            'X-WP-Nonce': wpApiSettings.nonce,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const json = await res.json();
          resultsDiv.innerHTML += `<span style="color:green;">✔ 作成成功: ${json.title.raw} (ID:${json.id})</span><br>`;
          successCount++;
        } else {
          const err = await res.json();
          resultsDiv.innerHTML += `<span style="color:red;">✖ 作成失敗: ${page.title} - ${err.message}</span><br>`;
          failCount++;
        }
      } catch (e) {
        console.error(e);
        resultsDiv.innerHTML += `<span style="color:red;">✖ 通信エラー: ${page.title}</span><br>`;
        failCount++;
      }

      // 自動スクロール
      resultsDiv.scrollTop = resultsDiv.scrollHeight;
    }

    resultsDiv.innerHTML += `<br><b>完了: 成功 ${successCount}件 / 失敗 ${failCount}件</b>`;
    if (successCount > 0) {
      resultsDiv.innerHTML += `<br><a href="javascript:location.reload()">ページ一覧を更新する</a>`;
    }
  };
})();