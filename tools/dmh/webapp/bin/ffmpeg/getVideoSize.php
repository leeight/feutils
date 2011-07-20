<?php
/*
 * Created on 2011-7-5
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */

function getVideoSize($filename){
	$args = array('python',
		'getVideoSize.py', $filename
	);
	$wxh = system(implode(' ', $args), $status);
	
}

getVideoSize('../../test.wmv');
?>
