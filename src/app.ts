/** @format */

import React, {useEffect} from 'react'
import {useUser} from '@/src/stores/user'
import {useAdaptNative} from '@/src/utils/adapt-native'
import './app.scss'

interface Props {
    children: React.ReactNode
}

function App(props: Props) {
    const getUser = useUser(state => state.getUser)
    // polyfill native
    useAdaptNative()

    useEffect(() => {
        getUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return props.children
}

export default App
