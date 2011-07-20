function Xg(a, b) {
  var c = [], d = 0, e = a.length, f, g;
  if("function" == typeof b) {
    for(g = 0;g < e;g++) {
      f = a[g], !0 === b.call(a, f, g) && (c[d++] = f)
    }
  }
  return c
}
function Yg() {
  Wg.call(this);
  this.j = new Pg({});
  this.view = "communityForm"
}
K(Yg, Wg);
q = Yg.prototype;
q.di = "/community/list";
q.Ie = function(a, b) {
  var c = this, d = new hc;
  c.j["repeater.ds"] = Xg(B.get("productTypeList"), function(a) {
    return a.value.indexOf(",") == -1
  });
  c.j["repeater.tpl"] = Lb.get("communityPriceTpl");
  if(this.Db()) {
    var e = new ec("/community/read", "id=" + a.nc.id, function(a) {
      a.success == "true" && Zg(c, a.result)
    });
    gc(d, e)
  }
  this.j.sh = this.Db() ? "\u4fee\u6539\u751f\u6d3b\u5708" : "\u6dfb\u52a0\u751f\u6d3b\u5708";
  this.j.Di = this.j.sh;
  Ib(d, "DONE", b);
  d.start()
};
function Zg(a, b) {
  jb(b.sale_price, function(b, d) {
    a.j["sale_price[" + d + "]"] = b
  });
  a.j.name = b.name
}
q.ob = o();
q.bc = function() {
  this.form = R(this.page, "form");
  this.ua = R(this.form, "btnSubmit");
  this.cb = R(this.form, "btnCancel");
  this.Lb = this.Db() ? Qg.data.update : Qg.data.create
};
q.Ab = o();
q.Tb = function() {
  if(this.Db()) {
    return"id=" + this.za.nc.id
  }
};
t("community.Form", Yg, i);
Cf(wf.na(), "community.form.app");

//@ sourceURL=/test/dn/community/module_community.form.app.js