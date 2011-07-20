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

$bsp = $_POST['video_bps'];

$ss = $_POST['timePerFrame'] * $_POST['video_satrt_frame_count'] / 1000;

$crop = $_POST['video_crop'];


if(!isset($filename)) {
	die('please enter file name!');
}

$action = isset($action) ? $action : 'convert';

$args = array('python',
	'video.py -f '. $vframes .' -p ' . $ss .' -c '. $crop . ' -s '. $size .' -b '. $bsp .' -o '.$action, 'upload/'.$filename
);

echo	'{' .
		'	success:"true",' .
		'	message:{},' .
		'	result:{';
				system(implode(' ', $args), $status);
echo			'print:\''.implode(' ', $args).'\''.
	 		'}' .
		'}';
?>
