from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)


# Load content
#with open('data/lessons.json') as f:
 #   lessons = json.load(f)

#with open('data/quizzes.json') as f:
  #  quizzes = json.load(f)

@app.route('/')
def home():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
