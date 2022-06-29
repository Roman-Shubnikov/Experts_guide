<?php

class Statistics {
	function __construct(DB $Connect) {
		$this->Connect = $Connect;
	}

	public function get($uid) {
		$sql = "SELECT 
				actions_day,
				week_day,
				day
				FROM statistic_experts
				WHERE user_id=?
				ORDER BY time DESC
				LIMIT 10";
		$res = $this->Connect->db_get( $sql, [$uid]);
		return $res;
	}
}