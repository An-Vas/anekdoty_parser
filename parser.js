const axios = require('axios');
const jsdom = require("jsdom");

let jokesArr = []


async function calculateRes(link){
    await axios.get(link.href).then(async response => {
        const dom = new jsdom.JSDOM(response.data);
        const paginatorHolder = dom.window.document.querySelector('.pagination-holder-list');
        const paginatorPages = paginatorHolder.querySelectorAll('li');

        for (let i = 1; i < paginatorPages.length; i++) {
            let curLink = link.href;

            if (i > 1) {
                curLink = link.href + i + "/";
            }

            await axios.get(curLink).then(response => {
                const dom = new jsdom.JSDOM(response.data);
                const contentBlock = dom.window.document.querySelector('.content-block');
                const itemlist = contentBlock.querySelector('.item-list');

                itemlist.childNodes.forEach((item) => {
                    const id = item.getAttribute('id');
                    const pText = item.querySelector('p').textContent;
                    const aTags = item.querySelectorAll('a');
                    const hrefList = [];
                    aTags.forEach((a) => {
                        if (a.getAttribute('href') !== "#")
                            hrefList.push(a.getAttribute('href'));
                    })

                    const likeCounter = item.querySelector('.like-counter').textContent;

                    var joke = {
                        id: id,
                        text: pText,
                        category: link.href,
                        hrefs: hrefList.join(', '),
                        rank: likeCounter
                    }
                    jokesArr.push(joke);
                });
            });
        }
    })
}

async function parse(root, callback){

    let categoryList = "";
    let categoryLinks = "";

    await axios.get(root)
        .then(response => {
            const mainPageHtml = response.data;
            const dom = new jsdom.JSDOM(mainPageHtml);
            const document = dom.window.document;

            categoryList = document.getElementsByClassName("category-list")[0];
            categoryLinks = categoryList.querySelectorAll('li a');

        })

    Promise.all(Object.values(categoryLinks).map((link) => calculateRes(link))).then(() => {
        callback(jokesArr);
        return jokesArr;
    }).catch((err) => {
        console.error('Error:', err);
    });
}

module.exports = { parse };