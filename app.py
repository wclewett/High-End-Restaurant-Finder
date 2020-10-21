# import dependencies
from flask import Flask, jsonify, render_template, redirect
import requests
import json
import time
import pymongo
from pymongo import MongoClient
from config import *

app = Flask(__name__)
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
        state_name = locations[i]['state']
        cities = locations[i]['cities']
        location_dict[state_name] = cities
    payload = {
        "locations": location_dict,
        "businesses": None
    }
    return render_template("index.html", data=payload)

# Businesses Route
@app.route("/businesses/<state>/<city>")
def pullBusinesses(city=None, state=None):
    print(city)
    # call locationsDB
    locationsDB = client.locationsDB
    # call states collection
    states = locationsDB.states
    locations = list(states.find({}))
    location_dict = {}
    for i in range(len(locations)):
        state_name = locations[i]['state']
        cities = locations[i]['cities']
        location_dict[state_name] = cities
        # call coordinates
        if locations[i]['state'] == state:
            for j in range(len(locations[i]['cities'])):
                if locations[i]['cities'][j]['name'] == city:
                    coordinates_dict = {}
                    coordinates_dict['loc'] = locations[i]['cities'][j]['coordinates']
    # call business collection
    businesses = locationsDB.businesses
    # Read data from Atlas
    businesses_list = list(businesses.find({"state": state, "city": city}))
    businesses_dict = []
    for i in range(len(businesses_list)):
        business = {}
        restaurant_name = businesses_list[i]['restaurant']['restaurant_name']
        try:
            location = businesses_list[i]['restaurant']['restaurant_location']
        except:
            continue
        try:
            rating = businesses_list[i]['restaurant']['restaurant_rating']
        except:
            rating = None
        try:
            popularity = businesses_list[i]['restaurant']['restaurant_popularity']
        except:
            popularity = None
        try:
            url = businesses_list[i]['restaurant']['restaurant_url']
        except:
            None
        try:
            address = businesses_list[i]['restaurant']['restaurant_address']
        except:
            address = None
        try:
            phone = businesses_list[i]['restaurant']['restuarant_phone']
        except:
            phone = None
        try:
            tags = businesses_list[i]['restaurant']['restaurant_tags']
        except:
            tags = None
        business['restaurant_name'] = restaurant_name
        business['location'] = location
        business['rating'] = rating
        business['popularity'] = popularity
        business['url'] = url
        business['address'] = address
        business['phone'] = phone
        business['tags'] = tags
        businesses_dict.append(business)
    payload = {
        "locations": location_dict,
        "businesses": businesses_dict,
        "coordinates": coordinates_dict,
        "city": city,
        "state": state
    }
    return render_template("layout.html", data=payload)

# Pull Business Data for Graph
@app.route("/businesses/<state>/<city>/graph")
def pullGraphData(state=None, city=None):
    # call locationsDB
    locationsDB = client.locationsDB
    # call business collection
    businesses = locationsDB.businesses
    # Read data from Atlas
    businesses_list = list(businesses.find({"state": state, "city": city}))
    businesses_dict = []
    for i in range(len(businesses_list)):
        business = {}
        restaurant_name = businesses_list[i]['restaurant']['restaurant_name']
        try:
            location = businesses_list[i]['restaurant']['restaurant_location']
        except:
            continue
        try:
            rating = businesses_list[i]['restaurant']['restaurant_rating']
        except:
            rating = None
        try:
            popularity = businesses_list[i]['restaurant']['restaurant_popularity']
        except:
            popularity = None
        try:
            url = businesses_list[i]['restaurant']['restaurant_url']
        except:
            None
        try:
            address = businesses_list[i]['restaurant']['restaurant_address']
        except:
            address = None
        try:
            phone = businesses_list[i]['restaurant']['restuarant_phone']
        except:
            phone = None
        try:
            tags = businesses_list[i]['restaurant']['restaurant_tags']
        except:
            tags = None
        business['restaurant_name'] = restaurant_name
        business['location'] = location
        business['rating'] = rating
        business['popularity'] = popularity
        business['url'] = url
        business['address'] = address
        business['phone'] = phone
        business['tags'] = tags
        businesses_dict.append(business)
    payload = {
        "businesses": businesses_dict
    }
    return jsonify(payload)

if __name__ == "__main__":
    app.run(debug=True)