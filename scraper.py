import json, requests
from bs4 import BeautifulSoup

def retrieve_data(url):
    data = []
    r = requests.get(url, auth=('user', 'pass'))
    soup = BeautifulSoup(r.text, 'lxml')

    data_obj = json.loads(soup.get_text())
    for entry in data_obj:
        data.append([entry['state'], entry['positive'], entry['death'], entry['recovered']])

    with open('data.json', 'w') as f:
        json.dump(data, f)

if __name__ == '__main__':
    retrieve_data('https://covidtracking.com/api/v1/states/current.json')