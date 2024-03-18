export function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

export function round(num: number, fractionDigits: number): number {
    return Number(num.toFixed(fractionDigits));
}

