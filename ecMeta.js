'use strict';
{
  const TEMPLATE = `
<style>
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
    z-index: 9999;
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
  }

  #dropArea {
    text-align: center;
    border: 4px dashed #b4b9be;
    color: #aaa;
    font-size: 19px;
    height: 150px;
    line-height: 150px;
    user-select: none;
  }

  #dropArea.dragover,
  #dropArea:active {
    background: #eee;
  }

  #fileInput {
    display: none;
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

  #notification span {
    display: inline-block;
    position: relative;
    padding-left: 24px;
    font-weight: bold !important;
  }

  #notification.notificationAlert {
    color: rgb(255, 87, 34);
  }

  #notification.notificationAlert :before {
    content: '\\e001';
    font-family: "Material Icons", sans-serif;
    font-size: 20px;
    position: absolute;
    left: 0;
  }

  #notification.notificationReady {
    color: #4CAF50;
  }

  #notification.notificationReady :before {
    content: '\\e876';
    font-family: "Material Icons", sans-serif;
    font-size: 20px;
    position: absolute;
    left: 0;
  }

  #btnSend {
    width: 300px;
    height: 40px;
    line-height: 40px;
    margin: 0 auto 40px;
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

  #btnSend span {
    display: inline-block;
    position: relative;
    padding-left: 30px;
  }

  #btnSend span:before {
    content: '\\e15e';
    font-family: 'Material Icons', sans-serif;
    font-size: 24px;
    position: absolute;
    left: 0;
    font-weight: normal;
    transform: scale(-1, 1);
  }

  #btnSend:hover {
    background: rgb(1, 89, 162);
  }

  #btnSend.disabled {
    cursor: default;
    background: rgba(0, 0, 0, 0.12);
    color: rgba(0, 0, 0, 0.38);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  #result {
    height: 200px;
    border: #ccc solid 1px;
    overflow-y: scroll;
    margin-top: 20px;
  }
  #result ul{
    list-style: none;
    padding: 0;
    margin: 10px;
  }
  #result ul li{
    border-bottom: #ccc dotted 1px;
    line-height: 20px;
    padding: 5px 5px 5px 30px;
    position: relative;
  }
  #result ul li i{
    /*font-size: 20px;*/
    width: 24px;
    height: 24px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  #result ul li.success i{
    color:#4CAF50;
  }
  #result ul li.failed i{
    color:rgb(255, 87, 34);
  }
  #bgCover {
    width: 100%;
    height: 100vw;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9998;
  }
</style>
<div id="modalWrapper">
  <div id="closeBtn"><i class="material-icons">close</i></div>
  <h1>ECメタタグ自動投入</h1>
  <div id="dropArea">ここに指示書のエクセルファイルをドロップ</div>
  <input type="file" id="fileInput">
  <p id="notification"><span></span></p>
  <div id="btnSend" class="disabled"><span>投入する</span></div>
  <h3 style="text-align: center;">実行結果</h3>
  <div id="result">
  </div>
</div>
<div id="bgCover"></div>`;

  const s = document.createElement('link');
  s.href = '//fonts.googleapis.com/icon?family=Material+Icons';
  s.rel = 'stylesheet';
  document.head.appendChild(s);

  // モーダル生成
  const modalWrapper = document.createElement('div');
  modalWrapper.innerHTML = TEMPLATE;
  document.body.appendChild(modalWrapper);
  const closeBtn = document.getElementById('closeBtn');

  //必要なパーツの取得
  const editTarget = document.getElementsByName('rdoEditTarget') || '';
  const btnSend = document.getElementById('btnSend');
  const notification = document.getElementById('notification');
  let TARGET_NAME = '';
  //ラジオボタンの選択状態を見てtargetNameにターゲット名をセット（後でjsonのキー名参照に使う）
  //選択状態が取得できない場合は適切なページで実行していないとみなしてエラー表示
  if (editTarget.length === 0) {
    notification.className = 'notificationAlert';
    notification.innerHTML = `<span>メタタグ編集画面で実行してください</span>`;
  } else {
    if (editTarget[0].checked === true) {
      TARGET_NAME = 'タイトル';
    } else if (editTarget[1].checked === true) {
      TARGET_NAME = 'キーワード';
    } else if (editTarget[2].checked === true) {
      TARGET_NAME = 'ディスクリプション';
    }
  }

  //使用するエクセルのシート名を定義
  const META_SHEET_NAME = '【meta】';

  //SheetJs読み込み
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.11.19/xlsx.full.min.js';
  document.head.appendChild(script);

  //SheetJSのload完了後に実行
  //SheetJs関連はこのあたりを参考に実装 https://qiita.com/okoppe8/items/995b57d4e3d6d512b916
  script.onload = () => {
    const X = XLSX;
    let output;

    // ファイル選択時のメイン処理
    const handleFile = e => {
      const files = e.dataTransfer.files;
      // ファイル拡張子チェック（エクセル以外が投入された場合は処理キャンセル）
      if (!files[0].name.toUpperCase().match(/\.(XLSX|XLS)$/)) {
        notification.className = 'notificationAlert';
        notification.innerHTML = '<span>エクセルシートを投入してください</span>';
        btnSend.className = 'disabled';
        return;
      }
      const f = files[0];
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        let workbook;
        const arr = fixData(data);
        workbook = X.read(btoa(arr), {
          type: 'base64',
          cellDates: true,
        });
        output = to_json(workbook);
      };
      reader.readAsArrayBuffer(f);

      //ファイル受け取りが完了したら投入ボタンを押せるようにする
      notification.className = 'notificationReady';
      notification.innerHTML = `<span>${TARGET_NAME}を投入する準備が整いました</span>`;
      btnSend.className = '';
    };

    // ファイルの読み込み
    const fixData = data => {
      let o = '',
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w,
        l * w + w)));
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    };

    // ワークブックのデータをjsonに変換
    const to_json = workbook => {
      const result = {};
      workbook.SheetNames.forEach(sheetName => {
        const roa = X.utils.sheet_to_json(
          workbook.Sheets[sheetName],
          {
            raw: true,
          });
        if (roa.length > 0) {
          result[sheetName] = roa;
        }
      });
      return result;
    };

    //DnD
    const dropArea = document.getElementById('dropArea');
    dropArea.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      dropArea.classList.add('dragover');
    });
    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('dragover');
    });
    dropArea.addEventListener('drop', e => {
      e.preventDefault();
      dropArea.classList.remove('dragover');
      handleFile(e);
    });

    // TODO inputも使えるようにする
    // const fileInput = document.getElementById('fileInput');
    // fileInput.addEventListener('change', (e) => {
    //   handleFile(e);
    // });

    // ここから投入処理
    // 投入先のテーブル要素を取得
    const table = document.getElementById('titleEditTable');
    const rows = document.querySelectorAll('#titleEditTable tbody tr');

    btnSend.addEventListener('click', () => {
      //ボタンが無効化されている場合（データをまだ受け取っていない）は押せないようにする
      if (btnSend.className.indexOf('disabled') !== -1) {
        return;
      }
      //シートのデータ数、実行結果を格納する配列を定義
      const dataLength = output[META_SHEET_NAME].length;
      const dataStat = new Array(dataLength).fill(0);

      // 一旦すべてトップの内容で埋める
      for (let i = 1; i < rows.length + 1; i++) {
        let inputTarget = table.rows[i].cells[3].getElementsByTagName('input')[0];
        if (TARGET_NAME === 'タイトル') {
          inputTarget.value = `${table.rows[i].cells[2].innerText}│${output[META_SHEET_NAME][0][TARGET_NAME].trim()}`;
        } else {
          inputTarget.value = `${output[META_SHEET_NAME][0][TARGET_NAME].trim()}`;
        }
        inputTarget.classList.add('BEditedRow');
      }

      //個別に指定がある箇所を入れ直す（HOMEも含む）
      let count = 0;
      for (let i = 1; i < rows.length + 1; i++) {
        let pageName = table.rows[i].cells[2].innerText;
        for (let j = 0; j < dataLength; j++) {
          if (output[META_SHEET_NAME][j]['ページ名'] === pageName) {
            table.rows[i].cells[3].getElementsByTagName('input')[0].value = output[META_SHEET_NAME][j][TARGET_NAME].trim();
            //実行結果表示で使うために、入れた箇所と個数を保存しておく
            dataStat[j] = 1;
            count++;
          }
        }
      }

      //流し込みが完了したら実行結果を表示
      const resultOutput = document.getElementById('result');
      let resultOutputHtml = '';
      resultOutputHtml += `<p style="text-align: center;"><strong>${count}/${output[META_SHEET_NAME].length}件投入しました</strong><br>投入できなかったページがある場合はスラッグ名を間違えていないか確認して修正してください</p>`;
      resultOutputHtml += '<ul>';
      for (let i = 0; i < dataLength; i++) {
        if (dataStat[i] === 1) {
          resultOutputHtml += `<li class="success"><i class="material-icons">done</i>${output[META_SHEET_NAME][i]['ページ名']}</li>`;
        } else {
          resultOutputHtml += `<li class="failed"><i class="material-icons">error</i><span>${output[META_SHEET_NAME][i]['ページ名']}（失敗）</span></li>`;
        }
      }
      resultOutputHtml += '</ul>';
      resultOutput.innerHTML = resultOutputHtml;

      //ボタンを無効化してメッセージを出して完了
      btnSend.className = 'disabled';
      notification.innerHTML = `<span>${TARGET_NAME}の投入が完了しました！</span>`;
    });
  };

  // 閉じるボタン
  closeBtn.addEventListener('click', () => {
    modalWrapper.remove();
    script.remove();
    s.remove();
  });
  const bgCover = document.getElementById('bgCover');
  bgCover.addEventListener('click', () => {
    closeBtn.click();
  })
}