from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

# Initialize Flask app and SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/atm.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define models for Users and Transactions
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    account_number = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)
    balance = db.Column(db.Float, default=50000)

class Transaction(db.Model):
    __tablename__ = 'transaction'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(10), nullable=False)  # "deposit" or "withdraw"
    date = db.Column(db.DateTime, default=datetime.utcnow)

# Function to initialize or reset the database
def initialize_database():
    if not os.path.exists("instance"):
        os.makedirs("instance")
    
    # Remove the existing database file if it exists
    db_path = os.path.join("instance", "atm.db")
    if os.path.exists(db_path):
        os.remove(db_path)
        print("Old database deleted.")

    # Create tables for the new database
    db.create_all()
    print("New database initialized with user and transaction tables!")

# Run the database initialization if script is executed directly
if __name__ == "__main__":
    with app.app_context():
        initialize_database()
