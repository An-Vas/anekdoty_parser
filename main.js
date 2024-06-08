const { updateDb } = require('./db');
const { parse } = require('./parser');

const root = 'https://anekdoty.ru/';

async function main() {
    try {
        parse(root, (result)=>{ updateDb(result) })

    } catch (error) {
        console.error(error);

    }
}

main();
