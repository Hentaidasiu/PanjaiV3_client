import React, { useState, useEffect, Fragment } from 'react';
import './profile.css'
import ButterToast, { Cinnamon } from "butter-toast";
import { DeleteSweep } from "@material-ui/icons";
import Axios from 'axios';
import { Card, Modal } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { Divider, Grid, Paper, Typography, withStyles, ListItem, ListItemText, Button, TextField } from '@material-ui/core';
import moment from 'moment';
import useForm from '../PostPanjai/useForm'
import { AssignmentTurnedIn } from "@material-ui/icons";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MaskedInput from 'react-text-mask';
import SlideShow from "react-image-show";
var once = false;

const initialFieldValues = {
    name: '',
    adress: '',
    phone: '',
}

const styles = theme => ({
    paper: {
        margin: theme.spacing(3),
        padding: theme.spacing(2)
    },
    smMargin: {
        "&:hover": {
            backgroundColor: "rgba(85, 52, 4, 0.925)"
        },
        margin: theme.spacing(1),
        background: 'rgba(187, 130, 44, 0.925)'
    },
    smMargin1: {
        "&:hover": {
            backgroundColor: "rgba(85, 52, 4, 0.925)"
        },
        margin: '0 auto',
        background: '#a13800',
        display: 'block'
    },
    // actionDiv: {
    //     textAlign: "center"
    // },
    post1: {

        // borderRadius: 5,
        boxShadow: '0 2px 3px 2px rgba(85, 52, 4, 0.925)',
        height: 'auto',
        padding: '30px 30px',
        marginBlock: '15px'

    },
    framepost: {
        boxShadow: "1px 1px 1px 1px rgba(187, 130, 44, 0.925)",
        color: 'rgba(187, 130, 44, 0.925)',
        height: '100%',
        padding: '10px 10px',
        borderRadius: "20px",
        marginBlock: '15px',
        magin: '10px'
    },
    frampicture: {
        padding: '10px 10px'

    },
    picture: {
        height: '150px',
        width: 'auto',
        margin: '10px auto',


    },
    frontpost: {
        fontFamily: 'mali',
        borderRadius: '50px'
    },
    color1: {
        color: '#a13800'
    },
    // judjudjud: {
    //     marginLeft: '75px'

    // },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    },

})

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

function Profile({ classes, ...props }) {

    console.log(props)
    const currentUserID = localStorage.getItem("currentUser_id")
    const currentUser = localStorage.getItem("currentUser")
    const [allInform, setAllInform] = useState("");
    // false = ????????????????????????????????? edit
    const [edit, setedit] = useState(false);
    //???????????????????????????????????????
    const [myPost, setMyPost] = useState([])
    const route = useHistory()
    var Array_image = [];

    async function onetime() {
        if (once == false) {
            //once = true;
            await Axios.get('/profile/userInformation/' + currentUserID, {
            }).then(res => {
                console.log(res.data)
                setValues({
                    name: res.data.name,
                    phone: res.data.phone,
                    address: res.data.address
                })
                setAllInform(res.data)
            }).catch(error => console.log(error))

            await Axios.get('/profile/postInformation/' + currentUser, {
            }).then(res => {
                //console.log(res.data)
                setMyPost(res.data)
            }).catch(error => console.log(error))
        }
    }

    useEffect(() => {
        onetime();
        setErrors({})

    }, [])


    const validate = () => {
        let temp = { ...errors }
        temp.name = values.name ? "" : "??????????????????????????????????????????."
        temp.address = values.address ? "" : "??????????????????????????????????????????."
        temp.phone = values.phone ? "" : "??????????????????????????????????????????."
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x === "")
    }

    var {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFieldValues, currentUserID)

    const CancelUpdate = () => {
        setedit(false);
    }

    function handleEditProfile() {
        setedit(true);
    }

    const onDelete = id => {
        const onSuccess = () => {
            ButterToast.raise({
                content: <Cinnamon.Crisp title="????????????????????????"
                    content="?????????????????????????????????????????????????????????"
                    scheme={Cinnamon.Crisp.SCHEME_PURPLE}
                    icon={<DeleteSweep />}
                />
            })
            window.location.reload()
        }
        if (window.confirm('????????????????????????????????????????????????????????????????????????????')) {
            Axios.delete('/Too-Panjai/' + id, {
            }).then(async res => {
                onSuccess()
            }).catch(error => console.log(error))
        }
    }

    // ???????????????????????????????????????
    const handleSubmit = async e => {
        e.preventDefault()
        const onSuccess = () => {
            ButterToast.raise({
                content: <Cinnamon.Crisp title="?????????????????????"
                    content="???????????????????????????????????????????????????????????????????????????"
                    scheme={Cinnamon.Crisp.SCHEME_PURPLE}
                    icon={<AssignmentTurnedIn />}
                />
            })
        }
        if (validate()) {
            await Axios.put('/profile/' + currentUserID, values, {
            }).then(res => {
                console.log(res.data)
                localStorage.setItem("currentUser_name", values.name)
                onSuccess()
            }).catch(error => console.log(error))
            window.location.href = "/profile/" + currentUserID
        }
    }

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <div className="back">
            <div className="container">
                <div className="box">
                    <section>
                        {edit ?
                            //??????????????????????????????????????????
                            (
                                <div>
                                    <div className="box-text-profile">
                                        <h1> ??????????????????????????????????????????</h1>
                                        <div className="textinforuser">
                                            <span> <i className="fa fa-user"> </i> ????????????-?????????????????????</span>
                                            <TextField
                                                name="name"


                                                fullWidth
                                                size="small"
                                                value={values.name}
                                                onChange={handleInputChange}
                                                {...(errors.name && { error: true, helperText: errors.name })}
                                            />
                                        </div>
                                        <div className="textinforuser">
                                            <span> <i className="fas fa-phone"> </i> ???????????????????????????????????????</span>
                                            {/* <TextField
                                                id="standard-basic"
                                                name="phone"
                                                type='number'
                                                variant="filled"

                                                fullWidth
                                                size="small"
                                                value={values.phone}
                                                onChange={handleInputChange}
                                                {...(errors.phone && { error: true, helperText: errors.phone })}
                                            /> */}

                                            <FormControl fullWidth>
                                                {/* <InputLabel htmlFor="formatted-text-mask-input">???????????????????????????????????????</InputLabel> */}
                                                <Input
                                                    value={values.phone}
                                                    onChange={handleChange}
                                                    name="phone"
                                                    id="formatted-text-mask-input"
                                                    inputComponent={TextMaskCustom}
                                                    {...(errors.phone && { error: true, helperText: errors.phone })}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="textinforuser">
                                            <span> <i className="fas fa-address-card"> </i> ?????????????????????</span>
                                            <TextField
                                                name="address"


                                                fullWidth
                                                size="small"
                                                value={values.address}
                                                onChange={handleInputChange}
                                                {...(errors.address && { error: true, helperText: errors.address })}
                                            />
                                        </div>
                                        <div className="confirm-and-cancelEditProfile">
                                            <div className="confirmEditProfile">
                                                <button className="button3" onClick={handleSubmit}>??????????????????</button>
                                            </div>
                                            <div className="cancelEditProfile">
                                                <button className="button4" onClick={CancelUpdate}>??????????????????</button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ) :

                            (
                                //??????????????????????????????

                                <div>
                                    <div className="box-text-profile">
                                        <h1> ??????????????????????????????????????????</h1>

                                        <div className="coin">

                                            <p><i class="fas fa-coins"></i> ???????????????????????????????????? : {allInform.coin}
                                                <span className="ka">
                                                    <Button
                                                        className="addcoin"
                                                        href="/pay-coin"
                                                    >

                                                        ??????????????????????????????
                                                 <i class="fa fa-piggy-bank"></i>
                                                    </Button>
                                                </span>
                                            </p>

                                        </div>
                                        <div className="textinforuser">
                                            <span> <i className="fa fa-user"> </i> ????????????-????????????????????? </span>
                                            <p>{allInform.name}</p>
                                        </div>
                                        <div className="textinforuser">
                                            <span> <i className="fas fa-phone"> </i> ???????????????????????????????????????</span>
                                            <p>{allInform.phone}</p>
                                        </div>
                                        <div className="textinforuser">
                                            <span> <i className="fas fa-address-card"> </i> ?????????????????????</span>
                                            <p>{allInform.address}</p>
                                        </div>
                                        <div className="textinforuser">
                                            <span> <i className="fas fa-envelope"> </i> ???????????????</span>
                                            <p>{allInform.email}</p>
                                        </div>
                                        <div className="grid-container1">
                                            <div className="EditProfile">
                                                <button className="button3" onClick={handleEditProfile}>???????????????</button>
                                            </div>

                                            {/* <div className='Like'>
                                             <Link to="/myfav" className="button1" >?????????????????????????????????</Link>
                                        </div> */}
                                            <div className='Like'>
                                                <button className="button1" type="button" onClick={() => { route.push('/myfav') }}  >
                                                    ????????????????????????????????????
                                                </button>
                                            </div>



                                        </div></div></div>)
                        }
                    </section>


                </div>
                <br />
                <div className="Post">
                    <span>Post ?????????????????? </span>
                </div>
                <div>
                    <Grid container style={{ padding: '0 auto' }} spacing={4} >
                        {/* {console.log(myPost)} */}
                        {
                            myPost.map((record, index) => {

                                return (

                                    <Grid item xs={12} sm={4} >
                                        {/* {index} */}
                                        <Paper className={classes.framepost}>
                                            <Fragment key={index}>
                                                <ListItem>
                                                    <ListItemText>

                                                        <Grid container>
                                                            <Grid item xs={8}>
                                                                <Typography variant='h5' className={`${classes.color1} ${classes.frontpost}`}>
                                                                    {record.title}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>

                                                        <div className={classes.frontpost}>
                                                            ?????????????????? : {record.message}
                                                        </div>
                                                        <Grid container justify="center">
                                                            {
                                                                ((Array_image = []),
                                                                    record.image.map((image, index) => {
                                                                        Array_image.push(
                                                                            "http://localhost:3001/image/" + image
                                                                        );
                                                                    }),
                                                                    (
                                                                        <Grid container justify="center">
                                                                            <SlideShow className="imageslide"
                                                                                images={record.image}
                                                                                width="400px"
                                                                                imagesWidth="300px"
                                                                                imagesHeight="180px"
                                                                                imagesHeightMobile="56vw"
                                                                                thumbnailsWidth="350px"
                                                                                thumbnailsHeight="12vw"
                                                                                className={classes.picture}
                                                                                indicators fixedImagesHeight
                                                                            />
                                                                        </Grid>
                                                                    ))
                                                            }
                                                        </Grid>
                                                        <div className={`${classes.color1} ${classes.frontpost}`}>
                                                            ??????????????????????????? : {moment(record.Timestamp).calendar()}
                                                        </div>
                                                        <div className={`${classes.color1} ${classes.frontpost}`}>
                                                            ????????? : {record.contect}
                                                        </div>
                                                        <div className={`${classes.color1} ${classes.frontpost}`}>
                                                            ????????????????????? : {record.location}
                                                        </div>
                                                        <div className={`${classes.color1} ${classes.frontpost}`}>
                                                            ???????????????????????? : {record.creator}
                                                        </div>
                                                        {/* ?????????????????????????????? */}
                                                    </ListItemText>
                                                </ListItem>
                                            </Fragment>
                                            <Button variant="contained" color="secondary" size="small"
                                                className={`${classes.smMargin1} ${classes.frontpost}`}
                                                onClick={() => onDelete(record._id)}>
                                                ??????
                                        </Button>
                                        </Paper>
                                    </Grid>
                                    // <div>
                                    //     <h1>{record.title}</h1><br/>??????????????????: {record.message}<br/>????????????????????????: {record.creator}<br/><br/>
                                    // </div>
                                )
                            })
                        }
                    </Grid>
                </div>
            </div>
        </div>

    )
}
export default (withStyles(styles)(Profile));