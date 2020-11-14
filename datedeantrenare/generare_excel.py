import pandas as pd
import numpy
data = {'lessons_count' : numpy.random.randint(low=15, high=25,size=90000),
        'disconnects_per_lesson' : numpy.random.normal(2,1.5,90000),
        'missed_lessons' : numpy.random.normal(3.0,2.0,90000),
        'failures_count' : numpy.random.uniform(0.0, 1.5,90000),
        'needs' : numpy.random.normal(2.0,1.5,90000),
        'family_status' : numpy.random.randint(2, size=90000),
        
}


df = pd.DataFrame(data,columns=['lessons_count','disconnects_per_lesson','missed_lessons','failures_count','needs','family_status', 'abandoment_degree'])

df.to_csv(r'dataframe.csv', index=False, header=True)