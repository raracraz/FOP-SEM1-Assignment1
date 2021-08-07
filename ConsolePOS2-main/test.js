const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function questiona() {
    var pass = false
    rl.question('Type in a number>', (answer) => {
        if (!isNaN(answer)) {
            console.log('You typed: ', answer)
            rl.close()
        } else {
            console.log('You did not type a number')
            questiona()
        }
    })
}

questiona()
