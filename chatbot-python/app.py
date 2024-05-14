from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# JSON 파일 경로
json_file_path = "json_file/digital_highway_info_dataset_first3.json"

# JSON 파일 로드
with open(json_file_path, "r", encoding="utf-8") as file:
    json_data = json.load(file)

# 질문에 대한 답변을 찾는 함수
def get_response(user_question):
    for item in json_data:
        if item["inputs"].lower() == user_question.lower():
            return item["response"]
    return "로딩중... 해당 질문에 대한 답변이 없습니다."

# 홈 페이지 렌더링
@app.route("/")
def home():
    # return render_template("index.html")
    return render_template("index.html")

# 챗봇 API 엔드포인트
@app.route("/chatbot", methods=["POST"])
def chatbot():
    user_question = request.form["user_question"]
    response = get_response(user_question)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
