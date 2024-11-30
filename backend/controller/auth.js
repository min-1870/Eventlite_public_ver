/**
 * 
 * @param {String} card_number 
 * Description: Credit card authenticator using the Luhn algorithm
 * @returns {Boolean}
 */
function creditCardChecker(card_number) {
    let n_digits = card_number.length;

    let sum = 0;
    let isSecond = false;
    for (let count = n_digits - 1; count >= 0; count--) {
        let value = card_number[count].charCodeAt() - '0'.charCodeAt();

        if (isSecond) {
            value = value * 2;
        }
        sum += parseInt(value / 10, 10);
        sum += value % 10;

        isSecond = !isSecond;
    }
    return (sum % 10 === 0)
};

module.exports = {
    creditCardChecker,
};