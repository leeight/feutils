function $g(a, b) {
  return aa[a] = b
}
Vg.prototype.Fe = $g(0, function(a, b) {
  if(this.wd) {
    var c = this, d = c.j.get("selectedItems"), e = [], f = [];
    yb(d, function(a) {
      e.push(a.id)
    });
    f.push("ids=" + e.join(","));
    gb(a) && f.push(a + "=" + b);
    this.wd(f.join("&"), function() {
      c.list.getData()
    })
  }
});
function ah(a, b) {
  for(var c in a) {
    if(a[c] === b) {
      return c
    }
  }
  return l
}
function bh() {
  Vg.call(this);
  this.j = new Pg({fields:Qg.qd.Hc, selectedItems:l, searchParams:l, listState:l});
  this.view = "communityList"
}
K(bh, Vg);
bh.prototype.bc = function(a) {
  this.qh = R(a, "formSearch");
  this.Za = R(a, "pnlOperation");
  this.list = R(a, "list");
  this.Ze = Qg.data.list;
  this.wd = Qg.data.status_update
};
bh.prototype.Ab = function() {
  var a = this, b = R(this.Za, "batch-archive-button"), c = ah(B.get("communityStatusMap"), Ua(b.a("label")).innerHTML);
  if(gb(c)) {
    b.onclick = function() {
      a.Fe("status", c)
    }
  }
};
t("community.List", bh, i);
Cf(wf.na(), "community.list.app");

//@ sourceURL=/test/dn/community/module_community.list.app.js