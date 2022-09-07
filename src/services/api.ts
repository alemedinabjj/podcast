import axios from 'axios'


const baseURL = 'https://my-json-server.typicode.com/pereirafi/podcastrnext/'

export const api = axios.create({
  baseURL
})