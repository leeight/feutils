<?php
/*
 * Created on 2011-7-5
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */
$action = $_GET['action'];

$filename = $_POST['filename'];

$vframes = $_POST['vframes'];

$size = isset($_POST['video_size']) ? $_POST['video_size'] : '306x228';

$bps = $_POST['video_bps'];

$ss = $_POST['timePerFrame'] * $_POST['video_satrt_frame_count'] / 1000;

$crop = $_POST['video_crop'];


if(!isset($filename)) {
	die('please enter file name!');
}

$action = isset($action) ? $action : 'convert';

$queryArr = Array(
	"frames"=>$vframes, 
	"crop"=>$crop, 
	"start"=>$ss, 
	"size"=>$size, 
	"bps"=>$bps, 
	"o"=>$action,
	"filename"=>$filename,
	"bin"=>'ffmpeg'
);

echo	'{' .
		'	success:"true",' .
		'	message:{},' .
		'	result:{';
echo			convertVideo($queryArr).
				'print:\'end\''.
	 		'}' .
		'}';

function convertVideo($queryArr){
	$handle = fopen("http://127.0.0.1:8999/?".http_build_query($queryArr), "rb");
	$contents = stream_get_contents($handle);
	fclose($handle);
	return $contents;
}
?>
