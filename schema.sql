DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY(id)
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id VARCHAR(30),
    manager_id INT,
    PRIMARY KEY (id)
);

INSERT INTO department(name)
VALUES ("Finance"), ("Tech"),("Legal"),("Management");



INSERT INTO role( title, salary, department_id)
VALUES ("Director", 500000,1), ("Operations Manager", 40000,2),("Web Dev",150000,3),("Lawyer ",200000,4), ("Digital Tech",4000000,5);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES ("Kiros", "Siba", "Director", null), ("Samuel", "Kiros"," Digital Tech", 1),("Atsede", "Kiros"," Web Dev", 2),("Fana", "Abraha","Operations Manager", 3),("Atran", "Tadesse","Lawyer", 4);


