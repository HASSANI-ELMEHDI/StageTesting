import React, { useContext, useEffect, useRef, useState } from 'react';
import {  InputBase, makeStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { TreeView } from '@material-ui/lab';
import TreeItem from '@material-ui/lab/TreeItem';
import EditIcon from '@material-ui/icons/Edit';
import {MdMoreVert } from 'react-icons/md';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { AiFillFileExcel, AiOutlineNodeCollapse } from 'react-icons/ai';
import { MdAddCircleOutline, MdDelete, MdEdit, MdEditNote, MdEditRoad, MdSave, MdSaveAs,MdOutlineExpandCircleDown } from 'react-icons/md';
import { AddIcon, HamburgerIcon, Icon, UpDownIcon ,TriangleDownIcon,SmallCloseIcon} from '@chakra-ui/icons';
import { SidebarContext } from 'contexts/SidebarContext';
import { useColorModeValue } from '@chakra-ui/system';
import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Avatar, Box, Button, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { IoMdCopy } from 'react-icons/io';
import { RiRunFill } from 'react-icons/ri';

const useStyles = makeStyles((theme) => ({
  
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontSize: '13px',
    animation: '$fadeIn 0.5s ease-in-out', // Animation name and duration
  },
  // Define the animation keyframes
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  activeListItem: {
    borderRight: '4px solid #1475cf'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    height: '35px', // Adjust the height as needed
  },
}));


const styles = {
  treeView: {
    // Set a fixed height for the TreeView component
    
  },
};
export default function Trees() {
  // Chakra Color Mode
	const navbarIcon = useColorModeValue('gray.400', 'white');
	let menuBg = useColorModeValue('white', 'navy.800');
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorBrand = useColorModeValue('brand.700', 'brand.400');
	const ethColor = useColorModeValue('gray.700', 'white');
	const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
	const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
	const ethBox = useColorModeValue('white', 'navy.800');
	const shadow = useColorModeValue(
		'14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
		'14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
	);
  /// ----------- Alert delete ecran -----------------
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()


  const toast = useToast()
	const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
  let activeIcon = useColorModeValue('brand.500', 'white');
  const [activeItem, setActiveItem] = useState(null);
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
  const classes = useStyles();
  const [newChildLabel, setNewChildLabel] = useState('');
  const [onEditing, setOnEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [treeItems, setTreeItems] = useState([]);
  useEffect(() => {
    let item;
    let tmpitms = [];


    let testList;
    Object.entries(feuillesData).map(([feuilleName, feuilleData], index) => {
      testList=[]

      getTestIdBySheetName(feuilleName).map((testId, childindex) => {

        testList.push({
          id: `${index}##${childindex}`,
          label: testId,
          children: [],
          top: false,
        })

      })
      item = {
        id: index,
        label: feuilleName,
        children: testList,
        top: true,
      };
if(isTestIdExistsInSheet(feuilleData))
      tmpitms.push(item);
  
    });
    setTreeItems(tmpitms);
  }, [feuillesData]);


  const [editItemId, setEditItemId] = useState(null);
  const [editedLabel, setEditedLabel] = useState('');
  const [preveditedLabel, setPreveditedLabel] = useState('');
 
  const handleDelete = (item) => {
    const updatedTreeItems = removeItemFromTree(treeItems, item.id);
    setTreeItems(updatedTreeItems);
    removeObjectsById(currentFeuille,item.label)
    setCurrentTest('')

    console.log('---------------------- delte --------------',feuillesData)
  };

  const handleEdit = (itemId, label) => {
    setEditItemId(itemId);
    setEditedLabel(label);
  };

  const handleSaveEdit = (item) => {
    const updatedTreeItems = updateItemInTree(treeItems, item.id, editedLabel);
    
    setTreeItems(updatedTreeItems);
    setCurrentTest(editedLabel)
    setEditItemId(null);
  
    modifierAttributIdFeuille(currentFeuille,item.label,editedLabel)
    
    setEditedLabel('');
   
    console.log('---------------------- updated --------------',feuillesData)
  };

  const removeItemFromTree = (items, itemId) => {
    return items.filter((item) => {
      if (item.id === itemId) {
        return false;
      } else if (item.children && item.children.length > 0) {
        item.children = removeItemFromTree(item.children, itemId);
        return true;
      }
      return true;
    });
  };

  const updateItemInTree = (items, itemId, label) => {
    return items.map((item) => {
      if (item.id === itemId) {
        return { ...item, label };
      } else if (item.children && item.children.length > 0) {
        item.children = updateItemInTree(item.children, itemId, label);
      }
      return item;
    });
  };

  const addChildToTree = (items, itemId, label) => {
    let newChild = null;
  
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const newI = {
          id: generateItemId(),
          label: label,
          children: [],
          top: false,
        };
        item.children.push(newI);
        newChild = newI;
        console.log('the new child 1111',newChild)
      } 
      return item;
    });
  console.log('updated _______________ _ _ __ __ :',{ updatedItems, newChild })
    return { updatedItems, newChild };
  };
  
  function ajouteTest(id)
{
  const nouvelleObjet = {
    "${type}": "TEST",
    "${id}": id,
  };
 const data={...feuillesData}
    data[currentFeuille].push(nouvelleObjet);
   setFeuillesData(data)
}
  const handleAddChild = (itemId) => {

    console.log('test existe',isTestExiste(newChildLabel))
    if ( newChildLabel.trim() !=='' && newChildLabel !=='' && !isTestExiste(newChildLabel)) {
    
    const { updatedItems, newChild } = addChildToTree(treeItems, itemId, newChildLabel);
    setTreeItems(updatedItems);
     ajouteTest(newChildLabel)
    setNewChildLabel('');
   console.log('not me',newChild)
    if (newChild) {
      console.log('not me 2')
      handleListItemClick(newChild);
    }
  }else {
    if(isTestExiste(newChildLabel))
    {
      toast({
        title: 'Nom déja utilisé.',
        status: 'warning',
        position: 'top',
        isClosable: true,
        })
    }else 
    toast({
      title: 'Saisissez un nom valide.',
      status: 'warning',
      position: 'top',
      isClosable: true,
      })
  }
  };
  // Helper function to generate a unique id for the new child
  const generateItemId = () => {
    // Generate a random number or use a library to generate a unique identifier
    return Math.floor(Math.random() * 1000);
  };

  const handleListItemClick = (item) => {
      console.log('Clicked Item: ', item.label,'avec id',item.id);
      if (!item.top) {
        const parentItem = findParent(treeItems, item.id);
        console.log('is a test for the feuille :', parentItem.label);
        setCurrentFeuille(parentItem.label)
        setCurrentTest(item.label)
      }else{
        setActiveItem(item.id);
        setCurrentFeuille(item.label)
        setCurrentTest('')
        console.log('is feuille' );
      }

    
   
  };
  
  function findParent(data, childId) {
    console.log('the data is is is isi :: ',data)
    for (let i = 0; i < data.length; i++) {
      
      const node = data[i];
  
      if (node.id === childId) {
        console.log('error : Child node doesnt have a parent')
        return null; // Child node doesn't have a parent
      }
  
      if (node.children && node.children.length > 0) { // Add null check
        for (let j = 0; j < node.children.length; j++) {
          const child = node.children[j];
  
          if (child.id === childId) {
            return node;
          }
  
          const parent = findParent(child.children, childId);
  
          if (parent !== null) {
            console.log('parent parent:: ',parent)
            return parent;
          }
        }
      }
    }
  
    return null; // Child node not found
  }

// Test si test existe -------------------------------------
function isTestExiste(id) {
  const testIDs = [];
 
    const data = { ...feuillesData };
  
    let sheet = data[currentFeuille];
    console.log('isTestExiste ::: :: : :', currentFeuille)
    for (let i = 0; i < sheet.length; i++) {
      const item = sheet[i];
      if (item["${type}"] === "TEST" && item.hasOwnProperty("${id}") && !testIDs.includes(item["${id}"])) {
        testIDs.push(item["${id}"]);
      }
    }
  
  return testIDs.indexOf(id) !==-1
}

/// Test si une feuille est de test -------------------------------------
  function isTestIdExistsInSheet(sheet) {
    if (!sheet) {
      return false; // Feuille non trouvée
    }
  
    for (const obj of sheet) {
      if (obj["${type}"] === "INIT") {
        return true;
      }
    }
  
    return false;
  }
  //// Fonctions métier ---------------------------------------
  function getTestIdBySheetName(sheetName) {

    const sheet = feuillesData[sheetName];
    if (!sheet) {
      return []; // La feuille n'existe pas, retourne un tableau vide
    }
    
    const testIdsSet = new Set();
  
    sheet.forEach(item => {
      if (item.hasOwnProperty("${type}") && item.hasOwnProperty("${id}") && item["${type}"] === "TEST") {
        testIdsSet.add(item["${id}"]);
      }
    });
  
    const testIds = Array.from(testIdsSet);
  
    return testIds;
  }


  function removeObjectsById(sheetName, id) {
    let data =feuillesData;
    const sheet = data[sheetName];
    if (!sheet) {
      setFeuillesData(data);// La feuille n'existe pas, retourne les données inchangées
    }
  
    const updatedSheet = sheet.filter(item => {
      return !(item.hasOwnProperty("${id}") && item["${id}"] === id);
    });
  
    data[sheetName] = updatedSheet;
  
    setFeuillesData(data);
  }


  function modifierAttributIdFeuille(nomFeuille, valeurDonnee, nouvelId) {
     let data=feuillesData;
    if (data.hasOwnProperty(nomFeuille)) {
      data[nomFeuille].forEach(function(objet) {
        if (objet.hasOwnProperty("${id}") && objet["${id}"] === valeurDonnee) {
          objet["${id}"] = nouvelId;
        }
      });
    }
    setFeuillesData(data)
  }

  /// Dupliquer test ----------------------------------------------------------

  function findNameWithOccurrences(arr, element) {
    let count = 0;
    const regex = new RegExp(`${element}\\((\\d+)\\)`);
  
    for (let i = 0; i < arr.length; i++) {
      const match = arr[i].match(regex);
      if (arr[i] === element || (match && parseInt(match[1]) > count)) {
        count = match ? parseInt(match[1]) : count;
      }
    }
  
    count++;
    while (arr.includes(`${element}(${count})`)) {
      count++;
    }
  
    return `${element}(${count})`;
  }

  function copyObjectsToSheet() {
    
    let data ={...feuillesData};
    const sheetData  = data[currentFeuille];

      let newLabel =  findNameWithOccurrences(getTestIdBySheetName(currentFeuille), currentTest)
    
  
    const objectsToCopy = sheetData.filter(obj => obj["${type}"] === 'TEST' && obj["${id}"] === currentTest);
  
    const newObjects = objectsToCopy.map(obj => ({ ...obj, "${id}": newLabel}));
    sheetData.push(...newObjects);
    data[currentFeuille]=sheetData;
    setFeuillesData(data)
    console.log('_______________________Deplacated :',data[currentFeuille])
  }

// Run test -------------------------------------------------------




  const renderTreeItems = (items) =>
  items.map((item) => (
    <TreeItem
      key={item.id}
      nodeId={item.id.toString()}
      label={
        <Box style={!item.top ? { display: 'flex',borderLeft: '2px solid lightblue'} :{display: 'flex'}}>
  <ListItem
    button
    component="a"
    href="#"
    className={`${classes.listItem} ${(activeItem === item.id && item.top) ? classes.activeListItem : ''}`}
    style={item.top  ? {marginBottom :'2px'} : {}}
    onClick={() => handleListItemClick(item)}
    
  >
  { item.top && ( activeItem === item.id ? (<Icon as={AiFillFileExcel} color="#1475cf" mr='20px' />) :(<Icon as={AiFillFileExcel} color="gray" mr='20px' />))}
    {editItemId === item.id ? (
      <>
       <InputBase
         value={editedLabel}
         onChange={(e) => setEditedLabel(e.target.value)}
         onKeyDown={(e) => {
          if(e.key === 'Enter')
          if ( editedLabel.trim() !=='' && editedLabel !=='') {
             setOnEditing(false)
             handleSaveEdit(item)
             setCurrentTest(editedLabel)
             toast({
               title: 'Nom de test modifié .',
               description: `Nouveau nom : ${editedLabel}.`,
               status: 'success',
               position: 'top',
               isClosable: true,
               })
               }else{
                toast({
                  title: 'Saisissez un nom valide.',
                  status: 'warning',
                  position: 'top',
                  isClosable: true,
                  })

               }
            }}
        style={(editedLabel.trim() !=='' && editedLabel !=='') ? { borderBottom: '1px solid #1475cf', backgroundColor: 'white' } :{borderBottom: '1px solid red', backgroundColor: 'white'}}
       />
       {true && (<IconButton
          bg='transparent'
          fontSize='17px'
          icon={<SmallCloseIcon />}
          _hover={{ bg: 'transparent'}}
        onClick ={()=> {
          setEditedLabel(preveditedLabel)
             setCurrentTest(editedLabel)
             setOnEditing(false)
             setEditItemId(null);
        }}
        />)}
      </>
    ) : (
      <>
      <span style={(item.top && activeItem === item.id)  ? {fontWeight:'bold'} :{color :'gray',fontWeight:'normal'}}> {item.label}</span>
      </>
    )}
     {/*_______________ Menu ____________________*/}
  {(!item.top && !onEditing) && (<Menu  >
  <MenuButton
    as={IconButton}
    aria-label='Options'
    icon={<MdMoreVert />}
    bg='transparent'
    _hover={{ bg: 'transparent'}}
    style={{marginLeft :'auto'}}
  />
  <MenuList>
    <MenuItem icon={ <MdDelete size={20} color="#D73239" />}  onClick={() =>{
      handleListItemClick(item)
      setSelectedItem(item)
      onOpen() 
    }}>
      Supprimer
    </MenuItem>
    <MenuItem icon={ <MdEdit size={20} color="#1475cf" />} onClick={() =>{
      setPreveditedLabel(item.label)
          setOnEditing(true)
          handleEdit(item.id, item.label)
          
      } }>
      Modifier nom
    </MenuItem>

    <MenuItem icon={ <IoMdCopy size={20} />} onClick={() =>{
          /// traitement
          copyObjectsToSheet()
      } }>
      Dupliquer
    </MenuItem>
  
  </MenuList>
</Menu>)}
  {/*______________/Menu___________________*/} 

{/*______________Run___________________
{(item.top && activeItem === item.id  )&& (
  <div className="icon-container"  style={{marginLeft :'auto'}}>
      <IconButton className="triangle-icon"
  bg='transparent'
  aria-label='run option'
  icon={<TriangleDownIcon color='teal.500'/>}
 
/>
      
    </div>)}
 ______________/Run___________________*/} 
  
  {(true && item.top && activeItem !== item.id  ) && (
<MdOutlineExpandCircleDown  style={{marginLeft :'auto'}}/>
)
}
  </ListItem>
</Box>
        }
      >
        {item.top && (
          <>
            <InputBase
           style={{marginLeft :'20px',fontSize :'13px'}}
            className={classes.input}
              onChange={(e) => {
                setCurrentFeuille(item.label)
                setNewChildLabel(e.target.value) 
              }}
              placeholder="Nom du test"
              style={(newChildLabel.trim() !=='' && newChildLabel !=='') ? { borderBottom: '1px solid #1475cf', backgroundColor: 'white' } :{borderBottom: '1px solid red', backgroundColor: 'white'}}
            />
            <IconButton edge="end" aria-label="add" onClick={() => handleAddChild(item.id)} >
              <MdAddCircleOutline size={20} color='#1475cf'/>
            </IconButton>
            
          </>
        )}
        {item.children.length > 0 && renderTreeItems(item.children)}
      </TreeItem>
    ));

  return (<>
   <Box
   height='90%'
overflowY="auto"
css={{
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'lightgray',
    borderRadius: '24px',
  },
}}
>
      <TreeView>{renderTreeItems(treeItems)}</TreeView>
    </Box>
         {/* alerte de suppression d'un test */}
  <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Supprimer le test {currentTest} ?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
          Êtes-vous sûr de vouloir supprimer le test "{currentTest}" de {currentFeuille}  ? le test sera supprimé définitivement.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Non
            </Button>
            <Button colorScheme='red' ml={3} onClick={ () =>{
              handleDelete(selectedItem)
              onClose()
              toast({
                title: 'Test supprimé.',
                description: `Le test "${currentTest}" de ${currentFeuille} est supprimé.`,
                status: 'success',
                position: 'top',
                isClosable: true,
              })
              }}>
                Oui
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  </>);
}