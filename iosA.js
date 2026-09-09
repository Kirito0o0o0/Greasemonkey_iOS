(function() {
    'use strict';

	alert('SCRIPT STARTED, URL: ' + window.location.href);
	
	if (window.self === window.top) {
    if (window.location.href.indexOf("MyZolog") !== -1 && window.location.href.indexOf("Login") === -1) {

        // GLOBAL FUNCTIONS
        function hideHouseMenu() {
            var style = document.createElement('style');
            style.textContent = '#tblZologMain { display:none!important; }';
            document.head.appendChild(style);
        }

        function hideAdrenalinLogo() {
            var style = document.createElement('style');
            style.textContent = `
                #imgpoverdby,
                .logo-pwr {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
		
		

        function fixSearchAlignment() {
			var el = document.querySelector('.col-lg-4.col-md-4.col-sm-4.col-xs-12.clearfix');
			if (el) el.style.setProperty('display', 'none', 'important');

			var ddown = document.getElementById('ddown');
			if (ddown) ddown.style.setProperty('display', 'none', 'important');

			var hamburger = document.querySelector('.navbar-toggle');
			if (hamburger) hamburger.style.setProperty('display', 'none', 'important');
	
			var navHeader = document.querySelector('.navbar-header');
			if (navHeader) {
				navHeader.style.setProperty('position', 'fixed', 'important');
				navHeader.style.setProperty('top', '0', 'important');
				navHeader.style.setProperty('left', '0', 'important');
				navHeader.style.setProperty('z-index', '99998', 'important');
				navHeader.style.setProperty('height', '44px', 'important');
			}

			var navCollapse = document.querySelector('.navbar-collapse');
			if (navCollapse) {
				navCollapse.style.setProperty('display', 'block', 'important');
				navCollapse.style.setProperty('position', 'fixed', 'important');
				navCollapse.style.setProperty('top', '0', 'important');
				navCollapse.style.setProperty('right', '0', 'important');
				navCollapse.style.setProperty('width', 'auto', 'important');
				navCollapse.style.setProperty('z-index', '99997', 'important');
			}
	
			var navbar = document.querySelector('.navbar');
			if (navbar) navbar.style.setProperty('position', 'fixed', 'important');
	
			var style = document.createElement('style');
			style.textContent = `
				.navbar { position: fixed !important; top: 0 !important; width: 100% !important; z-index: 99996 !important; }
				#iFrameMain { margin-top: 0 !important; top: 0 !important; }
			`;
			document.head.appendChild(style);
	
			window.visualViewport.addEventListener('resize', function() {
				var navbar = document.querySelector('.navbar');
				if (navbar) {
					navbar.style.setProperty('position', 'fixed', 'important');
					navbar.style.setProperty('top', '0', 'important');
				}
			});
	
			var navHeader = document.querySelector('.navbar-header');
			if (navHeader) navHeader.style.setProperty('display', 'flex', 'important');
			if (navHeader) navHeader.style.setProperty('align-items', 'center', 'important');
		}

        function closeNavbar() {
			var hamburger = document.querySelector('.navbar-toggle');
			if (hamburger && window.getComputedStyle(hamburger).display !== 'none') {
				hamburger.click();
			}
		}
		
		window.zologCurrentPage = '';
		
		function showDebug(text) {
		  var panel = document.getElementById('debugPanel');
		  if (!panel) {
			panel = document.createElement('div');
			panel.id = 'debugPanel';
			panel.style.cssText = 'position:fixed;bottom:0;left:0;right:0;max-height:40vh;overflow-y:auto;background:#000;color:#0f0;font-size:11px;padding:8px;z-index:999999;white-space:pre-wrap;font-family:monospace;';
			document.body.appendChild(panel);
		  }
		  panel.textContent += text + '\n---\n';
		}

        function triggerSearch(keyword) {
            var searchBar = document.getElementById('txtName');
            if (searchBar) {
                searchBar.value = keyword;
                var enterEvent = new KeyboardEvent('keypress', { bubbles: true, cancelable: true, keyCode: 13, which: 13, key: 'Enter' });
                searchBar.dispatchEvent(enterEvent);
            }
        }

        // PAGE-SPECIFIC FUNCTIONS
        function applyLeaveRequestFixes(doc, retryCount) {
		retryCount = retryCount || 0;

		// Re-fetch the live iframe document each retry
		var iframeEl = document.getElementById('iFrameMain');
		if (iframeEl && iframeEl.contentDocument) {
			doc = iframeEl.contentDocument;
		}

		// The actual form lives inside a nested iframe (iframeNewSummary)
		var innerFrame = doc.getElementById('iframeNewSummary');
		var innerDoc = (innerFrame && innerFrame.contentDocument) ? innerFrame.contentDocument : null;

		if (!innerDoc || !innerDoc.getElementById('frmLeaveRequest')) {
			if (retryCount >= 20) {
				return;
			}
			setTimeout(function() { applyLeaveRequestFixes(doc, retryCount + 1); }, 500);
			return;
		}

		// Hide Employee Summary / Send SMS section (outer doc) — target the
		// specific "Send SMS" button and "Employee Summary" text, not the
		// whole NewEmpSummary form, which also wraps the Leave Request iframe
		var sendSmsBtn = doc.getElementById('bntSendSMS');
		if (sendSmsBtn) {
			var smsRow = sendSmsBtn.closest('div') || sendSmsBtn.parentElement;
			if (smsRow) smsRow.style.setProperty('display', 'none', 'important');
		}
		// Hide the employee name/icon row and Employee Summary section
		var empForm = doc.getElementById('NewEmpSummary');
		if (empForm) {
			var firstRow = empForm.querySelector('tr');
			if (firstRow) firstRow.style.setProperty('display', 'none', 'important');
			var empLabel = Array.from(empForm.querySelectorAll('*')).find(function(el) {
				return el.children.length === 0 && el.textContent.trim() === 'Employee Summary:';
			});
			if (empLabel) {
				var empRow = empLabel.closest('tr') || empLabel.closest('div');
				if (empRow) empRow.style.setProperty('display', 'none', 'important');
			}
			var namePattern = /^[A-Z][a-zA-Z'-]+(\s[A-Z][a-zA-Z'-]+){1,3}$/;
			var nameLabel = Array.from(empForm.querySelectorAll('*')).find(function(el) {
				return el.children.length === 0 && namePattern.test(el.textContent.trim());
			});
			if (nameLabel) {
				var nameRow = nameLabel.closest('tr') || nameLabel.closest('div');
				if (nameRow) nameRow.style.setProperty('display', 'none', 'important');
			}
		}

		// Hide "Logged in" status indicator (leftover from Employee Summary area)
		var loggedInEl = doc.getElementById('lblEmployeeStatus');
		if (loggedInEl) {
			var statusRow = loggedInEl.closest('#dvEmpStatus') || loggedInEl.closest('div[class*="col-"]');
			if (statusRow) statusRow.style.setProperty('display', 'none', 'important');
		}
		
		// Switch to the inner document for the rest of this function
		doc = innerDoc;
		
		// Hide "Viewing -> Name - [ID]" line, wherever it appears in the inner doc
		var viewingLine = Array.from(doc.querySelectorAll('*')).find(function(el) {
			return el.children.length === 0 && el.textContent.trim().indexOf('Viewing ->') === 0;
		});
		if (viewingLine) {
			var vRow = viewingLine.closest('tr') || viewingLine.parentElement;
			if (vRow) vRow.style.setProperty('display', 'none', 'important');
		}

		alert('You are on the Leave Request page.');
		
		doc.documentElement.style.setProperty('-webkit-text-size-adjust', '100%', 'important');
		doc.documentElement.style.setProperty('text-size-adjust', '100%', 'important');
		doc.body.style.setProperty('-webkit-text-size-adjust', '100%', 'important');
		doc.body.style.setProperty('text-size-adjust', '100%', 'important');
		
		function reapplyDynamicFixes(doc) {
			if (window.zologCurrentPage !== 'LeaveRequest') return;

			doc.querySelectorAll('.rcInputCell').forEach(function(td) {
				var row = td.closest('tr');
				if (row) {
					row.style.setProperty('display', 'table-row', 'important');
					Array.from(row.children).forEach(function(cell) {
						cell.style.setProperty('display', 'table-cell', 'important');
						cell.style.setProperty('vertical-align', 'middle', 'important');
					});
				}
			});

			var cal2 = doc.getElementById('txtDateFrom_calendar');
			if (cal2) {
				cal2.querySelectorAll('tr').forEach(function(row) {
					if (row.children.length === 5) {
						row.children[2].style.setProperty('white-space', 'nowrap', 'important');
						row.children[2].style.setProperty('width', 'auto', 'important');
					}
				});
			}
			var cal3 = doc.getElementById('txtDateTo_calendar');
			if (cal3) {
				cal3.querySelectorAll('tr').forEach(function(row) {
					if (row.children.length === 5) {
						row.children[2].style.setProperty('white-space', 'nowrap', 'important');
						row.children[2].style.setProperty('width', 'auto', 'important');
					}
				});
			}

			var fromRow6 = getLevel6Row(doc.getElementById('txtDateFrom_dateInput').closest('tr'));
			var toRow6 = getLevel6Row(doc.getElementById('txtDateTo_dateInput').closest('tr'));
			if (fromRow6 && fromRow6.children[2]) {
				fromRow6.children[2].style.setProperty('float', 'none', 'important');
				fromRow6.children[2].style.setProperty('width', '10px', 'important');
				fromRow6.children[2].style.setProperty('max-width', '10px', 'important');
			}
			if (toRow6 && toRow6.children[2]) {
				toRow6.children[2].style.setProperty('float', 'none', 'important');
				toRow6.children[2].style.setProperty('width', '10px', 'important');
				toRow6.children[2].style.setProperty('max-width', '10px', 'important');
			}
			if (fromRow6 && fromRow6.children[0]) fromRow6.children[0].style.setProperty('display', 'flex', 'important');
			if (toRow6 && toRow6.children[0]) toRow6.children[0].style.setProperty('display', 'flex', 'important');

			var tbody = doc.getElementById('lblFrom').closest('tr').parentElement;
			var rows = Array.from(tbody.querySelectorAll('tr'));
			var fromDateRow = rows[5];
			var fromRadioRow = doc.getElementById('rblFrom_0').closest('tr');
			if (fromDateRow && fromRadioRow) {
				fromDateRow.parentElement.insertBefore(fromRadioRow, fromDateRow.nextSibling);
				fromDateRow.style.cssText = 'overflow:visible;width:auto;';
				var rcInputCell = fromDateRow.querySelector('.rcInputCell');
				if (rcInputCell) {
					rcInputCell.style.setProperty('width', '130px', 'important');
					rcInputCell.style.setProperty('max-width', '130px', 'important');
					rcInputCell.style.setProperty('overflow', 'visible', 'important');
				}
				var wrapper = fromDateRow.querySelector('.riSingle');
				if (wrapper) wrapper.style.setProperty('width', '120px', 'important');
				var rcTable = fromDateRow.closest('table');
				if (rcTable) {
					rcTable.style.setProperty('table-layout', 'fixed', 'important');
					rcTable.style.setProperty('width', '170px', 'important');
				}
				fromRadioRow.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding-right:8px;';
				Array.from(fromRadioRow.querySelectorAll('td')).forEach(function(td) {
					td.style.cssText = 'display:inline-flex;align-items:center;white-space:nowrap;padding:2px;';
				});
			}

			var toDateRow = doc.querySelector('input[id="txtDateTo_dateInput"]').closest('tr');
			var toRadioRow = doc.getElementById('rblTo_0').closest('tr');
			if (toDateRow && toRadioRow) {
				toDateRow.parentElement.insertBefore(toRadioRow, toDateRow.nextSibling);
				toDateRow.style.cssText = 'overflow:visible;width:auto;';
				var rcInputCellTo = toDateRow.querySelector('.rcInputCell');
				if (rcInputCellTo) {
					rcInputCellTo.style.setProperty('width', '130px', 'important');
					rcInputCellTo.style.setProperty('max-width', '130px', 'important');
					rcInputCellTo.style.setProperty('overflow', 'visible', 'important');
				}
				var wrapperTo = toDateRow.querySelector('.riSingle');
				if (wrapperTo) wrapperTo.style.setProperty('width', '120px', 'important');
				var rcTableTo = toDateRow.closest('table');
				if (rcTableTo) {
					rcTableTo.style.setProperty('table-layout', 'fixed', 'important');
					rcTableTo.style.setProperty('width', '170px', 'important');
				}
				toRadioRow.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding-right:8px;';
				Array.from(toRadioRow.querySelectorAll('td')).forEach(function(td) {
					td.style.cssText = 'display:inline-flex;align-items:center;white-space:nowrap;padding:2px;';
				});
			}
			
			var leaveTypeEl = doc.getElementById('ddlLeaveType');
			if (leaveTypeEl) {
				var w = leaveTypeEl.getBoundingClientRect().width;
				['txtReason', 'txtLeaveAddress', 'txtPhoneNo'].forEach(function(id) {
					var el = doc.getElementById(id);
					if (el) {
						el.style.setProperty('width', w + 'px', 'important');
						el.style.setProperty('max-width', w + 'px', 'important');
						el.style.setProperty('box-sizing', 'border-box', 'important');
					}
				});
			}
			
			var imgShortcut = doc.getElementById('imgShortcut');
			var fromPopupBtn = doc.getElementById('txtDateFrom_popupButton');
			if (imgShortcut && fromPopupBtn && fromPopupBtn.nextSibling !== imgShortcut) {
				imgShortcut.style.setProperty('position', 'static', 'important');
				imgShortcut.style.setProperty('display', 'inline-block', 'important');
				imgShortcut.style.setProperty('vertical-align', 'middle', 'important');
				imgShortcut.style.setProperty('margin-left', '4px', 'important');
				fromPopupBtn.parentElement.insertBefore(imgShortcut, fromPopupBtn.nextSibling);
			}
			
			var support = Array.from(doc.querySelectorAll('*')).find(function(el) {
				return el.textContent.trim() === 'Support Document:' && el.children.length === 0;
			});
			if (support) {
				var srow = support.closest('tr');
				var uploadCell = srow.children[srow.children.length - 1];
				uploadCell.style.setProperty('overflow-x', 'auto', 'important');
				uploadCell.style.setProperty('max-width', '100%', 'important');
				var innerTable = uploadCell.querySelector('table');
				if (innerTable) {
					innerTable.style.setProperty('width', '100%', 'important');
					innerTable.style.setProperty('table-layout', 'auto', 'important');
				}
				Array.from(uploadCell.querySelectorAll('td')).forEach(function(td) {
					td.style.setProperty('white-space', 'normal', 'important');
					td.style.setProperty('word-break', 'break-word', 'important');
				});
			}
			
			var uploadInputEl = doc.querySelector('input[type="file"]');
			var refWidth = doc.getElementById('ddlLeaveType') ? doc.getElementById('ddlLeaveType').getBoundingClientRect().width : null;
			if (uploadInputEl && refWidth) {
				uploadInputEl.style.setProperty('width', refWidth + 'px', 'important');
				uploadInputEl.style.setProperty('max-width', refWidth + 'px', 'important');
				uploadInputEl.style.setProperty('box-sizing', 'border-box', 'important');
			}
			
			if (!window.phoneDebugLogged) {
				window.phoneDebugLogged = true;
				var phoneCheck = doc.getElementById('txtPhoneNo');
				showDebug('refWidth=' + refWidth + ' | phone actual width=' + (phoneCheck ? phoneCheck.getBoundingClientRect().width : 'N/A') + ' | upload actual width=' + (uploadInputEl ? uploadInputEl.getBoundingClientRect().width : 'N/A'));
			}
			
			alignRightColumnFields();
		}
		
		function syncHeaderToData(calRoot) {
			if (!calRoot) return;
			var headerRow = null, dataRow = null;
			calRoot.querySelectorAll('tr').forEach(function(row) {
				if (!headerRow && row.children.length === 8 && row.textContent.trim() === 'SMTWTFS') headerRow = row;
				if (!dataRow && row.children.length === 8 && /^\d/.test(row.children[1].textContent.trim())) dataRow = row;
			});
			if (!headerRow || !dataRow) return;

			var widths = Array.from(dataRow.children).map(function(cell) {
				return cell.getBoundingClientRect().width;
			});
			var totalWidth = widths.reduce(function(a, b) { return a + b; }, 0);

			if (totalWidth < 20) return;

			var dayTable = dataRow.closest('table');
			var navTable = Array.from(calRoot.querySelectorAll('table')).find(function(t) { return t !== dayTable; });

			dayTable.style.setProperty('table-layout', 'fixed', 'important');
			dayTable.style.setProperty('width', totalWidth + 'px', 'important');
			var oldColgroup = dayTable.querySelector('colgroup');
			if (oldColgroup) oldColgroup.remove();
			var colgroup = calRoot.ownerDocument.createElement('colgroup');
			widths.forEach(function(w) {
				var col = calRoot.ownerDocument.createElement('col');
				col.setAttribute('style', 'width:' + w + 'px !important;');
				colgroup.appendChild(col);
			});
			dayTable.insertBefore(colgroup, dayTable.firstChild);

			Array.from(dataRow.children).forEach(function(cell, i) {
				var hCell = headerRow.children[i];
				if (hCell) {
					var w = widths[i] + 'px';
					hCell.setAttribute('style', (hCell.getAttribute('style') || '') + ';width:' + w + ' !important;max-width:' + w + ' !important;min-width:' + w + ' !important;');
				}
			});

			if (navTable) {
				navTable.style.setProperty('width', totalWidth + 'px', 'important');
				navTable.style.setProperty('table-layout', 'fixed', 'important');
				navTable.style.setProperty('border-collapse', 'collapse', 'important');
				navTable.style.setProperty('border-spacing', '0', 'important');
				navTable.style.setProperty('border', 'none', 'important');

				var arrowWidth = 28;
				var titleWidth = totalWidth - (arrowWidth * 4);

				var titlebar = navTable.closest('td.rcTitlebar') || navTable.parentElement;
				if (titlebar) {
					titlebar.style.setProperty('width', totalWidth + 'px', 'important');
					titlebar.style.setProperty('border', 'none', 'important');
					titlebar.style.setProperty('overflow', 'visible', 'important');
					titlebar.style.setProperty('padding', '0', 'important');
					titlebar.style.setProperty('text-align', 'center', 'important');
				}

				var navRow = navTable.querySelectorAll('tr')[1];
				if (navRow) {
					var navWidths = [arrowWidth, arrowWidth, titleWidth, arrowWidth, arrowWidth];
					Array.from(navRow.children).forEach(function(cell, i) {
						var w = navWidths[i] + 'px';
						cell.setAttribute('style', (cell.getAttribute('style') || '') +
							';width:' + w + ' !important;max-width:' + w + ' !important;min-width:' + w + ' !important;' +
							'padding:0 1px !important;font-size:11px !important;white-space:nowrap !important;overflow:hidden !important;text-align:center !important;');
					});
				}

				navTable.style.setProperty('margin', '0 auto', 'important');

				var captionRow = navTable.querySelectorAll('tr')[0];
				if (captionRow) {
					Array.from(captionRow.children).forEach(function(c) {
						c.style.setProperty('color', 'transparent', 'important');
						c.style.setProperty('background', '#fff', 'important');
						c.style.setProperty('font-size', '0', 'important');
						c.style.setProperty('line-height', '0', 'important');
						c.style.setProperty('height', '0', 'important');
						c.style.setProperty('overflow', 'hidden', 'important');
						c.style.setProperty('display', 'none', 'important');
					});
				}
			}

			var popup = calRoot.closest('.RadCalendarPopup');
			if (popup) {
				var actualDayWidth = dayTable.getBoundingClientRect().width;
				popup.style.setProperty('width', (actualDayWidth + 2) + 'px', 'important');
				popup.style.setProperty('max-width', (actualDayWidth + 2) + 'px', 'important');
				popup.style.setProperty('overflow-x', 'hidden', 'important');
				popup.style.setProperty('box-sizing', 'border-box', 'important');
			}
		}
		
		doc.addEventListener('click', function(e) {
			if (e.target && e.target.id === 'txtDateFrom_popupButton') {
				setTimeout(function() { syncHeaderToData(doc.getElementById('txtDateFrom_calendar')); }, 300);
			}
			if (e.target && e.target.id === 'txtDateTo_popupButton') {
				setTimeout(function() { syncHeaderToData(doc.getElementById('txtDateTo_calendar')); }, 300);
			}
		}, true);
		
		var oldOtherStyle = doc.getElementById('attendance-reg-styles');
		if (oldOtherStyle) oldOtherStyle.remove();
		var oldSelfStyle = doc.getElementById('leave-request-styles');
		if (oldSelfStyle) oldSelfStyle.remove();

		var s = doc.createElement('style');
		s.id = 'leave-request-styles';
		s.textContent = `
			body { padding-bottom: 20px !important; }
			#wrapper { overflow-x: hidden !important; }
			#frmLeaveRequest { overflow-x: hidden !important; max-width: 100vw !important; }
			@media (min-width: 600px) {
				#frmLeaveRequest {
					max-width: 480px !important;
					margin: 0 auto !important;
				}
			}
			#frmLeaveRequest > table,
			#frmLeaveRequest table:not(#ddlLeaveType table):not(#ddlLeaveType table *):not(.RadCalendar):not(.RadCalendar *) {
				table-layout: fixed !important;
				width: 100% !important;
			}
			#ddlLeaveType table, #ddlLeaveType table * {
				table-layout: auto !important;
			}
			#frmLeaveRequest .formlabel { width: clamp(80px, 24vw, 130px) !important; max-width: clamp(80px, 24vw, 130px) !important; text-align: left !important; white-space: normal !important; vertical-align: top !important; font-size: clamp(14px, 3.5vw, 16px) !important; }
			#frmLeaveRequest td:not(.formlabel):not(.RadCalendar td):not(.RadCalendar *) {
				width: auto !important;
				max-width: calc(100vw - 100px) !important;
				overflow: visible !important;
				box-sizing: border-box !important;
			}
			
			#frmLeaveRequest td[colspan], #formrightDiv table td:first-child {
				width: clamp(80px, 24vw, 130px) !important;
				max-width: clamp(80px, 24vw, 130px) !important;
			}
			
			.RadCalendar td, .RadCalendar th {
				display: table-cell !important;
				width: 12.5% !important;
				text-align: center !important;
			}
			.RadCalendar tr {
				display: table-row !important;
			}
			.RadCalendar table, .RadCalendar {
				display: table !important;
			}

			#formleftDiv, #formrightDiv { width: 100% !important; max-width: 100% !important; float: none !important; transform: none !important; }

			#ddlLeaveType, #ddlLeaveType_Input, #ddlLeaveTypePanel { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
			#ddlLeaveType_Arrow { width: 18px !important; max-width: 18px !important; overflow: hidden !important; position: relative !important; }

			#txtReason, #txtLeaveAddress, #txtPhoneNo { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
			#txtPhoneNo { font-size: 14px !important; }
			#txtDateFrom_dateInput, #txtDateTo_dateInput, #txtPhoneNo {
				height: 26.5px !important;
				line-height: 26.5px !important;
				padding-top: 0 !important;
				padding-bottom: 0 !important;
				box-sizing: border-box !important;
			}
			#cUpload_flUpload { width: calc(100% - 50px) !important; box-sizing: border-box !important; }
			#cUpload_btnAdd { width: 40px !important; vertical-align: middle !important; }

			#frmLeaveRequest table.MsgBody1 td, #frmLeaveRequest table.MsgBody1 span, #frmLeaveRequest table.MsgBody1 label { text-align: left !important; }
			#frmLeaveRequest .MsgBody1, #frmLeaveRequest .MsgBody1 * { text-align: left !important; }
			#frmLeaveRequest tr { overflow: visible !important; }
			#frmLeaveRequest #cUpload_lblLegend, #frmLeaveRequest .mandatory { text-align: left !important; }
			#cUpload_lblLegend, #cUpload_lblLegend * { padding-left: 0 !important; margin-left: 0 !important; }
			td:has(#cUpload_lblLegend) { padding-left: 0 !important; margin-left: 0 !important; }
			.leave-header { white-space: nowrap !important; font-size: 18px !important; }
			#frmLeaveRequest .RadAjaxPanel { width: auto !important; }
			.rcCalPopup, .RadCalendarPopup { z-index: 1000 !important; }
			.RadCalendarPopup { z-index: 1002 !important; }
			#txtDateTo_popupButton { z-index: 1001 !important; }
			#btnSubmit_bottom, #btnReset_bottom { display: none !important; }
			#ddlLeaveType {
				border: 1px solid #767676 !important;
				border-radius: 4px !important;
				background: #fff !important;
				box-shadow: none !important;
				width: 100% !important;
				box-sizing: border-box !important;
				position: relative !important;
				height: 26.5px !important;
			}
			#ddlLeaveType table {
				display: table !important;
				border-collapse: collapse !important;
				border-spacing: 0 !important;
				border: none !important;
				background: none !important;
				box-shadow: none !important;
				padding: 0 !important;
			}
			#ddlLeaveType tr {
				display: table-row !important;
				border: none !important;
				background: none !important;
				box-shadow: none !important;
				padding: 0 !important;
			}
			#ddlLeaveType td {
				display: table-cell !important;
				border: none !important;
				background: none !important;
				box-shadow: none !important;
				padding: 0 !important;
			}
			#ddlLeaveType_Input {
				border: none !important;
				background: transparent !important;
				box-sizing: border-box !important;
				width: 100% !important;
				color: #000 !important;
				text-align: left !important;
				padding-left: 8px !important;
				height: 30px !important;
				padding-top: 0 !important;
				padding-bottom: 3px !important;
				line-height: 30px !important;
			}
			#ddlLeaveType_Input.rcbEmptyMessage {
				font-style: normal !important;
				height: 30px !important;
				line-height: 30px !important;
				padding-top: 0 !important;
				padding-bottom: 3px !important;
				box-sizing: border-box !important;
			}
			#ddlLeaveType_Arrow {
				background: none !important;
			}
			#frmLeaveRequest tr:has(.formlabel) {
				display: table-row !important;
			}
			#frmLeaveRequest tr:has(.formlabel) > td {
				display: table-cell !important;
			}
			#frmLeaveRequest tr:has(.rcInputCell) {
				display: table-row !important;
			}
			#frmLeaveRequest tr:has(.rcInputCell) > td {
				display: table-cell !important;
				vertical-align: middle !important;
			}
			#frmLeaveRequest tr:has(#rblFrom_0), 
			#frmLeaveRequest tr:has(#rblTo_0) {
				display: block !important;
				width: 100% !important;
				clear: both !important;
			}
			#frmLeaveRequest tr:has(.rcInputCell) > td:last-child { padding-left: 8px !important; }
			#frmLeaveRequest tr:has(#rblFrom_0) td,
			#frmLeaveRequest tr:has(#rblTo_0) td {
				display: inline-flex !important;
				align-items: center !important;
				white-space: nowrap !important;
			}
			#frmLeaveRequest tr:has(.rcInputCell) .formlabel { vertical-align: middle !important; padding-top: 0 !important; }
			#frmLeaveRequest tr:has(#rblFrom_0) .formlabel,
			#frmLeaveRequest tr:has(#rblTo_0) .formlabel {
				visibility: hidden !important;
			}
			.RadCalendarPopup, .rcCalPopup + div, div[id*="Calendar"] {
				overflow: visible !important;
			}
			.RadCalendar, .RadCalendar_default {
				table-layout: auto !important;
				width: auto !important;
				max-width: calc(100vw - 20px) !important;
			}
			#lblGender { display: none !important; }
			#txtPhoneNo_wrapper { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
			#formleftDiv { max-width: calc(100vw - 8px) !important; }
			input#txtDateFrom, input#txtDateTo {
				width: 90px !important;
				max-width: 90px !important;
			}
			.RadCalendar tr:has(.rcViewSel) {
				display: table-row !important;
			}
			.RadCalendar tr:has(.rcViewSel) th {
				display: table-cell !important;
				width: 12.5% !important;
				text-align: center !important;
			}
			.rcViewSel {
				display: table-cell !important;
				width: 12px !important;
				min-width: 12px !important;
				max-width: 12px !important;
			}
			.RadCalendar {
				max-width: calc(100vw - 20px) !important;
				left: 0 !important;
			}
			#txtDateFrom_calendar_wrapper, #txtDateTo_calendar_wrapper {
				max-width: 100vw !important;
				overflow-x: hidden !important;
			}
			.custom-cal-header {
				background: #fff !important;
			}
			.RadCalendar tr {
				width: 100% !important;
			}
			#frmLeaveRequest #cUpload_lblLegend, #frmLeaveRequest .mandatory { text-align: left !important; font-size: 10px !important; }
			#div1 { z-index: 99999 !important; }
			#div1 { width: 100% !important; box-sizing: border-box !important; overflow: hidden !important; }
			#cUpload_flUpload { width: 200px !important; }
			#frmLeaveRequest tr:has(.formlabel) { vertical-align: middle !important; }
			#frmLeaveRequest .formlabel { vertical-align: middle !important; }
			
			input#txtDateFrom_dateInput, input#txtDateTo_dateInput {
				width: 130px !important;
				max-width: 130px !important;
				font-size: 16px !important;
				box-sizing: border-box !important;
				padding: 8px !important;
			}
			#formrightDiv, #formrightDiv * { -webkit-text-size-adjust: 100% !important; text-size-adjust: 100% !important; }
			#ddlLeaveType td {
				height: 30px !important;
				vertical-align: middle !important;
			}
			#ddlLeaveType .rcbArrowCellRight {
				height: 26.5px !important;
				vertical-align: middle !important;
			}
			#ddlLeaveType tr {
				height: 26.5px !important;
			}
			#ddlLeaveType {
				overflow: hidden !important;
			}
			#ddlLeaveType_Input {
				transform: translateY(-6px) !important;
			}
			#ddlLeaveType_Arrow {
				transform: translateY(-8px) !important;
			}
			#txtReason, #txtLeaveAddress, #txtPhoneNo {
				font-size: 16px !important;
			}
		`;
		doc.head.appendChild(s);
		
		
		var pageTitle = doc.getElementById('div1');
		if (pageTitle) {
			var titleHeight = pageTitle.getBoundingClientRect().height;
			var wrapper = doc.getElementById('wrapper');
			if (wrapper) {
				wrapper.style.setProperty('padding-top', titleHeight + 'px', 'important');
			}
		}
		
		if (pageTitle) {
			pageTitle.style.setProperty('position', 'sticky', 'important');
			pageTitle.style.setProperty('top', '0', 'important');
			pageTitle.style.setProperty('z-index', '999', 'important');
			pageTitle.style.setProperty('background', '#fff', 'important');
		}

		doc.querySelectorAll('.rcInputCell').forEach(function(td) {
			var row = td.closest('tr');
			if (row) {
				row.style.setProperty('display', 'table-row', 'important');
				Array.from(row.children).forEach(function(cell) {
					cell.style.setProperty('display', 'table-cell', 'important');
					cell.style.setProperty('vertical-align', 'middle', 'important');
				});
			}
		});
		
		var leaveTypeWidth = doc.getElementById('ddlLeaveType').getBoundingClientRect().width;
		
		['txtReason', 'txtLeaveAddress', 'txtPhoneNo'].forEach(function(id) {
			var el = doc.getElementById(id);
			if (el) {
				el.style.setProperty('width', leaveTypeWidth + 'px', 'important');
				el.style.setProperty('max-width', leaveTypeWidth + 'px', 'important');
				el.style.setProperty('box-sizing', 'border-box', 'important');
			}
		});
		
		var phoneField = doc.getElementById('txtPhoneNo');
		if (phoneField) {
			phoneField.style.setProperty('font-size', '16px', 'important');
			phoneField.style.setProperty('height', '30px', 'important');
			phoneField.style.setProperty('box-sizing', 'border-box', 'important');
		}
		
		// Align Phone No / Support Document rows with the rest of the form
		function alignRightColumnFields() {
			var referenceInput = doc.getElementById('txtReason');
			if (!referenceInput) return;
			var targetLeft = referenceInput.getBoundingClientRect().left;

			var referenceLabel = Array.from(doc.querySelectorAll('.formlabel')).find(function(el) {
				return el.textContent.trim().indexOf('Leave Type') === 0;
			});
			var targetLabelLeft = referenceLabel ? referenceLabel.getBoundingClientRect().left : null;

			var phoneField = doc.getElementById('txtPhoneNo');
			if (phoneField) {
				var pCurrentLeft = phoneField.getBoundingClientRect().left;
				var pDiff = targetLeft - pCurrentLeft;
				var pCurrentMargin = parseFloat(phoneField.style.marginLeft) || 0;
				phoneField.style.setProperty('margin-left', (pCurrentMargin + pDiff) + 'px', 'important');
				phoneField.style.setProperty('position', 'relative', 'important');
			}

			var phoneLabel = Array.from(doc.querySelectorAll('.formlabel')).find(function(el) {
				return el.textContent.trim().indexOf('Phone No') === 0;
			});
			if (phoneLabel && targetLabelLeft !== null) {
				phoneLabel.style.setProperty('transform', 'none', 'important');
				var plCurrentLeft = phoneLabel.getBoundingClientRect().left;
				var plDiff = targetLabelLeft - plCurrentLeft;
				phoneLabel.style.setProperty('transform', 'translateX(' + plDiff + 'px)', 'important');
			}

			var uploadInput = doc.querySelector('input[type="file"]');
			if (uploadInput) {
				uploadInput.style.setProperty('margin-left', '0px', 'important');
				var uCurrentLeft = uploadInput.getBoundingClientRect().left;
				var uDiff = targetLeft - uCurrentLeft;
				uploadInput.style.setProperty('margin-left', uDiff + 'px', 'important');
				uploadInput.style.setProperty('position', 'relative', 'important');
			}

			var uploadLabel = Array.from(doc.querySelectorAll('.formlabel')).find(function(el) {
				return el.textContent.trim().indexOf('Support Document') === 0;
			});
			if (uploadLabel && targetLabelLeft !== null) {
				uploadLabel.style.setProperty('transform', 'none', 'important');
				var ulCurrentLeft = uploadLabel.getBoundingClientRect().left;
				var ulDiff = targetLabelLeft - ulCurrentLeft;
				uploadLabel.style.setProperty('transform', 'translateX(' + ulDiff + 'px)', 'important');
			}
		}
		setTimeout(alignRightColumnFields, 2200);
		
		
		
		
		var cal2 = doc.getElementById('txtDateFrom_calendar');
		if (cal2) {
			cal2.querySelectorAll('tr').forEach(function(row) {
				if (row.children.length === 5) {
					row.children[2].style.setProperty('white-space', 'nowrap', 'important');
					row.children[2].style.setProperty('width', 'auto', 'important');
				}
			});
		}
		var cal3 = doc.getElementById('txtDateTo_calendar');
		if (cal3) {
			cal3.querySelectorAll('tr').forEach(function(row) {
				if (row.children.length === 5) {
					row.children[2].style.setProperty('white-space', 'nowrap', 'important');
					row.children[2].style.setProperty('width', 'auto', 'important');
				}
			});
		}
		
		doc.querySelectorAll('th').forEach(function(th) {
			if (th.textContent.trim() === 'Title and navigation') {
				th.style.setProperty('position', 'absolute', 'important');
				th.style.setProperty('width', '1px', 'important');
				th.style.setProperty('height', '1px', 'important');
				th.style.setProperty('padding', '0', 'important');
				th.style.setProperty('overflow', 'hidden', 'important');
				th.style.setProperty('clip', 'rect(0,0,0,0)', 'important');
				th.style.setProperty('white-space', 'nowrap', 'important');
			}
		});
		
		doc.querySelectorAll('td, th').forEach(function(cell) {
			if (cell.textContent.trim() === 'Title and navigation') {
				cell.style.setProperty('position', 'absolute', 'important');
				cell.style.setProperty('width', '1px', 'important');
				cell.style.setProperty('height', '1px', 'important');
				cell.style.setProperty('overflow', 'hidden', 'important');
				cell.style.setProperty('clip', 'rect(0,0,0,0)', 'important');
			}
		});
		
		document.querySelectorAll('.rcViewSel').forEach(function(el) {
			if (!el.textContent.trim()) {
				el.innerHTML = '&nbsp;';
			}
		});
		
		function getLevel6Row(el) {
			var depth = 0;
			while (el && depth < 6) { el = el.parentElement; depth++; }
			return el;
		}
		var fromRow6 = getLevel6Row(doc.getElementById('txtDateFrom_dateInput').closest('tr'));
		var toRow6 = getLevel6Row(doc.getElementById('txtDateTo_dateInput').closest('tr'));

		if (fromRow6 && fromRow6.children[2]) {
			fromRow6.children[2].style.setProperty('float', 'none', 'important');
			fromRow6.children[2].style.setProperty('width', '10px', 'important');
			fromRow6.children[2].style.setProperty('max-width', '10px', 'important');
		}
		if (toRow6 && toRow6.children[2]) {
			toRow6.children[2].style.setProperty('float', 'none', 'important');
			toRow6.children[2].style.setProperty('width', '10px', 'important');
			toRow6.children[2].style.setProperty('max-width', '10px', 'important');
		}
		if (fromRow6 && fromRow6.children[0]) {
			fromRow6.children[0].style.setProperty('display', 'flex', 'important');
		}
		if (toRow6 && toRow6.children[0]) {
			toRow6.children[0].style.setProperty('display', 'flex', 'important');
		}
		
		var arrowEl = doc.getElementById('ddlLeaveType_Arrow');
		if (arrowEl) {
			arrowEl.textContent = '\u25BC';
			arrowEl.style.setProperty('text-indent', '0', 'important');
			arrowEl.style.setProperty('font-size', '12px', 'important');
			arrowEl.style.setProperty('color', '#333', 'important');
			arrowEl.style.setProperty('font-weight', 'normal', 'important');
			arrowEl.style.removeProperty('position');
			arrowEl.style.removeProperty('right');
			arrowEl.style.removeProperty('top');
			arrowEl.style.removeProperty('transform');
			arrowEl.style.setProperty('display', 'block', 'important');
			arrowEl.style.setProperty('text-align', 'center', 'important');
			arrowEl.style.setProperty('line-height', '24px', 'important');
		}
		
		['lblPendingDays', 'lblBalance', 'lblBalanceCanBeRecovered'].forEach(function(id) {
			var el = doc.getElementById(id);
			if (el) {
				var row = el.closest('tr');
				if (row) row.style.setProperty('display', 'none', 'important');
			}
		});

		var btn = doc.getElementById('btnSubmit');
		if (btn) {
			var hiddenDiv = btn.parentElement;
			var form = doc.getElementById('frmLeaveRequest');
			if (form) {
				form.appendChild(hiddenDiv);
				hiddenDiv.style.cssText = 'display:block!important;padding:12px 16px;';
			}
			hiddenDiv.querySelectorAll('input[type="submit"], input[type="reset"]').forEach(function(b) {
				b.style.marginLeft = '16px';
				b.style.marginRight = '16px';
				b.style.marginBottom = '16px';
			});
		}

		var msgTable = doc.querySelector('.MsgBody1') ? doc.querySelector('.MsgBody1').closest('table[align="center"]') : null;
		if (msgTable) {
			msgTable.removeAttribute('align');
			msgTable.style.setProperty('width', '100%', 'important');
			msgTable.style.setProperty('text-align', 'left', 'important');
		}

		var msgBody = doc.querySelector('.MsgBody1');
		if (msgBody) {
			var allElements = msgBody.querySelectorAll('*');
			allElements.forEach(function(el) {
				el.style.setProperty('text-align', 'left', 'important');
			});
			msgBody.style.setProperty('text-align', 'left', 'important');
		}

		var legend = doc.getElementById('cUpload_lblLegend');
		if (legend) legend.style.setProperty('text-align', 'left', 'important');

		var legendTd = doc.getElementById('cUpload_lblLegend').parentElement;
		if (legendTd) legendTd.style.setProperty('text-align', 'left', 'important');

		var legendTr = doc.getElementById('cUpload_lblLegend').closest('tr');
		if (legendTr) {
			legendTr.style.setProperty('padding-left', '0', 'important');
			legendTr.style.setProperty('margin-left', '0', 'important');
			var legendTd = legendTr.querySelector('td');
			if (legendTd) {
				legendTd.style.setProperty('padding-left', '0', 'important');
				legendTd.style.setProperty('text-align', 'left', 'important');
			}
		}

		var legendTable = doc.getElementById('cUpload_lblLegend').closest('table');
		if (legendTable) {
			legendTable.style.setProperty('margin-left', '0', 'important');
			legendTable.style.setProperty('padding-left', '0', 'important');
			legendTable.style.setProperty('width', '100%', 'important');
		}

		var legendTr = doc.getElementById('cUpload_lblLegend').closest('tr');
		var legendTable = doc.getElementById('cUpload_lblLegend').closest('table');
		var formRightDiv = doc.getElementById('formrightDiv');
		if (legendTr && formRightDiv && !formRightDiv.querySelector('[data-legend-added]')) {
			var newDiv = doc.createElement('div');
			newDiv.style.cssText = 'text-align:left;padding:4px 0;font-size:9px;color:red;width:100%;box-sizing:border-box;';
			var fullText = doc.getElementById('cUpload_lblLegend').textContent.trim();
			var split = fullText.indexOf('File Types Allowed');
			var line1 = split !== -1 ? fullText.substring(0, split).trim().replace(/\s+/g, ' ') : fullText;
			var line2 = split !== -1 ? fullText.substring(split).trim().replace(/\s+/g, ' ') : '';
			newDiv.setAttribute('data-legend-added', '1');
			newDiv.innerHTML =
				'<div style="color:red;word-wrap:break-word;white-space:normal;">' + line1 + '</div>' +
				(line2 ? '<div style="color:red;word-wrap:break-word;white-space:normal;">' + line2 + '</div>' : '');
			formRightDiv.appendChild(newDiv);
			legendTr.style.setProperty('display', 'none', 'important');
		}

		setTimeout(function() {
			var dfield = doc.getElementById('DField');
			if (dfield) {
				dfield.querySelectorAll('table').forEach(function(t) {
					t.removeAttribute('align');
					t.style.setProperty('width', '100%', 'important');
					t.style.setProperty('table-layout', 'fixed', 'important');
					t.style.setProperty('margin', '0', 'important');
				});
				dfield.querySelectorAll('tr').forEach(function(row) {
					row.style.setProperty('display', 'table-row', 'important');
				});
				dfield.querySelectorAll('td').forEach(function(cell) {
					cell.style.setProperty('display', 'table-cell', 'important');
					cell.style.setProperty('text-align', 'left', 'important');
					cell.style.setProperty('vertical-align', 'middle', 'important');
				});
				dfield.querySelectorAll('td:first-child').forEach(function(cell) {
					cell.style.setProperty('width', 'clamp(80px, 24vw, 130px)', 'important');
					cell.style.setProperty('max-width', 'clamp(80px, 24vw, 130px)', 'important');
				});
			}
		}, 2000);

		var tbody = doc.getElementById('lblFrom').closest('tr').parentElement;
		var rows = Array.from(tbody.querySelectorAll('tr'));

		var fromDateRow = rows[5];
		var fromRadioRow = doc.getElementById('rblFrom_0').closest('tr');
		if (fromDateRow && fromRadioRow) {
			fromDateRow.parentElement.insertBefore(fromRadioRow, fromDateRow.nextSibling);
			fromDateRow.style.cssText = 'overflow:visible;width:auto;';
			var rcInputCell = fromDateRow.querySelector('.rcInputCell');
			if (rcInputCell) {
				rcInputCell.style.setProperty('width', '130px', 'important');
				rcInputCell.style.setProperty('max-width', '130px', 'important');
				rcInputCell.style.setProperty('overflow', 'visible', 'important');
			}
			var wrapper = fromDateRow.querySelector('.riSingle');
			if (wrapper) wrapper.style.setProperty('width', '120px', 'important');
			var rcTable = fromDateRow.closest('table');
			if (rcTable) {
				rcTable.style.setProperty('table-layout', 'fixed', 'important');
				rcTable.style.setProperty('width', '170px', 'important');
			}
			fromRadioRow.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding-right:8px;margin-left:77px;';
			Array.from(fromRadioRow.querySelectorAll('td')).forEach(function(td) {
				td.style.cssText = 'display:inline-flex;align-items:center;white-space:nowrap;padding:2px;';
			});
		}

		var toDateRow = doc.querySelector('input[id="txtDateTo_dateInput"]').closest('tr');
		var toRadioRow = doc.getElementById('rblTo_0').closest('tr');
		if (toDateRow && toRadioRow) {
			toDateRow.parentElement.insertBefore(toRadioRow, toDateRow.nextSibling);
			toDateRow.style.cssText = 'overflow:visible;width:auto;';
			var rcInputCellTo = toDateRow.querySelector('.rcInputCell');
			if (rcInputCellTo) {
				rcInputCellTo.style.setProperty('width', '130px', 'important');
				rcInputCellTo.style.setProperty('max-width', '130px', 'important');
				rcInputCellTo.style.setProperty('overflow', 'visible', 'important');
			}
			var wrapperTo = toDateRow.querySelector('.riSingle');
			if (wrapperTo) wrapperTo.style.setProperty('width', '120px', 'important');
			var rcTableTo = toDateRow.closest('table');
			if (rcTableTo) {
				rcTableTo.style.setProperty('table-layout', 'fixed', 'important');
				rcTableTo.style.setProperty('width', '170px', 'important');
			}
			toRadioRow.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding-right:8px;margin-left:77px;';
			Array.from(toRadioRow.querySelectorAll('td')).forEach(function(td) {
				td.style.cssText = 'display:inline-flex;align-items:center;white-space:nowrap;padding:2px;';
			});
		}
		var fields = doc.querySelectorAll('input, textarea');
		fields.forEach(function(field) {
			field.addEventListener('focus', function() {
				setTimeout(function() {
					var rect = field.getBoundingClientRect();
					var scrollY = doc.defaultView.scrollY;
					var targetY = rect.top + scrollY - 50;
					doc.defaultView.scrollTo(0, targetY > 0 ? targetY : 0);
				}, 300);
			});
		});
		var leaveType = doc.getElementById('ddlLeaveType_Input');
		if (leaveType) {
			leaveType.addEventListener('change', function() {
				setTimeout(function() {
					var newFields = doc.querySelectorAll('input, textarea');
					newFields.forEach(function(field) {
						field.addEventListener('focus', function() {
							setTimeout(function() {
								var rect = field.getBoundingClientRect();
								var scrollY = doc.defaultView.scrollY;
								var targetY = rect.top + scrollY - 50;
								doc.defaultView.scrollTo(0, targetY > 0 ? targetY : 0);
							}, 300);
						});
					});
				}, 800);
			});
		}

		var fixTimer = null;
		var isApplyingFixes = false;
		function scheduleReapply() {
			if (isApplyingFixes) return;
			if (fixTimer) clearTimeout(fixTimer);
			fixTimer = setTimeout(function() {
				isApplyingFixes = true;
				reapplyDynamicFixes(doc);
				isApplyingFixes = false;
			}, 400);
		}
		var formEl = doc.getElementById('frmLeaveRequest');
		if (formEl) {
			var mo = new MutationObserver(function() {
				scheduleReapply();
			});
			mo.observe(formEl, { childList: true, subtree: true });
		}
		
		reapplyDynamicFixes(doc);
		
			['lblFrom', 'lblTo'].forEach(function(id) {
				var lbl = doc.getElementById(id);
				if (lbl) {
					var cell = lbl.closest('.formlabel');
					if (cell) {
						cell.style.setProperty('visibility', 'visible', 'important');
						cell.style.setProperty('display', 'table-cell', 'important');
						cell.style.setProperty('vertical-align', 'middle', 'important');
						cell.style.setProperty('padding-top', '0', 'important');
						var row = cell.closest('tr');
						if (row) row.style.setProperty('display', 'table-row', 'important');
					}
				}
			});
	}

        // STUBS for now - Attendance Reg / Calendar added in later stages
        function applyAttendanceRegFixes(doc, retryCount) {
		retryCount = retryCount || 0;

		var iframeEl = document.getElementById('iFrameMain');
		if (iframeEl && iframeEl.contentDocument) {
			doc = iframeEl.contentDocument;
		}

		var innerFrame = doc.getElementById('iframeNewSummary');
		var innerDoc = (innerFrame && innerFrame.contentDocument) ? innerFrame.contentDocument : null;

		if (!innerDoc || !innerDoc.getElementById('frmAttendanceRegularisation')) {
			if (retryCount >= 20) {
				return;
			}
			setTimeout(function() { applyAttendanceRegFixes(doc, retryCount + 1); }, 500);
			return;
		}

		var alreadyFixed = innerDoc.getElementById('frmAttendanceRegularisation').getAttribute('data-ar-fixed');
		innerDoc.getElementById('frmAttendanceRegularisation').setAttribute('data-ar-fixed', '1');

		// Hide Send SMS button
		var sendSmsBtn = doc.getElementById('bntSendSMS');
		if (sendSmsBtn) {
			var smsRow = sendSmsBtn.closest('div') || sendSmsBtn.parentElement;
			if (smsRow) smsRow.style.setProperty('display', 'none', 'important');
		}

		// Hide employee name/icon row and Employee Summary section
		var empForm = doc.getElementById('NewEmpSummary');
		if (empForm) {
			var firstRow = empForm.querySelector('tr');
			if (firstRow) firstRow.style.setProperty('display', 'none', 'important');
			var empLabel = Array.from(empForm.querySelectorAll('*')).find(function(el) {
				return el.children.length === 0 && el.textContent.trim() === 'Employee Summary:';
			});
			if (empLabel) {
				var empRow = empLabel.closest('tr') || empLabel.closest('div');
				if (empRow) empRow.style.setProperty('display', 'none', 'important');
			}
			var namePattern = /^[A-Z][a-zA-Z'-]+(\s[A-Z][a-zA-Z'-]+){1,3}$/;
			var nameLabel = Array.from(empForm.querySelectorAll('*')).find(function(el) {
				return el.children.length === 0 && namePattern.test(el.textContent.trim());
			});
			if (nameLabel) {
				var nameRow = nameLabel.closest('tr') || nameLabel.closest('div');
				if (nameRow) nameRow.style.setProperty('display', 'none', 'important');
			}
		}

		// Hide "Logged in" status indicator
		var loggedInEl = doc.getElementById('lblEmployeeStatus');
		if (loggedInEl) {
			var statusRow = loggedInEl.closest('#dvEmpStatus') || loggedInEl.closest('div[class*="col-"]');
			if (statusRow) statusRow.style.setProperty('display', 'none', 'important');
		}

		doc = innerDoc;

		if (!alreadyFixed) {
			alert('You are on the Attendance Regularization page.');
		}
		
		var isSyncingCalendar = false;

		function recenterIcon(suffix) {
			var icon = doc.getElementById('dt'+suffix+'Date_popupButton');
			var dateInput = doc.getElementById('dt'+suffix+'Date_dateInput');
			var wrapper = doc.getElementById('dt'+suffix+'Date_wrapper');
			if (!icon || !dateInput || !wrapper) return;
			wrapper.style.setProperty('position', 'relative', 'important');
			icon.style.removeProperty('transform');
			icon.style.setProperty('position', 'absolute', 'important');
			void icon.offsetHeight;
			var wr = wrapper.getBoundingClientRect();
			var dr = dateInput.getBoundingClientRect();
			var ir = icon.getBoundingClientRect();
			var left = dr.right - wr.left + 6;
			var top = dr.top - wr.top + (dr.height - ir.height) / 2;
			icon.style.setProperty('left', left + 'px', 'important');
			icon.style.setProperty('top', top + 'px', 'important');
			icon.style.setProperty('visibility', 'visible', 'important');
		}

		function syncAttendanceCalendar(calRoot) {
			if (!calRoot) return;
			if (isSyncingCalendar) return;
			isSyncingCalendar = true;
			var calRootId = calRoot.id;
			try {
				calRoot.querySelectorAll('td, th').forEach(function(c) {
					c.style.removeProperty('width');
					c.style.removeProperty('max-width');
					c.style.removeProperty('min-width');
				});
				var oldCg = calRoot.querySelector('colgroup');
				if (oldCg) oldCg.remove();
				var popupEl = calRoot.closest('.RadCalendarPopup');
				if (popupEl) {
					popupEl.style.removeProperty('width');
					popupEl.style.removeProperty('max-width');
				}
				var headerRow = null, dataRow = null;
				calRoot.querySelectorAll('tr').forEach(function(row) {
					if (!headerRow && row.children.length === 8 && row.textContent.trim() === 'SMTWTFS') headerRow = row;
					if (!dataRow && row.children.length === 8 && /^\d/.test(row.children[1].textContent.trim())) dataRow = row;
				});
				if (!headerRow || !dataRow) return;
				var dayTable = dataRow.closest('table');
				var widths = Array.from(dataRow.children).map(function(cell) {
					return cell.getBoundingClientRect().width;
				});

				// Find the most common width (rounded) - that's the "normal" column width
				var counts = {};
				widths.forEach(function(w) {
					var rounded = Math.round(w);
					counts[rounded] = (counts[rounded] || 0) + 1;
				});
				var modeWidth = Number(Object.keys(counts).reduce(function(a, b) {
					return counts[a] >= counts[b] ? a : b;
				}));

				// Replace any column that deviates too far from the mode,
				// but leave column 0 (week numbers) at its natural width
				widths = widths.map(function(w, i) {
					if (i === 0) return w;
					if (w < modeWidth * 0.5 || w > modeWidth * 2) {
						return modeWidth;
					}
					return w;
				});

				var totalWidth = widths.reduce(function(a, b) { return a + b; }, 0);

				if (totalWidth < 20) return;
				calRoot.style.setProperty('table-layout', 'auto', 'important');
				calRoot.style.setProperty('max-width', 'calc(100vw - 20px)', 'important');
				var navTable = Array.from(calRoot.querySelectorAll('table')).find(function(t) { return t !== dayTable; });
				calRoot.style.setProperty('display', 'table', 'important');
				dayTable.style.setProperty('display', 'table', 'important');
				dayTable.style.setProperty('table-layout', 'fixed', 'important');
				dayTable.style.setProperty('width', totalWidth + 'px', 'important');
				dayTable.style.setProperty('border-collapse', 'collapse', 'important');
				dayTable.style.setProperty('border', '1px solid #333', 'important');
				dayTable.querySelectorAll('tr').forEach(function(row) {
					if (row.children.length !== 8) return;
					row.style.setProperty('display', 'table-row', 'important');
					Array.from(row.children).forEach(function(cell, i) {
						var w = widths[i] + 'px';
						cell.setAttribute('style', (cell.getAttribute('style') || '') + ';width:' + w + ' !important;max-width:' + w + ' !important;min-width:' + w + ' !important;display:table-cell !important;');
					});
				});
				if (navTable) {
					navTable.style.setProperty('display', 'table', 'important');
					navTable.style.setProperty('width', totalWidth + 'px', 'important');
					navTable.style.setProperty('table-layout', 'fixed', 'important');
					navTable.style.setProperty('border-collapse', 'collapse', 'important');
					navTable.style.setProperty('border-spacing', '0', 'important');
					navTable.style.setProperty('border', 'none', 'important');
					navTable.style.setProperty('margin', '0 auto', 'important');
					navTable.querySelectorAll('tr').forEach(function(r) {
						r.style.setProperty('display', 'table-row', 'important');
						Array.from(r.children).forEach(function(c) {
							c.style.setProperty('display', 'table-cell', 'important');
						});
					});
					var arrowWidth = 20;
					var titleWidth = totalWidth - (arrowWidth * 4);
					var titlebar = navTable.closest('td.rcTitlebar') || navTable.parentElement;
					if (titlebar) {
						titlebar.style.setProperty('width', totalWidth + 'px', 'important');
						titlebar.style.setProperty('padding', '0', 'important');
						titlebar.style.setProperty('text-align', 'center', 'important');
						titlebar.style.setProperty('border', 'none', 'important');
					}
					var navRow = navTable.querySelectorAll('tr')[1];
					if (navRow) {
						var navWidths = [arrowWidth, arrowWidth, titleWidth, arrowWidth, arrowWidth];
						Array.from(navRow.children).forEach(function(cell, i) {
							var w = navWidths[i] + 'px';
							cell.setAttribute('style', (cell.getAttribute('style') || '') +
								';width:' + w + ' !important;max-width:' + w + ' !important;min-width:' + w + ' !important;' +
								'padding:0 1px !important;font-size:11px !important;white-space:nowrap !important;overflow:visible !important;text-align:center !important;');
						});
					}
					var captionRow = navTable.querySelectorAll('tr')[0];
					if (captionRow) {
						Array.from(captionRow.children).forEach(function(c) {
							c.style.setProperty('color', 'transparent', 'important');
							c.style.setProperty('background', '#fff', 'important');
							c.style.setProperty('font-size', '0', 'important');
							c.style.setProperty('line-height', '0', 'important');
							c.style.setProperty('height', '0', 'important');
							c.style.setProperty('overflow', 'hidden', 'important');
							c.style.setProperty('display', 'none', 'important');
						});
					}
				}
				var popup = calRoot.closest('.RadCalendarPopup');
				if (popup) {
					var actualDayWidth = dayTable.getBoundingClientRect().width;
					var actualNavWidth = navTable ? navTable.getBoundingClientRect().width : 0;
					var finalWidth = Math.max(actualDayWidth, actualNavWidth);
					popup.style.setProperty('width', finalWidth + 'px', 'important');
					popup.style.setProperty('max-width', finalWidth + 'px', 'important');
					if (!window.calDebugLogged) {
						window.calDebugLogged = true;
						showDebug('dayWidth=' + actualDayWidth + ' navWidth=' + actualNavWidth + ' finalWidth=' + finalWidth + ' | popup actual=' + popup.getBoundingClientRect().width);
					}
					popup.style.setProperty('overflow-x', 'hidden', 'important');
					popup.style.setProperty('overflow-y', 'hidden', 'important');
					popup.style.setProperty('height', 'auto', 'important');
					popup.style.setProperty('box-sizing', 'border-box', 'important');
					popup.style.setProperty('border', 'none', 'important');
					popup.style.setProperty('box-shadow', 'none', 'important');
					popup.querySelectorAll('div[class*="rcShad"]').forEach(function(shad) {
						shad.style.setProperty('display', 'none', 'important');
					});

					var suffix = calRootId.indexOf('From') !== -1 ? 'From' : 'To';
					var anchorInput = doc.getElementById('dt' + suffix + 'Date_dateInput');
					if (anchorInput) {
						var inputRect = anchorInput.getBoundingClientRect();
						var newLeft = inputRect.left;
						var vw = doc.defaultView.innerWidth;
						var popupWidth = actualDayWidth + 2;
						var maxLeft = vw - popupWidth - 4;
						if (newLeft > maxLeft) newLeft = Math.max(4, maxLeft);
						popup.style.setProperty('left', newLeft + 'px', 'important');
						popup.style.setProperty('top', (inputRect.bottom + 4) + 'px', 'important');
					}
				}
				
				if (popup) {
					popup.style.display = 'none';
					void popup.offsetHeight;
					popup.style.display = 'block';
				}
			} finally {
				setTimeout(function() { isSyncingCalendar = false; }, 200);
			}
		}
		
		setTimeout(function() {
			var icon1 = doc.getElementById('dtFromDate_popupButton');
			var input1 = doc.getElementById('dtFromDate_dateInput');
			var wrapper1 = doc.getElementById('dtFromDate_wrapper');
			recenterIcon('From');
			recenterIcon('To');
		}, 800);

		doc.addEventListener('click', function(e) {
			if (e.target && (e.target.id === 'dtFromDate_popupButton' || e.target.closest('#dtFromDate_popupButton'))) {
				setTimeout(function() { syncAttendanceCalendar(doc.getElementById('dtFromDate_calendar')); }, 600);
				setTimeout(function() { syncAttendanceCalendar(doc.getElementById('dtFromDate_calendar')); }, 1200);
				setTimeout(function() { syncAttendanceCalendar(doc.getElementById('dtFromDate_calendar')); }, 1800);
				setTimeout(function() { syncAttendanceCalendar(doc.getElementById('dtFromDate_calendar')); }, 2400);
				setTimeout(function() { recenterIcon('From'); }, 300);
			}
			if (e.target && (e.target.id === 'dtToDate_popupButton' || e.target.closest('#dtToDate_popupButton'))) {
				setTimeout(function() { syncAttendanceCalendar(doc.getElementById('dtToDate_calendar')); }, 600);
				setTimeout(function() { syncAttendanceCalendar(doc.getElementById('dtToDate_calendar')); }, 1200);
				setTimeout(function() { syncAttendanceCalendar(doc.getElementById('dtToDate_calendar')); }, 1800);
				setTimeout(function() { syncAttendanceCalendar(doc.getElementById('dtToDate_calendar')); }, 2400);
				setTimeout(function() { recenterIcon('To'); }, 300);
			}
		}, true);

		var s = doc.createElement('style');
		s.id = 'attendance-reg-styles';
		s.textContent = `
			#frmAttendanceRegularisation { overflow-x: hidden !important; overflow-y: visible !important; max-width: 100vw !important; }
			@media (min-width: 600px) {
				#frmAttendanceRegularisation {
					max-width: 480px !important;
					margin: 0 auto !important;
				}
			}
			#frmAttendanceRegularisation table:not(.RadCalendar):not(.RadCalendar *) {
				table-layout: fixed !important;
				width: 100% !important;
			}
			#frmAttendanceRegularisation tr:has(.formlabel) {
				display: table-row !important;
			}
			#frmAttendanceRegularisation tr:has(.formlabel) > td {
				display: table-cell !important;
				vertical-align: top !important;
			}
			#frmAttendanceRegularisation .formlabel {
				width: clamp(80px, 24vw, 130px) !important;
				max-width: clamp(80px, 24vw, 130px) !important;
				text-align: left !important;
				white-space: normal !important;
				vertical-align: top !important;
				font-size: clamp(14px, 3.5vw, 16px) !important;
			}
			#frmAttendanceRegularisation td:not(.formlabel) {
				width: auto !important;
				max-width: calc(100vw - 100px) !important;
				overflow: visible !important;
				box-sizing: border-box !important;
			}
			#tblFromTime, #tblToTime {
				width: auto !important;
			}
			#tblFromTime select#ddlFromHour, #tblFromTime select#ddlFromMinute,
			#tblToTime select#ddlToHour, #tblToTime select#ddlToMinute {
				width: 55px !important;
				max-width: 55px !important;
				font-size: 13px !important;
				display: inline-block !important;
				box-sizing: border-box !important;
			}
			#tblFromTime, #tblToTime {
				width: auto !important;
				display: inline-flex !important;
				gap: 4px !important;
			}
			#tblFromTime tr, #tblToTime tr {
				display: flex !important;
				flex-direction: row !important;
				align-items: center !important;
			}
			#tblFromTime td, #tblToTime td {
				display: inline-block !important;
				width: auto !important;
			}
			#dtFromDate, #dtToDate {
				width: 120px !important;
			}
			#frmAttendanceRegularisation input[type="text"],
			#frmAttendanceRegularisation textarea,
			#frmAttendanceRegularisation select {
				width: 100% !important;
				max-width: 100% !important;
				box-sizing: border-box !important;
				font-size: 16px !important;
			}
			#frmAttendanceRegularisation textarea#txtReason {
				height: 60px !important;
			}
			#frmAttendanceRegularisation tr:has(#cboField1) {
				display: none !important;
			}
			.RadCalendarPopup caption {
				display: none !important;
			}
			#frmAttendanceRegularisation tr:has(#dtToDatePanel) {
				margin-bottom: 0 !important;
			}
			#tblFromTime, #tblToTime {
				margin-bottom: 0 !important;
			}
			.RadCalendarPopup table {
				border-collapse: collapse !important;
				border-spacing: 0 !important;
			}
			.RadCalendarPopup {
				border-collapse: collapse !important;
			}
		`;
		
		doc.head.appendChild(s);

		var arForm = doc.getElementById('frmAttendanceRegularisation');
		if (arForm) {
			var arFixTimer = null;
			var arApplying = false;
			function scheduleArReapply() {
				if (arApplying) return;
				if (arFixTimer) clearTimeout(arFixTimer);
				arFixTimer = setTimeout(function() {
					arApplying = true;
					if (!doc.getElementById('attendance-reg-styles')) {
						doc.head.appendChild(s.cloneNode(true));
					}
					recenterIcon('From');
					recenterIcon('To');
					arApplying = false;
				}, 400);
			}
			var arMo = new MutationObserver(function() {
				if (window.zologCurrentPage !== 'AttendanceRegularisation') return;
				scheduleArReapply();
			});
			arMo.observe(doc.body, { childList: true, subtree: true });
		}
	}

		function applyAttendanceCalendarFixes(doc, retryCount) {
			retryCount = retryCount || 0;

			var iframeEl = document.getElementById('iFrameMain');
			if (iframeEl && iframeEl.contentDocument) {
				doc = iframeEl.contentDocument;
			}
			
			var sendSmsBtn = doc.getElementById('bntSendSMS');
			if (sendSmsBtn) {
				var smsRow = sendSmsBtn.closest('div') || sendSmsBtn.parentElement;
				if (smsRow) smsRow.style.setProperty('display', 'none', 'important');
			}
			var empForm = doc.getElementById('NewEmpSummary');
			if (empForm) {
				var firstRow = empForm.querySelector('tr');
				if (firstRow) firstRow.style.setProperty('display', 'none', 'important');

				var empLabel = Array.from(empForm.querySelectorAll('*')).find(function(el) {
					return el.children.length === 0 && el.textContent.trim() === 'Employee Summary:';
				});
				if (empLabel) {
					var empRow = empLabel.closest('tr') || empLabel.closest('div');
					if (empRow) empRow.style.setProperty('display', 'none', 'important');
				}

				var namePattern = /^[A-Z][a-zA-Z'-]+(\s[A-Z][a-zA-Z'-]+){1,3}$/;
				var nameLabel = Array.from(empForm.querySelectorAll('*')).find(function(el) {
					return el.children.length === 0 && namePattern.test(el.textContent.trim());
				});
				if (nameLabel) {
					var nameRow = nameLabel.closest('tr') || nameLabel.closest('div');
					if (nameRow) nameRow.style.setProperty('display', 'none', 'important');
				}

				empForm.querySelectorAll('button, input[type="button"], input[type="submit"]').forEach(function(b) {
					var bRow = b.closest('tr') || b.closest('div');
					if (bRow) bRow.style.setProperty('display', 'none', 'important');
				});
			}

			var loggedInEl = doc.getElementById('lblEmployeeStatus');
			if (loggedInEl) {
				var statusRow = loggedInEl.closest('#dvEmpStatus') || loggedInEl.closest('div[class*="col-"]') || loggedInEl.closest('tr');
				if (statusRow) statusRow.style.setProperty('display', 'none', 'important');
			}

			var midFrame = doc.getElementById('iframeNewSummary');
			var midDoc = (midFrame && midFrame.contentDocument) ? midFrame.contentDocument : null;
			var iBox = midDoc ? midDoc.getElementById('iBox') : null;
			var fdoc = (iBox && iBox.contentDocument) ? iBox.contentDocument : null;

			if (!fdoc || !fdoc.body) {
				if (window.zologCurrentPage !== 'MonthlyAttRptPage') return;
				setTimeout(function() { applyAttendanceCalendarFixes(doc, retryCount + 1); }, 500);
				return;
			}

			// guard - only run once per page load
			if (fdoc.body.dataset.calFixed) return;

			var msgBody = fdoc.querySelector('td.MsgBody1');
			if (!msgBody) {
				if (retryCount >= 20) {
					return;
				}
				setTimeout(function() { applyAttendanceCalendarFixes(doc, retryCount + 1); }, 500);
				return;
			}
			
			if (midDoc && midDoc.body) {
				var walker = midDoc.createTreeWalker(midDoc.body, NodeFilter.SHOW_TEXT, null);
				var vNode;
				while (vNode = walker.nextNode()) {
					if (vNode.nodeValue.indexOf('Viewing ->') !== -1) {
						var vRow = vNode.parentElement.closest('tr') || vNode.parentElement;
						vRow.style.setProperty('display', 'none', 'important');
						break;
					}
				}
			}

			// find t1 (nav, 7 cells), t2 (grid, 32 cols), t3 (legend, 12 cells) by signature
			var tables = Array.from(msgBody.querySelectorAll('table'));
			var t1 = null, t2 = null, t3 = null;
			tables.forEach(function(t) {
				var firstRow = t.querySelector('tr');
				if (!firstRow) return;
				var cellCount = firstRow.children.length;
				if (cellCount === 7 && !t1) t1 = t;
				else if (cellCount >= 30 && !t2) t2 = t;
				else if (cellCount === 12 && !t3) t3 = t;
			});

			if (!t1 || !t2 || !t3) {
				showDebug('DEBUG: t1=' + !!t1 + ' t2=' + !!t2 + ' t3=' + !!t3 + ' totalTables=' + tables.length);
				return;
			}

			function forceTable(t) {
				t.style.setProperty('display', 'table', 'important');
				Array.from(t.querySelectorAll('tr')).forEach(function(row) {
					row.style.setProperty('display', 'table-row', 'important');
					Array.from(row.children).forEach(function(cell) {
						cell.style.setProperty('display', 'table-cell', 'important');
					});
				});
			}
			forceTable(t1);
			forceTable(t2);
			
			if (!t2.parentElement.classList.contains('cal-scroll-wrap')) {
				var scrollWrap = fdoc.createElement('div');
				scrollWrap.className = 'cal-scroll-wrap';
				scrollWrap.style.cssText = 'overflow-x:auto; -webkit-overflow-scrolling:touch; max-width:100vw;';
				t2.parentElement.insertBefore(scrollWrap, t2);
				scrollWrap.appendChild(t2);
			}
			
			forceTable(t3);
			
			t1.removeAttribute('width');
			t1.style.setProperty('width', 'auto', 'important');
			t1.style.setProperty('table-layout', 'auto', 'important');
			t1.style.setProperty('margin', '0 auto', 'important');
			Array.from(t1.querySelectorAll('td, tr')).forEach(function(el) {
				el.removeAttribute('width');
				el.style.removeProperty('width');
				el.style.setProperty('width', 'auto', 'important');
			});

			var navRow = t1.querySelector('tr');
			if (navRow) {
				Array.from(navRow.children).forEach(function(cell) {
					var isEmpty = cell.textContent.replace(/\u00A0/g, '').trim() === '' && !cell.querySelector('img, button, input, a');
					if (isEmpty) {
						cell.style.setProperty('display', 'none', 'important');
					}
				});
			}

			msgBody.style.setProperty('overflow-x', 'visible', 'important');
			msgBody.style.setProperty('overflow-y', 'hidden', 'important');
			msgBody.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
			msgBody.style.setProperty('max-width', '100vw', 'important');
			msgBody.style.setProperty('width', '100%', 'important');
			msgBody.style.setProperty('max-width', 'calc(100vw - 16px)', 'important');
			msgBody.style.setProperty('padding-left', '8px', 'important');
			msgBody.style.setProperty('padding-right', '8px', 'important');
			msgBody.style.setProperty('box-sizing', 'border-box', 'important');
			var calSpan = fdoc.getElementById('YCalender1');
			if (calSpan) {
				calSpan.style.setProperty('width', '100%', 'important');
				calSpan.style.setProperty('box-sizing', 'border-box', 'important');
			}
			

			fdoc.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
			fdoc.body.style.setProperty('overflow-x', 'hidden', 'important');

			fdoc.body.dataset.calFixed = '1';
			
			// grid sizing
			t2.style.setProperty('table-layout', 'fixed', 'important');
			t2.style.setProperty('border-collapse', 'collapse', 'important');
			Array.from(t2.querySelectorAll('tr')).forEach(function(row) {
				row.style.setProperty('height', '26px', 'important');
				Array.from(row.children).forEach(function(cell, i) {
					if (i === 0) {
						cell.style.setProperty('width', '50px', 'important');
						cell.style.setProperty('max-width', '50px', 'important');
						cell.style.setProperty('font-size', '12px', 'important');
					} else {
						cell.style.setProperty('width', '28px', 'important');
						cell.style.setProperty('max-width', '28px', 'important');
						cell.style.setProperty('font-size', '11px', 'important');
					}
					cell.style.setProperty('text-align', 'center', 'important');
					cell.style.setProperty('vertical-align', 'middle', 'important');
				});
			});
			t2.style.setProperty('width', (50 + 31 * 28) + 'px', 'important');

			// legend sizing
			Array.from(t3.querySelectorAll('td')).forEach(function(cell) {
				var hasColor = cell.style.backgroundColor && cell.style.backgroundColor !== '';
				if (hasColor && cell.textContent.trim() === '') {
					cell.style.setProperty('width', '18px', 'important');
					cell.style.setProperty('height', '18px', 'important');
					cell.style.setProperty('max-width', '18px', 'important');
					cell.style.setProperty('max-height', '18px', 'important');
					cell.style.setProperty('padding', '0', 'important');
					cell.style.setProperty('vertical-align', 'middle', 'important');
				} else {
					cell.style.setProperty('white-space', 'nowrap', 'important');
					cell.style.setProperty('padding-left', '4px', 'important');
					cell.style.setProperty('padding-right', '8px', 'important');
					cell.style.setProperty('vertical-align', 'middle', 'important');
				}
			});
			Array.from(t3.querySelectorAll('tr')).forEach(function(row) {
				row.style.setProperty('height', '22px', 'important');
			});
			t3.style.setProperty('table-layout', 'auto', 'important');
			t3.style.setProperty('width', 'auto', 'important');

			// reveal year field (in nav table t1)
			Array.from(t1.querySelectorAll('input, select, span, td')).forEach(function(el) {
				el.style.setProperty('color', '#000', 'important');
				el.style.setProperty('visibility', 'visible', 'important');
				el.style.setProperty('overflow', 'visible', 'important');
				el.style.setProperty('width', 'auto', 'important');
				el.style.setProperty('min-width', '60px', 'important');
			});

			showDebug('SECTION 1 APPLIED: t1(nav)=' + t1.rows.length + ' rows, t2(grid)=' + t2.rows.length + ' rows, t3(legend)=' + t3.rows.length + ' rows');
			var mbRect = msgBody.getBoundingClientRect();
			var bodyRect = fdoc.body.getBoundingClientRect();
			showDebug('msgBody: left=' + mbRect.left + ' right=' + (bodyRect.width - mbRect.right) + ' width=' + mbRect.width + ' | body width=' + bodyRect.width);
			
			if (!fdoc.getElementById('cal-swipe-hint')) {
				var walker2 = fdoc.createTreeWalker(fdoc.body, NodeFilter.SHOW_TEXT, null);
				var uNode;
				while (uNode = walker2.nextNode()) {
					if (uNode.nodeValue.indexOf('Calendar Updated') !== -1) {
						var updatedRow = uNode.parentElement.closest('tr') || uNode.parentElement;
						var swipeHint = fdoc.createElement('div');
						swipeHint.id = 'cal-swipe-hint';
						swipeHint.textContent = '← Swipe to view more →';
						swipeHint.style.cssText = 'text-align:center; font-size:15px; color:#FF0000; padding:4px 0;';
						updatedRow.parentElement.insertBefore(swipeHint, updatedRow.nextSibling);
						break;
					}
				}
			}
			
			var hintCheck = fdoc.getElementById('cal-swipe-hint');
			if (hintCheck) {
				var hintRect = hintCheck.getBoundingClientRect();
				showDebug('hint created: yes, visible rect=' + JSON.stringify({top: hintRect.top, height: hintRect.height, width: hintRect.width}));
			} else {
				showDebug('hint created: NO - loop never found "Calendar Updated" text node inside fdoc');
			}
			
		}

        // MAIN
        window.addEventListener('load', function() {
            hideHouseMenu();
            hideAdrenalinLogo();
            fixSearchAlignment();
			setTimeout(fixSearchAlignment, 500);
			setTimeout(fixSearchAlignment, 1500);

            var iframe = document.getElementById('iFrameMain');
			
			if (window.visualViewport) {
				var iframeBaseHeight = iframe.getBoundingClientRect().height;
				window.visualViewport.addEventListener('resize', function() {
					var vh = window.visualViewport.height;
					if (vh < iframeBaseHeight - 50) {
						iframe.style.setProperty('height', vh + 'px', 'important');
					} else {
						iframe.style.setProperty('height', iframeBaseHeight + 'px', 'important');
					}
				});
			}

			var quickPopup = document.createElement('div');
			quickPopup.style.cssText = "position:fixed;top:44px;right:70px;z-index:99998;background:#ffffff;border:2px solid #10002b;border-radius:4px;display:none;flex-direction:column;min-width:160px;box-shadow:0 4px 8px rgba(0,0,0,0.2);overflow:hidden;";

			var btnLeave = document.createElement('button');
			btnLeave.textContent = "Leave Request";
			btnLeave.onclick = function() {
				closeNavbar();
				setTimeout(function() { triggerSearch('Leave Request'); }, 300);
				setTimeout(function() { closeNavbar(); }, 2000);
				quickPopup.style.display = 'none';
			};
			document.body.appendChild(btnLeave);

			var btnAttendance = document.createElement('button');
			btnAttendance.textContent = "Attendance Reg.";
			btnAttendance.onclick = function() {
				closeNavbar();
				setTimeout(function() { triggerSearch('Attendance Regularization'); }, 300);
				setTimeout(function() { closeNavbar(); }, 2000);
				quickPopup.style.display = 'none';
			};
			document.body.appendChild(btnAttendance);

			var btnCalendar = document.createElement('button');
			btnCalendar.textContent = "Att. Calendar";
			btnCalendar.onclick = function() {
				closeNavbar();
				setTimeout(function() { triggerSearch('Attendance Calendar'); }, 300);
				setTimeout(function() { closeNavbar(); }, 2000);
				quickPopup.style.display = 'none';
			};
			document.body.appendChild(btnCalendar);

			btnLeave.style.cssText = "display:block;width:100%;padding:10px 16px;font-size:13px;background:#ffffff;color:#000000;border:none;border-bottom:1px solid #e0e0e0;text-align:left;cursor:pointer;";
			btnAttendance.style.cssText = "display:block;width:100%;padding:10px 16px;font-size:13px;background:#ffffff;color:#000000;border:none;border-bottom:1px solid #e0e0e0;text-align:left;cursor:pointer;";
			btnCalendar.style.cssText = "display:block;width:100%;padding:10px 16px;font-size:13px;background:#ffffff;color:#000000;border:none;text-align:left;cursor:pointer;";

			quickPopup.appendChild(btnLeave);
			quickPopup.appendChild(btnAttendance);
			quickPopup.appendChild(btnCalendar);
			document.body.appendChild(quickPopup);

			var toggleFab = document.createElement('button');
			toggleFab.textContent = "Quick";
			toggleFab.style.cssText = "position:fixed;top:10px;right:70px;z-index:99999;padding:8px;font-size:12px;background:#ffffff;color:#000000;border:2px solid #10002b;border-radius:4px;";
			toggleFab.onclick = function() {
				var showing = quickPopup.style.display === 'flex';
				quickPopup.style.display = showing ? 'none' : 'flex';
			};
			document.body.appendChild(toggleFab);

			var btnDebug = document.createElement('button');
			btnDebug.textContent = "Debug";
			btnDebug.style = "position:fixed;top:10px;right:150px;z-index:99999;padding:8px;font-size:12px;";
			
			
			
			btnDebug.onclick = function() {
			  var out = '';
			  function walk(doc, depth) {
				var prefix = '  '.repeat(depth);
				var iframes = doc.querySelectorAll('iframe');
				iframes.forEach(function(f) {
				  out += prefix + 'iframe id="' + f.id + '" src="' + f.src + '"\n';
				  var fdoc = null;
				  try { fdoc = f.contentDocument; } catch (e) { out += prefix + '  (blocked: ' + e.message + ')\n'; }
				  if (fdoc) {
					var msgBody = fdoc.querySelector('td.MsgBody1');
					if (msgBody) out += prefix + '  *** td.MsgBody1 FOUND HERE ***\n';
					walk(fdoc, depth + 1);
				  }
				});
			  }
			  walk(document, 0);
			  showDebug(out || 'no iframes found at top level');
			};
			
			document.body.appendChild(btnDebug);
			
			var btnFixCal = document.createElement('button');
			btnFixCal.textContent = "Fix Cal";
			btnFixCal.style = "position:fixed;top:120px;left:10px;z-index:999999;padding:12px;font-size:14px;background:yellow;color:black;";
			
			btnFixCal.onclick = function() {
			  try {
				var doc = document.getElementById('iFrameMain').contentDocument;
				var midFrame = doc.getElementById('iframeNewSummary');
				var midDoc = midFrame ? midFrame.contentDocument : null;
				var iBox = midDoc ? midDoc.getElementById('iBox') : null;
				var fdoc = iBox ? iBox.contentDocument : null;
				if (fdoc && fdoc.body) {
				  fdoc.body.dataset.calFixed = '';
				}
				applyAttendanceCalendarFixes(doc);
			  } catch (e) {
				showDebug('Fix Cal ERROR: ' + e.message);
			  }
			};
			
			document.body.appendChild(btnFixCal);
			
			var btnClearDebug = document.createElement('button');
			btnClearDebug.textContent = "Clear";
			btnClearDebug.style = "position:fixed;top:120px;left:100px;z-index:999999;padding:12px;font-size:14px;background:orange;color:black;";
			btnClearDebug.onclick = function() {
				var panel = document.getElementById('debugPanel');
				if (panel) panel.textContent = '';
			};
			document.body.appendChild(btnClearDebug);

            if (iframe) {
                iframe.addEventListener('load', function() {
                    try {
                        var doc = iframe.contentDocument || iframe.contentWindow.document;
                        var url = iframe.contentWindow.location.href;

                        if (url.indexOf('LeaveRequest') !== -1 || url.indexOf('AttendanceRegularisation') !== -1 || url.indexOf('MonthlyAttRptPage') !== -1) {
                            setTimeout(function() { hideHouseMenu(); }, 1000);
                        }

                        if (url.indexOf('LeaveRequest') !== -1) {
							window.zologCurrentPage = 'LeaveRequest';
							applyLeaveRequestFixes(doc);
						}
						if (url.indexOf('AttendanceRegularisation') !== -1) {
							window.zologCurrentPage = 'AttendanceRegularisation';
							window.arPollingStarted = false;
							applyAttendanceRegFixes(doc);

							if (!window.arPollingStarted) {
								window.arPollingStarted = true;
								var arPollId = setInterval(function() {
									if (window.zologCurrentPage !== 'AttendanceRegularisation') {
										clearInterval(arPollId);
										window.arPollingStarted = false;
										return;
									}
									if (!window.arPollCount) window.arPollCount = 0;
									window.arPollCount++;
									if (window.arPollCount % 5 === 0) {
										showDebug('poll tick ' + window.arPollCount + ', page=' + window.zologCurrentPage);
									}
									var currentIframe = document.getElementById('iFrameMain');
									var currentDoc = currentIframe ? currentIframe.contentDocument : null;
									if (currentDoc) {
										applyAttendanceRegFixes(currentDoc);
									}
								}, 1000);
							}
						}
	
						if (url.indexOf('MonthlyAttRptPage') !== -1) {
							window.zologCurrentPage = 'MonthlyAttRptPage';
							applyAttendanceCalendarFixes(doc);
						}

                    } catch (e) {
                        showDebug('CATCH ERROR: ' + e.message);
                    }
                });
            }
        });
    }
}

    const meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.getElementsByTagName('head')[0].appendChild(meta);

    const mobileStyles = `
        html { display: block !important; visibility: visible !important; }
        body, .Loginbodybg { background-image: none !important; background: #e5e7eb !important; background-color: #e5e7eb !important; }
        .login-box { margin: 40px auto !important; width: 90% !important; max-width: 400px !important; float: none !important; position: relative !important; }
        table, tbody, tr, td { display: block !important; width: 100% !important; box-sizing: border-box !important; }
        td[style*="width: 700px"], .contenthead { display: none !important; }
        td[style*="width: 300px"], #tblleftpillar { width: 100% !important; }
        input[type="text"], input[type="password"] { width: 100% !important; height: 45px !important; font-size: 16px !important; padding: 8px !important; margin: 6px 0 !important; border: 1px solid #ccc !important; border-radius: 4px !important; box-sizing: border-box !important; transition: font-size 0.1s ease; }
        #lblLogin { display: block !important; width: 100% !important; height: 45px !important; line-height: 41px !important; text-align: center !important; background-color: #0056b3 !important; color: #ffffff !important; font-weight: bold !important; border-radius: 4px !important; margin: 15px 0 !important; box-sizing: border-box !important; }
        input[type="checkbox"] { width: 20px !important; height: 20px !important; vertical-align: middle !important; }
		#trCompanyLanguage1, #trAuthentication1 { display: none !important; }
    `;

    const injectStyles = () => {
        const styleBlock = document.createElement('style');
        styleBlock.textContent = mobileStyles;
        (document.head || document.documentElement).appendChild(styleBlock);
    };

    injectStyles();

    const preventZoomOnFocus = () => {
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
        inputs.forEach(input => {
            const handleFocus = () => { input.style.setProperty('font-size', '50px', 'important'); };
            const handleBlurOrActive = () => { setTimeout(() => { input.style.setProperty('font-size', '16px', 'important'); }, 50); };
            input.addEventListener('touchstart', handleFocus);
            input.addEventListener('focus', handleFocus);
            input.addEventListener('keydown', handleBlurOrActive);
            input.addEventListener('click', handleBlurOrActive);
        });
    };

	function addPasswordToggle() {
	  var pwd = document.getElementById('txtPwd');
	  if (!pwd || pwd.closest('.pwd-toggle-wrapper')) return;
	  var wrapper = document.createElement('div');
	  wrapper.className = 'pwd-toggle-wrapper';
	  wrapper.style.cssText = 'position:relative;width:100%;';
	  pwd.parentNode.insertBefore(wrapper, pwd);
	  wrapper.appendChild(pwd);
	  pwd.style.setProperty('padding-right', '40px', 'important');
	  var toggleBtn = document.createElement('span');
	  toggleBtn.textContent = 'Show';
	  toggleBtn.style.cssText = 'position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:13px;color:#0056b3;font-weight:600;user-select:none;';
	  toggleBtn.onclick = function() {
	    if (pwd.type === 'password') { pwd.type = 'text'; toggleBtn.textContent = 'Hide'; }
	    else { pwd.type = 'password'; toggleBtn.textContent = 'Show'; }
	  };
	  wrapper.appendChild(toggleBtn);
	}

    if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			injectStyles();
			preventZoomOnFocus();
			addPasswordToggle();
		});
	} else {
		injectStyles();
		preventZoomOnFocus();
		addPasswordToggle();
	}
})();
