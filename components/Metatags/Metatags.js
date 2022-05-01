import Head from "next/head"

export default function Metatags(props){

    return (
        <Head>
            <title>{props.title || 'NotescroLL'}</title>
        </Head>
    )

}