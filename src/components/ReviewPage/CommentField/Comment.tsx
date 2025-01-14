import {Avatar, Box, Button, Card, CardOverflow, Divider, IconButton, Stack, Textarea, Typography} from "@mui/joy";
import s from "../ReviewPage.module.scss";
import React, {useState} from "react";
import {CommentType, updateCommentTC} from "../../../store/reducers/commentsReducer";
import DeleteModal from "../../commonComponents/DeleteModal";
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../common/utils/hooks";
import {PROFILE_PAGE} from "../../../Routing";
import {useTranslation} from "react-i18next";


type CommentPropsType ={
    comment: CommentType
}
function Comment({comment,...props}: CommentPropsType) {
    const theme = useAppSelector(state => state.app.mode)

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation();

    const {review} = useParams()

    const [update, setUpdate] = useState(false)
    const [value, setValue] = useState<string>(comment.text)

    const handleSubmit = () => {
        if (!value.trim().length) {
            return console.log('Comment text is required')
        } else if (!review) {
            return console.log('review not found')
        } else {
            dispatch(updateCommentTC(review, comment._id, {text: value}))
            setUpdate(false)
        }
    }

    const handleCancel = () => {
        setUpdate(false)
        setValue(comment.text)
    }


    return (
        <Box className={s.commentsStack}>
            <Card variant={theme ? 'soft' : "outlined"} sx={{margin: '0px', backgroundColor: theme ? '#828282' : 'white', color: theme ? 'white' : '#2d2a2a'}}>
                <Box className={s.comment}>
                    <Stack width={'100%'} direction="row" sx={{justifyContent: 'space-between'}}>
                        <Box style={{display: 'inline-flex', alignItems: 'center'}}>
                            <Avatar src={comment.avatar ? comment.avatar : ''} onClick={() => {navigate(`${PROFILE_PAGE}/${comment.user}`)}} sx={{"--Avatar-size": "20px"}}/>
                            <a href={`${PROFILE_PAGE}/${comment.username}`} style={{fontSize: '14px', fontWeight: 'bold', color: theme ? 'white' : '#2d2a2a'}} className={s.reviewTitle}>{comment.username}</a>
                        </Box>
                        <Box style={{display: 'inline-flex', alignItems: 'center'}}>

                            <IconButton sx={{marginRight: '4px'}} onClick={() => {
                                setUpdate(true)
                            }} size="sm" color={theme ? "neutral" : "warning"}>
                                ✏️
                            </IconButton>
                            <DeleteModal reviewId={comment.review} commentId={comment._id} title={""} type={'comment'}/>
                        </Box>
                    </Stack>
                    {
                        update
                            ? <Textarea
                                placeholder="Write comment…"
                                minRows={2}
                                value={value}
                                onKeyPress={(e) => {if (e.key === "Enter" && !e.shiftKey) { handleSubmit() }} }
                                onChange={(e) => {setValue(e.currentTarget.value)}}
                                endDecorator={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 'var(--Textarea-paddingBlock)',
                                            pt: 'var(--Textarea-paddingBlock)',
                                            // borderTop: '1px solid',
                                            // borderColor: 'divider',
                                            flex: 'auto',
                                        }}
                                    >
                                        <Button onClick={handleSubmit} variant={'soft'} sx={{ml: 'start'}} color={theme ? 'neutral' : 'primary'}>{t('review.update')}</Button>
                                        <Button onClick={handleCancel} variant={'soft'} color={'info'} sx={{ml: 'start'}}>{t('review.cancel')}</Button>
                                    </Box>
                                }
                                sx={{
                                    minWidth: '90%',
                                    maxWidth: '90%',
                                    margin: '6px 0px 6px 0px',
                                    backgroundColor: theme ? '#2f2b2b' : 'white',
                                    color: theme ? 'white' : '#2f2b2b'
                                    // fontWeight,
                                    // fontStyle: italic ? 'italic' : 'initial',
                                }}
                            />
                        : <Typography mb={1} lineHeight="sm" textAlign={'start'} sx={{color: theme ? 'white' : '#2d2a2a'}}>
                            {comment.text}
                        </Typography>
                    }

                </Box>

                <Divider/>
                <CardOverflow
                    variant="soft"
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        py: 1.5,
                        px: 'var(--Card-padding)',
                        bgcolor: theme ? '#2f2b2b' : 'background.level1',
                    }}
                >
                    <Typography level="body3" sx={{fontWeight: 'md', color: theme ? '#e5d9d9' : 'text.secondary'}}>
                        {comment.createdAt.slice(0, 10)}
                    </Typography>
                </CardOverflow>
            </Card>
        </Box>
    )
}

export default Comment;