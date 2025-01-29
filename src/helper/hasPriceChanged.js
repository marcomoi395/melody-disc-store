const hasPriceChanged = (productsInCart, productsInDb) => {
    for (const item of productsInCart) {
        const dbProduct = find((product) => product._id === item.product_id);
        if (!dbProduct || item.product_price !== dbProduct.product_price) {
            return true;
        }
    }
    return false;
};

module.exports = hasPriceChanged;
