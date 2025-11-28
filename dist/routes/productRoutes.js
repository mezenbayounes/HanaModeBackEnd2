"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const upload_1 = require("../middleware/upload");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Upload multiple images when creating a product
router.post('/', upload_1.upload.array('images', 5), productController_1.createProduct);
router.get('/', authMiddleware_1.optionalAuth, productController_1.listProducts);
router.patch('/:id/toggle-visibility', productController_1.toggleProductVisibility);
router.get('/:id', productController_1.getProduct);
router.put('/:id', upload_1.upload.array('images', 5), productController_1.updateProduct);
router.delete('/:id', productController_1.deleteProduct);
router.get('/category/:category', productController_1.getProductsByCategory);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map