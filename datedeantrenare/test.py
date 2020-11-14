import pandas as pd
import pickle
from sklearn import linear_model
training_dataset = pd.read_csv("dataset.csv")

regression_model = linear_model.LinearRegression()
print ("Training model...")

regression_model.fit(training_dataset[['lessons_count','disconnects_per_lesson', 'missed_lessons', 'failures_count', 'needs', 'family_status']], training_dataset.abandoment_degree) 
print ("Model trained.")



proped_price = regression_model.predict([[22,1,1,1,1,1]])
print (proped_price)

print ("Model trained. Saving model to area_model.pickle")
with open("area_model.pickle", "wb") as file:
    pickle.dump(regression_model, file)
print ("Model saved.")