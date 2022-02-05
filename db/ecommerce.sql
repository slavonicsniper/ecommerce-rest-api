DROP DATABASE IF EXISTS ecommerce;
CREATE DATABASE ecommerce;

\c ecommerce;

CREATE TABLE products
(
  id SERIAL NOT NULL,
  name VARCHAR(250) NOT NULL,
  price MONEY NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users
(
  username VARCHAR NOT NULL,
  first_name VARCHAR(200) NOT NULL,
  last_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  password VARCHAR(200) NOT NULL,
  PRIMARY KEY (username),
  UNIQUE (email)
);

CREATE TABLE carts
(
  id SERIAL NOT NULL,
  username VARCHAR NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE orders
(
  id SERIAL NOT NULL,
  cart_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (cart_id) REFERENCES carts(id)
);

CREATE TABLE products_carts
(
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  PRIMARY KEY (cart_id, product_id),
  FOREIGN KEY (cart_id) REFERENCES carts(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

insert into products (name, price)
values
('iPhone 6S', 300),
('google pixel 5', 600),
('QC20C', 150);

insert into users (username, first_name, last_name, email, password)
values
('j.smart', 'John', 'Smart', 'j.smart@ecommerce.com', 'Start123!'),
('j.enigma', 'Jane', 'Enigma', 'j.enigma@ecommerce.com', 'Start123!');