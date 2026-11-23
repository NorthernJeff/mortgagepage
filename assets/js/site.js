/* MortgagePage.ca: renders the rates table and news lists from the data files. */
(function(){
  "use strict";
  var root = document.documentElement.getAttribute("data-root") || "";

  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function src(p){ return /^(https?:)?\/\//.test(p) ? p : root + p; }

  /* ---------- Rates ---------- */
  var TERM_LABEL = { "6-month":"6-Month", "1-year":"1-Year", "2-year":"2-Year", "3-year":"3-Year", "4-year":"4-Year", "5-year":"5-Year", "7-year":"7-Year", "10-year":"10-Year" };

  function num(x){ return typeof x === "number" && isFinite(x); }

  function cell(r, kind, extra){
    if (!r) return '<div class="mp-cell empty"></div>';
    var has = typeof r.rate === "number" && isFinite(r.rate);
    var lender = r.logo
      ? '<img src="' + esc(src(r.logo)) + '" alt="' + esc(r.lender || "Lender logo") + '" loading="lazy">'
      : (r.lender ? '<span>' + esc(r.lender) + '</span>' : "");
    var btn = has ? '<a class="mp-inquire" href="' + esc(r.inquire || "#") + '"' + (r.inquire ? (/^https?:/.test(r.inquire) ? ' target="_blank" rel="noopener"' : "") : ' data-nolink="1"') +
      ' aria-label="Inquire about the ' + esc(r.term) + ' ' + kind + ' rate">Inquire</a>' : "";
    var tag = kind === "fixed" ? "Fixed" : kind === "HELOC" ? "HELOC" : "Variable";
    return '<div class="mp-cell' + (extra && extra.cls ? " " + extra.cls : "") + '"><span class="mp-tag">' + tag + '</span>' +
      '<span class="mp-rate' + (has ? "" : " none") + '">' + (has ? r.rate.toFixed(2) + "%" : "&ndash;") +
      (extra && extra.note ? '<small class="mp-ratenote">' + esc(extra.note) + '</small>' : "") + '</span>' +
      '<span class="mp-lender">' + lender + '</span>' + btn + '</div>';
  }

  function renderRates(){
    var box = document.getElementById("mpRates");
    if (!box || !window.MP_RATES) return;
    var R = window.MP_RATES, rows = "";
    var order = [];
    (R.fixed || []).concat(R.variable || []).forEach(function(r){ if (order.indexOf(r.term) < 0) order.push(r.term); });
    order.sort(function(a, b){ return months(a) - months(b); });
    order.forEach(function(t){
      var f = (R.fixed || []).filter(function(r){ return r.term === t; })[0];
      var v = (R.variable || []).filter(function(r){ return r.term === t; })[0];
      rows += '<div class="mp-row" role="row"><div class="mp-term" role="rowheader">' + esc(TERM_LABEL[t] || t) + '</div>' + cell(f, "fixed") + cell(v, "variable") + '</div>';
    });
    var h = R.heloc;
    if (h){
      var prime = num(R.prime) ? R.prime : null;
      var spread = num(h.spread) ? h.spread : 0;
      var hr = num(h.rate) ? h.rate : (prime !== null ? Math.round((prime + spread) * 100) / 100 : null);
      var note = num(h.rate) ? "" : (prime !== null ? "Prime " + (spread < 0 ? "\u2212 " : "+ ") + Math.abs(spread).toFixed(2) + "%" : "");
      var hc = { term: "HELOC", rate: hr, lender: h.lender, logo: h.logo, inquire: h.inquire };
      rows += '<div class="mp-row mp-row-heloc" role="row"><div class="mp-term" role="rowheader">HELOC</div>' + cell(hc, "HELOC", { cls: "mp-span", note: note }) + '</div>';
    }
    box.innerHTML = rows;

    var pr = document.getElementById("mpPrime");
    if (pr){
      if (num(R.prime)) pr.innerHTML = 'The Prime rate is currently <strong>' + R.prime.toFixed(2) + '%</strong>.';
      else pr.hidden = true;
    }
    box.addEventListener("click", function(e){
      var a = e.target.closest && e.target.closest("a[data-nolink]");
      if (a) e.preventDefault();
    });

    var up = document.getElementById("mpUpdated");
    if (up){
      var d = R.updated ? new Date(R.updated) : null;
      if (d && !isNaN(d)){
        var tz = { timeZone: "America/Toronto" };
        var time = d.toLocaleTimeString("en-CA", Object.assign({ hour:"numeric", minute:"2-digit", timeZoneName:"short" }, tz));
        var date = d.toLocaleDateString("en-CA", Object.assign({ year:"numeric", month:"long", day:"numeric" }, tz));
        up.textContent = "Rates last updated at " + time + " on " + date;
        up.hidden = false;
      } else {
        up.textContent = "Rates coming soon.";
        up.hidden = false;
      }
    }
  }
  function months(t){ var m = /^(\d+)-(month|year)/.exec(t); return m ? (+m[1]) * (m[2] === "year" ? 12 : 1) : 999; }

  /* ---------- News ---------- */
  function dateText(iso){
    var p = String(iso || "").split("-");
    if (p.length !== 3) return "";
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-CA", { year:"numeric", month:"long", day:"numeric" });
  }
  function renderNews(){
    var list = window.MP_NEWS || [];
    document.querySelectorAll("[data-news]").forEach(function(box){
      var limit = +box.getAttribute("data-news") || list.length;
      var items = list.slice(0, limit);
      if (!items.length){
        box.innerHTML = '<div class="mp-empty">No articles yet. Check back soon for mortgage news and updates.</div>';
        var more = document.getElementById("mpNewsMore"); if (more) more.hidden = true;
        return;
      }
      box.innerHTML = '<div class="mp-cards">' + items.map(function(a){
        return '<a class="mp-card news" href="' + esc(root + "news/" + a.slug + ".html") + '">' +
          (a.image ? '<img src="' + esc(src(a.image)) + '" alt="' + esc(a.imageAlt || "") + '" loading="lazy">' : "") +
          '<div class="mp-card-body"><span class="mp-date">' + esc(dateText(a.date)) + '</span><h3>' + esc(a.title) + '</h3>' +
          (a.summary ? '<p>' + esc(a.summary) + '</p>' : "") + '<span class="mp-go">Read article &rarr;</span></div></a>';
      }).join("") + '</div>';
    });
  }

  function start(){ renderRates(); renderNews(); }
  if (document.readyState !== "loading") start(); else document.addEventListener("DOMContentLoaded", start);
})();
