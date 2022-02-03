$(document).ready(function(){
	var user={};
	var updateID;

	// Object Array, Methods//
	var Forms = {
		registerUser: function(e)
		{
		
			user.idnumber = document.getElementById('idnumber').value;
			user.firstname = document.getElementById('firstname').value;
			user.lastname = document.getElementById('lastname').value;
			user.gender = document.getElementById('gender').value;
			user.bday = document.getElementById('bday').value;
			user.program = document.getElementById('program').value;
			user.yearlevel = document.getElementById('yearlevel').value;
			console.log(user);

			$.ajax({
				type:"POST",
				data:{action:"register", userdata:user},
				url:"src/php/user.php",
				success:function(response){

					Forms.idresponse = jQuery.parseJSON(response);
					var table = $("#usertable tbody");
					if(Forms.idresponse==0){
						alert("Error saving the user!");
					}else{
						alert("Register successful");
						user.id = Forms.idresponse;
						Forms.appendUser(user, table);

					}
					$("#userForm").find("input, select").val("");
				},
			});


			e.preventDefault();
		},

		getUsers: function()
		{
			$.ajax({
				type:"GET",
				data:{action:"getusers"},
				url:"src/php/user.php",
				success:function(response){
					Forms.users = jQuery.parseJSON(response);
					
					var table = $("#usertable tbody");
					for(var i =0; i < Forms.users.length;i++){
						Forms.appendUser(Forms.users[i], table);
					}	
				},
			});

			
		},

		appendUser: function(user, table)
		{

			row = "<tr>"+
				"<th scope=\"row\">"+ user.id +"</th>"+
			      "<td>"+ user.idnumber +"</td>"+
			      "<td>"+ user.firstname +"</td>"+
			      "<td>"+ user.lastname +"</td>"+
			      "<td>"+ user.gender +"</td>"+
			      "<td>"+ user.bday +"</td>"+
			      "<td>"+ user.program +"</td>"+
			      "<td>"+ user.yearlevel +"</td>"+
			      "<td>"+ "<button data-user_id = \""+user.id+"\"class=\"btn btn-primary update-user\" data-toggle=\"modal\" data-target=\"updateModal\">Update</button>" + "</td>" +
			      "<td>"+ "<button data-user_id = \""+user.id+"\"class=\"btn btn-danger delete-user\" >Delete</button>" + "</td>" +
				"</tr>";	
			table.append(row);	
		},

		deleteUser:function(user_id)
		{
			if(confirm("Are you sure you want to delete this user? You can't undo this process!!")){

				$.ajax({
					type:"POST",
					data:{id:user_id, action:'delete-user'},
					url:"src/php/user.php",
					success:function(data){
						alert("USER DELETED SUCCESFULLY!");
						$(".clear").empty();
						Forms.getUsers();
					}
				})
			}
		},

	    update_trigger: function(to_edit){
		
			$("#edit_idnumber").val(to_edit.idnumber);
			$("#edit_firstname").val(to_edit.firstname);
			$("#edit_lastname").val(to_edit.lastname);
			$("#edit_gender").val(to_edit.gender);
			$("#edit_bday").val(to_edit.bday);
			$("#edit_program").val(to_edit.program);
			$("#edit_yearlevel").val(to_edit.yearlevel);
			
			
			$("#updateModal").modal("show");
		},

		saveChanges: function(){
			if(confirm("Are you sure you want to save the changes? You can not undo this process. Click 'OK' to proceed.")){
				var updated_form = {
					id: updateID,
					idnumber: $("#edit_idnumber").val(),
					firstname: $("#edit_firstname").val(),
					lastname: $("#edit_lastname").val(),
					gender: $("#edit_gender").val(),
					program: $("#edit_program").val(),
					bday: $("#edit_bday").val(),
					yearlevel: $("#edit_yearlevel").val(),				
				};
				
				
				$.ajax({
					type: "POST",
					data:{data:updated_form, id:updateID, action:"update-form"},
					url:"src/php/user.php",
					success:function(data){
						console.log("After this is the data response");
						console.log(data);
						$("#updateModal").modal("hide");
						$(".clear").empty();
						Forms.getUsers();			
					}
				});
			}
			else
				$("#updateModal").modal("hide");
	
		},
	
    }; // End of Form
    
	// TRIGGER
	$("#userForm").submit(Forms.registerUser);
		Forms.getUsers();

	$("#usertable").on('click','.delete-user', function(e){
		Forms.deleteUser(this.dataset.user_id);
		
	});

	$("#usertable").on('click','.update-user', function(e){
		
		Forms.update_trigger(Forms.users.find(obj => obj.id === this.dataset.user_id));
	});

	$("#save_updatebtn").click(function(e){
		Forms.saveChanges();
	});

	$("#close_updatebtn").click(function(e){
		$("#updateModal").modal("hide");
	});
	
});


