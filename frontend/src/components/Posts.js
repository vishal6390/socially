import { Stack, Text, Center } from '@chakra-ui/react'
import React, { useContext, useState, useEffect } from 'react'
import SinglePost from './SinglePost'
import axios from 'axios'

const Posts = ({isProfile}) => {

  const [postsArray, setPostsArray] = useState([])
  const [myPostsArray, setMyPostsArray] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const id = JSON.parse(window.localStorage.getItem('Socially_Current_User'))._id
      const obj = {id: id}
      const tempArray = await axios.post("/api/getAllPosts", obj)
      setPostsArray(tempArray.data.postsArray)
      setMyPostsArray(tempArray.data.myPostsArray)
    }
    fetchPosts()
  }, [])

  return (
        <Stack spacing='20px'>

            {
              isProfile 
              ?
              (myPostsArray.length == 0 ? <Center><Text>You have no posts yet!!!</Text></Center> : myPostsArray.map((item) => {
                return (
                  <SinglePost post={item} key={item._id}/>
                )
              }))

              :(postsArray.length == 0 ? <Center><Text>You and your friends have no posts!!!</Text></Center> : postsArray.map((item) => {
                return (
                  <SinglePost post={item} key={item._id}/>
                )
              }))
            }

        </Stack>
  )
}

export default Posts