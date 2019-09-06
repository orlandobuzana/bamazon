require("dotenv").config();
let mysql = require("mysql");
let inquirer = require("inquirer");
let keys = require("./keys.js");

// create the connection information for the sql database
let connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",//keys.mysqlLogin.user,
  // Your password
  password: "Itapeva1998",//keys.mysqlLogin.password,
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(err => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  // run the start function after the connection is made to prompt the user
  displayProducts();
  // connection.end();
});


const displayProducts = () => {
  connection.query("SELECT * FROM products", (err, res) => {
    if (err) throw err;
    console.log('=============================');
    console.log(`List of available products:`);
    console.log('=============================');
    res.forEach(r => {
      console.log(`ID: ${r.item_id} || Name:${r.product_name} || Category: ${r.department_name} || Price: ${r.price} || Quantity ${r.stock_quantity} `);
    })
    console.log('=============================');
    // buyProducts(res);
    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message: "What the ID of the product would you like to buy?",
          validate: value => {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "units",
          type: "input",
          message: "How many units of the product would you like to buy?",
          validate: value => {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(answer => {
        let chosenItemStock = res[answer.id - 1].stock_quantity;
        console.log('=============================\n')
        console.log(`We have in stock ${chosenItemStock} items.`);

        if (chosenItemStock > answer.units) {
          console.log('=============================\n')
          console.log(`Total purchase amount for ${answer.units} items of ${res[answer.id - 1].product_name} is ${answer.units * res[answer.id - 1].price} dollars!`);
          console.log('\n=============================')
          connection.query("UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: chosenItemStock - answer.units
              },
              {
                item_id: answer.id
              }
            ],
            (err, res) => {
              if (err) throw err;
              // console.log(res.affectedRows + " product quantity updated!\n");
            }
            
          );
        } else {
          console.log('=============================\n')
          console.log("Insufficient quantity!");
        };
        // when a customer purchases anything from the store, 
        //the price of the product multiplied by the quantity purchased is added to the product's product_sales column.
        connection.query("UPDATE products SET ? WHERE ?",
          [
            {
              product_sales: res[answer.id - 1].product_sales + answer.units * res[answer.id - 1].price
            },
            {
              item_id: answer.id
            }
          ],
          (err, res) => {
            if (err) throw err;
            connection.end();
          })
      });
  });
};
