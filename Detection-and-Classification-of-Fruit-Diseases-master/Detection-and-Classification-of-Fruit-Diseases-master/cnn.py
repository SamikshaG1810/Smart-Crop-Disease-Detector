import numpy as np
import os
import cv2
from sklearn.model_selection import train_test_split
from sklearn import svm
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import MinMaxScaler
from sklearn.svm import LinearSVC

fruits_disease = ['Black spot', 'Canker', 'Greening', 'healthy', 'scab']

X = []
Y = []

for i in range(len(fruits_disease)):
    for root, dirs, directory in os.walk('FruitDataset/'+fruits_disease[i]):
        for j in range(len(directory)):
            img = cv2.imread('FruitDataset/'+fruits_disease[i]+"/"+directory[j])
            img = cv2.resize(img,(128,128))
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            pixel_vals = img.reshape((-1,3))
            pixel_vals = np.float32(pixel_vals)
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.85) 
            retval, labels, centers = cv2.kmeans(pixel_vals, 6, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS) 
            centers = np.uint8(centers) 
            segmented_data = centers[labels.flatten()]
            X.append(segmented_data.ravel())
            Y.append(i)
            print('FruitDataset/'+fruits_disease[i]+"/"+directory[j]+" "+str(X[j].shape))
                    
np.save("features/features.txt",X)
np.save("features/labels.txt",Y)


X = np.load("features/features.txt.npy")
Y = np.load("features/labels.txt.npy")
print(Y)

img = X[20].reshape(128,128,3)
cv2.imshow('ff',cv2.resize(img,(450,450)))
cv2.waitKey(0)

indices = np.arange(X.shape[0])
np.random.shuffle(indices)
X = X[indices]
Y = Y[indices]
'''
first = X.shape[0]
second = X.shape[1] * X.shape[2]
X.resize((first,second))
'''
print(X.shape)
print(Y.shape)

#scaler = MinMaxScaler()
#X = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size = 0.2, random_state = 0)
print(X_train.shape)
print(X_test.shape)

cls = svm.SVC(C=12,gamma='scale',kernel = 'rbf', random_state = 0)
cls.fit(X, Y)
prediction = cls.predict(X_test)
svm_acc = accuracy_score(y_test,prediction)*100
print(svm_acc)

arrs = ['Black spot (14).jpg','Canker (74).jpg','Greening (2).jpg','Healthy (14).jpg','scab.jpg']
for i in range(len(arrs)):
    img = cv2.imread('testImages/'+arrs[i])
    img = cv2.resize(img,(128,128))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pixel_vals = img.reshape((-1,3))
    pixel_vals = np.float32(pixel_vals)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.85) 
    retval, labels, centers = cv2.kmeans(pixel_vals, 6, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS) 
    centers = np.uint8(centers) 
    segmented_data = centers[labels.flatten()]
    temp = []
    temp.append(segmented_data.ravel())
    temp = np.array(temp)
    predict = cls.predict(temp)[0]
    print(str(predict)+" "+fruits_disease[predict])

