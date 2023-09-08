import { Button, Flex, Image, Link, Text, useColorModeValue } from '@chakra-ui/react';
import logoWhite from 'assets/img/layout/info.png';

export default function NotSelectedCard() {
	const bgColor = 'linear-gradient(135deg, lightgray 0%, #F3F3F3 100%)';
	const borderColor = useColorModeValue('#f4f7fe', 'navy.800');

	return (
		<Flex
			justify='center'
			direction='column'
			align='center'
			bg={bgColor}
			borderRadius='30px'
			me={{ base: '20px' }}
			position='relative'>
			<Flex
				border='5px solid'
				borderColor={borderColor}
				bg='linear-gradient(135deg, lightgray 0%, #F3F3F3 100%)'
				borderRadius='50%'
				w='94px'
				h='94px'
				align='center'
				justify='center'
				mx='auto'
				position='absolute'
				left='50%'
				top='-47px'
				transform='translate(-50%, 0%)'>
				<Image src={logoWhite} w='60px' h='60px' />
			</Flex>
			<Flex direction='column' mb='12px' align='center' justify='center' px='15px' pt='55px'>
				<Text
					fontSize={{ base: 'lg', xl: '18px' }}
					color='gray'
					fontWeight='bold'
					lineHeight='150%'
					textAlign='center'
					px='10px'
					mb='14px'>
					Aucun test choisi !
				</Text>
				<Text fontSize='14px' color={'gray'} px='10px' mb='14px' textAlign='center'>
					Sélectionner / ajouter un test 
				</Text>
			</Flex>
			
		</Flex>
	);
}
