import datetime
import calendar


def get_points_day(t:datetime.datetime):
    dt_start = t.replace(second=0, microsecond=0, minute=0, hour=0)
    dt_end = t.replace(second=59, microsecond=99, minute=59, hour=23)
    ts_start = int(dt_start.timestamp())
    ts_end = int(dt_end.timestamp())
    return [ts_start, ts_end]

c = calendar.Calendar()
curr_date = datetime.date.today()
curr_month = c.monthdatescalendar(curr_date.year, curr_date.month)
curr_week_obj = []
for i, week in enumerate(curr_month):
    try:
        week.index(curr_date)
    except ValueError:
        continue
    curr_week_obj = [i, week]
    break
curr_week = curr_week_obj[1]
print(curr_date.day)
# print(get_points_day(datetime.datetime.now()))



"""
SELECT SUM(statistic_experts.actions_day) FROM statistic_experts WHERE time > UNIX_TIMESTAMP() - 604800;

SELECT COUNT(*) FROM statistic_experts WHERE day=(SELECT day FROM statistic_experts ORDER BY day LIMIT 1);


SELECT vk_id, SUM(statistic_experts.actions_day) FROM users
LEFT JOIN statistic_experts 
ON users.vk_id = statistic_experts.user_id
GROUP BY vk_id
HAVING SUM(statistic_experts.actions_day) > 1;
"""