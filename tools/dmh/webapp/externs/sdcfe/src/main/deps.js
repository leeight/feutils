// This file was autogenerated by calcdeps.py
goog.addDependency("init.js", [], ['baidu', 'app.module.ModuleLoader', 'app.module.ModuleManager']);
goog.addDependency("deps.js", [], []);
goog.addDependency("tangram.js", ['baidu'], []);
goog.addDependency("plovr-config.js", [], []);
goog.addDependency("base.js", [], []);
goog.addDependency("test-yui.js", [], []);
goog.addDependency("er/locator.js", ['er.locator'], ['er.base', 'er.config']);
goog.addDependency("er/context.js", ['er.context'], []);
goog.addDependency("er/Action.js", ['er.AbstractFormAction', 'er.Action', 'er.FormAction', 'er.ListAction'], ['base.BaseModel', 'base.IParamAdapter', 'base.RemoteListDataSource', 'er']);
goog.addDependency("er/config.js", ['er.config'], []);
goog.addDependency("er/template.js", ['er.template'], ['er.base']);
goog.addDependency("er/controller.js", ['er.controller'], ['er.base', 'er.config', 'er.locator']);
goog.addDependency("er/er.js", ['er'], []);
goog.addDependency("er/permission.js", ['er.permission'], []);
goog.addDependency("er/base.js", ['er.base'], []);
goog.addDependency("app/json.js", ['app.json', 'app.json.Serializer'], []);
goog.addDependency("app/worker.js", ['app.Worker'], ['baidu', 'base.AbstractWorker', 'er.template']);
goog.addDependency("app/module.js", ['app.module.ModuleLoader', 'app.module.ModuleManager'], ['baidu']);
goog.addDependency("app/log.js", ['app.log'], []);
goog.addDependency("app/app.js", ['app.Init', 'app.InitFromElement', 'app.Launch'], ['app.Worker', 'base.ParallelWorkerManager', 'er.template', 'ui.Page', 'ui.util']);
goog.addDependency("app/mockup.js", ['baidu.mockup.register'], ['baidu', 'app.json']);
goog.addDependency("app/ant.lib.js", [], []);
goog.addDependency("base/ParamAdapter.js", ['base.IParamAdapter', 'base.OneToManyParamAdapter'], ['base', 'base.Object']);
goog.addDependency("base/BaseModel.js", ['base.BaseModel'], ['baidu', 'base', 'base.PropertyChangeNotifier']);
goog.addDependency("base/ListDataSource.js", ['base.ListDataSource', 'base.RemoteListDataSource'], ['base.DataSource']);
goog.addDependency("base/Converter.js", ['base.DateRangeConverter', 'base.IConverter', 'base.UrlPrefixConverter', 'base.dateRangeConverter'], ['baidu', 'base']);
goog.addDependency("base/Worker.js", ['base.AbstractWorker', 'base.FuncWorker', 'base.LocalWorker', 'base.ParallelWorkerManager', 'base.SerialWorkerManager', 'base.TimeoutWorker'], ['base.EventDispatcher']);
goog.addDependency("base/PropertyChangeNotifier.js", ['base.PropertyChangeNotifier'], ['baidu', 'base', 'base.EventDispatcher']);
goog.addDependency("base/EventDispatcher.js", ['base.EventDispatcher'], ['baidu', 'base.Object']);
goog.addDependency("base/DataSource.js", ['base.DataSource'], ['baidu', 'base.Object']);
goog.addDependency("base/base.js", ['base'], []);
goog.addDependency("base/RSDataSource.js", [], []);
goog.addDependency("base/ObservableList.js", ['base.ObservableList'], ['base.EventDispatcher']);
goog.addDependency("base/Object.js", ['base.Object'], ['base']);
goog.addDependency("google/config.js", ['google.config'], []);
goog.addDependency("google/app.js", ['google.app.start'], ['ui.PagableList', 'base.RemoteListDataSource', 'app.Init', 'app.Launch', 'google.mockup', 'google.config', 'app.module.ModuleManager']);
goog.addDependency("google/mockup.js", ['google.mockup'], ['baidu.mockup.register']);
goog.addDependency("news/config.js", ['news.config'], []);
goog.addDependency("news/app.js", ['news.app.start'], ['ui.PagableList', 'base.RemoteListDataSource', 'app.Init', 'app.Launch', 'news.mockup', 'news.config', 'app.module.ModuleManager']);
goog.addDependency("news/mockup.js", ['news.mockup'], ['baidu.mockup.register']);
goog.addDependency("baidu/app.js", ['baidu.app.start'], ['ui.Button', 'app.Init', 'app.Launch', 'app.module.ModuleManager']);
goog.addDependency("ui/RadioBoxGroup.js", ['ui.RadioBoxGroup'], ['ui.InputControl']);
goog.addDependency("ui/MonthView.js", ['ui.MonthView'], ['baidu', 'ui', 'ui.Control']);
goog.addDependency("ui/MediaUploader.js", ['ui.MediaUploader'], ['er.template', 'ui.Uploader', 'ui.events']);
goog.addDependency("ui/Repeater.js", ['ui.Repeater'], ['ui.Control']);
goog.addDependency("ui/CheckBoxGroup.js", ['ui.CheckBoxGroup'], ['ui.InputControl']);
goog.addDependency("ui/Panel.js", ['ui.Panel'], ['ui.Control']);
goog.addDependency("ui/UrlMaker.js", [], []);
goog.addDependency("ui/RichSelector.js", [], []);
goog.addDependency("ui/ListInfoShort.js", ['ui.ListInfoShort'], ['ui.ListInfo']);
goog.addDependency("ui/InputControl.js", ['ui.InputControl'], ['base.IConverter', 'ui.Control']);
goog.addDependency("ui/Orientation.js", [], []);
goog.addDependency("ui/SimpleSelector.js", [], []);
goog.addDependency("ui/ui.js", ['ui'], []);
goog.addDependency("ui/FormSwitch.js", [], []);
goog.addDependency("ui/events.js", ['ui.events'], ['ui']);
goog.addDependency("ui/PagableList.js", ['ui.PagableList'], ['base.DataSource', 'ui.ComboBox', 'ui.Control', 'ui.ListInfo', 'ui.Pager', 'ui.Table']);
goog.addDependency("ui/SubmitButton.js", ['ui.SubmitButton'], ['ui.Button', 'ui.Form']);
goog.addDependency("ui/Hidden.js", ['ui.Hidden'], ['ui.Control']);
goog.addDependency("ui/Pager.js", ['ui.Pager'], ['ui.Control']);
goog.addDependency("ui/SearchInfo.js", [], []);
goog.addDependency("ui/Control.js", ['ui.Control'], ['base.BaseModel', 'base.EventDispatcher', 'er.template', 'ui.lifeCycle']);
goog.addDependency("ui/SlotSelector.js", [], []);
goog.addDependency("ui/ToolTip.js", ['ui.ToolTip'], ['er.template', 'ui.Control']);
goog.addDependency("ui/Flash.js", ['ui.Flash'], ['ui.Control', 'ui.events']);
goog.addDependency("ui/MultiCalendar.js", ['ui.MultiCalendar'], ['baidu', 'ui.Button', 'ui.InputControl', 'ui.MonthView']);
goog.addDependency("ui/externs.js", [], []);
goog.addDependency("ui/Mask.js", ['ui.Mask'], ['baidu', 'ui']);
goog.addDependency("ui/FormFolder.js", [], []);
goog.addDependency("ui/BoxGroup.js", [], []);
goog.addDependency("ui/BaseBox.js", ['ui.BaseBox'], ['ui.InputControl', 'ui.events']);
goog.addDependency("ui/CheckBox.js", [], []);
goog.addDependency("ui/Page.js", ['ui.Page'], ['ui.Control']);
goog.addDependency("ui/ToggleButton.js", [], []);
goog.addDependency("ui/TextInput.js", ['ui.TextInput'], ['ui.InputControl']);
goog.addDependency("ui/ListView.js", ['ui.ListView'], ['ui.Button', 'ui.Control', 'ui.Label', 'ui.Table']);
goog.addDependency("ui/Tab.js", [], []);
goog.addDependency("ui/ReportCalendar.js", ['ui.ReportCalendar'], ['ui.InputControl', 'ui.MiniMultiCalendar', 'ui.MultiCalendar']);
goog.addDependency("ui/Dialog.alert.js", ['ui.Dialog.alert'], ['ui.Button', 'ui.Dialog']);
goog.addDependency("ui/Button.js", ['ui.Button'], ['ui.Control']);
goog.addDependency("ui/Form.js", ['ui.Form'], ['ui.BaseBox', 'ui.Control', 'ui.InputControl']);
goog.addDependency("ui/Calendar.js", ['ui.Calendar'], ['ui.InputControl', 'ui.MonthView']);
goog.addDependency("ui/Table.js", ['ui.Table'], ['ui.Control', 'ui.ToolTip']);
goog.addDependency("ui/util.js", ['ui.util', 'ui.util.validate'], ['baidu', 'ui', 'ui.Page']);
goog.addDependency("ui/Uploader.js", ['ui.Uploader'], ['er.template', 'ui.Button', 'ui.InputControl', 'ui.TextInput', 'ui.events']);
goog.addDependency("ui/MiniMultiCalendar.js", ['ui.MiniMultiCalendar'], ['baidu', 'ui.InputControl']);
goog.addDependency("ui/ListInfo.js", ['ui.ListInfo'], ['ui.Control']);
goog.addDependency("ui/MultiCalendarWithMini.js", ['ui.MultiCalendarWithMini'], ['baidu', 'ui.Button', 'ui.InputControl', 'ui.MonthView']);
goog.addDependency("ui/CopyableArea.js", [], []);
goog.addDependency("ui/LifeCycle.js", ['ui.lifeCycle'], ['ui']);
goog.addDependency("ui/SummaryInfo.js", [], []);
goog.addDependency("ui/Label.js", ['ui.Label'], ['ui.Control']);
goog.addDependency("ui/Dialog.js", ['ui.Dialog'], ['ui.Control', 'ui.Mask']);
goog.addDependency("ui/RadioBox.js", [], []);
goog.addDependency("ui/ComboBox.js", ['ui.ComboBox'], ['ui.InputControl']);
goog.addDependency("ui/Dialog.confirm.js", ['ui.Dialog.confirm'], ['ui.Button', 'ui.Dialog']);
goog.addDependency("ui/Link.js", ['ui.Link'], ['ui.Control']);
goog.addDependency("ui/ReportCalendarForClient.js", ['ui.ReportCalendarForClient'], ['ui.InputControl', 'ui.MultiCalendarWithMini']);
goog.addDependency("ui/FormTab.js", [], []);
goog.addDependency("ui/List.js", ['ui.List'], ['ui', 'ui.Table']);
goog.addDependency("ui/VideoUploader.js", ['ui.VideoUploader'], ['ui.MediaUploader']);
goog.addDependency("ui/ButtonMenu.js", [], []);
goog.addDependency("../test/app/app.js", [], ['app.Launch', 'ui.util', 'ui.Page', 'ui.Button', 'ui.ComboBox', 'ui.ListView']);
goog.addDependency("../test/app/demo/app.js", [], ['ui.Button', 'app.Init', 'app.Launch']);
goog.addDependency("../test/app/listview/app.js", [], ['app.Launch', 'ui.util', 'ui.Page', 'ui.ListView']);
goog.addDependency("../test/app/pageablelist/init.js", ['app.init'], ['app.mockup']);
goog.addDependency("../test/app/pageablelist/config.js", ['app.config'], []);
goog.addDependency("../test/app/pageablelist/app.js", [], ['ui.PagableList', 'base.RemoteListDataSource', 'app.Init', 'app.Launch', 'app.mockup', 'app.config', 'app.init']);
goog.addDependency("../test/app/pageablelist/mockup.js", ['app.mockup'], ['baidu.Mockup']);
goog.addDependency("../test/app/combobox/app.js", [], ['app.Launch', 'ui.util', 'ui.Page', 'ui.ComboBox']);
goog.addDependency("../test/app/button/app.js", [], ['app.Launch', 'ui.util', 'ui.Page', 'ui.Button']);