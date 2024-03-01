//Convert the date to type "Sat, 23 Mar 2013 17:36:22" to "2013-03-23T17:36"
exports.formatDate = (date) =>{
    let newDate = new Date(date);
    let newDateStr = newDate.toISOString().split('T')[0];
    return newDateStr;
}