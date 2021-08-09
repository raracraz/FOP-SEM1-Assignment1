const shoppingCart = require("./shoppingCartFncs.js");
const currentTime = require("./timestampFnc.js");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// THIS IS A RECEIPT FUNCTION WHERE U CAN SEE ALL YOUR PAST ORDERS
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