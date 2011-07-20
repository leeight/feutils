<?php
//print_r($_FILES["filedata"]);

//获取文件类型
$type = $_FILES["filedata"]["type"];
//文件大小
$size = $_FILES["filedata"]["size"];
$kSize = round($size / 1024) . 'kb';
//临时文件名
$tmp_name = $_FILES["filedata"]["tmp_name"];
//上传的本地文件名
$filename = $_FILES["filedata"]["name"];
//不包含后缀文件抛弃
if(stristr($filename, '.') == false){
	die('文件类型不合法或后缀名错误，请上传视频文件！');
}
//拆分文件名和后缀
$fileprename = explode('.', $filename);

$name = $fileprename[0];
$ext = $fileprename[1];
//错误信息
$error = $_FILES["filedata"]["error"];
//上传的文件夹
$upload_dir = 'upload/';
//目标文件名
$targetname = $name . '-' . time() . '.' . $ext;
//执行上传逻辑
uploadfile($type, $name, $ext, $size, $error, $tmp_name, $targetname, $upload_dir);

$callback = $_GET['callback'];

echo '<script type="text/javascript">'.str_replace("\\","",$callback) . '(' .
		'{' .
		'	success:true,' .
		'	message:{},' .
		'	result:{';
				splitVideo($upload_dir.$targetname);
echo			'size:\''.$kSize.'\',' .
				'filename:\''.$filename.'\',' .
				'serverVideoFileName:\''.$targetname.'\''.
	 		'}' .
		'});' .
	'</script>';

/**
 * 文件上传
 */
function uploadfile($type, $name, $ext, $size, $error, $tmp_name, $targetname, $upload_dir) {
    $MAX_SIZE = 100000000;
    $FILE_MIMES = array('application/octet-stream', 'video/x-ms-wmv', 'video/quicktime');
    $FILE_EXTS = array('wmv', 'avi', 'mpeg', 'flv', 'mov');

    $file_path = $upload_dir.$targetname;
    
    if(!is_dir($upload_dir)) {
        if(!mkdir($upload_dir))
            die("文件上传目录不存在并且无法创建文件上传目录");
        if(!chmod($upload_dir,0755))
            die("文件上传目录的权限无法设定为可读可写");
    }
    
    if($size>$MAX_SIZE)
        die("上传的文件大小超过了规定大小");

    if($size == 0)
        die("请选择上传的文件");

    if(!in_array($type,$FILE_MIMES) || !in_array($ext,$FILE_EXTS))
        die("请上传符合要求的文件类型");

    if(!move_uploaded_file($tmp_name, $file_path))
        die("复制文件失败，请重新上传");

    switch($error) {
        case 0:
            return ;
        case 1:
            die("上传的文件超过了 php.ini 中 upload_max_filesize 选项限制的值");
        case 2:
            die("上传文件的大小超过了 HTML 表单中 MAX_FILE_SIZE 选项指定的值");
        case 3:
            die("文件只有部分被上传");
        case 4:
            die("没有文件被上传");
    }
}

function splitVideo($filename){
	
	$args = array('python',
		'video.py -o split', $filename
	);
	
	system(implode(' ', $args), $status);
}

?>