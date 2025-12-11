from flask import Blueprint, render_template
# Cria o Blueprint
bp_home = Blueprint('home', __name__)

@bp_home.route('/')
def index():
    # Renderiza o template index.html localizado na pasta 'templates'
    return render_template("index.html")