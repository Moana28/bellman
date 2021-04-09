//const { Diagram } = require("gojs");

//initialisation du diagramme
function init(){
    var nbNoeud = document.getElementById('nbNoeud').value;
    if(nbNoeud == null || nbNoeud == 0)
    {
        alert('Saisie invalide');
        return;
    }
   
   document.getElementById("myDiagramDiv").style.display = "inline-block";
   document.getElementById("titre").style.display = "block";
   document.getElementById("topRightt").style.display = "block";
   document.getElementById("contenu").style.display = "none";
//    document.getElementById("topRight").style.display = "inline-block";
   document.getElementById("tabilao").style.display = "inline-block";
    //verifions la valeur de nbNoeud
    
    /* Create a diagram */
    var $ = go.GraphObject.make;
    myDiagram = $(go.Diagram,"myDiagramDiv",{"undoManager.isEnabled": true});
    myDiagram.nodeTemplate = 
    $(go.Node, "Auto",
    $(go.Shape,"RoundedRectangle",
        { fill: $(go.Brush, "Linear", { 0: "white", 1: "lightblue" })},
            new go.Binding("fill","color"),
        { stroke: "darkblue", strokeWidth: 2 },
        { portId:"", fromLinkable: true, toLinkable: true, fromLinkableSelfNode: false, 
        toLinkableSelfNode: false, fromLinkableDuplicates: false, toLinkableDuplicates: false, cursor: "pointer"}
    ),
    $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Left, margin: 4 },
        $(go.RowColumnDefinition, {column: 1, width: 4}),
    $(go.TextBlock, 
        { row: 0, column: 0, columnSpan: 3, alignment: go.Spot.Center, editable:true },
        { font: "bold 12pt sans-serif"},
        new go.Binding("text", "key" ).makeTwoWay()),
    // $(go.TextBlock,
    //       {row: 1, column: 2, margin: 8, editable: true}),
    $(go.TextBlock,'oo',
        {row: 1, column:0,alignment: go.Spot.Center},
        new go.Binding("text","valeur").makeTwoWay())
    )
);
//var myColors  = {"A":"red"}
myDiagram.linkTemplate = 
$(go.Link, {relinkableFrom: true, relinkableTo: true,},
//new go.Binding("points").makeTwoWay(),
    $(go.Shape, {strokeWidth: 2}, //the link shape, the line
        new go.Binding("stroke","color")),
        //function(c){return myColors[c] || "yellow";})),
    $(go.Shape, { toArrow:"Standard"}, // arrowhead
        new go.Binding("stroke","color")),
        //function(c){return myColors[c] || "yellow";})),
    $(go.Panel, "Auto", // this whole Panel is a link label
    $(go.TextBlock, 'vide',{ margin: 18, editable:true},//link label
      
        new go.Binding("text").makeTwoWay()) //editing the text automatically updates the model data
    ));

    var model = new go.GraphLinksModel();
    myDiagram.model = $(go.GraphLinksModel);

    for(let id = 1; id <= nbNoeud; id++)
    {
        // Create nodes
        model.addNodeData({key: "X"+id, color:"cyan"});

    }
    myDiagram.model  = model; 
    console.log(myDiagram.model.toJson());
    return myDiagram.model.toJson();
    //document.getElementById("btn-generer").disabled = true;
}

//validation du diagramme effectue par l'utilisateur
function Validation()
{
    
    // console.log(JSON.parse(myDiagram.model.toJson()));
    var res = true;
    var regex = new RegExp('^[0-9]*$');
    var tab = new Array();
    var all = JSON.parse(myDiagram.model.toJson());
    // var first = myDiagram.findNodeForKey(firstNode());
    // var last = myDiagram.findNodeForKey(lastNode());
    // var f = first.findLinksOutOf();
    // var l = last.findLinksInto();
    // if(f['count'] == 0 || l['count'] == 0)
    // {
    //     tab.push('error');
    // }
    var nodes = myDiagram.nodes;
    var t = new Array();
    var k = new Array();
    while(nodes.next())
    {
        var value = nodes.value;
        //console.log('a'+value);

        var key = value.data.key;
        //console.log('b'+key);
        var c = myDiagram.findNodeForKey(key);
        var last = c.findNodesInto();
        var first = c.findNodesOutOf();
        //console.log('count'+last['count']);
        if(last['count'] == 0 )
            t.push(key);
        if(first['count'] == 0)
            k.push(key);
    }
    console.log(t.length);
    console.log(k.length);
    for(var i = 0; i < all['nodeDataArray'].length; i++)
    {
        var n = myDiagram.findNodeForKey(all['nodeDataArray'][i]['key']);
        var li = n.findLinksInto();
        var lo = n.findLinksOutOf()
        console.log('links in : '+li['count']+'et links out : '+lo['count']);
        if(li['count'] == 0 && lo['count'] == 0)
        {
            tab.push('error');
        }
    }
    if(all['linkDataArray'].length == 0 || t.length > 1 || k.length > 1 )
    {
        res = false;
    }
    else
    {
            for(var i = 0; i < all['linkDataArray'].length; i++)
        {
            var e = all['linkDataArray'][i]['text'];
            if(e == undefined || e == "" || !(e.match(regex)))
            {   
                tab.push('error');
            }
            else{
                tab.push((all['linkDataArray'][i]['text']));
            }
        }

        if(inArray(tab,'error'))
        {
            res = false;
        }
    }
    console.log(tab);
     return res;
}

//creer un tableau listant les valeurs des noeuds 
function createTable(nbNoeud)
{
    createHeaderTable("k");
    var id;
    for(id = 1; id <= nbNoeud; id++) {
        var ancien = document.getElementById("tableau").innerHTML;
        var text = "<tr id='"+ id +"'><td>V"+ id +"</td></tr>";
        var nouveau_text = ancien + " " + text;
        document.getElementById("tableau").innerHTML = nouveau_text;
    }

    // Test
    //var tab = ["-","-","-","-","-","-","-","-","-","-","-","-","-","3","6","0"];
    //createColumn('1', tab);
}

function createHeaderTable(name) {
    var ancien = document.getElementById("thead").innerHTML;
    
    var text = "<th>"+ name +"</th>";
    var new_head = ancien + text;
    
    document.getElementById("thead").innerHTML = new_head;
}

function createColumn(num, tab) {
    createHeaderTable(num);
    for(id = 1; id <= tab.length; id++) {
        if(tab[id-1]["valeur"] == null)
             tab[id-1]["valeur"] = '';
             //insertion de V dans la figure
             //end insertion
        // if(tab[id-1]["valeur"] == "-1") tab[id-1]["valeur"] = oo;
        var identifiant = id +"";
        var ancien_ligne = document.getElementById(identifiant).innerHTML; // obtain td
        var text = "<td>"+ tab[id-1]["valeur"] +"</td>";
        var nouveau_text = ancien_ligne + " " + text;
        document.getElementById(identifiant).innerHTML = nouveau_text;
    }
}
//minimum d'un tableau
function minimum(tab)
{
    min = tab[0];
    for(var i = 0; i < tab.length; i++ )
    {
        if(min > tab[i])
            min = tab[i];
    }
    return min;
}


function refresh() {
    var vao = '<table class="table table-striped table-hovered"><thead><tr id="thead"></tr></thead><tbody id="tableau"></tbody></table>';
    document.getElementById("tabilao").innerHTML = vao;
}

//maximum dans un tableau
function maximum(tab)
{
    max = tab[0];
    for(var i = 0; i < tab.length; i++)
    {
        if(max < tab[i])
            max = tab[i];
    }
    return max;
}
//insertion nouvelle colonne
function insertNewCol(indice)
{
    var newnode = JSON.parse(myDiagram.model.toJson());
    console.log(myDiagram.model.toJson());
    createColumn(indice, newnode["nodeDataArray"]);
}
//retourne le 'key' du dernier noeud
function lastNode()
{
    var res;
    var allNodesIt = myDiagram.nodes;
    while(allNodesIt.next()) {
        var lastNode  = allNodesIt.value;
        var lastNodeKey = lastNode.data.key;
        var Noeud = myDiagram.findNodeForKey(lastNodeKey);
        var nodesoutOf = Noeud.findNodesOutOf();
        //console.log('count lastnode'+nodesoutOf['count']);
        if(nodesoutOf['count'] == 0 )
            res = lastNodeKey;
            //console.log(lastNodeKey);
    }
    //tab.push(lastNodeKey);
    return res;
}
//list of nodes into a specific node
function NodesInto (lstNd) //mandeha
{
    var tab = new Array();
    var node = lstNd.findNodesInto();
    while(node.next())
    {
        var nd = node.value;
        tab.push(nd.data.key);
    }
    return tab;
}

//Calcul du chemin maximal


//Calcul du chemin minimal
function Calcul(tab,values) // parameters should be an array type
{
    //var tab = NodesInto(lst); //returns node keys
    //console.log(tab);
    var tab_Node_Out_Of = new Array();
    var tab_V_Compare = new Array();

    for(var i = 0; i < tab.length; i++ )
    {
        //Verify the existence of nodes Into
        //console.log(tab[i]);
        var Noeud = myDiagram.findNodeForKey(tab[i]);
        //console.log(Noeud.data.key);
        //Push in a table all nodes out of 
        var NodesOutOf = Noeud.findNodesOutOf();
        while(NodesOutOf.next())
        {
            var Nd = NodesOutOf.value;
            tab_Node_Out_Of.push(Nd.data.key);
            console.log('Nodes Out of : '+ Nd.data.key);
        }
        console.log("les successeurs");
        console.log(tab_Node_Out_Of);
        console.log("Nombre de boucle " + tab_Node_Out_Of.length);
        for(var k = 0; k < tab_Node_Out_Of.length; k++)
        {
            var v = myDiagram.findNodeForKey(tab_Node_Out_Of[k]);
            //console.log(myDiagram.findNodeForKey(tab_Node_Out_Of[k]).data.valeur);
            console.log("boucle " + k);

            console.log("v.data.valeur " + v.data.valeur)
            //if(v.data.valeur == null) v.data.valeur = 'oo';
            //ato le olana
            if(v.data.valeur != 'oo' && v.data.valeur != null)
            {
                
                console.log('arrive ici');
                var linksInto = v.findLinksInto();
                while(linksInto.next())
                {
                    var links = linksInto.value;

                    if(links.fromNode.data.key == tab[i])
                    {
                        
                        tab_V_Compare.push(parseInt(v.data.valeur) + parseInt(links.data.text));
                        console.log("Valeur du lien successeur " + links.data.text);
                        console.log("Valeur du noeud" + v.data.valeur);
                        //console.log(""+ parseInt(links.data.text) 
                        //+"+"+ parseInt(v.data.valeur+""));
                    }
                    console.log(tab_V_Compare);    
                }
                console.log(values);
                if(values.length == 1)
                {
                    if(values[0] == 'min')
                    {
                        Noeud.data.valeur = minimum(tab_V_Compare);
                    }
                    else{
                        Noeud.data.valeur = maximum(tab_V_Compare);
                    }
                }
                //Noeud.data.valeur = minimum(tab_V_Compare); //ici
                //var f = maximum(tab_V_Compare);
                // myDiagram.model.commit(function(myDiagram){
                //     myDiagram.set(Nd.data,'valeur',f);
                // });
                console.log("Minimum " + Noeud.data.valeur);
                //console.log(tab_V_Compare);
            }
            // emptyArray(tab_V_Compare);
            // emptyArray(tab_Node_Out_Of);
        }
        tab_V_Compare = [];
        tab_Node_Out_Of = [];
        // emptyArray(tab_V_Compare);
        // emptyArray(tab_Node_Out_Of);
    }
    //console.log(myDiagram.model.toJson());
    return tab;
}

// verifier si "element" est deja dans "tab []"
function inArray(tab,  element) {
    for (var i = 0; i < tab.length; i++) {
        if (tab[i] === element) {
            return true;
        }
    }
    return false;
}

//retourne le ''key'' du premier noeud
function firstNode()
{
    var firstnodekey;
    var nodes = myDiagram.nodes;
    while(nodes.next())
    {
        var value = nodes.value;
        console.log('a'+value);

        var key = value.data.key;
        console.log('b'+key);
        var c = myDiagram.findNodeForKey(key);
        var last = c.findNodesInto();
        console.log('count'+last['count']);
        if(last['count'] == 0)
            firstnodekey = key;
    }
    return firstnodekey;
    
}
//colorie le noeud courant, le noeud precedent et le lien les reliant
function change_color(val,couleur)
{
    console.log('couleur'+couleur);
    myDiagram.model.commit(function(myDiagram){
        myDiagram.set(val.data,'color',couleur);
    });
    myDiagram.model.commit(function(myDiagram){
        myDiagram.set(val.fromNode.data,'color','yellow');
        myDiagram.set(val.toNode.data,'color','yellow');
    },"change color");
    
}

//Retourne la couleur des liens et noeud par defaut
function refresh_color_Diagram(val,val1,val2,val3,val4)
{
    myDiagram.model.commit(function(myDiagram){
        myDiagram.set(val.data,'color','black');
    });
    myDiagram.model.commit(function(myDiagram){
        myDiagram.set(val.fromNode.data,''+val1,''+val2);
        myDiagram.set(val.toNode.data,''+val1,''+val2);
    },"change color");
    myDiagram.model.commit(function(myDiagram){
        myDiagram.set(val.fromNode.data,''+val3,''+val4);
        myDiagram.set(val.toNode.data,''+val3,''+val4);
    },"change node valeur");
}

//remet par defaut les couleurs de chaque noeud et lien
function refresh_allNodes()
{
    var val_1 = 'color';
    var val_2 = 'cyan';
    var val_3 = 'valeur';
    var val_4 = 'oo' ;
    var allNodes = myDiagram.nodes;
    while(allNodes.next())
    {
            var eNode = allNodes.value;
            var val1 = eNode.data.key;
            var fNodeR = myDiagram.findNodeForKey(val1);
            var lOutOf = fNodeR.findLinksOutOf();
            while(lOutOf.next())
            {
                fNodeR.data.valeur = 'oo';
                var val = lOutOf.value;
                refresh_color_Diagram(val,val_1,val_2,val_3,val_4);
            }
    }
    
}
//afficher les valeurs de chaque noeud
function set_valeur_ToGraph()
{
    //var newnode = JSON.parse(myDiagram.model.toJson());
    var allNodesIt = myDiagram.nodes;
    while(allNodesIt.next())
    {
        var Ndval = allNodesIt.value;
        console.log(Ndval.data.valeur);
        var data = Ndval.data.valeur;
        console.log(data);
        myDiagram.model.commit(function(myDiagram){
            myDiagram.set(Ndval.data,'valeur',''+data) ;
            });
    }
    // for(var i = 0; i < newnode['nodeDataArray'].length; i ++)
    // {
    //     findNodeForKey(newnode['nodeDataA'])
    //     myDiagram.model.commit(function(m){
    //        myDiagram.set(,'valeur',) ;
    //     });
    // }
}

// tracage du chemn minimal
function chemin_minimal(fNode,values)
{
    var couleur;
    var fNodeR = myDiagram.findNodeForKey(fNode);
    console.log(fNodeR);
    //var fNodeValue = fNodeR.value;
    var lOutOf = fNodeR.findLinksOutOf();
    while(lOutOf.next())
    {
        var val = lOutOf.value;
        var linkvalue = parseInt(val.data.text);
        var toNodeValue = parseInt(val.toNode.data.valeur);
        var nextNode = val.toNode.data.key;
        //s'il n'y a qu'un seul lien sortant du premier noeud 
        if(lOutOf['count'] == 1 || ((parseInt(val.fromNode.data.valeur) - parseInt(linkvalue))==parseInt(toNodeValue)))
        {
            if(values.length == 1)
            {
                console.log('values[0]='+values[0]);
                if(values[0] === 'min')
                {
                    //console.log('values length'+values.length);
                   
                    couleur = 'yellow';
                    change_color(val,couleur);
                    chemin_minimal(nextNode,values);
                }
                if(values[0] === 'max')
                {
                    //console.log('values length'+values.length)
                   
                    couleur = 'red';
                    change_color(val,couleur);
                    chemin_minimal(nextNode,values);
                }
            }
            
            set_valeur_ToGraph();
        }
        
    }
}

//avoir la case a cocher min ou max ou les deux
function getSelectedCheckboxValue(name)
{
    
    console.log(name);
    const checkboxes = document.querySelectorAll('input[name="bellman"]:checked');
    console.log(checkboxes);
    let values = [];
    checkboxes.forEach((checkbox) => 
    {
        console.log(checkbox.value);
        values.push(checkbox.value);
    });
    return values;
}
//condition fin boucle 
function compare_tabs(last_tab, new_tab )
{
    if(last_tab[0].length == new_tab[0].length)
    {
            // console.log('last_tab[0]'+indice+'_'+last_tab[0][indice]['valeur']);
            // console.log('new_tab[0]'+indice+'_'+new_tab[0][indice]['valeur']);
            if(JSON.stringify(last_tab[0]) == JSON.stringify(new_tab[0]))
            {
                console.log(JSON.stringify(last_tab[0]));
                console.log(JSON.stringify(new_tab[0]));
                return true;
            }
                
            else 
                return false;
    
    }
}
//FONCTION PRINCIPALE
function Main()
{
    refresh();
    var values = getSelectedCheckboxValue('bellman');
    createTable(document.getElementById('nbNoeud').value);
    console.log(Validation());
    if(Validation() == false )
    {
        alert('Remplissez bien les liens avec des nombres et verifiez bien vos noeuds.');
    }
    else {
        var fara = 0;
        console.log(JSON.parse(myDiagram.model.toJson()));
        refresh_allNodes();
        var lst = new Array();
        console.log('lastnode'+lastNode()); 
        console.log('firstnode'+firstNode());
        lst.push(lastNode()); //returns nodes key as string
        console.log(lst);
        var node = myDiagram.findNodeForKey(lst[0]);
        node.data.valeur = parseInt(0);
        console.log("node.data.valeur: ");
        console.log(node.data.valeur);
        var tab = NodesInto(node);//returns array of node key
        console.log('nodes into tableau: '+tab);
        Calcul(tab,values);
        var jsonNode =  JSON.parse(myDiagram.model.toJson());
        var tab_last_nodeDataArray = new Array();
        var tab_new_nodeDataArray = new Array();
        tab_last_nodeDataArray.push(jsonNode["nodeDataArray"]);
        insertNewCol("1");
        lst = [];

        for(var i = 0 ; i < tab.length; i++)
        {
            var a = NodesInto(myDiagram.findNodeForKey(tab[i]));     
            console.log("nodes into " + tab[i]);
            console.log(a);    
            var b =  Calcul(a,values);
            for(var g = 0; g < b.length; g++)
            {
                lst.push(b[g]);
            }
        }
        insertNewCol("2"); 
        jsonNode = JSON.parse(myDiagram.model.toJson());
        tab_new_nodeDataArray.push(jsonNode["nodeDataArray"]);
        
        // Continue if compare_tabs is false
        // if(compare_tabs(tab_last_nodeDataArray,tab_new_nodeDataArray) == 'true')
        if(fara >= 10)
        
        {
            console.log('Ne pas continuer');
        }
        else{

        console.log("lst 0");
        console.log(lst);

        // Ato le Boucle
        var res = false;
        var nbBoucle = 10;
        var indice = 0;
        // for (indice = 0; !res; indice++) {
            for (indice = 0; indice < 2; indice++) {
            console.log("Indice"+indice);
            console.log("BOUCLE " + indice + 1);
            tab = [];
            for(var g = 0; g < lst.length; g++)
            {
                if (!inArray(tab, lst[g])) {
                    tab.push(lst[g]);        
                }
            }
            lst = [];
            for(var i = 0 ; i < tab.length; i++)
            {
                var a = NodesInto(myDiagram.findNodeForKey(tab[i]));
                console.log("nodes into " + tab[i]);
                console.log(a);    
        
                var b = Calcul(a,values);
                
                for(var g = 0; g < b.length; g++)
                {
                        lst.push(b[g]);
                }
            }

            var col = (indice+3)+""; 
            tab_new_nodeDataArray = [];
            jsonNode = JSON.parse(myDiagram.model.toJson());
            tab_new_nodeDataArray.push(jsonNode["nodeDataArray"]);
            res = compare_tabs(tab_last_nodeDataArray,tab_new_nodeDataArray);
            insertNewCol(col);
            console.log(compare_tabs(tab_last_nodeDataArray,tab_new_nodeDataArray));
            tab_last_nodeDataArray = tab_new_nodeDataArray;
            tab_new_nodeDataArray = [];

        }
        console.log('Sortie condition fin');
        }
        
        // console.log("lst 1");
        // console.log(lst);
        
        console.log(myDiagram.model.toJson());
        var f = firstNode();
        chemin_minimal(f,values);
    
    }
    }
