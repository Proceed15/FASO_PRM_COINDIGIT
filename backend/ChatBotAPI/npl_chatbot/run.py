from flask import Flask, render_template
from flask_cors import CORS
from controllers.analysis_controller import bp_analysis

def create_app():
    app = Flask(__name__)
    CORS(app)  # <<< POLITICA DO CORS

    app.register_blueprint(bp_analysis)

    @app.route("/")
    def home():
        return render_template("index.html")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5005, debug=True)

