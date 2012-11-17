# Fserver

基于er的项目的一个本地调试工具。

一般来说，er的项目本地调试的时候，都是采用nginx，然后配置proxy_pass到后端去获取数据。如果想在ie下面
调试的时候，因为ie下面的[@import限制的问题](http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/ad1b6e88-bbfa-4cc4-9e95-3889b82a7c1d/)，还需要把对
css的请求proxy_pass到本地的一个static_server，这个server会返回合并之后的css文件，这样子一般来说就需要
有两套server（nginx和static_server）.

Fserver就是为了解决这个问题而准备的，可以理解为`Fserver = nginx + static_server`，但是具备更好的扩展性和跨平台性，因为是
用node.js开发的，大家都熟悉这个语言.

## 如何使用

1. 要使用之前，首先需要更新`feutils`，也就是切换到`WORK_DIR`，然后执行`svn update`
2. 然后我们创建一个最简单的`server.js`，示例如下：

        ```javascript
        var er = require('er-server');
    
        var server = new er.ErServer();
        server.start();
        ```

3. 我们把这个文件保存在`c:\work\server.js`，打开一个终端，切换到`c:\work`这个目录，然后执行命令：

        ```bash
        Fserver server.js
        ```

4. 正常情况下，如果没有报错，说明服务已经启动了，我们此时可以访问<http://localhost:8080/server.js>查看我们这个文件了.

5. OK，到现在为止，一个最简单的静态文件服务已经完成了，仅仅3行代码而已。

6. 现在我们要实现`proxy_pass`的功能了，因为一个er的应用，除了需要请求静态文件之外，我们还需要跟后端交互来获取数据，
   而这里的实现逻辑是*如果发现本地没有这个文件，那么就考虑去后端服务请求*，此时我们仅仅需要一个配置文件而已：

        ```javascript
        {
            "localhost:8090" : "jn.e.shifen.com"
        }
        ```

把这部分内容放到`c:\work\online.config.json`这个文件里面，然后重启服务，添加一个`--config`参数，如下：

        ```bash
        Fserver server.js --config online.config.json
        ```

7. 此时我们再次访问<http://localhost:8080/login_cfg/read>这个地址，因为本地找不到`c:\work\login_cfg\read`这个文件，那么
   就会去请求`http://jn.e.shifen.com/login_cfg/read`这个地址，然后把结果返回回来，符合预期.

8. OK，到现在为止，一个具备proxy_pass的静态文件服务器也完成了，仅仅3行代码和一个配置文件而已.

9. 现在我们要考虑完成自定义handler的功能，也就是当访问某个url的时候，我们希望返回自定义的内容，不是文件的真正内容。例如
   当我访问<http://localhost:8080/server.js>，需要返回`HELLO Fserver`，那么我们可以很简单的这么写：

        ```javascript
        var er = require("er-server");

        var server = new er.ErServer();
        server.addHandler("/server.js", function(){
          return "HELLO Fserver";
        });
        server.start();
        ```

10. 重启服务，然后再次访问<http://localhost:8080/server.js>，就会看到浏览器显示的结果已经变成`HELLO Fserver`了.

11. 如果想返回另外一个文件的内容怎么办呢？我们可以参考[NodeJS的API](http://nodejs.org/docs/latest/api/fs.html)，最简单的方式是
    这么写：

          ```javascript
          server.addHandler("/no_such_url.js", function(){
            var fs = require("fs");
            return fs.readFileSync("online.config.json", "utf8");
          });
          ```

12. exit(0)，更多请参考[锦囊里面的server.js](jn.server.js)
