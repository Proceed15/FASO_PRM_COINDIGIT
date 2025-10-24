from flask import Flask, render_template
from controllers.analysis_controller import bp_analysis

def create_app():
    app = Flask(__name__)
    app.register_blueprint(bp_analysis)

    @app.route("/")
    def home():
        return render_template("index.html")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)