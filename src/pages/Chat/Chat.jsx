import { Text, Box, Flex, Grid, GridItem, Image, Container, Input, Heading, Button, HStack, SimpleGrid, Divider } from "@chakra-ui/react"
import images from '../../assets/assets'
import './Chat.css'
import { useContext, useState } from "react"
import { db, logOut } from "../../config/Firebase"
import { useNavigate } from "react-router-dom"
import { arrayUnion, collection,  doc,  getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { AppContext } from "../../context/Context"
import { toast } from "react-toastify"
function Chat() {
    const [hoverBtn, SethoverBtn] = useState(false)
    const navigate = useNavigate()

    // left side bar 
    const { userData } = useContext(AppContext)
    const [User, setUser] = useState(null);
    const [showUser, setshowUser] = useState(false)


    const inputHandler = async (e) => {
        try {
            const input = e.target.value
            if (input) {
                setshowUser(true)
                const userRef = collection(db, 'users')
                const q = query(userRef, where("username", "==", input.toLowerCase()))
                const querySnap = await getDocs(q)

                if (!querySnap.empty ) {
                    setUser(querySnap.docs[0].data())
                } else {
                    setUser(null)
                }
            }else{
                setshowUser(false)
            }
        } catch (error) {
            console.error(error);
            toast.error(error.code)
        }
    }


    // add the chat 
    const addChat = async () => {
      const messageRef = collection(db, 'message', )
      const chatRef = collection(db, "chat")

      try {
           const newMessage = doc(messageRef)
           await setDoc(newMessage, {
            createdAt: serverTimestamp(),
            messages: []
           })

        //    reciever template 
           await updateDoc(doc(chatRef, User.id), {
              chatsData: arrayUnion({
                messageID: newMessage.id,
                lastMessage: '',
                Rid: userData.id,
                updatedAt: Date.now(),
                messageSeen: true
            })
           })
  
        //    senders template 
           await updateDoc(doc(chatRef, userData.id), {
            chatsData: arrayUnion({
                messageID: newMessage.id,
                lastMessage: '',
                Rid: User.id,
                updatedAt: Date.now(),
                messageSeen: true
            })
           })

           
      } catch (error) {
        console.error(error);
        toast.error(error.code)
      }
    }

    

        return (
            <section bgGradient='linear-gradient(#596aff, #383699);'>
                <Grid minH='100vh' templateColumns='repeat(8, 3fr)'>
                    <GridItem colSpan='2' bg='#001030;'>
                        <Flex align='center' justify='space-between' mb='15px' py='20px' px='10px' mx='auto' cursor='pointer'>
                            <img src={images.logo} alt="" width='60%' />
                            <img src={images.menu_icon} alt="" width='12%' onClick={() => SethoverBtn(!hoverBtn)} />
                        </Flex>

                        <Flex justify='end' mx='10px'>
                            {hoverBtn ?
                                <Flex align='center' justify='center' flexDirection='column' background='white' color='black' zIndex='10' position='fixed' w='10%' mx='auto' p='10px' borderRadius='10px' top='12%'>
                                    <Text mt='3px' cursor='pointer' onClick={() => navigate('/profile')}>Edit Profile</Text>
                                    <Divider orientation='horizontal' my='10px' />
                                    <Text my='3px' cursor='pointer' onClick={() => logOut()}>Logout</Text>
                                </Flex>
                                : ''}
                        </Flex>

                        <Flex align='center' justify='center' bg='#002670' w='330px' mx='auto' py='3px' px='10px' borderRadius='6px'>
                            <img src={images.search_icon} alt="" width='6%' />
                            <Input
                                w="330px"
                                bg="transparent"
                                border="none"
                                outline="none"
                                placeholder="Search For Freinds..."
                                className="input"
                                _hover={{}}
                                _focus={{ boxShadow: 'none' }}
                                color='white'
                                onChange={inputHandler}
                            />
                        </Flex>


                        {/* <Flex flexDirection='column' h='75vh' overflowY='scroll' border='none' outline='none' mt='8px'>
                            {showUser && User ?
                             <Flex my='15px' gap='10px' px='15px'  className="hover" onClick={addChat}>
                                  <Image boxSize='50px' objectFit='cover' src={User.avatar} alt='Dan Abramov' borderRadius='50%' />
                                  <Flex flexDirection='column'>
                                      <Heading color='white' my='2px' fontSize='17px' fontWeight='500'>{User.name}</Heading>
                                      <Text color='rgba(255, 255, 255, 0.686);' fontSize='15px'>Hey, There</Text>
                                  </Flex>
                              </Flex>
                                : Array(12).fill('').map((item, index) => (
                                    <Flex my='15px' gap='10px' px='15px' key={index} className="hover">
                                        <Image boxSize='50px' objectFit='cover' src={images.profile_img2} alt='Dan Abramov' borderRadius='50%' />
                                        <Flex flexDirection='column'>
                                            <Heading color='white' my='2px' fontSize='17px' fontWeight='500'>Richard Sanford</Heading>
                                            <Text color='rgba(255, 255, 255, 0.686);' fontSize='15px'>Hey, There</Text>
                                        </Flex>
                                    </Flex>
                                ))
                            }

                        </Flex> */}
                        <Flex flexDirection='column' h='75vh' overflowY='scroll' border='none' outline='none' mt='8px'>
                        {showUser && User ? (
                            <Flex my='15px' gap='10px' px='15px' className="hover" onClick={addChat}>
                                <Image boxSize='50px' objectFit='cover' src={User.avatar} alt={User.name} borderRadius='50%' />
                                <Flex flexDirection='column'>
                                    <Heading color='white' my='2px' fontSize='17px' fontWeight='500'>{User.name}</Heading>
                                    <Text color='rgba(255, 255, 255, 0.686);' fontSize='15px'>Hey, There</Text>
                                </Flex>
                            </Flex>
                        ) : (
                            Array(12).fill('').map((item, index) => (
                                <Flex my='15px' gap='10px' px='15px' key={index} className="hover">
                                    <Image boxSize='50px' objectFit='cover' src={images.profile_img2} alt='Default Profile' borderRadius='50%' />
                                    <Flex flexDirection='column'>
                                        <Heading color='white' my='2px' fontSize='17px' fontWeight='500'>Richard Sanford</Heading>
                                        <Text color='rgba(255, 255, 255, 0.686);' fontSize='15px'>Hey, There</Text>
                                    </Flex>
                                </Flex>
                            ))
                        )}
                    </Flex>
                    </GridItem>

                    <GridItem colSpan='4' bg='gray.100' >
                        <Flex align='center' justify='space-between' px='10px' borderBottom='1px solid gray'  >
                            <Flex align='center' gap='10px' px='5px' py='8px'>
                                <Image boxSize='60px' objectFit='cover' src={images.profile_img2} alt='Dan Abramov' borderRadius='50%' />
                                <Text fontSize='20px' fontWeight='500'>Richard Sanford</Text>
                            </Flex>
                            <Image boxSize='50px' objectFit='cover' src={images.help_icon} alt='Dan Abramov' borderRadius='50%' w='8%' height='8%' />
                        </Flex>

                        <Box position='absolute' bottom='80px'>
                            <Flex className="s-mess" align='center' p='10px' >
                                <Text fontSize='14px' bg='gray;' p='8px' maxWidth='300px' fontWeight='300' color='white' borderRadius='7px 7px 0px 7px'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
                                <Flex flexDirection='column' >
                                    <Image boxSize='40px' objectFit='cover' src={images.profile_img} alt='Dan Abramov' w='10%' h='10%' borderRadius='50%' />
                                    <Text fontSize='12px'>2:30 pm</Text>
                                </Flex>
                            </Flex>

                            <Flex className="s-mess" align='center' p='10px' >
                                <Text fontSize='14px' bg='#3a36ff;' p='8px' maxWidth='300px' fontWeight='300' color='white' borderRadius='7px 7px 0px 7px'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
                                <Flex flexDirection='column' >
                                    <Image boxSize='40px' objectFit='cover' src={images.profile_img} alt='Dan Abramov' w='10%' h='10%' borderRadius='50%' />
                                    <Text fontSize='12px'>2:30 pm</Text>
                                </Flex>
                            </Flex>
                        </Box>

                        <Flex align='center' p='10px 12px' position='absolute' bg='white' bottom='0' left='0' right='0' w='710px' justify='center' mx='auto' boxShadow='md' shadow='md' >
                            <input type="text" className="input" placeholder="Send a message.." />
                            <input type="file" id="image" accept="image/jpeg, image/png, image/svg" className="hidden_gallery" />
                            <label htmlFor="image">
                                <img src={images.gallery_icon} width='60%' height='60%' />
                            </label>
                            <Image boxSize='60px' objectFit='cover' src={images.send_button} alt='Dan Abramov' w='5%' h='5%' />
                        </Flex>
                    </GridItem>

                    <GridItem colSpan='2' bg='#001030;' flexDirection='column' minH='100vh' h='75vh' overflowY='scroll' border='none' outline='none'>
                        <Flex justify='center' align='center' h='50vh' flexDirection='column' borderBottom='2px solid #ffffff50'>
                            <Image boxSize='200px' objectFit='cover' src={images.profile_img2} alt='Dan Abramov' borderRadius='50%' />
                            <Heading color='white' my='8px' fontWeight='500' fontSize='32px'>Richard Sanford</Heading>
                            <Text color='rgba(255, 255, 255, 0.686);'>Hey, There i am using Chat app</Text>
                        </Flex>

                        <Box p='10px' overflowY='scroll'>
                            <Text fontSize='20px' color='white' py='15px'>Media</Text>
                            <SimpleGrid columns={3} spacing={4}>
                                <Image boxSize='200px' objectFit='cover' src={images.pic1} alt='Dan Abramov' w='100%' h='100%' borderRadius='3px' />
                                <Image boxSize='200px' objectFit='cover' src={images.pic2} alt='Dan Abramov' w='100%' h='100%' borderRadius='3px' />
                                <Image boxSize='200px' objectFit='cover' src={images.pic3} alt='Dan Abramov' w='100%' h='100%' borderRadius='3px' />


                            </SimpleGrid>
                        </Box>

                        <Flex justify='center' >
                            <Button colorScheme="blue" w='200px' position='absolute' bottom='20px' borderRadius='50px' onClick={() => logOut()}>Logout</Button>
                        </Flex>
                    </GridItem>
                </Grid>
            </section>
        )
    }

    export default Chat
