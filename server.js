const inquirer = require('inquirer');
const mysql = require('mysql2');
 require('console.table');



//connection information for the sql database

const connection = mysql.createConnection({
    host: "localhost",
    // username
    user: "root",
    //password
    password: '',
    database: "employee_db"


});

connection.connect(function(err){
    if(err) throw err;
    console.log("Succesfully connected to the database!");
    start();
});

function start(){
    inquirer.prompt([
        {
            type: " List",
            name: "choice",
            message: " What would you like to do?",
            choices:[
                'View',
                'Add ',
                'Update',
                'Remove',
                'Exit',
            ]
        }

    ]).then((res)=>{
        switch(res.choice){
            case "View":
                view();
                break;
            case "Add":
                 add();
                 break;
            case "Update":
                updateEmployee();
                 break;
            case "Remove":
                removeEmployee();
                 break;
            case 'Exit':
                console.log(" So long");
                break;
                 
        }
    });
}

function view(){
    inquirer.prompt([
        {
            type: "List",
            name:"view",
            message: " What would like to view?",
            choices: ["All employees","View by department"," View by role"]
        }
    ]).then((res)=>{
        switch(res.view){
            case "All employees":
                viewAllEmployees();
                break;
            case " View by department":
                viewByDepartment();
                break;
            case " View by role":
                viewByRole();
                default:
                 console.log("default");
        }
    });

}
function viewAllEmployees(){
    connection.query("SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, employee.role_id AS Role, role.salary AS Salary,manager.last_name AS Manager,department.name AS Department FROM employee employee LEFT JOIN employee manager ON employee.manager_id=manager.id LEFT JOIN role role ON employee.role_id=role.title LEFT JOIN department department ON role.department_id = department.id",function(err,results){
        if(err)throw err;
        console.table(results);
        start();
    });   

}
function viewByDepartment(){
    
    connection.query("SELECT *FROM department", function(err,results){
        if(err)throw err;
        
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function(){
                    let choiceArr= [];
                    for (i=0; i<results.length; i++){
                        choiceArr.push(results[i].name);   
                    }
                    return choiceArr;
                },
                message: "Select Department"

            }
        ]).then((answer)=>{
            connection.query(
                "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, employee.role_id AS Role, role.salary AS Salary, manager.last_name AS Manager, department.name AS Department FROM employee employee LEFT JOIN employee manager ON employee.manager_id =manager.id LEFT JOIN role role ON employee.role_id =role.title LEFT JOIN department department ON role.department_id = department.id WHERE department.name =?",[answer.choice],function(err,results)
                {
                    if(err) throw err;
                    console.table(results);
                    start();

                }

            )
        });
    });

}
function viewByRole(){
    connection.query("SELECT title FROM role", function(err,results){
        if(err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: function(){
                    let options= [];
                    for (i=0; i < results.length; i++){
                        options.push(results[i].title);
                    }
                    return options;
                },
                message: "Select Role"
            }
        ]).then(function(response){
            
            console.log(response.choice);
            connection.query(
                "SELECT employee.id AS ID, employee.first_name AS First,employee.last_name AS Last,employee.role_id AS Role,role.salary AS Salary,manager.last_name AS Manager, department.name AS Department FROM employee employee LEFT JOIN employee manager ON employee.manager_id = manager.id LEFT JOIN role role ON employee.role_id= role.title LEFT JOIN department department ON role.department_id = department.id WHERE employee.role_id =?",[answer.choice],function(err,results){
                    if(err)throw err;
                    console.table(results);
                    start();
                }

            )
        });
    });

}

function add(){
    inquirer.prompt([
        {
            type: "List",
            name: "add",
            message: " What would you like to add?",
            choices: ["Department", "Employee role", "Employee"]
        }
    ]).then(function(res){
        switch(res.add){
            case "Department":
                addDepartment();
                break;
            case "Employee role":
                addEmployeeRole();
                break;
            case "Employee":
                addEmployee();
                break;
            default:
                console.log("default");
        }
    })
}

function addDepartment(){
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: " What department would you like to add?"
        }
    ]).then(function(answer){
        connection.query(
            "INSERT INTO department VALUES (DEFAULT, ?)",
            [answer.department],
            function(err){
                if(err) throw err;
                console.log(answer.department);
                start();
            }
        )
    })
}

function addEmployeeRole(){
    inquirer.prompt([
        {
            name: "role",
            type: "input",
            message:" Enter role title:"
        },
        {
            name: "salary",
            type: "number",
            message: " Enter salary:",

        },
        {
            name: "department_id",
            type: "number",
            message: "Enter department id",
        }
    ]).then(function(answer){
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: answer.role,
                salary: answer.salary,
                department_id: answer.department_id
            },
            function(err){
                if(err)throw err;
                console.log(answer.role)
                start();
            }
        )
    })
}

function addEmployee(){
    connection.query("SELECT * FROM role", function(err,results){
        if(err)throw err;
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message:" Enter employee first name"
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter employee last name"
            },
            {
                name: 'role',
                type: "list",
                choices: function(){
                    var choiceArr=[];
                    for(i=0; i< results.length;i++){
                        choiceArr.push(results[i].title)
                    }
                    return choiceArr;
                },
                message: "Select title"
            },
            {
                name: "manager",
                type: "number",
                message:"Enter manager ID",
                
            }
           
        ]).then(function(answer){
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role,
                    manager_id: answer.manager
                }
            )
            console.log(answer.firstName)
            start();
        });
    });
}

//  update function set

function updateEmployee(){
    connection.query( "SELECT *FROM employee",
        function(err, results){
            if(err) throw err;
            inquirer.prompt([
                {
                    name: "choice",
                    type: "list",
                    choices: function(){
                        let choiceArr =[]
                        for (i=0; i<results.length;i++)
                        {
                            choiceArr.push(results[i].last_name);
                        }
                        return choiceArr;
                    },
                    message: "select employee to update"
                }
            ]).then(function(answer){
                const chosen= answer.choice;

                connection.query("SELECT*FROM employee",
                function(err,results){
                    if(err)throw err;
                    inquirer.prompt([
                        {
                            name: "role",
                            type: "list",
                            choices: function(){
                               let choiceArr =[];
                                for(i=0; i< results.length; i++){
                                    choiceArr.push(results[i].role_id)
                                }
                                return choiceArr;
                            },
                            message: "Select title"
                        },
                        {
                            name: "manager",
                            type: "number",
                            message: "Enter new manager Id",
                        
                        }
                        
                    ]).then(function(answer){
                        console.log(answer);
                        console.log(chosen);
                        connection.query("UPDATE employee SET ? WHERE last_name=?",
                        [
                            {
                                role_id: answer.role,
                                manager_id: answer.manager
                            },chosen
                        ],
                        ),
                       
                        console.log("Updated!!!");
                        start();

                    });
                })
            })
     })
}