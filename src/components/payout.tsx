import React from 'react'
import { useForm } from 'react-hook-form'
import Web3 from 'web3'
import Button from './button'

interface Window {
    ethereum: any
}

interface Props {}

const Payout: React.FC<Props> = ({}) => {
    const referrers: {
        ethAddress: string
        amount: number
        handle: string
    }[] = []
    const { register, handleSubmit } = useForm()
    const onSubmit = handleSubmit(async () => {
        // @ts-ignore
        const ethereum: any = window.ethereum
        if (!ethereum) {
            alert('Metamask not installed')
        }
        const web3 = new Web3(ethereum)
        const accounts = await ethereum.enable()
        const account = accounts[0]
        console.log(account)

        for (const referrer of referrers) {
            web3.eth
                .sendTransaction({
                    from: account,
                    to: referrer.ethAddress,
                    value: Web3.utils.toWei(referrer.amount + '', 'ether'),
                })
                .on('transactionHash', async hash => {
                    console.log(hash)
                })
        }
    })

    return (
        <section className="bg-white rounded-lg p-10 max-w-md border border-gray-100 space-y-8">
            <h1 className="heading-3">Pay refferers</h1>
            <p className="paragraph">Work in progress</p>
            <form onSubmit={onSubmit}>
                <Button type="submit">Pay</Button>
            </form>
        </section>
    )
}

export default Payout
