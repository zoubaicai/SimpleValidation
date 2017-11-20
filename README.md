# SimpleValidation
This is a simple validation plugin in javascript.

use it such as below:

var validate = new simpleValidation();

//params("input name","display test","verified rules",callback,min length,max length),if you want to use min/max please append min_length/max_lenth to rules

validate._validate("username","用户名","required|alpha_dash",function(results){
  console.log(results.resultFlag + "|" + results.resultMsg);
  //do something
  //...
});
