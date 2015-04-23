/**
 * Sends a GET request for the workspace id of the company
 *
 * @param COMPANY_WORKSPACE {String} - The name of the company as its stored in Asana
 * @return workspace_id {Integer}
 **/
function getCompanyId(LOCAL_COMPANY_WORKSPACE)


/**
 * Gets the json object containing all of the employees for the company
 *
 * return employees {JSON}
 **/
function getEmployeeJSON(COMPANY_WORKSPACE_ID)

/**
 * Creates an object that holds all of the employees, using the JSON data.
 * Just to make getting ids based on names easier.
 *
 * return COMPANY_EMPLOYEES_LIST {Array} - List of employee objects
 **/
function makeEmployeeList(COMPANY_EMPLOYEES_JSON)

/**
 * Uses the employee list to populate an input field
 **/
function populateEmployeeCheckBoxes(COMPANY_EMPLOYEES_LIST)

/**
 * Gets all of the employees checked for the assignment
 *
 * @return employees {Array} - List of employee id numbers
 **/
function getAssignees()

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
function assignTask(assignee_name, assignee_id, assignee_email,status, task_name, task_notes, due_date, COMPANY_WORKSPACE_ID)

