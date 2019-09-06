DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon; 

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price DECIMAL (10, 2) NOT NULL,
  stock_quantity INT (10) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("T-Shirt", "Men's clothing", 12.00, 25), ("Dress", "Women's Clothing", 24.00, 50),  ("Ring", "Jewelry", 1000.00, 25);

SELECT * FROM products