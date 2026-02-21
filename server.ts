import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.NODE_ENV === "production" ? path.join("/tmp", "market.db") : "market.db";
const db = new Database(dbPath);
const JWT_SECRET = process.env.JWT_SECRET || "globalsoft-secret-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'buyer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER,
    name TEXT,
    description TEXT,
    price REAL,
    category TEXT,
    version TEXT,
    screenshots TEXT,
    file_url TEXT,
    contact_number TEXT,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_id INTEGER,
    product_id INTEGER,
    amount REAL,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(buyer_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Migration: Add contact_number to products if it doesn't exist
try {
  db.prepare("ALTER TABLE products ADD COLUMN contact_number TEXT").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE products ADD COLUMN views INTEGER DEFAULT 0").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE products ADD COLUMN clicks INTEGER DEFAULT 0").run();
} catch (e) {}


const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

// Export for Vercel
export default app;

async function startServer() {

  app.use(express.json());

  // WebSocket for Real-time Messaging
  const clients = new Map<number, WebSocket>();

  wss.on("connection", (ws, req) => {
    let userId: number | null = null;

    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === "auth") {
        userId = message.userId;
        if (userId) clients.set(userId, ws);
      } else if (message.type === "chat") {
        const { receiverId, content } = message;
        if (userId && receiverId) {
          db.prepare("INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)")
            .run(userId, receiverId, content);
          
          const receiverWs = clients.get(receiverId);
          if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
            receiverWs.send(JSON.stringify({
              type: "chat",
              senderId: userId,
              content,
              timestamp: new Date().toISOString()
            }));
          }
        }
      }
    });

    ws.on("close", () => {
      if (userId) clients.delete(userId);
    });
  });

  // API Routes
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name, role } = req.body;
    try {
      const result = db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)")
        .run(email, password, name, role || 'buyer');
      const token = jwt.sign({ id: result.lastInsertRowid, email, role }, JWT_SECRET);
      res.json({ token, user: { id: result.lastInsertRowid, email, name, role } });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.status = 'active'").all();
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = db.prepare("SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.id = ?").get(req.params.id);
    const reviews = db.prepare("SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ?").all(req.params.id);
    res.json({ ...product, reviews });
  });

  app.post("/api/products/:id/view", (req, res) => {
    db.prepare("UPDATE products SET views = views + 1 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/products/:id/click", (req, res) => {
    db.prepare("UPDATE products SET clicks = clicks + 1 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/sellers", (req, res) => {
    const sellers = db.prepare(`
      SELECT u.id, u.name, u.email, u.created_at,
      (SELECT COUNT(*) FROM products WHERE seller_id = u.id) as product_count
      FROM users u WHERE role = 'seller'
    `).all();
    res.json(sellers);
  });

  app.post("/api/products", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== 'seller') return res.status(403).json({ error: "Only sellers can upload" });
      
      const { name, description, price, category, version, screenshots, contact_number } = req.body;
      const result = db.prepare("INSERT INTO products (seller_id, name, description, price, category, version, screenshots, contact_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(decoded.id, name, description, price, category, version, screenshots, contact_number);
      
      // Broadcast new product event to all connected clients
      const newProduct = db.prepare("SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.id = ?").get(result.lastInsertRowid);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "new_product",
            product: newProduct
          }));
        }
      });

      res.json({ id: result.lastInsertRowid });
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.post("/api/checkout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const { productId, amount } = req.body;
      db.prepare("INSERT INTO orders (buyer_id, product_id, amount) VALUES (?, ?, ?)")
        .run(decoded.id, productId, amount);
      res.json({ success: true });
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.get("/api/user/orders", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const orders = db.prepare("SELECT o.*, p.name as product_name FROM orders o JOIN products p ON o.product_id = p.id WHERE o.buyer_id = ?").all(decoded.id);
      res.json(orders);
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.get("/api/seller/stats", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const stats = db.prepare(`
        SELECT 
          COUNT(DISTINCT p.id) as total_products,
          COUNT(o.id) as total_sales,
          SUM(o.amount) as total_revenue,
          SUM(p.views) as total_views,
          SUM(p.clicks) as total_clicks
        FROM products p
        LEFT JOIN orders o ON p.id = o.product_id
        WHERE p.seller_id = ?
      `).get(decoded.id);
      res.json(stats);
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Only listen if not in a serverless environment
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    httpServer.listen(3000, "0.0.0.0", () => {
      console.log("Server running on http://localhost:3000");
    });
  }
}

startServer();
