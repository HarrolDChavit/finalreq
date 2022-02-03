<?php 
	require ('conn.php');

		// Insert Data
	
	if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action']=="register"){
		$pdo->beginTransaction();
		try {
			$sql = 'INSERT INTO user(idnumber, firstname, lastname, gender, bday, program, yearlevel) VALUES(:idnumber, :firstname, :lastname, :gender, :bday, :program, :yearlevel)';
			$statement = $pdo->prepare($sql);
			$statement->execute([
				':idnumber' => $_POST['userdata']['idnumber'],
				':firstname' => $_POST['userdata']['firstname'],
				':lastname' => $_POST['userdata']['lastname'],
				':gender' => (int) $_POST['userdata']['gender'],
				':bday' => $_POST['userdata']['bday'],
				':program' => $_POST['userdata']['program'],
				':yearlevel' => (int) $_POST['userdata']['yearlevel'],
			]);

			echo $pdo->lastInsertId();
			$pdo->commit();
		} catch (Exception $e) {
			$pdo->rollback();
		}
	}
		
		// Display Data

	else if($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action']=="getusers")
	{
		$sql = "SELECT * FROM user";
		$statement = $pdo->query($sql);
		$users = $statement->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($users);
	}

		// Delete Data

	else if($_POST['action']=='delete-user')
	{

		$user_id = intval($_POST['id']);

		$pdo->beginTransaction();
		try{
			
			$statement = $pdo->prepare("DELETE FROM user WHERE id=?");
			$statement->execute(array($user_id));

			$pdo->commit();

			echo "Deleted!";
		}catch (Exception $e) {
			$pdo->rollback();
			throw($e);
		}
	}
	
		// UPDATE DATA	

	else if($_POST['action'] == 'update-form'){

		$updateID = intval($_POST['id']);

		$pdo->beginTransaction();
		try {

			$sql = "UPDATE user SET idnumber = ?, firstname = ?, lastname = ?, gender = ?, bday = ?, program = ?, yearlevel = ? WHERE id = $updateID";
			$statement = $pdo->prepare($sql);

			$statement->execute(array($_POST['data']["idnumber"],
				$_POST['data']["firstname"],
				$_POST['data']["lastname"],
				$_POST['data']["gender"],
				$_POST['data']["bday"],
				$_POST['data']["program"],
				$_POST['data']["yearlevel"]));

			$pdo->commit();

			echo "Updated!";
		} catch (Exception $e) {
			$pdo->rollback();
			throw $e;
		}
	}
	
 ?>