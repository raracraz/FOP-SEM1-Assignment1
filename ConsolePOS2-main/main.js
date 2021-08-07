const { menuitems } = require("./offerings");
const readline = require("readline");
var orderPrice = 0;
var currentOrder = []
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function MenuSelection() {

    for (i = 0; i < menuitems.length; i++) {
        console.log(`${i} - ${menuitems[i].name}`);
    }

    rl.question(`What would you like to order [0 - 2]? \n>>>> `, (category) => {
        if (parseInt(category) < menuitems.length) {
            ItemSelection(category)
        } else {

            console.error('\x1b[31mplease enter only 0 -', menuitems.length - 1, '\n>>>> ');
            MenuSelection()
        }
    })
}

function ItemSelection(category) {

    for (j = 0; j < menuitems[parseInt(category)].items.length; j++) {
        console.log(`${j} - ${menuitems[parseInt(category)].items[j].name}`);
    }

    rl.question(`Which ${menuitems[category].name} would you like to order ? \n>>>> `, (item) => {
        if (parseInt(item) < menuitems[parseInt(category)].items.length) {
            orderPrice = menuitems[parseInt(category)].items[parseInt(item)].price;
            OptionSelection(category, item)
        } else {
            ItemSelection(category)
            console.error('\x1b[31mInvalid Input, Please try again.' + '\n>>>> ');
        }
    })
}

function OptionSelection(category, item) {

    for (k = 0; k < menuitems[category].items[item].options.length; k++) {
        console.log(
            `${k} - ${menuitems[category].items[item].options[k].name}`
        );
    }

    rl.question('What is your selection \n>>>> ', (answer) => {
        if (parseInt(answer) < menuitems[category].items[item].options.length) {
            orderPrice = orderPrice + menuitems[category].items[item].options[parseInt(answer)].addprice;
            console.log('You have ordered ', menuitems[parseInt(category)].items[parseInt(item)].name, '/', menuitems[category].items[item].options[parseInt(answer)].name, '/ Price: SGD ', orderPrice);
            //ask the user if the order is all they want or they want to add items into the order
            currentOrder.push(`${menuitems[parseInt(category)].name}, ${menuitems[parseInt(category)].items[parseInt(item)].name}, ${menuitems[category].items[item].options[parseInt(answer)].name}, Price: SGD ${orderPrice}`);

            rl.question('Is that all (y/n)? \n>>>> ', (answer) => {
                if (answer == 'y') {
                    for (listOrder = 0; listOrder < currentOrder.length; listOrder++) {
                        console.log('---->', currentOrder[listOrder]);
                    }
                    console.log('Your order was added to the Cart. Have a great day!')
                    rl.close();
                } else {
                    console.log('Ok, Redirecting you to the menu!')
                    MenuSelection()
                }
            })

        } else {
            OptionSelection(category, item)
        }
    })
}

MenuSelection()