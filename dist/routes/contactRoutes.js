"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const router = (0, express_1.Router)();
router.post('/', contactController_1.createContactMessage);
router.get('/', contactController_1.listContactMessages);
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map