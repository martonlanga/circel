import React from 'react'
import HowItWorks from '../components/how-it-works'
import Layout from '../components/layout'

const AboutPage = () => {
    return (
        <Layout>
            <section className="max-w-xl mx-auto my-20">
                <h1 className="heading-1">About</h1>
                <p className="paragraph mt-5">
                    Circel was created for the{' '}
                    <a
                        href="https://github.com/balajis/twitter-export"
                        className="teal-link"
                        target="_blank"
                    >
                        twitter-export
                    </a>{' '}
                    challenge. It is fully{' '}
                    <a
                        href="https://github.com/martonlanga/circel"
                        className="teal-link"
                        target="_blank"
                    >
                        open source
                    </a>
                    . Made by{' '}
                    <a
                        href="https://twitter.com/martonlanga"
                        className="teal-link"
                        target="_blank"
                    >
                        @martonlanga
                    </a>
                    .
                </p>
            </section>
            <HowItWorks />
            <section id="terms" className="max-w-xl mx-auto my-20">
                <h1 className="heading-1">Terms</h1>
                <p className="paragraph mt-5">
                    Circel stores your Twitter tokens in a database. This is
                    required for sending messages to your followers
                    periodically. Learn more about how Circel works on{' '}
                    <a
                        href="https://github.com/martonlanga/circel"
                        className="teal-link"
                        target="_blank"
                    >
                        Github
                    </a>
                    .
                </p>
            </section>
        </Layout>
    )
}

export default AboutPage
