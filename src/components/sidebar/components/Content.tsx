// chakra imports
import { Box, Flex, Stack } from '@chakra-ui/react';
//   Custom components
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';
import SidebarCard from 'components/sidebar/components/SidebarCard';
import Tree from './Tree';
import { useContext } from 'react';
import { SidebarContext } from 'contexts/SidebarContext';

// FUNCTIONS

function SidebarContent(props: { routes: RoutesType[] }) {
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
	const { routes } = props;
	// SIDEBAR
	return (
		<Flex direction='column' height='100%' pt='25px' borderRadius='30px'>
			<Brand />
			<Stack direction='column' mt='8px' mb='auto' height='100%'>
				<Box ps='20px' pe={{ lg: '16px', '2xl': '16px' }} height='100%'>
					<Tree/>
					{/*<Links routes={routes} />*/}
				</Box>
			</Stack>
             
			{/*<Box ps='20px' pe={{ lg: '16px', '2xl': '20px' }} mt='60px' mb='40px' borderRadius='30px'>
				<SidebarCard />
	</Box>*/}
		</Flex>
	);
}

export default SidebarContent;
