# import dependencies
from flask import Flask, jsonify, render_template, redirect
import requests
import json
import time
import pymongo
from pymongo import MongoClient
from config import *

app = Flask(__name__, static_folder='')
conn = uri
# connect to atlas
client = MongoClient(conn)

# home page
@app.route("/")
def index():
    # call locationsDB
    locationsDB = client.locationsDB
    # call states collection
    states = locationsDB.states
    locations = list(states.find({}))
    location_dict = {}
    for i in range(len(locations)):
        loc_dict = {}
        state_name = locations[i]['state']
        cities = locations[i]['cities']
        location_dict[state_name] = cities
    return render_template("index.html")

@app.route("/retrieve/locations/all/")
def get_locations():
    # call locationsDB
    locationsDB = client.locationsDB
    # call states collection
    states = locationsDB.states
    #sort trhough json
    locations = list(states.find({}))
    location_dict = {}
    for i in range(len(locations)):
        loc_dict = {}
        state_name = locations[i]['state']
        cities = locations[i]['cities']
        location_dict[state_name] = cities
    return jsonify(location_dict)

# Businesses Route
@app.route("/?businesses=<city>&type=existing/")
def get_businesses(city=None):
    # call locationsDB
    locationsDB = client.locationsDB
    # call states collection
    businesses = locationsDB.businesses
    # Read data from Atlas
    businesses_list = list(businesses.find( {"name":city} ))
    businesses_dict = {}
    return jsonify(businesses_dict)

# New City Route
@app.route("/?businesses=<city>&type=new/")
def get_new_location():
    # call locationsDB
    locationsDB = client.locationsDB
    # call states collection
    states = locationsDB.states
    # add scraping code here
    return("nothing")

if __name__ == "__main__":
    app.run(debug=True)