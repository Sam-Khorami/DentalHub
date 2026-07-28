let lst = [ { productId: 1, totalPrice: 100000 }, { productId: 10, totalPrice: 300000 } ];

const id = 1;

lst = lst.filter((item) => item.productId !== id);
console.log(lst);