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
        $res = $this->Connect->db_get('SELECT id,topic_name,count FROM topics');
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
        $sort = [];
        $posts_id = [];
        $posts_info = [];
        
        $topics_raw = $this->getTopics();
        foreach($topics_raw as $topic) {
            $topic_id = $topic['id'];
            $posts_topic = $this->Connect->db_get('SELECT id,link,topic_id,post_format_id as format_id,time FROM posts WHERE topic_id=? ORDER BY time DESC LIMIT 10', [$topic_id]);
            foreach($posts_topic as $post) {
                $attach = explode('wall', $post['link']);
                $attach = end($attach);
                $posts_id[] = $attach;
                $posts_info[$attach] = $post;
            }
            $sort[$topic_id] = $posts_topic;
        }
        unset($post);
        $vk = new VKApi(CONFIG::VK_APP_TOKEN);
        $posts = [];
        $vk_info = $vk->_request('wall.getById', [
            "posts" => implode(',', $posts_id),
        ]);
        $formats_raw = $this->getFormats();
        $formats = [];
        foreach($formats_raw as $format) {
            $formats[$format['id']] = $format['name'];
        }
        $posts_count = [];
        $topics = [];
        foreach($topics_raw as $topic) {
            $topics[$topic['id']] = $topic['topic_name'];
            $posts_count[$topic['topic_name']] = $this->Connect->db_get('SELECT COUNT(*) as count FROM posts WHERE topic_id=?', [$topic['id']])[0]['count'];
        }
        $i = 0;
        foreach($vk_info as $post) {
            $db_info = $posts_info[$post['owner_id'].'_'.$post['id']];
            $db_info['link'] = "http://vk.com/".$db_info['link'];
            $db_info['format'] = $formats[$db_info['format_id']];
            $db_info['topic'] = $topics[$db_info['topic_id']];
            $photo = $post['attachments'][0];
            if(isset($photo['photo'])) {
                $photo = $photo['photo']['sizes'][0]['url'];
            } else {
                $photo = 'https://sun9-18.userapi.com/impf/TBNNib4II7j41smFb6_hqdeZTuZSu5OmWtCmxg/p-nAqL5J31s.jpg?size=500x500&quality=96&sign=03bc82a275bab3e054fc860bf92481ec&type=album';
            }

            $additional = [
                'text' => preg_replace(CONFIG::REGEXP_VK_ID_WIKI, '${2}', $post['text']),
                'photo' => $photo,
            ];
            $out = array_merge_recursive($db_info, $additional);

            $posts[] = $out;
            $i++;
        }
        return ['count' => $posts_count, 'items' => $posts];
    }
}