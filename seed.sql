CREATE TABLE master_user IF NOT EXISTS (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    url_profile TEXT,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    saldo NUMERIC(12, 2) DEFAULT 0.00
);

CREATE TABLE master_restoran IF NOT EXISTS (
    restoran_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    url_img TEXT,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE food IF NOT EXISTS (
    food_id SERIAL PRIMARY KEY,
    restoran_id INT REFERENCES master_restoran(restoran_id) ON DELETE CASCADE,
    url_img TEXT,
    url_video TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    total_likes INT DEFAULT 0,
    stok INT DEFAULT 0
);

CREATE TABLE favorit_user IF NOT EXISTS (
    user_id INT REFERENCES master_user(user_id) ON DELETE CASCADE,
    food_id INT REFERENCES food(food_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, food_id)
);

CREATE TABLE rating_review IF NOT EXISTS (
    feedback_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES master_user(user_id) ON DELETE CASCADE,
    food_id INT REFERENCES food(food_id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_header IF NOT EXISTS (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES master_user(user_id) ON DELETE CASCADE,
    restoran_id INT REFERENCES master_restoran(restoran_id) ON DELETE CASCADE,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_amount NUMERIC(12, 2) NOT NULL,
    order_status VARCHAR(20) NOT NULL,
    location TEXT NOT NULL
);

CREATE TABLE order_detail IF NOT EXISTS (
    order_detail_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES order_header(order_id) ON DELETE CASCADE,
    food_id INT REFERENCES food(food_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_harga_food NUMERIC(12, 2) NOT NULL
);

CREATE TABLE bills IF NOT EXISTS (
    bill_id SERIAL PRIMARY KEY,
    order_id INT UNIQUE REFERENCES order_header(order_id) ON DELETE CASCADE,
    total_amount NUMERIC(12, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) DEFAULT 2000.00
);
