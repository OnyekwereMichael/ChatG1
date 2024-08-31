import { Text, Stack, Button, Checkbox, Link, Flex, Image} from '@chakra-ui/react'
import './login.css'
import image from '../../assets/assets'
import { useState } from 'react'
import { Form, Field, Formik } from 'formik'
import { validation } from '../../component/validation'
import { signUp , Login} from '../../config/Firebase'
// import { transform } from 'framer-motion'

const initialValues = {
  name: '',
  email: '',
  password: '',
  cpassword: '',
}

function login() {

  const [currstate, Setcurrstate] = useState('Sign up')

  const [userName, SetuserName] = useState('');
  const [userEmail, SetuserEmail] = useState('')
  const [userPassword, Setuserpassword] = useState('')

  const onSubmithandler = (event) => {
   event.preventDefault();

   if(currstate==='Sign up') {
     signUp(userName, userEmail, userPassword);
   }
   else{
     Login(userEmail, userPassword)
   }
  }

  return (
    <section className='loginBackground'>
      <Formik initialValues={initialValues} validationSchema={validation} >
        {({ errors }) => (
          <Flex align='center' justify='space-around' minH={{base: '80vh', lg: '100vh',}} wrap='wrap' className='container'>
            <Image src={image.logo_big} alt="image" w={{base: '50%', lg:'20%', md:'20%'}}/>
            <Form onSubmit={onSubmithandler} pos="relative">
              <Text pos={"absolute"} top={0} left= {{lg:'33%', base: '32.5%'}} borderRadius="0 0 20px 20px" bg="rgb(255, 255, 255, 0.4)" p="0.5rem 1.5rem"  alignItems="center"  fontWeight="500" fontSize="25px" className='text'>{currstate}</Text>
              <Stack spacing={6} mt="47px">
                {currstate === 'Sign up' ? <Field onChange={(e) => SetuserName(e.target.value)} value={userName} type="text" name='name' className="inputField" placeholder='Username' /> : null}
                {errors.name && <small style={{ color: 'darkblue' }}>{errors.name}</small>}  
                <Field onChange={(e) => SetuserEmail(e.target.value)} value={userEmail}  type="email" name='email' className='inputField' placeholder='Email address' />
                {errors.email ? <small style={{ color: 'darkblue' }}>{errors.email}</small> : ''}
                <Field onChange={(e) => Setuserpassword(e.target.value)} value={userPassword}  type="password" name='password' className='inputField' placeholder='Password' />
                {errors.password && <small style={{ color: 'darkblue' }}>{errors.password}</small>}
              </Stack>

              <Button colorScheme="#077eff;" variant='solid' cursor="pointer" fontSize='16px' my={4} w={{base: '78vw', lg:'23vw'}} p={6 } fontWeight='400' type='submit' className='click'>
                {currstate === 'Sign up' ? 'Create account' : 'Login now'}
              </Button>

              <Flex my='8px'>
                <Checkbox colorScheme='#077eff;'> </Checkbox>
                <Text color='rgb(255, 255, 255, 0.7)' fontSize='14px'>Agree to the terms of use & privacy policy.</Text>
              </Flex>

              {currstate === 'Sign up' ? <Text textAlign='center' mt='10px' mx='20px' fontWeight='400' fontSize='14px'>Already have an account?  <Link className='login' color='#077eff;' onClick={() => Setcurrstate('Log in')} fontSize='14px'>Login here</Link></Text> :
                <Text mt='10px'fontSize='14px' textAlign='center' >Create an account?  <Link className='login' color='#077eff;' onClick={() => Setcurrstate('Sign up')} fontSize='14px'>Click here</Link></Text>}

            </Form>
          </Flex>
        )}

      </Formik>

    </section>
  )
}

export default login
