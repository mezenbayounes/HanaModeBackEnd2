"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favoritesController_1 = require("../controllers/favoritesController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// All routes require authentication
router.post('/', authMiddleware_1.authenticateToken, favoritesController_1.addToFavorites);
router.delete('/:productId', authMiddleware_1.authenticateToken, favoritesController_1.removeFromFavorites);
router.get('/', authMiddleware_1.authenticateToken, favoritesController_1.getFavorites);
router.get('/check/:productId', authMiddleware_1.authenticateToken, favoritesController_1.checkFavorite);
exports.default = router;
//# sourceMappingURL=favoritesRoutes.js.map