import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# env파일 로드
load_dotenv()

client = MongoClient(os.getenv('DB_ATLAS_URL'))
db = client['information']
collection = db['finances']

def scrape_and_update_mongodb():
  #저장할 데이터 리스트
  new_data = []
  for i in range (1, 11):
    response = requests.get('https://blog.naver.com/PostList.naver?from=postList&blogId=fss2009&categoryNo=170&currentPage={}'.format(i))
    rating_page = response.text
    soup = BeautifulSoup(rating_page, 'html.parser')

    title_tags = soup.select('ul.thumblist > li.item')

    for tag in title_tags:
      title = tag.select_one('.title').get_text().strip()
      links = tag.find('a')
      link = links.get('href')
      department = "금융감독원"
      date = tag.select_one('.date').get_text()
      item = {'title': title, 'department': department, 'date': date, 'link': 'https://blog.naver.com'+link}

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