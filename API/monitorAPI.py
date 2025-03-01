import time
import subprocess
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuración de la API
API_URL = "https://127.0.0.1:8000/health"  # Cambia a tu URL real
CHECK_INTERVAL = 10  # Tiempo en segundos entre cada verificación
COMMAND = ["python", "-m", "uvicorn", "api:app", "--reload",
           "--ssl-keyfile", "key.pem", "--ssl-certfile", "cert.pem"]

def is_api_running():
    """ Verifica si la API responde correctamente. """
    try:
        response = requests.get(API_URL, timeout=5, verify=False)  # verify=False si usas SSL autofirmado
        return response.status_code == 200
    except requests.RequestException:
        return False

def restart_api():
    """ Reinicia la API si está caída. """
    print("[INFO] API caída. Reiniciando...")

    # Detiene procesos previos de Uvicorn
    subprocess.run(["taskkill", "/F", "/IM", "python.exe"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Inicia la API nuevamente
    subprocess.Popen(COMMAND, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("[INFO] API reiniciada.")

if __name__ == "__main__":
    print("[INFO] Iniciando monitor de API...")
    while True:
        if not is_api_running():
            restart_api()
        time.sleep(CHECK_INTERVAL)
