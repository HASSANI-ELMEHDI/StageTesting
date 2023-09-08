
import { createStyles, makeStyles } from '@material-ui/core/styles';


// Chakra imports
import { useColorModeValue } from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiFillFileExcel } from 'react-icons/ai';
import AlertChangeFile from './AlertChangeFile';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { MdCloudUpload, MdDownload } from 'react-icons/md';
import 'swiper/css';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { SidebarContext } from 'contexts/SidebarContext';
import * as XLSX from 'xlsx';
import Uploader from './uploader';



const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			width: '100%',
		},
		button: {
			marginTop: theme.spacing(1),
			marginRight: theme.spacing(1),
		},
		actionsContainer: {
			marginBottom: theme.spacing(2),
		},
		resetContainer: {
			padding: theme.spacing(3),
		},

	}),
);

function getSteps() {
	return [<b style={{ color: 'purple' }}>'Enter Personal Details'</b>,
	<b style={{ color: 'purple' }}>'Enter Education Details'</b>,
	<b style={{ color: 'purple' }}>'Enter Address'</b>];
}

/// Dowload excel ------------------------------------------


export default function Upload() {
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
  const bgColor = 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)';


   // alert change file ---
   const { isOpen: isOpen1 , onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
   const cancelRef1 = useRef()
  const [ecranValues, setEcranValues] = useState([]);


  const handleSelectChange = (e) => {

    
    const selectedIndex = e.target.value;
    changeActiveSlide(selectedIndex )
   // setSelectedTabIndex(selectedIndex)
    console.log('Activve tab  :', selectedTabIndex);
    const selectedValue = ecranValues[selectedIndex];
    
  };

  const classes = useStyles();
	const [activeStep, setActiveStep] = React.useState(0);
	const steps = getSteps();

	const handleNext = () => {

    setSelectedTabIndex(0)
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

  const [collapse1, setCollapse1] = useState(false);
  const toggleCollapse1 = () => {
    setCollapse2(false);
    setCollapse1(!collapse1);
  };

  const [collapse2, setCollapse2] = useState(false);
  const toggleCollapse2 = () => {
    setCollapse1(false);
    setCollapse2(!collapse2);
  
  };




	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const lanceBg = useColorModeValue('white', 'navy.800');
	
  const [buttonStates, setButtonStates] = useState(new Map());


  const [excelFile, setExcelFile] = useState(null)
  const [fileName, setFileName] = useState("Aucun fichier sélectionné")
  const [excelData, setExcelData] = useState(null);
  const [feuille, setFeuille] = useState(null);
  const [feuilleName, setFeuilleName] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  
  const [chemin, setChemin] = useState("Non spécifié");
  const [updatedExcelData, setupdatedExcelData] = useState(null);

  const [nbrTests, setNbrTests] = useState(1);
 
  const champsIndex = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
  const buttonsIndex = [20,21,22,23,24,25,26,27,28,29];
  const [buttonsArray, setButtonsArray] = useState([]);

  useEffect(() => {
    if (excelData) {
      setChemin(excelData[NbrLigneInit() + 1][excelData[NbrLigneInit() + 1].length - 1]);
      const filteredData = excelData.slice(2, excelData.length).filter((item) => item[0] === 'INIT');
    
      filteredData.map((item, index) => {
        
        ecranValues.push(item[2])
        console.log(item);
  
      });
    }
  }, [excelData]);

 

  /// for tabs 
   // Chakra color mode
   const textColor = useColorModeValue("navy.700", "white");
   const textColorSecondary = "gray.400";
   const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
   const textColorBrand = useColorModeValue("brand.500", "white");
   const brandStars = useColorModeValue("brand.500", "brand.400");
   const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
   const googleText = useColorModeValue("navy.700", "white");
   const googleHover = useColorModeValue(
     { bg: "gray.200" },
     { bg: "whiteAlpha.300" }
   );
   const googleActive = useColorModeValue(
     { bg: "secondaryGray.300" },
     { bg: "whiteAlpha.200" }
   );
   const [show, setShow] = React.useState(false);
   const handleClick = () => setShow(!show);

  
   const swiperRef = useRef(null);

   const changeActiveSlide = (index) => {
     if (swiperRef.current && swiperRef.current.swiper) {
       swiperRef.current.swiper.slideTo(index);
     }
   };

   // Nombre de lignes d'initiation des tests
   function NbrLigneInit() {
    const count = excelData.filter(subarray => subarray[0] === 'INIT').length;
    return count
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

/// Ajouter les attribus manquants ------------------------
function ajouterAttributsManquants(objets) {
  // Obtient la liste des attributs existants dans tous les objets
  let attributsCommuns = objets.reduce((communs, objet) => {
    Object.keys(objet).forEach(attribut => {
      if (!communs.includes(attribut)) {
        communs.push(attribut);
      }
    });
    return communs;
  }, []);

  // Ajoute les attributs manquants avec une valeur vide dans chaque objet
  objets.forEach(objet => {
    attributsCommuns.forEach(attribut => {
      if (!objet.hasOwnProperty(attribut)) {
        objet[attribut] = 'jjj';
      }
    });
  });

  return objets;
}
/// Changer ordre des attribus -------------------------
function rearrangeAttributes(objects) {
  if (objects.length === 0) {
    return [];
  }

  const attributes = Object.keys(objects[0]);

  return objects.map((obj) => {
    const rearrangedObj = {};

    attributes.forEach((attr) => {
      if (attr in obj) {
        rearrangedObj[attr] = obj[attr];
      }
    });

    return rearrangedObj;
  });
}

/// Ajout des champs manqants pour tous data -------------------------
function traiterFeuillesDonnees() {
  const data ={...feuillesData}
  // Boucle sur les clés (feuilles) de l'objet data
  for (let feuille in data) {
    if (data.hasOwnProperty(feuille)) {
      // Obtient la feuille de données
      let feuilleDonnees = data[feuille];

      // Applique la fonction ajouterAttributsManquants à la feuille de données
      feuilleDonnees = ajouterAttributsManquants(feuilleDonnees);
      feuilleDonnees = rearrangeAttributes(feuilleDonnees )

      // Met à jour la feuille de données dans l'objet data
      data[feuille] = feuilleDonnees;
    }
  }

  setFeuillesData(data)
}

function supprimerObjetsPasEcran() {
  console.log('feulliles dattatt apres ',feuillesData,feuillesData[currentFeuille].length)
  const data ={...feuillesData}
  let sheet=data[currentFeuille]
  for (var i = sheet.length - 1; i >= 0; i--) {
    var objet = sheet[i];
    if (objet["${type}"] === 'TEST' && objet.hasOwnProperty("${id}") && !objet.hasOwnProperty("${ecran}")) {
      sheet.splice(i, 1);
    }
  }
  data[currentFeuille]=sheet;
  return data;
}

  //// Dowload excel --------------------------------
  function generateExcel() {

    console.log('feulliles dattatt avant ',feuillesData,'___',currentFeuille,'___')
    let data = {...feuillesData}
    // Créer un nouveau classeur Excel
    const workbook = XLSX.utils.book_new();
  
    // Parcourir chaque feuille
    Object.keys(data).forEach((feuille) => {
      // Convertir les données de la feuille en un tableau d'objets
      const jsonData = data[feuille];
  
      // Définir l'ordre et les titres des colonnes
      const columns = [
        { header: '${type}', key: '${type}', width: 10 },
        { header: '${id}', key: '${id}', width: 10 },
        { header: '${ecran}', key: '${ecran}', width: 20 },
        { header: '${msgKOPrevu}', key: '${msgKOPrevu}', width: 20 },
        { header: '${get}', key: '${get}', width: 20 },
        { header: '${champ01}', key: '${champ01}', width: 20 },
        { header: '${champ02}', key: '${champ02}', width: 20 },
        { header: '${champ03}', key: '${champ03}', width: 20 },
        { header: '${champ04}', key: '${champ04}', width: 20 },
        { header: '${champ05}', key: '${champ05}', width: 20 },
        { header: '${champ06}', key: '${champ06}', width: 20 },
        { header: '${champ07}', key: '${champ07}', width: 20 },
        { header: '${champ08}', key: '${champ08}', width: 20 },
        { header: '${champ09}', key: '${champ09}', width: 20 },
        { header: '${champ10}', key: '${champ10}', width: 20 },
        { header: '${champ11}', key: '${champ11}', width: 20 },
        { header: '${champ12}', key: '${champ12}', width: 20 },
        { header: '${champ13}', key: '${champ13}', width: 20 },
        { header: '${champ14}', key: '${champ14}', width: 20 },
        { header: '${champ15}', key: '${champ15}', width: 20 },
        { header: '${bouton01}', key: '${bouton01}', width: 20 },
        { header: '${bouton02}', key: '${bouton02}', width: 20 },
        { header: '${bouton03}', key: '${bouton03}', width: 20 },
        { header: '${bouton04}', key: '${bouton04}', width: 20 },
        { header: '${bouton05}', key: '${bouton05}', width: 20 },
        { header: '${bouton06}', key: '${bouton06}', width: 20 },
        { header: '${bouton07}', key: '${bouton07}', width: 20 },
        { header: '${bouton08}', key: '${bouton08}', width: 20 },
        { header: '${bouton09}', key: '${bouton09}', width: 20 },
        { header: '${bouton10}', key: '${bouton10}', width: 20 },
       
      ];
  
      // Créer une feuille de calcul vide
      const worksheet = XLSX.utils.aoa_to_sheet([]);
  
      // Ajouter les données à la feuille de calcul
      XLSX.utils.sheet_add_json(worksheet, jsonData, {
        header: columns.map((column) => column.key),
        skipHeader: false,
        origin: -1,
        blankrows: false,
      });
  
      // Définir la largeur des colonnes
      columns.forEach((column, index) => {
        worksheet[`!cols`] = worksheet[`!cols`] || [];
        worksheet[`!cols`][index] = { wch: column.width};
      });
   
      // Ajouter la feuille de calcul au classeur
      XLSX.utils.book_append_sheet(workbook, worksheet, feuille);
    });
  
    // Convertir le classeur en un fichier binaire
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Créer un objet Blob à partir du fichier binaire
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    // Générer une URL pour le Blob
    const excelFileUrl = URL.createObjectURL(blob);
  
    // Créer un lien de téléchargement
    const downloadLink = document.createElement('a');
    downloadLink.href = excelFileUrl;
    downloadLink.download = fileName;
  
    // Ajouter le lien au document et cliquer dessus pour déclencher le téléchargement
    document.body.appendChild(downloadLink);
    downloadLink.click();
  
    // Nettoyer l'URL et le lien
    URL.revokeObjectURL(excelFileUrl);
    document.body.removeChild(downloadLink);
  
  }



	return (
		
   
<>
    <div >
      { Object.keys(feuillesData).length > 0 ? 
      (
  <div>
  <Stack direction='row' spacing={1} > 
  <Button onClick={onOpen1} colorScheme='teal' variant='outline'>
    <AiFillFileExcel color="#1475cf" size={20} style={{ marginRight: "8px" }} />{`${fileName}`}
  </Button>
  <Button leftIcon={<MdDownload />} colorScheme='blue' variant='solid' onClick={generateExcel}  >
   Télécharger Excel
  </Button>
  </Stack>
</div>
      
      ) :
       (<Button 
        bg={bgColor}
        color='white'
        _hover={{ bg: bgColor }}
        onClick={()=> {
       setNbrTests(1)
     
       onOpen()
  
  }}><MdCloudUpload color='white' size={30} style={{marginRight:"8px"}} />Importer un fichier Excel</Button>) }
      </div>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered

        size='lg'
     
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Importer</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
          <div style={{display:"bock",justifyContent:"center" ,alignItems:"center" }}>
          
          <Uploader 
  excelFile={excelFile} 
  fileName={fileName} 
  feuilleName={feuilleName} 
  setFeuilleName={setFeuilleName} 
  setExcelFile={setExcelFile}  
  setFileName={setFileName} 
  setExcelData={setExcelData} 
  feuille={feuille} 
  setFeuille={setFeuille} 
  feuillesData={feuillesData} 
  setFeuillesData={setFeuillesData} 
  commentsData={commentsData}
  setCommentsData={setCommentsData}
  setCurrentFeuille={setCurrentFeuille}
  setCurrentTest={setCurrentTest}

/>
          
       </div>
          </AlertDialogBody>
          <AlertDialogFooter>
      
              <Button variant='brand' w='40%' onClick={onClose} ml={3}>
                Ok
              </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
        
      </AlertDialog>




      <AlertChangeFile
       isOpen={isOpen1}
       onOpen={onOpen1}
       onOpen2={onOpen}
       onClose={onClose1}
       cancelRef={cancelRef1}
       generateExcel={generateExcel}
       setExcelFile={setExcelFile}
       setFeuillesData={setFeuillesData} 
       setCurrentFeuille={setCurrentFeuille}
       setCurrentTest={setCurrentTest}
      />
    </>


	
		 

		
);
}
