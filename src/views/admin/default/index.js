import { AddIcon, ChevronDownIcon, ChevronUpIcon, DeleteIcon, DragHandleIcon, EditIcon, InfoIcon, MinusIcon,HamburgerIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import './style.css';

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
  Select,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Radio,
  Checkbox,
  Flex,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  Tooltip,
  Stack,
  Heading,
  Spinner
} from '@chakra-ui/react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { SidebarContext } from 'contexts/SidebarContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdDelete, MdLaptop, MdSelectAll } from 'react-icons/md';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RiDragDropLine, RiDragMove2Fill } from 'react-icons/ri';
import NotSelectedCard from './NotSelectedCard';
import MultipleSelectNative from './SelectFromComment';

export default function UserReports() {
  const [selectedEcran, setSelectedEcran] = useState(null);
  const [selectedBtn, setSelectedBtn] = useState(null);

  const [spiner, setSpiner] = useState(false);


  /// ----------- Alert delete ecran -----------------
  const { isOpen: alert1IsOpen, onOpen: alert1OnOpen, onClose: alert1OnClose } = useDisclosure();
  const { isOpen: alert2IsOpen, onOpen: alert2OnOpen, onClose: alert2OnClose } = useDisclosure();
  const { isOpen: alert3IsOpen, onOpen: alert3OnOpen, onClose: alert3OnClose } = useDisclosure();
  const { isOpen: alert4IsOpen, onOpen: alert4OnOpen, onClose: alert4OnClose } = useDisclosure();
  const { isOpen: alert5IsOpen, onOpen: alert5OnOpen, onClose: alert5OnClose } = useDisclosure();
  const cancelRef1 = useRef();
  const cancelRef2 = useRef();
  const cancelRef3 = useRef();
  const cancelRef4 = useRef();
  const cancelRef5 = useRef();

  const toast = useToast()

/// --------- Color ---------------------------------
  const lanceBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue("navy.700", "white");
  const textColor1 = useColorModeValue("brand.500", "white");



  /// ---------- State -------------------------------
  const {
    toggleSidebar,
    setToggleSidebar,
    feuillesData,
    setFeuillesData,
    currentFeuille,
    setCurrentFeuille,
    currentTest,
    setCurrentTest,
    commentsData,
              setCommentsData
  } = useContext(SidebarContext);

  const [forceRender, setForceRender] = useState('');
  /// ----------------------- Add button -----------------------------
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValue1, setSelectedValue1] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('');

const handleSelectChange = (event) => {
  setSelectedValue(event.target.value);
};
const handleSelectChange1 = (event) => {
  setSelectedValue1(event.target.value.split("##")[0]);
};

const handleSelectNewEcran = (event) => {
  setSelectedScreen(event.target.value);
};
function formatNumber(str) {
  var num = parseInt(str)+1;
 
  if (num < 10) {
    return "0" + num;
  } else {
    return num.toString();
  }
}
const handleAddClick = (ecran,index) => {
  if (selectedValue !== '') {
    
    const key=selectedValue.split('##')
    ajouterBoutonFeuille(key[0],formatNumber(key[1]),key[2],getObjectsByTypeAndIdAndEcran(ecran,index))
    setSelectedValue('')
    nbrBoutonsEcranTest(key[2],getObjectsByTypeAndIdAndEcran(ecran,index))<10 && toast({
      title: 'Bouton ajouté',
      status: 'success',
      duration: 3000,
      position : 'top',
     
    });
   
  } else {
    toast({
      title: 'Aucun bouton choisi',
      description: "Veuillez choisir un bouton.",
      status: 'error',
      duration: 3000,
      position : 'top',
      isClosable: true,
    });
  }
};


  /// ----------------------------------------- Fonctions métier ------------------------------------


	
  

  /// Delete ecran ---------------------------

  function deleteEcran(ecran, n) {
    setFeuillesData(prevData => {
      const data = JSON.parse(JSON.stringify(prevData));
      const sheet = data[currentFeuille];
    
      if (sheet && Array.isArray(sheet)) {
        let count = 0;
        const updatedSheet = sheet.filter(obj => {
          if (obj && obj['${id}'] === currentTest && obj['${ecran}'] === ecran["${ecran}"]) {
            count++;
            
            return count !== getObjectsByTypeAndIdAndEcran(ecran,n); // Filter out until the n-th matching object
          }
          return true; // Keep all other objects
        });
        data[currentFeuille] = updatedSheet;
      }
      return data;
    });
  }
 
  // Test s'il ya des ecrans pour un test donnée ----------------------
  function isTestIdExistsInSheet() {
    const sheet = feuillesData[currentFeuille];
  
    if (!sheet) {
      return false; // Feuille non trouvée
    }
  
    for (const obj of sheet) {
      if (obj["${type}"] === "TEST" && obj["${id}"] === currentTest) {
        return true;
      }
    }
  
    return false;
  }
 
/// Get the data  of a screen -------------------------
function getInitObjectByEcran(sheetName, ecran) {
  const champs = [];
  const boutons = [];


if(sheetName.trim()!=='' )
{
  const sheet = feuillesData[sheetName]; // Supposons que "data" contient l'objet JSON complet
  for (const obj of sheet) {
    if (obj["${type}"] === "INIT" && obj["${ecran}"] === ecran) {
      // Vérifier les propriétés "champ" et "bouton" dans l'objet
      for (const prop in obj) {
        if (prop.includes("champ")) {
          champs.push(obj[prop]);
        } else if (prop.includes("bouton")) {
          boutons.push(obj[prop]);
        }
      }
      break; // Sortir de la boucle après avoir trouvé le premier objet correspondant
    }
  }
}
  return {
    champs: champs,
    boutons: boutons
  };
}


/// Get the data  of a test -------------------------
function getTestObjectByEcran(sheetName, ecran,id,n) {
  const sheet = feuillesData[sheetName]; // Supposons que "data" contient l'objet JSON complet
  const champs = [];
  const boutons = [];
  let count=0;
  for (const obj of sheet) {
    if (obj["${type}"] === "TEST" && obj["${ecran}"] === ecran  && obj["${id}"] === id) {
      count+=1;
      // Vérifier les propriétés "champ" et "bouton" dans l'objet
      if(count === n) {
      for (const prop in obj) {
        if (prop.includes("champ")) {
          champs.push(obj[prop]);
        } else if (prop.includes("bouton")) {
           boutons.push(obj[prop]);
        }
      }
      break; // Sortir de la boucle après avoir trouvé le premier objet correspondant
    }
    }
  }

  return {
    champs: champs,
    boutons: boutons
  };
}

/// Ajouter button ------------------------------------------------------------------------------------------------------------

function ajouterBoutonFeuille( button,index,ecran,n) {
  const data = JSON.parse(JSON.stringify(feuillesData));
  let count=0;
  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"] === "TEST" &&
        data[currentFeuille][i]["${ecran}"] === ecran &&
        data[currentFeuille][i]["${id}"] === currentTest
      ) {
        count++;
        
        // Supprimer l'attribut de l'objet
        if(count === n) {
          
          if(nbrBoutonsEcranTest(ecran,n)<10)
           {
            data[currentFeuille][i][`\${bouton${index}}`]=button;
            setFeuillesData(data);
        }
         else {
          toast({
            title: 'Le nombre de boutons maximum a été atteint. ',
            description: "Veuillez continuer dans le prochain écran (automatiquement créé).",
            status: 'warning',
            duration: 3000,
            position : 'top',
            isClosable: true,
          });
          ajouterEcranIndex(ecran, n, ecran);
         }
          break; // Sortir de la boucle une fois l'attribut supprimé
        }
        
      }
    }
  }


}

/// Nombre des buttons dans une écran ------------------------------------------------------------------------------------------------------------

function nbrBoutonsEcranTest(ecran,n) {
  const data = JSON.parse(JSON.stringify(feuillesData));
  let count=0;
  let nbrBtn=0;
  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"] === "TEST" &&
        data[currentFeuille][i]["${ecran}"] === ecran &&
        data[currentFeuille][i]["${id}"] === currentTest
      ) {
        count++;
        
        // Supprimer l'attribut de l'objet
        if(count === n) {
      for (let prop in data[currentFeuille][i]) {
          if (data[currentFeuille][i].hasOwnProperty(prop)) {
           if(prop.includes('bouton')) nbrBtn+=1
           }
         }
          
          break; // Sortir de la boucle une fois l'attribut supprimé
        }
        
      }
    }
  }

return nbrBtn;
}


/// Ajouter ecran a un index donnée -----------------------
function ajouterEcranIndex(ecran, n, newEcran) {
  const data ={...feuillesData}
  let count = 0;
  let insertIndex = -1;
  const nouvelleObjet = {
    "${type}": "TEST",
    "${id}": currentTest,
    "${ecran}": newEcran,
  };

  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"] === "TEST" &&
        data[currentFeuille][i]["${ecran}"] === ecran &&
        data[currentFeuille][i]["${id}"] === currentTest
      ) {
        count++;

        // Supprimer l'attribut de l'objet
        if (count === n) {
          insertIndex = i + 1;
          break; // Sortir de la boucle une fois l'attribut supprimé
        }
      }

     
    }
  }

  // Insérer le nouvel écran à l'indice insertIndex
  if (insertIndex !== -1) {
  
    data[currentFeuille].splice(insertIndex, 0,nouvelleObjet);
   
  }

  setFeuillesData(data);
}

/// Ajouter ecran a un index donnée avant -----------------------
function ajouterEcranIndexAvant(ecran, n, newEcran) {
  const data ={...feuillesData}
  let count = 0;
  let insertIndex = -1;
  const nouvelleObjet = {
    "${type}": "TEST",
    "${id}": currentTest,
    "${ecran}": newEcran,
  };

  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"] === "TEST" &&
        data[currentFeuille][i]["${ecran}"] === ecran &&
        data[currentFeuille][i]["${id}"] === currentTest
      ) {
        count++;

        // Supprimer l'attribut de l'objet
        if (count === n) {
          insertIndex = i;
          break; // Sortir de la boucle une fois l'attribut supprimé
        }
      }

     
    }
  }

  // Insérer le nouvel écran à l'indice insertIndex
  if (insertIndex !== -1) {
   
    data[currentFeuille].splice(insertIndex, 0,nouvelleObjet);
   
  }

  setFeuillesData(data);
}


/// Delete button from screen -----------------------------------------------------------------------------
function supprimerAttribut(ecran, attribut,n) {
  const data = { ...feuillesData };

  let count=0;
  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"] === "TEST" &&
        data[currentFeuille][i]["${ecran}"] === ecran &&
        data[currentFeuille][i]["${id}"] === currentTest
      ) {
        count+=1
        // Supprimer l'attribut de l'objet
        if(count === n) {
          
          delete data[currentFeuille][i][attribut];
          break; // Sortir de la boucle une fois l'attribut supprimé
        }
      }
    }
  }

  setFeuillesData(data);
  tasserBoutons(ecran,n)
}


/// Modify button -----------------------------------------------------------------------------
function modifierAttribut(ecran, attribut,newvalue,n) {
  const data = { ...feuillesData };
 let count=0;
  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"] === "TEST" &&
        data[currentFeuille][i]["${ecran}"] === ecran &&
        data[currentFeuille][i]["${id}"] === currentTest
      ) {
        count+=1
        if(count===n)
        {
          data[currentFeuille][i][attribut] = newvalue;
          break; // Sortir de la boucle une fois l'attribut supprimé
        }
      
      }
    }
  }

  setFeuillesData(data);
 
}

/// Modify champ -----------------------------------------------------------------------------
function modifierChamp(ecran, attribut,newvalue,n) {
  const data = { ...feuillesData };
 let count=0;
  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"] === "TEST" &&
        data[currentFeuille][i]["${ecran}"] === ecran &&
        data[currentFeuille][i]["${id}"] === currentTest
      ) {
        count+=1
        if(count===n)
        {
          
            data[currentFeuille][i][attribut] = newvalue;
        break; // Sortir de la boucle une fois l'attribut supprimé
        }
     
      }
    }
  }

  setFeuillesData(data);
 
}


/// valeur d'un attribut-----------------------------------------------------------------------------
function valeurChamp(ecran, attribut,n) {
  const data = { ...feuillesData };
 let count=0;
  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"] === "TEST" &&
        data[currentFeuille][i]["${ecran}"] === ecran &&
        data[currentFeuille][i]["${id}"] === currentTest
      ) {
        count+=1;
        if(count===n)
        {
          
          return data[currentFeuille][i][attribut];
        }
            

      }
    }
  }
}

/// commentaire -----------------------------------------------------------------------------
function valeurCommentaire(ecran, attribut, n) {
  const data = { ...commentsData };

  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"].value === "INIT" &&
        data[currentFeuille][i]["${ecran}"].value === ecran
      ) {
        // Vérifier si l'attribut "comment" existe
        if (attribut in commentsData[currentFeuille][i]) {
          return commentsData[currentFeuille][i][attribut].comment;
        } else {
          return '';
        }
      }
    }
  }
}


/// Tasser les noms des buttons -----------------------------------
function tasserNomsBoutons(objet) {
  const regex = /^bouton(\d+)$/;
  const boutons = {};
  let index = 1;

  for (const [cle, valeur] of Object.entries(objet)) {
   
    if (cle.includes('bouton')) {
      
        const tmp='${'+`bouton${index.toString().padStart(2, '0')}`+'}'
      boutons[tmp] = valeur;
      index++;
    } else {
      boutons[cle] = valeur;
    }
  }

  return boutons;
}
/// Changment d'un objet par autre tassé----------------------------------------
function tasserBoutons(ecran,n) {
  const data = { ...feuillesData };
let count=0;
  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"] === "TEST" &&
        data[currentFeuille][i]["${ecran}"] === ecran &&
        data[currentFeuille][i]["${id}"] === currentTest
      ) {
        count+=1;
        if(count===n)
        {
          data[currentFeuille][i]=tasserNomsBoutons(data[currentFeuille][i])
          break;
        }
           
      }
    }
  }

  setFeuillesData(data);
}

/// L'ordre d'une écran ----------------------------------------------------------------------
function getObjectsByTypeAndIdAndEcran(ecran, index) {
  const sheet = feuillesData[currentFeuille];
  if (!sheet) {
    return [];
  }

  const objects = Object.entries(sheet).map(([index, obj]) => ({ index: index, ...obj }));
  const filteredObjects = objects.filter(obj => {
    return (
      obj["${type}"] === "TEST" &&
      obj["${id}"] === currentTest &&
      obj["${ecran}"] === ecran["${ecran}"]
    );
  });

  const filteredObjects2 = objects.filter(obj => {
    return (
      obj["${type}"] === "TEST" &&
      obj["${id}"] === currentTest
    );
  });

  if (filteredObjects2.length === 0 || index < 0 || index >= filteredObjects2.length) {
    return 0; // Return a default value or handle the case where no matching objects are found.
  }

  const indexObj = filteredObjects2[index].index;
  let rt = 1;

  filteredObjects.forEach((item, i) => {
    if (item.index === indexObj) {
      rt = i + 1;
    }
  });

  return rt;
}
/// Ajouter écran à la fin -----------------------------------------------------------------
function ajouteEcranFin()
{
  const nouvelleObjet = {
    "${type}": "TEST",
    "${id}": currentTest,
    "${ecran}": selectedScreen,
  };
 const data={...feuillesData}
 data[currentFeuille]=data[currentFeuille].filter((element) => element.hasOwnProperty("${ecran}") );
    data[currentFeuille].push(nouvelleObjet);
   setFeuillesData(data)

}

/// Les noms des écrans ------------------------------------
function getInitScreenNames() {

  const screens = new Set();
  if (feuillesData.hasOwnProperty(currentFeuille)) {
    const sheet = feuillesData[currentFeuille];
    for (const item of sheet) {
      if (item['${type}'] === 'INIT' && item.hasOwnProperty('${ecran}')) {
        screens.add(item['${ecran}']);
      }
    }
  }
  return Array.from(screens);
}

/// Nombre d'occ d'une écran ------------------------------
function nbrOccEcran(ecran) {
  const data = { ...feuillesData };
let count=0;
  // Vérifier si la feuille existe
  if (currentFeuille in data) {
    // Parcourir les éléments de la feuille
    for (let i = 0; i < data[currentFeuille].length; i++) {
      // Vérifier si l'élément est de type "TEST" et a le bon écran
      if (
        data[currentFeuille][i]["${type}"] === "TEST" &&
        data[currentFeuille][i]["${ecran}"] === ecran &&
        data[currentFeuille][i]["${id}"] === currentTest
      ) {
        count+=1;
        
           
      }
    }
  }

 return count ;
}
  const [itemOrder, setItemOrder] = useState([]);

  useEffect(() => {
    const objects = getObjectsByTestIdInSheet(currentFeuille, currentTest);
    const initialOrder = objects.map((_, index) => index);
    setItemOrder(initialOrder);
  }, [currentFeuille, currentTest,feuillesData]);

  
  function sontIdentiques(tableau1, tableau2) {
    // Vérifier si les tableaux ont la même longueur
    if (tableau1.length !== tableau2.length) {
      return false;
    }
  
    // Comparer les éléments un par un
    for (var i = 0; i < tableau1.length; i++) {
      if (tableau1[i] !== tableau2[i]) {
        return false;
      }
    }
  
    // Si toutes les cases correspondent, les tableaux sont identiques
    return true;
  }

  async function waitFunction() {
    const tmp=currentTest
    setCurrentTest('');
    setSpiner(true)
    await delayFunction();
    setSpiner(false)
    setCurrentTest(tmp);
  }
  async function handleDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const newOrder = Array.from(itemOrder);
    const [draggedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, draggedItem);
   

    changerOrder(newOrder)

  
    setItemOrder(newOrder);
  }

  function delayFunction() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(); // Resolve the promise after the delay
      }, 0);
    });
  }
  
  function getObjectsByTestIdInSheet(sheetName, id) {
    const data = { ...feuillesData };
    const sheet = data[sheetName];
    if (!sheet) {
      return [];
    }

    const result = [];
    for (const obj of sheet) {
      if (obj["${type}"] === "TEST" && obj["${id}"] === id && obj.hasOwnProperty("${ecran}")) {
        result.push(obj);
      }
    }

    return result;
  }

  /***    Changer order  */
  function insererTableauAuMilieu(tableauPrincipal, tableauInsere, condition) {
    // Trouver l'index de l'élément qui satisfait la condition
    let index = tableauPrincipal.findIndex(condition);
  
    // Si aucun élément ne satisfait la condition, ajouter le tableau à la fin
    if (index === -1) {
      tableauPrincipal.push(...tableauInsere);
    } else {
      // Insérer le tableau à l'index trouvé
      tableauPrincipal.splice(index, 0, ...tableauInsere);
    }
  
    return tableauPrincipal;
  }


  function remplacerTranche(nouvelleTranche) {
    const data = { ...feuillesData };
    let tableau = data[currentFeuille];
    // Supprimer la tranche de type donné
   // console.log('with test ::::',tableau)
   const filtredtableau = tableau.filter((element) =>  element['${id}'] !== currentTest );
  //console.log('without test ::::',tableau.filter((element) =>  element['${id}'] !== currentTest ))
   const condition = (element) => getOrder(element["${id}"]) > getOrder(currentTest);
   tableau= insererTableauAuMilieu(filtredtableau, nouvelleTranche, condition)
  
    // Ajouter la nouvelle tranche à la fin du tableau
    //tableau = tableau.concat(nouvelleTranche);
    return tableau;
  }
  

  function reorderArray(array, order) {
    if (array.length !== order.length) {
      throw new Error("Les tableaux doivent avoir la même longueur.");
    }
    
    const result = [];
    for (let i = 0; i < order.length; i++) {
      const newPosition = order[i];
      result[i] = array[newPosition];
    }
    
    return result;
  }
  function changerOrder(orderArray) {
   
    const data = JSON.parse(JSON.stringify(feuillesData));
    let tableau = data[currentFeuille];
    //console.log('ollllllllllddddd',tableau)
    // Supprimer la tranche de type donné
    tableau = tableau.filter((element) => element['${type}'] === 'TEST' && element['${id}'] === currentTest );
    const resultat=reorderArray(tableau,orderArray)
   
    const newSheet=remplacerTranche(resultat);
    data[currentFeuille]=newSheet
   setFeuillesData(data)
  
  }

  /*********             Ordre d'un test  *******/
  function getOrder(id) {
    const testIDs = [];
    const data = { ...feuillesData };
    let sheet = data[currentFeuille];
    for (let i = 0; i < sheet.length; i++) {
      const item = sheet[i];
      if (item["${type}"] === "TEST" && item.hasOwnProperty("${id}") && !testIDs.includes(item["${id}"])) {
        testIDs.push(item["${id}"]);
      }
    }
  
  return testIDs.indexOf(id)
  }
  
/**** *   il y a des test ou pas */
  function isContainScreen() {
    
    const data = { ...feuillesData };
    let sheet = data[currentFeuille];
    for (let i = 0; i < sheet.length; i++) {
      const item = sheet[i];
      if (item["${type}"] === "TEST" && item.hasOwnProperty("${ecran}") && item["${id}"] === currentTest) {
           return true
      }
    }
  
  return false
  }
 

  /*****   change buttons order  */
  function mettreAJourValeursBoutons(data,nouvellesValeurs) {
    const boutons = Object.keys(data).filter(key => key.startsWith("${bouton"));
    for (let i = 0; i < boutons.length; i++) {
      if (i < nouvellesValeurs.length) {
        data[boutons[i]] = nouvellesValeurs[i];
      }
    }
  }
  function replaceButtonValue(data, id, ecran, order) {
    let count=0
    let updatedButtons;
    for (let i = 0; i < data.length; i++) {
      if (data[i]["${type}"]==='TEST' && data[i]["${id}"] === id && data[i]["${ecran}"] === ecran) {
        count+=1
        updatedButtons= [];
        console.log('lllllleeeeeee',selectedEcran,getObjectsByTypeAndIdAndEcran(selectedEcran.ecran, selectedEcran.index))
        if(count===getObjectsByTypeAndIdAndEcran(selectedEcran.ecran, selectedEcran.index))
        {
          const boutonKeys = Object.keys(data[i]).filter(key => key.startsWith("${bouton"));
         
          for (let j = 0; j < order.length; j++) {
            const buttonIndex = order[j];
  
            if (buttonIndex < boutonKeys.length) {
              const buttonKey = boutonKeys[buttonIndex];
              updatedButtons.push(data[i][buttonKey]);
            }
          }
          console.log('updated buttons :: ',updatedButtons)
          mettreAJourValeursBoutons(data[i],updatedButtons)
          break; // Exit the loop once the object is found and updated
        }
      }
    }
    return data;
  }


  
  const [btnOrder, setBtnOrder] = useState([]);
  function handleDragEnd1(result) {
    if (!result.destination) {
      return;
    }
    const newOrder = Array.from(btnOrder);
    const [draggedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, draggedItem);
   
    setBtnOrder(newOrder);
    
    const newSheet=replaceButtonValue(feuillesData[currentFeuille],currentTest,selectedEcran.ecran['${ecran}'],newOrder)
    feuillesData[currentFeuille]=newSheet;
    console.log('order butttons :::::',newSheet)

   
  }
  

  /// Les choix d'un select depuis commentaires ---------------------------------------------------------------------------
  function extraireChoix(chaine) {
    const regex = /Choix: ([^"]+)/;
    const match = chaine.match(regex);
    if (match) {
      const choixString = match[1];
      const choixArray = choixString.split('/');
      return choixArray.map(choix => choix.trim());
    }
    return [];
  }

     return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {currentTest && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {getObjectsByTestIdInSheet(currentFeuille, currentTest).map((ecran, index) => {
                

                  return (
                    <Draggable key={index} draggableId={index.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Accordion allowMultiple>
                          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
  <IconButton
    colorScheme='transparent'
    aria-label='Search database'
    size={1}
    color='gray'
    icon={<PlusSquareIcon />}
    _hover={{ color: 'blue'}}
    onClick={()=>{
      setSelectedEcran({ecran,index})
      alert5OnOpen()
    
  }}
  />
</div>
                            <AccordionItem key={`${currentFeuille}-${currentTest}-${index}`}>
                              {({ isExpanded }) => (
                                <div>
                                  <Box display="flex" flexDirection="row"  alignItems="center">
                                 <DragHandleIcon />
                  <h2 style={{ width: '100%' }}>
                    <AccordionButton >
                      <Box as="span" flex="1" textAlign="left">
                        <Text me="auto" color={textColor1} fontSize="md" fontWeight="700" lineHeight="100%">
                          Ecran {index + 1} .
                        </Text>
                      </Box>
                      <Box as="span" flex="1" textAlign="left">
                        <Text me="auto" color={textColor} fontSize="md" fontWeight="700" lineHeight="100%">
                          {ecran['${ecran}']} {' '}
                          {nbrOccEcran(ecran['${ecran}'])>1 && (<span
                             style={{
                               backgroundColor: '#4682B4',
                               borderRadius: '50%',
                               paddingLeft: '5px',
                               paddingRight: '5px',
                               color: 'white',
                               marginRight: '3px',
                               fontSize : 13
                              }}
                             >
                               {getObjectsByTypeAndIdAndEcran(ecran,index)}
                          </span>)}
                          {}
                        </Text>
                      </Box>
                      {isExpanded ? (
              <ChevronUpIcon fontSize='20px' />
            ) : (
              <ChevronDownIcon fontSize='20px' />
            )}
                    </AccordionButton>
                  </h2>
                  <IconButton
                    colorScheme="transparent"
                    color="red.400"
                    aria-label="delete ecran"
                    icon={<DeleteIcon />}
                    onClick={() => {
                      
                      setSelectedEcran({ ecran, index });
                     
                      alert1OnOpen();
                    }}
                  />
                </Box>
                                  <AccordionPanel pb={4} bg={lanceBg}>
                                  <Box {...(true ? {} : provided.dragHandleProps)}>
                      { getInitObjectByEcran(currentFeuille, ecran["${ecran}"]).champs.length>0 && (<Flex mt='15px'
                     borderTop="1px solid"
                      borderColor="gray.200"
                      alignItems="center"
                      justifyContent="center"
                     position="relative"
                      mb='20px'>
                      <Text
                        position="absolute"
                        top="-10px"
                        bg="white"
                        px="2"
                        fontWeight="bold"
                        fontSize="sm"
                        color="gray.500"
                       >
                          Champs
                      </Text>
                      </Flex>)}
                      
                  <div >
                  
                  {
                 getInitObjectByEcran(currentFeuille,ecran['${ecran}']).champs.map((champ,indexCh)=>{
                   
                  let typeChamp='I'
                   if(champ.split('##').length !== 1) 
                   {
                    typeChamp=champ.split('##')[1].split('')[2]
                    
                   }
                   if(typeChamp === 'R')
                   {
                     return(
                      <Box>
                      <Radio marginBottom='15px' value={indexCh} 
                       defaultChecked={valeurChamp(ecran["${ecran}"],'${champ'+formatNumber(indexCh.toString())+'}',getObjectsByTypeAndIdAndEcran(ecran,index))=== champ.split("##")[0] ? true : false}
                       onChange={(event) =>{
                       
                        const ind=indexCh;
                        const tobeUpdeted='${champ'+formatNumber(ind.toString())+'}'
                    
                       const value= event.target.checked ? champ.split("##")[0] :''
                      modifierChamp(ecran["${ecran}"],tobeUpdeted,value,getObjectsByTypeAndIdAndEcran(ecran,index))
                      }}>
                      {champ.split("##")[0]}
                      </Radio>
                      </Box>
                     )
                   }
                   if(typeChamp === 'C')
                   {
                     return(
                      <Box>
                          <Checkbox marginBottom='15px'  
                          defaultChecked={valeurChamp(ecran["${ecran}"],'${champ'+formatNumber(indexCh.toString())+'}',getObjectsByTypeAndIdAndEcran(ecran,index))=== champ.split("##")[0] ? true : false} 
                          onChange={(event) =>{
                           
                            const ind=indexCh;
                            const tobeUpdeted='${champ'+formatNumber(ind.toString())+'}'
                        
                           const value= event.target.checked ? champ.split("##")[0] :''
                          modifierChamp(ecran["${ecran}"],tobeUpdeted,value,getObjectsByTypeAndIdAndEcran(ecran,index))
                          }}>
                            {champ.split("##")[0]}</Checkbox>
                      </Box>
                      
                     )
                   }
                   if(typeChamp === 'S'){
                   let valComment=  valeurCommentaire(ecran["${ecran}"],'${champ'+formatNumber(indexCh.toString())+'}',getObjectsByTypeAndIdAndEcran(ecran,index));
                      return (<FormControl display="flex" flexDirection="row" alignItems="center"  marginBottom='15px'>
                      <FormLabel
                        display='flex'
                        fontSize='sm'
                        fontWeight='500'
                        color={textColor}
                        mb='8px'
                      >
                        {champ.split("##")[0]} 
                        
                        {(valComment !=='' &&  valComment.trim()!=='' ) &&(
                        <Tooltip label={valComment}
                         fontSize='md' >
                        <InfoIcon ml='5px' mr='2px' color='gray' />
                       </Tooltip>)} : 
                      </FormLabel>
                    
                      <Input
                        variant='auth'
                        fontSize='sm'
                        type='text'
                        value={valeurChamp(ecran["${ecran}"],'${champ'+formatNumber(indexCh.toString())+'}',getObjectsByTypeAndIdAndEcran(ecran,index))}
                        placeholder={champ.split("##")[0]}
                        mb='8px'
                        fontWeight='500'
                        size='md'
                        w='40%'
                        onChange={(event) => {
                          const ind=indexCh;
                           const tobeUpdeted='${champ'+formatNumber(ind.toString())+'}'
                        
                           modifierChamp(ecran["${ecran}"],tobeUpdeted,event.target.value,getObjectsByTypeAndIdAndEcran(ecran,index))
                           
                        }
                      }
                      />
                      
                      { (valComment !=='' &&  valComment.trim()!=='' && extraireChoix(valComment).length > 0 ) && (<Menu closeOnSelect={false}>
  <MenuButton>
  <IconButton
                         variant='outline'
                         colorScheme='brand'
                         aria-label='Call Sage'
                         ml='5px'
                         mb='8px'
                         size='sm'
                         fontSize='18px'
                         icon={<HamburgerIcon />}
                      />
  </MenuButton>
  <MenuList minWidth='240px'>
    <MenuOptionGroup  title= {champ.split("##")[0]}  type='radio'
     onChange={(value)=>{            
      const ind=indexCh;
      const tobeUpdeted='${champ'+formatNumber(ind.toString())+'}'
      modifierChamp(ecran["${ecran}"],tobeUpdeted,value,getObjectsByTypeAndIdAndEcran(ecran,index))
    }}>
      {extraireChoix(valComment).map((opt,io)=> (
         <MenuItemOption value={opt}>{opt}</MenuItemOption>
      )
  
      )}
    </MenuOptionGroup>

  </MenuList>
</Menu>)}
                    </FormControl>) }
                    if(champ.split("##")[0].trim() !== '') {
                      let valComment=  valeurCommentaire(ecran["${ecran}"],'${champ'+formatNumber(indexCh.toString())+'}',getObjectsByTypeAndIdAndEcran(ecran,index));
                      return (<FormControl display="flex" flexDirection="row" alignItems="center"  marginBottom='15px'>
                      <FormLabel
                        display='flex'
                        fontSize='sm'
                        fontWeight='500'
                        color={textColor}
                        mb='8px'
                      >
                        {champ.split("##")[0]} 
                        
                        {(valComment !=='' &&  valComment.trim()!=='' ) &&(
                        <Tooltip label={valComment}
                         fontSize='md' >
                        <InfoIcon ml='5px' mr='2px' color='gray' />
                       </Tooltip>)} : 
                      </FormLabel>
                    
                      <Input
                        variant='auth'
                        fontSize='sm'
                        type='text'
                        value={valeurChamp(ecran["${ecran}"],'${champ'+formatNumber(indexCh.toString())+'}',getObjectsByTypeAndIdAndEcran(ecran,index))}
                        placeholder={champ.split("##")[0]}
                        mb='8px'
                        fontWeight='500'
                        size='md'
                        w='40%'
                        onChange={(event) => {
                          const ind=indexCh;
                           const tobeUpdeted='${champ'+formatNumber(ind.toString())+'}'
                        
                           modifierChamp(ecran["${ecran}"],tobeUpdeted,event.target.value,getObjectsByTypeAndIdAndEcran(ecran,index))
                           
                        }
                      }
                      />
                  
                    </FormControl>)    

                    }else return <span></span>
                  
                }
                )}
                  {/* buttons de test  */}

                  <Flex
                     mt='15px'
                      borderTop={getTestObjectByEcran( currentFeuille,ecran['${ecran}'],currentTest,getObjectsByTypeAndIdAndEcran(ecran,index)).boutons.length>0 ? "1px solid" : "none"}
                      borderColor="gray.200"
                      alignItems="center"
                      justifyContent="center"
                     position="relative"
                     >
                       {
                       getTestObjectByEcran( currentFeuille,ecran['${ecran}'],currentTest,getObjectsByTypeAndIdAndEcran(ecran,index)).boutons.length>0 &&(<Text
                        position="absolute"
                        top="-10px"
                        bg="white"
                        px="2"
                        fontWeight="bold"
                        fontSize="sm"
                        color="gray.500"
                       >
                          Bouttons 
                      </Text>)}
                  <FormControl  display="flex" flexDirection="row" mt='20px'>
                  <Box>
                  <DragDropContext onDragEnd={handleDragEnd1} >
  <Droppable droppableId="draggable-list" direction="horizontal" >
    {(provided) => (
      <Flex ref={provided.innerRef} {...provided.droppableProps} flexWrap='wrap' alignContent='center' justifyContent='center'>
        {
        getTestObjectByEcran(currentFeuille, ecran['${ecran}'], currentTest, getObjectsByTypeAndIdAndEcran(ecran, index)).boutons.map((btn, btnInx) => {
          const btnLabel=btn.split('##')[0]
          const toollabel='Déplacer le bouton "'+ btnLabel +'"'
          if (btn.split('##')[0].trim() !== '') {
            return (
              <Draggable key={`btn-${btnInx}`} draggableId={`btn-${btnInx}`} index={btnInx} >
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    
                  <Flex key={index} alignItems="center" mb="5px" ml="5px">
 
{/*--------------------------------------------- */}
<div style={{backgroundColor :'lightgray',borderRadius :'12px'}}>

<Menu>
  <MenuButton>
  <Button
        fontSize="sm"
        variant="brand"
        fontWeight="500"
        h="41"

      >
        <span
          style={{
            backgroundColor: '#4682B4',
            borderRadius: '50%',
            paddingLeft: '5px',
            paddingRight: '5px',
            color: 'white',
            marginRight: '3px',
          }}
        >
          {btnInx + 1}
        </span>{' '}
        {btnLabel}
      </Button>

  </MenuButton>
  <Portal>
    <MenuList>
      <MenuItem onClick={() => {
         setSelectedBtn(btnInx)
          setSelectedEcran({ ecran, index });
          alert2OnOpen();
        }}>
        <IconButton
         colorScheme="transparent"
         color="red.400"
         mr="8px"
         aria-label="delete button"
         icon={<DeleteIcon />}
         onClick={() => {
          setSelectedBtn(btnInx)
          setSelectedEcran({ ecran, index });
          alert2OnOpen();
        }}
      />
      Supprimer
      </MenuItem>

      <MenuItem onClick={() => {
        setSelectedBtn(btnInx)
          setSelectedEcran({ ecran, index });
          alert3OnOpen();
        }}>
        <IconButton
         colorScheme="transparent"
         color="brand.400"
         mr="8px"
         aria-label="delete button"
         icon={<EditIcon />}
         onClick={() => {
          setSelectedBtn(btnInx)
          setSelectedEcran({ ecran, index });
          alert3OnOpen();
        }}
      />
      Modifier
      </MenuItem>
     
    </MenuList>
  </Portal>
</Menu>
{/*--------------------------------------------- */}
<Tooltip label={toollabel} fontSize='md' >
<IconButton
  bg='transparent'
  _hover={{ bg: '#E5E4E2'}}
  size='sm'

  icon={<RiDragMove2Fill size={20} />}
   onMouseEnter={()=>
    {
      setSelectedEcran({ ecran, index });
      console.log('______Ecran :: ',ecran)
      setBtnOrder( getTestObjectByEcran(currentFeuille, ecran['${ecran}'], currentTest, getObjectsByTypeAndIdAndEcran(ecran, index)).boutons.map((_, ii) => ii))
    }}
    />              
 </Tooltip>

</div>
    

</Flex>

                  </div>
                )}
              </Draggable>
            );
          } else return <span key={`btn-${btnInx}`}></span>;
        })}
        {provided.placeholder}
      </Flex>

    )}
  </Droppable>
</DragDropContext>
</Box>
                  </FormControl>
                  </Flex >
                  {/* add buttons */}
                  {getInitObjectByEcran(currentFeuille, ecran["${ecran}"]).boutons.length>0 && (<Flex
                     mt='15px'
                     borderTop="1px solid"
                      borderColor="gray.200"
                      alignItems="center"
                      justifyContent="center"
                     position="relative"
                     >
                       <Text
                        position="absolute"
                        top="-10px"
                        bg="white"
                        px="2"
                        fontWeight="bold"
                        fontSize="sm"
                        color="gray.500"
                       >
                          Ajouter bouton
                      </Text>
                     <Box mt='20px' display="flex" flexDirection="row">
                     <Select value={selectedValue} placeholder="Choisir un bouton" onChange={handleSelectChange}>
                     {getInitObjectByEcran(currentFeuille, ecran["${ecran}"]).boutons.map((btn, btnindex) => {
                      if (btn.trim() !== '') {
                       return (
                         <option value={btn+'##'+getTestObjectByEcran(currentFeuille,ecran['${ecran}'],currentTest,getObjectsByTypeAndIdAndEcran(ecran,index)).boutons.length+'##'+ecran['${ecran}']}>
                            {btn}
                         </option>
                           );
                                    }
                          })}
                     </Select>
                     <IconButton
                        ml="5px"
                        colorScheme="blue"
                        aria-label="add"
                        icon={<AddIcon />}
                        onClick={ () => {
                          setSelectedEcran({ecran,index})
                          handleAddClick(ecran,index);
                        }
                        }
                      />
                     </Box>
                    </Flex>)}
                  </div>
                  </Box>
                                  </AccordionPanel>
                                </div>
                              )}
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      {currentTest && ( <Box ml="40%" mt='20px'> <Button colorScheme='twitter' leftIcon={<MdLaptop />} mt='10px' onClick={alert4OnOpen}>
              Ajouter écran
       </Button> </Box>)}
      {false && (<Stack spacing={4} bg="white" p={8} borderRadius="lg">
    <Heading as="h1" size="md" color="primary.900">
      Aucun écran de test !
    </Heading>
    <Text as="p" fontSize="md" color="primary.500">
    Ajouter votre premier écran à "{currentTest}"
    </Text>
    <Button colorScheme='twitter'  leftIcon={<MdLaptop />}  mt='10px' onClick={alert4OnOpen}>
              Choisir une écran
       </Button>
  </Stack>)}

       {!currentTest && !spiner && Object.keys(feuillesData).length !== 0 && ( <Box mt='10%' ml='20%' mr='20%'> 
       <NotSelectedCard/>
       </Box>)}
      {!currentTest && spiner && ( <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
       <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
        />
       </div>)}
  
       {/* ---------- Alert delete screen -------------- */ }
       <AlertDialog isOpen={alert1IsOpen} leastDestructiveRef={cancelRef1} onClose={alert1OnClose} isCentered>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Supprimer l'écran
              </AlertDialogHeader>

              <AlertDialogCloseButton />
              <AlertDialogBody>
                Êtes-vous sûr de vouloir supprimer cet écran ?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef1} onClick={alert1OnClose}>
                  Annuler
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    
                   
                    deleteEcran(selectedEcran.ecran, selectedEcran.index);
                    toast({
                      title: 'Écran supprimé',
                      description: "L'écran a été supprimé avec succès.",
                      status: 'success',
                      duration: 3000,
                      position : 'top',
                      isClosable: true,
                    });
                    alert1OnClose();
                  }}
                  ml={3}
                >
                  Supprimer
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* ---------- Alert delete buttons  -------------- */ }
          {selectedEcran && (<AlertDialog isOpen={alert2IsOpen} leastDestructiveRef={cancelRef2} onClose={alert2OnClose} isCentered>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Supprimer le bouton
              </AlertDialogHeader>

              <AlertDialogCloseButton />
              <AlertDialogBody>
                Êtes-vous sûr de vouloir supprimer ce bouton ?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef2} onClick={alert2OnClose}>
                  Annuler
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    const ind=selectedBtn;
                   const tobeDeleted='${bouton'+formatNumber(ind.toString())+'}'
                   
                  supprimerAttribut(selectedEcran.ecran["${ecran}"],tobeDeleted,getObjectsByTypeAndIdAndEcran(selectedEcran.ecran,selectedEcran.index))
                    toast({
                      title: 'Bouton supprimé',
                      description: "Le bouton a été supprimé avec succès.",
                      status: 'success',
                      duration: 3000,
                      position : 'top',
                      isClosable: true,
                    });
                    alert2OnClose();
                  }}
                  ml={3}
                >
                  Supprimer
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>)}

          {/* ---------- Alert edit button  -------------- */ }
          {selectedEcran && (<AlertDialog isOpen={alert3IsOpen} leastDestructiveRef={cancelRef3} onClose={alert3OnClose} isCentered>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Modifier le button
              </AlertDialogHeader>

              <AlertDialogCloseButton />
              <AlertDialogBody>
              <Select  onChange={handleSelectChange1}>
                        {getInitObjectByEcran(currentFeuille, selectedEcran.ecran["${ecran}"]).boutons.map((btn, btnindex) => {
                            
                            return  (<option value={btn+'##'+getTestObjectByEcran(currentFeuille,selectedEcran.ecran["${ecran}"],currentTest,getObjectsByTypeAndIdAndEcran(selectedEcran.ecran,selectedEcran.index)).boutons.length+'##'+selectedEcran.ecran["${ecran}"]}>{btn}</option>)
                        })}
              </Select>
                
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef3} onClick={alert3OnClose}>
                  Annuler
                </Button>
                <Button
                  colorScheme="brand"
                  onClick={() => {
                    if(selectedValue1!=='') {
                    const ind=selectedBtn;
                   const tobeUpdeted='${bouton'+formatNumber(ind.toString())+'}'
                   modifierAttribut(selectedEcran.ecran["${ecran}"],tobeUpdeted,selectedValue1,getObjectsByTypeAndIdAndEcran(selectedEcran.ecran,selectedEcran.index))
                    ///--- to do
                    toast({
                      title: 'Bouton modifié',
                      description: "Le bouton a été modifié avec succès.",
                      status: 'success',
                      duration: 3000,
                      position : 'top',
                      isClosable: true,
                    });
                    alert3OnClose();
                  }else{
                    toast({
                      title: 'Aucun bouton choisi.',
                      status: 'error',
                      duration: 3000,
                      position : 'top',
                      isClosable: true,
                    });
                  }
                  }}

                  ml={3}
                >
                  Modifier
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>)}

          {/* ---------- Alert add screen  -------------- */ }
         <AlertDialog isOpen={alert4IsOpen} leastDestructiveRef={cancelRef4} onClose={alert4OnClose} isCentered>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Nouveau écran
              </AlertDialogHeader>

              <AlertDialogCloseButton />
              <AlertDialogBody>
              <Select  bg='lightblue'
             borderColor='lightblue'
              color='white' 
              onChange={handleSelectNewEcran}
              placeholder="Choisir un écran ">
                 {  getInitScreenNames().map((itemecr, indexecr) => {
                            
                            return  (<option value={itemecr}>{itemecr}</option>)
                        })}
                      </Select>
                
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef4} onClick={alert4OnClose}>
                  Annuler
                </Button>
                <Button
                  colorScheme="brand"
                  onClick={() => {
                    if(selectedScreen!=='')
                    {
                      ajouteEcranFin()
                      toast({
                        title: 'Ecran ajouté',
                        description: "L'écran a été ajouté avec succès.",
                        status: 'success',
                        duration: 3000,
                        position : 'top',
                        isClosable: true,
                      });
                      alert4OnClose();
                      setSelectedScreen('')
                    }else {
                      toast({
                        title: 'Aucun écran choisi',
                        description: "Veuillez choisir un écran.",
                        status: 'error',
                        duration: 3000,
                        position : 'top',
                        isClosable: true,
                      });
                    }
                    
                    
                  }}
                  ml={3}
                >
                  Ajouter
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

           {/* ---------- Alert add screen in middle -------------- */ }
         <AlertDialog isOpen={alert5IsOpen} leastDestructiveRef={cancelRef5} onClose={alert5OnClose} isCentered>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Nouveau écran
              </AlertDialogHeader>

              <AlertDialogCloseButton />
              <AlertDialogBody>
              <Select  bg='lightblue'
             borderColor='lightblue'
              color='white' 
              onChange={handleSelectNewEcran}
              placeholder="Choisir un écran ">
                 {  getInitScreenNames().map((itemecr, indexecr) => {
                            
                            return  (<option value={itemecr}>{itemecr}</option>)
                        })}
                      </Select>
                
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef5} onClick={alert5OnClose}>
                  Annuler
                </Button>
                <Button
                  colorScheme="brand"
                  onClick={() => {
                    if(selectedScreen!=='')
                    {
                      ajouterEcranIndexAvant(selectedEcran.ecran["${ecran}"], getObjectsByTypeAndIdAndEcran(selectedEcran.ecran,selectedEcran.index), selectedScreen);
                      waitFunction()
                      toast({
                        title: 'Ecran ajouté',
                        description: "L'écran a été ajouté avec succès.",
                        status: 'success',
                        duration: 3000,
                        position : 'top',
                        isClosable: true,
                      });
                      alert5OnClose();
                      setSelectedScreen('')
                    }else {
                      toast({
                        title: 'Aucun écran choisi',
                        description: "Veuillez choisir un écran.",
                        status: 'error',
                        duration: 3000,
                        position : 'top',
                        isClosable: true,
                      });
                    }
                    
                    
                  }}
                  ml={3}
                >
                  Ajouter
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
    </Box>
  );
  
}