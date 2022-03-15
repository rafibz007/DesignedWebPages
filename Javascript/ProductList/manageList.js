// FETCHING
async function fetchFiles() {
    let list = document.querySelector('.list');

    const categoryMap = new Map();
    const jsonFiles = [
            {
                "path" : "./static/productsA.json",
                "name" : "ProduktyA"
            },
            {
                "path" : "./static/productsB.json",
                "name" : "ProduktyB"
            },
            {
                "path" : "./static/productsC.json",
                "name" : "ProduktyC"
            }
        ];


    for (pair of jsonFiles){

        await fetch(pair['path'])
            .then(response => response.json())
            .then(data => {

                const allProducts = data[pair['name']];
                for ( let categoryProducts of allProducts ){
                    for (let key in categoryProducts){
                        let values = categoryProducts[key];

                        let products = new Set();
                        for ( product of values ){
                            products.add( product['name'] )
                        }

                        if (!categoryMap.has(key) && products.size > 0){
                            categoryMap.set(key, products);
                        }
                        let productsSet = categoryMap.get(key);
                        if (productsSet != null) {
                            categoryMap.delete(key)
                            categoryMap.set(key, new Set([...productsSet, ...products]));
                        }
                    }
                    
                }
            })
    }

    let index = 1;
    for ( let pair of categoryMap ){
        let category = pair[0];
        let products = pair[1];

        // POSITION
        let position = document.createElement('li');
        position.classList.add('position')

        // CATEGORY
        let header = document.createElement('h1')
        header.classList.add('category')

        let input1 = document.createElement('input')
        input1.type = "checkbox";
        input1.name = "hide";

        let input2 = document.createElement('input')
        input2.type = "checkbox";
        input2.name = "header";
        input2.id = "h" + index;

        let label = document.createElement('label')
        label.setAttribute("for", "h" + index)
        label.innerText = category;

        header.appendChild(input1);
        header.appendChild(input2);
        header.appendChild(label);

        // OL
        let ol = document.createElement('ol')
        ol.classList.add('visible')
        
        // PRODUCTS
        let i=0;
        for (let prod of products) {
            let li = document.createElement('li');
            let input = document.createElement('input')
            input.type = "checkbox"
            input.name = "option"
            input.id = "h" + index + "o" + (i+1)

            let label = document.createElement('label')
            label.setAttribute("for", "h" + index + "o" + (i+1))
            label.innerText = prod;

            li.appendChild(input);
            li.appendChild(label);

            ol.appendChild(li)
            i += 1;
        }

        position.appendChild(header);
        position.appendChild(ol)
        list.appendChild(position)
        index += 1;
    }
    return;
}





// ADDING BEHAVIOUR
async function addBehaviour() {
    const positionsMap = new Map()

    for ( position of document.querySelectorAll('.menu>.list>.position') ){
        const categoryItemsPair = {
            category: position.querySelector('.category'),
            items: position.querySelectorAll('li')
        }
        positionsMap.set(position, categoryItemsPair);
    }

    // RESER BUTTONS
    for (input of document.querySelectorAll('input[type="checkbox"]:not([name="hide"])')){
        input.checked = false;
    }


    // ADD LIST HIDING
    for (positionPair of positionsMap){
        const position = positionPair[0];
        const category = positionPair[1]['category'];
        const items = positionPair[1]['items'];

        const button = category.querySelector('input[name="hide"]');
        const itemsList = position.querySelector('ol');
        itemsList.classList.add('hidden')

        button.addEventListener('click', ()=>{
            if (!button.checked) {
                itemsList.classList.remove('hidden')
                itemsList.classList.add('visible')
            } else {
                itemsList.classList.remove('visible')
                itemsList.classList.add('hidden')
            }
        })
        
        button.checked = true;
    }


    // SELECTING HEADER SELECTS ALL OF ITS ITEMS
    // UNSELECTING HEADER UNSELECTS ALL OF ITS ITEMS
    for (positionPair of positionsMap){
        const position = positionPair[0];
        const category = positionPair[1]['category'];
        const items = positionPair[1]['items'];


        const button = category.querySelector('input[name="header"]');
        button.addEventListener('change', ()=>{
            button.classList.remove('partialy');
            if (button.checked) {
                items.forEach(element => {
                    item = element.querySelector('input')
                    if (!item.checked) {
                        item.click();
                        // item.checked = true;
                    }
                });
            } else {
                items.forEach(element => {
                    item = element.querySelector('input')
                    if (item.checked) {
                        item.click();
                        // item.checked = false
                    }
                });
            }
        });
    }


    // UNSELECTING ITEM MAKE HEADER UNSELECTED OR PARTIALY SELECTED
    for (positionPair of positionsMap){
        const position = positionPair[0];
        const category = positionPair[1]['category'];
        const items = positionPair[1]['items'];


        const button = category.querySelector('input[name="header"]');
        
        
        items.forEach(element => {
            item = element.querySelector('input')

            item.addEventListener('change', ()=>{
                let checkedAmount = 0;
                items.forEach(checker => {
                    if (checker.querySelector('input').checked) {
                        checkedAmount += 1
                    }
                });


                switch (checkedAmount) {
                    case 0:
                        button.checked = false;
                        button.classList.remove('partialy')
                        break;
                    case items.length:
                        button.checked = true;
                        button.classList.remove('partialy')
                        break;
                    default:
                        button.checked = true;
                        button.classList.add('partialy')
                        break;
                }
            })


        });
    }

    // DISPLAYING VALUES
    let choicesList = document.querySelector('.choices ol')
    function displayValue(input, value) {

        let h = parseInt(input.id.split("h")[1])
        let o = parseInt(input.id.split("o")[1])

        let checker = choicesList.querySelector(`li[h="${h}"][o="${o}"]`)
        if (checker != null){
            checker.remove()
        } else {
            let newRecord = document.createElement('li')
            newRecord.setAttribute("h", h);
            newRecord.setAttribute("o", o);
            newRecord.innerText = value;


            let foundRecord = null;
            let recordsList = choicesList.querySelectorAll('li')
            for (record of recordsList){
                if (parseInt(record.getAttribute("h")) > h){
                    foundRecord = record;
                    break;
                } else if (parseInt(record.getAttribute("h")) == h && parseInt(record.getAttribute("o")) > o){
                    foundRecord = record;
                    break;
                }
            }

            // IF DIDNT FOUND ELEM TO INSERT NEW RECORD PREVIOS IT
            if (foundRecord == null){
                choicesList.appendChild(newRecord);
            } else {
                choicesList.insertBefore(newRecord, foundRecord);
            }
        }
    }

    function addRecord(value) {
        let record = document.createElement('li');
        record.innerText = value;
        choicesList.appendChild(record);
    }

    document.querySelectorAll('input[type="checkbox"]:not([name="hide"]):not([name="header"])').forEach(input => {
        let value = document.querySelector(`label[for="${input.id}"]`).innerText
        input.addEventListener('click', ()=>{
            displayValue(input, value)
        });
    });
}



async function start() {
    await fetchFiles();
    addBehaviour();
}

start()