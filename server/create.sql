create TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

create TABLE messages(
    id SERIAL PRIMARY KEY,
    author VARCHAR(255) REFERENCES users(name),
    recipient VARCHAR(255),
    timestamp VARCHAR(255),
    title VARCHAR(500),
    text VARCHAR(1500)
);
