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


# page 2-5, learning material
@app.route('/start')
def learn_start():
    return render_template('learn_2.html')

@app.route('/learn/2')
def learn_2():
    return render_template('learn_2.html')

@app.route('/learn/3')
def learn_3():
    return render_template('learn_3.html')

@app.route('/learn/4')
def learn_4():
    return render_template('learn_4.html')

@app.route('/learn/5')
def learn_5():
    return render_template('learn_5.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
