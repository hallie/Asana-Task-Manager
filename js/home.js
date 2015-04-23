/*global $, console, alert*/

var API_KEY = '***INSERT API KEY***',
	
	ASANA_REQUEST = 'https://app.asana.com/api/1.0',
	
	//The default is just id. Here you can include the names and emails
	EMPLOYEES_REQUEST = '?opt_fields=name,email',
	//Task url
	TASK_REQUEST = '/tasks',
	//Workspace url
	WORKSPACE_REQUEST = '/workspaces',
	//Users url
	USER_REQUEST = '/users',
	//The workspace name
	COMPANY_WORKSPACE = '***INSERT WORKSPACE NAME****';

/**
 * Sends a GET request for the workspace id of the company
 *
 * @param COMPANY_WORKSPACE {String} - The name of the company as its stored in Asana
 * @return workspace_id {Integer}
 **/
function getCompanyId(LOCAL_COMPANY_WORKSPACE) {
	'use strict';
	var workspace_id;
	$.ajax({
		url : ASANA_REQUEST + WORKSPACE_REQUEST,
		dataType : 'json',
		type: 'GET',
		//This is how the API key gets sent, rather than through the url
		beforeSend : function (xhr) {
			xhr.setRequestHeader('Authorization',
								 //btoa is a bin64 decoder
								 'Basic ' + window.btoa(API_KEY + ":"));
		},
		//This was important for setting the workspace_id
		async: false
	}).done(function (response) {
		var response_data = response.data,
			key;
		//Iterates through all of the companies listed in the response
		for (key in response_data) {
			if (response_data.hasOwnProperty(key)) {
				//If it comes accross the one with the name you're looking for
				//  saves the id to workspace_id
				if (response_data[key].name === LOCAL_COMPANY_WORKSPACE) {
					workspace_id = response_data[key].id;
				}
			}
		}
	});
	//console.log(resp);
	return workspace_id;
}


/**
 * Gets the json object containing all of the employees for the company
 *
 * return employees {JSON}
 **/
function getEmployeeJSON(COMPANY_WORKSPACE_ID) {
	'use strict';
	var employees,
		COMPANY_ID_STRING = '/' + COMPANY_WORKSPACE_ID.toString();
	$.ajax({
		url : ASANA_REQUEST + WORKSPACE_REQUEST + COMPANY_ID_STRING +
			USER_REQUEST + EMPLOYEES_REQUEST,
		dataType : 'json',
		type: 'GET',
		beforeSend : function (xhr) {
			xhr.setRequestHeader('Authorization',
								 //btoa is a bin64 decoder
								 'Basic ' + window.btoa(API_KEY + ":"));
		},
		//This was important
		async: false
	}).done(function (response) {
		//console.log(response.data);
		employees = response.data;
	});
	
	return employees;
}

/**
 * Creates an object that holds all of the employees, using the JSON data.
 * Just to make getting ids based on names easier.
 *
 * return COMPANY_EMPLOYEES_LIST {Array} - List of employee objects
 **/
function makeEmployeeList(COMPANY_EMPLOYEES_JSON) {
	'use strict';
	var key,
		COMPANY_EMPLOYEES_LIST = {};
	for (key in COMPANY_EMPLOYEES_JSON) {
		if (COMPANY_EMPLOYEES_JSON.hasOwnProperty(key)) {
			
			//console.log(COMPANY_EMPLOYEES_JSON[key].id);
			//console.log(COMPANY_EMPLOYEES_JSON[key].name);
			//console.log(COMPANY_EMPLOYEES_JSON[key].email);
			
			//Sets the key to the employee id to avoid confusion
			COMPANY_EMPLOYEES_LIST[COMPANY_EMPLOYEES_JSON[key].id] = {
				'name': COMPANY_EMPLOYEES_JSON[key].name,
				'email': COMPANY_EMPLOYEES_JSON[key].email
			};
		}
	}
	
	//console.log(COMPANY_EMPLOYEES_LIST);
	return COMPANY_EMPLOYEES_LIST;
}

/**
 * Uses the employee list to populate an input field
 **/
function populateEmployeeCheckBoxes(COMPANY_EMPLOYEES_LIST) {
	'use strict';
	var key, name, id;
	
	//console.log(COMPANY_EMPLOYEES_LIST);
	for (key in COMPANY_EMPLOYEES_LIST) {
		if (COMPANY_EMPLOYEES_LIST.hasOwnProperty(key)) {
			id = key;
			name = COMPANY_EMPLOYEES_LIST[key].name;
			$("#employee-names").append(
				//Uses the employee's id as the id for the input field
				"<input type='checkbox' " + "id=" + id + " name='employee'>" + name + "</input><br>"
			);
		}
	}
}

/**
 * Gets all of the employees checked for the assignment
 *
 * @return employees {Array} - List of employee id numbers
 **/
function getAssignees() {
	'use strict';
	//Initializes an empty list of employees for the task
	var employees = [],
		id;
	//If the input button is checked, get the id, and add it to the list
	$("input[name=employee]:checked").each(function () {
		id = $(this).attr('id');
		employees.push($(this).attr('id'));
	});
	//console.log(employees);
	//returns the list of employees that are assigned the task
	return employees;
}

/**
 * Assigns the task using all of the form values 
 *
 * @param assignee_name {String}
 * @param assignee_id {Integer}
 * @param assignee_email {String}
 * @param status {String}
 * @param task_name {String [opt='New Task']}
 * @param task_notes {String [opt='']}
 * @param due_date {String [opt=null]}
 * @param COMPANY_WORKSPACE_ID {Integer}
 **/
function assignTask(assignee_name, assignee_id, assignee_email,
					  status, task_name, task_notes,
					 due_date, COMPANY_WORKSPACE_ID
					) {
	'use strict';
	//Turns the JSON into a string to send
	var request_data = JSON.stringify({
			data: {
				assignee: {
					id: assignee_id,
					name: assignee_name
				},
				email: assignee_email,
				status: 'inbox',
				completed: false,
				name: task_name,
				notes: task_notes,
				due_on: due_date,
				workspace: COMPANY_WORKSPACE_ID
			}
	});
	
	$.ajax({
		url: ASANA_REQUEST + TASK_REQUEST,	
		contentType: 'application/json',
		type: 'POST',
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(API_KEY + ":"));		
			},
		data: request_data,
		async: false
	});
}


$(document).ready(function () {
	'use strict';
	
	if (API_KEY != '***INSERT API KEY***') {
		var COMPANY_WORKSPACE_ID = getCompanyId(COMPANY_WORKSPACE),
			COMPANY_EMPLOYEES_JSON = getEmployeeJSON(COMPANY_WORKSPACE_ID),
			COMPANY_EMPLOYEES_LIST = makeEmployeeList(COMPANY_EMPLOYEES_JSON);

		//console.log(COMPANY_WORKSPACE_ID);
		//console.log(COMPANY_EMPLOYEES_JSON);
		//console.log(COMPANY_EMPLOYEES_LIST);
		populateEmployeeCheckBoxes(COMPANY_EMPLOYEES_LIST);

		$("#task-assigned").submit(function (event) {
			event.preventDefault();

			var assignee_name, assignee_id, assignee_email,
				due_date, due_time, status,
				task_name, task_notes,
				assignees = getAssignees(),
				key;

			//Will let you know if you forget to assign the task to someone
			if (assignees.length === 0) {
				alert('Please assign the task to someone!');
			}

			for (key in assignees) {
				if (assignees.hasOwnProperty(key)) {

					assignee_id = assignees[key];
					assignee_name = COMPANY_EMPLOYEES_LIST[assignees[key]].name;
					assignee_email = COMPANY_EMPLOYEES_LIST[assignees[key]].email;

					//Sets the default for these values to null
					due_date = $("#due-date").val() || null;
					due_time = $("#due-time").val() || null;

					status = $('input[name=status]:checked').val() || 'inbox';

					if (status == 'today') {
						var today = new Date(),
							day = today.getDate(),
							month = today.getMonth() + 1,
							year = (today.getFullYear()).toString();

						if (month < 10) {
							month = '0' + month.toString();
						} else {
							month = month.toString();
						}

						if (day < 10) {
							day = '0' + day.toString();
						} else {
							day = day.toString();
						}

						//Changes the due date to today
						due_date = year + '-' + month + '-' + day;
					}

					//Sets the default name to 'New Task'
					task_name = $("#assignment-name").val() || 'New Task';
					//Sets the default note to an empty string
					task_notes = $("#assignment-notes").val() || '';

					if (due_time) { 
						task_name = task_name + ' - Due at: ' + due_time;
					}

					assignTask(assignee_name, assignee_id, assignee_email, status,
						 task_name, task_notes, due_date, COMPANY_WORKSPACE_ID);

					//console.log(assignee_id);
					//console.log(assignee_email);
					//console.log(assignee_name);
					//console.log(due_date);
					//console.log(task_name);
					//console.log(task_notes);
					//console.log(status);

				}
			}
		});
	} else {
		alert("Please Enter a valid API Key! Also, don't forget the workspace!");
	}
});