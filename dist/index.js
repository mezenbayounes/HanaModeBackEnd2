"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./db");
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const favoritesRoutes_1 = __importDefault(require("./routes/favoritesRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const passport_1 = __importDefault(require("passport"));
require("./config/passport");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use('/api/products', productRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
// Serve uploaded files - use absolute path for production
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/favorites', favoritesRoutes_1.default);
app.get('/', (_, res) => res.send('Hana Mode API'));
app.use(errorHandler_1.errorHandler);
(0, db_1.connectDB)().then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}`)));
//# sourceMappingURL=index.js.map