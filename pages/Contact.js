import React from 'react'
import { Link } from 'next/link'
import contStyle from '../styles/pages/contact.module.css'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import {setToken} from '../redux/reducers/token'
import {FIND_USER, ALL_POSTS} from '../src/schemas/queries'
import {apolloClient} from '../lib/apollo'
import Contributer from '../components/Contributer'
import Layout from '../components/Layout'
import Head from 'next/head' 

const Contact = (props) => {

    return (
        <Layout>
            <Head>
                <title>Contact | Unilous</title>
                <meta property="og:image" content="https://i.imgur.com/6z9eNzV.png" />
                <meta property="og:title" content="Contact | Unilous" key="title" />
                <meta name="description" key="description" content="Contact the Unilous team" />
                <meta property="og:description" key="description" content="Contact the Unilous team" key="og-description" />
                <meta name="twitter:title" content="Contact the Unilous team" key="twitter-title"/>
            </Head>            
            <div className="navbar-height" />
            <div className={contStyle.contactsContainer}>
                <Contributer
                    name="Sebastian Sosa"
                    link="/user/SebastianSosa"
                    image="https://i.imgur.com/zgwIwOS.png"
                    position="founder, full stack developer"
                    email="1sebastian1sosa1@gmail.com"
                    phone="+1 786-270-7297"
                />
                <Contributer
                    name="Umyarov Mikhail"
                    link="/user/nesutortik"
                    image="https://i.imgur.com/ew81eQe.png"
                    position="UI/UX designer"
                    email="silverusdragonitos@yandex.ru"
                    phone="+7 952-156-96-49"
                />
            </div>
        </Layout>
    )
}

const mapStateToProps = (state) => {
	return {
        
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}

export default Contact