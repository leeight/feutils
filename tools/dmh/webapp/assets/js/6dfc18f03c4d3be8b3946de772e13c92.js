function SlideShow(a) {
    this.max = 3;
    this.duration = 5;
    this.current_ = -1;
    this.handlers_ = [];
    $.extend(this, a)
}
SlideShow.prototype.dispatchEvent = function(a) {
    var d = null;
    for (var c = 0, b = this.handlers_.length; c < b; c++) {
        try {
            d = this.handlers_[c];
            d.fn.call(d.context || null, a)
        } catch(f) {}
    }
    this.current_ = a
};
SlideShow.prototype.addCallback = function(a) {
    var b = a;
    if (typeof a == "function") {
        b = {
            fn: a
        }
    }
    this.handlers_.push(b)
};
SlideShow.prototype.setIndex = function(a) {
    this.current_ = a
};
SlideShow.prototype.getIndex = function() {
    return this.current_
};
SlideShow.prototype.go = function(a) {
    if (a != this.getIndex()) {
        if (this.timer_ > 0) {
            this.stop();
            this.dispatchEvent(a);
            this.start()
        } else {
            this.dispatchEvent(a)
        }
    }
};
SlideShow.prototype.next = function() {
    this.go((this.current_ + 1) % this.max)
};
SlideShow.prototype.prev = function() {
    this.go(Math.max((this.current_ - 1 + this.max) % this.max, 0))
};
SlideShow.prototype.stop = function() {
    if (this.timer_ != null) {
        clearTimeout(this.timer_);
        this.timer_ = null
    }
};
SlideShow.prototype.start = function() {
    var a = this;
    this.timer_ = setTimeout(function() {
        a.next()
    },
    this.duration * 1000)
};
function BaiduQueryString(a) {
    var c = top.location.href;
    c = c.replace("?", "?&").split("&");
    var b = "";
    for (i = 1; i < c.length; i++) {
        if (c[i].indexOf(a + "=") == 0) {
            b = c[i].replace(a + "=", "");
            return b
        }
    }
    return null
}
function DisplayErrorMessage(a) {
    $(".login-failed").html(a).css("visibility", "visible")
}
$(function() {
    if (typeof UC_LOGIN_POST_URL != 'undefined') {
      // 首先需要更新一下登录框中的链接地址
      $("form[name=lf]").attr("action", UC_LOGIN_POST_URL);
      $("input[name=appid]").val(UC_APP_ID);
      $("input[name=fromu]").val(UC_LOGIN_SUCCESS_URL);
      $("input[name=selfu]").val(UC_LOGIN_FAIL_URL);
    } else {
      alert('人品错误,请刷新页面');
    }

    $("#refresh-verify-code").click(function() {
        $("#verify-code-image").attr("src", UC_LOGIN_VERIFYCODE_URL + "&cb_random=" + Math.random());
        return false
    });
    $("#refresh-verify-code").click();

    $(".login-failed").ajaxError(function() {
        DisplayErrorMessage("\u670d\u52a1\u5668\u5fd9\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\u3002")
    });
    if (BaiduQueryString("e")) {
        var e = BaiduQueryString("errno");
        if (e == "135") {
            DisplayErrorMessage('\u8d26\u6237\u88ab\u9501\u5b9a,\u8bf7\u7528\u201c<a href="http://adm.baidu.com/findPassword.jsp">\u5fd8\u8bb0\u5bc6\u7801</a>\u201d\u89e3\u9501')
        } else {
            DisplayErrorMessage(decodeURI(BaiduQueryString("e")))
        }
    }
    if (BaiduQueryString("ln")) {
        $("#username").val(BaiduQueryString("ln"));
        $("#password").focus()
    } else {
        $("#username").focus()
    }
    var d = new Date().getTime();
    var b = 0;
    function a(g) {
        var h = "csi" + (b++);
        var f = new Image;
        f.src = g;
        f.onerror = f.onload = f.onabort = function() {
            try {
                delete window[h];
                f = null
            } catch(j) {}
        };
        window[h] = f
    }
    function c(g) {
        var f = "/csi?username=" + encodeURIComponent(g) + "&.stamp=" + d;
        a(f);
        setTimeout(function() {
            document.lf.submit()
        },
        200)
    }
    $("form").eq(0).submit(function() {
        var h = $("#username").val(),
        g = $("#password").val(),
        f = $("#verify-code").val();
        if (!$.trim(h)) {
            DisplayErrorMessage("\u8bf7\u8f93\u5165\u7528\u6237\u540d");
            $("#username").focus()
        } else {
            if (g == "") {
                DisplayErrorMessage("\u8bf7\u8f93\u5165\u5bc6\u7801");
                $("#password").focus()
            } else {
                if (!$.trim(f)) {
                    DisplayErrorMessage("\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801");
                    $("#verify-code").focus()
                } else {
                    if (h.indexOf("@") != -1) {
                        $.post("/user!getUserName.action", {
                            userName: h
                        },
                        function(j) {
                            if (j.success == "true") {
                                $("input[name='entered_login']").val(j.userName);
                                c(j.userName)
                            } else {
                                DisplayErrorMessage(j.message.field.userName)
                            }
                        },
                        "json")
                    } else {
                        $("input[name='entered_login']").val(h);
                        c(h)
                    }
                }
            }
        }
        return false
    });
    $.each(["adm-button", "adm-register-button"], function(g, f) {
        $("." + f).hover(function() {
            $(this).attr("class", f + "-hover")
        },
        function() {
            $(this).attr("class", f)
        }).mousedown(function() {
            $(this).attr("class", f + "-active")
        }).mouseup(function() {
            $(this).attr("class", f)
        })
    })
});
$(function() {
    var a = new SlideShow({
        duration: 15
    });
    a.setIndex(0);
    a.addCallback(function(c) {
        $(".slide-show-navi span").removeClass("slide-show-navi-active").eq(c).addClass("slide-show-navi-active");
        $(".slide-image-content img").hide().eq(c).fadeIn()
    });
    a.start();
    $(".slide-show-navi span").each(function(c, d) {
        $(this).data("index", c)
    }).click(function() {
        var c = $(this).data("index");
        a.go(c);
        return false
    });
    $("#slide .prev a").click(function() {
        a.prev();
        return false
    });
    $("#slide .next a").click(function() {
        a.next();
        return false
    });
    try {
        document.execCommand("BackgroundImageCache", false, true)
    } catch(b) {}
});
$(function() {
    var a = new SlideShow({
        max: 2,
        duration: 10
    });
    a.addCallback(function(b) {
        var d = $("#success-cases .slide-content > div").hide().eq(b);
        var c = d.data("loaded");
        if (!c) {
            d.find("img").each(function() {
                $(this).attr("src", $(this).attr("url"));
                $(this).removeAttr("url")
            });
            d.data("loaded", true)
        }
        d.fadeIn()
    });
    $("#success-cases .prev a").click(function() {
        a.prev();
        return false
    });
    $("#success-cases .next a").click(function() {
        a.next();
        return false
    });
    a.next();
    a.start()
});
$(function() {
    var a = new SlideShow({
        max: 3,
        duration: 10
    });
    a.addCallback(function(b) {
        var d = $("#experience-sharing .slide-content > div").hide().eq(b);
        var c = d.data("loaded");
        if (!c) {
            d.find("img").each(function() {
                $(this).attr("src", $(this).attr("url"));
                $(this).removeAttr("url")
            });
            d.data("loaded", true)
        }
        d.fadeIn()
    });
    $("#experience-sharing .prev a").click(function() {
        a.prev();
        return false
    });
    $("#experience-sharing .next a").click(function() {
        a.next();
        return false
    });
    a.next();
    a.start()
});
