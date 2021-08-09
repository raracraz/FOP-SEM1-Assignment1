//exports.shoppingCart.init = function () {
//    var cart = []
//}

//exports.shoppingCart.addItem = function (category, item) {
//    cart.addItem(category, item)
//   return cart
//}

/*const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./ConsolePOS2-main/consolepos.db');
// open the database

db.serialize(() => {
    db.each(`SELECT Name, ID FROM MenuItems`, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(row.ID + "\t" + row.Name);
    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});

function get(id) {
    db.each("SELECT * ")
}*/
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./ConsolePOS2-main/consolepos.db");
const queries = [];

function get(id, callback) {
    db.each("SELECT * FROM Orders WHERE TransactionID = ?", [id],
        (err, row) => {
            if (err) {
                callback([]);
            } else {
                queries.push(row);
            }
        },
        () => {
            callback(queries);
        }
    );
}

function add(trxid, details, qty, price, ordertime) {
    db.run(
        `INSERT into Orders(TransactionID,Details,Qty,Price,OrderTime) VALUES (?,?,?,?,?)`, [trxid, details, qty, price, ordertime],
        (err) => {
            if (err) {
                console.log(`error writing to db ${err}`);
                Success = false;
            } else {
                Success = true;
            }
            return Success;
        }
    );
}

function del(id) {
    db.run(`DELETE FROM Orders WHERE TransactionID = (?)`, [id], (err) => {
        if (err) {
            console.log(`error deleting from db ${err}`);
            Success = false;
        } else {
            console.log(`Deleted [${id}]`);
            Success = true;
        }
        return Success;
    });
}

function del(id) {
    db.run(`DELETE FROM Orders WHERE TransactionID = (?)`, [id], (err) => {
        if (err) {
            console.log(`error deleting from db ${err}`);
            Success = false;
        } else {
            console.log(`Deleted [${id}]`);
            Success = true;
        }
        return Success;
    });
}

function getTrxID(callback) {
    db.each("SELECT ID, TransactionID, OrderTime FROM Orders GROUP BY TransactionID ORDER BY OrderTime",
        (err, row) => {
            if (err) {
                callback([]);
            } else {
                queries.push(row);
                db.each("SELECT * FROM Orders WHERE TransactionID = ?")
            }
        },
        () => {
            callback(queries);
        }
    );

}

module.exports = {get, add, del, getTrxID };