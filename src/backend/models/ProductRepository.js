const BaseRepository = require('./BaseRepository');
class ProductRepository extends BaseRepository {
    constructor() { super('products'); }
    updateInventory(branch_id, product_id, quantity) {
        return this.db.prepare(`INSERT INTO branch_inventory (branch_id, product_id, quantity) VALUES (?, ?, ?) ON CONFLICT(branch_id, product_id) DO UPDATE SET quantity = quantity + EXCLUDED.quantity`).run(branch_id, product_id, quantity);
    }
}
module.exports = new ProductRepository();
