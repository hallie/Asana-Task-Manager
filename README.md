#Asana Task Manager
##Creates and assigns tasks to people in your workspace

###getCompanyId
 Sends a GET request for the workspace id of the company
 * @param LOCAL_COMPANY_WORKSPACE {String} - The name of the company as its stored in Asana
 * @return workspace_id {Integer}

###getEmployeeJSON
Gets the json object containing all of the employees for the company
 * @param COMPANY_WORKSPACE_ID {Integer}
 * @return employees {JSON}

###makeEmployeeList
Creates an object that holds all of the employees, using the JSON data.
Just to make getting ids based on names easier.
 * @param COMPANY_EMPLOYEES_JSON {JSON}
 * @return COMPANY_EMPLOYEES_LIST {Array} - List of employee objects

###populateEmployeeCheckBoxes
Uses the employee list to populate an input field
* @param COMPANY_EMPLOYEES_LIST {Array}

###getAssignees
Gets all of the employees checked for the assignment
 * @return employees {Array} - List of employee id numbers

###assignTask
Assigns the task using all of the form values 
 * @param assignee_name {String}
 * @param assignee_id {Integer}
 * @param assignee_email {String}
 * @param status {String [opt='inbox']}
 * @param task_name {String [opt='New Task']}
 * @param task_notes {String [opt='']}
 * @param due_date {String [opt=null]}
 * @param COMPANY_WORKSPACE_ID {Integer}

