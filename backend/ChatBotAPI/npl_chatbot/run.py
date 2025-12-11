from flask import Flask
from flask_cors import CORS

# Importa os Blueprints dos controllers
from controllers.analysis_controller import bp_analysis
from controllers.home_controller import bp_home

def create_app():
    app = Flask(__name__)
    CORS(app)  # Habilita CORS para todas as rotas

    # Registra os Blueprints
    app.register_blueprint(bp_home)
    app.register_blueprint(bp_analysis)

    return app

if __name__ == "__main__":
    app = create_app()
    # Mantive a porta 5005 conforme seu arquivo anterior
    app.run(host="0.0.0.0", port=5005, debug=True)