import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import resStyle from '../../styles/pages/results.module.css'
import Post from '../../components/post/Post'
import { useQuery } from '@apollo/react-hooks'
import { SEARCH_POSTS } from '../../src/schemas/queries'
import { addPosts } from '../../redux/reducers/posts'
import Link from 'next/link'
import Loading from '../../components/Loading'
import { palletteGenerator } from '../../src/functions/functions'
import { toggleStretchLayout } from '../../redux/reducers/stretchLayout'
import { setEventSearch } from '../../redux/reducers/eventSearch'
import {bindActionCreators} from 'redux'
import {withRouter} from 'next/router'
import Layout from '../../components/Layout'
import Head from 'next/head'

const Results = withRouter((props) => {
    if (typeof window === 'undefined') return <h1 className={resStyle.test}>rendering</h1>
    else {
        const currentIds = props.posts ? props.posts.map(p => p._id) : []
        const [scrollAtBottom, setScrollAtBottom] = useState(false)
        const decodedSearch = decodeURIComponent(props.router.query.searchQuery) === 'all' ? '' : decodeURIComponent(props.router.query.searchQuery)
        const SPQuery = useQuery(SEARCH_POSTS, {
            variables: {
                filterString: decodedSearch,
                postIds: currentIds,
                eventQuery: props.eventSearch,
            }
        })
        const moreResults = () => {
            if (SPQuery.data && SPQuery.data.searchPosts === null) {
                return false
            }
            return true
        }
        if ((window.innerHeight + window.scrollY) > (document.body.offsetHeight - 100) && !scrollAtBottom) {
            setScrollAtBottom(true)
        }
        if ((window.innerHeight + window.scrollY) <= (document.body.offsetHeight - 100) && scrollAtBottom) {
            setScrollAtBottom(false)
        }
        const triggerWhenScroll = () => {
            if ((window.innerHeight + window.scrollY) > (document.body.offsetHeight - 100) && !scrollAtBottom) {
                setScrollAtBottom(true)
            }
            if ((window.innerHeight + window.scrollY) <= (document.body.offsetHeight - 100) && scrollAtBottom) {
                setScrollAtBottom(false)
            }
        }
        window.addEventListener('scroll', triggerWhenScroll, false)

        const postChangeConditions = (query, reducer) => {
            if (!scrollAtBottom) return false
            if (!query) return false
            if (!query.searchPosts) return false
            if (!reducer) {
                return true
            }
            const queryTitles = query.searchPosts.map(i => i.title)
            const reducerTitles = reducer.map(i => i.title)
            for (const title of queryTitles) {
                if (!reducerTitles.includes(title)) {
                    return true
                }
            }
            return false
        }
        const postsSearched = postChangeConditions(SPQuery.data, props.posts) ?
            SPQuery.data.searchPosts : null
        useEffect(() => {
            if (postsSearched && !props.posts) {
                props.addPosts(SPQuery.data.searchPosts)
                setScrollAtBottom(false)
            }
            if (postsSearched && props.posts) {
                if (postsSearched.length > 0) {
                    if (!props.posts.map(p => p._id).includes(postsSearched[0]._id)){
                        props.addPosts(SPQuery.data.searchPosts)
                        setScrollAtBottom(false)
                    }
                }
            }
        }, [SPQuery, props.addPosts, props, postsSearched])
        if (!props.posts && !SPQuery.data) {
            return (
                <div>
                    <div style={{height: '5vh'}}/>
                    <Loading />
                </div>
            )
        }
        const eventQuery = props.eventSearch
        const eventKeys = () => {
            if (eventQuery === 'COVID-19') {
                return ['covid', 'coronavirus', 'outbreak', 'virus', 'emergency response']
            }
            if (eventQuery === '2020 Election') {
                return ['election', 'democrat', 'republican', 'vote']
            }
            return null
        }
        const postToShow = (post) => {
            if (eventKeys()) {
                for (const keyWord of eventKeys()) {
                    if (post.description.toLowerCase().includes(keyWord) || post.title.toLowerCase().includes(keyWord)) {
                        if (post.title.toLowerCase().includes(decodedSearch.toLowerCase())) return true
                    }
                }
                return false
            }
            if (post.title.toLowerCase().includes(decodedSearch.toLowerCase())) return true
            for (const skill of post.skillNames) {
                if (decodedSearch.includes(skill)) return true
            }
            return false
        }
        const postsArray = props.posts ? props.posts.filter(p => postToShow(p)) : []
        const postsToShow = postsArray ?  postsArray.map(p => <Post stretch={props.stretchLayout} key={`post${p._id}`} post={p} />) : []
        const pallette = palletteGenerator('rgb(40,40,40)').colorPallette
        const layoutBtnClass= props.stretchLayout ? resStyle.layoutButtonGrid : resStyle.layoutButtonStretch
        const layoutClass = !props.stretchLayout ? resStyle.resultsContentGrid : resStyle.resultsContentStretch
        
        const eventsList = [
            {name: 'COVID-19', color: 'rgb(237,32,40)', iconB: '/svg/events/virusB.svg', iconW: '/svg/events/virusW.svg', iconC: '/svg/events/virusC.svg'},
            {name: '2020 Election', color: 'rgb(255,0,255)', iconB: '/svg/events/usaB.svg', iconW: '/svg/events/usaW.svg', iconC: '/svg/events/usaC.svg'} 
        ]
        const eventsHTML = eventsList.map(e => e.name === props.eventSearch ? 
            <div className={resStyle.eventSelected} onClick={() => props.setEventSearch(null)} style={{borderColor: e.color, backgroundColor: e.color}} key={`EV${e.name}`}>
                <img src={e.iconW} className={resStyle.eventImage} alt={e.name} />
                <h3 className={resStyle.eventText}>{e.name}</h3>
            </div>
            :
            <div className={resStyle.event} onClick={() => props.setEventSearch(e.name)} style={{borderColor: e.color, color: e.color}} key={`EV${e.name}`}>
                <img src={e.iconC} className={resStyle.eventImage} alt={e.name} />
                <h3 className={resStyle.eventText}>{e.name}</h3>
            </div>
        )
        const eventsContainerClass = props.eventSearch ? resStyle.ECActive : null
        const showLoading = moreResults() ? <Loading /> : <h3 style={{opacity: '0.8'}}>no more posts</h3>
        const titlesString = postsArray.map(p => p.title).join(', ')
        return (
            <Layout>
                <Head>
                    <title>Browse for projects in Unilous</title>
                    <meta property="og:title" content="Browse for projects in Unilous" key="title" />
                    <meta property="og:description" content={`Unilous projects: ${titlesString}.`} key="description" />
                    <meta name="twitter:title" content="Browse for projects in Unilous" key="title"/>
                    <meta name="description" content={`Unilous projects: ${titlesString}.`} key="description"/>
                </Head>
                <div className="home-wrapper">
                    <div className={resStyle.resultsContainer}>
                        <Link href="/PostFormPage" >
                            <a className={`${resStyle.formContainerExpand} standard-hover neutralize-link`} title="add post">
                                <img className={resStyle.formExpandIcon} src="/svg/plusW.svg" alt="team up" />
                            </a>
                        </Link>
                        <div className="navbar-height"/>
                        <h2 className={resStyle.secondaryTitle}>events</h2>
                        <div className={`${resStyle.eventsContainer} ${eventsContainerClass}`}>
                            {eventsHTML}
                        </div>
                        <div onClick={() => props.toggleStretchLayout(!props.stretchLayout)} className={resStyle.layoutWrapper}>
                            <div className={resStyle.layoutContainer}>
                                <div className={`layoutButton ${layoutBtnClass}`} >
                                    <div className={resStyle.layoutBox}/>
                                    <div className={resStyle.layoutBox}/>
                                    <div className={resStyle.layoutBox}/>
                                    <div className={resStyle.layoutBox}/>
                                </div>
                            </div>
                        </div>
                        <div />
                        <div className={`resultsContent ${layoutClass}`}>
                            {postsToShow}
                            {/* {props.posts.map(p => <h1>{p.title}</h1>)} */}
                        </div>
                        <div style={{position: 'relative', height: '400px'}}>
                            {showLoading}
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
})

// const mapStateToProps = (state) => {
// 	return {
//         posts: state.posts,
//         search: state.search,
//         stretchLayout: state.stretchLayout,
//         eventSearch: state.eventSearch,
// 	}
// }
// export default connect(
//     mapStateToProps,
//     { addPosts, toggleStretchLayout, setEventSearch }
// )(Results)

const mapStateToProps = (state) => {
	return {
        posts: state.posts,
        stretchLayout: state.stretchLayout,
        eventSearch: state.eventSearch,
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        addPosts: bindActionCreators(addPosts, dispatch),
        toggleStretchLayout: bindActionCreators(toggleStretchLayout, dispatch),
        setEventSearch: bindActionCreators(setEventSearch, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Results)