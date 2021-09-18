import time
from sql import SQL


achievements_list = {
    1: {
        'cond': 'actions>=50'
    },
    2: {
        'cond': 'actions>=100'
    },
    3: {
        'cond': 'actions>=500'
    },
    4: {
        'cond': 'actions>=1000'
    },
    5: {
        'cond': 'actions>=1500'
    },
    6: {
        'cond': 'actions>=1800'
    },
    7: {
        'cond': 'actions>=2000'
    },
    8: {
        'cond': 'actions>=5000'
    },
    9: {
        'cond': 'actions>=10000'
    },
    10: {
        'cond': 'actions>=50000'
    },
    11: {
        'cond': 'actions>=100000'
    },
    12: {
        'cond': 'actions>=500000'
    },
    13: {
        'cond': 'actions>=1000000'
    },
}


class userObject(object):
    def __init__(self, vk_id, actions, achievements):
        self.id = vk_id
        self.actions = actions
        self.achievements = achievements
    

def giveAchievement(user:userObject, achiev_id):
    SQLTool.query("INSERT IGNORE INTO user_achievements (vk_id,achieve_id,time) VALUES (%s, %s, %s)", (user.id, achiev_id, round(time.time(), 0)))

def getExperts():
    need_scan = True
    offset = 0
    count = 1000
    final_list = {}
    while need_scan:
        main_users = SQLTool.db_get(f"SELECT vk_id, actions FROM users LIMIT {offset},{count}")
        u_ids = [i['vk_id'] for i in main_users]
        achievements_users = SQLTool.db_get(f"SELECT vk_id,achieve_id FROM user_achievements WHERE vk_id IN ({','.join([str(i) for i in u_ids])})")
        achieve_list = {}
        for achieve in achievements_users:
            if achieve['vk_id'] not in achieve_list: achieve_list[achieve['vk_id']] = []
            achieve_list[achieve['vk_id']].append(achieve['achieve_id'])
        for user in main_users:
            achievements_user = achieve_list[user['vk_id']] if user['vk_id'] in achieve_list else []
            final_list[user['vk_id']] = userObject(user['vk_id'], user['actions'], achievements_user)
        
        offset += count
        if len(u_ids) < count: need_scan = False
    return final_list

SQLTool = SQL('188.225.45.112', 'jedi', 'RTJ2fa2041', 'experts_guide')
experts_info = getExperts()
for uid in experts_info:
    i = experts_info[uid]
    actions = i.actions
    achievements = i.achievements
    need_to_give_ids = []
    for achiev in achievements_list:
        cond = achievements_list[achiev]['cond']
        if eval(cond) and achiev not in achievements:
            need_to_give_ids.append(achiev)
    for id_ach in need_to_give_ids:
        giveAchievement(i, id_ach)
