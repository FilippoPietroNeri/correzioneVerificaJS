from flask import Flask, jsonify, request, render_template
import pandas as pd

app = Flask(__name__)

dati_clienti = pd.read_csv('data/dati_clienti.csv')

@app.route('/')
def homepage():
    return render_template('index.html')

@app.route('/get_countries', methods=['GET'])
def get_countries():
    countries = dati_clienti['Country'].drop_duplicates().sort_values(ascending=True).to_list()
    return jsonify(countries)

@app.route('/get_cities/<country>', methods=['GET'])
def get_cities(country):
    cities_info = dati_clienti[dati_clienti['Country'] == country]
    city_counts = cities_info.groupby('City').count().reset_index(names=['Customers']).sort_values(by='Customers', ascending=False).to_dict('records')
    print(city_counts)
    return jsonify(city_counts)

@app.route('/get_customers', methods=['GET'])
def get_customers():
    city = request.args.get('city')
    customers_info = dati_clienti[dati_clienti['City'] == city]
    return jsonify(customers_info.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=32457, debug=True)