import random
from flask import Flask, render_template, request, jsonify
from fuzzywuzzy import fuzz

app = Flask(__name__)

# —————————————————————————————————————————————————————————————————————
# AI-Assistent-Logik
# —————————————————————————————————————————————————————————————————————

def normalize_question(question):
    return question.lower().strip().replace("?", "")

def is_meaning_of_life_question(question):
    related = [
        "what is the meaning of life", "meaning of life", "what is life about",
        "why do we exist", "what is the world about", "why were we born",
        "purpose of life", "why are we here", "what's life all about",
        "purpose of existence"
    ]
    norm = normalize_question(question)
    return any(fuzz.partial_ratio(norm, phrase) > 75 for phrase in related)

ayri_responses = [
    "ja er ist der größte ayri",
    "absolut, er ist ein echter ayri",
    "ohne Frage, er ist der ayri Nr. 1",
    "definitiv, er ist ein unvergleichlicher ayri",
    "natürlich, keiner ist so ein ayri wie er",
    "Ja, er kann meine Eier lutschen"
]

greetings = [
    "Hallo! Wie kann ich Ihnen heute weiterhelfen?",
    "Hi! Was kann ich für Sie tun?",
    "Guten Tag! Wie darf ich Ihnen behilflich sein?"
]

ask_gender_msgs = [
    "Bitte geben Sie Ihr Geschlecht ein (male/female)",
    "Könnten Sie mir bitte Ihr Geschlecht mitteilen (male/female)?",
    "Teilen Sie mir bitte Ihr Geschlecht mit (male/female)"
]

response_female = [
    "The meaning of life is 41.",
    "Für Frauen: Das Leben bedeutet 41.",
    "Ihre Antwort lautet: 41."
]

response_male = [
    "The meaning of life is 42.",
    "Für Männer: Das Leben bedeutet 42.",
    "Ihre Antwort lautet: 42."
]

unknown_response = [
    "Ich konnte die Antwort leider nicht ermitteln.",
    "Leider habe ich keine passende Antwort gefunden.",
    "Entschuldigung, aber ich weiß nicht, wie ich darauf antworten soll."
]

error_messages = [
    "Es gab einen Fehler bei der Anfrage.",
    "Leider ist ein Fehler aufgetreten.",
    "Da ist etwas schiefgelaufen."
]

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data     = request.get_json()
        question = data.get('question', '')
        gender   = data.get('gender')
        norm     = normalize_question(question)

        # Ayri-Check
        if fuzz.partial_ratio(norm, "furkan") > 75 and fuzz.partial_ratio(norm, "ayri") > 40:
            return jsonify({"response": random.choice(ayri_responses)})

        # Meaning-of-life
        if is_meaning_of_life_question(question):
            if gender:
                if gender.lower() == "female":
                    return jsonify({"response": random.choice(response_female)})
                elif gender.lower() == "male":
                    return jsonify({"response": random.choice(response_male)})
                else:
                    return jsonify({"response": random.choice(unknown_response)})
            return jsonify({"ask_gender": True, "response": random.choice(ask_gender_msgs)})

        # Fallback
        return jsonify({"response": random.choice(unknown_response)})
    except Exception:
        return jsonify({"response": random.choice(error_messages)})

# —————————————————————————————————————————————————————————————————————
# Seiten-Routen
# —————————————————————————————————————————————————————————————————————

@app.route('/')
def home():
    greeting = random.choice(greetings)
    return render_template('index.html', greeting=greeting)

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
