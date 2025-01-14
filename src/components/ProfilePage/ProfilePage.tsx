import React, {useEffect} from "react";
import {Avatar, Box, Button, CircularProgress, Container, Grid} from "@mui/joy";
import Review from "../Review/Review";
import s from './ProfilePage.module.scss'
import Tags from "../Tags/Tags";
import {Backdrop, Paper} from "@mui/material";
import CreateReviewModal from "../Review/CreateReview/CreateReviewModal";
import {useAppDispatch, useAppSelector} from "../../common/utils/hooks";
import {getAuthorTC, getReviewsTC} from "../../store/reducers/reviewsReducer";
import {useNavigate, useParams} from "react-router-dom";
import {getUserTC} from "../../store/reducers/userReducer";
import SearchReview from "../Review/SearchReview";
import {useMediaQuery} from "react-responsive";
import {ReviewsTable} from "./ReviewsTable";
import {useTranslation} from "react-i18next";
import {URL} from '../../common/imageDefault'
import SearchPage from "../SearchPage/SearchPage";
//const URL = 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' //'https://static.okko.tv/images/v2/16449765?scale=1&quality=80'


function ProfilePage() {
    const dispatch = useAppDispatch()
    const {username} = useParams()
    const { t } = useTranslation();


    const authUser = useAppSelector(state => state.auth.user)

    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    const reviews = useAppSelector(state => state.reviews.reviews)
    const user = useAppSelector(state => state.user.user)
    const iSmallScreen = useMediaQuery({ query: '(max-width: 712px)' })
    // console.log('REVIEWS',reviews )

    // console.log('authUser', authUser)
    const navigate = useNavigate();
    const search = useAppSelector(state => state.reviews.search)
    useEffect(() => {
        if (search.length) {
            navigate('/home')
        }
    }, [search])

    useEffect(() => {
        if (username) {
            dispatch(getUserTC(username))
            // dispatch(getAuthorTC(username))

        }
    }, [username])

    if (!user || !reviews) {
        return  <Backdrop open={true} sx={{color: '#fff', zIndex: 10}}>
            <CircularProgress />
        </Backdrop>
    }


    console.log('user.reviews.length', user && user.reviews ? user.reviews.length : '')

    // if (search.length) {
    //     return <SearchPage notMain/>
    // }
    return (

                <Container maxWidth="lg"
                           sx={{marginTop: '80px', padding: '0', width: '100%'}}

                >
                    <Grid className={s.grid} container spacing={3}
                        // sx={{padding: '0% 3%'}}
                    >
                        <Grid className={s.gridItem}>

                            <Paper sx={{borderRadius: "2px", backgroundColor: ' rgba(230, 230, 250, 0) '}}
                                   elevation={0}>
                                <Box className={s.profileInfo}>

                                    <Box style={{display: 'inline-flex', alignItems: 'center'}}>
                                        <Avatar sx={{
                                            "--Avatar-size": !iSmallScreen ? "160px" : '90px',
                                            border: '1px solid grey'
                                        }} src={user ? user.avatar : ''}/>
                                    </Box>
                                    <Box>
                                        <Box style={{marginBottom: '20px'}}>
                                            <span style={{
                                                fontSize: !iSmallScreen ? '24px' : '18px',
                                                fontWeight: 'bold'
                                            }}>{user ? username : ' '}</span>
                                        </Box>
                                        <Box style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            height: '40px',
                                            fontSize: !iSmallScreen ? '34px' : '24px',
                                            paddingLeft: '16px'
                                        }}>
                                            ❤️
                                            <span style={{
                                                fontSize: !iSmallScreen ? '24px' : '14px',
                                                fontWeight: 'bold',
                                                color: 'red'
                                            }}>{user && user.likes ? `${user.likes.length}` : ''}</span>
                                        </Box>
                                        <Box style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            height: '40px',
                                            fontSize: !iSmallScreen ? '34px' : '24px',
                                            paddingLeft: '16px'
                                        }}>
                                            📃
                                            <span style={{
                                                fontSize: !iSmallScreen ? '24px' : '14px',
                                                fontWeight: 'bold',
                                                color: 'green'
                                            }}>{user.reviews ? `${user.reviews.length}` : ''}</span>
                                        </Box>
                                        {
                                            authUser && authUser.username === username
                                            // || authUser && authUser.username !== username  && authUser.roles && authUser.roles.includes('ADMIN')
                                            &&
                                            <Box style={{
                                                marginLeft: '8px',
                                                marginTop: "8px",
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: iSmallScreen ? '28px' : '40px',
                                                fontSize: iSmallScreen ? '18px' : '34px'
                                            }}>

                                                <CreateReviewModal variant={'solid'} userId={user.userId}/>
                                            </Box>
                                        }{
                                        authUser && authUser.username !== username && authUser.roles && authUser.roles.includes('ADMIN')
                                        &&
                                        <Box style={{
                                            marginLeft: '8px',
                                            marginTop: "8px",
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: iSmallScreen ? '28px' : '40px',
                                            fontSize: iSmallScreen ? '18px' : '34px'
                                        }}>

                                            <CreateReviewModal variant={'solid'} userId={user.userId}/>
                                        </Box>


                                    }
                                    </Box>
                                </Box>
                            </Paper>
                            <div style={{width: '100%'}}>
                                {/*{*/}
                                {/*    authUser && authUser.username === username && user.reviews && user.reviews.length === 0*/}
                                {/*    && <div style={{fontSize: '30px', color: 'grey'}}>*/}
                                {/*        {t('createReview.first')}*/}
                                {/*        <CreateReviewModal variant={'soft'} userId={user.userId}/>*/}
                                {/*    </div>*/}
                                {/*}*/}
                                {
                                    (!isLoggedIn ||
                                        authUser && authUser.username && authUser.username !== username && authUser.roles && !authUser.roles.includes('ADMIN'))
                                    && reviews.length !== 0 && reviews.map(r => {
                                        return <SearchReview
                                            key={r._id}
                                            reviewId={r._id}
                                            imageURL={r.imageURL ? r.imageURL : URL}
                                            reviewTitle={r.reviewTitle}
                                            workTitle={r.workTitle}
                                            reviewText={r.reviewText.slice(0, 20)}
                                            tags={r.tags}
                                            category={r.category}
                                            createdAt={r.createdAt.slice(0, 11)}
                                            likes={r.likes}
                                            rating={r.rating}
                                            userName={r.userName}
                                            authorGrade={r.authorGrade}
                                            comments={r.comments}
                                            avatar={r.avatar ? r.avatar : null}
                                        />
                                    })
                                }
                                {
                                    authUser && authUser.username && authUser.username === username && user.reviews && user.reviews.length > 0
                                    && <ReviewsTable reviews={reviews.length !== 0 ? reviews : null}
                                                     username={username ? username : ' '}/>
                                }
                                {
                                    authUser && authUser.username && authUser.username !== username && authUser.roles && authUser.roles.includes('ADMIN') && user.reviews && user.reviews.length > 0
                                    && <ReviewsTable reviews={reviews.length !== 0 ? reviews : null}
                                                     username={username ? username : ' '}/>
                                }
                                {
                                    user && user.reviews && user.reviews.length === 0
                                    && <div style={{color: 'grey', fontSize: '40px', fontWeight: 'bold'}}>
                                        {t('review.noReview')}
                                    </div>
                                }
                            </div>

                        </Grid>
                    </Grid>
                </Container>

    )
}

export default ProfilePage;