<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>${cur_dir}</title>
    <link rel="stylesheet" href="${rel_path}/_ADoc/public/style/default.css" type="text/css" media="screen, print"/>
    <style type="text/css">
    /*<![CDATA[*/
        #content {
            padding: 0 1em;
        }
    /*]]>*/
    </style>
    <link rel="shortcut icon" href="${rel_path}/_ADoc/public/favicon.ico" type="image/x-icon">
</head>
<body>
    <input type="hidden" id="file_rel_path" value="${rel_path}"/>
    <div id="header">ADoc Browser</div>
    <div id="content">	
        <div id="ADoc_dir">
            <div id="ADoc_dir_content">
                <div id="ADoc_dir_content_inner">
                    <div id="dir_search" class="lite_search">
                        <input type="text" value="" id="dir_search_input" autocomplete="off"/>
                        <div id="dir_search_result" class="lite_search_result"></div>
                        <div id="dir_search_result_bottom" class="lite_search_result_bottom"></div>
                    </div>
                    <div id="dir_list">
                    
                    </div>
                </div>
            </div>
            <div id="ADoc_dir_tree"></div>
        </div>
    </div>
</body>
<script src="${rel_path}/_ADoc/lib/dtree/dtree.js" type="text/javascript"></script>
<script src="${rel_path}/_ADoc/public/js/lib/Fl.js" type="text/javascript"></script>
<script src="${rel_path}/_ADoc/public/js/ADoc/dir.js" type="text/javascript"></script>
<script type="text/javascript">
    ADoc.dir.init("${cur_dir}", "${rel_path}");
</script>
</html>
