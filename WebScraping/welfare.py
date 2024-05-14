import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from selenium.common.exceptions import StaleElementReferenceException #오류 모듈

# 자동화 감지 방지 옵션
options = Options()
options.add_argument('--disable-blink-features=AutomationControlled')
driver = webdriver.Chrome(options=options)
driver.implicitly_wait(3)

# env파일 로드
load_dotenv()

client = MongoClient(os.getenv('DB_ATLAS_URL'))
db = client['information']
collection = db['welfares']

def scrape_and_update_mongodb():
  # 웹페이지 해당 주소 이동
  driver.get('https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52005M.do')
  driver.implicitly_wait(1)

  wait = WebDriverWait(driver, 10)
  new_data = []

  for j in range(1, 6):
    content = wait.until(EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".wlfare-list-card")))
    #저장할 데이터 리스트
    i = 0
    print(len(content))
    while i < len(content): 
      try:
        title = content[i].find_element(By.CSS_SELECTOR,'.new-card-tit').text.strip()
        tags = content[i].find_elements(By.CSS_SELECTOR,'.cont-val')
        department = tags[0].text.strip()
        support = tags[1].text.strip()
        service = tags[2].text.strip()
        tel = tags[3].text.strip()
        element = content[i].find_element(By.CSS_SELECTOR,'a.cl-text-wrapper')
        driver.execute_script("arguments[0].click()", element)
        time.sleep(1)
        link = driver.current_url
        driver.back()
        time.sleep(1)
        item = {'title': title, 'department': department, 'support': support, 'service': service, 'tel': tel, 'link': link}
        
        if j>1:
          pages = driver.find_element(By.CSS_SELECTOR,'.cl-pageindexer-index-area')
          selectPage = pages.find_elements(By.CSS_SELECTOR, '.cl-pageindexer-index')
          selectPage[j-1].click()
          time.sleep(1)
        content = wait.until(EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".wlfare-list-card")))
        

        # MongoDB에 이미 저장된 데이터인지 확인
        if collection.find_one({'title' : title}) is None:
          #새로운 데이터만 추가
          print(item)
          collection.insert_one(item)
          new_data.append(item)
      except StaleElementReferenceException:
        continue
      i += 1

    pages = driver.find_element(By.CSS_SELECTOR,'.cl-pageindexer-index-area')
    selectPage = pages.find_elements(By.CSS_SELECTOR, '.cl-pageindexer-index')
    selectPage[j].click()
    time.sleep(1)

  driver.quit()
  return new_data

if __name__ == "__main__":
  new_data = scrape_and_update_mongodb()
  for item in new_data:
    print("New item added:", item)