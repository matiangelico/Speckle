import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from tensorflow import keras
from keras.layers import BatchNormalization, Dropout, Dense
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from keras.callbacks import EarlyStopping
from generadorImagenes import generaImagenMatrizConf

def entrenamientoRed (data, nro_clusters, params, epochs, batch_size, estopping):

    X = data[:,:-1]
    Y = data[:,-1] 

    X_train, X_temp, Y_train, Y_temp = train_test_split(X, Y, test_size=0.30, random_state=42)  
    X_val, X_test, Y_val, Y_test = train_test_split(X_temp, Y_temp, test_size=0.50, random_state=42)

    early_stopping = EarlyStopping(monitor='loss', patience=5, restore_best_weights=True)

    model = keras.Sequential([
        keras.layers.Input(shape = (X.shape[1],))
    ])

    for datos in params:
        model.add(Dense(int(datos[0]), activation='relu'))
        if int(datos[1]):
            model.add(BatchNormalization())
        if datos[2]!=0.:
            model.add(Dropout(datos[2]))

    model.add(Dense(nro_clusters, activation='softmax'))

    model.compile(optimizer='adam', loss='SparseCategoricalCrossentropy', metrics=['accuracy'])

    model.summary()
    
    callbacks = [early_stopping] if (estopping==1) else []
    
    model.fit(X_train, Y_train, validation_data=(X_val, Y_val), epochs=epochs, batch_size=batch_size, verbose=1, callbacks=callbacks)

    Y_pred = model.predict(X_test)

    Y_pred_classes = np.argmax(Y_pred, axis=1)  
    Y_true_classes = Y_test  

    conf_matrix = confusion_matrix(Y_true_classes, Y_pred_classes)

    imagen_conf_matrix = generaImagenMatrizConf.cmcm(conf_matrix, Y_true_classes, Y_pred_classes)

    return model, imagen_conf_matrix


