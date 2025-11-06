$(function () {
  //入力ボックス
  var person = prompt("一人称を入力して下さい");
  var txt = $('.BFenceSideLine table td textarea').text();
  if (person) {
    $('.BFenceSideLine table td textarea').text(
      txt.replace(/当店/g, person)
        .replace(/当社/g, person)
        .replace(/等/g, 'など')
        .replace(/させていただき/g, 'いたし')
        .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    );
  }
});