// Order Number,Year,Month,Day,Product Number,Product Name,Count,Extra Col1,Extra Col2,Empty Column
// 1000,2018,1,1,P-10001,Arugola,"5,250.50",Lorem,Ipsum,
// OrderID,ProductId,Quantity,ProductName,OrderDate,Unit
// 1000,P-10001,5,Arugola,2018-1-1,kg

function properCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

module.exports = function(input, options) {
  return {
    'OrderID' : input['Order Number'],
    'ProductId' : input['Product Number'],
    'Quantity' : parseFloat(input['Count'].replace(',','')),
    'ProductName' : properCase(input['Product Name']),
    'OrderDate' : `${input['Year']}-${input['Month']}-${input['Day']}`,
    'Unit' : 'kg'
  }
}