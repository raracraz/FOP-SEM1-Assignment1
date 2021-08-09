const { menuitems } = require("./offerings");
const readline = require("readline");
var orderPrice = 0;
const currentTime = require("./timestampFnc.js");
const shoppingCart = require("./shoppingCartFncs.js");
const tab = ('\t')
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./ConsolePOS2-main/consolepos.db");
var currentOrder = []
const uuid = require("uuid");
trxid = uuid.v4();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function Main() {
    rl.question(`1. View Menu\n2. View Receipts\n0. Quit\nWelcome to NiceMeal Restaurant! \n>>>> `, (optionFirst) => {
        switch (parseInt(optionFirst)) {
            case (1):
                function MenuSelection() {

                    for (i = 0; i < menuitems.length; i++) {
                        console.log(`${tab}${i+1} - ${menuitems[i].name}`);
                    }

                    rl.question(`${tab}What would you like to order [1 - 3]? \n>>>> `, (category) => {
                        realCategory = parseInt(category) - 1
                        if (parseInt(realCategory) < menuitems.length) {
                            ItemSelection(realCategory)
                        } else {

                            console.error('please enter only 0 -', menuitems.length - 1, '\n>>>> ');
                            MenuSelection()
                        }
                    })
                }

                function ItemSelection(category) {

                    for (j = 0; j < menuitems[parseInt(category)].items.length; j++) {
                        console.log(`${tab}${tab}${j +1} - ${menuitems[parseInt(category)].items[j].name}`);
                    }
                    rl.question(`${tab}${tab}Which ${menuitems[category].name} would you like to order ? \n>>>> `, (item) => {
                        realItem = parseInt(item) - 1
                        if (parseInt(realItem) < menuitems[parseInt(category)].items.length) {
                            orderPrice = menuitems[parseInt(category)].items[parseInt(realItem)].price;
                            OptionSelection(category, realItem)
                        } else {
                            ItemSelection(category)
                            console.error('\nInvalid Input, Please try again.' + '\n>>>> ');
                        }
                    })
                }

                function OptionSelection(category, item) {

                    for (k = 0; k < menuitems[category].items[item].options.length; k++) {
                        console.log(
                            `${tab}${tab}${k +1} - ${menuitems[category].items[item].options[k].name}`
                        );
                    }

                    rl.question(`${tab}${tab}What is your selection? \n>>>> `, (answer) => {
                        realAnswer = parseInt(answer) - 1
                        rl.question(`Enter Order Qty: \n>>>> `, (Qty) => {
                            if (Qty > 1000 && isNaN(Qty)) {
                                console.log(`Sorry, your order was invalid, please try again.`)
                                OptionSelection(category, item)
                            } else {
                                if (parseInt(realAnswer) < menuitems[category].items[item].options.length) {
                                    orderPrice = orderPrice + menuitems[category].items[item].options[parseInt(realAnswer)].addprice;
                                    console.log('You have ordered ', 'Qty:' +
                                        Qty, menuitems[parseInt(category)].items[parseInt(item)].name, '/', menuitems[category].items[item].options[parseInt(realAnswer)].name, '/ Price: SGD ', parseInt(orderPrice * Qty).toFixed(2));
                                    //ask the user if the order is all they want or they want to add items into the order
                                    //pushes the order into a array to show at the end
                                    currentOrder.push(`Qty:${Qty}, ${menuitems[parseInt(category)].name}, ${menuitems[parseInt(category)].items[parseInt(item)].name}, ${menuitems[category].items[item].options[parseInt(realAnswer)].name}, Price: SGD , ${parseInt(orderPrice*Qty).toFixed(2)}`);

                                    details = `${menuitems[parseInt(category)].name}/${
                                        menuitems[parseInt(category)].items[parseInt(item)].name
                                    }/${menuitems[category].items[item].options[parseInt(realAnswer)].name}`;
                                    price = orderPrice;
                                    //write order into sqlite database
                                    shoppingCart.add(trxid, details, Qty, price, currentTime.convert(currentTime.get()));

                                    function confirmMenu(answer) {
                                        rl.question('Is that all (y/n)? \n>>>> ', (answer) => {
                                            if (answer == 'y') {
                                                console.log('')
                                                console.log('Your orders are')
                                                console.log('====================================================================================================')
                                                grandTotal = 0
                                                for (allOrders = 0; allOrders < currentOrder.length; allOrders++) {
                                                    orderDetails = currentOrder[allOrders].split(",");
                                                    grandTotal += parseFloat(orderDetails[5])
                                                    console.log(`${allOrders +1} - ${orderDetails[0]} /${orderDetails[1]} /${orderDetails[2]} /${orderDetails[3]} .......... (${orderDetails[4]}$${orderDetails[5]})`);
                                                }
                                                console.log('====================================================================================================')
                                                console.log(`GRAND Total : $${grandTotal.toFixed(2)}\n`)
                                                rl.question(`CONFIRM ORDER\n[A] to add, [D] to delete, [C] to confirm\n>>>> `, (orderConfirm) => {


                                                        if (orderConfirm == `a` || orderConfirm == `A`) {
                                                            console.log(`Redirecting you to the main menu`)
                                                            MenuSelection()
                                                        } else if (orderConfirm == `d` || orderConfirm == `D`) {
                                                            trxid = []
                                                            trxid.push(element.TransactionID, element.Details)
                                                            rl.question(`Which item do you want to remove?`, (id) => {
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


                                                            })
                                                        } else if (orderConfirm == `c` || orderConfirm == `C`) {
                                                            console.log(`Thank you, Order has been received.`)
                                                            Main()
                                                        } else {
                                                            console.log(`Invalid input, Please try again.\n>>>> `)
                                                            confirmMenu(answer)
                                                        }
                                                    })
                                                    // rl.question(`Which receipt do you want to see`)

                                                Main()
                                            } else {
                                                console.log('Ok, Redirecting you to the menu!')
                                                MenuSelection()
                                            }
                                        })

                                    }
                                } else {
                                    console.log('\nInvalid Input, Please try again.' + '\n>>>> ')
                                    OptionSelection(category, item)
                                }
                                confirmMenu()
                            }
                        })
                    })
                }

                MenuSelection()
                break
            case (2):
                function getReceipt(TransactionIDArr) {
                    TransactionIDArr = []
                    count = 0
                    shoppingCart.getTrxID((data) => {
                        data.forEach(element => {
                            // IndexArr = []
                            TransactionIDArr.push(element.TransactionID)
                                //  IndexArr.push(element.ID)
                            console.log(`[${count}] - ${element.TransactionID} - ${currentTime.convert(element.OrderTime)}`)
                            count += 1

                        });
                        rl.question('Which Receipt you want to view ? \n(Your receipt should be the lastest entry) (Enter -1 to quit) \n>>>> ', (answer) => {
                            if (answer <= TransactionIDArr.length && !isNaN(answer)) {
                                shoppingCart.get(TransactionIDArr[answer], (detailsData) => {
                                    console.log(detailsData)
                                })
                                rl.close()
                            } else {
                                console.log(`Please enter a number from 0 - ${TransactionIDArr.length-1}.`)
                                getReceipt()
                            }
                        })
                    });
                }
                getReceipt()
                break
            case (0):
                console.log(`Goodbye, Have a nice day...`)
                rl.close()
                break
            default:
                console.log(`Please enter only [0 - 3]`)
                Main()
        }

    })

}

Main()