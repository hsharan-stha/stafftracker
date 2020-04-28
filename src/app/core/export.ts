export function exportCSV(filename, objData) {
    console.log(objData);
    let csvData = convertToCSV(objData);
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;/* file name*/
    a.click();
    return 'success';
}

export function convertToCSV(objArray) {
    console.log(objArray);
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";
    for (let index in objArray[0]) {
        //Now convert each value to string and comma-separated
        row += '"' + index +'"' + ',';
    }
    row = row.slice(0, -1); //remove comma
    console.log(row); //key is in first line
    //append Label row with line break
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line != '') {
                line += ','
            }
            console.log(array[i][index]);
            line += '"' + array[i][index] + '"';
        }

        str += line + '\r\n';
    }
    console.log(str);
    return str;
}


