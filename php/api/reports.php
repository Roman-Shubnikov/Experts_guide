<?php

class Reports { 
    function __construct(DB $Connect)
    {
        $this->Connect = $Connect;
        $this->reason_ids = $this->getReasons()[0];
    }

    public function send($author, $vk_id, $comment, $reason, $content) {
        $len_cm = mb_strlen($comment);
        $len_ct = mb_strlen($content);
        if($len_cm >= CONFIG::MAX_TEXT_LENGTH || 
        $len_ct >= CONFIG::MAX_TEXT_LENGTH ||
        $len_cm < CONFIG::MIN_TEXT_LENGTH) Show::error(103);
        if($this->checkReportsUser($author)['count'] > CONFIG::MAX_REPORTS_NOT_MODERATE) Show::error(101);
        if(!preg_match(CONFIG::REGEXP_VALID_TEXT, $comment) || 
        !preg_match(CONFIG::REGEXP_VALID_TEXT, $content)) Show::error(100);
        if(!in_array($reason, $this->reason_ids)) Show::error(102);
        
        return($this->Connect->query(
            "INSERT IGNORE INTO reports (author, vk_id, comment, content, time)
            VALUES (?,?,?,?,?)", [$author, $vk_id, $comment, $content, time()]
        ));
    }

    public function checkReportsUser($vk_id) {
        $reports = $this->Connect->db_get(
            "SELECT vk_id FROM reports WHERE author=? AND is_moderate=0 LIMIT 100",
            [$vk_id]
        );
        $count = count($reports);
        return ['count' => $count, 'reports' => $reports];
    }
    public function getReasons() {
        $ids = [];
        $res = [];
        $reasons = $this->Connect->db_get("SELECT id,text FROM report_reasons");
        foreach($reasons as $reason) {
            $id = (int)$reason['id'];
            $ids[] = $id;
            $res[] = ['id' => $id, 'reason' => $reason['text']];
        }
        return [$ids, $res];
    }

}