
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,  
    account_number TEXT NOT NULL UNIQUE,        
    pin TEXT NOT NULL,                          
    balance REAL DEFAULT 0.0,                   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction Table

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,  
    user_id INTEGER NOT NULL,                          
    transaction_type TEXT NOT NULL,                     
    amount REAL NOT NULL,                               
    balance_after REAL,                                 
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      
    FOREIGN KEY (user_id) REFERENCES users(user_id)    
);

-- Testing transaction table
INSERT INTO transactions (user_id, transaction_type, amount, balance_after)
VALUES (1, 'Deposit', 500.00, 1500.00);

select * from transactions;

INSERT INTO users (account_number, pin, balance)
VALUES 
('987654321', '4321', 1000.0),
('112233445', '1111', 2000.0);

select * from users;

