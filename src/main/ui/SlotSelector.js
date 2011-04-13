/**
 * 生活圈或网站选择器
 * 需外部传的参数：
 * 必填：
 * datasourceMultiSitesLeft:@modelInForm;生活圈列表数据源
 * datasourceSingleSiteLeft:@modelInForm;网站列表数据源
 * datasourceSlotStatus:@modelInForm;搜索广告位的状态数据源
 * slotlistRequester:@modelInForm;动态获取广告位列表的requester
 * communityslotRequester:@modelInForm;获取分生活圈的广告位，为了合并请求数，放在这里为了先显示页面再发这个大数据量的请求
 * singleSiteTotalCount:@modelInForm;网站分页控件页数需要的参数
 * productType:@modelInForm;当前选中的产品形式
 * 可选：
 * selectedSlot:@modelInForm;用来绑定初始化选择的广告位和预算,格式：{orient_community:'1/2',
 * 															  budget_role_ids:["1", "2"],
 * 															  budget_role_values:["5000", "9000"],
 * 															  budget_role_slot_ids:[
 *																			        {"id":"1","value":["2323","2334","3434"]},
 *																			        {"id":"2","value":["2325","2336","3437"]}
 *																			    ]
 *															 }
 * customConfig：4;网站列表Pager显示跳转页的数量,默认为4 todo
 * hideBudget: true; 是否显示预算，用于资源预估
 * @constructor
 * @extends {ui.InputControl}
 */
ui.SlotSelector = function(options) {
    ui.InputControl.call(this, options);

    this.type = 'slotselector';
    this.view = 'UISlotSelector';

    this.customConfig = {
    	pagerCount: 4,//分页控件中间显示默认个数
    	pageSize: 15,   //table控件显示的默认行数
    	noDataInfo: '0条广告位信息',
    	defaultSlotlistParam_status: 'status=106',
    	defaultSlotlistParam_typejoin: 'type_join=false',
    	defaultCommunitylistParam_status: 'community_status=0',
    	defaultCommunitySlotlistParam_status: 'slot_status=106'
    };

    this.viewValue = {
    	multiSites: {
    		mainList: [],
    		subLists: []
    	},
    	singleSite: [],
    	budget: {
    		multiSites: [],//[{id:1,budget:50000},...] 生活圈ID
    		singleSite: []//[{id:1,budget:50000},...] 广告位ID
    	}
    };

    //用于点击取消后对this.viewValue进行rollback
    //点击完成clone viewValue到formalViewValue，点击取消克隆formalViewValue到viewValue
    this.formalViewValue = {
        	multiSites: {
        		mainList: [],
        		subLists: []
        	},
        	singleSite: [],
        	budget: {
        		multiSites: [],
        		singleSite: []
        	}
        };

    //用于刷新生活圈右列表后，回到初始收缩状态
    this.cacheCommunityId = null;
};

ui.SlotSelector.prototype = (function() {
	/**
	 * 枚举生活圈定向还是网站定向
	 */
	var slotType = {
			'MULTISITES': 1,
			'SINGLESITE': 2
	};

    /**
     * 公共语言声明
     *
     * @private
     */
    var lang = {
        'listSummary': '共投放：<span style="color:#FF9900;">&nbsp;{0}&nbsp;</span>个广告位',
        'delete': '删除',
        'deleteAll': '全部删除',
        'deleteSingleSiteTpl': '<span onclick="{2}" class="ui-orient-sel-listentry">{1}</span>',
        'sublistContainer': '<div id="{0}" class="cb-sublist-loading">{2}</div>' +
						   '<div id="{1}" class="cb-sublist-table" style="display:none"></div>',
        'sublistMultiSitesLeftContainer': '<div id="{0}" class="cb-sublist-loading" style="height:24px;">{2}</div>' +
				'<div id="{1}" class="cb-sublist-table" style="display:none"></div>' +
				'<div style="width:320px;height:24px;"  id=\'{3}\'></div>'
    };

    /**
     * 设置预算值到viewValue
     */
    function setBudget() {
    	if (this.c('rdoMultiSites').getChecked()) {
    		getMultiSitesBudget.call(this);
    	}
    	else {
    		getSingleSiteBudget.call(this);
    	}
    }

    /**
     * 完成按钮点击事件
     */
	function onOK() {
		slotHelper.clearInternalError.call(this);
		if (true !== this.hideBudget) {
		    setBudget.call(this);
		}
		if (!this.validateBudget()) {
			slotHelper.showInternalError.call(this, '预算格式不正确！');
			return;
		}
		execOK.call(this);
	}
	/**
	 * 点击完成后：显示结果页，刷新结果页，赋formalViewValue值
	 */
	function execOK() {
		showResult.call(this, true);
		refreshResult.call(this);
		this.formalViewValue = slotHelper.viewValue.clone(this.viewValue);
	}

	function onCancel() {
		showResult.call(this, true);
		this.viewValue = slotHelper.viewValue.clone(this.formalViewValue);
		if (this.c('rdoMultiSites').getChecked()) {
			refreshMultiSites(this);
		}
		else {
			refreshSingleSite(this);
		}
	}

	function getMultiSitesBudget() {
		var tbl = this.c('tblMultiSitesRight'),
		input, me = this;
		me.viewValue['budget'].multiSites = [];
		baidu.array.each(tbl.model.datasource, function(item,i) {
			input = tbl.getRow(i).getElementsByTagName('INPUT')[0];
			me.viewValue['budget'].multiSites.push({id: item.id, budget: baidu.trim(input.value)});
		});
	}

	//this:slotSelector
	function getSingleSiteBudget() {
		var tbl = this.c('tblSingleSiteRight'),
			input, me = this;
		me.viewValue['budget'].singleSite = [];
		baidu.array.each(tbl.model.datasource, function(item,i) {
			input = tbl.getRow(i).getElementsByTagName('INPUT')[0];
			me.viewValue['budget'].singleSite.push({id: item.id, budget: baidu.trim(input.value)});
		});
	}

	function onModifyMultiSites() {
		showResult.call(this, false);
	}

    function onModifySingleSite() {
    	showResult.call(this, false);
    }

    /**
     * 显示结果页
     * flag 为true显示结果页
     */
    function showResult(flag) {
    	if (flag) {
			if (this.c('rdoMultiSites').getChecked()) {
				baidu.show('wrapperCreatedMultiSites');
				baidu.hide('wrapperCreatedSingleSite');
				baidu.hide('wrapperCreate');
			}
			else {
				baidu.hide('wrapperCreatedMultiSites');
				baidu.show('wrapperCreatedSingleSite');
				baidu.hide('wrapperCreate');
			}
    	}
    	else {
    		baidu.hide('wrapperCreatedMultiSites');
			baidu.hide('wrapperCreatedSingleSite');
			baidu.show('wrapperCreate');
			onChangeCommunityType.call(this);
    	}
	}

	function onChangeCommunityType() {
		if (this.c('rdoMultiSites').getChecked()) {
			baidu.show('wrapperMultiSites');
			baidu.hide('wrapperSingleSite');
		}
		else {
			baidu.hide('wrapperMultiSites');
			baidu.show('wrapperSingleSite');
		}
	}


	var SUBTABLE_IDPREFIX_LEFT = 'slotSubListLeft';
	var SUBTABLE_IDPREFIX_RIGHT = 'slotSubListRight';
	var SUBTABLE_IDPREFIX_RESULT = 'slotSubListResult';


	var slotHelper = {
			//根据当前table的索引获取生活圈ID
			getCommunityIdbyMaintableIndex: function(index) {
				return this.datasourceMultiSitesLeft[index].id;
			},
			//通过生活圈ID去拿对应已选择的sublist，若为null表明viewValue里没有
			getSelectedSublistByCommunityId: function(communityId) {
				var tmpIndex = -1;
				var findCommunityId = baidu.array.find(this.viewValue['multiSites'].mainList, function(item,i) {
					if (item.id == communityId) {
						tmpIndex = i;
						return true;
					}
					return false;
				});

				return tmpIndex != -1 ? this.viewValue['multiSites'].subLists[tmpIndex] : null;

			},
			//根据生活圈ID和当前广告位ID判断该广告位ID是否已经被选择了
			hasTheSlotIdSelected_multisites: function(communityId,slotId) {
				var selected = this.viewValue['multiSites'];
				var findSlotId, find = false, tmpIndex;
				var findCommunityId = baidu.array.find(selected.mainList, function(item,i) {
					if (item.id == communityId) {
						tmpIndex = i;
						return true;
					}
					return false;
				});
				if (findCommunityId) {
					findSlotId = baidu.array.find(selected.subLists[tmpIndex], function(item,i) {
						return item.id == slotId;
					});
					if (findSlotId) find = true;
				}
				return find;
			},
			viewValue: {
					//网站列表中是否已选择了该slotid
					hasSlot_singlesite: function(slotid) {
						var has = false;
						baidu.array.each(this.viewValue['singleSite'], function(item,i) {
							if (item.id == slotid) {
								has = true;
								return false;
							}
						});
						return has;
					},
					//克隆viewValue
					clone: function(source) {
				    	var target = {
				            	multiSites: {
				            		mainList: [],
				            		subLists: []
				            	},
				            	singleSite: [],
				            	budget: {
				            		multiSites: [],
				            		singleSite: []
				            	}
				            };
				    	target.multiSites.mainList = source.multiSites.mainList.slice(0);
				    	target.multiSites.subLists = source.multiSites.subLists.slice(0);
				    	target.singleSite = source.singleSite.slice(0);
				    	target.budget.multiSites = source.budget.multiSites.slice(0);
				    	target.budget.singleSite = source.budget.singleSite.slice(0);
				    	return target;
				    }
			},
			showInternalError: function(msg) {
				if (this.c('rdoMultiSites').getChecked()) {
					baidu.g('errMulti').innerHTML = msg;
				}
				else {
					baidu.g('errSingle').innerHTML = msg;
				}
			},
			clearInternalError: function() {
				if (this.c('rdoMultiSites').getChecked()) {
					baidu.g('errMulti').innerHTML = '';
				}
				else {
					baidu.g('errSingle').innerHTML = '';
				}
			}
	};

	function onShowSingleSubListLeft(data,index) {
        var controlId = SUBTABLE_IDPREFIX_LEFT + index,
	    	me = this,
	        mainTable = this.c('tblMultiSitesLeft');

	    var tpl = lang.sublistMultiSitesLeftContainer;

	    if (!this || !this.c || !this.c('tblMultiSitesLeft')) return;
	    if (!this.c('tblMultiSitesLeft').c(controlId)) {
	    	mainTable.getSubrow(index).innerHTML =
	            baidu.format(tpl,
	            	mainTable.getId('subListLoading' + index),
	            	mainTable.getId('subListTable' + index),
	            	dn.util.getLoadingHtml(),
	            	mainTable.getId('Search' + index));

	    	if (!me.c('tblMultiSitesLeft')) return;
            var table, tmp,
                listContainer = baidu.g(mainTable.getId('subListTable' + index)),
                cBoxId = 'cBox' + index, cBox, cBoxContainer,
                txtId = 'txtSearch' + index, txtInput,
                btnSearchId = 'btnSearch' + index, btnSearch,
                searchContainer = baidu.g(mainTable.getId('Search' + index));

            listContainer.appendChild(searchContainer);
            baidu.hide(mainTable.getId('subListLoading' + index));

            // 装载子列表控件
            if (!me.c('tblMultiSitesLeft').c(controlId)) {
                baidu.show(listContainer);

                //创建combobox
                cBox = ui.util.create('ComboBox', {
                    id: cBoxId,
                    width: 80,
                    value: '106',
                    datasource: me.datasourceSlotStatus
                });

                cBox.appendTo(searchContainer);
                mainTable.addChild(cBox);

                tmp = document.createElement('input');
                tmp.setAttribute('type', 'text');
                //创建textinput
                txtInput = ui.util.create('TextInput', {
                    id: txtId,
                    width: 150,
                    main: tmp
                });
                searchContainer.appendChild(tmp);
                mainTable.addChild(txtInput);

                //创建button
                btnSearch = ui.util.create('Button', {
                    id: btnSearchId,
                    content: '搜索'
                });

                btnSearch.appendTo(searchContainer);
                mainTable.addChild(btnSearch);

                //创建TABLE
                table = ui.util.create('Table', {
                    id: controlId,
                    datasource: data,
                    fields: me.fields.subrow_multiSitesLeft,
                    noDataHtml: me.customConfig.noDataInfo,
                    noTitle: false,
                    subrow: false,
                    width: 450,
                    select: 'multi'
                });

                table.appendTo(listContainer);
                mainTable.addChild(table);

                btnSearch.onclick = baidu.fn.bind(onSearchMultiSites, me, table, cBox, txtInput, slotHelper.getCommunityIdbyMaintableIndex.call(me, index));
            }
            listContainer.style.marginLeft = '-30px';
	    }
	};

	/**
	 * FIX大BUG，总报subrow为空
	 */
	function AfterShowAllSubListLeftCallback(ctrl) {
		if (ctrl.selectedSlot && ctrl.selectedSlot.budget_role_ids.length != 0) {
			ctrl.setValue();
        }
		initCheckDisplay_tblMultiSitesLeft.call(ctrl);
	}

	/**
	 * 生活圈广告位搜索操作
	 */
	function onSearchMultiSites(tbl,cBox,txtInput,community_id) {
		var keyword = baidu.trim(txtInput.getValue()),
			status = cBox.getValue(),
			me = this;
		var param = 'name_domain=' + keyword +
					'&status=' + status +
					'&community_id=' + community_id +
					'&type=' + me.productType +
					'&' + this.customConfig.defaultSlotlistParam_typejoin;

		this.slotlistRequester(param, function(data) {
			tbl.refer = {datasource: 'datasource'};
			tbl.rebindModel({
	            datasource: data.page.result
	        });
			delete tbl['refer'];
			refreshMultiSites_Left_SingleSublist.call(me, tbl, community_id);
			initCheckDisplay_tblMultiSitesLeft_SingleSublist.call(me, tbl);
			chkAllStatus_tblMultiSitesLeft_Sublist(me, tbl);
    		baidu.hide(baidu.g(tbl.getId() + 'selectAll'));
		});
	}

	/**
	 *创建绑定Pager控件model
	 *totalCount：data.page.totalCount
	 */
	function pagerHelper(totalCount) {
    	var pageSize = this.customConfig.pageSize;
        var totalPage = Math.floor(totalCount / pageSize);

    	return {
    		pagerCount: this.customConfig.pagerCount,
            totalPage: totalPage,
            page: 1
    	};
    }

	/**
	 * 网站广告位分页操作
	 */
	function onPageChanged_tblSingleSiteLeft(pageNo) {
		var me = this;
		var listPager = me.c('listPagerSingleSiteLeft'),
			tbl = me.c('tblSingleSiteLeft'),
			keyword = baidu.trim(this.c('txtSearchDomain').getValue()),
			status = this.c('comboSearchStatus').getValue();
		var param = 'page.pageNo=' + pageNo +
					'&page.pageSize=' + this.customConfig.pageSize +
					'&name_domain=' + keyword +
					'&status=' + status +
					'&type=' + me.productType +
					'&' + this.customConfig.defaultSlotlistParam_typejoin;
		this.slotlistRequester(param, function(data) {
			tbl.dontOnSelect = true;
			tbl.rebindModel({
	            datasource: data.page.result
	        });
			delete tbl.dontOnSelect;
			refreshSingleSite(me);
		});

	}

	/**
	 * 网站搜索广告位操作
	 */
	function onSearchSingleSite() {
		var keyword = baidu.trim(this.c('txtSearchDomain').getValue()),
			status = this.c('comboSearchStatus').getValue(),
			me = this;
		var param = 'page.pageNo=1&page.pageSize=' + this.customConfig.pageSize +
					'&name_domain=' + keyword +
					'&status=' + status +
					'&type=' + me.productType +
					'&' + this.customConfig.defaultSlotlistParam_typejoin;

		this.slotlistRequester(param, function(data) {
			me.c('tblSingleSiteLeft').dontOnSelect = true;
			me.c('tblSingleSiteLeft').rebindModel({
	            datasource: data.page.result
	        });
			delete me.c('tblSingleSiteLeft').dontOnSelect;
			me.c('listPagerSingleSiteLeft').rebindModel(pagerHelper.call(me, data.page.totalCount));
			refreshSingleSite(me);
		});
	}

	/**
	 * 初始化生活圈左列表checkbox：隐藏及绑定事件
	 */
	function initCheckDisplay_tblMultiSitesLeft() {
		var me = this,
			main_chkAllId = me.c('tblMultiSitesLeft').getId('selectAll'), el_main_chkAllId = baidu.g(main_chkAllId),
			subrow_title_chkId,
			mainrow_item_chkId, el_mainrow_item_chkId,
			subrowTable,
			subrow_item_chkId;

		//父全选框点击事件
		el_main_chkAllId.onclick = null;
		baidu.event.on(el_main_chkAllId, 'click', function() {
			var checked = el_main_chkAllId.checked;
			baidu.array.each(me.datasourceMultiSitesLeft, function(item,index) {
				mainrow_item_chkId = me.c('tblMultiSitesLeft').getId('multiSelect' + index);
				el_mainrow_item_chkId = baidu.g(mainrow_item_chkId);
				if (el_mainrow_item_chkId.checked != checked) {
					el_mainrow_item_chkId.click();
				}
			});
		});

		//父列表item选框点击事件
		baidu.array.each(me.datasourceMultiSitesLeft, function(item,index) {
			subrowTable = me.c('tblMultiSitesLeft').c(SUBTABLE_IDPREFIX_LEFT + index);
			subrow_title_chkId = subrowTable.getId() + 'selectAll';
    		baidu.hide(subrow_title_chkId);
    		mainrow_item_chkId = me.c('tblMultiSitesLeft').getId('multiSelect' + index);
    		baidu.g(mainrow_item_chkId).onclick = null;
			baidu.event.on(baidu.g(mainrow_item_chkId), 'click', function(subrow_title_chkId,me) {
				return function() {
					baidu.g(subrow_title_chkId).click();
					checkMainSelectAllStatus.call(me);
				}
			}(subrow_title_chkId, me));
			initCheckDisplay_tblMultiSitesLeft_SingleSublist.call(me, subrowTable, item.id);
    	});
	}
	/**
	 * 初始化某生活圈下子列表chk框的事件
	 * communityId可选，用于赋值给this.cacheCommunityId
	 */
	function initCheckDisplay_tblMultiSitesLeft_SingleSublist(subrowTable,communityId) {
		var el_subrow_item_chkId, me = this,
			//第一次初始化subrowTable.model.datasource为空
			data = subrowTable.model ? subrowTable.model.datasource : subrowTable.datasource;

		//子列表item选框点击事件
		baidu.array.each(data, function(citem,i) {
			el_subrow_item_chkId = baidu.g(subrowTable.getId() + 'multiSelect' + i);
			el_subrow_item_chkId.onclick = null;
			baidu.event.on(el_subrow_item_chkId, 'click', function(i,tbl,me,pMe,communityId) {
				return function() {
					selectMulti.call(tbl, i, me);
					checkMainSelectAllStatus.call(pMe);
					pMe.cacheCommunityId = communityId;
				}
			}(i, subrowTable, me.c('tblMultiSitesLeft'), me, communityId));
		});
	}

	/**
	 * 根据子列表是否全部选中，更新最头部checkbox状态
	 */
	function checkMainSelectAllStatus() {
		var me = this, isSelectAll = true,//this是slotSelctor
			main_chkAllId = me.c('tblMultiSitesLeft').getId('selectAll'), el_main_chkAllId = baidu.g(main_chkAllId),
			mainrow_item_chkId, el_mainrow_item_chkId;
		baidu.array.each(me.datasourceMultiSitesLeft, function(item,i) {
			mainrow_item_chkId = me.c('tblMultiSitesLeft').getId('multiSelect' + i);
			el_mainrow_item_chkId = baidu.g(mainrow_item_chkId);
			if (!el_mainrow_item_chkId.checked) {
				isSelectAll = false;
				return false;
			}
		});
		el_main_chkAllId.checked = isSelectAll;
	}


    /**
     * 根据checkbox是否全部选中，更新头部以及body的checkbox状态
     *
     * @private
     * @param {number} index 需要更新的body中checkbox行，不传则更新全部.
     * @param {Object} pList tblMultiSitesLeft控件.
     */
	function selectMulti(index,pList) {
        var me = this,//this为子列表控件
            inputs = me.getBody().getElementsByTagName('input'),
            i = 0,
            currentIndex = 0,
            allChecked = me,
            len = inputs.length,
            selectAll = me.getHeadCheckbox(),
            selected = [],
            selectedClass = me.getClass('row-selected'),
            cbIdPrefix = me.getId('multiSelect'),
            input, inputId, row,
            updateAll = !baidu.lang.hasValue(index);

        for (; i < len; i++) {
            input = inputs[i];
            inputId = input.id;
            if (input.getAttribute('type') == 'checkbox'
                && inputId && inputId.indexOf(cbIdPrefix) >= 0
            ) {
                // row = me.getRow(currentIndex); // add speed
                if (updateAll) {
                    row = input.parentNode;
                    while (1) {
                        if (row.tagName == 'DIV' // speed
                            && /^ui-table-row/.test(row.className)
                        ) {
                            break;
                        }
                        row = row.parentNode;
                    }
                }

                if (!input.checked) {
                    allChecked = false;

                    if (updateAll) {
                    	baidu.removeClass(row, selectedClass);
                    	baidu.removeClass(row, 'ui-table-row-selected');
                    }
                } else {
                    selected.push(me.datasource[currentIndex]);
                    updateAll && baidu.addClass(row, selectedClass);
                }
                currentIndex++;
            }
        }


        this.onselect(selected);
        if (!updateAll) {
            row = me.getRow(index);
            input = baidu.g(cbIdPrefix + index);
            if (input.checked) {
                baidu.addClass(row, selectedClass);
            } else {
                baidu.removeClass(row, selectedClass);
                baidu.removeClass(row, 'ui-table-row-selected');
            }
        }
        selectAll.checked = allChecked;
        //以上为Table.js拷来的，为了避免修改Table控件
        function getPItemIdbySubrowallcheckId(allcheckId) {
        	//formAd_slotSelector_tblMultiSitesLeft_slotSubListLeft0selectAll--->formAd_slotSelector_tblMultiSitesLeftmultiSelect0
        	return pList.getId('multiSelect') + allcheckId.match(/^\D+(\d+)\D+$/)[1];
        }
        var pItemId = getPItemIdbySubrowallcheckId(selectAll.id);
        baidu.g(pItemId).checked = selectAll.checked;
    }

	function validateEmptySublists(selected) {
		var rtn = true;
		baidu.array.each(selected.subLists, function(item) {
			if (0 === item.length) {
				rtn = false;
				return false;
			}
		});
		return rtn;
	}

	/**
	 * 生活圈广告位选择
	 * this:slotSelector
	 */
	function onAfterSelected_tblMultiSitesLeft() {
		slotHelper.clearInternalError.call(this);
		var selected = getSelected_tblMultiSitesLeft(this);
		if (!validateEmptySublists(selected)) {
			slotHelper.showInternalError.call(this, '没有选中广告位的生活圈不能添加！');
			return false;
		}
		setViewValue(this, 'multiSites', selected);
		refreshMultiSites_Right(this);
	}

	/**
	 * 选择生活圈选中数据
	 * @param ctrl
	 * @return {Array}
	 */
	function getSelected_tblMultiSitesLeft(ctrl) {
		var leftList = ctrl.c('tblMultiSitesLeft'),
			selected = {mainList: [], subLists: [], subListsUnselected: []},
			me = ctrl,
			mainrow_item_chkId,
			subrowTable,
			subrow_item_chkId,
			hasChecked,
			arr,
			arrUnselected;

		baidu.array.each(me.datasourceMultiSitesLeft, function(item,index) {
			subrowTable = me.c('tblMultiSitesLeft').c(SUBTABLE_IDPREFIX_LEFT + index);
    		mainrow_item_chkId = me.c('tblMultiSitesLeft').getId('multiSelect' + index);

			if (baidu.g(mainrow_item_chkId).checked) {
				selected.mainList.push(item);
				selected.subLists.push(subrowTable.datasource.slice(0));
			}
			else {
				hasChecked = false, arr = [], arrUnselected = [];
				baidu.array.each(subrowTable.datasource, function(citem,i) {
					subrow_item_chkId = subrowTable.getId() + 'multiSelect' + i;
					if (baidu.g(subrow_item_chkId).checked) {
						arr.push(citem);
						hasChecked = true;
					}
					else {
						arrUnselected.push(citem);
					}
				});
				if (hasChecked) {
					selected.mainList.push(item);
					selected.subLists.push(arr);
					selected.subListsUnselected.push(arrUnselected);
				}
			}
    	});

		return selected;
	}

	function refreshMultiSites(ctrl) {
		refreshMultiSites_Left(ctrl);
		refreshMultiSites_Right(ctrl);
	}

	/**
	 * 生活圈广告位选择操作刷新右列表
	 */
	function refreshMultiSites_Right(ctrl) {
		var leftList = ctrl.c('tblMultiSitesLeft'),
        	rightList = ctrl.c('tblMultiSitesRight'),
        	data = ctrl.datasourceMultiSitesLeft, dataItem,
        	dataLen = data.length,
        	lblMultiSlotNum = baidu.g('lblMultiSlotNum'),
        	selected = ctrl.viewValue['multiSites'],
        	selectedLen = selected.length,
        	selectedMap = {},chk, row,
        	selectedClass = ctrl.getClass('sel-selectedrow');

		var chkidPrefix = leftList.getId('multiSelect');

	    // 重绘右边选中的列表和尾部
		rightList.rebindModel({
			datasource: selected.mainList
		});

		baidu.array.each(selected.mainList, function(communityItem,i) {
			var tpl = '<div id="{0}" class="cb-sublist-loading">{2}</div>' +
    				'<div id="{1}" class="cb-sublist-table" style="display:none"></div>';

			var me = ctrl,
	            mainTable = ctrl.c('tblMultiSitesRight'),
	            subDatasource = selected.subLists[i],
	            table;

		    	mainTable.getSubrow(i).innerHTML =
		            baidu.format(tpl,
		            	mainTable.getId('subListLoading' + i),
		            	mainTable.getId('subListTable' + i),
		            	dn.util.getLoadingHtml());

		    	var listContainer = baidu.g(mainTable.getId('subListTable' + i)),
	                controlId = SUBTABLE_IDPREFIX_RIGHT + i;

            // 隐藏加载条
            baidu.hide(mainTable.getId('subListLoading' + i));
            if (me.c('tblMultiSitesRight').c(controlId)) {
            	mainTable.removeChild(me.c('tblMultiSitesRight').c(controlId));
            }

            // 创建子列表控件
            if (!me.c('tblMultiSitesRight').c(controlId)) {
                baidu.show(listContainer);
                table = ui.util.create('Table', {
                    id: controlId,
                    datasource: subDatasource,
                    fields: me.fields.subrow_multiSitesRight,
                    noTitle: true,
                    width: 450
                });

                table.appendTo(listContainer);
                mainTable.addChild(table);
                table['onDelete_tblMultiSitesLeft'] = baidu.fn.bind(onDelete_tblMultiSitesLeft, table);
            }

            //mainTable.resetColumns();
            if (table) baidu.g(table.getId('body')).style.borderWidth = 0;
            listContainer.style.marginLeft = '-13px';
		});

		var num = 0;
		for (var i = 0, l = selected.subLists.length; i < l; i++) {
			num += selected.subLists[i].length;
		}

		lblMultiSlotNum.innerHTML = baidu.format(lang.listSummary, num);

		if (ctrl.cacheCommunityId) {
			var tblTarget = ctrl.c('tblMultiSitesRight');

	    	baidu.array.each(tblTarget.model.datasource, function(item,i) {
	    		if (item.id == ctrl.cacheCommunityId) {
	    			tblTarget.openSubrow(i);
	    			return false;
	    		}
	    	});

	    	ctrl.cacheCommunityId = null;
		}
	}



	/**
	 * 刷新单个生活圈的子列表的勾选框状态
	 */
	function refreshMultiSites_Left_SingleSublist(tbl,communityId) {
		var el_subrow_item_chkId, me = this;
		var data = tbl.model ? tbl.model.datasource : tbl.datasource;
		baidu.array.each(data, function(item,i) {
			el_subrow_item_chkId = baidu.g(tbl.getId() + 'multiSelect' + i);
			if (slotHelper.hasTheSlotIdSelected_multisites.call(me, communityId, item.id)) {
				el_subrow_item_chkId.checked = true;
			}
			else {
				el_subrow_item_chkId.checked = false;
				baidu.removeClass(tbl.getRow(i), 'ui-table-row-selected');
			}
		});
	}

	/**
	 * 刷新生活圈整个左列表的勾选框状态
	 */
	function refreshMultiSites_Left(ctrl) {
		var selected = ctrl.viewValue['multiSites'];
		var mainTable = ctrl.c('tblMultiSitesLeft'),
			subrowTable, me = ctrl,
			mainrow_item_chkId, el_mainrow_item_chkId,
			subrow_item_chkId, el_subrow_item_chkId;

		baidu.array.each(mainTable.model.datasource, function(communityItem,index) {
			subrowTable = me.c('tblMultiSitesLeft').c(SUBTABLE_IDPREFIX_LEFT + index);
			var data = subrowTable.model ? subrowTable.model.datasource : subrowTable.datasource;
			refreshMultiSites_Left_SingleSublist.call(ctrl, subrowTable, communityItem.id);

	        chkAllStatus_tblMultiSitesLeft_Sublist(ctrl, subrowTable);
		});
		chkAllStatus_tblMultiSitesLeft(ctrl);

	}

	/**
	 * 生活圈右列表删除已选广告位
	 */
	function onDelete_tblMultiSitesLeft(id,type) {
		var ctrl = 'sub_item' == type ? this.parent.parent : this,
			data = ctrl.viewValue['multiSites'],
			me = this;

		if ('' == id) {
			data = {},data.mainList = data.subLists = [];
		}
		else if ('main_item' == type) {
			baidu.array.remove(data.mainList, function(item,index) {
				if (item.id == id) {
					baidu.array.remove(data.subLists, function(item,i) {
						return i == index;
					});
					return true;
				}
				return false;
			});

		}
		else if ('sub_item' == type) {
			var communityIdIndex = me.id.match(/^\D+(\d+)$/)[1];
			var toDelCoummunityId = -1;
			baidu.array.each(data.mainList, function(item,index) {
				if (index == communityIdIndex) {//仅删除当前生活圈下的对应广告位
					baidu.array.remove(data.subLists[index], function(citem,i) {
						return citem.id == id;
					});
					if (data.subLists[index].length == 0) {
						toDelCoummunityId = item.id;
					}
					ctrl.cacheCommunityId = item.id;
				}
			});
			//若删除了生活圈下最后1个广告位，则同时删除该生活圈
			if (-1 != toDelCoummunityId) {
				baidu.array.remove(data.mainList, function(item,i) {
					return item.id == toDelCoummunityId;
				});
			}
		}

		ctrl.viewValue['multiSites'] = data;
		refreshMultiSites(ctrl);
	}

	/**
	 * 网站广告位选择操作刷新器
	 */
	function refreshSingleSite(ctrl) {
		var leftList = ctrl.c('tblSingleSiteLeft'),
        	rightList = ctrl.c('tblSingleSiteRight'),
        	data = leftList.model.datasource, dataItem,
        	dataLen = data.length,
        	lblSingleSlotNum = baidu.g('lblSingleSlotNum'),
        	selected = ctrl.viewValue['singleSite'],
        	selectedLen = selected.length,
        	selectedMap = {},chk, row,
        	selectedClass = ctrl.getClass('sel-selectedrow');

		var chkidPrefix = leftList.getId('multiSelect');

	    // 重绘右边选中的列表和尾部
		rightList.rebindModel({
			datasource: selected.slice(0)
		});
	    lblSingleSlotNum.innerHTML = baidu.format(lang.listSummary, selected.length);


	    // 记录选中的value表
	    while (selectedLen--) {
	        selectedMap[selected[selectedLen].id] = 1;
	    }

	    // 重绘左边的列表
	   //leftList.handleResize();
	    while (dataLen--) {
	        dataItem = data[dataLen];
	        chk = baidu.g(chkidPrefix + dataLen);
	        row = leftList.getRow(dataLen);

	        if (selectedMap[dataItem.id]) {
	            baidu.addClass(row, selectedClass);
	            chk.checked = true;
	        } else {
	            baidu.removeClass(row, selectedClass);
	            baidu.removeClass(row, 'ui-table-row-selected');
	            chk.checked = false;
	        }
	    }
	    chkAllStatus_tblSingleSiteLeft(ctrl);
	}


	/**
     * 结果页面刷新器
     */
    function refreshResult() {
    	if (this.c('rdoMultiSites').getChecked()) {
			this.c('tblMultiSitesResult').rebindModel({
				datasource: this.viewValue['multiSites'].mainList.slice(0)
			});

			var me = this;
			baidu.array.each(this.viewValue['multiSites'].mainList, function(communityItem,i) {

				var mainTable = me.c('tblMultiSitesResult'),
		            subDatasource = me.viewValue['multiSites'].subLists[i].slice(0),
		            table;

			    	mainTable.getSubrow(i).innerHTML =
			            baidu.format(lang.sublistContainer,
			            	mainTable.getId('subListLoading' + i),
			            	mainTable.getId('subListTable' + i),
			            	dn.util.getLoadingHtml());

			    	var listContainer = baidu.g(mainTable.getId('subListTable' + i)),
		                controlId = SUBTABLE_IDPREFIX_RESULT + i;

	            baidu.hide(mainTable.getId('subListLoading' + i));
	            if (me.c('tblMultiSitesResult').c(controlId)) {
	            	mainTable.removeChild(me.c('tblMultiSitesResult').c(controlId));
	            }

	            // 创建子列表控件
	            if (!me.c('tblMultiSitesResult').c(controlId)) {
	                baidu.show(listContainer);
	                table = ui.util.create('Table', {
	                    id: controlId,
	                    datasource: subDatasource,
	                    fields: me.fields.subrow_multiSitesResult,
	                    noTitle: true,
	                    width: 500
	                });

	                table.appendTo(listContainer);
	                mainTable.addChild(table);
	            }

			});
		}
		else {
			this.c('tblSingleSiteResult').rebindModel({
				datasource: this.viewValue['singleSite'].slice(0)
			});
		}
    }

	/**
	 * 网站广告位选择操作
	 */
	function onSelected_tblSingleSiteLeft() {
		setViewValue(this, 'singleSite', getSelected_tblSingleSiteLeft(this));
		refreshSingleSite(this);
	}



	/**
	 * 网站右列表删除已选广告位
	 */
	function onDelete_tblSingleSiteLeft(slotid) {
		var data = this.viewValue['singleSite'].slice(0);

		if ('' == slotid) {
			data = [];
		}
		else {
			baidu.array.remove(data, function(item,index) {
				return item.id == slotid;
			});
		}

		this.viewValue['singleSite'] = data;
		refreshSingleSite(this);
	}



	/**
	 * 获取网站左列表已选择数据
	 */
	function getSelected_tblSingleSiteLeft(ctrl) {
		var leftList = ctrl.c('tblSingleSiteLeft'),
			data = leftList.model.datasource,
			dataLen = data.length,
			chkidPrefix = leftList.getId('multiSelect'),
			chk, row, selected = [], unselected = [];

			for (var i = 0; i < dataLen; i++) {
		        chk = baidu.g(chkidPrefix + i);
		        row = leftList.getRow(i);

		        if (chk.checked) {
		        	selected.push(data[i]);
		        }
		        else {
		        	unselected.push(data[i]);
		        }
		    }

		return {
			selected: selected,
			unselected: unselected
			};
	}


	/**
	 * 设置viewValue
	 */
	function setViewValue(ctrl,key,datasource) {
		if (key == 'singleSite') {
			var selected = datasource.selected, unselected = datasource.unselected;
			//（由于搜索功能导致的判断）
			//若原来有，但是现在未被勾选，则删除
			baidu.array.each(unselected, function(item,i) {
				baidu.array.remove(ctrl.viewValue['singleSite'], function(citem,index) {
					return citem.id == item.id;
				});
			});
			//若原来没有，则添加上去
			baidu.array.each(selected, function(item,i) {
				if (!slotHelper.viewValue.hasSlot_singlesite.call(ctrl, item.id)) {
					ctrl.viewValue['singleSite'].push(item);
				}
			});

		}
		else {
			var sublists = [];
			var selected = datasource.subLists,//[[1,2],[1,3]]
				unselected = datasource.subListsUnselected,//[[1,2],[1,3]]
				tmpSublist;

			baidu.array.each(datasource.mainList, function(pitem,index) {
				tmpSublist = slotHelper.getSelectedSublistByCommunityId.call(ctrl, pitem.id);

				//（由于搜索功能导致的判断）
				//找原来的ctrl.viewValue['multiSites'].mainList是否有该ID
				if (tmpSublist) {
					//若有该ID，则该ID对应的sublist与现有selected的对应的sublist进行合并，得到最终的sublist:
					//合并步骤1：若原来有，但是现在未被勾选，则删除
					if (unselected[index]) {
						baidu.array.each(unselected[index], function(item,i) {
							baidu.array.remove(tmpSublist, function(citem,ci) {
								return citem.id == item.id;
							});
						});
					}
					//合并步骤2：若原来没有，则添加上去
					if (selected[index]) {
						baidu.array.each(selected[index], function(item,i) {
							var tmp = baidu.array.find(tmpSublist, function(citem,ci) {
								return citem.id == item.id;
							});
							if (!tmp) {
								tmpSublist.push(item);
							}
						});
					}
					sublists.push(tmpSublist);
				}
				else {
					//若没有该ID，则直接Push进去
					sublists.push(datasource.subLists[index].slice(0));
				}
			});

			ctrl.viewValue[key].mainList = datasource.mainList.slice(0);//[1,2]
			ctrl.viewValue[key].subLists = sublists.slice(0);

		}
	}


	/**
	 * 网站列表全选框
	 */
	function chkAllStatus_tblSingleSiteLeft(ctrl) {
		var leftList = ctrl.c('tblSingleSiteLeft'),
			selAll = baidu.g(leftList.getId('selectAll')),
			chkidPrefix = leftList.getId('multiSelect'),
			hasAllSelected = true;
		baidu.array.each(leftList.model.datasource, function(item,i) {
			if (!baidu.g(chkidPrefix + i).checked) {
				hasAllSelected = false;
				return false;
			}
		});
		selAll.checked = hasAllSelected;
	}

	/**
	 * 生活圈列表全选框
	 */
	function chkAllStatus_tblMultiSitesLeft(ctrl) {
		var tbl = ctrl.c('tblMultiSitesLeft'),
			selAll = baidu.g(tbl.getId('selectAll')),
			chkidPrefix = tbl.getId('multiSelect'),
			hasAllSelected = true;
		var data = tbl.model ? tbl.model.datasource : tbl.datasource;
		baidu.array.each(data, function(item,i) {
			if (!baidu.g(chkidPrefix + i).checked) {
				hasAllSelected = false;
				return false;
			}
		});
		selAll.checked = hasAllSelected;
	}

	/**
	 * 生活圈子列表全选框
	 *
	 */
	function chkAllStatus_tblMultiSitesLeft_Sublist(ctrl,tbl) {
		function getPItemIdbySubrowallcheckId(allcheckId) {
        	//formAd_slotSelector_tblMultiSitesLeft_slotSubListLeft0selectAll--->formAd_slotSelector_tblMultiSitesLeftmultiSelect0
        	return ctrl.c('tblMultiSitesLeft').getId('multiSelect') + allcheckId.match(/^\D+(\d+)\D+$/)[1];
        }

		var selAll = baidu.g(tbl.getId('selectAll')),
			chkidPrefix = tbl.getId('multiSelect'),
			hasAllSelected = true;
		var data = tbl.model ? tbl.model.datasource : tbl.datasource;
		if (0 === data.length) {
			hasAllSelected = false;
		}
		baidu.array.each(data, function(item,i) {
			if (!baidu.g(chkidPrefix + i).checked) {
				hasAllSelected = false;
				return false;
			}
		});
		selAll.checked = hasAllSelected;
		var pItemId = getPItemIdbySubrowallcheckId(selAll.id);
		baidu.g(pItemId).checked = hasAllSelected;
	}

	/**
     * 根据生活圈ID获取该生活圈下已选择的广告位list
     */
	function getSelectedSlotlistByCommunityId(communityId) {
    	var rtn = [], me = this;
    	baidu.array.find(me.viewValue['multiSites'].mainList, function(item,i) {
    		if (communityId == item.id) {
    			rtn = me.viewValue['multiSites'].subLists[i].slice(0);
    			return false;
    		}
    	});
    	return rtn;
    }

	/**
     * 重绘生活圈左列表的各子列表
     */
    function rebindSublist_MultiSitesTbl() {
    	var dataCommunity = this.datasourceMultiSitesLeft,
	  		dataCommunityLen = dataCommunity.length,
	  		param, slotlist, i,
	  		me = this,
	  		subrowTable, mainTable = this.c('tblMultiSitesLeft'),
    		comboBox, txtInput;

		param = 'type=' + me.productType +
				'&' + this.customConfig.defaultSlotlistParam_typejoin +
				'&' + me.customConfig.defaultCommunitylistParam_status +
				'&' + me.customConfig.defaultCommunitySlotlistParam_status;

		baidu.g(mainTable.getId('selectAll')).checked = false;
		this.communityslotRequester(param, function(data) {
			var communityList = data.page.result;

			for (i = 0; i < dataCommunityLen; i++) {
	  			slotlist = baidu.array.find(communityList, function(item,index) {
	  				return item.id == dataCommunity[i].id;
	  			});

	  			baidu.g(mainTable.getId('multiSelect' + i)).checked = false;

	  			//rebind 列表
	  			subrowTable = mainTable.c(SUBTABLE_IDPREFIX_LEFT + i);
	  			subrowTable.refer = {datasource: 'datasource'};
				subrowTable.rebindModel({
					datasource: slotlist ? slotlist.slotlist.slice(0) : []
				});
				subrowTable.refer = null;
				initCheckDisplay_tblMultiSitesLeft_SingleSublist.call(me, subrowTable);
	    		baidu.hide(baidu.g(subrowTable.getId() + 'selectAll'));

	    		//rebind combobox
	    		comboBox = mainTable.c('cBox' + i);
	    		comboBox.refer = {datasource: 'datasource'};
	    		if (comboBox) comboBox.rebindModel({
	    			datasource: me.datasourceSlotStatus
	    		});
	    		comboBox.refer = null;

	    		//init textinput
	    		txtInput = mainTable.c('txtSearch' + i);
	    		txtInput.setValue('');
	  		}

		});
    }


    /**
     * 重绘网站左列表
     */
    function rebind_SingleSiteTbl() {
    	var param = 'type=' + this.productType +
	    	'&' + this.customConfig.defaultSlotlistParam_status +
	    	'&' + this.customConfig.defaultSlotlistParam_typejoin +
	    	'&page.pageNo=1&page.pageSize=15',
    		mainTable = this.c('tblSingleSiteLeft'),
    		me = this;
    	me.slotlistRequester(param, function(data) {
    		mainTable.rebindModel({
    			datasource: data.page.result
    		});
    	});
    	me.c('comboSearchStatus').refer = {datasource: 'datasource'};
    	me.c('comboSearchStatus').rebindModel({
    		datasource: me.datasourceSlotStatus
    	});
    	me.c('comboSearchStatus').refer = null;
    	me.c('txtSearchDomain').setValue('');
    }

    /**
     * 同步展开状态
     */
    function syncCollapse(targetDirection,type,index,dataItem) {
    	var tblTarget, tblSource;
    	if (targetDirection == 'left') {
    		tblTarget = this.c('tblMultiSitesLeft');
    		tblSource = this.c('tblMultiSitesRight');
    	}
    	else {
    		tblTarget = this.c('tblMultiSitesRight');
    		tblSource = this.c('tblMultiSitesLeft');
    	}

    	var communityId = dataItem.id;
    	function doFire(tbl,type,index) {
    		if (type == 'open') {
				tbl.openSubrow(index);
			}
    		else {
    			tbl.closeSubrow(index);
    		}
    	}

    	baidu.array.each(tblTarget.model.datasource, function(item,i) {
    		if (item.id == communityId) {
    			doFire(tblTarget, type, i);
    			return false;
    		}
    	});
    	/*
    	//主要处理右侧删除会刷新自己，左侧不刷新故不需操作
    	if(targetDirection=='left'){
	    	baidu.array.each(tblSource.model.datasource,function(item,i){
	    		if(item.id==communityId){
	    			doFire(tblSource,type,i);
	    			return false;
	    		}
	    	});
    	}
    	*/

    }


    function initLblNum() {
    	baidu.g('lblMultiSlotNum').innerHTML = baidu.format(lang.listSummary, 0);
    	baidu.g('lblSingleSlotNum').innerHTML = baidu.format(lang.listSummary, 0);
    }

	function validateControlParam() {
    	if (!this.datasourceMultiSitesLeft) {throw new Error('please set control parameter:datasourceMultiSitesLeft')}
    	if (!this.datasourceSingleSiteLeft) {throw new Error('no1 datasourceMultiSitesLeft')}
    	if (!this.datasourceSlotStatus) {throw new Error('please set control parameter:datasourceSlotStatus')}
    	if (!this.slotlistRequester) {throw new Error('please set control parameter:slotlistRequester')}
    }



	return {

        bindModel: function(model) {
            if ('true' === this.hideBudget) this.hideBudget = true;
            ui.SlotSelector.superClass.bindModel.call(this, model);
            var tpl4fields = {
                    deleteSingleSiteTpl: '<span onclick="{1}" class="ui-orient-sel-listentry">{0}</span>'
            };

            /**
             * 字段配置
             */
            this.fields = {
                    //生活圈左列表
                    multiSitesLeft: [
                        {
                            title: '生活圈名称',
                            stable: true,
                            field: 'name',
                            subEntry: true,
                            width: 245,
                            content: function(item) {
                                return item.name;
                            }
                        },
                        {
                            title: '<span id=\"' + this.id + '_batchMultiAdd' + '\" class=\"ui-orient-sel-listentry\" onclick=\"ui.util.get(\'formAd_slotSelector_tblMultiSitesLeft\').onBatchAdd();\">批量添加</span>',
                            stable: true,
                            field: 'name',
                            width: 65,
                            content: function(item) {
                                return '';
                            }
                        }

                    ],
                    //生活圈左子列表
                    subrow_multiSitesLeft: [
                        {
                            title: '广告位名称',
                            width: 170,
                            stable: true,
                            field: 'name',
                            breakLine: true,
                            content: function(item) {
                                return item.name;
                            }
                        },
                        {
                            title: '域名',
                            width: 160,
                            stable: true,
                            field: 'domain',
                            breakLine: true,
                            content: function(item) {
                                return item.domain.join('<br/>');
                            }
                        },
                        {
                            title: '状态',
                            width: 50,
                            stable: false,
                            field: 'status',
                            content: function(item) {
                                // FIXME 不应该和slot.config有关系的呀
                                return dn.util.getStatusHtml(er.context.get('slotStatusMap')[item['status']],
                                  slot.config.statusClassMap);
                            }
                        }
                    ],
                    //生活圈右列表
                    multiSitesRight: [
                        {
                            title: '已选广告位',
                            width: 190,
                            stable: true,
                            subEntry: true,
                            breakLine: true,
                            field: 'name',
                            content: function(item) {
                                return item.name;
                            }
                        },
                        {
                            title: '域名',
                            width: 190,
                            stable: true,
                            field: '',
                            content: function(item) {
                                if (true === this.parent.hideBudget) {
                                    return '';
                                }
                                else {
                                    var v = '';
                                    baidu.array.each(this.parent.viewValue['budget'].multiSites, function(citem,i) {
                                        if (citem.id == item.id) {
                                            v = citem.budget;
                                            return false;
                                        }
                                    });
                                    return '预算：<input type="text" value="' + v + '" style="background: none repeat scroll 0 0 #FFFFFF;border: 1px solid #7E9DB9;padding: 1px 2px;text-align: left;width:70px;" name="budget" id="budget" /> 元';
                                }
                            }
                        },
                        {
                            title: '<span id=\"' + this.id + '_multiDeleteAll' + '\" class=\"ui-orient-sel-listentry\" onclick=\"ui.util.get(\'formAd_slotSelector_tblMultiSitesRight\').onDelete_tblMultiSitesLeft(\'\',\'main_all\');\">全部删除</span>',
                            width: 60,
                            stable: false,
                            field: 'status',
                            content: function(item) {
                                return baidu.format(tpl4fields.deleteSingleSiteTpl,
                                        '删除',
                                        this.getStrCall('onDelete_tblMultiSitesLeft', item.id, 'main_item')
                                        );
                            }

                        }
                    ],
                    //生活圈右子列表
                    subrow_multiSitesRight: [
                        {
                            title: '广告位名称',
                            width: 165,
                            stable: true,
                            field: 'name',
                            breakLine: true,
                            content: function(item) {
                                return item.name;
                            }
                        },
                        {
                            title: '域名',
                            width: 195,
                            stable: true,
                            field: 'domain',
                            breakLine: true,
                            content: function(item) {
                                return item.domain.join('<br/>');
                            }
                        },
                        {
                            title: '',
                            width: 90,
                            stable: false,
                            field: '',
                            content: function(item) {
                                return baidu.format(tpl4fields.deleteSingleSiteTpl,
                                        '删除',
                                        this.getStrCall('onDelete_tblMultiSitesLeft', item.id, 'sub_item')
                                        );
                            }
                        }
                    ],
                    //结果生活圈列表
                    multiSitesResult: [
                        {
                            title: '',
                            width: 200,
                            stable: true,
                            subEntry: true,
                            field: 'name',
                            content: function(item) {
                                return item.name;
                            }
                        },
                        {
                            title: '',
                            width: 70,
                            stable: false,
                            field: 'status',
                            content: function(item) {
                                return '';
                            }

                        },
                        {
                            title: '',
                            width: 70,
                            stable: false,
                            field: 'status',
                            content: function(item) {
                                return '';
                            }

                        },
                        {
                            title: '',
                            width: 150,
                            stable: false,
                            field: '',
                            content: function(item) {
                                if (true === this.parent.hideBudget) {
                                    return '';
                                }
                                else {
                                    var v = '';
                                    baidu.array.each(this.parent.viewValue['budget'].multiSites, function(citem,i) {
                                        if (citem.id == item.id) {
                                            v = citem.budget;
                                            return false;
                                        }
                                    });
                                    return '预算：' + v + '元';
                                }
                            }
                        }
                    ],
                    //结果生活圈子列表
                    subrow_multiSitesResult: [
                        {
                            title: '广告位名称',
                            width: 190,
                            stable: true,
                            field: 'name',
                            breakLine: true,
                            content: function(item) {
                                return item.name;
                            }
                        },
                        {
                            title: '域名',
                            width: 190,
                            stable: true,
                            field: 'domain',
                            breakLine: true,
                            content: function(item) {
                                return item.domain.join('<br/>');
                            }
                        },
                        {
                            title: '',
                            width: 120,
                            stable: false,
                            field: 'status',
                            content: function(item) {
                                return dn.util.getStatusHtml(er.context.get('slotStatusMap')[item['status']], slot.config.statusClassMap);
                            }
                        },
                        {
                            title: '',
                            width: 0,
                            stable: false,
                            field: '',
                            content: function(item) {
                                return '';
                            }
                        }
                    ],
                    //网站左列表
                    singleSiteLeft: [
                        {
                            title: '广告位名称',
                            width: 172,
                            stable: true,
                            field: 'name',
                            breakLine: true,
                            content: function(item) {
                                return item.name;
                            }
                        },
                       {
                            title: '域名',
                            width: 160,
                            stable: true,
                            field: 'domain',
                            dragable: true,
                            breakLine: true,
                            content: function(item) {
                                return item.domain.join('<br/>');
                            }
                        },
                            {
                            title: '状态',
                            width: 70,
                            stable: false,
                            field: 'status',
                            content: function(item) {
                                return dn.util.getStatusHtml(er.context.get('slotStatusMap')[item['status']], slot.config.statusClassMap);
                            }
                        }
                    ],
                    //网站右列表
                    singleSiteRight: [
                        {
                            title: '广告位名称',
                            width: 140,
                            stable: true,
                            breakLine: true,
                            field: 'name',
                            content: function(item) {
                                return item.name;
                            }
                        },
                        {
                            title: '域名',
                            width: 140,
                            stable: true,
                            field: 'domain',
                            dragable: true,
                            breakLine: true,
                            content: function(item) {
                                return item.domain.join('<br/>');
                            }
                        },
                        {
                            title: '预算(元)',
                            width: 80,
                            stable: false,
                            field: '',
                            content: function(item) {
                                if (true === this.parent.hideBudget) {
                                    return '';
                                }
                                else {
                                    var v = '';
                                    baidu.array.each(this.parent.viewValue['budget'].singleSite, function(citem,i) {
                                        if (citem.id == item.id) {
                                            v = citem.budget;
                                            return false;
                                        }
                                    });
                                    return '<input type="text" value="' + v + '" style="background: none repeat scroll 0 0 #FFFFFF;border: 1px solid #7E9DB9;padding: 1px 2px;text-align: left;width:70px;" name="budget" id="budget" />';
                                }
                            }
                        },
                        {
                             title: '<span id=\"' + this.id + '_singleDelAll' + '\" class=\"ui-orient-sel-listentry\" onclick=\"ui.util.get(\'formAd_slotSelector_tblSingleSiteRight\').onDelete_tblSingleSiteLeft(\'\');\">全部删除</span>',
                             width: 60,
                             stable: false,
                             field: 'status',
                             content: function(item) {
                                 return baidu.format(tpl4fields.deleteSingleSiteTpl,
                                        '删除',
                                        this.getStrCall('onDelete_tblSingleSiteLeft', item.id)
                                        );

                             }
                        }
                    ],

                    //网站结果列表
                    singleSiteResult: [
                        {
                            title: '',
                            width: 150,
                            stable: true,
                            breakLine: true,
                            field: 'name',
                            content: function(item) {
                                return item.name;
                            }
                        },
                        {
                            title: '',
                            width: 150,
                            stable: true,
                            field: 'domain',
                            breakLine: true,
                            content: function(item) {
                                return item.domain.join('<br/>');
                            }
                        },
                        {
                             title: '',
                             width: 50,
                             stable: false,
                             field: 'status',
                             content: function(item) {
                                 return dn.util.getStatusHtml(er.context.get('slotStatusMap')[item['status']], slot.config.statusClassMap);

                             }
                        },
                        {
                            title: '',
                            width: 150,
                            stable: false,
                            field: '',
                            content: function(item) {
                                if (true === this.parent.hideBudget) {
                                    return '';
                                }
                                else {
                                    var v = '';
                                    baidu.array.each(this.parent.viewValue['budget'].singleSite, function(citem,i) {
                                        if (citem.id == item.id) {
                                            v = citem.budget;
                                            return false;
                                        }
                                    });
                                    return '预算：' + v + ' 元';
                                }
                            }
                        }
                    ]

            };

            //没有预算后列表宽度的处理
            if (true === this.hideBudget) {
                this.fields.singleSiteRight.splice(2, 1);
                this.fields.singleSiteRight[0].width += 40;
                this.fields.singleSiteRight[1].width += 40;

                this.fields.singleSiteResult.splice(3, 1);
                this.fields.singleSiteResult[0].width += 65;
                this.fields.singleSiteResult[1].width += 65;

            }

            this.c('tblMultiSitesLeft').bindModel({
                datasource: this.datasourceMultiSitesLeft,
                fields: this.fields.multiSitesLeft,
                noDataHtml: this.customConfig.noDataInfo,
                select: 'multi',
                dragable: true,
                bodyHeight: this.bodyHeight,
                subrow: 1
            });
            this.c('tblMultiSitesRight').bindModel({
                datasource: [],
                fields: this.fields.multiSitesRight,
                noDataHtml: this.customConfig.noDataInfo,
                dragable: true,
                bodyHeight: this.bodyHeight
            });
            this.c('tblSingleSiteLeft').bindModel({
                datasource: this.datasourceSingleSiteLeft,
                fields: this.fields.singleSiteLeft,
                noDataHtml: this.customConfig.noDataInfo,
                select: 'multi',
                dragable: true,
                bodyHeight: this.bodyHeight
            });
            this.c('tblSingleSiteRight').bindModel({
                datasource: [],
                fields: this.fields.singleSiteRight,
                noDataHtml: this.customConfig.noDataInfo,
                dragable: true,
                bodyHeight: this.bodyHeight
            });

            this.c('listPagerSingleSiteLeft').bindModel(pagerHelper.call(this, this.singleSiteTotalCount));
            this.c('tblMultiSitesResult').bindModel({
                datasource: [],
                fields: this.fields.multiSitesResult,
                noDataHtml: this.customConfig.noDataInfo,
                dragable: true,
                bodyHeight: this.bodyHeight,
                subrow: 1
            });
            this.c('tblSingleSiteResult').bindModel({
                datasource: [],
                fields: this.fields.singleSiteResult,
                noDataHtml: this.customConfig.noDataInfo,
                dragable: true,
                bodyHeight: this.bodyHeight
            });
        },

        beforeRender: function() {
        	validateControlParam.call(this);
        },

        render: function(main) {
        	this.beforeRender();
            ui.SlotSelector.superClass.render.call(this, main);
            initLblNum();
            //try catch 为了防止
            //try{
            	this.renderSubList_tblMultiSitesLeft();
            //}catch(e){}

        },

        renderSubList_tblMultiSitesLeft: function() {
        	var dataCommunity = this.datasourceMultiSitesLeft,
		  		dataCommunityLen = dataCommunity.length,
		  		param, slotlist, i,
		  		me = this;

        	param = 'type=' + me.productType +
					'&' + me.customConfig.defaultSlotlistParam_typejoin +
					'&' + me.customConfig.defaultCommunitylistParam_status +
					'&' + me.customConfig.defaultCommunitySlotlistParam_status;

        	this.communityslotRequester(param, function(data) {
        		var communityList = data.page.result;
        		//拼凑allslotlist给setValue用,里面会有重复的，这个数组可能有上千条数据
        		me.model.AllSlotList = [];
        		for (i = 0; i < communityList.length; i++) {
        		    if (communityList[i].slotlist.length > 0) me.model.AllSlotList = me.model.AllSlotList.concat(communityList[i].slotlist);
        		}
        		if (me.model.noCommunitySlotlist && me.model.noCommunitySlotlist.length > 0) me.model.AllSlotList = me.model.AllSlotList.concat(me.model.noCommunitySlotlist);

        		for (i = 0; i < dataCommunityLen; i++) {
    	  			slotlist = baidu.array.find(communityList, function(item,index) {
    	  				return item.id == dataCommunity[i].id;
    	  			});
    	  			onShowSingleSubListLeft.call(me, slotlist ? slotlist.slotlist : [], i);
    	  		}

        		AfterShowAllSubListLeftCallback(me);
        	});

        },

        bindEvent: function() {
        	this.c('rdoMultiSites').onclick = baidu.fn.bind(onChangeCommunityType, this);
            this.c('rdoSingleSite').onclick = baidu.fn.bind(onChangeCommunityType, this);
            this.c('btnOk').onclick = baidu.fn.bind(onOK, this);
            this.c('btnCancel').onclick = baidu.fn.bind(onCancel, this);
            this.c('btnModifyMultiSites').onclick = baidu.fn.bind(onModifyMultiSites, this);
            this.c('btnModifySingleSite').onclick = baidu.fn.bind(onModifySingleSite, this);

            this.c('tblMultiSitesLeft').onBatchAdd = baidu.fn.bind(onAfterSelected_tblMultiSitesLeft, this);

            this.c('tblSingleSiteLeft').onselect = baidu.fn.bind(onSelected_tblSingleSiteLeft, this);
            this.c('listPagerSingleSiteLeft').onselect = baidu.fn.bind(onPageChanged_tblSingleSiteLeft, this);
            this.c('btnDomainSearch').onclick = baidu.fn.bind(onSearchSingleSite, this);//

            this.c('tblSingleSiteRight')['onDelete_tblSingleSiteLeft'] = baidu.fn.bind(onDelete_tblSingleSiteLeft, this);
            this.c('tblMultiSitesRight')['onDelete_tblMultiSitesLeft'] = baidu.fn.bind(onDelete_tblMultiSitesLeft, this);

            //同步生活圈左右收缩状态
            this.c('tblMultiSitesRight').onsubrowopen = baidu.fn.bind(syncCollapse, this, 'left', 'open');
            this.c('tblMultiSitesRight').onsubrowclose = baidu.fn.bind(syncCollapse, this, 'left', 'close');
            this.c('tblMultiSitesLeft').onsubrowopen = baidu.fn.bind(syncCollapse, this, 'right', 'open');
            this.c('tblMultiSitesLeft').onsubrowclose = baidu.fn.bind(syncCollapse, this, 'right', 'close');

        },

        /**
         * 验证预算合法性
         */
        validateBudget: function() {
            if (true === this.hideBudget) {
                return true;
            }
    		var rtn = true;
    		function isPositiveFloat(text) {
    			if (!/^[0-9]\d*(\.\d+)?$/.test(text)) {
                    return false;
                }
                if (text == '0' || text == 0) {
                    return false;
                }
                return true;
    		}

    		if (this.c('rdoMultiSites').getChecked()) {
    			baidu.array.each(this.viewValue['budget'].multiSites, function(item,i) {
    				if (!isPositiveFloat(baidu.trim(item.budget))) {
    					rtn = false;
    					return false;
    				}
            	});
    		}
    		else {
    			baidu.array.each(this.viewValue['budget'].singleSite, function(item,i) {
    				if (!isPositiveFloat(baidu.trim(item.budget))) {
    					rtn = false;
    					return false;
    				}
            	});
    		}
    		return rtn;
    	},

        /**
         * 对外暴露最终选择值的接口
         */
        getValue: function() {
        	if (!this.validateBudget()) {
        		return null;
        	}
        	var result = {
        			//生活圈：2，网站：3
        			orient_community: null,
        			//广告位ID,若为生活圈：1:1323|1334|2434,2:2311|2213 若为网站：1,2
        			budget_role_ids: null,
        			//预算 逗号分割，与budget_role_ids对应
        			budget_role_values: null,
        			//预算总额
        			budget_num: 0
        	};
        	var budget,
        	arr_budget_role_ids = [],
        	arr_budget_role_values = [],
        	arr_slot = [],
        	slot,
        	me = this;

        	//赋广告位类型
        	if (this.c('rdoMultiSites').getChecked()) {
        		result.orient_community = slotType.MULTISITES;
        		slot = this.viewValue['multiSites'];
        		budget = this.viewValue['budget'].multiSites.slice(0);
        	}else {
        		result.orient_community = slotType.SINGLESITE;
        		slot = this.viewValue['singleSite'];
        		budget = this.viewValue['budget'].singleSite.slice(0);
        	}

        	if (true === this.hideBudget) {
        	    if (slotType.MULTISITES == result.orient_community) {
        	        var tmpList;
                    //赋广告位ID值
                    baidu.array.each(slot.mainList, function(item,index) {
                        arr_slot = [];
                        tmpList = getSelectedSlotlistByCommunityId.call(me, item.id);
                        baidu.array.each(tmpList, function(citem,i) {
                            arr_slot.push(citem.id);
                        });
                        arr_budget_role_ids.push(item.id + '^' + arr_slot.join('~'));
                    });
                    result.budget_role_ids = arr_budget_role_ids.join(',');
        	    }
        	    else {
        	        baidu.array.each(slot, function(item,i) {
        	            arr_budget_role_ids.push(item.id);
        	        });
        	        result.budget_role_ids = arr_budget_role_ids.join(',');
        	    }
        	}
        	else {
            	if (slotType.MULTISITES == result.orient_community) {
            		var tmp_arr_budget_role_ids = [], tmpList;
            		//赋预算值
                	baidu.array.each(budget, function(item,i) {
                		tmp_arr_budget_role_ids.push(item.id);
                		arr_budget_role_values.push(item.budget);
                	});
                	result.budget_role_values = arr_budget_role_values.join(',');

                	//赋广告位ID值
        	        baidu.array.each(tmp_arr_budget_role_ids, function(id,index) {
        	        	arr_slot = [];
        	        	tmpList = getSelectedSlotlistByCommunityId.call(me, id);
        	        	baidu.array.each(tmpList, function(item,i) {
        	        		arr_slot.push(item.id);
        	        	});
        	        	arr_budget_role_ids.push(id + '^' + arr_slot.join('~'));
        	        });
        	        result.budget_role_ids = arr_budget_role_ids.join(',');

            	}
            	else {
            		//赋网站的预算值 和 广告位ID值
                	baidu.array.each(budget, function(item,i) {
                		arr_budget_role_ids.push(item.id);
                		arr_budget_role_values.push(item.budget);
                	});
                	result.budget_role_values = arr_budget_role_values.join(',');
                	result.budget_role_ids = arr_budget_role_ids.join(',');
            	}

            	baidu.array.each(budget, function(item,i) {
            		result.budget_num += parseFloat(item.budget);
            	});
        	}


            return result;
        },

        setValue: function() {
        	//try{
        	var me = this;
        	/*
        	this.selectedSlot={orient_community:'2/3',
			        		   budget_role_ids:["1", "2"],
			        		   budget_role_values:["5000", "9000"],
			        		   budget_role_slot_ids:[
			        		                         {"id":"1","value":["2323","2334","3434"]},
			        		                         {"id":"2","value":["2325","2336","3437"]}
			        		                         ]
        					   };
        					   */
        	//设置viewValue
        	if (slotType.MULTISITES == this.selectedSlot.orient_community) {
        		baidu.array.each(me.selectedSlot.budget_role_ids, function(communityId,index) {
        			me.viewValue['budget'].multiSites.push({id: communityId, budget: me.selectedSlot.budget_role_values[index]});

        			var community = baidu.array.find(me.datasourceMultiSitesLeft, function(item,i) {
        				return item.id == communityId;
        			});

        			if (community) {
        				me.viewValue['multiSites'].mainList.push(community);

	        			var arrId;
	        			arrId = baidu.array.find(me.selectedSlot.budget_role_slot_ids, function(item,i) {
	        				return item.id == communityId;
	            		});
	        			if (arrId) {
	        				arrId = arrId.value;
	        			}

	        			var arr = [];
	        			baidu.array.each(arrId, function(id,i) {
	        				var slot = baidu.array.find(me.model.AllSlotList, function(item,j) {
	            				return item.id == id;
	            			});
	        				if (slot) {
	        					arr.push(slot);
	        				}
	        			});
	        			me.viewValue['multiSites'].subLists.push(arr);
        			}

        		});
        	}
        	else {
        		baidu.array.each(me.selectedSlot.budget_role_ids, function(slotId,index) {
        			me.viewValue['budget'].singleSite.push({id: slotId, budget: me.selectedSlot.budget_role_values[index]});

        			var slot = baidu.array.find(me.model.AllSlotList, function(item,i) {
        				return item.id == slotId;
        			});
        			//todo 有没有可能slotid在列表中不存在，即广告位被删除什么。。
        			if (slot) {
        			    me.viewValue['singleSite'].push(slot);
        			}
        		});
        	}

	        	//绑定各列表
	        	if (slotType.MULTISITES == this.selectedSlot.orient_community) {
	        		this.c('rdoMultiSites').setChecked(true);
	        		this.c('rdoSingleSite').setChecked(false);
	        		refreshMultiSites(this);
	        	}
	        	else {
	        		this.c('rdoMultiSites').setChecked(false);
	        		this.c('rdoSingleSite').setChecked(true);
	        		refreshSingleSite(this);
	        	}
	        	execOK.call(this);


        	//}catch(e){}
        },


        /**
         * 点击切换产品形式，导致的重绘
         * 选择某产品形式后，不考虑刷新生活圈大table，切换产品形式后清空，不考虑临时存储某一产品形式下的选中的广告位状态以供回填行为
         */
        initByProductType: function(productType,statusList) {
        	this.productType = productType;
        	this.datasourceSlotStatus = statusList;

        	var leftlist_multi = this.c('tblMultiSitesLeft'),
        		rightlist_multi = this.c('tblMultiSitesRight'),
        		leftlist_single = this.c('tblSingleSiteLeft'),
        		rightlist_single = this.c('tblSingleSiteRight'),
        		resultlist_multi = this.c('tblMultiSitesResult'),
        		resultlist_single = this.c('tblSingleSiteResult');

        	//1 清空viewValue
        	this.viewValue = {
        	    	multiSites: {
        	    		mainList: [],
        	    		subLists: []
        	    	},
        	    	singleSite: [],
        	    	budget: {
        	    		multiSites: [],
        	    		singleSite: []
        	    	}
        	    };

        	this.formalViewValue = {
                	multiSites: {
                		mainList: [],
                		subLists: []
                	},
                	singleSite: [],
                	budget: {
                		multiSites: [],
                		singleSite: []
                	}
                };

        	//2 重新绑定生活圈下各个table的datasource 及 绑定事件
        	rebindSublist_MultiSitesTbl.call(this);

        	//3 清空生活圈右列表：
        	rightlist_multi.rebindModel({
        		datasource: []
        	});

        	//4 清空生活圈结果列表
        	resultlist_multi.rebindModel({
				datasource: []
			});

        	//5 重新绑定网站左列表 slotlistRequester（‘productType=’）
        	rebind_SingleSiteTbl.call(this);

        	//6 清空网站右列表
        	rightlist_single.rebindModel({
				datasource: []
			});

        	//7 清空网站结果列表
        	resultlist_single.rebindModel({
				datasource: []
			});

        	//8 重置DIV显示状态
        	initLblNum();
        	this.c('rdoMultiSites').setChecked(true);
    		this.c('rdoSingleSite').setChecked(false);
    		showResult.call(this, false);
        },

        getParamValue: function() {
            return this.getValue().join(',');
        },

        dispose: function() {
        	this.c('rdoMultiSites').onclick = null;
            this.c('rdoSingleSite').onclick = null;
            this.c('btnOk').onclick = null;
            this.c('btnCancel').onclick = null;
            this.c('btnModifyMultiSites').onclick = null;
            this.c('btnModifySingleSite').onclick = null;

            this.c('tblSingleSiteLeft').onselect = null;
            this.c('listPagerSingleSiteLeft').onselect = null;
            this.c('btnDomainSearch').onclick = null;

            this.c('tblSingleSiteRight')['onDelete_tblSingleSiteLeft'] = null;
            this.c('tblMultiSitesRight')['onDelete_tblMultiSitesLeft'] = null;

            //同步生活圈左右收缩状态
            this.c('tblMultiSitesRight').onsubrowopen = null;
            this.c('tblMultiSitesRight').onsubrowclose = null;
            this.c('tblMultiSitesLeft').onsubrowopen = null;
            this.c('tblMultiSitesLeft').onsubrowclose = null;

            ui.SlotSelector.superClass.dispose.call(this);
        }

	};
})();

baidu.inherits(ui.SlotSelector, ui.InputControl);
