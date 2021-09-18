<?php
class Achievements { 
    function __construct(DB $Connect)
    {
        $this->Connect = $Connect;
    }
    public function getAchievements($vk_id) {
        $achievements = $this->Connect->db_get("SELECT 
                                ua.achieve_id as id,
                                a.description,
                                i.link as photo,
                                i.placeholder as alt,
                                ua.time
                                FROM user_achievements as ua
                                LEFT JOIN achievements as a
                                ON a.id = ua.achieve_id
                                LEFT JOIN images as i
                                ON i.id = a.image_id
                                WHERE ua.vk_id=?", [$vk_id]);

        return $this->formatAchievements($achievements);
    }

    public function formatAchievements($data) {
        $res = [];
        foreach($data as $achiev){
            $res[] = [
                'id' => (int) $achiev['id'],
                'description' => (string) $achiev['description'],
                'photo' => (string) $achiev['photo'],
                'time' => (int) $achiev['time'],
                'alt' => (string) $achiev['alt']
            ];
        }
        return $res;
    }
}