from sql import nSQL

sql = nSQL('89.223.126.48', 'test', '123', 'test')

a = sql.db_get("SELECT id, price FROM users")
print(a)
# id = 2
# b = sql.db_get("SELECT * FROM users WHERE id=%s", (id))
# print(b)

# c = sql.query("DELETE FROM users WHERE id=%s", (id))
# print(c)





















"""
SELECT SUM(statistic_experts.actions_day) FROM statistic_experts WHERE time > UNIX_TIMESTAMP() - 604800;

SELECT COUNT(*) FROM statistic_experts WHERE day=(SELECT day FROM statistic_experts ORDER BY day LIMIT 1);


SELECT vk_id, SUM(statistic_experts.actions_day) FROM users
LEFT JOIN statistic_experts 
ON users.vk_id = statistic_experts.user_id
GROUP BY vk_id
HAVING SUM(statistic_experts.actions_day) > 1;
"""
