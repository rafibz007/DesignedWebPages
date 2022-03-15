let nameField = document.querySelector('.contacts header input[name="name"]');
let phoneField = document.querySelector('.contacts header input[name="phone"]');
let submit = document.querySelector('.contacts header button');
let list = document.querySelector('.contacts .list');
let header = document.querySelector('.contacts header')

let trashCanIcon = '<i class="demo-icon icon-trash"></i>'


submit.addEventListener('click',()=>{
    let nameAdd = nameField.value.trim();
    let phoneAdd = phoneField.value.trim();
    let result;

    // CHECK IF INPUT IS VALID
    if ( !(result = checkIfValidName(nameAdd)).status ){
        showErrorInputMessage(result.message);
    }
    else if ( !(result = checkIfValidPhone(phoneAdd)).status ){
        showErrorInputMessage(result.message);
    }
    else{
        // CLEAN FIELDS
        let nameValue = nameField.value;
        let phoneValue = phoneField.value;
        nameField.value = "";
        phoneField.value = "";

        // DELETE ERROR MESSAGE
        let error = document.querySelector('.contacts header .error');
        if (error != null)
            error.remove();

        // RECORD
        let newRecord = document.createElement("div");
        newRecord.classList.add("record");

        // INFO
        let info = document.createElement("div");
        info.classList.add("info");

        let infoName = document.createElement("div");
        infoName.classList.add('name');
        infoName.innerText = nameValue;

        let infoPhone = document.createElement("div");
        infoPhone.classList.add("phone");
        infoPhone.innerText = phoneValue;

        info.appendChild(infoName);
        info.appendChild(infoPhone);
        
        newRecord.appendChild(info);

        // TRASH BUTTON
        let trashButton = document.createElement("button");
        trashButton.classList.add("delete");
        trashButton.innerHTML = trashCanIcon;

        newRecord.appendChild(trashButton);
        trashButton.addEventListener('click', ()=>{
            newRecord.remove();
        })

        // ADD RECORD
        list.insertBefore(newRecord, document.querySelector('.contacts .list>div:first-of-type'));

    }
})

// returns object with boolean value indicating if the value is valid and optional error message
// return { status: boolean, message: "Error message to show" }
function checkIfValidName(nameAdd){
    if (nameAdd == ""){
        return {
            status: false,
            message: "Name and surname required"
        };
    }

    console.log(nameAdd);
    if (!/^[A-Za-z ]{1,}$/.test(nameAdd)){
        return {
            status: false,
            message: "Name or surname contains illegal characters"
        };
    }

    if (/[a-z]{1}[A-Z]{1}/.test(nameAdd) || /^[^A-Z]/.test(nameAdd) || /[ ]{1}[a-z]{1}/.test(nameAdd)){
        return {
            status: false,
            message: "Name and surname must start from capital letter and cannot contain capital letters inside"
        };
    }

    return {
        status: true,
        message: ""
    };

}

// returns object with boolean value indicating if the value is valid and optional error message
// return { status: boolean, message: "Error message to show" }
function checkIfValidPhone(phoneAdd){
    if (phoneAdd == ""){
        return{
            status: false,
            message: "Phone number required"
        };
    }

    if (/[^0-9]{1,}/.test(phoneAdd)){
        return {
            status: false,
            message: "Phone number contains illegal characters"
        };
    }

    if (!/^[0-9]{9}$/.test(phoneAdd)){
        return {
            status: false,
            message: "Phone number must contain exactly 9 digits"
        };
    }

    return {
        status: true,
        message: ""
    };
}


function showErrorInputMessage(message){
    let error = document.querySelector('.contacts header .error');
    if (error == null){
        error = document.createElement('div');
        error.classList.add('error');
        header.appendChild(error);
    }
    error.innerText = message;
}