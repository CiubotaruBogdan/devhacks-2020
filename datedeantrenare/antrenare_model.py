import pandas as pd
import pickle
from sklearn import linear_model
import matplotlib.pyplot as plt
training_dataset = pd.read_csv("dataset1.csv")

regression_model = linear_model.LinearRegression()
print ("Training model...")

regression_model.fit(training_dataset[['lessons_count','disconnects_per_lesson', 'missed_lessons', 'failures_count', 'needs', 'family_status']], training_dataset.abandoment_degree) 
print ("Model trained.")
print(regression_model.intercept_)
print(regression_model.coef_)


proped_price = regression_model.predict([[22,3,4,1,1,0]])
print (proped_price)


print ("Model trained. Saving model to area_model.pickle")
with open("area_model.pickle", "wb") as file:
    pickle.dump(regression_model, file)
print ("Model saved.")

plt.scatter(training_dataset.abandoment_degree,training_dataset.lessons_count, color='red')
plt.title('Stock Index Price Vs Interest Rate', fontsize=14)
plt.xlabel('lessons_count', fontsize=14)
plt.ylabel('needs', fontsize=14)
plt.grid(True)
plt.show()