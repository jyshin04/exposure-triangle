from flask import Flask
from flask import render_template
from flask import redirect, url_for, session, jsonify, request
import secrets
import json
from datetime import datetime
app = Flask(__name__)

app.secret_key = secrets.token_hex(32)

# Make request object available in templates
@app.context_processor
def inject_request():
    return {'request': request}

def log_access(page_name):
    if 'page_access_log' not in session:
        session['page_access_log'] = {}

    session['page_access_log'][page_name] = datetime.now().isoformat()
    session.modified = True  # Ensures Flask saves the session changes



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



# page 2-5, 10-12, learning material
@app.route('/start')
def learn_start():
    log_access('learn_1')
    return render_template('learn_1.html')

@app.route('/learn/1')
def learn_1():
    log_access('learn_1')
    return render_template('learn_1.html')

@app.route('/learn/2')
def learn_2():
    log_access('learn_2')
    return render_template('learn_2.html')

@app.route('/learn/3')
def learn_3():
    log_access('learn_3')
    return render_template('learn_3.html')

@app.route('/learn/4')
def learn_4():
    log_access('learn_4')
    return render_template('learn_4.html')

@app.route('/learn/5')
def learn_5():
    log_access('learn_5')
    return render_template('learn_5.html')

@app.route('/learn/6')
def learn_6():
    log_access('learn_6')
    return render_template('learn_6.html')

@app.route('/learn/7')
def learn_7():
    log_access('learn_7')
    return render_template('learn_7.html')

@app.route('/learn/8')
def learn_8():
    log_access('learn_8')
    return render_template('learn_8.html')

@app.route('/session-log')
def show_session_log():
    return jsonify(session.get('page_access_log', {}))

@app.route('/save_quiz_result', methods=['POST'])
def save_quiz_result():
    data = request.json
    question_id = str(data['question_id'])  # Store as string for session
    is_correct = data['correct']

    # Initialize the session dictionary if not there
    if 'quiz_results' not in session:
        session['quiz_results'] = {}

    # Save the result
    session['quiz_results'][question_id] = {
        'correct': is_correct,
    }
    session.modified = True

    return jsonify({"status": "saved", "results": session['quiz_results']})



@app.route('/quiz_results')
def view_quiz_results():
    return jsonify(session.get('quiz_results', {}))



@app.route('/learn/9')
def learn_9():
    return render_template('learn_9.html')

@app.route('/learn/10')
def learn_10():
    return render_template('learn_10.html')

@app.route('/learn/11')
def learn_11():
    return render_template('learn_11.html')

@app.route('/finish')
def finish():
    return render_template('finish.html')


if __name__ == '__main__':
    app.run(debug=True, port=5001)
