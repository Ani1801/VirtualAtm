from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Connect to the SQLite database
def get_db_connection():
    conn = sqlite3.connect('database/atm_machine.db')
    conn.row_factory = sqlite3.Row
    return conn

# Home page or Welcome page
@app.route('/')
def home():
    return render_template('login.html')

# Login page route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password)).fetchone()
        conn.close()

        if user:
            session['user_id'] = user['id']
            return redirect(url_for('dashboard'))
        else:
            return 'Invalid username or password'

    return render_template('login.html')

# Dashboard page after login
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    conn = get_db_connection()
    account = conn.execute('SELECT * FROM accounts WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()

    return render_template('dashboard.html', account=account)

# Deposit money route
@app.route('/deposit', methods=['GET', 'POST'])
def deposit():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        amount = float(request.form['amount'])
        user_id = session['user_id']

        conn = get_db_connection()
        conn.execute('UPDATE accounts SET balance = balance + ? WHERE user_id = ?', (amount, user_id))
        conn.commit()
        conn.close()

        return redirect(url_for('dashboard'))

    return render_template('deposit.html')

# Withdraw money route
@app.route('/withdraw', methods=['GET', 'POST'])
def withdraw():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        amount = float(request.form['amount'])
        user_id = session['user_id']

        conn = get_db_connection()
        account = conn.execute('SELECT * FROM accounts WHERE user_id = ?', (user_id,)).fetchone()

        if account and account['balance'] >= amount:
            conn.execute('UPDATE accounts SET balance = balance - ? WHERE user_id = ?', (amount, user_id))
            conn.commit()
            conn.close()

            return redirect(url_for('dashboard'))
        else:
            return 'Insufficient balance or error'

    return render_template('withdraw.html')

# Transaction history route
@app.route('/transaction_history')
def transaction_history():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    conn = get_db_connection()
    transactions = conn.execute('SELECT * FROM transactions WHERE account_id = (SELECT id FROM accounts WHERE user_id = ?) ORDER BY transaction_date DESC', (user_id,)).fetchall()
    conn.close()

    return render_template('t.history.html', transactions=transactions)

if __name__ == '__main__':
    app.run(debug=True)
