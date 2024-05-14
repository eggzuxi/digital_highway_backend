# 드롭다운 형식

from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# JSON 파일 경로
json_file_path = "json_file/digital_highway_info_dataset_first3.json"




# 홈 페이지 렌더링
@app.route("/")
def home():
    return render_template("option.html")

# with open(json_file_path, "r", encoding="utf-8") as file:
#     json_data = json.load(file)




@app.route('/chatbot', methods=['POST'])
def chatbot_response():
    user_choice = request.form['user_choice']

    with open(json_file_path, "r", encoding="utf-8") as file:
        json_data = json.load(file)

    # 선택에 따른 챗봇 응답 생성
    if user_choice in json_data:
        response = response[user_choice]
    else:
        return "죄송합니다, 해당 질문에 대한 답변이 없습니다."

    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
