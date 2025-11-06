'use strict';
{
  // モーダルHTML
  const TEMPLATE = `
<style>
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
    z-index: 99999;
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
    margin: 0 0 20px;
    background: none;
    position: static;
  }

  .targetSiteWrapper {
    position: relative;
    display: block;
    margin: 0 auto 40px;
    border: #ccc solid 1px;
    border-radius: 2px;
    height: 44px;
    width: 300px;
    text-align: center;
    user-select: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  #targetSite {
    width: 100%;
    height: 44px;
    line-height: 44px;
    padding: 0 1em;
    cursor: pointer;
    border: none;
    outline: none;
    background: transparent;
    -webkit-appearance: none;
  }

  #targetSite::-ms-expand {
    display: none;
  }

  .targetSiteWrapper:after {
    content: '\\e5c5';
    font-family: "Material Icons",sans-serif;
    color: rgb(16,108,200);
    font-size:24px;
    position: absolute;
    top: 0;
    right: 0.3em;
    bottom: 0;
    margin: auto;
    width: 24px;
    height: 24px;
    pointer-events: none;
  }

  #targetSite:disabled {
    opacity: 0.5;
    cursor: default;
  }

  #modalWrapper table {
    width: 100%;
    border: none;
    border-top: #ccc dotted 1px;
  }

  #modalWrapper table th {
    background: none;
    text-align: left;
    font-weight: normal;
    border: none;
    border-bottom: #ccc dotted 1px;
    padding: 0.5em;
    font-size: 16px;
    line-height: normal!important;
  }

  #modalWrapper table th span {
    font-weight: normal;
    font-size: 12px;
    color: #666;
  }

  #modalWrapper table td {
    background: none;
    text-align: right;
    border: none;
    border-bottom: #ccc dotted 1px;
    padding: 0.5em;
    line-height: normal!important;
  }

  #isMenuSubText, #useBr {
    display: none;
  }

  .isMenuSubText-parts, .useBr-parts {
    padding-left: 20px;
    position: relative;
    margin-right: 20px;
    transition: 0.5s;
    user-select: none;
  }

  .isMenuSubText-parts:before, .useBr-parts:before {
    content: "\\e835";
    font-family: "Material Icons",sans-serif;
    font-size: 24px;
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: -4px;
    margin: auto;
    width: 24px;
    height: 24px;
  }

  #isMenuSubText:checked + .isMenuSubText-parts:before, #useBr:checked + .useBr-parts:before {
    content: "\\e834";
    font-family: 'Material Icons',sans-serif;
    color: #666;
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: -4px;
    margin: auto;
    width: 24px;
    height: 24px;
    font-size: 24px;
  }

  #isMenuSubText:disabled + .isMenuSubText-parts, #useBr:disabled + .useBr-parts {
    opacity: 0.6;
  }

  .optionWrapper{
    padding: 10px 0 0;
    text-align: center;
  }

  #notification {
    text-align: center;
    font-weight: bold!important;
    height: 1.5em;
    font-size: 14px;
    margin: 1em 0;
    position: relative;
    line-height: normal!important;
  }
  #notification span{
    display: inline-block;
    position: relative;
    padding-left: 24px;
    font-weight: bold!important;
  }
  #notification.notificationAlert {
    color: #ff7070;
  }

  #notification.notificationAlert :before{
    content: '\\e001';
    font-family: "Material Icons",sans-serif;
    font-size: 20px;
    position: absolute;
    left: 0;
  }

  #notification.notificationReady {
    color: #4CAF50;
  }

  #notification.notificationReady :before{
    content: '\\e876';
    font-family: "Material Icons",sans-serif;
    font-size: 20px;
    position: absolute;
    left: 0;
  }

  #btnGet {
    width: 300px;
    height: 40px;
    line-height: 40px;
    margin: 20px auto 40px;
    background: rgb(16,108,200);
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.26);
    color: white;
    text-align: center;
    cursor: pointer;
    border-radius: 2px;
    user-select: none;
    transition: 0.3s;
    font-weight: bold;
  }
  #btnGet span{
    display: inline-block;
    position: relative;
    padding-left: 30px;
  }
  #btnGet span:before {
    content: '\\e884';
    font-family: 'Material Icons',sans-serif;
    font-size: 20px;
    position: absolute;
    left: 0;
    font-weight: normal;
  }

  #btnGet:hover {
    background: rgb(1,89,162);
  }

  #btnGet.disabled {
    cursor: default;
    background: rgba(0,0,0,0.12);
    color: rgba(0,0,0,0.38);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  #sourceCode {
    height: 240px;
    border: #ccc solid 1px;
    overflow-y: scroll;
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
    background: rgb(16,108,200);
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.26);
    color: white;
    text-align: center;
    cursor: pointer;
    border-radius: 2px;
    user-select: none;
    transition: 0.3s;
    font-weight: bold;
  }

  #btnCopy span{
    display: inline-block;
    position: relative;
    padding-left: 24px;
  }

  #btnCopy span:before{
    content: '\\e14d';
    font-family: 'Material Icons',sans-serif;
    font-size: 18px;
    position: absolute;
    left: 0;
    font-weight: normal;
    transform: scale(-1, 1);
  }

  #btnCopy:hover {
    background: rgb(1,89,162);
  }

  #btnCopy.disabled {
    cursor: default;
    background: rgba(0,0,0,0.12);
    color: rgba(0,0,0,0.38);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  #btnClear {
    width: 240px;
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
    margin-left: 20px;
    background: rgb(250,250,250);
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
  <h1>料金表テーブル生成</h1>
  <div class="targetSiteWrapper">
    <select id="targetSite">
      <option value="0">ホットペッパービューティー（クーポン）</option>
      <option value="1">ホットペッパービューティー（メニュー）</option>
      <option value="2">ホットペッパーグルメ（料理）</option>
      <option value="3">ホットペッパーグルメ（ドリンク・ランチ）</option>
      <option value="4">食べログ（料理・ドリンク・ランチ）</option>
      <option value="5">ぐるなび</option>
      <option value="6">ヒトサラ</option>
      <option value="7">一休.com</option>
      <option value="8">Retty</option>
    </select>
  </div>
  <table>
    <th>メニュー名<br>
    <label><input type="checkbox" id="isMenuSubText"><span class="isMenuSubText-parts">メニュー下の説明文テキストを含む</span></label>
    <label><input type="checkbox" id="useBr" checked><span class="useBr-parts">改行を&lt;br&gt;で出力する</span></label>
    </th>
    <td>1,000円</td>
  </table>
  <p id="notification" class="notificationReady"></p>
  <div id="btnGet"><span>取得する！</span></div>

  <div id="sourceCode">
  </div>
  <div class="btnWrapper">
    <div id="btnCopy" class="disabled"><span>クリップボードにコピー</span></div>
    <div id="btnClear"><span>クリア</span></div>
  </div>
</div>
<div id="bgCover"></div>`;

  // 0:ホットペッパービューティー（クーポン）
  // 1:ホットペッパービューティー（メニュー）
  // 2:ホットペッパーグルメ（料理）
  // 3:ホットペッパーグルメ（ドリンク）
  // 4:食べログ
  // 5:ぐるなび
  // 6:ヒトサラ
  // 7:一休.com
  // 8:Retty
  const SETTING = [
    {
      MENU_TITLE: 'ホットペッパービューティー クーポン',
      MENU_WRAPPER: '.couponTbl',
      MENU_NAME: '.couponMenuName',
      MENU_SUBTEXT: 'p.wbba',
      MENU_PRICE: '.wwbw',
    },
    {
      MENU_TITLE: 'ホットペッパービューティー メニュー',
      MENU_WRAPPER: '.menuTbl',
      MENU_NAME: '.couponMenuName',
      MENU_SUBTEXT: 'p.wbba',
      MENU_PRICE: '.wwbw',
    },
    {
      MENU_TITLE: 'ホットペッパーグルメ 料理メニュー',
      MENU_WRAPPER: '.menu',
      MENU_NAME: '.firstChild',
      MENU_SUBTEXT: '+ .catch',
      MENU_PRICE: '.price',
    },
    {
      MENU_TITLE: 'ホットペッパーグルメ ドリンクメニュー',
      MENU_WRAPPER: '.shopInner',
      MENU_NAME: '>h3:first-child, dl.price + h3, h2 + h3',
      MENU_SUBTEXT: 'dl.price dt',
      MENU_PRICE: 'dl.price dd',
    },
    {
      MENU_TITLE: '食べログ メニュー',
      MENU_WRAPPER: '.rstdtl-menu-lst__contents',
      MENU_NAME: '.rstdtl-menu-lst__menu-title',
      MENU_SUBTEXT: '.rstdtl-menu-lst__ex',
      MENU_PRICE: '.rstdtl-menu-lst__price',
    },
    {
      MENU_TITLE: 'ぐるなび メニュー',
      MENU_WRAPPER: '.menu',
      MENU_NAME: '.menu-term',
      MENU_SUBTEXT: '.menu-desc',
      MENU_PRICE: '.menu-price',
    },
    {
      MENU_TITLE: 'ヒトサラ メニュー',
      MENU_WRAPPER: '.menu_bx',
      MENU_NAME: '.name',
      MENU_SUBTEXT: '.desc',
      MENU_PRICE: '.price',
    },
    {
      MENU_TITLE: '一休.com メニュー',
      MENU_WRAPPER: '._1QMibK-',
      MENU_NAME: '._1aejHwh',
      MENU_SUBTEXT: '',
      MENU_PRICE: '._2Xel14i',
    },
    {
      MENU_TITLE: 'Retty メニュー',
      MENU_WRAPPER: '.menu-price-list',
      MENU_NAME: '.menu-price-list__name',
      MENU_SUBTEXT: '',
      MENU_PRICE: '.menu-price-list__price',
    },
  ];

  // 全角→半角変換関数
  const toHalfWidth = (strVal) => {
    let halfVal = strVal.replace(/[＂-＇＊-．０-｝]/g,
      (tmpStr) => {
        return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
      }
    );
    // 文字コードシフトで対応できない文字、その他不要なスペースや連続改行、不要なテキストの除去
    return halfVal.replace(/￥/g, "\\")
      .replace(/　/g, ' ')
      .replace(/ +/g, ' ')
      .replace(/\n(\s*)\n|\n(\t*)\n/g, '\n')
      .replace(/\n /g, '\n')
      .replace(/\(/g, '（')
      .replace(/\)/g, '）');
    // .replace(/（税抜.*）|（税込.*）/g, '');
  };
  // メニュー用HTML組み立て関数
  // TODO 中見出しを挿入できるようにする
  const buildMenuTable = () => {
    let tableData = '';
    try {
      for (let i = 0; i < calcRowSize(); i++) {
        tableData += `<tr>\n<th>`;
        if (menuName[i].textContent !== '') {
          if (useBr.checked) {
            tableData += toHalfWidth(menuName[i].textContent)
              .trim()
              .replace(/\n/g, '<br>\n');
          } else {
            tableData += toHalfWidth(menuName[i].textContent).trim()
          }
        }
        if (isMenuSubText.checked && menuSubText[i].textContent.trim() !== '') {
          if (useBr.checked) {
            tableData += `<br>`;
          }
          tableData += `<span>`;
          if (useBr.checked) {
            tableData += toHalfWidth(menuSubText[i].textContent)
              .trim()
              .replace(/\n/g, '<br>\n');
          } else {
            tableData += toHalfWidth(menuSubText[i].textContent).trim();
          }
          tableData += `</span>`;
        }
        tableData += `</th>\n<td>`;
        if (menuPrice[i].textContent !== '') {
          if (useBr.checked) {
            tableData += toHalfWidth(menuPrice[i].textContent)
              .trim()
              .replace(/\n/g, '<br>\n');
          } else {
            tableData += toHalfWidth(menuPrice[i].textContent).trim()
          }
        }
        tableData += `</td>\n</tr>\n`;
      }
      sourceCode.insertAdjacentHTML('beforeend', `<table>\n<tbody>\n${tableData}\n</tbody>\n</table>`);
    } catch (e) {
      sourceCode.insertAdjacentHTML('beforeend', '<p style="text-align: center;">メニューを正常に取得できませんでした</p>');
    }
  };

  // ここからメイン処理
  // モーダル作成
  const s = document.createElement('link');
  s.href = '//fonts.googleapis.com/icon?family=Material+Icons';
  s.rel = 'stylesheet';
  document.head.appendChild(s);

  const modalWrapper = document.createElement('div');
  modalWrapper.innerHTML = TEMPLATE;
  document.body.appendChild(modalWrapper);

  // 必要なパーツ取得
  const btnGet = document.getElementById('btnGet');
  const btnCopy = document.getElementById('btnCopy');
  const isMenuSubText = document.getElementById('isMenuSubText');
  const useBr = document.getElementById('useBr');
  const targetSite = document.getElementById('targetSite');

  //URLを取得してセレクトメニューを自動的に選んでおく
  const url = window.location.href;
  if (url.indexOf('beauty.hotpepper') !== -1) {
    targetSite.value = 0;
  } else if (url.match(/hotpepper\.jp\/.*\/food\//)) {
    targetSite.value = 2;
  } else if (url.match(/hotpepper\.jp\/.*\/drink\//) || url.match(/www.hotpepper\.jp\/.*\/lunch\//)) {
    targetSite.value = 3;
  } else if (url.indexOf('tabelog') !== -1) {
    targetSite.value = 4;
  } else if (url.indexOf('gnavi') !== -1) {
    targetSite.value = 5;
  } else if (url.indexOf('gnavi') !== -1) {
    targetSite.value = 5;
  } else if (url.indexOf('hitosara') !== -1) {
    targetSite.value = 6;
  } else if (url.indexOf('ikyu.com') !== -1) {
    targetSite.value = 7;
  } else if (url.indexOf('retty.me') !== -1) {
    targetSite.value = 8;
  }

  // 各要素を取得
  let target = targetSite.value;
  let menuTableClass = SETTING[target].MENU_WRAPPER;
  let menuNameSelector = `${menuTableClass} ${SETTING[target].MENU_NAME}`;
  let menuSubTextSelector = `${menuTableClass} ${SETTING[target].MENU_SUBTEXT}`;
  let menuPriceSelector = `${menuTableClass} ${SETTING[target].MENU_PRICE}`;
  let menuName = document.querySelectorAll(menuNameSelector);
  let menuSubText = document.querySelectorAll(menuSubTextSelector);
  let menuPrice = document.querySelectorAll(menuPriceSelector);
  let menuTitle = `\n<h2>${SETTING[target].MENU_TITLE}</h2>\n`;
  let hasGet = false;

  // TODO 各データ個別のArrayになっているので一つにまとめる
  // データ用配列作成
  // let dataArray = [
  //   new Array(menuName.length),
  //   new Array(menuName.length),
  //   new Array(menuName.length),
  // ];
  // dataArray[0] = [];
  // dataArray[1] = [];
  // dataArray[2] = [];
  // {
  //   for (let i = 0; i < menuName.length; i++) {
  //     dataArray[0][i] = menuName[i];
  //     dataArray[1][i] = menuSubText[i];
  //     dataArray[2][i] = menuPrice[i];
  //   }
  //   console.log(dataArray);
  // }

  // 必要なテーブル行数の計算
  const calcRowSize = () => {
    let rowSize = (menuName.length >= menuSubText.length) ? menuName.length : menuSubText.length;
    rowSize = (rowSize >= menuPrice.length) ? rowSize : menuPrice.length;
    return rowSize;
  };

  // 空要素を送り込んで各項目数を合わせる
  const addBlankElements = () => {
    if (target === '2') { // ホットペッパーグルメの料理（空の説明文要素送り込み）
      let icon = document.querySelectorAll('.icon'); //アイコンが計算の邪魔になるので消す
      for (let i = 0; i < icon.length; i++) {
        icon[i].remove();
      }
      let menuTable = document.querySelectorAll(menuTableClass);
      for (let i = 0; i < calcRowSize(); i++) {
        if (!menuTable[i].nextElementSibling) {
          menuTable[i].insertAdjacentHTML('afterend', '<p class="catch"></p>');
        }
      }
    } else if (target === '4') { //食べログ（空の価格・説明文要素送り込み）
      let menuName = document.querySelectorAll(menuNameSelector);
      let menuNameWrapper = document.querySelectorAll(`${menuTableClass} .rstdtl-menu-lst__info-inner`);
      for (let i = 0; i < calcRowSize(); i++) {
        if (menuName[i].nextElementSibling === null) {
          menuName[i].insertAdjacentHTML('afterend', '<p class="rstdtl-menu-lst__price"></p>');
        }
        if (menuNameWrapper[i].nextElementSibling === null) {
          menuNameWrapper[i].insertAdjacentHTML('afterend', '<p class="rstdtl-menu-lst__ex"></p>');
        }
      }
    } else if (target === '6') { //ヒトサラ（空の価格・説明文要素送り込み）
      let menuName = document.querySelectorAll(menuNameSelector);
      let menuNameWrapper = document.querySelectorAll(`${menuTableClass} .txt`);
      for (let i = 0; i < calcRowSize(); i++) {
        if (!menuName[i].nextElementSibling) {
          menuName[i].insertAdjacentHTML('afterend', '<p class="desc"></p>');
        }
        if (menuNameWrapper[i].nextElementSibling === null) {
          menuNameWrapper[i].insertAdjacentHTML('afterend', '<p class="price"></p>');
        }
      }
    } else if (target === '8') { //Retty（空の価格送り込み）
      let menuName = document.querySelectorAll(menuNameSelector);
      for (let i = 0; i < calcRowSize(); i++) {
        if (!menuName[i].nextElementSibling) {
          menuName[i].insertAdjacentHTML('afterend', '<dd class="menu-price-list__price"></dd>');
        }
      }
    }

    // 送り込んだ空要素を含めて各項目再取得
    menuName = document.querySelectorAll(menuNameSelector);
    menuSubText = document.querySelectorAll(menuSubTextSelector);
    menuPrice = document.querySelectorAll(menuPriceSelector);
  };
  addBlankElements();
  console.log(menuName.length);
  console.log(menuSubText.length);
  console.log(menuPrice.length);

  // メニューの個数チェック
  const notification = document.getElementById('notification');
  const checkData = () => {
    if (calcRowSize() === 0) {
      notification.innerHTML = `<span>メニューが取得出来ません。セレクトボックスからサイトを選んでください。</span>`;
      notification.classList.add('notificationAlert');
      notification.classList.remove('notificationReady');
      btnGet.classList.add('disabled');
    } else {
      notification.innerHTML = `<span>メニュー取得準備OK！ 取得する個数${calcRowSize()}個</span>`;
      notification.classList.add('notificationReady');
      notification.classList.remove('notificationAlert');
      btnGet.classList.remove('disabled');
    }
  };
  checkData();

  // 特定サイトだけメニュー説明分無効化
  const menuSubTextDisable = () => {
    isMenuSubText.disabled = Boolean(target === '7');
    if (target === '7') {
      isMenuSubText.checked = false;
    }
  };
  menuSubTextDisable();

  //セレクタが変わった際各項目を取得し直す
  targetSite.addEventListener('change', () => {
    if (hasGet === true) {
      return;
    }
    target = targetSite.value;
    menuTableClass = SETTING[target].MENU_WRAPPER;
    menuNameSelector = `${menuTableClass} ${SETTING[target].MENU_NAME}`;
    menuSubTextSelector = `${menuTableClass} ${SETTING[target].MENU_SUBTEXT}`;
    menuPriceSelector = `${menuTableClass} ${SETTING[target].MENU_PRICE}`;

    menuName = document.querySelectorAll(menuNameSelector);
    menuSubText = document.querySelectorAll(menuSubTextSelector);
    menuPrice = document.querySelectorAll(menuPriceSelector);
    menuTitle = `\n<h2>${SETTING[target].MENU_TITLE}</h2>\n`;
    checkData();
    addBlankElements();
    // menuSubTextDisable();
    console.log(menuName.length);
    console.log(menuSubText.length);
    console.log(menuPrice.length);
  });

  // 表示エリアにHTML書き込み
  const sourceCode = document.getElementById('sourceCode');

  btnGet.addEventListener('click', () => {
    if (hasGet === true || btnGet.className === 'disabled') {
      return;
    }
    btnGet.classList.add('disabled');
    btnCopy.classList.remove('disabled');
    hasGet = true;
    targetSite.disabled = true;
    isMenuSubText.disabled = true;
    if (menuName.length !== 0) {
      sourceCode.innerHTML = '';
      sourceCode.insertAdjacentHTML('beforeend', menuTitle);
      buildMenuTable();
    }
  });

  // HTMLをクリップビードへコピー
  const execCopy = (string) => {
    let tmp = document.createElement('div');
    let pre = document.createElement('pre');
    pre.style.webkitUserSelect = 'auto';
    pre.style.userSelect = 'auto';
    tmp.appendChild(pre).textContent = string;
    let s = tmp.style;
    s.position = 'fixed';
    s.right = '200%';
    document.body.appendChild(tmp);
    document.getSelection().selectAllChildren(tmp);
    let result = document.execCommand('copy');
    document.body.removeChild(tmp);
    return result;
  };

  btnCopy.addEventListener('click', () => {
    if (hasGet === false) {
      return;
    }
    btnCopy.classList.add('disabled');
    btnGet.classList.remove('disabled');
    hasGet = false;
    execCopy(sourceCode.innerHTML);
    sourceCode.innerHTML = `<p style="text-align: center; line-height: 240px;"><strong>クリップボードにコピーしました！</strong></p>`;
    targetSite.disabled = false;
    isMenuSubText.disabled = false;
    // menuSubTextDisable();
  });

  // クリアボタン
  const btnClear = document.getElementById('btnClear');
  btnClear.addEventListener('click', () => {
    if (hasGet === false) {
      return;
    }
    hasGet = false;
    btnGet.classList.remove('disabled');
    btnCopy.classList.add('disabled');
    targetSite.disabled = false;
    isMenuSubText.disabled = false;
    sourceCode.innerHTML = '';
    menuSubTextDisable();
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