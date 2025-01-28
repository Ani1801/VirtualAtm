from flask import Flask, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('database/atm_machine.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def home():
    return "Welcome to the Virtual ATM API!"

# Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    account_number = data.get('account_number')
    pin = data.get('pin')

    if not account_number or not pin:
        return jsonify({"error": "Account number and PIN are required."}), 400

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE account_number = ? AND pin = ?',
                        (account_number, pin)).fetchone()
    conn.close()

    if user:
        return jsonify({"message": "Login successful", "user_id": user['user_id'], "balance": user['balance']}), 200
    else:
        return jsonify({"error": "Invalid account number or PIN."}), 401

# Check Balance Endpoint
@app.route('/balance/<int:user_id>', methods=['GET'])
def check_balance(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT balance FROM users WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()

    if user:
        return jsonify({"balance": user['balance']}), 200
    else:
        return jsonify({"error": "User not found."}), 404

# Deposit Money Endpoint
@app.route('/deposit', methods=['POST'])
def deposit():
    data = request.json
    user_id = data.get('user_id')
    amount = data.get('amount')

    if not user_id or not amount or amount <= 0:
        return jsonify({"error": "Valid user ID and amount are required."}), 400

    conn = get_db_connection()
    user = conn.execute('SELECT balance FROM users WHERE user_id = ?', (user_id,)).fetchone()

    if not user:
        conn.close()
        return jsonify({"error": "User not found."}), 404

    new_balance = user['balance'] + amount
    conn.execute('UPDATE users SET balance = ? WHERE user_id = ?', (new_balance, user_id))
    conn.execute('INSERT INTO transactions (user_id, transaction_type, amount, balance_after) VALUES (?, ?, ?, ?)',
                 (user_id, 'Deposit', amount, new_balance))
    conn.commit()
    conn.close()

    return jsonify({"message": "Deposit successful.", "new_balance": new_balance}), 200

# Withdrawal Endpoint
@app.route('/withdraw', methods=['POST'])
def withdraw():
    data = request.json
    user_id = data.get('user_id')
    amount = data.get('amount')

    if not user_id or not amount or amount <= 0:
        return jsonify({"error": "Valid user ID and amount are required."}), 400

    conn = get_db_connection()
    user = conn.execute('SELECT balance FROM users WHERE user_id = ?', (user_id,)).fetchone()

    if not user:
        conn.close()
        return jsonify({"error": "User not found."}), 404

    if user['balance'] - amount < 100.0:  # Minimum balance check
        conn.close()
        return jsonify({"error": "Insufficient balance. Minimum balance of 100.0 required."}), 400

    new_balance = user['balance'] - amount
    conn.execute('UPDATE users SET balance = ? WHERE user_id = ?', (new_balance, user_id))
    conn.execute('INSERT INTO transactions (user_id, transaction_type, amount, balance_after) VALUES (?, ?, ?, ?)',
                 (user_id, 'Withdraw', amount, new_balance))
    conn.commit()
    conn.close()

    return jsonify({"message": "Withdrawal successful.", "new_balance": new_balance}), 200

if __name__ == '__main__':
    app.run(debug=True)
