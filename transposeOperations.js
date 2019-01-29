
var transposer = (currentSKUStringValue, jobInfo, legalEntitySetting) => {
    console.log({ currentSKUStringValue, jobInfo, legalEntitySetting });

    var isFinishedLens = (jobInfo.type && jobInfo.type.toUpperCase() === 'FINISHEDLENS');
    var transposedSKU = null;
    var transposedSKUString = currentSKUStringValue;

    if (isFinishedLens) {

        //transposedSKU contains floating numbers//
        transposedSKU = transposeFormula(jobInfo.sphere, jobInfo.cylinder, legalEntitySetting);
        if (transposedSKU.stopAndReturn) {
            console.log("\x1b[35m", '####  returned original sku string only ####');
            console.log("\x1b[0m", `............................................................`);
            console.log('OUTPUT:=> ' + currentSKUStringValue);
            console.log('\x1b[33m%s\x1b[0m', '============================================================');
            return currentSKUStringValue;
        }

        // Add two digits after decimal point // transposedSKU Converted to strings here //
        transposedSKU.sphere = parseFloat(transposedSKU.sphere).toFixed(2);
        transposedSKU.cylinder = parseFloat(transposedSKU.cylinder).toFixed(2);

        transposedSKUString = formSKUString(transposedSKU.sphere, transposedSKU.cylinder, currentSKUStringValue);
    }

    console.log(`............................................................`);

    console.log('OUTPUT:=> ' + transposedSKUString);

    console.log('\x1b[33m%s\x1b[0m', '============================================================');

    return transposedSKUString;

}

function formSKUString(transposedSPH, transposedCyl, currentSKUString) {
    debugger;


    //Add leading zero , if 1.00 or -2.00 like "0"1.00 or -"0"2.00
    transposedSPH = addSignAndZeroIfNeeded(transposedSPH);
    transposedCyl = addSignAndZeroIfNeeded(transposedCyl);


    //Split enetered sku string to array
    var sku = currentSKUString.split("/");

    //Override sph and cyl with transposed values
    sku[0] = transposedSPH;
    sku[1] = transposedCyl;

    //join again to form sku string
    sku = sku.join("/");

    return sku;
}

function addSignAndZeroIfNeeded(item) {
    //item is a string with xx.00 format
    var splitted = item.split(".");

    var firstHalfBforeDecimal = splitted[0];
    var secondHalfAfterDecimal = splitted[1];

    if (firstHalfBforeDecimal) {
        var noSignPresent = firstHalfBforeDecimal.indexOf('+') === -1 && firstHalfBforeDecimal.indexOf('-') === -1;


        var isPositiveNumber = (parseInt(firstHalfBforeDecimal) >= 0);
        var signRemovedFirstHalf = removeSign(parseInt(firstHalfBforeDecimal));

        //twoDigits Exist 'Excluding' TheSign ?
        var twoDigitsExist = (signRemovedFirstHalf.length === 2);

        var appendString = "";

        if (noSignPresent) {

            if (twoDigitsExist) {
                /*two digit without sign + or -
                the string is like xx.yy*/

                if (isPositiveNumber) {
                    appendString = "+";
                } else {
                    appendString = "-";
                }
            } else {
                /*single digit without sign 
                the string is like x.yy  */

                if (isPositiveNumber) {
                    appendString = "+0";
                } else {
                    appendString = "-0";

                }
            }

        } //end of if noSignPresent
        else { //if sign(+/-) exist already
            if (twoDigitsExist === false) {
                //single digit with sign
                //the string is like +x.yy or -x.yy
                if (isPositiveNumber) {
                    appendString = "+0";
                } else {
                    appendString = "-0";

                }
            }
        }
        firstHalfBforeDecimal = appendString + signRemovedFirstHalf;
    }

    return [firstHalfBforeDecimal, secondHalfAfterDecimal].join('.');
}

function removeSign(item) {
    return Math.abs(item);
}

function transposeFormula(enteredSph, enteredCyl, legalEntitySetting) {
    var sku = {
        sphere: enteredSph,
        cylinder: enteredCyl,
        stopAndReturn: false
    };
    switch (legalEntitySetting) {
        case "POSITIVE":
            var isNegativeCylinderEntered = enteredCyl < 0;
            if (isNegativeCylinderEntered) {
                //CONVERT TO POSITIVE
                sku.cylinder = -1 * enteredCyl;
                sku.sphere = enteredSph + enteredCyl;
            } else {
                sku.stopAndReturn = true;
            }

            break;
        case "NEGATIVE":
            var isPositiveCylinderEntered = enteredCyl > 0;
            if (isPositiveCylinderEntered) {
                //CONVERT TO NEGATIVE
                sku.cylinder = -1 * enteredCyl;
                sku.sphere = enteredSph + enteredCyl;
            } else {
                sku.stopAndReturn = true;
            }
            break;
    }
    return sku; // return floating numbers , not strings
}

module.exports = {
    transposer
}
