// Chakra imports
import { Flex, useColorModeValue ,Image} from '@chakra-ui/react';
import logo from 'assets/img/layout/logo.png';
// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex alignItems='center' flexDirection='column'>
			<Image src={logo} h='50px' w='250px' my='32px'/>

			<HSeparator mb='20px' />
		</Flex>
	);
}

export default SidebarBrand;
