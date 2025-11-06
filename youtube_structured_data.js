'use strict';
{
  // モーダルHTML
  const TEMPLATE = `<style>
    #modalWrapper {
      font-family: Arial, sans-serif !important;
      font-size: 14px !important;
      display: table;
      width: 800px;
      padding: 20px;
      border: #ccc solid 1px;
      background: rgb(250, 250, 250);
      color: rgba(0, 0, 0, 0.7);
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .26);
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      z-index: 99999;
      box-sizing: border-box;
      line-height: normal !important;
    }

    #closeBtn {
      background: rgb(250, 250, 250);
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
    }

    #closeBtn i {
      line-height: 30px;
    }

    #closeBtn:hover {
      background: #eee;
    }

    #modalWrapper h1 {
      text-align: center;
      font-size: 20px;
      padding: 0;
      margin: 0 0 20px;
      background: none;
      position: static;
    }

    .movie_urlWrapper {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: 0 auto 40px;
      width: 600px;
      gap: 0 20px;
      text-align: center;
    }

    .movie_urlWrapper label {
      flex-shrink: 0;
    }

    #movie_url {
      width: auto;
      height: 44px;
      line-height: 44px;
      padding: 0 1em;
      outline: none;
      background: transparent;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      border: #ccc solid 1px;
      border-radius: 2px;
      flex-grow: 1;
    }

    #notification {
      text-align: center;
      font-weight: bold !important;
      height: 1.5em;
      font-size: 14px;
      margin: 1em 0;
      position: relative;
      line-height: normal !important;
    }

    #notification.disabled {
      display: none;
    }

    #notification.enabled {
      display: block;
    }

    #notification span {
      display: inline-block;
      position: relative;
      padding-left: 24px;
      font-weight: bold !important;
    }

    #notification.notificationAlert {
      color: #ff7070;
    }

    #notification.notificationAlert :before {
      content: '\\e001';
      font-family: "Material Icons", sans-serif;
      font-size: 20px;
      position: absolute;
      left: 0;
    }

    #sourceCode {
      height: 240px;
      border: #ccc solid 1px;
      overflow-y: scroll;
    }

    #sourceCode pre {
      white-space: pre-wrap;
    }

    #sourceCode h2 {
      font-size: 16px;
      text-align: center;
      color: #666;
      margin: 1em 0;
    }

    .btnWrapper {
      display: flex;
      justify-content: center;
    }

    #btnCopy {
      width: 240px;
      height: 40px;
      line-height: 40px;
      margin-top: 20px;
      background: rgb(16, 108, 200);
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
      color: white;
      text-align: center;
      cursor: pointer;
      border-radius: 2px;
      user-select: none;
      transition: 0.3s;
      font-weight: bold;
    }

    #btnCopy span {
      display: inline-block;
      position: relative;
      padding-left: 24px;
    }

    #btnCopy span:before {
      content: '\\e14d';
      font-family: 'Material Icons', sans-serif;
      font-size: 18px;
      position: absolute;
      left: 0;
      font-weight: normal;
      transform: scale(-1, 1);
    }

    #btnCopy:hover {
      background: rgb(1, 89, 162);
    }

    #btnCopy.disabled {
      cursor: default;
      background: rgba(0, 0, 0, 0.12);
      color: rgba(0, 0, 0, 0.38);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    #btnClear {
      width: 240px;
      height: 40px;
      line-height: 40px;
      margin-top: 20px;
      margin-left: 20px;
      background: rgb(250, 250, 250);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      text-align: center;
      cursor: pointer;
      user-select: none;
      border-radius: 2px;
      transition: 0.3s;
      font-weight: bold;
    }

    #btnClear:hover {
      background: #eee;
    }

    #bgCover {
      width: 100%;
      height: 100vw;
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99998;
    }
  </style>
  <div id="modalWrapper">
    <div id="closeBtn"><i class="material-icons">close</i></div>
    <h1>You Tube動画構造化データ作成</h1>
    <div class="movie_urlWrapper">
      <label for="movie_url">You Tube URL</label>
      <input type="text" id="movie_url" name=movie_url" placeholder="例）https://www.youtube.com/watch?v=XXXXXXXXXX">
    </div>
    <p id="notification" class="notificationAlert disabled"><span>動画データが取得出来ません。URLに間違いがないか確認してください。</span>
    </p>

    <div id="sourceCode">
    </div>
    <div class="btnWrapper">
      <div id="btnCopy" class="disabled"><span>クリップボードにコピー</span></div>
      <div id="btnClear"><span>クリア</span></div>
    </div>
  </div>
  <div id="bgCover"></div>`;
  const s = document.createElement('link');
  s.href = '//fonts.googleapis.com/icon?family=Material+Icons';
  s.rel = 'stylesheet';
  document.head.appendChild(s);

  const modalWrapper = document.createElement('div');
  modalWrapper.innerHTML = TEMPLATE;
  document.body.appendChild(modalWrapper);

  let $movie_url = document.getElementById('movie_url');

  //#movie_urlに入力があったら以下を実行
  $movie_url.addEventListener('input', () => {
    let movie_url_value = document.getElementById('movie_url').value;
    console.log(movie_url_value);
    //You Tube動画のURLが正しいかチェック
    if (movie_url_value.match(/v=(.{11})/) === null) {
      console.log('IDが取得できません');
      document.getElementById('btnCopy').classList.add('disabled');
      document.getElementById('notification').classList.add('enabled');
      return;
    } else {
      document.getElementById('notification').classList.remove('enabled');
    }
    //You Tubeの動画IDを取得
    let movie_id = movie_url_value.match(/v=(.{11})/)[1];
    console.log(movie_url_value);
    console.log(movie_id);

    //You Tubeの動画情報を取得
    fetch(`https://million-yamasaki-youtube-api.vercel.app/api/getYoutubeData?id=${movie_id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('API request failed'); // エラーハンドリングを追加
        }
        return response.json();
      })
      .then(data => {
        if (!data.items || data.items.length === 0) {
          throw new Error('Video data not found'); // 動画が見つからない場合のエラー
        }
        //取得したデータを整形
        let snippet = data.items[0].snippet;
        let contentDetails = data.items[0].contentDetails;
        let statistics = data.items[0].statistics;
        let uploadDate = snippet.publishedAt;
        let movie_data = {
          id: movie_id,
          title: snippet.title,
          description: snippet.description,
          thumbnail: snippet.thumbnails.default.url,
          duration: contentDetails.duration,
          viewCount: statistics.viewCount,
        };
        //取得したデータを元にJSON-LDを作成
        let jsonld = {
          "@context": "http://schema.org",
          "@type": "VideoObject",
          "name": movie_data.title,
          "description": movie_data.description.replace(/\n/g, ''),
          //thumbnailは取得できる一番大きいもの
          thumbnailURL: snippet.thumbnails.maxres ? snippet.thumbnails.maxres.url : snippet.thumbnails.high.url,
          "uploadDate": uploadDate,
          "duration": movie_data.duration,
          "embedUrl": `https://www.youtube.com/embed/${movie_data.id}`,
          "interactionCount": movie_data.viewCount
        };
        //JSON-LDを整形
        let jsonld_text = `&lt;script type="application/ld+json"&gt;${JSON.stringify(jsonld, null, '  ')}&lt;/script&gt;`;
        //JSON-LDを表示
        document.getElementById('sourceCode').innerHTML = `<pre><code>${jsonld_text}</code></pre>`;
        //クリップボードにコピー
        document.getElementById('btnCopy').addEventListener('click', () => {
          //< >のエスケープを元に戻す
          jsonld_text = jsonld_text.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          navigator.clipboard.writeText(jsonld_text);
        });
        //クリア
        document.getElementById('btnClear').addEventListener('click', () => {
          document.getElementById('sourceCode').innerHTML = '';
          document.getElementById('movie_url').value = '';
          document.getElementById('btnCopy').classList.add('disabled');
        });
        document.getElementById('btnCopy').classList.remove('disabled');
      }).catch(error => {
      //エラー時の処理
      document.getElementById('notification').classList.remove('disabled');
    });
  });

  // 閉じるボタン
  const closeBtn = document.getElementById('closeBtn');
  closeBtn.addEventListener('click', () => {
    modalWrapper.remove();
  });
  const bgCover = document.getElementById('bgCover');
  bgCover.addEventListener('click', () => {
    closeBtn.click();
  })
}