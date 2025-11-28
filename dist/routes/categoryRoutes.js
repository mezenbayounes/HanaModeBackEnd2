"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
// CRUD Routes
router.post('/', upload_1.upload.single('image'), categoryController_1.createCategory);
router.get('/', categoryController_1.getCategories);
router.get('/:id', categoryController_1.getCategory);
router.put('/:id', upload_1.upload.single('image'), categoryController_1.updateCategory);
router.delete('/:id', categoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map