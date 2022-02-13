from os import path
import requests
import vk_api
import time
import flask
import json
from sql import nSQL
from threading import Thread
from urllib3.request import urlencode
from urllib.parse import urlparse, parse_qsl
from hmac import HMAC
from hashlib import sha256
from base64 import b64encode
from collections import OrderedDict
from flask import request, Flask
from config import *
## pip install requests vk_api flask


vk_ = vk_api.VkApi(token = service_token).get_api()
sql = nSQL(host, login, password, db)
class Global:
	pass
exp = Global()

def is_valid(*, query: dict, secret: str):
    vk_subset = OrderedDict(sorted(x for x in query.items() if x[0][:3] == "vk_"))
    hash_code = b64encode(HMAC(secret.encode(), urlencode(vk_subset, doseq=True).encode(), sha256).digest())
    decoded_hash_code = hash_code.decode('utf-8')[:-1].replace('+', '-').replace('/', '_')
    return query["sign"] == decoded_hash_code
def check_sign(url, id, client_secret):
	try:
		id = str(id)
		query_params = dict(parse_qsl(urlparse(url).query, keep_blank_values=True))
		status = is_valid(query=query_params, secret=client_secret)
		if status and query_params["vk_app_id"] == id and (time.time() - int(query_params["vk_ts"])) <= 4*3600:
			return True
	except Exception as err:
		print(err)

def get_expert_token(token):
        params = {
            "source_url": "https://static.vk.com/experts/?vk_access_token_settings=notify,menu",
            "redirect_uri": "https://oauth.vk.com/blank.html",
            "client_id": 7171491,
            "vk_app_id": 7171491,
            "access_token": token,
            "response_type": "token",
            "v": "5.124",
        }
        url = requests.get("https://oauth.vk.com/authorize", params=params).url
        expert_token = url.split("access_token")[1].split("=")[1].split("&")[0]
        return expert_token


def get_chart(token, type):
	url = "https://api.vk.com/method/experts.getChart"
	a = requests.post(url, params = {"api_id": 7171491, "method": "experts.getChart", "format": "json", "v": "5.124", "access_token": token, "offset": 0, "chart_type": type, "limit":500000}).json()
	if "response" in a:
		return a["response"]["chart"]
	else:
		print("GETTING CHART ERROR:", a)
	
def get_topics():
	res = sql.db_get("SELECT id,russian_name FROM topics")
	exp.topics_russian = {i['russian_name']: i['id'] for i in res}
	exp.topics_count = {i['id']: 0 for i in res}
def update_experts():
	while True:
		# try:
			exp_token = get_expert_token(user_token)
			get_topics()
			exp.experts_ = {}
			for i in get_chart(exp_token, "total"):
				exp.experts_[i["user_id"]] = i
				topic_name = i['topic_name']
				exp.topics_count[exp.topics_russian[topic_name]] += 1
			for topic in exp.topics_count:
				sql.query("UPDATE topics SET count=%s WHERE id=%s", (exp.topics_count[topic], topic))
			st = 0
			for i in ["current_month", "current_week", "current_day", "previous_week"]:
				data = get_chart(exp_token, i)
				for d in data:
					if d["user_id"] not in exp.experts_:
						exp.experts_[d["user_id"]] = {"user_id": d["user_id"], "actions_count": -1, "position": -1, "topic_name": d["topic_name"]}
						st += 1
					exp.experts_[d["user_id"]]["actions_" + i] = d["actions_count"]
			st2 = 0
			for i in exp.experts_.keys():
				for j in ["current_month", "current_week", "current_day", "previous_week"]:
					j = "actions_" + j
					if j not in exp.experts_[i]:
						exp.experts_[i][j] = -1
						st2 += 1
			exp.experts = dict(exp.experts_)

			top = list(exp.experts_.values())
			top.sort(key = lambda x: x["actions_current_week"], reverse = True)
			top2 = {}
			for i in top:
				if i["topic_name"] not in top2:
					top2[i["topic_name"]] = []
				if len(top2[i["topic_name"]]) < 10:
					top2[i["topic_name"]].append(i)
			best = max([i[0] for i in top2.values()], key = lambda x: x["actions_current_week"])["user_id"]
			for i in top2.keys():
				for j in range(len(top2[i])):
					if top2[i][j]["user_id"] == best:
						top2[i][j]["is_best"] = True
					else:
						top2[i][j]["is_best"] = False
			for i in exp.experts_.keys():
				if exp.experts_[i]["user_id"] == best:
					exp.experts_[i]["is_best"] = True
				else:
					exp.experts_[i]["is_best"] = False
			top2["keys"] = list(top2.keys())
			users = []
			for i in top2["keys"]:
				users.extend([i["user_id"] for i in top2[i]])
			data = vk_.users.get(user_ids = ",".join(map(str, users)), fields = "photo_max_orig")
			top2["users_data"] = {i["id"]: i for i in data}
			exp.top2 = dict(top2)
	
			print("Обновил список экспертов:", len(exp.experts), "странных:", st, st2)
			time.sleep(3600)
		# except Exception as err:
		# 	print(err)
		# 	time.sleep(600)

def get_exp(id):
	if id in exp.experts:
		return {"is_expert": True, "info": exp.experts[id]}
	else:
		return {"is_expert": False, "info": {"user_id": id}}

thread = Thread(target=update_experts, daemon = True)
thread.start()

def prepare_api_response(out):
	resp = flask.Response(json.dumps(out))
	resp.headers["Access-Control-Allow-Origin"] = "*"
	resp.headers['Content-Type'] = 'application/json' 
	return resp

app = Flask(__name__)

@app.route(path_api + "/experts.getInfo", methods=["GET", "POST"])


def experts_getInfo():
	try:
		a = request.args.to_dict()
		print("experts.getInfo:", a)
		if "user_id" in a and ',' not in a:
			users = [a["user_id"]]
		elif "user_id" in a:
			users = a["user_id"].replace(" ", "").split(",")
		elif "user_ids" in a:
			users = a["user_ids"].replace(" ", "").split(",")
		else:
			out = {"error": 5, "description": "Произошла ошибка при получении информации о пользователях: отсутствует параметр user_id (или user_ids)."}
			return prepare_api_response(out)
		if len(users) > 1000:
			out = {"error": 2, "description": "Произошла ошибка при получении информации о пользователях: превышено максимально возможное количество пользователей для получения (100)."}
			return prepare_api_response(out)
		try:
			users = list(map(int, users))
		except:
			users = [i["id"] for i in vk_.users.get(user_ids = ",".join(map(str, users)))]
		if "token" in a and a["token"] == "9h3d83h8r8ehe9xehd93u" or "vk_app_id" in a and check_sign(request.url, id, client_secret):
			out = {"count": len(users), "items": [get_exp(i) for i in users]}
		else:
			out = {"error": 3, "description": "Передан невалидный токен."}
	except Exception as err:
		print(err)
		out = {"error": 4, "description": "Произошла неизвестная ошибка при получении информации о пользователях. Попробуйте получить информацию о других пользователях или повторите запрос позже."}
	finally:
		return prepare_api_response(out)


@app.route(path_api + "/experts.getTop", methods=["GET", "POST"])

def experts_getTop():
	try:
		a = request.args.to_dict()
		print("experts.getTop:", a if "sign" not in a else "[request from app].")
		if "token" in a and a["token"] == "9h3d83h8r8ehe9xehd93u" or "vk_app_id" in a and check_sign(request.url, id, client_secret):
			out = exp.top2
		else:
			out = {"error": 3, "description": "Передан невалидный токен."}
	except:
		out = {"error": 4, "description": "Неизвестная ошибка."}
	finally:
		return prepare_api_response(out)
exp_token = get_expert_token(user_token)