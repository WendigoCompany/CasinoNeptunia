export const countRepeat = (values, value) => {
    let count = 0;
    for (let i = 0; i < values.length; i++) {
        if (values[i] == value) {
            count++
        }
    }

    return count
}

export const SortMayor = (num) => {
    return num.sort((a, b) => b - a);
}


export const SortMenor = (num) => {
    return num.sort((a, b) => a - b);
} 