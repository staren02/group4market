# How to Add a Real Database to This Project

This guide explains how to upgrade from localStorage to a real backend database.

---

## Option 1: PHP + MySQL (Recommended for Beginners — Using XAMPP)

### Step 1 — Install XAMPP
- Download XAMPP from: https://www.apachefriends.org
- Install and start **Apache** and **MySQL** from the XAMPP control panel

### Step 2 — Create the Database
Open **phpMyAdmin** at http://localhost/phpmyadmin and run this SQL:

```sql
CREATE DATABASE chitechma_marketplace;
USE chitechma_marketplace;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','admin') DEFAULT 'student',
  matricule VARCHAR(50),
  phone VARCHAR(20),
  profile_image TEXT,
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10,2),
  condition_type VARCHAR(20),
  description TEXT,
  seller_name VARCHAR(100),
  seller_phone VARCHAR(20),
  seller_email VARCHAR(150),
  seller_id INT,
  image LONGTEXT,
  approved TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_id INT,
  from_name VARCHAR(100),
  to_id INT,
  product_id INT,
  message TEXT,
  is_read TINYINT(1) DEFAULT 0,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  role VARCHAR(150),
  photo LONGTEXT
);

-- Default admin account (password: admin123)
INSERT INTO users (name, email, password, role, matricule)
VALUES ('Administrator', 'admin@chitechma.cm', 'admin123', 'admin', 'ADMIN');
```

### Step 3 — Create a PHP API file (api.php)
Place this in your project folder and call it from JavaScript using fetch():

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$conn = new mysqli('localhost', 'root', '', 'chitechma_marketplace');

$action = $_GET['action'] ?? '';

if ($action === 'get_products') {
    $result = $conn->query("SELECT * FROM products WHERE approved = 1 ORDER BY created_at DESC");
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
}

if ($action === 'add_product') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("INSERT INTO products (name,category,price,condition_type,description,seller_name,seller_phone,seller_email,seller_id,image) VALUES (?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param('ssdsssssss', $data['name'],$data['category'],$data['price'],$data['condition'],$data['description'],$data['sellerName'],$data['sellerPhone'],$data['sellerEmail'],$data['sellerId'],$data['image']);
    $stmt->execute();
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
}
// ... add more actions: login, register, delete_product, etc.
?>
```

### Step 4 — Replace localStorage calls with fetch()
In app.js, replace `DB.addProduct(p)` with:
```javascript
fetch('api.php?action=add_product', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(product)
}).then(r => r.json()).then(data => {
  if (data.success) window.location.href = 'products.html';
});
```

---

## Option 2: Firebase (No Server Needed — Free)

1. Go to https://firebase.google.com and create a free project
2. Enable **Firestore Database** and **Authentication**
3. Copy the Firebase config into your HTML files
4. Use Firestore instead of localStorage:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const db = getFirestore(app);

// Add product
await addDoc(collection(db, "products"), productData);

// Get products
const snapshot = await getDocs(collection(db, "products"));
snapshot.forEach(doc => console.log(doc.data()));
```

Firebase handles authentication, image storage (Firebase Storage), and real-time updates automatically.

---

## Summary

| Feature | localStorage (current) | PHP + MySQL | Firebase |
|---|---|---|---|
| Setup | None | XAMPP install | Firebase account |
| Real persistence | ❌ Browser only | ✅ Yes | ✅ Yes |
| Multiple users | ❌ Same browser | ✅ Yes | ✅ Yes |
| Image storage | Base64 (~1.5MB) | Server folder | Firebase Storage |
| Difficulty | Beginner | Intermediate | Intermediate |
| Cost | Free | Free (local) | Free tier |

For your school project, the **current localStorage version** is perfect for demonstrating and presenting. The PHP+MySQL upgrade is the natural next step when you are ready.
