'use strict';
{
  let hostname = window.location.hostname;
  //もしwww.があればそれより前は削除する
  if (hostname.indexOf("www.") != -1) {
    hostname = hostname.slice(hostname.indexOf("www.") + 4);
  }
  //hostnameの先頭6文字を切り出して前後反転する。
  let password = hostname.slice(0, 6).split("").reverse().join("");
  //ダイアログでdomainを表示する
  alert(password);
}