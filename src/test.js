var lst = [{ productId: 1, totalPrice: 100000 }, { productId: 10, totalPrice: 300000 }];
var id = 1;
lst = lst.filter(function (item) { return item.productId !== id; });
console.log(lst);
