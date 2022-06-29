<?php

class Users {
	public $id = null;
	public $info = [];
	protected $is_first_start = false;
	protected $Connect;


	function __construct( int $vk_user_id, DB $Connect) {
		$this->Connect = $Connect;
		$this->id = $vk_user_id;
		$this->_get();

		if ( empty( $this->info ) ) {
			$this->_register();
			$this->_get();
		}

		if ( isset($this->info['banned']) && $this->info['banned']) {
			$ban = $this->info['banned'];
			Show::error(5, ['reason' => $ban['reason'], 'time_end' => (int)$ban['time_end']]);
		}
	}
	
	public function getMy() {
		$info = $this->info;

		return $this->_formatType( $info );
	}
	public function checkBanned(int $vk_id, bool $all=false, $inactive=false){
		$where_cond = "";
		if(!$inactive) $where_cond = "AND (time_start+time_ban>? AND time_start+time_ban != 0)";

		$sql = "SELECT reason, time_start, time_ban, time_start+time_ban as time_end 
		FROM banned 
		WHERE vk_id=? {$where_cond}
		ORDER BY time_start+time_ban DESC";
		if(!$all){
			$sql .= " LIMIT 1";
		}
		$curr_time = time();
		if($inactive){
			$banned = $this->Connect->db_get($sql, [$vk_id]);
		}else{
			$banned = $this->Connect->db_get($sql, [$vk_id, $curr_time]);
		}
		$isBanned = false;
		$historyBans = [];
		foreach($banned as $val) {
			if($val['time_end'] > $curr_time) $isBanned = true;
			$historyBans[] = ['reason' => $val['reason'], 'time_end' => $val['time_end']];
		}
		
		return [$isBanned, $historyBans];
	}

	public function get($uid) {
		$sql = "SELECT 
				vk_id,
				registration,
				last_activity,
				permissions
				FROM users
				WHERE users.vk_id=?";
		$res = $this->Connect->db_get( $sql, [$uid] )[0];
		$ban = $this->checkBanned($uid);
		if($ban[0]){
			$res['banned'] = $ban[1];
		}
		return $res;
	}

	private function _get() {
		$time = time();
		$user_id = $this->id;
		$this->Connect->query("UPDATE users SET last_activity=? WHERE vk_id=?", [$time,$user_id]);
		$sql = "SELECT 
				vk_id,
				registration,
				last_activity,
				permissions,
				is_active
				FROM users
				WHERE users.vk_id=?";
		$res = $this->Connect->db_get( $sql, [$user_id] )[0];
		$ban = $this->checkBanned($user_id);
		if($ban[0]){
			$res['banned'] = $ban[1];
		}
		
		$this->info = $res ?? [];
	}

	private function _register() {
		$time = time();
		$res = $this->Connect->query("INSERT IGNORE INTO users (vk_id,registration,last_activity) VALUES (?,?,?)", [$this->id,$time,$time]);
		return $res;
	}
	private function _formatType( array $data ) {
		if(empty($data)) {
			Show::error(404);
		}

		$is_online = time() < $data['last_activity'] + CONFIG::ONLINE_TIME;
		if(empty($data['banned'])) {
			
			$res = [
				'vk_id' => (int) $data['vk_id'],
				'online' => [
					'is_online' => (bool) $is_online,
					'last_seen' => (int) $data['last_activity']
				],
				'registration' => (int) $data['registration'],
				'permissions' => (int) $data['permissions'],
				'is_active' => (int) $data['is_active'],
				
			];	
		}
		if(!empty($data['banned'])){
			$res['banned'] = $data['banned'];
		}
		return $res;
	}
}