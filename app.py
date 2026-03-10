import os
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

# MongoDB Verbindung
client = MongoClient(os.environ["MONGODB_URI"])
db = client["diplomarbeit"]
items = db["items"]
print("Mongo ping:", client.admin.command("ping"))
print("Mongo host:", client.address)

# —————————————————————————————————————————————————————————————————————
# Helper Funktionen
# —————————————————————————————————————————————————————————————————————

def doc_to_json(d):
    """Konvertiert MongoDB Dokument zu JSON-kompatiblem Dict"""
    d["id"] = str(d["_id"])
    del d["_id"]
    return d

# —————————————————————————————————————————————————————————————————————
# API-Routen
# —————————————————————————————————————————————————————————————————————

@app.get("/api/projects")
def api_get_projects():
    """Projekte abrufen (optional gefiltert nach Modul)"""
    module = request.args.get("module")
    query = {"module": module} if module else {}
    docs = list(items.find(query).sort("_id", -1))
    return jsonify([doc_to_json(d) for d in docs])

@app.post("/api/projects")
def api_add_project():
    """Neues Projekt hinzufügen"""
    data = request.get_json(force=True) or {}
    if not data:
        return jsonify({"error": "no data"}), 400

    # Keine eigene id in Mongo speichern (du bekommst _id)
    data.pop("id", None)

    res = items.insert_one(data)
    saved = items.find_one({"_id": res.inserted_id})
    return jsonify(doc_to_json(saved)), 201

@app.delete("/api/projects/<project_id>")
def api_delete_project(project_id):
    """Projekt löschen"""
    try:
        oid = ObjectId(project_id)
    except Exception:
        return jsonify({"error": "invalid id"}), 400

    r = items.delete_one({"_id": oid})
    return jsonify({"deleted": r.deleted_count == 1})

@app.patch("/api/projects/<project_id>")
def api_update_project(project_id):
    """Projekt aktualisieren (z.B. Sichtbarkeit ändern)"""
    try:
        oid = ObjectId(project_id)
    except Exception:
        return jsonify({"error": "invalid id"}), 400
    
    data = request.get_json(force=True) or {}
    if not data:
        return jsonify({"error": "no data"}), 400
    
    # Update durchführen
    items.update_one({"_id": oid}, {"$set": data})
    updated = items.find_one({"_id": oid})
    
    if not updated:
        return jsonify({"error": "not found"}), 404
    
    return jsonify(doc_to_json(updated))

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

# —————————————————————————————————————————————————————————————————————
# App starten
# —————————————————————————————————————————————————————————————————————

if __name__ == '__main__':
    app.run(debug=True)