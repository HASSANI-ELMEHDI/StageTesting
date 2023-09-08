// Chakra Imports
import {
	Button,
	Flex,
	Icon, useColorModeValue,
	useColorMode
} from '@chakra-ui/react';
// Custom Components

import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import { useContext } from 'react';
// Assets
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import routes from 'routes';
import Upload from './Upload';
import { SidebarContext } from 'contexts/SidebarContext';
export default function HeaderLinks(props: { secondary: boolean }) {
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
	const { secondary } = props;
	const { colorMode, toggleColorMode } = useColorMode();
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
	const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
	return (
		<Flex
			w={{ sm: '100%', md: 'auto' }}
			alignItems='center'
			flexDirection='row'
			bg={menuBg}
			flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
			p='10px'
			borderRadius='30px'
			boxShadow={shadow}>
				<SidebarResponsive routes={routes} />
		    <Upload />
		
		
			
			
			<Button
				variant='no-hover'
				bg='transparent'
				pl='20px'
			
				minW='unset'
				minH='unset'
				h='18px'
				w='max-content'
				onClick={toggleColorMode}>
				<Icon
					me='10px'
					h='18px'
					w='18px'
					color={navbarIcon}
					as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
				/>
			</Button>
			
			
		</Flex>
	);
}

HeaderLinks.propTypes = {
	variant: PropTypes.string,
	fixed: PropTypes.bool,
	secondary: PropTypes.bool,
	onOpen: PropTypes.func
};
