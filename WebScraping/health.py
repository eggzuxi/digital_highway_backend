import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# env파일 로드
load_dotenv()

client = MongoClient(os.getenv('DB_ATLAS_URL'))
db = client['information']
collection = db['health']

def scrape_and_update_mongodb():
  #저장할 데이터 리스트
  new_data = []
  for i in range (1, 5):
    response = requests.get('https://www.busan.go.kr/depart/health01?curPage={}'.format(i))
    rating_page = response.text

    soup = BeautifulSoup(rating_page, 'html.parser')

    title_tags = soup.select('tr')[1:]

    for tag in title_tags:
      title = tag.select_one('.title').get_text().strip()
      links = tag.find('a')
      link = links.get('href')
      select_tags = tag.select('td.pc_Y.ta_Y.mo_N')
      department = select_tags[2].get_text().strip()
      date = tag.select_one('.nowrap').get_text()
      item = {'title': title, 'department': department, 'date': date, 'link': 'https://www.busan.go.kr'+link}

      # MongoDB에 이미 저장된 데이터인지 확인
      if collection.find_one({'title' : title}) is None:
        #새로운 데이터만 추가
        collection.insert_one(item)
        new_data.append(item)

  return new_data

if __name__ == "__main__":
  new_data = scrape_and_update_mongodb()
  for item in new_data:
    print("New item added:", item)