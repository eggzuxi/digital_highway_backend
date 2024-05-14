import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import re #정규식 사용하기 위한 라이브러리

# env파일 로드
load_dotenv()

client = MongoClient(os.getenv('DB_ATLAS_URL'))
db = client['information']
collection = db['careers']

def scrape_and_update_mongodb():
  #저장할 데이터 리스트
  new_data = []
  for i in range (1, 11):
    response = requests.get('https://www.work24.go.kr/wk/r/g/1110/retrieveEmpNewsList.do?currentPageNo={}&recordCountPerPage=10&searchRegionCd=&searchKwrd=&searchIntrstCoYn=N&searchStdt=&searchEndt=&sortOrderField=dtm&sortOrderBy=DESC'.format(i))
    rating_page = response.text

    soup = BeautifulSoup(rating_page, 'html.parser')

    title_tags = soup.select('.box_form_side')

    for tag in title_tags:
      title = tag.select_one('.title').get_text().strip()
      links = tag.find('a').get('onclick')
      link = re.search(r"fn_detail\('(.+?)'\)", links).group(1)
      select_tags = tag.select('.item.s1_r')
      press = select_tags[0].get_text().strip()
      date = select_tags[1].get_text().strip()
      item = {'title': title, 'press': press, 'date': date, 'link': 'https://m.work24.go.kr/wk/r/g/1110/retrieveEmpNewsDtl.do?currentPageNo={}&recordCountPerPage=10&newsId='.format(i)+link}
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