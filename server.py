from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect, url_for
import json
app = Flask(__name__)


# Load content
#with open('data/lessons.json') as f:
 #   lessons = json.load(f)

quizzes = {}

@app.route('/')
def home():
    return render_template('home.html')
@app.route('/quiz/<int:question_id>')
def show_quiz(question_id):
    with open('data/quizzes.json') as f:
        quizzes = json.load(f)
    
    # Find the current question
    question = next((q for q in quizzes['questions'] if q['id'] == question_id), None)
    
    if not question:
        return redirect(url_for('results'))
    
    # Calculate progress
    total = len(quizzes['questions'])

    print(total)

    progress = {
        'current': question_id,
        'total': total,
        'percent': int((question_id / total) * 100)
    }

    # Determine next question ID
    # Find the current question's index in the quiz
    current_index = next((index for index, q in enumerate(quizzes['questions']) if q['id'] == question_id), None)
    
    if current_index is not None and current_index + 1 < len(quizzes['questions']):
        next_id = quizzes['questions'][current_index + 1]['id']
    else:
        next_id = None  # No next question, end quiz or show results
    
    return render_template(
        question['template'],  # Dynamic template selection
        question=question,
        progress=progress,
        next_id=next_id
    )



# page 2-5, 10-11, learning material
@app.route('/start')
def learn_start():
    return render_template('learn_1.html')

@app.route('/learn/1')
def learn_1():
    return render_template('learn_1.html')

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

@app.route('/learn/6')
def learn_6():
    return render_template('learn_6.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
