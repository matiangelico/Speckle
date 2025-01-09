import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from tensorflow import keras
from keras.layers import BatchNormalization, Dropout, Dense


def entrenamientoRed (X_train, Y_train, params):
    
    model = keras.Sequential([
        keras.layers.Input(shape=(X_train.shape[1],)), 
        keras.layers.Flatten(),  
    ])

    for datos in params:
        model.add(Dense(int(datos[0]), activation='relu'))
        if int(datos[1]):
            model.add(BatchNormalization())
        if datos[2]!=0.:
            model.add(Dropout(datos[2]))

    model.add(Dense(1, activation='linear')) #model.add(Dense(nro_clases, activation ='softmax'))

    model.compile(optimizer='adam', loss='mse', metrics=['mae'])

    model.summary()

    # Entrenar el modelo
    #model.fit(X_train, Y_train, epochs=1, batch_size=1, verbose=1)

    # Guardar el modelo entrenado
    #model.save("modelo_entrenado.h5")

    return model


