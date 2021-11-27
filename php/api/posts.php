<?php

class Posts { 
    function __construct(DB $Connect, Users $users)
    {
        $this->Connect = $Connect;
        $this->Users = $users;
    }
    public function create($topic, $format, $link) {
        $uid = $this->Users->id;
        $user_posts_last = $this->getUserPosts($uid, time() - CONFIG::TIMES['10min']);
        if(!empty($user_posts_last)) {
            if(count($user_posts_last) > CONFIG::MAX_POSTS_PER_10_MIN) Show::error(150);
        }
        if(!preg_match(CONFIG::REGEXP_VALID_WALL_POST_LINK, $link)) Show::error(11);
        $matches =[];
        preg_match("/wall-([0-9]+)_([0-9]+)/", $link, $matches);
        $link = $matches[0];
        $topics_raw = $this->getTopics();
        $topics = [];
        foreach($topics_raw as $topic_i) {
            $topics[] = (int)$topic_i['id'];
        }
        $formats_raw = $this->getFormats();
        $formats = [];
        foreach($formats_raw as $type) {
            $formats[] = (int)$type['id'];
        }
        if(!in_array($format,$formats)) Show::error(151);
        if(!in_array($topic,$topics)) Show::error(152);
        $res = $this->Connect->query('INSERT INTO posts (link, topic_id,post_format_id,author,time) VALUES (?, ?, ?, ?, ?)', [$link, $topic, $format, $uid, time()]);
        return $res;
    }
    public function getTopics() {
        $res = $this->Connect->db_get('SELECT id,topic_name FROM topics WHERE id');
        return $res;
    }
    public function getFormats() {
        $res = $this->Connect->db_get('SELECT id,name FROM posts_format');
        return $res;
    }
    public function getUserPosts($uid, $time) {
        $res = $this->Connect->db_get('SELECT 
                                    link,topic_id,post_format_id,time 
                                    FROM posts 
                                    WHERE author=? AND time>=? 
                                    ORDER BY time DESC', [$uid, $time]);
        return $res;
    }
    public function getPosts() {
        
        $res_db = $this->Connect->db_get('SELECT id,link,topic_id,post_format_id as format_id,time FROM posts ORDER BY time DESC LIMIT 10');
        if(count($res_db) === 0) return $res_db;
        $vk = new VKApi(CONFIG::VK_APP_TOKEN);
        $posts = [];
        $posts_id = [];
        foreach($res_db as $item) {
            $attach = explode('wall', $item['link']);
            $posts_id[] = end($attach);
        }
        $vk_info = $vk->_request('wall.getById', [
            "posts" => implode(',', $posts_id),
        ]);
        $formats_raw = $this->getFormats();
        $formats = [];
        foreach($formats_raw as $format) {
            $formats[$format['id']] = $format['name'];
        }
        $topics_raw = $this->getTopics();
        $topics = [];
        foreach($topics_raw as $topic) {
            $topics[$topic['id']] = $topic['topic_name'];
        }
        $i = 0;
        foreach($vk_info as $post) {
            $db_info = $res_db[$i];
            $db_info['link'] = "http://vk.com/".$db_info['link'];
            $db_info['format'] = $formats[$db_info['format_id']];
            $db_info['topic'] = $topics[$db_info['topic_id']];
            $photo = $post['attachments'][0];
            if(isset($photo['photo'])) {
                $photo = $photo['photo']['sizes'][0]['url'];
            } else {
                $photo = 'https://psv4.userapi.com/c537232/u526444378/docs/d29/f05b42afdc77/Frame_20953.png?extra=1eUZNEn2eoQlocj3TVmWTk101B1gTvq9olJJ25HThSYjqy6x8IzCJRHQv37E680G3ctgK8YNxKkeaN5Mq6OsGp-K7Yz6pGe8__wSGjig1ZiBbDls2yEuNFPdqN6KGXj8Nf5QpajOLncR2MGLDMRXuw7YuA';
            }

            $additional = [
                'text' => $post['text'],
                'photo' => $photo,
            ];
            $out = array_merge_recursive($db_info, $additional);

            $posts[] = $out;
            $i++;
        }
        return $posts;
    }
}