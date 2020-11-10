var relation; 		// user selected MROP 
var source = []; 	// set containing source output.
var followup = []; 	// 2d array containing follow-up output sets.
var fuCount = 0; 	// count of follow-up sets
var errors = ""; 	// string containing information about where errors are located.
var APInum;
var RELnum;
var refresh = false;

// LOAD APIS & RELATIONS
$(document).ready(function() {
	myStorage = window.localStorage;
	// if dictionaries dont exist, create.
	if (myStorage.getItem("relNames") == null) {
		myStorage.setItem("relNames",JSON.stringify([]));
	}
	document.getElementById("relations").innerHTML = showRelations();
	
	if (myStorage.getItem("apiNames") == null) {
		myStorage.setItem("apiNames",JSON.stringify([]));
	}
	document.getElementById("apis").innerHTML = showAPIs();
});


//========================================== INTERFACE FUNCTIONS =====================================================
// displays definitions for each MROP
function showMrops() {
	document.getElementById("mrops").innerHTML = 
		'<h3>Metamorphic relation output patterns</h3>'+
		'<input type="button" value="hide" onClick="hideMrops()"/>' +
		'<dl>'+
			'<dt>Equivalence</dt>'+
			'<dd>Source and follow-up output sets are equivalent, e.g. Setting ordering criterion.</dd>'+
			'<dt>Equality</dt>'+
			'<dd>Source and follow-up output sets contain the same items in the same order, e.g. Setting page size, using default input values, setting new ordering criterion.</dd>'+
			'<dt>Subset</dt>'+
			'<dd>The first follow-up output is a subset of the source output, and all follow-ups are a subset of the follow-up which came before it, e.g. Setting filters, refining query.</dd>'+
			'<dt>Disjoint</dt>'+
			'<dd>Source and follow up output sets have no items in common, e.g. Setting disjoint filtering parameters, performing disjoint search queries.</dd>'+
			'<dt>Complete</dt>'+
			'<dd>Source output should be equivalent to all follow-up outputs put together, e.g. Setting disjoint and complete filters.</dd>'+
			'<dt>Difference</dt>'+
			'<dd>Source output should be equivalent to follow-up output, except for a defined alteration, e.g. Updating a resources property, creating respirce with a specific property. </dd>'+
		'</dl>';
}

// hides definitions
function hideMrops() {
	document.getElementById("mrops").innerHTML = 
		'<h3>Metamorphic relation output patterns</h3>'+
		'<input type="button" value="show" onClick="showMrops()"/>';
}

// Loads/updates the stored relations on screen.
function showRelations() {
	var relHTML = "";
	// load relation dictionary
	var RELNames = myStorage.getItem("relNames");
	RELNames = JSON.parse(RELNames);
	for (var i = 0; i < RELNames.length; i++) {
		// add radio button for each relation
		relHTML += '<input type="radio" name="mrelation" value="'+RELNames[i]+'">'+RELNames[i]+'<br />';
	}
	relHTML += '<br />';
	return relHTML;
}

// ***** AUTOMATIC FUNCTIONS *****
// Displays the automatic test case generation interface
function showAuto() {
	var active;
	// if tab is not currently open
	var unactive = document.getElementsByClassName("unactive");
	if (unactive[0].value == "Automatic" || unactive[1].value == "Automatic" || unactive[2].value == "Automatic") {
		fuCount = 0;
		document.getElementById("tabcontent").innerHTML =
			'<h3 id="innerTitle">Automatic Test Case Generation:</h3>'+
			'<div id="apis"></div>'+
			'Source data parameters:<br />'+
			'<input type="text" id="srcPara" size="95" placeholder="{&quot;parameter&quot;:&quot;value&quot;, ...}"/><br /><br />'+
			'Follow-up 0 data parameters:<br />'+
			'<input type="text" id="fu0Para" size="95" placeholder="{&quot;parameter&quot;:&quot;value&quot;, ...}"/><br />'+
			'<div id="addFollowup"></div>'+
			'<input type="button" id="folupButton" value="+ Follow-up" onClick="addFollowupElement()"/>'+
			'<br /><br />';
		document.getElementById("apis").innerHTML = showAPIs();
		// update tabs
		active = document.getElementsByClassName("active");
		active[0].className = "unactive";
		for (var i = 0; i < unactive.length; i++) {
			if (unactive[i].value == "Automatic") {
				unactive[i].className = "active";
			}
		}
	}
}

// displays stored api options
function showAPIs() {
	var apiHTML = 'Currently testing: <br />';
	// load api dictionary
	var APINames = myStorage.getItem("apiNames");
	APINames = JSON.parse(APINames);
	APInum = APINames.length;
	for (var i = 0; i < APInum; i++) {
		// make radio for each
		apiHTML += '<input type="radio" name="apis" value="'+APINames[i]+'" checked="checked">'+APINames[i]+'<br />';
	}
	if (APInum == 0) {
		apiHTML += "Nothing!<br/>";
	}
	apiHTML += '<br />';
	return apiHTML;
}

// Adds a followup test case set
function addFollowupElement() {
	fuCount++;
	document.getElementById("addFollowup").innerHTML += 
		"Follow-up "+fuCount+" data parameters:<br />"+
		"<input type='text' id='fu"+fuCount+"Para' size='95' placeholder='{&quot;parameter&quot;:&quot;value&quot;,...}'/><br />";
}

// ***** MANUAL FUNCTIONS *****
// displays interface for manual test case generation
function showManual() {
	var active;
	var unactive = document.getElementsByClassName("unactive");
	if (unactive[0].value == "Manual" || unactive[1].value == "Manual" || unactive[1].value == "Manual") {
		document.getElementById("tabcontent").innerHTML =
			'<h3 id="innerTitle">Manual Test Case Generation:</h3>'+
			'input for file path to test case doc<br/>'+
			'seperate source and follow ups somehow<br/>' +
			'load into source and follow-up arrays<br/>';
		// update tabs
		active = document.getElementsByClassName("active");
		active[0].className = "unactive";
		for (var i = 0; i < unactive.length; i++) {
			if (unactive[i].value == "Manual") {
				unactive[i].className = "active";
			}
		}
	}
}
// manual functions here \/ \/ \/ \/ 

// ***** ADD API FUNCTIONS *****
function showAddAPI() {
	var active;
	var unactive = document.getElementsByClassName("unactive");
	if (unactive[0].value == "Add API" || unactive[1].value == "Add API" || unactive[2].value == "Add API" || refresh == true) {
		refresh = false;
		// update APInum
		var APINames = myStorage.getItem("apiNames");
		APINames = JSON.parse(APINames);
		APInum = APINames.length;
		// Add api interface is written into div tabcontent
		document.getElementById("tabcontent").innerHTML =
			'<h3 id="innerTitle">Add API:</h3>'+
			'API Name:<br />'+
			'<input type="text" id="apiname'+APInum+'" size="95" value="YoutubeSearch"/><br />'+
			'API URL:<br />'+
			'<input type="text" id="apiurl'+APInum+'" size="95" value="https://www.googleapis.com/youtube/v3/search"/><br />'+
			'API Key:<br />'+
			'<input type="text" id="apikey'+APInum+'" size="95" value=""/><br />'+
			'Default data parameters:<br />'+
			'<input type="text" id="defparam'+APInum+'" size="95" value="{&quot;part&quot; : &quot;snippet&quot;, &quot;type&quot; : &quot;video&quot;}"/><br />'+
			'Data to be handled:<br />'+
			'<input type="text" id="datahandler'+APInum+'" placeholder="item. ..." size="95" value="item.id.videoId"/><br /><br />'+
			'<input type="button" id="addAPIButton" value="ADD API" onClick="addAPI()"/>'+
			'<input type="button" id="clearAPIButton" value="CLEAR APIs" onClick="clearAPI()"/>'+
			'<div id="success"></div>';
		// update tabs
		active = document.getElementsByClassName("active");
		active[0].className = "unactive";
		for (var i = 0; i < unactive.length; i++) {
			if (unactive[i].value == "Add API") {
				unactive[i].className = "active";
			}
		}
	}
}

function addAPI() {
	// get API dictionary
	var APINames = myStorage.getItem("apiNames");
	APINames = JSON.parse(APINames);
	// get elements and from interface and load into object, then stringify and store
	var api = {};
	apiname = document.getElementById("apiname"+APInum).value;
	if (myStorage.getItem(apiname) != null) { // api already exisits
		document.getElementById("success").innerHTML = "<span style='color:red'>Fail: API "+apiname+" already exists!</span>";
	}
	else {
		api.apiname = apiname;
		api.url = document.getElementById("apiurl"+APInum).value;
		api.key = document.getElementById("apikey"+APInum).value;
		api.defparam = document.getElementById("defparam"+APInum).value;
		api.handler = document.getElementById("datahandler"+APInum).value;
		myStorage.setItem(apiname, JSON.stringify(api));
		// add name to api dictionary
		APINames.push(apiname);
		myStorage.setItem("apiNames", JSON.stringify(APINames));
		// refresh and success msg
		refresh = true;
		showAddAPI();
		document.getElementById("success").innerHTML = "Success: API "+apiname+" has been added!";
	}
}

// gets the apiname from the box and deletes
function clearAPI() {
	var APINames = myStorage.getItem("apiNames");
	APINames = JSON.parse(APINames);
	// remove each api object then empty the dictionary.
	for (var i = 0; i < APINames.length; i++) {
		myStorage.removeItem(APINames[i]);
	}
	myStorage.setItem("apiNames",JSON.stringify([]));
	APInum = 0;
	// refresh and success
	refresh = true;
	showAddAPI();
	document.getElementById("success").innerHTML = "Success: All APIs removed!"
}

// ***** ADD RELATION FUNCTIONS *****
function showAddRelation() {
	var active;
	var unactive = document.getElementsByClassName("unactive");
	if (unactive[0].value == "Add Relation" || unactive[1].value == "Add Relation" || unactive[2].value == "Add Relation" || refresh == true) {
		refresh = false;
		// update RELnum
		var RELNames = myStorage.getItem("relNames");
		RELNames = JSON.parse(RELNames);
		RELnum = RELNames.length;
		// Add relation interface is written into div tabcontent
		document.getElementById("tabcontent").innerHTML =
			'<h3 id="innerTitle">Add Relation:</h3>'+
			'Relation Name:<br />'+
			'<input type="text" id="relname'+RELnum+'" size="95" value="translation"/><br /><br />'+
			'Data:'+
			'<ul><li>source - array containing source data set.</li>'+
			'<li>followup - 2d array, where each index i contains followup i data set.</li>'+
			'<li>errors - string which can be concatenated upon in order to output results.</li></ul>'+
			'Result verification code:<br />'+
			'<textarea class="resultcode" id="resultcode'+RELnum+'" cols="72">console.log("success");</textarea><br /><br />'+
			'<input type="button" id="addRelButton" value="ADD RELATION" onClick="addRelation()"/>'+
			'<input type="button" id="clearRelButton" value="CLEAR RELATIONS" onClick="clearRelation()"/>'+
			'<div id="success"></div>';
		// update tabs
		active = document.getElementsByClassName("active");
		active[0].className = "unactive";
		for (var i = 0; i < unactive.length; i++) {
			if (unactive[i].value == "Add Relation") {
				unactive[i].className = "active";
			}
		}
	}
}

function addRelation() {
	// get REL dictionary
	var RELNames = myStorage.getItem("relNames");
	RELNames = JSON.parse(RELNames);
	// get elements and from interface and load into object, then stringify and store
	var relation = {};
	relname = document.getElementById("relname"+RELnum).value;
	if (myStorage.getItem(relname) != null) { // api already exisits
		document.getElementById("success").innerHTML = "<span style='color:red'>Fail: Relation "+relname+" already exists!</span>";
	}
	else {
		relation.relname = relname;
		relation.resultcode = document.getElementById("resultcode"+RELnum).value;
		myStorage.setItem(relname, JSON.stringify(relation));
		// add name to api dictionary
		RELNames.push(relname);
		myStorage.setItem("relNames", JSON.stringify(RELNames));
		// refresh and success msg
		refresh = true;
		showAddRelation();
		document.getElementById("relations").innerHTML = showRelations();
		document.getElementById("success").innerHTML = "Success: Relation "+relname+" has been added!"
	}
}

function clearRelation() {
	var RELNames = myStorage.getItem("relNames");
	RELNames = JSON.parse(RELNames);
	// remove each relation object then empty the dictionary.
	for (var i = 0; i < RELNames.length; i++) {
		myStorage.removeItem(RELNames[i]);
	}
	myStorage.setItem("relNames",JSON.stringify([]));
	RELnum = 0;
	refresh = true;
	showAddRelation();
	document.getElementById("relations").innerHTML = showRelations();
	document.getElementById("success").innerHTML = "Success: All relations removed!"
}


//========================================== BACKEND =====================================================
function testIt() {
	// reset
	errors = "";
	source = []; 	
	followup = []; 
	// METAMORPHIC RELATION ========================================
	// get selected relation
	var radios = document.getElementsByName('mrelation');
	for (var i = 0, len = radios.length; i < len; i++) {
		if (radios[i].checked) {
			relation = radios[i].value;
			break;
		}
	}
	// loading bar
	document.getElementById("output").innerHTML ="<progress value=20 max=100></progress>";
	// get active
	var active = document.getElementsByClassName("active");
	if (relation == null) { 
	// no relation selected
		writeToFile("Failed: No relation selected");
	}
	else if (active[0].value == "Automatic" && document.getElementsByName('apis').length == 0) {
	// no API selected
		writeToFile("Failed: No API selected");
	}
	else if (active[0].value == "Add API" || active[0].value == "Add Relation") {
	// wrong screen
		writeToFile("Failed: Please select Automatic or Manual");
	}
	else if (active[0].value == "Manual") {
	// MANUAL (FROM EXTERNAL DOC) ==================================
		// get text file, load in source and followup.
		
		if (errors.indexOf("Failed") == -1) {
		// no failures, verify results
			verifyResults();
		}
	}
	
	if (active[0].value == "Automatic" && document.getElementsByName('apis').length != 0) {
	// AUTOMATED (FROM ACTIVE API) =================================
		// Generate source test case set
		var modifier = document.getElementById("srcPara").value;
		autoTestCase(source, modifier);
		
		// Generate follow-up test case sets
		for (var j = 0; j <= fuCount; j++) {
			followup.push([]);
			var modifier = document.getElementById("fu"+j+"Para").value;
			autoTestCase(followup[j], modifier);
		}
		
		document.getElementsByTagName("progress")[0].value = 80;
		//ajaxStop validates and displays results
	}
	else {
		document.getElementById("output").innerHTML = "<h3>Errors</h3>"+errors;
	}
}

$(document).ajaxStop(function() {
	// verify autogen test cases
	if (errors.indexOf("Failed") == -1) {
	// no failures, result verification
		verifyResults(); 
	}
	document.getElementById("output").innerHTML = "<h3>Errors</h3>"+errors;
});		

function autoTestCase(arr, parameters) {
	// get a result list from an API and push the data into an array.
	var apiname;
	var radios = document.getElementsByName('apis');
	for (var i = 0, len = radios.length; i < len; i++) {
		if (radios[i].checked) {
			apiname = radios[i].value;
			break;
		}
	}
	var stringObj = myStorage.getItem(apiname);
	var api = JSON.parse(stringObj);
	var url = api.url;
	var key = api.key;
	var defaults = api.defparam;
	var handler = api.handler;
	var request = {};
	defaults = JSON.parse(defaults);
	for (var k in defaults) request[k] = defaults[k];	
	if (parameters != "") {
		parameters = JSON.parse(parameters);
		for (var k in parameters) request[k] = parameters[k];
	}
	request.key = key;
	
	// Using cross domain ajax with jquery, push the data to be handled into the array.	
	$.get(url, request, function(data) {
		$.each(data.items, function(i, item) { 
			if (eval(handler) == undefined) {
				errors = "Failed: No data found!";
			}
			arr.push(eval(handler));
		})
	}		
	).fail(function() { 
		errors = "Failed: Invalid request";
	});
}

function verifyResults() {
	if (relation == 'equivalence') {
	// check that each follow up contains the same number of results as the source, 
	// that each result in a follow up set is also in the source set, and
	// that each result in the source set is in the follow-up.
		for(var i = 0; i < followup.length; i++) {
			if (followup[i].length != source.length) {
				if (followup[i].length > source.length) {
					writeToFile("Error: Follow-up " + i + " is not equivalent to source: Has more results than source! ");
				}
				else {
					writeToFile("Error: Follow-up " + i + " is not equivalent to source: Has less results than source! ");
				}
			}
			for(var j = 0; j < followup[i].length; j++) {
				if(!inArray(source,followup[i][j])) {
					writeToFile("Error: Result " + (j+1) + " in follow-up " + i + " is not in source! ");
				}
				if(!inArray(followup[i],source[j])) {
					writeToFile("Error: Result " + (j+1) + " in source is not in follow-up " + i + "! ");
				}
			}
		}
	}
	else if (relation == 'equality') {
	// check that the followups match the length and order of the source.
		for(var i = 0; i < followup.length; i++) {
			if (followup[i].length != source.length) {
				if (followup[i].length > source.length) {
					writeToFile("Error: Follow-up " + i + " is not equal to source: Has more results than source! ");
				}
				else {
					writeToFile("Error: Follow-up " + i + " is not equal to source: Has less results than source! ");
				}
			}
			for(var j = 0; j < followup[i].length; j++) {
				if(source[j] != followup[i][j]) {
					writeToFile("Error: Result " + (j+1) + " in follow-up " + i + " is not equal to result " + (j+1) + " in source! ");
				}
			}
		}
	}
	else if (relation == 'subset') {
	// check that follow up 0 is smaller than the source, and only has results that are also in source.
	// Each following followup must be a subset of the one before it.
		if (followup[0].length > source.length) {
			writeToFile("Error: Follow-up 0 is not a subset of source: Has more results than source! ");
		}
		for(var k = 0; k < followup[0].length; k++) {
			if(!inArray(source,followup[0][k])) {
				writeToFile("Error: Result " + (k+1) + " in follow-up 0 is not in source! ");
			}
		}
		if (followup.length > 1) {
			for(var i = 1; i < followup.length; i++) {
				if (followup[i].length > followup[i-1].length) {
					writeToFile("Error: Follow-up " + i + " is not a subset of follow-up " + (i-1) + ": Has more results! ");
				}
				for(var j = 0; j < followup[i].length; j++) {
					if(!inArray(followup[i-1],followup[i][j])) {
						writeToFile("Error: Result " + (j+1) + " in follow-up " + i + " is not in follow-up " + (i-1) + "! ");
					}
				}
			}
		}
	}
	else if (relation == 'disjoint') {
	// Check that no results in a follow up are also in the source or any other follow-ups.
		for(var i = 0; i < followup.length; i++) {
			for(var j = 0; j < followup[i].length; j++) {
				if(inArray(source,followup[i][j])) {
					writeToFile("Error: Result " + (j+1) + " in follow-up " + i + " is in source! ");
				}
				for(var k = 0; k < followup.length; k++) {
					if (k != i) {
						if(inArray(followup[k],followup[i][j])) {
							writeToFile("Error: Result " + (j+1) + " in follow-up " + i + " is in follow-up " + k + "! ");
						}
					}
				}
			}
		}
	}
	else if (relation == 'complete') {
	// For each source result ensure that it is in one of the follow-ups.
	// if there cannot be duplicates, sum the lengths of all follow-ups and check that it matches the length of the source.
	// For each followup result ensure that it is in the source.
		var foltot = [];
		for(var k = 0; k < followup.length; k++) {
			foltot.push.apply(foltot, followup[k]);
		}
		for(var h = 0; h < source.length; h++){
			if(!inArray(foltot,source[h])) {
				writeToFile("Error: Result " + (h+1) + " in source is not in any follow-ups! ");
			}
		}
		if (document.getElementById('nondup').checked) {
			if (foltot.length != source.length) {
				writeToFile("Error: Follow-ups do not complete source: More follow-up results than source! ");
			}
		}
		for(var i = 0; i < followup.length; i++) {
			for(var j = 0; j < followup[i].length; j++) {
				if(!inArray(source,followup[i][j])) {
					writeToFile("Error: Result " + (j+1) + " in follow-up " + i + " is not in source!");
				}
			}
		}
	}
	else if (relation == 'difference') { 
	// followup is equivalent to source except for a difference set
		var d = document.getElementById("diffSet").value;
		var dArr = d.split(",");
		for(var i = 0; i < followup.length; i++) {
			for(var j = 0; j < followup[i].length; j++) {
				if(!inArray(source,followup[i][j])) {
					if(!inArray(dArr,followup[i][j])) {
						writeToFile("Error: Result " + (j+1) + " in follow-up " + i + " is not in source or difference!");
					}
				}
			}
		}
	}
	else {
	// load relation dictionary
		var RELNames = myStorage.getItem("relNames");
		RELNames = JSON.parse(RELNames);
		// find the selected relation  and execute the code stored.
		for (var i = 0; i < RELNames.length; i++) {
			if (relation == RELNames[i])
			{
				var relObj = myStorage.getItem(RELNames[i]);
				relObj = JSON.parse(relObj);
				try {
					eval(relObj.resultcode);
				}
				catch (err) {
					errors = "Error in relation code: " + err;
				}
			}
		}
	}
		
	if (errors == "") {
		// No errors!
		writeToFile("No errors were detected!");
	}
}

function inArray(arr, val) {
	for(var i=0; i < arr.length; i++) {
		if (arr[i] == val) {
			return true;
		}
	}
	return false;
}

// If you wish to export your results, modify this function.
function writeToFile(stuff)
{
	errors += stuff + '<br/>';
}