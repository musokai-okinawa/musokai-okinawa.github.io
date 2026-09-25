/* 那覇稽古会の稽古日程（index.html / en.html 共用）
   閲覧日（日本時間）から「今月」と「来月」の分だけを表示する。月が替われば自動で切り替わる。
   日程の追加・変更はこの SCHEDULE だけを直す。
   書式: "YYYY-MM-DD HH:MM-HH:MM [場所キー] [#セミナー]"
   場所キーなし = 沖縄空手会館 鍛錬室 */
(function(){
  var SCHEDULE = [
    "2026-09-05 14:00-17:30",
    "2026-09-13 14:00-17:30",
    "2026-09-19 11:00-14:00",
    "2026-09-26 16:00-19:30",

    "2026-10-04 15:00-18:30",
    "2026-10-10 14:00-17:30",
    "2026-10-18 09:00-12:00",
    "2026-10-25 14:00-17:30",

    "2026-11-01 14:00-18:00",
    "2026-11-08 12:00-16:00",
    "2026-11-15 14:00-18:00",
    "2026-11-21 16:00-20:00",
    "2026-11-28 14:00-18:00",

    "2026-12-05 11:00-19:00 #seminar",
    "2026-12-06 09:00-19:00 #seminar",
    "2026-12-20 11:00-15:00",
    "2026-12-27 11:00-15:00",

    "2027-01-10 12:00-16:00",
    "2027-01-17 11:00-15:00",
    "2027-01-24 12:00-16:00",
    "2027-01-31 11:00-15:00 kenshuB",

    "2027-02-06 10:30-13:30 onoyama",
    "2027-02-14 10:00-13:00",
    "2027-02-21 16:00-20:00",
    "2027-02-28 10:30-13:30 onoyama",

    "2027-03-07 10:30-13:30 onoyama",
    "2027-03-14 10:30-13:30 onoyama",
    "2027-03-20 11:00-15:00",
    "2027-03-28 12:00-16:00",

    "2027-04-04 11:00-15:00",
    "2027-04-11 11:00-15:00",
    "2027-04-18 11:00-15:00",
    "2027-04-24 11:00-15:00"
  ];

  var T = {
    ja: {
      wd: ["日","月","火","水","木","金","土"],
      month: function(y,m){ return y + "年" + m + "月"; },
      date: function(m,d,w){ return m + "/" + d + "（" + w + "）"; },
      dash: "〜",
      place: { kenshuB: "研修室B", onoyama: "奥武山" },
      seminar: "セミナー",
      done: "終了",
      none: "日程は決まり次第掲載します。お問い合わせください。"
    },
    en: {
      wd: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      month: function(y,m){ return ["January","February","March","April","May","June","July","August","September","October","November","December"][m-1] + " " + y; },
      date: function(m,d,w){ return w + " " + m + "/" + d; },
      dash: "–",
      place: { kenshuB: "Seminar Room B", onoyama: "Onoyama" },
      seminar: "Seminar",
      done: "Done",
      none: "Dates will be posted once confirmed. Please contact us."
    }
  };

  function todayJST(){
    try {
      return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Tokyo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
    } catch(e) {
      var n = new Date(Date.now() + 9*3600*1000);
      return n.toISOString().slice(0,10);
    }
  }

  function parse(s){
    var p = s.split(/\s+/), ymd = p[0].split("-"), tm = p[1].split("-"), e = {
      iso: p[0], y: +ymd[0], m: +ymd[1], d: +ymd[2], from: tm[0], to: tm[1], place: null, seminar: false
    };
    for (var i = 2; i < p.length; i++) {
      if (p[i] === "#seminar") e.seminar = true; else e.place = p[i];
    }
    e.wd = new Date(Date.UTC(e.y, e.m-1, e.d)).getUTCDay();
    return e;
  }

  function el(tag, cls, text){
    var x = document.createElement(tag);
    if (cls) x.className = cls;
    if (text != null) x.textContent = text;
    return x;
  }

  function render(box){
    var t = T[box.getAttribute("data-lang")] || T.ja;
    var today = todayJST(), y = +today.slice(0,4), m = +today.slice(5,7);
    var months = [[y, m], m === 12 ? [y+1, 1] : [y, m+1]];
    var list = SCHEDULE.map(parse);
    box.innerHTML = "";
    months.forEach(function(ym){
      var col = el("div","sched-month");
      col.appendChild(el("h4",null,t.month(ym[0], ym[1])));
      var items = list.filter(function(e){ return e.y === ym[0] && e.m === ym[1]; });
      if (!items.length) { col.appendChild(el("p","sched-none",t.none)); box.appendChild(col); return; }
      var ul = el("ul");
      items.forEach(function(e){
        var past = e.iso < today;
        var li = el("li", past ? "past" : null);
        li.appendChild(el("span","sched-date",t.date(e.m, e.d, t.wd[e.wd])));
        li.appendChild(el("span","sched-time",e.from + t.dash + e.to));
        if (e.place) li.appendChild(el("span","sched-tag",t.place[e.place] || e.place));
        if (e.seminar) li.appendChild(el("span","sched-tag sched-sem",t.seminar));
        if (past) li.appendChild(el("span","sched-done",t.done));
        ul.appendChild(li);
      });
      col.appendChild(ul);
      box.appendChild(col);
    });
  }

  var box = document.getElementById("nahaSchedule");
  if (box) render(box);
})();
