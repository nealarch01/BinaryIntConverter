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
    var strInput = String(document.getElementById("inputbox").value);
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

function convertBinToDec(input) {
    if(document.getElementById("signed").checked == true) {
        if(input[0] === '1') {
            signedBinToDec(input);
            return;
        }
    }
    unsignedBinToDec(input);
}

function unsignedBinToDec(input) {
    var decResult = 0;
    var exponent = 0;
    for(let i = input.length - 1; i >= 0; i--) {
        let singleBinaryValue = 0;
        switch(input[i]) {
            case(' '): // do nothing
                break;
            case('1'):
                singleBinaryValue = 2 ** exponent;
                decResult += singleBinaryValue;
                // no break needed, we want to increment exponent
            case('0'):
                exponent++;
                break;
            default:
                invalidInput(input[i]);
                return;
        }
    }
    displayResult(decResult);
}

function signedBinToDec(input) {
    // first reverse all bits
    var reversedInput = ""; // initialize as empty string
    for(let i = 0; i < input.length; i++) {
        switch(input[i]) {
            case('0'):
                reversedInput += '1';
                break;
            case('1'):
                reversedInput += '0';
                break;
            case(' '): break; // do nothing
            default:
                invalidInput(input[i]);
                return;
        }
    }
    // once bits have been inverted, add one binary bit
    var carry = '1';
    var addedInput = ""; 
    for(let i = reversedInput.length - 1; i >= 0; i--) {
        if(carry === '1') {
            if(reversedInput[i] === '1') {
                addedInput += '0';
            } else if(reversedInput[i] === '0') {
                addedInput += '1';
                carry = '0'; // no more to carry since we are adding with 0
            } else { // if space
                continue; 
            }
        } else {
            addedInput += reversedInput[i];
        }
    }
    reversedInput = ""; // reset
    for(let i = addedInput.length - 1; i >= 0; i--) {
        reversedInput += addedInput[i];
    }
    var exponent = 0;
    var decResult = 0;
    // no need to invalidate input since string has been 
    for(let i = reversedInput.length; i >= 0; i--) {
        let singleBinaryInput = 0;
        switch(reversedInput[i]) {
            case('1'):
                singleBinaryInput = 2 ** exponent;
                decResult += singleBinaryInput;
            case('0'):
                exponent++;
                break;
            case(' '):
                break;
        }
    }
    var finalRes = "-" + decResult.toString();
    displayResult(finalRes);
}

function reverseStr(someBinaryString) {
    var mid = floor(someBinaryString / 2);
    var j = someBinaryString.length - 1;
    for(let i = 0; i <= mid; i++) {
        
    }
}

function displayResult(finalResult) {
    var resultMsg;
    switch(operationType) {
        case converter.BINTODEC:
            resultMsg = "Decimal: ";
            resultMsg += finalResult.toString(); // convert to string
            break;
        case converter.DECTOBIN:
            resultMsg = "Binary: ";
            resultMsg += finalResult;
            break;
    }
    document.getElementById("results").style.borderLeftColor = "green";
    document.getElementById("results").innerHTML = resultMsg;
}

function clearText() {
    document.getElementById("inputbox").value = ""; // clear the text
}