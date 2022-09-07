import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://localhost:3333' || 'podcastr-alpha-lime.vercel.app'
})