#!/usr/bin/env python3

from sklearn import svm
import pandas as pd
import pickle

# Read training set
training_dataset = pd.read_csv("dataset.csv")

# Create a liniar regression model that fits input data
regression_model = svm.SVR()
print("[*] Starting model training")
regression_model.fit(
    training_dataset[[
        'lessons_count', 'disconnects_per_lesson', 'missed_lessons',
        'failures_count', 'needs', 'family_status'
    ]], training_dataset.abandoment_degree)
print("[+] Model trained!")

# Get an example prediction
input_data = [22, 1, 1, 1, 1, 1]
price = regression_model.predict([input_data])
print("[*] An example of prediction is {}, for input data of {}.".format(
    price, input_data))

# Save the model
with open("svm.pickle", "wb") as file:
    pickle.dump(regression_model, file)
print("[+] Model saved to pickle file!")