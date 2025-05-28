CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_profile VARCHAR(255),
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users_messages (
    message_id VARCHAR(255) PRIMARY KEY NOT NULL,
    from_user_id VARCHAR(255) NOT NULL REFERENCES users(user_id),
    to_user_id VARCHAR(255) NOT NULL REFERENCES users(user_id),
    message_content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_chats (
    group_id VARCHAR(255) PRIMARY KEY NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    group_description VARCHAR(255) NOT NULL,
    group_password VARCHAR(255),
    group_creator_id VARCHAR(255) NOT NULL REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS group_messages (
    message_id VARCHAR(255) PRIMARY KEY NOT NULL,
    from_user_id VARCHAR(255) NOT NULL REFERENCES users(user_id),
    group_id VARCHAR(255) NOT NULL REFERENCES group_chats(group_id),
    message_content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);