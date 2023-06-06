import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import { useCookies } from 'react-cookie'
import moment from 'moment';
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';

import { likePost, deletePost } from '../../../actions/posts';
import useStyles from './styles';

const Post = ({ post, setCurrentId }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [user, setUser] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    let navigate = useNavigate()

    const userId = cookies.UserId

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: { userId }
            })
            setUser(response.data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const Likes = () => {
        if (post?.likes?.length > 0) {
            return post?.likes.find((like) => like === user)
                ? (
                    <><ThumbUpAltIcon fontSize="small" />&nbsp;{post?.likes.length > 2 ? `You and ${post?.likes.length - 1} others` : `${post?.likes.length} like${post?.likes.length > 1 ? 's' : ''}`}</>
                ) : (
                    <><ThumbUpAltOutlined fontSize="small" />&nbsp;{post?.likes.length} {post?.likes.length === 1 ? 'Like' : 'Likes'}</>
                );
        }

        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    };

    const openPost = (e) => {
        // dispatch(getPost(post._id, history));

        navigate(`/post/${post._id}`);
    };

    return (
        <Card className={classes.card} raised elevation={6}>
            <CardMedia onClick={openPost} className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
            <div className={classes.overlay}>
                <Typography variant="h6">{post.creator}</Typography>
                <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
            </div>
            {user?.posts?.find((like) => like === post._id) && (<div className={classes.overlay2}>
                <Button style={{ color: 'white' }} size="small" onClick={() => setCurrentId(post._id)}><MoreHorizIcon fontSize="medium" /></Button>
            </div>)}
            <div className={classes.details}>
                <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
            </div>
            <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" onClick={() => dispatch(likePost(post._id, { userId: userId }))}>
                    <Likes />
                </Button>
                {user?.posts?.find((like) => like === post._id) && (
                    <Button size="small" color="secondary" onClick={() => { dispatch(deletePost(post._id)); window.location.reload() }}>
                        <DeleteIcon fontSize="small" /> Delete
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default Post;