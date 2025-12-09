(function () {
  /* --------------------------------------------------
     1. API環境チェックと誘導処理
     (一覧画面など wpApiSettings がない画面でのエラー回避)
  -------------------------------------------------- */
  if (typeof wpApiSettings === 'undefined' || !wpApiSettings.nonce) {
    var msg = '【エラー】この画面ではツールを実行できません。\n' +
      '「ダッシュボード（ホーム）」で再度実行してください。';

    if (confirm(msg)) {
      // 現在のURLから /wp-admin/ を基準にルートを割り出して移動
      var adminRoot = location.href.split('/wp-admin/')[0] + '/wp-admin/';
      location.href = adminRoot;
    }
    return;
  }

  /* --------------------------------------------------
     2. UIの初期化 (二重起動防止)
  -------------------------------------------------- */
  if (document.getElementById('wp-tools-ui')) return;

  // CSSリセット（ツールの表示崩れ防止）
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css';
  document.head.appendChild(link);

  // UIコンテナ作成
  var ui = document.createElement('div');
  ui.id = 'wp-tools-ui';
  // スタイル定義
  ui.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99999;background:#fff;padding:15px;border:1px solid #ccc;max-width:480px;box-shadow:0 4px 15px rgba(0,0,0,0.15);overflow:auto;font-family:sans-serif;font-size:13px;border-radius:4px;';

  // HTML構造
  ui.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <h3 style="font-size:14px;font-weight:bold;margin:0;">WP 固定ページ一括作成ツール</h3>
      <button id="closeTool" style="background:none;border:none;font-size:16px;cursor:pointer;color:#666;">×</button>
    </div>
    <div style="margin-bottom:12px;padding:8px;background:#f0f6fc;border:1px solid #cce5ff;border-radius:3px;font-size:12px;color:#333;">
      <strong>Excel読込ルール (ヘッダー不要)</strong><br>
      A列: タイトル<span style="color:#d00;">*</span> | B列: スラッグ | C列: 順序
    </div>
    
    <div style="margin-bottom:10px;">
      <input type="file" id="excelFile" accept=".xlsx,.xls" style="font-size:12px;" />
    </div>

    <div style="display:flex;gap:5px;margin-bottom:5px;">
      <button id="addPage" style="padding:4px 8px;cursor:pointer;font-size:12px;">＋ 空行を追加</button>
    </div>

    <div id="pageListWrapper" style="margin-top:5px;max-height:250px;overflow-y:auto;border:1px solid #ddd;background:#fff;">
      <ul id="pageListContainer" style="list-style:none;margin:0;padding:0;"></ul>
    </div>

    <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <button id="createPages" style="padding:8px 16px;background:#2271b1;color:#fff;border:none;border-radius:3px;cursor:pointer;font-weight:bold;">作成実行</button>
        <button id="resetTool" style="margin-left:5px;padding:8px 12px;background:#f0f0f1;color:#2271b1;border:1px solid #2271b1;border-radius:3px;cursor:pointer;">リセット</button>
      </div>
      <span id="toolStatus" style="font-size:11px;color:green;font-weight:bold;">● API接続OK</span>
    </div>

    <div id="results" style="margin-top:12px;padding-top:10px;border-top:1px solid #eee;font-size:12px;line-height:1.5;max-height:150px;overflow-y:auto;color:#444;"></div>
  `;

  document.body.appendChild(ui);

  /* --------------------------------------------------
     3. 変数・UI操作ロジック
  -------------------------------------------------- */
  var dataRows = [];
  var ulContainer = document.getElementById('pageListContainer');
  var resultsDiv = document.getElementById('results');

  // リストアイテム（行）の生成
  function createListItem(r) {
    var li = document.createElement('li');
    li.style.cssText = 'padding:6px;border-bottom:1px solid #eee;display:flex;gap:5px;align-items:center;';

    li.innerHTML = `
      <input type="text" class="title-input" value="${r.title}" style="flex:2;padding:4px;border:1px solid #ddd;border-radius:3px;" placeholder="タイトル" />
      <input type="text" class="slug-input" value="${r.slug}" style="flex:2;padding:4px;border:1px solid #ddd;border-radius:3px;" placeholder="スラッグ" />
      <input type="number" class="order-input" value="${r.order}" style="width:50px;padding:4px;border:1px solid #ddd;border-radius:3px;" placeholder="順" />
      <button class="delete-row" style="width:30px;height:26px;background:#d63638;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;">削除</button>
    `;
    return li;
  }

  // 画面描画更新
  function redrawPageList() {
    ulContainer.innerHTML = '';
    dataRows.forEach(r => {
      ulContainer.appendChild(createListItem(r));
    });
    // スクロールを一番下へ
    var wrapper = document.getElementById('pageListWrapper');
    wrapper.scrollTop = wrapper.scrollHeight;
  }

  // DOMからデータを吸い上げ（編集中データ同期）
  function updateDataRowsFromDOM() {
    var lis = ulContainer.querySelectorAll('li');
    dataRows = Array.from(lis).map(li => {
      return {
        title: li.querySelector('.title-input').value,
        slug: li.querySelector('.slug-input').value,
        order: parseInt(li.querySelector('.order-input').value) || 0
      };
    }).filter(r => r.title.trim() !== ''); // タイトル空は除外対象候補だが、ここでは保持し送信時に弾く
  }

  // 新規行追加
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

    var wrapper = document.getElementById('pageListWrapper');
    wrapper.scrollTop = wrapper.scrollHeight;
  }

  /* --------------------------------------------------
     4. Excel読み込み処理 (SheetJS)
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

  // SheetJSの読み込み開始
  loadXLSX('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', function () {
    var fileInput = document.getElementById('excelFile');
    if (fileInput) {
      fileInput.onchange = function (e) {
        var f = e.target.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function (e) {
          try {
            var data = new Uint8Array(e.target.result);
            var wb = XLSX.read(data, {type: 'array'});
            var ws = wb.Sheets[wb.SheetNames[0]];
            var json = XLSX.utils.sheet_to_json(ws, {header: 1});

            // Excelパース (A列, B列, C列)
            var newRows = json
              .filter(row => row[0]) // タイトル(A列)がある行のみ
              .map((r, i) => ({
                title: String(r[0] || ''),
                slug: String(r[1] || ''),
                order: parseInt(r[2]) || (i + 1)
              }));

            if (newRows.length > 0) {
              dataRows = newRows;
              redrawPageList();
              resultsDiv.innerHTML = '<span style="color:#0073aa;">' + newRows.length + '件のデータを読み込みました。</span>';
            } else {
              alert('有効なデータが見つかりませんでした。A列にタイトルを入力してください。');
            }
          } catch (err) {
            console.error(err);
            alert('ファイルの読み込みに失敗しました。');
          }
        };
        r.readAsArrayBuffer(f);
      };
    }
  });

  /* --------------------------------------------------
     5. イベントリスナー
  -------------------------------------------------- */
  // 追加ボタン
  document.getElementById('addPage').onclick = function () {
    addNewPageRow();
  };

  // 削除ボタン（動的要素のため親で委譲）
  ulContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-row')) {
      e.target.closest('li').remove();
      updateDataRowsFromDOM();
    }
  });

  // リセットボタン
  document.getElementById('resetTool').onclick = function () {
    if (confirm('入力内容と結果ログをすべてリセットしますか？')) {
      dataRows = [];
      ulContainer.innerHTML = '';
      document.getElementById('excelFile').value = '';
      resultsDiv.innerHTML = 'リセットしました。';
    }
  };

  // 閉じるボタン
  document.getElementById('closeTool').onclick = function () {
    document.body.removeChild(ui);
  };

  /* --------------------------------------------------
     6. メイン処理: REST APIでの作成
  -------------------------------------------------- */
  document.getElementById('createPages').onclick = async function () {
    updateDataRowsFromDOM();

    // 空タイトルの除外
    dataRows = dataRows.filter(r => r.title && r.title.trim() !== '');
    redrawPageList();

    if (dataRows.length === 0) {
      alert('作成対象のページがありません。\nタイトルを入力してください。');
      return;
    }

    if (!confirm(dataRows.length + ' 件のページを作成します。\n実行してよろしいですか？')) return;

    resultsDiv.innerHTML = '<b>処理を開始します...</b><br>';
    var successCount = 0;
    var failCount = 0;

    // REST API エンドポイント
    const apiRoot = wpApiSettings.root + 'wp/v2/pages';

    for (const page of dataRows) {
      // 送信データ
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
          resultsDiv.innerHTML += `<span style="color:green;">✔ 成功: ${json.title.raw}</span><br>`;
          successCount++;
        } else {
          const err = await res.json();
          resultsDiv.innerHTML += `<span style="color:red;">✖ 失敗: ${page.title} (${err.message})</span><br>`;
          failCount++;
        }
      } catch (e) {
        console.error(e);
        resultsDiv.innerHTML += `<span style="color:red;">✖ 通信エラー: ${page.title}</span><br>`;
        failCount++;
      }

      // ログエリアを自動スクロール
      resultsDiv.scrollTop = resultsDiv.scrollHeight;
    }

    resultsDiv.innerHTML += `<br><b>完了: 成功 ${successCount}件 / 失敗 ${failCount}件</b>`;
    if (successCount > 0) {
      resultsDiv.innerHTML += `<br><a href="javascript:location.reload()" style="color:#2271b1;font-weight:bold;">ページを再読み込みして確認</a>`;
    }
  };
})();