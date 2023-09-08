import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button,
    useDisclosure
  } from '@chakra-ui/react'
  import { MdCloudUpload, MdDownload } from 'react-icons/md';
  import React, { useContext, useEffect, useRef, useState } from 'react';
export default function AlertChangeFile(props) {
   
  
    return (
      <>
        <AlertDialog
          motionPreset='slideInBottom'
          leastDestructiveRef={props.cancelRef}
          onClose={props.onClose}
          isOpen={props.isOpen}
          isCentered
        >
          <AlertDialogOverlay />
  
          <AlertDialogContent>
            <AlertDialogHeader> Abandonner les modifications?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
            Êtes-vous sûr(e) de vouloir abandonner les modifications ? Votre travail ne sera pas enregistré.
            </AlertDialogBody>
            <AlertDialogFooter>
            <Button leftIcon={<MdDownload />} colorScheme='blue' variant='solid' onClick={()=> props.generateExcel()}  >
   Télécharger Excel
  </Button>
              <Button colorScheme='red' ml={3} onClick={()=>{
                props.setCurrentFeuille('')
                props.setCurrentTest('')
                props.setFeuillesData({})
                props.setExcelFile(null)
                props.onClose()
                props.onOpen2()
              }} >
                Abandonner
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }