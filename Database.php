<?php

class Database {
	public function __construct() {
		$this->conn = new mysqli("localhost", "resource_transgk",
							"y34af7UHq5", "resource_transgk");
		if ($this->conn->connect_error)
			die("Connection failed: ");
		$this->conn->set_charset("utf8");
	}
	public function __destruct() {
		mysqli_close($this->conn);
	}

	public function execute_statement($query) {
		$result = $this->conn->query($query);
		if(!$result)
			exit("Cos poszlo nie tak");
		return $result;
	}
	public function execute_prepared_statement($query, $arguments) {
		$stmt = $this->prepare_statement($query, $arguments);
		$success = $stmt->execute();
		$stmt->close();
		if(!$success)
			exit("Cos poszlo nie tak");
	}
	public function fetch_prepared_statement($query, $arguments, &$results) {
		$stmt = $this->prepare_statement($query, $arguments);
		$success = $stmt->execute();
		if($success) {
			call_user_func_array(array($stmt, "bind_result"), $results);
			$stmt->fetch();
		}
		$stmt->close();
		if(!$success)
			exit("Cos poszlo nie tak");
	}
	
	private function prepare_statement($query, &$arguments) {
		if(!($stmt = $this->conn->prepare($query)))
			exit("Cos poszlo nie tak");
		for($i=1; $i < count($arguments); $i++)
			$arguments[$i] =& $arguments[$i];
		call_user_func_array(array($stmt, "bind_param"), $arguments);
		return $stmt;
	}
}