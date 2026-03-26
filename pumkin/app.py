from flask import Flask, render_template, request, redirect, url_for, session, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import os
import random
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'romantic-secret-key-123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///birthday_surprise.db'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max upload

db = SQLAlchemy(app)

# Models
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

class Moment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    caption = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Memory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_filename = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Ensure upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Create tables and default admin
with app.app_context():
    db.create_all()
    if not Admin.query.filter_by(username='admin').first():
        hashed_pw = generate_password_hash('love2026')
        new_admin = Admin(username='admin', password=hashed_pw)
        db.session.add(new_admin)
        db.session.commit()

# --- Routes ---

@app.route('/')
def index():
    moments = Moment.query.order_by(Moment.created_at.desc()).all()
    videos = Video.query.order_by(Video.created_at.desc()).all()
    memories = Memory.query.order_by(Memory.date).all()
    
    mixed_videos = []
    for v in videos:
        if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], v.filename)):
            mixed_videos.append({'type': 'upload', 'filename': v.filename, 'title': v.title})
            
    static_videos_dir = 'static/videos'
    if os.path.exists(static_videos_dir):
        for f in os.listdir(static_videos_dir):
            if f.lower().endswith(('.mp4', '.mov', '.mkv', '.webm')):
                mixed_videos.append({'type': 'static', 'filename': f, 'title': ''})

    
    # Mix dynamic and static moments
    mixed_moments = []
    for m in moments:
        if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], m.filename)):
            mixed_moments.append({'type': 'upload', 'filename': m.filename, 'caption': m.caption})
    
    for i in range(1, 11):
        static_filename = f"{i}.jpeg"
        if os.path.exists(os.path.join('static/images', static_filename)):
            mixed_moments.append({'type': 'static', 'filename': static_filename, 'caption': None})
    
    random.shuffle(mixed_moments)
    
    return render_template('index.html', moments=mixed_moments, videos=mixed_videos, memories=memories)

# --- Admin Routes ---

@app.route('/admin/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        admin = Admin.query.filter_by(username=username).first()
        if admin and check_password_hash(admin.password, password):
            session['logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        flash('Invalid credentials!', 'danger')
    return render_template('login.html')

@app.route('/admin/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

@app.route('/admin')
def admin_dashboard():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('admin.html')

@app.route('/admin/upload/moment', methods=['POST'])
def upload_moment():
    if not session.get('logged_in'): return redirect(url_for('login'))
    file = request.files.get('file')
    caption = request.form.get('caption')
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        new_moment = Moment(filename=filename, caption=caption)
        db.session.add(new_moment)
        db.session.commit()
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/upload/video', methods=['POST'])
def upload_video():
    if not session.get('logged_in'): return redirect(url_for('login'))
    file = request.files.get('file')
    title = request.form.get('title')
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        new_video = Video(filename=filename, title=title)
        db.session.add(new_video)
        db.session.commit()
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/add/memory', methods=['POST'])
def add_memory():
    if not session.get('logged_in'): return redirect(url_for('login'))
    date = request.form.get('date')
    title = request.form.get('title')
    desc = request.form.get('description')
    file = request.files.get('file')
    
    filename = None
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
    new_memory = Memory(date=date, title=title, description=desc, image_filename=filename)
    db.session.add(new_memory)
    db.session.commit()
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/delete/<string:type>/<int:id>')
def delete_content(type, id):
    if not session.get('logged_in'): return redirect(url_for('login'))
    if type == 'moment':
        item = Moment.query.get(id)
    elif type == 'video':
        item = Video.query.get(id)
    elif type == 'memory':
        item = Memory.query.get(id)
    
    if item:
        # Optionally remove physical file
        # file_path = os.path.join(app.config['UPLOAD_FOLDER'], item.filename)
        # if os.path.exists(file_path): os.remove(file_path)
        db.session.delete(item)
        db.session.commit()
    return redirect(url_for('admin_dashboard'))

if __name__ == '__main__':
    app.run(debug=True)
