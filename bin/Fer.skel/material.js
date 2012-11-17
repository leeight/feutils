/***************************************************************************
 *
 * Copyright (c) %(app.create.year)s Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * src/%(app.package.path)s/%(app.action_name)s.js ~ %(app.create.time)s
 * @author %(app.user.email)s (%(app.user.name)s)
 * @version $Revision$
 * @description
 * %(app.action_name)s相关的实现逻辑
 **/

goog.require('ad.Debug');
goog.require('ad.Material');
goog.require('ad.widget.Title');
goog.require('ad.widget.Image');

goog.include('%(app.package.path)s/%(app.action_name)s.less');

goog.provide('%(app.name)s');

ad.Debug(function(){
    var material = new ad.Material(AD_CONFIG['id']);
    // material.setRender(new ad.render.RecursiveRender());
    material.setWidgets(
        [new ad.widget.Title(AD_CONFIG['title'])],
        [new ad.widget.Image(AD_CONFIG['image'])]
    );
    material.show();
    // material.initMonitor(AD_CONFIG['main_url']);
});


















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
