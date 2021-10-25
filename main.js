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

function changeOperationType() {
    // BINTODEC = 0, DECTOBIN = 1
    let resultType = "";
    let inputBoxPlaceholder = "";
    let convh2 = "";
    // swap operation type and change display information
    switch(operationType) { // operation type case is the previous state
        case converter.BINTODEC:
            operationType = converter.DECTOBIN; // change conversion type 
            resultType = "Binary: ";
            inputBoxPlaceholder = "Enter decimal number";
            convh2 = "Decimal to Binary";
            break;
        case converter.DECTOBIN:
            operationType = converter.BINTODEC;
            resultType = "Decimal: ";
            inputBoxPlaceholder = "Enter binary number";
            convh2 = "Binary To Decimal";
            break;
    }
    document.getElementById("conv").innerHTML = convh2;
    document.getElementById("results").style.borderLeftColor = "blue";
    document.getElementById("results").innerHTML = resultType;
    document.getElementById("inputbox").placeholder = inputBoxPlaceholder;
}

function validateInput() {
    var strInput = String(document.getElementById("inputbox").value);
    let subCount = 0;
    for(let i = 0; i < strInput.length; i++) {
        if(strInput[i] == ' ') continue;
        const inputCh = strInput.charCodeAt(i);
        if(inputCh > 57 || inputCh < 48) {
            if(inputCh === 45 && subCount < 1) { // if negative number found (only one negative)
                subCount += 1;
                continue;
            }
            invalidInput("Invalid Character Found");
            return;
        }
    }
    if(operationType == converter.BINTODEC) {
        convertBinToDec(strInput);
    } else { // operationType == converter.DECTOBIN
        // check for underflow / overflow integers
        let maxDecimal = 2 ** 64;
        let inputIntType = parseInt(strInput);
        if(inputIntType === NaN) {
            invalidInput("Invalid Integer");
            return;
        } else if (inputIntType > maxDecimal || inputIntType === Infinity) {
            invalidInput("Decimal too large. Max decimal: " + maxDecimal.toString());
            return;
        }
        convertDecToBin(strInput);
    }
    // document.getElementById("results").style.borderLeftColor = "blue";
}

function invalidInput(errorMsg) {
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
                if(exponent > 64) {
                    invalidInput("64 Unsigned Bit Binary Integer Limit Exceeded");
                    return;
                }
                break;
            default:
                invalidInput("Invalid character found");
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
                invalidInput("Invalid character found");
                return;
        }
    }
    if(reversedInput.length > 63) { // reversedInput has no spaces
        invalidInput("63 Signed Bit Binary Limit Exceeded");
        return;
   }
    // once bits have been inverted, add one binary bit
    let carry = '1';
    let addedInput = ""; 
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
    let exponent = 0;
    let decResult = 0;
    // no need to validate input since string has already been checked 
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

// input must be validated first
function convertDecToBin(input) {
    let isNegative = false;
    // force convert signed if negative input is entered
    if(input[0] === '-') {
        if(document.getElementById("signed").checked == false) {
            document.getElementById("signed").checked = true; // enable signed integer mode if negative input is entered
        }
        input = input.replace("-", "");
        isNegative = true;
    }
    if(input === "0") {
        displayResult("0");
        return;
    }
    let binaryStack = []; // initialize empty array that will serve as our stack
    let tempInt = parseInt(input);
    if(tempInt === NaN) {
        invalidInput("Invalid Character Found");
        return;
    }
    let remainder;
    while(tempInt > 0) {
        remainder = Math.floor(tempInt % 2);
        tempInt = Math.floor(tempInt / 2);
        binaryStack.push(remainder);
    }
    // pop all elements from the stack

    var binaryResult = "";
    binaryResult += binaryStack.pop().toString(); // purpose: not to add a space on the first 4
    while(binaryStack.length > 0) {
        binaryResult += binaryStack.pop().toString();
    }

    // if result is negative, we have to convert using two's complement
    if(isNegative) {
        // apply two's complement
        // reverse all bits
        let reversedStr = "";
        console.log(typeof(binaryResult));
        for(let i = 0; i < binaryResult.length; i++) {
            if(binaryResult[i] === '0') {
                reversedStr += '1';
            } else { // if === "1"
                reversedStr += '0';
            }
        } 
        // add + 1
        let carry = 1;
        binaryResult = ""; // reset the string
        for(let i = reversedStr.length - 1; i >= 0; i--) {
            if(carry === 1) {
                if(reversedStr[i] === "1") {
                    binaryResult = "0" + binaryResult;
                    // cary stays the same
                } else { // reversedStr[i] === "0"
                    binaryResult = "1" + binaryResult;
                    carry = 0;
                }
            } else { // carry === 0
                binaryResult = reversedStr[i] + binaryResult;
            }
        }
        if(binaryResult[0] != "1") {
            binaryResult = "1" + binaryResult;
        }
    } // end of ifNegative

    displayResult(binaryResult); 
}

function displayResult(finalResult) {
    var resultMsg = "";
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