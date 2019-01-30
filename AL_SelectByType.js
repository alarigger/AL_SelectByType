//Version du 10/09/2018
 //Alexandre Cormier
 // -----V-2------
 //Selectionne tout les nodes correspondant aux types selectionnés. 
 Deux modes : 
 Sans rien selectionner, la recherche s'effectura sur l'ensemble des nodes de la scene
 En selectionnant des nodes ou un groupe, la recherche s'effectura parmis la selection. 
 
function AL_SelectByType(){


	MessageLog.trace( "-------SELECT_BY_TYPE-------");

	var cf = frame.current(); 

	var CHOOSEN_TYPES = [];

	var ALL_TYPES = ["READ","PEG","MasterController","COMPOSITE","CUTTER","MATTE_RESIZE","LAYER_SELECTOR","LINE_ART","COLOR_ART","UNDERLAY","OVERLAY","TbdColorSelector","COLOR_OVERRIDE_TVG","KinematicOutputModule","CurveModule","OffsetModule","BendyBoneModule","WRITE"]

	var nodes_to_treat = []

	var groups_to_analyse = [];

	var nodes_to_select = []

	var typeBoxes = []

	inputDialog();

	function discriminateNodes(){

		for (var n = 0 ; n < nodes_to_treat.length ; n ++){

			currentNode = nodes_to_treat[n];

			if(isTheRigthType(currentNode)){
				 nodes_to_select.push(currentNode)
			}
			
		}

	}

	function select_nodes(){

		for (var n= 0; n<nodes_to_select.length;n++){

			selection.addNodeToSelection(nodes_to_select[n]);

		}


	}

	function isTheRigthType(n){

		var node_type = node.type(n)

		for(var t = 0; t<CHOOSEN_TYPES.length;t++){

			if(node_type == CHOOSEN_TYPES[t]){
				return true
			}
		}

		return false

	}

	function inputDialog() {

		MessageLog.trace("inputDialog")

	    var d = new Dialog
	    d.title = "SELECT_BY_TYPE";
	    d.width = 100;

	    for(var t = 0;t < ALL_TYPES.length;t++){
	    	var typeBox = new CheckBox
	    	typeBox.text = ALL_TYPES[t];
	    	typeBox.checked = false;
	    	d.add( typeBox  );
	    	typeBoxes.push(typeBox);

	    }

	    var rc = d.exec();
	    if( rc )
	    {

	    	for(var tb = 0 ; tb<typeBoxes.length;tb++){

	    		if(typeBoxes[tb].checked){
	    			CHOOSEN_TYPES.push(typeBoxes[tb].text)
	    		}

	    	}


	      	
	      	fetch_nodes()
	      	MessageLog.trace(nodes_to_select)
	      	MessageLog.trace(CHOOSEN_TYPES)

	    }

	}

	function fetch_nodes(){

		MessageLog.trace("fetch_nodes")

		if( selection.numberOfNodesSelected()>0){ 

			var selected_nodes = selection.selectedNodes(0);

			//Première boucle parmis les nodes selectionnés
			for(var n = 0; n < selection.numberOfNodesSelected(); n++){ 

				var currentNode = selected_nodes[n];

				// on ajoute le peg à la liste de traitement
				if(node.type(currentNode)!="GROUP"){

					nodes_to_treat.push(currentNode);

				}else{
					
					groups_to_analyse.push(currentNode);

				} 

	     	}  

			
			var number_of_groups = groups_to_analyse.length;

			selection.clearSelection ()
			
			//deuxième boucle recursive à travers les groupes 
			for (var g = 0 ; g < number_of_groups ; g ++){
				
				currentGroup = groups_to_analyse[g];

				var subNodesInGroup= node.numberOfSubNodes(currentGroup);
				
				for (var sn = 0 ; sn < subNodesInGroup; sn++){

						var sub_node_name = node.subNode(currentGroup,sn);
						var sub_node = node.subNodeByName(currentGroup,sub_node_name);
						var sub_node_type = node.type(sub_node_name);
						
						if( sub_node_type == "GROUP"){
							
							// extension de la boucle de recherche au nouveau groupe trouvé
							MessageLog.trace(sub_node_name);
							groups_to_analyse.push(sub_node_name);
							number_of_groups++;
							
						}else{
							nodes_to_treat.push(sub_node_name);

						}
	
						
				}			
				
			}

			discriminateNodes();
			select_nodes()


	 	}else{ 


	 		nodes_to_select = node.getNodes(CHOOSEN_TYPES);
	 		select_nodes()


		} 		

	}

	
}  
