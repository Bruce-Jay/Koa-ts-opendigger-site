interface MetricIndexedData {
	[metric: string]: any;
}

function printDataInColumns(data: MetricIndexedData) {
    let result = ""
    const keys = Object.keys(data);
    const values = Object.values(data);
    // 分成四列打印
    const rows = Math.ceil(keys.length / 4);

    for (let row = 0; row < rows; row++) {
        let rowString: string = ``;
        for (let column = 0; column < 4; column++) {
            const index = row + column * rows;
            if (index < keys.length) {
                const key = keys[index];
                const value = values[index];
                rowString += `${key}: ${value.toFixed(2)}\t\t`;
            }
        }
        result += rowString + '\n';
    }

    return result;
}

export default printDataInColumns;