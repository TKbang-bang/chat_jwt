CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_profile VARCHAR(255),
    user_password VARCHAR(255) NOT NULL
);