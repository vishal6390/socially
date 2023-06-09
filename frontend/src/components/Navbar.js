import React, {useContext, useState} from 'react'
import { Flex, Box, Stack, Spacer, Heading, InputGroup, InputLeftElement, Input, InputRightElement, Skeleton, MenuButton, Menu, Button, Avatar, MenuList, MenuItem, MenuDivider, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, Text, Center} from '@chakra-ui/react';
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import {Auth} from '../context/AuthContext'
import {toast} from 'react-toastify'
import axios from 'axios'

export const Navbar = () => {

    const history = useHistory()
    const {curr_user, setCurr_user} = useContext(Auth)

    const handleLogout = () => {
        window.localStorage.removeItem('Socially_Current_User')
        setCurr_user({})
        toast.success("Logged Out Successfully")
        history.push('/login')
    }
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchResult, setSearchResult] = useState()

    const handleSearch = async () => {
        // console.log("hello there")
        if(searchQuery !== ""){
            setLoading(true)
            const obj = {
                searchQuery
            }
            await axios.post("/api/getFilteredData", obj)
            .then(res => {
                setSearchResult(res.data.res_user)
                setLoading(false)
            })
            .catch(err => {
                toast.error("Error Occurred!!!")
                setLoading(false)
            })

        } else {
            toast.error("Search something")
        }


    }

    const handleConnectClick = async (requestedUserId) => {
        const obj = {
            user_id: curr_user._id, 
            friend_id: requestedUserId
        }

        axios.post("/api/connectUpdate", obj)
        .then(res => {
            toast.success(res.data.message)
        })
        .catch(err => {
            toast.error("Error Occurred")
        })
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
    <Flex>
        <Box p='2' cursor='pointer' onClick={() => history.push('/')}>
            <Heading position='relative' left='150px' size='lg'>Socially</Heading>
        </Box>
        <Spacer />
        <InputGroup w='600px' p='2'>
            <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon mt='18px' ml='15px' color='gray.300' />}
            />
            <Input type='text' cursor='pointer' onClick={onOpen} placeholder='Search for friends' />
        </InputGroup>
        <Spacer />
        <Box p='2'>
            {/* <Menu p={1}>
                <Tooltip label='Chats'>
                    <MenuButton position='relative' left='-20px' onClick={() => history.push('/chat')}>
                        <ChatIcon color='black.300' fontSize="2xl" m={1}/>
                    </MenuButton>
                </Tooltip>
            </Menu> */}
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar size='sm' cursor='pointer' name={curr_user.username} src={curr_user.profilePic} />
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => history.push('/profile')}>My Profile</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </Box>
    </Flex>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search Users</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            
            <Flex>
            <InputGroup size='md'>
                <Input
                    pr='4.5rem'
                    type='text'
                    placeholder='Search users by name'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <InputRightElement width='4.5rem' pr='20px'>
                    <Button h='1.75rem' size='sm' isLoading={loading} loadingText='Searching' onClick={handleSearch}>Search</Button>
                </InputRightElement>
                </InputGroup>
            </Flex>

            {
                loading 
                ?
                    <Stack mt='5px' spacing='5px'>
                        <Skeleton height='50px'></Skeleton>
                        <Skeleton height='50px'></Skeleton>
                        <Skeleton height='50px'></Skeleton>
                    </Stack>
                :
                    (searchResult) && (searchResult.length === 0 
                        ?
                            <Box h='100px'>
                                <Center>
                                <Heading position='relative' top='25px' as='h6' size='lg'>
                                    No Users found
                                </Heading>
                                </Center>
                            </Box>
                        : 
                            <Stack mt='5px' spacing='5px'>
                                {
                                    searchResult && searchResult.map(item => {
                                        return (
                                            <Box bg='gray.200' height='60px' key={item._id}>
                                                <Flex justifyContent='center' alignItems='center'>
                                                    <Avatar position='relative' top='6px' left='10px' size='md' name={item.username} src={item.profilePic} />
                                                    <Text position='relative' left='20px' top='4px'>{item.username}</Text>
                                                    <Spacer />
                                                    <Button colorScheme='blue' variant='ghost' position='relative' top='4px' right='10px' onClick={() => handleConnectClick(item._id)}>+connect</Button>
                                                </Flex>
                                            </Box>
                                        )
                                    })
                                }
                            </Stack>
                    )
            }

          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  )
}
