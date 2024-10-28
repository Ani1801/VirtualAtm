from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

# Configure PostgreSQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:mypassword@localhost:5432/atm_db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)

# Define models
class User(db.Model):
    __tablename__ = 'users'  # Ensure the table name matches your database
    id = db.Column(db.Integer, primary_key=True)
    account_number = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    balance = db.Column(db.Float, default=50000)

class Transaction(db.Model):
    __tablename__ = 'transactions'  # Ensure the table name matches your database
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(10), nullable=False)  # "deposit" or "withdraw"
    current_balance = db.Column(db.Float, nullable=False)  # Store the balance after transaction
    date = db.Column(db.DateTime, default=datetime.utcnow)

# Create tables if they don't exist
with app.app_context():
    db.create_all()



@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        user_id = data["user_id"]
        password = data["password"]
        balance = data["balance"]

        # Check if user_id already exists
        existing_user = User.query.filter_by(account_number=user_id).first()
        if existing_user:
            return jsonify({"error": "User ID already exists"}), 400

        # Create a new user in the database
        new_user = User(account_number=user_id, password=password, balance=balance)
        db.session.add(new_user)
        db.session.commit()  # Ensure you commit the transaction

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("Error during registration:", e)  # Log the error to console
        return jsonify({"error": "Registration failed. Please try again."}), 500



# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        account_number = request.form.get('account_number')
        password = request.form.get('password')

        user = User.query.filter_by(account_number=account_number, password=password).first()
        if user:
            session['user_id'] = user.id  # Store user ID in session
            return redirect(url_for('dashboard'))  # Redirect to dashboard

        return "Invalid account number or password"  # Handle invalid credentials

    return render_template('login.html')

# Dashboard route
@app.route('/dashboard')
def dashboard():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('login'))

    user = User.query.get(user_id)
    transactions = Transaction.query.filter_by(user_id=user.id).order_by(Transaction.date.desc()).limit(5).all()
    return render_template('dashboard.html', user=user, transactions=transactions)

# Withdrawal route
@app.route('/withdraw', methods=['GET', 'POST'])
def withdraw():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('login'))

    user = User.query.get(user_id)
    if request.method == 'POST':
        amount = float(request.form.get('amount'))
        if user.balance >= amount:
            user.balance -= amount
            # Store the new balance in the transaction
            transaction = Transaction(user_id=user.id, amount=amount, type='withdraw', current_balance=user.balance)
            db.session.add(transaction)
            db.session.commit()  # Commit changes to update balance
            return jsonify({"message": "Withdrawal successful", "new_balance": user.balance})
        else:
            return jsonify({"error": "Insufficient funds"}), 400

    return render_template('withdraw.html', user=user)

# Deposit route
@app.route('/deposit', methods=['GET', 'POST'])
def deposit():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('login'))

    user = User.query.get(user_id)
    if request.method == 'POST':
        amount = float(request.form.get('amount'))
        user.balance += amount
        # Store the new balance in the transaction
        transaction = Transaction(user_id=user.id, amount=amount, type='deposit', current_balance=user.balance)
        db.session.add(transaction)
        db.session.commit()  # Commit changes to update balance
        return jsonify({"message": "Deposit successful", "new_balance": user.balance})

    return render_template('deposit.html', user=user)

# Transaction history route
@app.route('/transaction_history')
def transaction_history():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('login'))

    user = User.query.get(user_id)
    transactions = Transaction.query.filter_by(user_id=user.id).order_by(Transaction.date.desc()).all()
    return render_template('transaction_history.html', transactions=transactions)

# Logout route
@app.route('/logout')
def logout():
    session.pop('user_id', None)  # Remove user ID from session to log out
    return redirect(url_for('login'))  # Redirect to login page after logout

if __name__ == '__main__':
    app.run(debug=True, port=5000)
