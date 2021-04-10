function inputValidation(goods, quantity, price, type) {
  if (!goods || !quantity || !price || !type) {
    return 'fill_input';
  } else if (quantity <= 0) {
    return 'negative_quantity';
  } else if (price <= 0) {
    return 'negative_price';
  } else {
    return 'good';
  }
}

export default inputValidation;