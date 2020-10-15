# import dependencies
from flask import Flask, jsonify
import requests
import pandas as pd
import json
import time
import pymongo
from pymongo import MongoClient
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

conn = "mongodb+srv://wclewett:L3nPsktH9pGcO69X@yelphighendcluster.u2fcy.gcp.mongodb.net/highEnd?retryWrites=true&w=majority"
# connect to atlas
client = MongoClient(conn)

# home page
@app.route("/")
def index():
    return("Welcome to our restaurant finder!")

@app.route("/locations/states")
def get_locations():
    # call locationsDB
    locationsDB = client.locationsDB
    # call states collection
    states = locationsDB.states
    # Read data from Atlas
    states_list = list(states.find({}))
    return states_list

# Businesses Route
@app.route("/locations/businesses/<city>")
def get_businesses(city=None):
    # call locationsDB
    locationsDB = client.locationsDB
    # call states collection
    businesses = locationsDB.businesses
    # Read data from Atlas
    businesses_list = list(businesses.find( {"name":city} ))    
    return (f"{businesses_list}")

# New City Route
@app.route("/locations/newBusiness/<city>")
def get_new_location():
    # call locationsDB
    locationsDB = client.locationsDB
    # call states collection
    states = locationsDB.states
    # add craping code here
    return("nothing")

if __name__ == "__main__":
    app.run(debug=True)