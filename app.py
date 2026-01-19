import random
from flask import Flask, render_template, request, jsonify
from fuzzywuzzy import fuzz

app = Flask(__name__)


# —————————————————————————————————————————————————————————————————————
# Seiten-Routen
# —————————————————————————————————————————————————————————————————————

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/drehen_info')
def drehen_info():
    return render_template('Info/drehen_info.html')

@app.route('/automatisierungstechnik_info')
def automatisierungstechnik_info():
    return render_template('Info/automatisierungstechnik_info.html')

@app.route('/automatisierungstechnik_projekte')
def automatisierungstechnik_projekte():
    return render_template('Projekte/automatisierungstechnik_projekte.html')

@app.route('/wifi_projekte')
def wifi_projekte():
    return render_template('Projekte/wifi_projekte.html')

@app.route('/3d_druck_info')
def Drei_D_Druck_info():
    return render_template('Info/3d_druck_info.html') 

@app.route('/3d_druck_projekte')
def Drei_D_Druck_Projekte():
    return render_template('Projekte/3d_druck_projekte.html')

@app.route('/cad_info')
def cad_info():
    return render_template('Info/cad_info.html')

@app.route('/cad_projekte')
def cad_projekte():
    return render_template('Projekte/cad_projekte.html')

@app.route('/ueber_uns_info')
def ueber_uns():
    return render_template('Info/ueber_uns_info.html')

@app.route('/artificial_intelligence_info')
def artificial_intelligence_info():
    return render_template('Info/ai_info.html')

@app.route('/artificial_intelligence_projekte')
def artificial_intelligence_projekte():
    return render_template('Projekte/ai_projekte.html')

@app.route('/smartlab_info')
def smartlab_info():
    return render_template('Info/smartlab_info.html')

@app.route('/smartlab_projekte')
def smartlab_projekte():
    return render_template('Info/smartlab_projekte.html')

@app.route('/lasertechnik_info')
def lasertechnik_info():
    return render_template('Info/lasertechnik_info.html')

@app.route('/lasertechnik_projekte')
def lasertechnik_projekte():
    return render_template('Projekte/lasertechnik_projekte.html')

@app.route('/cae_info')
def cae_info():
    return render_template('Info/cae_info.html')

@app.route('/cae_projekte')
def cae_projekte():
    return render_template('Projekte/cae_projekte.html')

if __name__ == '__main__':
    app.run(debug=True)