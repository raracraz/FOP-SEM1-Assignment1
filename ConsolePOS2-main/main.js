const { menuitems } = require("./offerings");
const readline = require("readline");
var orderPrice = 0;
const currentTime = require("./timestampFnc.js");
const shoppingCart = require("./shoppingCart.js");
const tab = ('\t')
var currentOrder = []
const uuid = require("uuid");
trxid = uuid.v4();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function Main() {
    rl.question(`1. View Menu\n2. View Cart\n0. Quit\nWelcome to NiceMeal Restaurant! \n>>>> `, (optionFirst) => {
        switch (parseInt(optionFirst)) {
            case (1):
                function MenuSelection() {

                    for (i = 0; i < menuitems.length; i++) {
                        console.log(`${tab}${i+1} - ${menuitems[i].name}`);
                    }

                    rl.question(`${tab}What would you like to order [1 - 3]? \n>>>> `, (category) => {
                        realAnswer = parseInt(category) - 1
                        if (parseInt(realAnswer) < menuitems.length) {
                            ItemSelection(realAnswer)
                        } else {

                            console.error('please enter only 0 -', menuitems.length - 1, '\n>>>> ');
                            MenuSelection()
                        }
                    })
                }

                function ItemSelection(category) {

                    for (j = 0; j < menuitems[parseInt(category)].items.length; j++) {
                        console.log(`${tab}${tab}${j} - ${menuitems[parseInt(category)].items[j].name}`);
                    }
                    rl.question(`${tab}${tab}Which ${menuitems[category].name} would you like to order ? \n>>>> `, (item) => {

                        if (parseInt(item) < menuitems[parseInt(category)].items.length) {
                            orderPrice = menuitems[parseInt(category)].items[parseInt(item)].price;
                            OptionSelection(category, item)
                        } else {
                            ItemSelection(category)
                            console.error('\nInvalid Input, Please try again.' + '\n>>>> ');
                        }
                    })
                }

                function OptionSelection(category, item) {

                    for (k = 0; k < menuitems[category].items[item].options.length; k++) {
                        console.log(
                            `${tab}${tab}${k} - ${menuitems[category].items[item].options[k].name}`
                        );
                    }

                    rl.question(`${tab}${tab}What is your selection? \n>>>> `, (answer) => {
                        realAnswer = parseInt(answer) - 1
                        rl.question(`Enter Order Qty: \n>>>>`, (Qty) => {
                            if (parseInt(Qty) > 1000 || isNaN(Qty)) {
                                console.log(`Sorry, your order was invalid, please try again.`)
                                OptionSelection(category, item)
                            } else {
                                if (parseInt(answer) < menuitems[category].items[item].options.length) {
                                    orderPrice = orderPrice + menuitems[category].items[item].options[parseInt(answer)].addprice;
                                    console.log('You have ordered ', 'Qty:' +
                                        Qty, menuitems[parseInt(category)].items[parseInt(item)].name, '/', menuitems[category].items[item].options[parseInt(answer)].name, '/ Price: SGD ', parseInt(orderPrice * Qty).toFixed(2));
                                    //ask the user if the order is all they want or they want to add items into the order
                                    //pushes the order into a array to show at the end
                                    currentOrder.push(`Qty:${Qty}, ${menuitems[parseInt(category)].name}, ${menuitems[parseInt(category)].items[parseInt(item)].name}, ${menuitems[category].items[item].options[parseInt(answer)].name}, Price: SGD , ${parseInt(orderPrice*Qty).toFixed(2)}`);

                                    details = `${menuitems[parseInt(category)].name}/${menuitems[parseInt(realAnswer)].items[parseInt(item)].name}/${menuitems[category].items[item].options[parseInt(realAnswer)].name}`;
                                    price = orderPrice;
                                    //write order into sqlite database
                                    shoppingCart.add(trxid, details, Qty, price, currentTime.get());
                                    rl.question('Is that all (y/n)? \n>>>> ', (answer) => {
                                        if (answer == 'y') {
                                            console.log('')
                                            console.log('Your orders are')
                                            console.log('=====================================================================================')
                                            grandTotal = 0
                                            for (allOrders = 0; allOrders < currentOrder.length; allOrders++) {
                                                orderDetails = currentOrder[allOrders].split(",");
                                                grandTotal += parseFloat(orderDetails[5])
                                                console.log(`${allOrders +1} - ${orderDetails[0]} /${orderDetails[1]} /${orderDetails[2]} /${orderDetails[3]} .......... (${orderDetails[4]}$${orderDetails[5]})`);
                                            }
                                            console.log('=====================================================================================')
                                            console.log(`GRAND Total : $${grandTotal.toFixed(2)}\n`)

                                            // rl.question(`Which receipt do you want to see`)

                                            rl.close();
                                        } else {
                                            console.log('Ok, Redirecting you to the menu!')
                                            MenuSelection()
                                        }
                                    })

                                } else {
                                    console.log('\nInvalid Input, Please try again.' + '\n>>>> ')
                                    OptionSelection(category, item)
                                }
                                /*const db = new sqlite3.Database('./ConsolePOS2-main/consolepos.db');
                        // construct the insert statement with multiple placeholders
                        // based on the number of rows
                        db.serialize(() => {
        
                            db.run("INSERT INTO Orders (Name) VALUES " + menuitems[parseInt(category)].name);
                            db.run("INSERT INTO Orders (Options) VALUES" + menuitems[parseInt(category)].items[parseInt(item)].name + menuitems[category].items[item].options[parseInt(answer)].name);
                            db.run("INSERT INTO Orders (Price) VALUES" + 'Price: SGD' + orderPrice);
                        });
        
                        // close the database connection
                        db.close();*/
                            }
                        })
                    })
                }

                MenuSelection()
                break
            case (2):
                shoppingCart.getTrxID((data) => {
                    data.forEach(element => {
                        TransactionIDArr = []
                        IndexArr = []
                        TransactionIDArr.push(element.TransactionID)
                        IndexArr.push(element.ID)
                        shoppingCart.get(TransactionIDArr, (id) => {
                            console.log(id.Details);
                        });
                    });
                });




                rl.close()
                break
            case (0):
                console.log(`Goodbye, Have a nice day...`)
                rl.close()
                break
            default:
                console.log(`Please enter only [0 - 2]`)
                Main()
        }

    })

}

Main()