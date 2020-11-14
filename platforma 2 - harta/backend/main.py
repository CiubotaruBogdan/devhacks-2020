#!/usr/bin/env python3

from flask import Flask, request
from flask.json import jsonify
from flask_cors import CORS, cross_origin
import mysql.connector
import modules.models as models
import modules.configuration as config

# Create web server
app = Flask(__name__)
cors = CORS(app)

# Add web server configuration
app.config["CORS_HEADERS"] = "Content-Type"

# Connect to database
database = mysql.connector.connect(host=config.Database.HOST,
                                   user=config.Database.USERNAME,
                                   password=config.Database.PASSWORD,
                                   database=config.Database.DATABASE)


# Route for getting child details
@app.route('/get_child_details/<int:child_id>', methods=["GET"])
@cross_origin()
def get_child_details(child_id):

    # SQL select
    cursor = database.cursor()
    cursor.execute(
        "SELECT id, latitude, longitude, name, full_address, phone_number, lessons_count, disconnects_per_lesson, missed_lessons, failures_count, needs, family_status, abandonment_degree FROM children WHERE id = {}"
        .format(child_id))
    result = cursor.fetchall()

    return jsonify(models.Child(*(result[0])).to_dict(True))


# Route for getting children
@app.route('/get_children', methods=["GET"])
@cross_origin()
def get_children():

    # SQL select
    cursor = database.cursor()
    cursor.execute("SELECT id, latitude, longitude FROM children")
    result = cursor.fetchall()

    # Process entries
    children = []
    for entry in result:
        children.append(models.Child(*entry).to_dict())

    return jsonify(children)


# Route for adding a new child
@app.route('/add_child', methods=["POST"])
@cross_origin()
def add_child():

    # Extract POST data
    data = request.form
    print(data)

    # Insert into database
    cursor = database.cursor()
    query = "INSERT INTO children (id, name, latitude, longitude, full_address, phone_number, lessons_count, disconnects_per_lesson, missed_lessons, failures_count, needs, family_status, abandonment_degree) VALUES (NULL, '{}', '{}', '{}', '{}', '{}', '0', '0', '0', '0', '{}', '{}', '0')".format(
        data["name"], data["latitude"], data["longitude"],
        data["full_address"], data["phone_number"], data["needs"],
        data["family_status"])
    cursor.execute(query)
    database.commit()

    return str(cursor.rowcount)


# Run web server
app.run(debug=True)