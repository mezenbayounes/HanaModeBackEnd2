"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = validateObjectId;
// Validate that the ID is a valid integer for MySQL
function validateObjectId(param = 'id') {
    return (req, res, next) => {
        const id = parseInt(req.params[param]);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        next();
    };
}
//# sourceMappingURL=validateObjectId.js.map