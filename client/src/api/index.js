import axios from 'axios';

const url = 'http://localhost:8000/posts';

export const fetchPosts = (page) => axios.get(`${url}?page=${page}`);
export const fetchPost = (id) => axios.get(`${url}/${id}`);
export const createPost = (newPost) => axios.post(url, newPost);
export const likePost = (id, userId) => axios.patch(`${url}/${id}/likePost`, userId);
export const fetchPostsBySearch = (searchQuery) => axios.get(`${url}/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const updatePost = (id, updatedPost) => axios.patch(`${url}/${id}`, updatedPost);
export const deletePost = (id) => axios.delete(`${url}/${id}`);