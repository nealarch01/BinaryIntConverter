var inputBox = document.getElementById("inputbox");


const converter = Object.freeze({
    BINTODEC: 0,
    DECTOBIN: 1
});

var operationType = converter.BINTODEC; // by default

inputBox.addEventListener('keydown', (event)=> {
    const keyNum = event.code;
    if(event.code === "Enter") {
        event.preventDefault();
    }
})

function validateInput() {
    const strInput = String(document.getElementById("inputbox").value);
    for(let i = 0; i < strInput.length; i++) {
        if(strInput[i] == ' ') continue;
        const inputCh = strInput.charCodeAt(i);
        if(inputCh > 57 || inputCh < 48) {
            invalidInput(strInput[i]);
            return;
        }
    }
    document.getElementById("results").style.borderLeftColor = "blue";
    switch(operationType) {
        case converter.BINTODEC:
            convertBinToDec(strInput);
            break;
    }
}

function invalidInput(invChar) {
    let errorMsg = "Invalid character: " + invChar;
    document.getElementById("results").style.borderLeftColor = "red";
    document.getElementById("results").innerHTML = errorMsg;
}

function charToInt(someChar) {
    let nInt = someChar.charCodeAt(0);
    return nInt - 48;
}

// Unsigned conversion
function convertBinToDec(input) {
    if(document.getElementById("signed").checked == true) {
        signedBinToDec(input);
    } else {
        unsignedBinToDec(input);
    }
}

function unsignedBinToDec(input) {
    var decResult = 0;
    var exponent = 0;
    input = String(input);
    for(let i = input.length - 1; i >= 0; i--) {
        let singleBinaryValue = 0;
        switch(input[i]) {
            case(' '): // do nothing
                break;
            case('1'):
                singleBinaryValue = 2 ** exponent;
                decResult += singleBinaryValue;
            case('0'):
                exponent++;
                break;
            default:
                invalidInput(input[i]);
                return;
        }
    }
    var resultMsg = "Decimal: " + decResult.toString();
    document.getElementById("results").innerHTML = resultMsg;
}

function signedBinToDec(input) {
    
}


function clearText() {
    document.getElementById("inputbox").value = ""; // clear the text
}
