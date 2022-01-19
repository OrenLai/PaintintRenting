

var l1 = [2,4,3];
var l2 = [5,6,4];

var addTwoNumbers = function(l1, l2) {
    
    

    var l1_len = l1.length;
    var l2_len = l2.length;
    
    var num1 = 0;
    
    for (var i = 0 ; i <= l1_len; i++){
        num1 = num1 + l1[i] * (10 ** i);
    }
    
    var num2 = 0;
    
    for (var k = 0 ; k <= l2_len; i++){
        num2 = num2 + l2[i] * (10 ** i);
    }
    
    var sum = num1 + num2;
    var result = [];
        
};