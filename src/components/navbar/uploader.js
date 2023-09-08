import { useState, useRef, useEffect } from 'react';
import './uploader.css';
import { MdCloudUpload } from 'react-icons/md';
import { AiFillFileExcel } from 'react-icons/ai';
import * as XLSX from 'xlsx';


export default function Uploader(props) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [feuilleName, setFeuilleName] = useState(props.feuilleName);
  

  // alert change file ---


  useEffect(() => {
    setFeuilleName(props.feuilleName);
  }, [props.feuilleName]);

 

    /********* Get the comments too ****************************** */
    const handleFileChange = ({ target: { files } }) => {
    
      files[0] && props.setFileName(files[0].name);
      if (files[0]) {
        props.setExcelFile(files[0]);
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'buffer' });
          const feuilles = workbook.SheetNames;
          const newData = {};
          const newData1 = {};
    
          feuilles.forEach((feuille) => {
            const worksheet = workbook.Sheets[feuille];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
            // Retrieve comments for each cell
            const comments = {};
  Object.keys(worksheet).forEach((cellAddress) => {
    if (worksheet[cellAddress].c && worksheet[cellAddress].c.length > 0) {
      comments[cellAddress] = worksheet[cellAddress].c[0].t;
    }
  });
            console.log('________________',comments);

            const formattedData1 = jsonData.slice(1).map((row, rowIndex) => {
              const obj = {};
              row.forEach((value, index) => {
                const header = jsonData[0][index];
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: index });
                const cellComment = comments && comments[cellAddress] && comments[cellAddress].c ? comments[cellAddress].c[0].t : '';
    
                obj[header] = { value, comment: comments[cellAddress] ? comments[cellAddress] : '' };
              });
              return obj;
            });
    



            // Convert the jsonData to the desired format
            const formattedData = jsonData.slice(1).map((row, rowIndex) => {
              const obj = {};
              row.forEach((value, index) => {
                const header = jsonData[0][index];
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: index });
                const cellComment = comments && comments[cellAddress] && comments[cellAddress].c ? comments[cellAddress].c[0].t : '';
    
                obj[header] = value
              });
              return obj;
            });
    
            // Store the feuille name and data in an object
            newData[feuille] = formattedData;
            newData1[feuille] = formattedData1;
          });
    
          props.setFeuillesData(newData);
          props.setCommentsData(newData1);
          console.log('___With comments',props.commentsData);
        };
        reader.readAsArrayBuffer(files[0]);
      }
    };
    
    /********* ****************************** */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange({ target: { files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  function supprimerSheet(objetJSON, nomSheet) {
    for (let sheet in objetJSON) {
      if (sheet.toLowerCase() === nomSheet.toLowerCase()) {
        delete objetJSON[sheet];
        break;
      }
    }
    return objetJSON;
  }

  return (
    <main>
      <form onClick={handleClick} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
        <input
          type="file"
          accept=".xlsx, .xls"
          className="input-field"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {props.excelFile ? (
          <div className="upload-container">
            <AiFillFileExcel color="#1475cf" size={60} />
            <p>{props.fileName}</p>
            <div style={{fontFamily:'cursive',marginTop :'20px'}}>Cliquer ici si vous voulez changer le fichier.</div>
          </div>
        ) : (
          <div className={`upload-container${isDragging ? ' dragging' : ''}`}>
            <MdCloudUpload color="#1475cf" size={60} />
            <p>{isDragging ? 'Déposer le fichier ici' : 'Choisir votre fichier Excel'}</p>
          </div>
        )}
      </form>
    </main>
  );
}

