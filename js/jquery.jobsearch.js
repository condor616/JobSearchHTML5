(function($){

// init global vars
var APIkeys = new Object();
	APIkeys.country = {key:"20146"};
	APIkeys.region = {key:"22290"};
	APIkeys.location = {key:"20147"};
	APIkeys.division = {key:"20152"};
	APIkeys.business = {key:"20153"}
	APIkeys.jobfunction = {key:"20148"};
	APIkeys.therapeuticarea = {key:"20145"};
	APIkeys.jobtype = {key:"10039"};
	APIkeys.employmenttype = {key:"20283"};
	APIkeys.jobid = {key:"1927"};
	APIkeys.keyword = {key:"1937"};

var pointer;
var ui = new Object();
var extinterface = new Function();

		
//init methods
var methods = {
	init : function(interface, setting, templates, data) {
		
		pointer = this;
		
		// config object that contains all data for interface
		_jsInterface = {
			country : {
				dataset : 'country',
				type : 'custom',
				wrapper : '<div id="country-selector"><ul><li id="cList-A">A</li><li id="cList-B">B</li><li id="cList-C">C</li><li id="cList-D">D</li><li id="cList-E">E</li><li id="cList-F">F</li><li id="cList-G">G</li><li id="cList-H">H</li><li id="cList-I" class="small-letter">I</li><li id="cList-J" class="small-letter">J</li><li id="cList-K">K</li><li id="cList-L">L</li><li id="cList-M">M</li><li id="cList-N">N</li><li id="cList-O">O</li><li id="cList-P">P</li><li id="cList-Q">Q</li><li id="cList-R">R</li><li id="cList-S">S</li><li id="cList-T">T</li><li id="cList-U">U</li><li id="cList-V">V</li><li id="cList-W">W</li><li id="cList-X">X</li><li id="cList-Y">Y</li><li id="cList-Z" class="last-letter small-letter">Z</li></ul></div>',
				template : '<li id="$DATAKEY$">$DATAVALUE$</li>',
				func : function(){
						for(el in _jsData.country){
							
							// add sublist if it does not yet exist
							if($('#country-selector > ul > li[id=cList-'+ _jsData.country[el].substr(0, 1) +'] > ul > li').length < 1){
								$('#country-selector > ul > li[id=cList-'+ _jsData.country[el].substr(0, 1) +']').append('<ul></ul>');
							};
							
							// add country to drop down menu
							$('#country-selector > ul > li[id=cList-'+ _jsData.country[el].substr(0, 1) +'] > ul').append(_jsInterface.country.template.replace(/\$DATAKEY\$/g, el).replace(/\$DATAVALUE\$/g, _jsData.country[el]));
						
						};
							
						// add event listener for drop downs
						$('#country-selector > ul > li > ul > li').click(function(){
							methods.search(_jsInterface.country.dataset, $(this).attr('id'));
						});
						$('#country-selector > ul > li').hover(function(){
							$(this).find('ul').toggle();
							$(this).toggleClass('active');
						});
						$('#country-selector > ul > li > ul > li').hover(function(){
							$(this).toggleClass('active');
						});
					}
			},
			worldmap : {
				dataset : 'country',
				type : 'custom',
				wrapper : '<center><div id="vectormap" style="width: 100%; height:450px; "></div></center>',
				template : null,
				func : function(){
					var flashvars = {};
					var params = {
						allowscriptaccess: 'always',
						wmode : 'transparent'
					};
					var attributes = {
						id : 'worldmap',
						name: 'worldmap'
					};
					
					
					//swfobject.embedSWF("/flash/careers/job-search/worldmap.swf", "world-map", "578", "221", "9", null, flashvars, params, attributes);
					
					$('#country-selector > ul > li > ul > li').click(function(){
						//extinterface.activateCountry($(this).attr('id'));
						jQuery('#vectormap').vectorMap('set', 'focus', $(this).attr('id'));
					});
					
					// reset to defaults if filters were removed
					$(document).ajaxComplete(function(){
						$("div#resultsfilter > .alljobs, div#resultsfilter > .country").click(function(){
							extinterface.reset();
						});
					});
				
					extinterface = function getFlashmap(){
						if (navigator.appName.indexOf("Microsoft") != -1) {
							return window['worldmap']
						}
						else {
							return document['worldmap']
						}
					}					
				}
			},
			keyword : {
				dataset : 'keyword',
				type : 'input',
				wrapper : '<div class="keyword"></div>',
				template : '<input class="empty" type="text" value="Enter keyword(s) or Job ID"><button>Search</button>'
			},
			jobfunction : {
				dataset : 'jobfunction',
				type : 'select',
				wrapper : '<select class="first"><option value="" selected="selected">Select by function</option>$DATASET$</select>',
				template : '<option value="$DATAKEY$">$DATAVALUE$</option>'
			},
			division : {
				dataset : 'division',
				type : 'select',
				wrapper : '<select class="last"><option value="" selected="selected">Select by division</option>$DATASET$</select>',
				template : '<option value="$DATAKEY$">$DATAVALUE$</option>'
			}
			
		};
		
		_jsData = {
			country : JScountries,
			jobfunction : JSfunctions,
			division : JSdivisions,
			therapeuticareas : JStherapeuticareas
		};
		
		// config object that contains templates for results
		_jsSetting = {
			siteId : "5260", // default value to load global jobs
			apiAddress : 'http://66.77.22.117/WebRouter/WebRouter.asmx/route', // default API URI
			usDisclaimer: 0, //0=disabled, 1=enabled -- Added by Marcello
			usDisclaimerLinkText: "If you are applying for a job in the US please <a target=\"_blank\" href=\"http://www.novartis.com/downloads/miscellaneous/NoticeUSJobOpenings.pdf\">click here</a>.", //the link's text
		};		
		
		// config object that contains templates for results
		_jsTemplates = {
			// default settings for data loads all items
			header : '<div class="header"><div id="resultsinfo">$NUMRESULTS$ results for:</div>$FILTERS$</div>',
			results : {
				wrapper : '<table width="100%" class="faq-table"><colgroup><col width="400"><col width="175"><col width="175"></colgroup><thead><tr><th class="figures">Job title</th><th class="figures">Location</th><th class="figures">Business</th></tr></thead><tbody>$JOBRESULTS$</tbody></table>',
				template : '<tr class="data-highlight"><td><p class="link-wrapper"><a target="_blank" class="link" href="$LINK$">$TITLE$</a><br>$EMPLOYMENTTYPE$, $JOBTYPE$</p></td><td>$COUNTRY$,<br>$LOCATION$</p></td><td>$BUSINESS$</td></tr>'
			},
			footer : {
				wrapper : '<div class="pagination"></div>',
				template : '<a href="javascript:void(0);" class="page $STATUS$">$PAGE$</a>',
				number : 5
			}
		};
		
		// overwrite the default values with the vaiables
		if(interface) $.extend(_jsInterface, interface);
		if(setting) $.extend(_jsSetting, setting);
		if(templates) $.extend(_jsTemplates, templates);
		if(data) $.extend(_jsData, data);
		
		// register default API keys
		for(el in _jsSetting.defaults){
			try{
				APIkeys[el].value = _jsSetting.defaults[el];
				APIkeys[el].preset = true;
			}
			catch(err){
				alert("Error: Default key is not available");
			}
		};
		
		$(this).append('<div id="jobinterface"></div>');
		
		var UIselect = function (setting) {
			this.datatype = setting.dataset;
			this.wrapper = setting.wrapper;
			this.template = setting.template;
			this.dataset = _jsData[setting.dataset]
			this.data = new String("");
			this.func = setting.func;
			
			// cycle through data
			for(el in _jsData[setting.dataset]){
				this.data += this.template.replace(/\$DATAKEY\$/g, el).replace(/\$DATAVALUE\$/g, _jsData[setting.dataset][el]);
			};
			
			this.dom = $(this.wrapper.replace(/\$DATASET\$/g, this.data));
			
			this.onChange();
		};
		UIselect.prototype.getDom = function(){
			return $(this.dom);
		};
		UIselect.prototype.getType = function(){
			return this.datatype;
		};
		UIselect.prototype.clear = function(){
			$(this.dom).find('option:eq(0)').attr("selected", "selected");
		};
		UIselect.prototype.onChange = function(){
			var type = this.datatype
			var element = this.dom
			
			$(this.dom).change(function(){
				methods.search(type, $(element).val());
			});
		};
		
		var UIinput = function (setting) {
			this.datatype = setting.dataset;
			this.wrapper = setting.wrapper;
			this.template = setting.template;
			this.func = setting.func;
			
			this.dom = $(this.wrapper).append(this.template);
			
			this.onEnter();
			this.onChange();
		};
		UIinput.prototype.getDom = function(){
			return $(this.dom);
		};
		UIinput.prototype.getType = function(){
			return this.datatype;
		};
		UIinput.prototype.clear = function(){
			$(this.dom).find('input').val("Enter keyword(s) or Job ID").toggleClass("empty");
		};
		UIinput.prototype.onEnter = function(){
			$(this.dom).find('input').focus(function(){
				$(this).removeClass('empty');
				$(this).val('');
				$(this).unbind('focus');
			});
		};
		UIinput.prototype.onChange = function(){
			var type = this.datatype
			var element = this.dom
			
			$(this.dom).change(function(){
				methods.search(type, $(element).find('input').val());
			});
		};

		// cycle trought interface data to build the structure
		for(itm in _jsInterface){
			
			// get data to fill template
			switch (_jsInterface[itm].type){
				// create a new select object
				case "select":
					ui[itm] = new UIselect(_jsInterface[itm]);
					$("#jobinterface").append(ui[itm].getDom());
					if(ui[itm].func){
						ui[itm].func();
					};
					break;
				
				// create a new input object
				case "input":
					ui[itm] = new UIinput(_jsInterface[itm]);
					$("#jobinterface").append(ui[itm].getDom());
					if(ui[itm].func){
						ui[itm].func();
					};
					break;
				
				// create a new custom object
				default:
					$('#jobinterface').append(_jsInterface[itm].wrapper);
					if(_jsInterface[itm].func){
							_jsInterface[itm].func();
					};
			};
		};
		
		// set up results contrainer
		
		//Added by Marcello
		//the discalimer DIV get added only if the usDisclaimer functionality is enabled
		if (_jsSetting.usDisclaimer == 1){
			var html = "<div id=\"us-disclaimer\"> " + _jsSetting.usDisclaimerLinkText + "</div>";
			$(this).append(html);
		}
		
		
		$(this).append('<div id="jobresults"></div>');
		
		// check for url parameters
		if(window.location.hash){
			// get all url parameters
			var query = window.location.hash.substr(1).split("&");
			
			// cycle through parameters
			for(el = 0; el < query.length; el++){
				// split values from keys
				var obj = query[el].split("=");
				
				// register api keys
				if(APIkeys[obj[0]].preset != true){
					APIkeys[obj[0]].value = obj[1];
				}
			}
			
			// fire a refresh
			methods.search();
		};
		
		// return selected element
		return pointer;
	},
	extinterface : function(func, obj){
		if(func == "redraw"){
			var arrCountries = new Array;
			for(el in _jsData.country){
				arrCountries.push(el);
			};
			document.getElementById(obj).setState(true, arrCountries, false);
		}
	},
	clearFilter : function(id) {
		
		//reset the Map focus
		jQuery('#vectormap').vectorMap('set', 'focus', 0, 0, 2);
		
		// check if what filters needs to be cleared
		if(id && !APIkeys[id].preset){
			// clear values for api keys
			APIkeys[id].value = null;
			
			// set default value for UI element
			for(el in ui){
				var type = ui[el].getType();
				
				if(type == id){
					ui[el].clear();
				}
			};
			
		} else {
			// clear values for api keys
			for(el in APIkeys){
				if(!APIkeys[el].preset){
					APIkeys[el].value = null;
				}
			};
			
			// set default value for UI element
			for(el in ui){
				ui[el].clear();
			};
		};

		
		// refresh search results
		methods.search();
	},
	writeKeys : function(id, val, srt) {
			// register values for api key if key is not protected
			if(!APIkeys[id].preset){
				// register values
				APIkeys[id].value = val;
				APIkeys[id].sort = srt;
				return true;
			} else {
				// return error if api key is protected
				alert("Error: " + id + " has a fixed value and cannot be changed");
			};
	},
	readKeys : function(id) { 
		if(id){
			// return requested key
			return APIkeys[id];
		} else{
			// return keys that include a value
			var keyobj = new Object();
			for(el in APIkeys){
				if(APIkeys[el].value){
					keyobj[el] = APIkeys[el]
				}
			}
			return keyobj;
		};
	},
	search : function(source, query) { 
		// new object for xml results form api
		var resultXml = new Object();
		
		// uri for api request
		var apiAddress = _jsSetting.apiAddress;
		var senderId = 12345;
		var senderVal = 13617;
		var clientId = 13617;
		var siteId = _jsSetting.siteId;
		
		// check if new page is requested
		if(source == "page"){
			parseAPIkeys(methods.readKeys(), query);
		}
		// check if data needs to be registered
		else if(source && query){
			if(methods.writeKeys(source, query) == true){
				// send API object to parser
				parseAPIkeys(methods.readKeys(), 1);
			};
		}
		// refresh search results
		else {
			// send API object to parser
			parseAPIkeys(methods.readKeys(), 1);
		};
					
		function parseAPIkeys(obj, page){
			// var for api questions
			var question = new String();
			var urlquery = new String();
			var pageNumber = new String('<PageNumber>'+ page +'</PageNumber>');
			
			// cycle through element to parst query
			var opr = ""
			for(el in obj){
				// update questions parameters
				question += '<Question Sortorder="ASC" Sort="No"><Id>' + obj[el].key + '</Id><Value>' + obj[el].value + '</Value></Question>';
				// update url parameters
				urlquery += opr + el + '=' + obj[el].value;
				opr = '&';
			};
			
			// var for api query
			var apiRequest = '<Envelope version="01.00"><Sender><Id>'+ senderId +'</Id><Credential>'+ senderVal +'</Credential></Sender><TransactInfo transactId="1" transactType="data"><TransactId>11/05/2011</TransactId><TimeStamp>12:00:00 AM</TimeStamp></TransactInfo><Unit UnitProcessor="SearchAPI"><Packet><PacketInfo packetType="data"><packetId>1</packetId></PacketInfo><Payload><InputString><ClientId>'+ clientId +'</ClientId><SiteId>'+ siteId +'</SiteId>'+ pageNumber +'<OutputXMLFormat>0</OutputXMLFormat><AuthenticationToken/><HotJobs/><ProximitySearch><Distance/><Measurement/><Country/><State/><City/><zipCode/></ProximitySearch><JobMatchCriteriaText/><SelectedSearchLocaleId/><Questions>' + question + '</Questions></InputString></Payload></Packet></Unit></Envelope>';
			
			// set url parameters
			window.location.hash = urlquery;
			
			// clear results and add loading bar
			$('#jobresults').html('<p class="loading">Loading...</p>');
			sendRequest(apiAddress, apiRequest);
		};
		
		function sendRequest(uri, query){
			$.ajax({
				type: 'GET',
				url: uri,
				data: {
					'inputXml': query
				},
				crossDomain: true,
				cache: false,
				dataType: 'text',
				dataFilter: function(data){
					resultXml = data.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
					return(resultXml);
				},
				success: function(data){
					parseXML(data);
				}
			});
		};
		
		function parseXML(data){				
			// empty stage for results
			$('#jobresults').empty();
			
			// function vars
			var page = Number($(data).find('OtherInformation > PageNumber').text());
			var results = Number($(data).find('OtherInformation > TotalRecordsFound').text());
			var maxpage = Number($(data).find('OtherInformation > MaxPages').text());
			
			// add section for header
			var headerUI = $(_jsTemplates.header.replace(/\$NUMRESULTS\$/g, results).replace(/\$FILTERS\$/g, '<div id="resultsfilter"></div>'));
			
			// add filters for active queries
			var resultsfilter = $(headerUI).find('div#resultsfilter');
			
			// cycle though API keys to find active queries
			for(el in APIkeys){
				if(!APIkeys[el].preset && APIkeys[el].value != null){
					// tanslate codes into human friendly format
					if(el != "keyword"){
						var tmp = $('<a href="javascript:void(0);" class="'+ el +'">'+ _jsData[el][APIkeys[el].value] +'</a>').data('key', el);
						$(resultsfilter).append(tmp);
					} else {
						var tmp = $('<a href="javascript:void(0);" class="'+ el +'">'+ APIkeys[el].value +'</a>').data('key', el);
						$(resultsfilter).append(tmp);
					}
					
				}
			};
			
			// add cancel all filter if other filters are available
			if($(resultsfilter).children().size() > 0){
				var cnlall = $('<a href="javascript:void(0);" class="alljobs">Show all jobs</a>').data('key', '');
				$(resultsfilter).append(cnlall);
			};
			
			// add event listeners
			$(resultsfilter).children().click(function(){
				methods.clearFilter($(this).data('key'));
			});
			
			// display results header
			$('#jobresults').append(headerUI);
			
			var resultsUI = new String();
			// add results
			if(results > 0){
				// add data wrapper
				resultsUI = _jsTemplates.results.wrapper;
				var resultsData = new String();
				
				if (_jsSetting.usDisclaimer == 1){
					var country_flag = 0;  //0 means this is the first occurency of USA -- Added by Marcello 
					$('#us-disclaimer').hide();
				}
				
				// cycle through results
				$(data).find('ResultSet > Jobs > Job').each(function(){						
					// setup url apendix for tracking
					var urlapendix = new String();
					if(_jsSetting.urlapendix){
						urlapendix = "&codes=" + _jsSetting.urlapendix;
					};
					
					// replace all placeholders with values
					var tmp = _jsTemplates.results.template;
					
					//check if _jsSetting.apiAddress is 1 (enabled) or 0 (disabled)
					if (_jsSetting.usDisclaimer == 1){
						//check if one of the result's countries is "USA" 
						if ($(this).find('Question[Id="20146"]').text() == "USA "){
							if (!country_flag){
								country_flag = 1;
								$('#us-disclaimer').show();
							}
						}
					}
					// -- Added by Marcello
					
					tmp = tmp.replace(/\$LINK\$/g, $(this).find('JobDetailLink').text() + urlapendix);
					tmp = tmp.replace(/\$JOBID\$/g, $(this).find('Question[Id="1927"]').text());
					tmp = tmp.replace(/\$TITLE\$/g, $(this).find('Question[Id="1951"]').text());
					tmp = tmp.replace(/\$COUNTRY\$/g, $(this).find('Question[Id="20146"]').text());
					tmp = tmp.replace(/\$LOCATION\$/g, $(this).find('Question[Id="20147"]').text());
					tmp = tmp.replace(/\$DIVISION\$/g, $(this).find('Question[Id="20152"]').text());
					tmp = tmp.replace(/\$EMPLOYMENTTYPE\$/g, $(this).find('Question[Id="20283"]').text());
					tmp = tmp.replace(/\$JOBTYPE\$/g, $(this).find('Question[Id="10039"]').text());
					tmp = tmp.replace(/\$THERAPEUTICAREA\$/g, $(this).find('Question[Id="20145"]').text());
					tmp = tmp.replace(/\$JOBFUNCTION\$/g, $(this).find('Question[Id="20148"]').text());
					tmp = tmp.replace(/\$BUSINESS\$/g, $(this).find('Question[Id="20153"]').text());
					
					// add job item to results
					resultsData += tmp;
				});
				// add job results to results UI
				resultsUI = resultsUI.replace(/\$JOBRESULTS\$/g, resultsData);
			};
			
			//if there are no results, hide the usDisclaimer. No needs to check if the usDiscalimer functionality is enabled 
			//-- Added By Marcello
			if(results == 0){
				$('#us-disclaimer').hide();
			}
			
			
			// display results UI
			$('#jobresults').append(resultsUI);
			
			var footerUI = new String();
			// check if there are more than one page to render pagination
			if(maxpage > 1){
				// add footer UI element
				var footerUI = $(_jsTemplates.footer.wrapper);
				
				// cycle through pagination with max element in mind
				for(i = -_jsTemplates.footer.number; i <= _jsTemplates.footer.number; i++){
					if(page + i > 0  && page + i <= maxpage){
						// check if current site is active
						if(page + i == page){
							var tmp = $(_jsTemplates.footer.template.replace(/\$STATUS\$/g, 'active').replace(/\$PAGE\$/g, page + i)).data('page', page + i);
							$(footerUI).append(tmp);
						}
						else{
							var tmp = $(_jsTemplates.footer.template.replace(/\$STATUS\$/g, '').replace(/\$PAGE\$/g, page + i)).data('page', page + i);
							$(footerUI).append(tmp);
						};
					};
				};
				
				// add event listeners
				$(footerUI).children().click(function(){
					methods.switchPage($(this).data('page'));
				})
									
				// display footer information
				$('#jobresults').append(footerUI);
			};
			
		};
	},
	switchPage : function(page){
		if(page){
			methods.search('page', page);
		};
	}
};

$.fn.jobsearch = function(method){
	// Method calling logic
	if(methods[method]){
		return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else if(typeof method === 'object' || ! method ){
		return methods.init.apply(this, arguments);
	} else{
		$.error('Method ' +  method + ' does not exist on jQuery.jobsearch');
	};
};

})( jQuery );