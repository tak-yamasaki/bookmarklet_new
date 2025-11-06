'use strict';
{
  const TEMPLATE = `<style>
  /* ... (CSS部分は変更なし) ... */
  #modalWrapper {
    font-family: Arial, sans-serif !important;
    font-size: 14px !important;
    display: table;
    width: 800px;
    padding: 20px;
    border: #ccc solid 1px;
    background: rgb(250,250,250);
    color: rgba(0,0,0,0.7);
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 999999;
    box-sizing: border-box;
    line-height: normal!important;
  }

  #closeBtn {
    background: rgb(250,250,250);
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    text-align: center;
    font-size: 12px;
    position: absolute;
    right: 20px;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    z-index: 999;
  }
  #closeBtn i{
    line-height: 30px;
  }

  #closeBtn:hover {
    background: #eee;
  }

  #modalWrapper h1 {
    text-align: center;
    font-size: 20px;
    padding: 0;
    margin: 0 0 40px;
    background: none;
    color: black;
  }
  #modalWrapper h1:after {
    content: none;
  }
  #modalWrapper h2 {
    color: black;
    font-size: 17px;
    padding: 0;
    margin: 0 0 10px;
    background: none;
  }
   #modalWrapper h2:before, #modalWrapper h2:after {
    content:none;
  }
  #modalWrapper .buttonGroup{
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  #modalWrapper .buttonGroup li{
    width: 48%;
    margin-bottom: 20px;
  }

  #modalWrapper .btn{
    display: block;
    background: rgb(16,108,200);
    color: white;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.26);
    text-align: center;
    font-size: 15px;
    border-radius: 2px;
    transition: 0.3s;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    height: 50px;
    line-height: 50px;
    position: relative;
  }

  #modalWrapper .btn:hover {
  background: rgb(1,89,162);
  }

  #modalWrapper .btn i{
    display: block;
    width: 24px;
    height: 24px;
    position: absolute;
    left: 10%;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  #bgCover {
    width: 100%;
    height: 100vw;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999998;
  }
</style>
  <div id="modalWrapper">
  <div id="closeBtn"><i class="material-icons">close</i></div>
  <h1>制作支援ツール</h1>
  <h2>全般</h2>
  <ul class="buttonGroup">
    <li><div id="wp_script_list" class="btn" data-user="yamaguchi"><i class="material-icons">system_update_alt</i>EC・BS投入ツール</div></li>
    <li><div id="inspection" class="btn" data-user="yamaguchi"><i class="material-icons">subject</i>表記チェック</div></li>
    <li><div id="build_taskrunner" class="btn" data-user="yamaguchi"><i class="material-icons">cloud_download</i>BASE復元</div></li>
    <li><div id="price2table" class="btn" data-src="https://cdn.jsdelivr.net/gh/tak-yamasaki/bookmarklet_new@refs/heads/master/price2table.js"><i class="material-icons">table_chart</i>料金表テーブル作成</div></li>
    <li><div id="youtube_structured_data" data-src="https://cdn.jsdelivr.net/gh/tak-yamasaki/bookmarklet_new@refs/heads/master/youtube_structured_data.js" class="btn"><i class="material-icons">movie</i>You Tube構造化データ生成</div></li>
    <li><div id="mag_password" data-src="https://cdn.jsdelivr.net/gh/tak-yamasaki/bookmarklet_new@refs/heads/master/mag_password.js" class="btn"><i class="material-icons">password</i>MAG用パスワード生成</div></li>
    <li><div id="wp_generate_pages" data-src="https://cdn.jsdelivr.net/gh/tak-yamasaki/bookmarklet_new@refs/heads/master/wp_generate_pages.js" class="btn"><i class="material-icons">content_copy</i>WordPress空ページ一括生成</div></li>
  </ul>
  <h2>BS</h2>
    <ul class="buttonGroup">
    <li><div id="inputholidays" class="btn" data-user="kudo"><i class="material-icons">calendar_today</i>Biz Calendar祝日設定</div></li>
  </ul>
  <h2>EC</h2>
  <ul class="buttonGroup">
    <li><div id="person_change" data-src="https://cdn.jsdelivr.net/gh/tak-yamasaki/bookmarklet_new@refs/heads/master/person_change.js" class="btn"><i class="material-icons">perm_identity</i>個人情報一人称 一括書き換え</div></li>
    <li><div id="ecMeta" data-src="https://cdn.jsdelivr.net/gh/tak-yamasaki/bookmarklet_new@refs/heads/master/ecMeta.js" class="btn"><i class="material-icons">description</i>ECメタタグ自動投入</div></li>
    <li><div id="wp_blog_post" class="btn" data-user="yamaguchi"><i class="material-icons">import_export</i>ブログ移行ツール</div></li>
  </ul>
</div>
<div id="bgCover"></div>`;

  // モーダル作成
  const s = document.createElement('link');
  s.href = '//fonts.googleapis.com/icon?family=Material+Icons';
  s.rel = 'stylesheet';
  document.head.appendChild(s);
  const modalWrapper = document.createElement('div');
  modalWrapper.innerHTML = TEMPLATE;
  document.body.appendChild(modalWrapper);


  // 閉じるボタン
  const closeBtn = document.getElementById('closeBtn');
  closeBtn.addEventListener('click', () => {
    modalWrapper.remove();
  });
  const bgCover = document.getElementById('bgCover');
  bgCover.addEventListener('click', () => {
    closeBtn.click();
  });


  // ... (TEMPLATE定義の下、スクリプト部分) ...

  // VercelのプロキシエンドポイントURL
  const PROXY_ENDPOINT_URL = 'https://million-yamasaki-youtube-api.vercel.app/api/get-script';

  // 各ボタン処理
  const buttons = document.querySelectorAll('#modalWrapper .buttonGroup .btn');
  Array.prototype.forEach.call(
    buttons, function (e, i) {
      buttons[i].addEventListener('click', (e) => {

        const targetElement = e.currentTarget;
        const id = targetElement.id;
        const user = targetElement.dataset.user;
        const src = targetElement.dataset.src;
        const proxyKey = targetElement.dataset.proxyKey; // ★ 修正点 2: proxyKey を取得

        modalWrapper.remove();
        s.remove(); // Material Iconsのlinkタグを削除

        (() => {
          const s = document.createElement('script');
          let scriptSrc = '';

          // 3. 読み込み先を分岐 (優先度順)

          if (targetElement.hasAttribute('data-user')) {
            // 【パターンA】data-user (Vercel Proxy)
            scriptSrc = PROXY_ENDPOINT_URL +
              '?user=' + encodeURIComponent(user) +
              '&trigger=' + encodeURIComponent(id) +
              '&v=' + Date.now();

          } else if (targetElement.hasAttribute('data-proxy-key')) {
            // ★ 修正点 3: data-proxy-key を処理するロジックを追加
            // 【パターンB】data-proxy-key (Vercel Proxy)
            scriptSrc = PROXY_ENDPOINT_URL +
              '?key=' + encodeURIComponent(proxyKey) +
              '&v=' + Date.now();

          } else if (targetElement.hasAttribute('data-src')) {
            // 【パターンC】data-src (Direct link, e.g., githack)
            scriptSrc = src;
            scriptSrc += (scriptSrc.indexOf('?') === -1 ? '?' : '&') + 'v=' + Date.now();

          }

          // 4. scriptSrcが設定されている場合のみ、スクリプトを読み込む
          if (scriptSrc) {
            s.src = scriptSrc;

            s.onload = () => {
              if (document.body.contains(s)) {
                document.body.removeChild(s);
              }
            };
            s.onerror = () => {
              console.error('ブックマークレットの読み込みに失敗しました: ' + s.src);
              alert('スクリプトの読み込みに失敗しました。\n' + s.src);
              if (document.body.contains(s)) {
                document.body.removeChild(s);
              }
            };

            document.body.appendChild(s);

          } else {
            console.error('ボタン ' + id + ' には読み込み可能な属性(data-user, data-proxy-key, data-src)が設定されていません。');
            alert('このボタンは正しく設定されていません。\n(ID: ' + id + ')');
          }
        })();
      });
    }
  );
}