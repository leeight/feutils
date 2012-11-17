# Fer --gen_app

leeight (liyubei@baidu.com)  
2011/01/21

## 要解决的问题

1. 减少创建action时候的重复性工作
    * 创建action.js
    * 创建action.html
    * 修改mockup.html
    * 修改config.js
    * 修改data.js
    * 修改module.js
    * ...
2. 保证创建出来action的一致性，易于维护
    * 代码风格
    * ...
3. 易于action的调试
    * 创建完即可见
    * 创建完即可调试
    * ...
4. 为后续支持模块动态加载和系统文档的生成提供条件
5. 为后续基于idl自动生成相关的表单代码提供条件

## 如何解决

### Action的创建

#### 第一步：最基本的一个action

哪些内容对于一个action是必须的呢？我们首先通过手工创建好必须的文件和内容，然后将
手工创建的文件和内容模板化，在模板化的过程中，进行适当的扩展。我们会以`Hello World`作为例子
来演示我们创建Action的过程。首先创建三个必须的文件：

    // 文件列表
    src/jn/demo/helloworld.js
    src/jn/demo/helloworld.css
    src/jn/demo/helloworld.html

看起来是不是很熟悉呢？`逻辑`，`样式`，`结构`相分离？三个文件的内容请自行查看，这里就不列出了。
但是有了这三个文件，我们还是无法在页面中展示任何内容。

因为我们需要通过`er.controller.addModule`来注册一个模块，之后才能借助`module`中的配置，把一个`path`和`action`关联
起来，现在我们的`helloworld`仅仅是`action`，还缺少`module`和`path`这两个角色。

首先让我们来创建一个`module`，这里我们需要遵循编码规范，所有的`module`都用`module.js`来命名，它的角色
基本等同于以前的`ad.js` + `config.js` + `data.js`，我们在这里不进行区分了，都放到`module.js`里面了。

    // 文件列表
    src/js/demo/module.js

现在我们需要把`path`和`action`关联起来，方法就是修改`module.js`中`jn.demo.config`的配置，添加`action`配置字段

    :::javascript
    /**
     * @type {Object}
     * @const
     */
    jn.demo.config = {
        "action" : [
            {
                "location" : "/jn/demo/helloworld",
                "action" : "jn.demo.Helloworld"
            }
        ]
    };

OK，现在工作已经完成80%了，剩下的就是打开页面，调试我们这个action。但是页面在哪里呢？我们能够想到的最简单的方法就
是创建一个页面，把所需要的代码都加载进来，然后调试。不错，这是正确的解决问题思路，但是如何加载所需要的代码呢？如何
保证这些代码的加载顺序呢？这个问题没有最优的解决方案，但是有一个方案我感觉还是不错的，所以后续都是按照这个方式来处
理的，当然如果你有更好的方案也欢迎告诉我，帮我完善。

我们创建一个新的文件：`src/jn/demo/helloworld.app.html`，文件的内容很简单，请自行参考。

现在让我们在浏览器里面访问`src/jn/demo/helloworld.app.html`，正常情况下，应该能看到红色的`HELLO WORLD.`文字。

但是，一般情况下，我们第一次测试都会遇到问题，这次当然也不例外。如果没有什么特殊情况，我们遇到的错误提示信息应该是：

    goog.require could not find: jn.demo.Helloworld

这是因为我们还没有把`jn.demo.Helloworld`跟它所在的文件`src/jn/demo/helloworld.js`建立好对应关系，所以无法知道
从哪里去加载所需要的文件。建立好对应关系的方式非常简单，只需要在终端中切换到`webapp`目录，执行命令：

    ant deps

即可。

按照正常情况，应该没问题了，但是刷新浏览器之后，还是看不到红色的`HELLO WORLD.`，经过调试之后，我们发现是因为无法将`/jn/demo/helloworld`
这个`path`映射到`jn.demo.Helloworld`这个`action`导致的，而这个映射关系是在`src/jn/demo/module.js`中维护的，不过我们貌似还
没有加载这个文件 :-(

这里简单的分析一下原因：一般情况下，如果`jn.demo.Helloworld`对`jn.demo.config`或者`jn.demo.data`产生了依赖，会自动加载`module.js`，
因为我们的示例代码中没有这个依赖，而大多数情况下，这个依赖都是存在的，因此合乎常理的方法是修改`helloworld.js`，添加一个`jn.demo.config`
或者`jn.demo.data`的依赖即可。

    :::javascript
    goog.require("jn.demo.data");
    goog.require("jn.demo.config");

然后执行命令`ant deps`，更新依赖关系。

如果你对`ant deps`什么时候应该执行有疑问，我就简单的解释一下。并不是修改了js就需要执行`ant deps`，而是我们修改的js中对`goog.provide`或者
`goog.require`有影响才需要执行`ant deps`。

哈利路亚，终于看到红色的`HELLO WORLD.`文字了，看来我们的action可以正常工作了。

#### 第二步：使用控件

当看到页面中有红色的文字之后，我们希望在页面中添加更复杂的内容，比如一个按钮？此时我们创建一个新的action来作这个事情，创建的文件如下：

    // 文件列表
    src/jn/demo/helloui.js
    src/jn/demo/helloui.html
    src/jn/demo/helloui.css

之后更新：

    // 文件列表
    src/jn/demo/module.js

添加`path`到`action`的对应关系。

    :::javascript
    /**
     * @type {Object}
     * @const
     */
    jn.demo.config = {
        "action" : [
            ...
            {
                "location" : "/jn/demo/helloui",
                "action" : "jn.demo.Helloui"
            },
            ...
        ]
    };

然后创建mockup页面：

    // 文件列表
    src/jn/demo/helloui.app.html

最后执行命令`ant deps`，更新依赖关系。打开浏览器，查看效果，没有问题的话，我们应该可以看到页面上有一个按钮了 :-)

这里说明一下，`jn.demo.Helloui`对`ui.Button`有依赖，但是我们没有在`src/jn/demo/helloui.html`中声明这个依赖，而是通过
分析`goog.include("jn/demo/helloui.html")`间接计算出来的。

#### 第三步：创建工具

从`第一步`和`第二步`的过程我们不难发现，创建一个可以调试的Action，只需要创建三个文件`action.js`, `action.html`, `action.css`，然后
更新或者创建`module.js`，之后创建一个`{action}.app.html`来进行调试即可。

能找到规律，就不难创建工具了，首先描述一下理想情况下我想要工具的样子：

默认情况下，执行命令：

    Fer --gen_app --name "jn.demo.ShowCase"

会导致如下的结果：

    // +表示增加, M表示修改
    + src/jn/demo/show_case.js
    + src/jn/demo/show_case.css
    + src/jn/demo/show_case.html
    + src/jn/demo/show_case.app.html
    M src/jn/demo/module.js

在`module.js`中会自动创建好`/jn/demo/show_case`和`jn.demo.ShowCase`的映射关系，之后我们访问`show_case.app.html`会直接看到默认的效果了.

我还希望它能支持额外的参数，例如：

    :::bash
    Fer --gen_app --name "jn.demo.ShowCase" \
        [--action_path "/jn/demo/xxx" [--super_class "er.ListAction"]]
    Fer --gen_app --name "jn.dashboard.Gold" --super_class "er.FormAction"
    Fer --gen_app --name "jn.dashboard.Landmark" --super_class "er.ListAction"

此外，如果要创建的`Action`或者`Path`已经存在了，给出相应的警告 :-)

#### 第四步：使用mockup数据

正常情况下，开发一个页面的时候，我们常常需要mockup一些后端的数据，为了演示这个例子，我们创建一个新的Action：

    // 文件列表
    src/jn/demo/hellodata.js
    src/jn/demo/hellodata.html
    src/jn/demo/hellodata.css

之后更新

    // 文件列表
    src/jn/demo/module.js

添加`path`和`action`的依赖关系：

    :::javascript
    /**
     * @type {Object}
     * @const
     */
    jn.demo.config = {
        "action" : [
            ...
            {
                "location" : "/jn/demo/hellodata",
                "action" : "jn.demo.Hellodata"
            },
            ...
        ],

        "url" : {
            "ad_list" : "/api/demo/jn/demo/ad_list",
            "order_list" : "/api/demo/jn/demo/order_list"
        }
    };

添加数据访问接口：

    :::javascript
    /**
     * 后端数据访问接口
     * @type {Object.<string, function(string, Function, Function)>}.
     */
    jn.demo.data = jn.util.da_generator([
        {
            "name" : "ad_list",
            "url" : jn.demo.config.url.ad_list
        },
        {
            "name" : "order_list",
            "url" : jn.demo.config.url.order_list
        }
    ]);

然后更新`src/jn/demo/hellodata.js`，实现`initModel`和`afterInit`方法，如下：

    :::javascript
    /** @inheritDoc */
    jn.demo.Hellodata.prototype.initModel = function(argMap, callback) {
        this.model['fields'] = [
            jn.demo.Fields.ADVERTISER_NAME_FIELD,
            jn.demo.Fields.KEYWORDS_FIELD,
            jn.demo.Fields.STATUS_FIELD
        ];
        callback();
    }

    /** @inheritDoc */
    jn.demo.Hellodata.prototype.afterInit = function() {
        this.list = this.page.getChild('list');
        this.requesterList = jn.demo.data.ad_list;
    }

最后，同样创建`hellodata.app.html`，查看效果 :-)

#### 第五步：生成可部署的代码

前面所有的例子，都是基于可调试的代码，并不是可以去线上部署的代码。为了能够正常的去线上
部署代码，我们需要一些额外的工作。这里需要涉及一个概念`entry_point`，实际上所有的`*.app.html`都是`entry_point`，因为
我们所有的代码都是从`*.app.html`开始执行的，所以如果需要生成可部署的代码，执行如下的命令即可：

    Fer --gen_deploy --entry_point helloworld.app.html
    Fer --gen_deploy --entry_point helloui.app.html
    Fer --gen_deploy --entry_point hellodata.app.html

经典的用法如下：

    cd webapp
    python externs/sdcfe/tools/bin/Fer.py
           --gen_deploy
           -p src
           --entry_point src/jn/dashboard/landmark.app.html
           -f "--compilation_level=BAIDU_OPTIMIZATIONS"
           -f "--formatting=PRETTY_PRINT"
           -f "--warning_level=VERBOSE"
           -f "--externs=src/tangram.externs.js"
           -f "--externs=src/pdc.externs.js"
           -j assets/js/tangram-base-1.3.7.1.js

这么主要介绍一下`-j`参数，我们需要保证当执行`Fer.py`的时候，`-j`指明的文件路径是存在的。例如`-j`的值是
`this/is/a/path/tangram.js`，那么在生成的`landmark.app.html`的文件中，会自动生成`<script src="assets/js/tangram.js"></script>`，当然
还会同时建立好目录`assets/js`。

##### 工作过程

1. 分析`entry_point.html`，解析出所有的内联js代码，合并到一起用来后续进行分析，以Hello World为例，我们解析出来的代码如下：

        :::javascript
                goog.require('app.Launch');
                goog.require('er.controller');
                goog.require('er.locator');

                goog.require('jn.demo.Helloworld');

                if (!COMPILED) {
                    // goog.require('jn.demo.mockup');
                }

        baidu.on(window, 'load', function(){
            // app.Launch用来保证所有的模板和样式都加载完了
            // FIXME 解决IE6下面的样式overflow的问题？
            app.Launch(function() {
                er.controller.init();
                var loc = er.locator.getLocation();
                if (!loc || loc == '/') {
                    er.locator.redirect('/jn/demo/helloworld');
                }
            });
        });

2. 通过分析上一步获取到的js代码中的`goog.require`，获取到一个文件列表，如下：

        :::javascript
        src/base.js 
        src/er/base.js 
        src/er/template.js 
        src/base/Object.js 
        src/base/EventDispatcher.js 
        src/ui/LifeCycle.js 
        src/base/PropertyChangeNotifier.js 
        src/base/BaseModel.js 
        src/ui/Control.js 
        src/ui/Page.js 
        src/base/Converter.js 
        src/ui/InputControl.js 
        src/Validator.js 
        src/ui/util.js 
        src/base/Worker.js 
        src/app/worker.js 
        src/app/app.js 
        src/er/config.js 
        src/er/locator.js 
        src/er/controller.js 
        src/base/ParamAdapter.js 
        src/er/pdc.js 
        src/base/DataSource.js 
        src/base/ListDataSource.js 
        src/er/Action.js 
        src/ui/Button.js 
        src/ui/Mask.js 
        src/ui/Dialog.js 
        src/ui/Dialog.alert.js 
        src/jn/gold/coup/loading.js 
        src/er/context.js 
        src/Requester.js 
        src/jn/util.js 
        src/jn/demo/module.js 
        src/jn/demo/helloworld.js 
        /tmp/tmpZNSX4j.js     // 这个文件就是保存第一步解析出来的那些代码

3. 分析这个文件列表中的每个文件，找到符合`goog.include("*.css")`的特征的代码，将所有的css文件合并到一个css文件中。
   同时将符合`goog.include("*.html")`特征的代码，合并到tpl.html文件中。

4. 另外，因为css文件中会引用到图片，那么在合并css代码之前，需要对每个css文件进行rewrite，规则就是找到所有`background:`或者`background-image:`属性，
   如果里面有`url(...)`的样式定义，就对`url()`中引用的文件进行重写，例如：

        :::css
        div { background: url(../../assets/img/esui.png); }
        /** 重写为 */
        div { background: url(assets/image/esui-7ff04e745d9498b864485adad6733f4f.png); }

    同时，相应的资源文件也会被拷贝到输出目录中去。

5. 另外，我们还需要对最终输出的js代码中的一些文件路径进行重写定义，主要有两个：

        :::javascript
        /**
         * deploy模式下模板的路径
         * @define {string}
         */
        app.asyncResource = 'tpl.html';

        /**
         * history文件路径
         * @define {string}
         */
        er.config.CONTROL_IFRAME_URL = "/assets/history.html";

    只需要在编译的时候，通过传递`--define`参数来修改这两个变量的值即可。

6. 在整个生成部署代码的过程中，有一个`AssetsManager`用来管理所有的资源，它的用法很简单，传递给它一个可以
   访问的文件路径，然后它返回一个新的路径，例如：

        :::python
        am = assets_manager.AssetsManager("/tmp/output")
        print am.add("assets/js/tangram-base-1.3.7.1.js")

    同时会自动将这个资源拷贝到`/tmp/output`的合适目录中

7. 最终，部署代码中的资源路径都是相对于最后输出的`helloworld.app.html`的，不存在绝对路径的情况了(__还需完善__)。

当然，为了简化`Fer --gen_deploy`的调用，我们已经更新了`build.xml`，可以直接通过调用`app.deploy`这个target来完成，例如：

    ant app.deploy -Dentry_point=src/jn/dashboard/landmark.app.html -Doutput_dir_name=app

### Action的规范

1. 模块的命名`module.js`
2. jn.this\_is\_a\_module.ShowCase
3. Action对应的的View名称应该是`MAIN_PAGE_jn_this_is_a_module_showcase`
4. View中的主容器元素的class应该是：`ac-jn-this-is-a-module-showcase`
5. 不要害怕多写代码，compiler会帮你优化

## 依赖

1. Fer --gen\_deps
2. 所有的命令都是在`webapp`目录下面执行
3. cssutils对css进行重写的时候，可能导致某些样式丢失，需要修复这个问题(__TODO__)

<style type="text/css">
@page { 
    @top-left {
      /* content: "TOP SECRET"; */
      /* color: red */
    }
    @bottom-right {
        content: counter(page);
        font-style: italic;
    }
}
</style>
