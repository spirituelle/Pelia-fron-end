import React,{Component} from 'react'

import autoBind from 'react-autobind';

import { FaMailBulk, FaPhone, FaUserMd, FaCity } from 'react-icons/fa';
import { MdPersonAdd } from 'react-icons/md';

import { Col,Row, Alert, Collapse } from 'react-bootstrap';
import theme from './../theme/GlobalTheme'

import PhoneField from './../components/Inputs/PhoneNumber/index';
import InpusField from './../components/Inputs/InputIcone/index'
import Button  from './../components/Button/index';
import Heart from './../assets/img/heart_hover.png'
import medecin from './../assets/img/many-medecin.jpg'
import Axios  from 'axios';
import {TextField, ThemeProvider} from '@material-ui/core';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { Link } from 'react-router-dom';

import Success from './../components/success'

import Cookies from 'js-cookie'
import { useState } from 'react';


let lang = Cookies.get('lang')
lang = (lang === undefined)? "fr" : lang

let style = (lang === "ar")? {  
  all:{
    direction: 'rtl'
    
  },
  text:{
    textAlign:'right'
  },
  inputLabel:{style:{right: 0, left:"auto"}}
}: {

}


export default function Inscription() {

    const [envoyer, setEnvoye] = useState(false)
  
    return (
        <div className="page">
        <div id="inscription" className="inscription " style={style.all}>

            <Col lg="5" md="12" xs="12" style={{backgroundColor:"rgba(5,117,230, 0.8)"}}>
                <div className="form-inscription" style={{background: `url(${medecin}) left`, backgroundSize:"cover"}}>
                      <div style={{backgroundColor:"rgba(255,255,255, 0.9)", padding: "82px 55px 33px 55px"}}>
                        <h3 className="form-title">{content.form.title[lang]}</h3>
                        <p className="form-description">{content.form.subtitle[lang]}</p>
                        <Link to="/Authentification" >
                            vous avez dèjà un compte?
                        </Link>
                        <ElementForm setEnvoye={() => setEnvoye(true)} />  
                      </div>
                </div>
            </Col>
            <Col lg="7">
            <section id="inscription-body" style={{background:`url(${Heart})`, backgroundSize:"cover"}}>
		<div className="container">
		<div className="overlay"></div>
			<Row>
                <div className="inscription-info">
                    <h1 data-wow-duration="700ms" data-wow-delay="500ms" className="wow bounceInDown animated">{content.title[lang]}</h1>
                    <p>{content.body[lang]}</p>
                    <Link data-wow-duration="700ms" data-wow-delay="500ms" to="/"
                        className="btn section-btn smoothScroll wow slideInUp animated"> {content.button[lang]} </Link>
                </div>
			</Row>
		</div>
	</section>
    {envoyer && 
        <Success fermer={() => setEnvoye(false) } />
        } 
            </Col>

               
        </div>
        </div>
    )
}


class ElementForm extends Component  {

    constructor(props){
        super(props);
        autoBind(this);
        this.state={
            nom: "",
            prenom:"",
            numero_telephone:"",
            email: "",
            password:"",
            confirm: "",
            ville: "",
            fieldValidationErrors:{
                nomError:false,
                prenomError:false,
                numeroError:false,
                emailError:false,
                
            },
            sending:false,
            success:false
        }
       
    }
    
    handleSubmit (e) {
        e.preventDefault();
        this.setState({sending: true});

            if(!(this.state.nomError) && 
            (!this.state.prenomError) && 
            (!this.state.numeroError) && 
            (!this.state.emailError) && 
            (this.state.nom !== "") && 
            (this.state.prenom !== "") && 
            (this.state.numero_telephone !== "") && 
            (this.state.email !== "")&& 
            (this.state.sexe !== "")
             ){
                let data = this.traitementDonnee();
                console.log(data)
                Axios.post(`http://localhost:8000/register` , data, {headers: {'Content-Type': 'application/json'}})
                .then(res => {
                    this.setState({sending: false, success:true});
                    setTimeout(() => {
                        this.props.setEnvoye()
                    }, 4000);
                })
                .catch(error =>{ this.setState({sending: false, success:false, donneIncorecte:true})})
            }else{
                this.setState({sending: false, donneIncorecte:true});    
            }
    }

    validateField(element){
        let {fieldValidationErrors, nom, prenom, email, numero_telephone, password, confirm, ville} = this.state
        switch (element.target.name) {
            case "nom":
             fieldValidationErrors.nomError= nom.length <= 2
             this.setState({fieldValidationErrors: fieldValidationErrors})
             if(fieldValidationErrors.nomValid){
                 return true
             }
                break;
            case "prenom":
                fieldValidationErrors.prenomError=   prenom.length <= 2
                this.setState({fieldValidationErrors: fieldValidationErrors})
                if(fieldValidationErrors.prenomError){
                    return true
                }
                    break;
             case "email":
                 let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                 fieldValidationErrors.emailError = ! re.test(String(email).toLowerCase());
                 this.setState({fieldValidationErrors: fieldValidationErrors})
                 if(fieldValidationErrors.emailError){
                     return true
                 }
             break;
            case "numero_telephone":
                fieldValidationErrors.numeroError= numero_telephone.length !== 16
                this.setState({fieldValidationErrors: fieldValidationErrors})
                if(fieldValidationErrors.numeroError){
                    return true
                }
            break;
            case "password":
                fieldValidationErrors.password= password.length <= 8
                this.setState({fieldValidationErrors: fieldValidationErrors})
                if(fieldValidationErrors.password){
                    return true
                }
            break;
            case "confirm":
                fieldValidationErrors.confirm = confirm !== password
                this.setState({fieldValidationErrors: fieldValidationErrors})
                if(fieldValidationErrors.confirm){
                    return true
                }
            break;
            case "ville":
                let ville = []
                fieldValidationErrors.ville = ville !== password
                this.setState({fieldValidationErrors: fieldValidationErrors})
                if(fieldValidationErrors.confirm){
                    return true
                }
            break;
                 default :
 
                 break
        }
         this.setState({fieldValidationErrors: fieldValidationErrors})  
         return false
    }
    traitementDonnee(){
        let formData={};
        
        formData.nom=this.state.nom
        formData.phone=this.state.numero_telephone
        formData.email=this.state.email
        formData.prenom=this.state.prenom
        formData.ville=this.state.ville
        formData.password=this.state.password
        return formData;
    }
 

    handleChange({target : {value, name}}) {
        
        if(name === "numero_telephone"){
            value = value
            // Remove all non-digits, turn initial 33 into nothing
            .replace(/[^\d+]/g, '')
            .replace(/^0/, '+212')
            // Stick to first 10, ignore later digits
            .slice(0, 13)
            // Add a space after any 2-digit group followed by more digits
            .replace(/(\d{3})(?=\d)/g, '$1 ')
        }
        this.setState({[name]: value}) ;
    }

  
    render(){
        let {confirm, password, fieldValidationErrors, nom, prenom, numero_telephone, email, donneIncorecte, ville, success, sending} = this.state
    return (
        <ThemeProvider theme={theme}>     
            <form onSubmit={this.handleSubmit} autoComplete="off">
            
                <Col >
                    <Row className="inscription-input" style={style.text}>
                        <InpusField
                        autoFocus={true}
                        error={fieldValidationErrors.nomError}
                        placeholder={content.form.input_nom.placeholder[lang]}
                        label={content.form.input_nom.label[lang]} 
                        Icone={FaUserMd}
                        required={true}
                        name="nom"
                        InputLabelProps={style.inputLabel}
                        onBlur={this.validateField} 
                        value={nom}
                        onChange={this.handleChange} />
                    </Row>
                    <Row className="inscription-input">
                    <Collapse in={fieldValidationErrors.nomError}>
                        <div id="example-collapse-text">
                            <Alert  variant="danger" style={style.text}>
                            {content.error.nom[lang]}
                            </Alert>
                        </div>
                    </Collapse>
                    </Row>
                    <Row className="inscription-input" style={style.text}>
                        <InpusField
                        placeholder={content.form.input_prenom.placeholder[lang]}
                        required={true}
                        error={fieldValidationErrors.prenomError}
                        label={content.form.input_prenom.label[lang]} 
                        Icone={FaUserMd}
                        InputLabelProps={style.inputLabel}
                        onBlur={this.validateField} 
                        name="prenom"
                        value={prenom}
                        onChange={this.handleChange} />
                    </Row>
                    <Row className="inscription-input" style={style.text}>
                    <Collapse in={fieldValidationErrors.prenomError}>
                        <div id="example-collapse-text">
                            <Alert  variant="danger">
                            {content.error.prenom[lang]}
                            </Alert>
                        </div>
                        </Collapse>
                    </Row>
                    <Row className="inscription-input" style={style.text}>

                        <PhoneField label={content.form.input_numero.label[lang]} Icone={FaPhone}
                        name="numero_telephone"
                        required={true}
                        error={fieldValidationErrors.numeroError}
                        InputLabelProps={style.inputLabel}
                        onBlur={this.validateField}
                        value={numero_telephone}
                        placeholder="+212 600 000 000"
                        onChange={this.handleChange} 
                        />
                    </Row>
                    {/* ERROR NUMERO TELEPHONE */}
                    <Row className="inscription-input" style={style.text}>
                    <Collapse in={fieldValidationErrors.numeroError}>
                        <div id="example-collapse-text">
                            <Alert  variant="danger">
                            {content.error.phone[lang]}
                            </Alert>
                        </div>
                        </Collapse>
                    </Row>
                    <Row className="inscription-input" style={style.text}>
                        <InpusField label={content.form.input_email.label[lang]} Icone={FaMailBulk}
                        placeholder={content.form.input_email.placeholder[lang]}
                        name="email"
                        error={fieldValidationErrors.emailError}
                        required={true}
                        InputLabelProps={style.inputLabel}
                        onBlur={this.validateField} 
                        value={email}
                        onChange={this.handleChange} />                        
                    </Row>
                    
                    <Row className="inscription-input" style={style.text}>
                    <Collapse in={fieldValidationErrors.emailError}>
                        <div id="example-collapse-text">
                            <Alert  variant="danger">
                            {content.error.email[lang]}
                            </Alert>
                        </div>
                        </Collapse>
                    </Row>
                  
                     <Row className="inscription-input" style={style.text}>
                        <TextField
                            margin="normal"
                            required
                            value={password}
                            onChange={this.handleChange}
                            fullWidth
                            name="password"
                            label={content.form.input_password.label[lang]}
                            type="password"
                            onBlur={this.validateField}
                            id="password"
                            placeholder={content.form.input_confirm.placeholder[lang]}
                            autoComplete="current-password"
                        />                    
                    </Row>
                    <Row className="inscription-input" style={style.text}>
                        <Collapse in={fieldValidationErrors.password}>
                            <div id="example-collapse-text">
                                <Alert  variant="danger">
                                {content.error.password[lang]}
                                </Alert>
                            </div>
                        </Collapse>
                    </Row>
                    <Row className="inscription-input" style={style.text}>
                        <TextField
                            margin="normal"
                            required
                            value={confirm}
                            onChange={this.handleChange}
                            fullWidth
                            name="confirm"
                            label={content.form.input_confirm.label[lang]}
                            type="password"
                            id="password"
                            placeholder={content.form.input_confirm.placeholder[lang]}
                            onBlur={this.validateField} 
                            autoComplete="current-password"
                        />                    
                    </Row>
                    <Row className="inscription-input" style={style.text}>
                        <Collapse in={fieldValidationErrors.confirm}>
                            <div id="example-collapse-text">
                                <Alert  variant="danger">
                                {content.error.confirm[lang]}
                                </Alert>
                            </div>
                        </Collapse>
                    </Row>
                    <Row className="inscription-input" style={style.text}>
                        {/* <InpusField
                        error={fieldValidationErrors.villeError}
                        placeholder={content.form.input_ville.placeholder[lang]}
                        label={content.form.input_ville.label[lang]} 
                        Icone={FaCity}
                        required={true}
                        name="ville"
                        InputLabelProps={style.inputLabel}
                        onBlur={this.validateField} 
                        value={ville}
                        onChange={this.handleChange} /> */}
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">ville</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={ville}
                            name="ville"
                            required={true}
                            onChange={this.handleChange}
                            >
                                {villes.map(((ville, index) =>
                                        <MenuItem key={index} value={ville.name}>{ville.name}</MenuItem>
                                        ))
                                }
                            
                            
                            </Select>
      </FormControl>  
                    </Row>
                    <Row className="inscription-input" style={style.text}>
                        <Collapse in={donneIncorecte}>
                            <div id="example-collapse-text">
                                <Alert  variant="danger">
                                    {content.error.generale[lang]}
                                </Alert>
                            </div>
                        </Collapse>
                        <Collapse in={success}>
                            <div id="example-collapse-text">
                                <Alert  variant="success">
                                    {content.validation[lang]}
                                </Alert>
                            </div>
                        </Collapse>
                    </Row>
                    <Row className="align-items-center justify-content-around mt-4">
                        <Button success={success} type="submit" icone={MdPersonAdd} sending={sending} valeur={content.form.button[lang]} />
                    </Row>
                </Col>
            </form>
            </ThemeProvider>
    );

}
}


let content = {
    title:{fr:"Bienvenue sur Pelia !", ar:"مرحبًا بك! Pelia!"},
    body:{
        fr:"vous ne savez pas de quoi il s'agit? vous êtes pérdu ? vous pouvez toujours allez à la page d'accueil pour voir les discréption des fonctionnalitées qu'on propose à nos utilisateurs.", 
        ar:"أنت لا تعرف من نحن؟ هل انت تائه وغير متيقن من تسجيلك؟ يمكنك دائمًا الانتقال إلى الصفحة الرئيسية لمعرفة الميزات التي نقدمها لمستخدمينا."
    },
    button:{fr:"voir la description", ar:"انظر الوصف"},
    form:{
        title:{fr:"Inscription à la plateforme Pelia", ar:"التسجيل في منصة Pelia"},
        subtitle:{fr:"En nous rejoignant, vous aurez l'occasion de contribuer à aider l'humanité durant cette période difficile",
         ar:"من خلال الانضمام إلينا، ستتاح لك الفرصة للمساهمة في مساعدة البشرية خلال هذه الفترة الصعبة"},
        input_nom:{
            label:{fr:"nom", ar:"الاسم"},
            placeholder:{fr:"BERRADA", ar:"برادة"}
        },
        input_prenom:{
            label:{fr:"prénom", ar:"الاسم الأول"},
            placeholder:{fr:"Nabil", ar:"عمر"}
        },
        input_numero:{
            label:{fr:"numéro de téléphone", ar:"رقم الهاتف"}
        },
        input_email:{
            label:{fr:"email", ar:"البريد الإلكتروني"},
            placeholder:{fr:"abcd@exemple.ma", ar:"abcd@exemple.ma"}
        },
        input_ville:{
            label:{fr:"ville", ar:"المدينة"},
            placeholder:{fr:"youssoufia", ar:"اليوسفية"}
        },
        input_password:{
            label:{fr:"mot de passe", ar:"كلمة السر"},
            placeholder:{fr:"***", ar:"***"}
        },
        input_confirm:{
            label:{fr:"confirmer votre mot de passe", ar:"أكد  كلمة السر"},
            placeholder:{fr:"***", ar:"***"}
        },
        button:{fr:"s'inscrire", ar:"تسجيل"}
    },
    error:{
        nom:{fr:"vous devez entrer votre nom et doit contenir au moins 2 caractére", ar:"يجب إدخال اسمك ويجب أن يحتوي على حرفين على الأقل"},
        prenom:{fr:"vous devez entrer votre prenom et doit contenir au moins 3 caractére", ar:"يجب إدخال اسمك الأول ويجب أن يحتوي على 3 أحرف على الأقل"},
        phone:{fr:"le numéro de telephone doit contenir 12 chiffres y compris +212 au début", ar:"يجب أن يحتوي رقم الهاتف على 12 رقمًا بما في ذلك +212 في البداية"},
        email:{fr:"Vous devez saisir une adresse e-mail valide au format standard" , ar:"يجب إدخال عنوان بريد إلكتروني صالح و بالشكل الموحد"},
        generale:{fr:"Une erreur est survenue lors de votre inscription, merci de réessayer ultérieurement.", ar:"حدث خطأ أثناء التسجيل ، يرجى المحاولة مرة أخرى في وقت لاحق."},
        password:{fr:"le mot de passe doit contenir au moins 8 caractère ", ar:"يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل"},
        confirm:{fr:"les mot de pass ne sont pas identique", ar:"كلمات السر ليست متطابقة"}
    },
    validation:{fr:"vos information sont ajouté avec succès", ar:"تم إضافة معلوماتك بنجاح"}
}

const villes = [
    { name: 'casablanca', isActive:  true},
    { name: 'El jadida', isActive: true },
    { name: 'Safi', isActive: true },
    { name: 'Youssoufia', isActive: true },
    { name: 'khribga', isActive: true },
    { name: "Laayoune", isActive: true }
  ];