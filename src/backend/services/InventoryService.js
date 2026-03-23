const { db } = require('../database');
const ProductRepository = require('../models/ProductRepository');
class InventoryService {
    static updateAllPricesPercentage(percentage) {
        return db.prepare('UPDATE products SET sale_price = sale_price * (1 + ?), wholesale_price = wholesale_price * (1 + ?)').run(percentage / 100, percentage / 100);
    }
}
module.exports = InventoryService;
